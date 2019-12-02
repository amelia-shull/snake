docker rm -f client

docker pull kateks/client
docker run -d \
-p 80:80 \
-p 443:443 \
--name client \
-v /etc/letsencrypt/:/etc/letsencrypt/:ro \
-e TLSCERT=/etc/letsencrypt/live/snake.katekaseth.me/fullchain.pem \
-e TLSKEY=/etc/letsencrypt/live/snake.katekaseth.me/privkey.pem \
--restart unless-stopped \
kateks/client