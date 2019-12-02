docker build -t kateks/client .
docker rm -f client
docker run -d -p 3001:3000 --name client kateks/client