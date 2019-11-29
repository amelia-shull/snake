package handlers

import (
	"encoding/json"
	"net/http"
	"snake/server/gateway/sessions"
	"snake/server/gateway/users"
	"strconv"
	"strings"
)

// ScoresHandler will handle POST requests to /scores/:userID to store the score in request
// body. It also handles GET requests to /scores/:userID to get all of the user's score.
// GET requests can accept two queries:
// 		?top=n  :  encodes the top n scores
//		?recent=n  :  encodes n most recent scores
func (ctx *HandlerContext) ScoresHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" && r.Method != "GET" {
		http.Error(w, "Method must be POST", http.StatusMethodNotAllowed)
		return
	}
	// check if current user is authenticated; return status unauthorized if not
	sessionState := &SessionState{}
	_, err := sessions.GetState(r, ctx.SigningKey, ctx.SessionStore, sessionState)
	if err != nil {
		http.Error(w, "User not authenticated", http.StatusUnauthorized)
		return
	}

	if r.Method == "POST" {
		if !strings.HasPrefix(r.Header.Get("Content-Type"), "application/json") {
			http.Error(w, "Request body must be in JSON", http.StatusUnsupportedMediaType)
			return
		}

		if r.Body == nil {
			http.Error(w, "Request is nil", http.StatusUnsupportedMediaType)
			return
		}

		score := &users.Score{}
		dec := json.NewDecoder(r.Body)
		if err := dec.Decode(score); err != nil {
			http.Error(w, "Decoding failed", http.StatusBadRequest)
			return
		}
		score, err := ctx.UserStore.InsertScore(score)
		if err != nil {
			http.Error(w, "Can't insert to store", http.StatusBadRequest)
			return
		}
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("score added successfully"))
	} else {
		// get the url path and make sure it's valid
		url := r.URL.Path
		if !strings.HasPrefix(url, "/scores/") {
			http.Error(w, "Bad url", http.StatusBadRequest)
			return
		}
		// get the userID
		var userID int
		// get user id from the url path
		id, err := strconv.Atoi(url[len("/scores/") : len("/scores/")+1])
		if err != nil {
			http.Error(w, "Bad user id", http.StatusBadRequest)
			return
		}
		userID = id

		// get the scores based on what query is given
		topN := r.URL.Query().Get("top")
		recentN := r.URL.Query().Get("recent")
		var scores *[]users.Score
		if topN == "" && recentN == "" {
			// return all scores
			scores, err = ctx.UserStore.GetAllScoresByUserID(userID)
			if err != nil {
				http.Error(w, "Error getting scores", http.StatusInternalServerError)
				return
			}
		} else if topN != "" {
			n, err := strconv.Atoi(topN)
			if err != nil {
				http.Error(w, "Bad number", http.StatusBadRequest)
				return
			}
			// return top n scores
			scores, err = ctx.UserStore.GetTopNScoresByUserID(userID, n)
			if err != nil {
				http.Error(w, "Error getting scores", http.StatusInternalServerError)
				return
			}
		} else {
			n, err := strconv.Atoi(recentN)
			if err != nil {
				http.Error(w, "Bad number", http.StatusBadRequest)
				return
			}
			// return 5 recent scores
			scores, err = ctx.UserStore.GetNRecentScoresByUserID(userID, n)
			if err != nil {
				http.Error(w, "Error getting scores", http.StatusInternalServerError)
				return
			}
		}
		scoresBytes, err := json.Marshal(scores)
		if err != nil {
			http.Error(w, "Error getting scores", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(scoresBytes)
	}
}
