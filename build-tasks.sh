if [ -d "frontend/build" ]; then rm -Rf frontend/build; fi
NPM_CONFIG_PRODUCTION=false npm install --prefix frontend && npm run build
