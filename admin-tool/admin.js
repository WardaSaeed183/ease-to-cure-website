const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const adminEmails = [
  'wardasaeed312@gmail.com',
'sp23-bse-172@cuilahore.edu.pk'
  // ... add all other here
];

adminEmails.forEach(email => {
  admin.auth().getUserByEmail(email)
    .then(user => {
      return admin.auth().setCustomUserClaims(user.uid, { admin: true });
    })
    .then(() => {
      console.log(`✅ Admin claim set for ${email}`);
    })
    .catch(error => {
      console.error("Error setting admin claim for ${email}:", error.message);
    });
});
