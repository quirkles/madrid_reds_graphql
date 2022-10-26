cd ..
docker build -t madrid-reds-gql:local . --build-arg ENVIRONMENT="dev" --build-arg DATABASE_HOST="host.docker.internal"
