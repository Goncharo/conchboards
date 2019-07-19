# Conchboards
Conchboards is a soundboard platform built for the same reason as its intended use; for fun!

## Features
* full-stack application including a fully documented [REST API](api-docs/README.md) used by the Web App and iOS App
* custom user authentication and verification system
* ability to create, share, and favorite soundboards
* ability to report inappropriate soundboards
* admin panel functionality used to delete inappropriate soundboards and ban malicious users

## Technologies
* Web App:
** Angular 6 + Universal
** TypeScript
** HTML5, CSS3, Bootstrap
* REST API & Server:
** NodeJS
** MongoDB
* iOS App:
** Swift 4
** Objective-C
* Hosted Using:
** Digital Ocean
** Nginx
** PM2

## API
* [API Documentation](api-docs/README.md)

# Local Build & Install Instructions

## Run & Install Server
* create following environment variables
```
PORT = <SERVER_PORT>
IP = <SERVER_IP>
RECAPTCHA_SECRET = <GOOGLE_RECAPTCHA_SECRET>
JWT_SECRET = <ANY_SHA_256_HASH>
```
* make sure mongodb is installed and run mongod in a new terminal window
* run the following in a new terminal window
``` 
cd ./soundboardplatform/soundboard-server
node node-server.js
```
* test by navigating to http://<SERVER_IP>:<SERVER_PORT>/ in a browser

## Run & Install Webapp
* configure soundboard-webapp\src\environments\environment.ts properly for your system
* run the following in a new terminal window
```
cd ./soundboardplatform/soundboard-webapp
ng serve --port 4200
```
* test by navigating to http://localhost:4200/ in a browser

## Run & Install iOS app
* install all 3rd party Pods by running the following in a new terminal window
```
cd ./soundboardplatform/soundboard-ios/Conchboards
pod install
```
* using Xcode to open the project in the dir, build and run the app on any iOS device simulator

