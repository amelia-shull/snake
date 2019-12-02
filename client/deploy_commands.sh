docker rm -f client

docker pull kateks/client
docker run -d \
-p 80:80 \
--name client \
-v /etc/letsencrypt/:/etc/letsencrypt/:ro \
--restart unless-stopped \
kateks/client