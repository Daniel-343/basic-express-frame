## Basic express frame

This is an Express.js backend application, that can be tailored to any project, should you need to use Express.js

### Features
- MongoDB database models
- Token based authentication using cookies
- Encrypted passwords using Bcrypt
- Dockerized
- Developed CI/CD pipeline with Jenkins using AWS ECS

## How to use it?

### System requirements:
- Docker with compose
- 500Mb of storage space
- MongoDB database

You must have your own mongoDB database. </br>
You can create one [here](https://cloud.mongodb.com/)


Create a .env file in your project repository and paste your mongoDB connection string in there:

```
MONGO_URL=your-connection-string
```

A frontend is not part of this repository, but I have created one just to test it out. </br>
There is also a docker-compose.yaml file that will pull this react frontend container and start running the application.

```
docker-compose up
```

You should now be able to see the app at **http://localhost:3000**


