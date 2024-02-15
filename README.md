<p align="center">
    <img src="logo.png" alt="Logo" width="100" height="100">
</a>

<h2 align="center">News API</h2>

<p align="center">Simple backend api project for news platform.<br /></p>

## Features of Project

- Register/Login User
- Update User data
- Encryption for password
- Authorization
- Add, Update, Delete news
- Caching
- Secured using `cors` and `helmet`
- Rate Limiting
- Pagination
- Logging
- Email-Sending
- Queue

## Technologies used

- Node.js
- Express.js
- Postgres database
- Prisma ORM
- Redis (for caching and queue)
- CORS
- helmet (to secure node server)
- winston (for logging)
- bullmq (for queue)

## Getting Started

To get the project up and running on your local system, follow these steps:

### Setting up:

- Clone the repository:

  ```bash
  git clone https://github.com/MayurJagtap-Dev/pp-mern-news-api.git
  ```

- Enter in project folder:

  ```bash
  cd pp-mern-news-api
  ```

- Setup server by installing dependencies:

  ```bash
  npm i
  ```

- start redis server on local machine (prefer to use docker container)

- setup environment variables in `.env ` file

  ```bash
  PORT = "Port-number-to-run-server-on"
  JWT_SECRET = "random-string-to-generate-jwt-token"

  DATABASE_URL="postgresql://<username>:<password>@localhost:5432/<db_name>?schema=public"

  REDIS_HOST = "host-which-is-running-redis"
  REDIS_PORT = "redis-running-port"
  ```

- choose any mail servive provider of your choice (e.g. brevo, mailchimp, etc.) and fill below details in environment variable

  ```bash
  SMTP_HOST = ""
  SMTP_PORT = ""
  SMTP_USER = ""
  SMTP_API_KEY = ""
  SMTP_SENDER = ""
  ```

- start the server

  ```bash
  npm run dev
  ```

- Start rest client and explore the routes provided in `routes/route.js`

## Want to contribute?

For contribution, please follow the "fork-and-pull" Git workflow.

1.  **Fork** the repo on GitHub
2.  **Clone** the project to your own machine
3.  **Commit** changes to your own branch
4.  **Push** your work back up to your fork
5.  Submit a **Pull request** so that we can review your changes

`NOTE: Be sure to merge the latest from "upstream" before     making a pull request!`

## Find me here:

Email :- mayurjagtap9112@gmail.com

Github Profile :- [Github_Profile_Link](https://github.com/MayurJagtap-Dev)

Linkedin :- [Linkedin_Profile_Link](www.linkedin.com/in/mayurjagtap-dev)
