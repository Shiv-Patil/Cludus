# Cludus

## Setup

1. Clone this repository to your machine -
```sh
$ git clone git@github.com:Shiv-Patil/Cludus.git
$ git clone https://github.com/Shiv-Patil/Cludus.git
$ gh repo clone Shiv-Patil/Cludus
```

2. Create a `.env` file in `cludus` and fill it out with -
```env
DISCORD_CLIENT_TOKEN=
CLIENT_ID=
GUILD_ID=
```
and create a `.env` file in `dashboard` and fill it out with -
```env
CLIENT_ID=
CLIENT_SECRET=
REDIRECT_URL=

# Optional, only use if you are using a mongo db docker container
MONGO_INITDB_ROOT_USERNAME=root
MONGO_INITDB_ROOT_PASSWORD=password
```

### With Docker-Compose

3. Make sure you have Docker, and Docker-Compose installed, and in your path.
4. Start the services with `docker-compose up`.

### With Docker and Make

3. Make sure you have Docker and Make in your path.
4. Append the following to the `cludus/.env` file -
```env
DASHBOARD_URL=http://localhost:3000/
```
5. Append the following into `dashboard/.env` -
```
MONGO_URL=...
```
6. Run the dashboard with `make docker_run_dashboard`.
7. Run the bot with `make docker_run_bot`.

### With Docker

3. Make sure you have Docker in your path.
4. Append the following into `dashboard/.env` -
```
MONGO_URL=...
```
5. Build the dashboard with `cd dashboard && docker build . -t cludus_dashboard && cd ..`.
6. Run the dashboard with `docker run -d -p 3000:3000 cludus_dashboard`.
7. Append the following to the `cludus/.env` file - 
```env
DASHBOARD_URL=
```
8. Build the bot with `cd cludus && docker build . -t cludus_bot && cd ..`.
9. Run the bot with `cd cludus && docker run cludus_bot`.

### With Make
3. Make sure you have make, golang, node.js, and npm in your path.
4. Install the dashboard's dependencies -
```sh
$ cd dashboard
$ cd backend
$ go mod download
$ cd ../frontend
$ npm ci
$ cd ../..
```
5. Install the bot's dependencies -
```sh
$ cd cludus
$ npm ci
$ cd ..
```
6. Paste the following into `dashboard/.env` -
```
MONGO_URL=...
```
7. Append the following to `cludus/.env` -
```env
DASHBOARD_URL=http://localhost:3000/
```
8. Run the dashboard with `make run_dashboard`
9. Run the bot with `make run_bot`
