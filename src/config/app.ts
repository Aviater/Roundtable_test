const appConfig = {
    bcryptSaltRounds: 10,
    inviteExp: 14, // Days
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGODB_URI,
    mailerEmail: process.env.MAILER_EMAIL,
    mailerUser: process.env.MAILER_USER,
    mailerPassword: process.env.MAILER_PASSWORD
}

export default appConfig;