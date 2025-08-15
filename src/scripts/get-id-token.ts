// backend/src/scripts/get-id-token.ts
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
  console.error('Uso: npm run get-id-token -- <UID_DO_USUARIO>');
  process.exit(1);
}

try {
  // Gera um token de ID personalizado para o usuário
  const customToken = await admin.auth().createCustomToken(uid);
  console.log('✅ Token de ID gerado para UID:', uid);
  console.log('Token:', customToken);
  process.exit(0);
} catch (error) {
  console.error('❌ Erro ao gerar token de ID:', error);
  process.exit(1);
}
