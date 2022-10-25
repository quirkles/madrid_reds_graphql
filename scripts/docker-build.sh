cd ..
docker build -t madrid-reds-gql:local . --build-arg ENVIRONMENT="local" --build-arg DATABASE_HOST="host.docker.internal"
