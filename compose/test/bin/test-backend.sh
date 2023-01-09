#!/bin/bash
docker-compose -f docker-compose.test.yml exec -it backend npm run test-backend
