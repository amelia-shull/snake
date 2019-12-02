docker build -t kateks/client .
docker push kateks/client

ssh ec2-user@ec2-44-228-61-196.us-west-2.compute.amazonaws.com < deploy_commands.sh