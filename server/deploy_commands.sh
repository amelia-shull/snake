sudo service docker start

docker rm -f snake-server

# below is commented out so we don't overwrite the databases

# docker rm -f user-store
# docker rm -f redisServer
# docker network rm server-net
# docker system prune --all -f
# docker system prune --volumes -f

# docker network create server-net

# docker pull kateks/user-store
# docker run -d \
# --name user-store \
# --network server-net \
# -e MYSQL_ROOT_PASSWORD="sqlpassword" \
# -e MYSQL_DATABASE=users \
# kateks/user-store

# docker run -d --network server-net --name redisServer redis

docker pull kateks/snake-server
docker run -d --name snake-server \
-p 443:443 \
--network server-net \
-v /etc/letsencrypt/:/etc/letsencrypt/:ro \
-e TLSCERT=/etc/letsencrypt/live/snakeapi.katekaseth.me/fullchain.pem \
-e TLSKEY=/etc/letsencrypt/live/snakeapi.katekaseth.me/privkey.pem \
--restart unless-stopped \
kateks/snake-server