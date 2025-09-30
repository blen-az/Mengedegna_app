/* eslint-disable @typescript-eslint/no-var-requires */
const admin = require('firebase-admin');

try {
  admin.initializeApp();
} catch (e) {
  // no-op if already initialized
}

(async () => {
  const db = admin.firestore();
  const snap = await db.collection('users').get();
  const batch = db.batch();
  let updates = 0;
  snap.forEach(doc => {
    const data = doc.data() || {};
    if (!data.role) {
      batch.update(doc.ref, {
        role: 'user',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      updates += 1;
    }
  });
  if (updates > 0) {
    await batch.commit();
  }
  console.log(`Backfill complete. Updated ${updates} user(s).`);
  process.exit(0);
})().catch(err => {
  console.error(err);
  process.exit(1);
});



