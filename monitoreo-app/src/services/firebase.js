import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Configuración leída de forma segura desde variables de entorno de Vite
// (nunca se escriben las claves directamente en el código)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);

// Instancia única de la Realtime Database, exportada para toda la app
export const db = getDatabase(app);
