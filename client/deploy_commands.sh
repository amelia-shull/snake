sudo service docker start

docker rm -f client
docker system prune --all -f
docker system prune --volumes -f

docker pull kateks/client
docker run -d \
-p 80:80 \
-p 443:443 \
--name client \
-v /etc/letsencrypt/:/etc/letsencrypt/:ro \
-e TLSCERT=/etc/letsencrypt/live/retrosnake.me/fullchain.pem \
-e TLSKEY=/etc/letsencrypt/live/retrosnake.me/privkey.pem \
kateks/client