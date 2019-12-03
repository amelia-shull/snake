CGO_ENABLED=0 go build
docker build -t kateks/snake-server .
docker push kateks/snake-server
go clean

cd ../db
docker build -t kateks/user-store .
docker push kateks/user-store