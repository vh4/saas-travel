## Running (IMPORTANT)

- npm install --force (tambahkan force)
- npm run build (wajib di builder)
- pm2 start "npx serve -s build -p 1111" --name "Travel Frontend React.js v1"

## Requirements

- NPM npm version 9.6.7 / npx version  9.6.7
- NODE v18.17.0
- npx serve 14.2.1

## Noted

- Pada file .env variable REACT_APP_HOST_API di sesuaikan pada ip / domain backendnya. 
- REACT_APP_SECTRET_LOGIN_API samakan yang existing.

&nbsp;
## Endpoint
- [x] Prod saas-travel-frontend@h2htravel01 --> [10.9.43.5:9003](https://10.9.43.5:9003)
- [x] Staging saas-travel-frontend-staging@h2htravel01 --> [10.9.43.5:9004](https://10.9.43.5:9004)

## Logs
- [x] [Dashboard saas-travel-frontend prod](https://log-h2h.rotit.art/app/r/s/calm-itchy-portugal)
- [x] [Dashboard saas-travel-frontend staging](https://log-h2h.rotit.art/app/r/s/billions-plain-nest)

> ## Sonarqube
> - [saas-travel](https://sonarqube.rotit.art/dashboard?id=saas-travel)