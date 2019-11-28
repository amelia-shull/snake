sudo service docker start

docker rm -f snake-server
docker system prune --all -f
docker system prune --volumes -f

docker pull kateks/snake-server

docker run -d --name snake-server \
-p 443:443 \
-p 80:80 \
-v /etc/letsencrypt/:/etc/letsencrypt/:ro \
-e TLSCERT=/etc/letsencrypt/live/katekaseth.me/fullchain.pem \
-e TLSKEY=/etc/letsencrypt/live/katekaseth.me/privkey.pem \
kateks/snake-server