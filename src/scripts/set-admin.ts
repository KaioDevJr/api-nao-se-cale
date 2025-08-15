// backend/src/scripts/set-admin.ts
import 'dotenv/config';
import admin from 'firebase-admin';

// Usa a credencial apontada em GOOGLE_APPLICATION_CREDENTIALS (.env)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const uid = process.argv[2];
if (!uid) {
  console.error('Uso: npm run set-admin -- <UID_DO_USUARIO>');
  process.exit(1);
}

await admin.auth().setCustomUserClaims(uid, { admin: true });
console.log('✅ Claim admin aplicada para UID:', uid);
process.exit(0);
