# Conchboards
Conchboards is a platform that allows users to create, share and discover soundboards. Built for fun!

## Features
* Full-stack application including a fully documented [REST API](api-docs/README.md) used by the Web App and iOS App
* Custom user authentication and verification system
* Ability to create, share, and favorite soundboards
* Ability to report inappropriate soundboards
* Admin panel functionality used to delete inappropriate soundboards and ban malicious users

## Technologies
* Web App:
    * Angular 6 + Universal
    * TypeScript
    * HTML5, CSS3, Bootstrap
* REST API & Server:
    * NodeJS
    * MongoDB
* iOS App:
    * Swift 4
    * Objective-C
* Hosted Using:
    * Digital Ocean
    * Nginx
    * PM2
* Other Tools:
    * Xcode
    * VSCode

## API
* [API Documentation](api-docs/README.md)

## Links
* [Web App](https://conchboards.com)
* [iOS App](https://itunes.apple.com/us/app/conchboards/id1437095131?mt=8)

# Local Build & Install Instructions

## Run & Install Server
* Create following environment variables
```
PORT = <SERVER_PORT>
IP = <SERVER_IP>
RECAPTCHA_SECRET = <GOOGLE_RECAPTCHA_SECRET>
JWT_SECRET = <ANY_SHA_256_HASH>
```
* Make sure mongodb is installed and run mongod in a new terminal window
* Run the following in a new terminal window
``` 
cd ./soundboardplatform/soundboard-server
node node-server.js
```
* Test by navigating to http://<SERVER_IP>:<SERVER_PORT>/ in a browser

## Run & Install Webapp
* Configure soundboard-webapp\src\environments\environment.ts properly for your system
* Run the following in a new terminal window
```
cd ./soundboardplatform/soundboard-webapp
ng serve --port 4200
```
* Test by navigating to http://localhost:4200/ in a browser

## Run & Install iOS app
* Install all 3rd party Pods by running the following in a new terminal window
```
cd ./soundboardplatform/soundboard-ios/Conchboards
pod install
```
* Using Xcode to open the project in the dir, build and run the app on any iOS device simulator

