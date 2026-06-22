// 1. Importa solo lo necesario de los sub-módulos
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

import { env } from './env.js';

// 2. Prepara tus credenciales
const serviceAccount = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT);

// 3. Inicializa la app con la función importada
const app = initializeApp({
    credential: cert(serviceAccount)
});

// 4. Obtén la instancia de Firestore desde la app inicializada
const db = getFirestore(app);

// 5. Exporta lo que necesitas (ya no existe un objeto 'admin' global)
export {
    db,
    getAuth
};