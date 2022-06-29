# Design Thinking Workshop Web front- and backend

This is the full source code for a website built for the Design Thinking Workshop 2022  
  
The Website is built with Nodejs, docker(-compose) and uses a Mariadb Database in the backend

## Prerequires:
If using docker:
- docker with docker-compose  

Without docker:
- nodejs
- mysql or mariadb database


## Setup:
- Clone Repository
- Copy .env.example into .env and change values accordingly

If using Docker:
- docker-compose build && docker-compose up -d

- To generate Placeholder Data and Users:
	- docker exec -it design-thinking-webservice_web_1 sh
	- For Fake Orders: npm run seedOrders
	- For Users: npm run seedUsers 

Without Docker:
- npm install
- node index.js
- To generate Placeholder Data and Users:
	- For Fake Orders: npm run seedOrders
	- For Users: npm run seedUsers 


## Add new languages:
Frontend:  
- create new language file under frontend/lang and name it \<language\>.json
- go to frontend/statics/setupPage.js and frontend/statics/cp/setupPage.js and add the file name without .json under ```js function getCurrentLanguage() in const allowedlangauge```
- add the new language option in frontend/statics/templates/footer.html and frontend/statics/templates/cp/footer.html in the language select
  
Backend:
- create new language file under api/util/lang and name it \<language\>.json
- go to api/util/lang/translator.js and add the file name without .json under ```js function returnTranslation() in const allowedlangauge```