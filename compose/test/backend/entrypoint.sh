#!/bin/bash

# if any of the commands in your code fails for any reason, the entire script fails
set -o errexit
# fail exit if one of your pipe command fails
set -o pipefail
# exit if any of your variables is not set
set -o nounset

mongo_ready() {
    nc -z ${DB_HOST} ${DB_PORT}
}
until mongo_ready; do
    >&2 echo 'Waiting for MongoDB to become available...'
    sleep 1
done
>&2 echo 'MongoDB is available'

exec "$@"
