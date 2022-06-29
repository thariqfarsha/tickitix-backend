const admin = require("firebase-admin");

const serviceAccount = require("./tickitix-346809-firebase-adminsdk-g4imz-89ce446875.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
