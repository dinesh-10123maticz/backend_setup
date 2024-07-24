
# Initial Backend Setup 

A brief description of what this project does and who it's for




## Tech Stack

**Server:** Node, Express

**verison:** Node > 18v

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT` - mention the port number which port to run this project

`MONGOURI` - your MONGOURI

`SECRET_KEY` - Secret Key of your project for Encrypt and decrypt process

`SITE_NAME` - Your website Name

`ACCESS_TOKEN_LIFE` - Auth token Life time (eg : 10m , m - minutes , h - hours)


## Run Locally

Clone the project

```bash
  git clone https://github.com/dinesh-10123maticz/backend_setup.git
```

Go to the project directory

```bash
  cd backend_setup
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

## Features

- swagger initialized  - `http://host:port/api-docs`
- logger implemented - path `public/logs`
