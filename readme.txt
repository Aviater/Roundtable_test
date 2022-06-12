SETUP
===========
1. Make an .env file with the following format:
    MONGODB_URI = <URI to a mongoDB database>
    MAILER_EMAIL = <sender email address for invite emails>
    MAILER_USER = <email account username>
    MAILER_PASSWORD = <email accounts password>

Use Mailtrap to open an email testing account. (https://mailtrap.io/)

2. Install depencies.

3. Run migrations (npm run mongo-up).

4. Start (npm start).


API
===========
Route: http://localhost:5000/auth/login
Method: POST
Body: {
    "email": string,
    "password": string
}

Route: http://localhost:5000/user/invite
Method: POST
Bearer header: this-simulates-an-access-token (place this in the Auth header as a Bearer token)
Body: {
	"inviteeEmail": string,
	"inviterEmail": string
}

Route: http://localhost:5000/user/register/:id
Method: POST
Body: {
    "email": string,
    "password": string
}