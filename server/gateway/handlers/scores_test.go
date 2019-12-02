package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"reflect"
	"snake/server/gateway/sessions"
	"snake/server/gateway/users"
	"testing"
	"time"
)

/*
Test works for an older version of scores.go
*/

func TestPostScores(t *testing.T) {
	ctx := getContextHandler()
	sid, user := GetSID(ctx, t)
	cases := []struct {
		method    string
		getBuffer func() *bytes.Buffer
		expCode   int
		auth      bool
	}{
		{
			"PATCH",
			nil,
			http.StatusMethodNotAllowed,
			true,
		},
		{
			"POST",
			nil,
			http.StatusUnauthorized,
			false,
		},
		{
			"POST",
			func() *bytes.Buffer {
				validScore := &users.Score{
					Score:   100,
					UserID:  int(user.ID),
					Created: time.Now(),
				}
				validBody, _ := json.Marshal(validScore)
				return bytes.NewBuffer(validBody)
			},
			http.StatusOK,
			true,
		},
		{
			"POST",
			func() *bytes.Buffer {
				invalidScore := &users.Score{
					Score: 100,
				}
				invalidBody, _ := json.Marshal(invalidScore)
				return bytes.NewBuffer(invalidBody)
			},
			http.StatusBadRequest,
			true,
		},
	}

	for _, c := range cases {
		w := httptest.NewRecorder()
		var r *http.Request
		if c.getBuffer == nil {
			r, _ = http.NewRequest(c.method, "", nil)
		} else {
			r, _ = http.NewRequest(c.method, "", c.getBuffer())
		}
		if c.auth {
			r.Header.Add("Authorization", "Bearer "+string(sid))
		}
		r.Header.Set("Content-Type", "application/json")
		ctx.ScoresHandler(w, r)
		if w.Code != c.expCode {
			t.Errorf("incorrect response status code: expected %d but got %d", c.expCode, w.Code)
		}
	}
}

func TestGetScores(t *testing.T) {
	ctx := getContextHandler()
	sid, user := GetSID(ctx, t)
	timeNow, _ := time.Parse("2006-01-02T15:04:05Z", "2019-11-28T11:45:26Z")
	scores := []users.Score{
		users.Score{
			Score:  1,
			UserID: 8,
		},
		users.Score{
			Score:   100,
			UserID:  int(user.ID),
			Created: timeNow.Add(time.Minute * time.Duration(1)),
		},
		users.Score{
			Score:   300,
			UserID:  int(user.ID),
			Created: timeNow.Add(time.Minute * time.Duration(2)),
		},
		users.Score{
			Score:   400,
			UserID:  int(user.ID),
			Created: timeNow.Add(time.Minute * time.Duration(3)),
		},
		users.Score{
			Score:   500,
			UserID:  int(user.ID),
			Created: timeNow.Add(time.Minute * time.Duration(4)),
		},
		users.Score{
			Score:   200,
			UserID:  int(user.ID),
			Created: timeNow.Add(time.Minute * time.Duration(5)),
		},
	}
	for _, s := range scores {
		ctx.UserStore.InsertScore(&s)
	}
	validURL := "/scores/1"
	topScoresURL := validURL + "?top=2"
	recentScoresURL := validURL + "?recent=2"
	cases := []struct {
		url            string
		expectedScores []users.Score
		expCode        int
	}{
		{
			validURL,
			scores[1:],
			http.StatusOK,
		},
		{
			topScoresURL,
			[]users.Score{
				users.Score{
					Score:   500,
					UserID:  int(user.ID),
					Created: timeNow.Add(time.Minute * time.Duration(4)),
				},
				users.Score{
					Score:   400,
					UserID:  int(user.ID),
					Created: timeNow.Add(time.Minute * time.Duration(3)),
				},
			},
			http.StatusOK,
		},
		{
			recentScoresURL,
			[]users.Score{
				users.Score{
					Score:   200,
					UserID:  int(user.ID),
					Created: timeNow.Add(time.Minute * time.Duration(5)),
				},
				users.Score{
					Score:   500,
					UserID:  int(user.ID),
					Created: timeNow.Add(time.Minute * time.Duration(4)),
				},
			},
			http.StatusOK,
		},
	}

	for _, c := range cases {
		w := httptest.NewRecorder()
		r, err := http.NewRequest("GET", c.url, nil)
		if err != nil {
			t.Fatalf("%s", err)
		}
		r.Header.Set("Content-Type", "application/json")
		r.Header.Add("Authorization", "Bearer "+string(sid))
		ctx.ScoresHandler(w, r)
		if w.Code != c.expCode {
			t.Errorf("incorrect response status code: expected %d but got %d", c.expCode, w.Code)
		}
		// make sure the new user struct has an id property of 1
		receivedScores := []users.Score{}
		dec := json.NewDecoder(w.Body)
		if err := dec.Decode(&receivedScores); err != nil {
			t.Errorf("Cannot decode response body into user struct")
		}
		if !scoreArrayEquals(receivedScores, c.expectedScores) {
			t.Errorf("Expected: %v Recieved: %v", c.expectedScores, receivedScores)
		}
	}
}

func scoreArrayEquals(actual []users.Score, expected []users.Score) bool {
	for i, scoreA := range actual {
		if !reflect.DeepEqual(scoreA, expected[i]) {
			return false
		}
	}
	return true
}

func GetSID(ctx *HandlerContext, t *testing.T) (sessions.SessionID, *users.User) {
	_, _ = ctx.UserStore.Db.Exec("delete from users")
	// reset user ID or test cases fail
	_, _ = ctx.UserStore.Db.Exec("alter table users AUTO_INCREMENT = 1")
	// delete all existing scores
	_, _ = ctx.UserStore.Db.Exec("delete from scores")
	// reset score IDs
	_, _ = ctx.UserStore.Db.Exec("alter table scores AUTO_INCREMENT = 1")

	validNewUser := &users.NewUser{
		Password:     "password",
		PasswordConf: "password",
		UserName:     "username",
	}
	user, _ := validNewUser.ToUser()
	user, err := ctx.UserStore.Insert(user)
	if err != nil {
		t.Fatalf("Error inserting to database")
	}
	// begin a new session
	sessionState := &SessionState{
		Time: time.Now(),
		User: user,
	}
	sid, err := sessions.BeginSession(ctx.SigningKey, ctx.SessionStore, sessionState, httptest.NewRecorder())
	if err != nil {
		t.Fatalf("Error beginning sessions")
	}
	return sid, user
}
