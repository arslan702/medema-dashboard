import admin from 'firebase-admin';

// Load the service account key JSON file
const serviceAccount = require('../../config/serviceAccountKey.json');

// Initialize Firebase Admin SDK on the server side
const initializeFirebaseServer = () => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      // Add other configurations as needed
    });
  }
  return admin;
};

export default initializeFirebaseServer;
