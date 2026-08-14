# Práctica: monitoreo de sensores en tiempo real con React y Firebase RTDB

**Asignatura:** Aplicaciones Telemáticas Basadas en la Web  
**Escenario:** Campus La María de la Universidad Técnica Estatal de Quevedo (UTEQ)  
**Tecnologías:** React, Vite, Firebase Realtime Database y React Router DOM

## 1. Objetivo

Desarrollar una aplicación web telemática que se conecte a Firebase Realtime Database (RTDB) mediante el SDK oficial de Firebase para JavaScript y visualice, en tiempo real, las mediciones ambientales de sensores ubicados en el campus La María de la UTEQ.

La aplicación debe mostrar:

- Tarjeta de temperatura actual en grados Celsius.
- Tarjeta de humedad relativa actual en porcentaje.
- Tarjeta de presión atmosférica actual en hPa.
- Fecha y hora de la última actualización.
- Tabla con los últimos 20 registros históricos.
- Página con la ubicación y los datos generales de cada sensor.
- Selección de un sensor desde la página de ubicaciones.
- Dashboard dinámico que muestre únicamente los datos del sensor seleccionado.
- Actualización automática de la interfaz cuando cambien los datos en Firebase, sin recargar la página.

## 2. Resultado esperado

La aplicación tendrá tres rutas principales:

| Ruta | Contenido |
|---|---|
| `/` | Redirige al Dashboard inicial del `sensor_001`. |
| `/sensor/:sensorId` | Dashboard dinámico del sensor indicado en la URL. |
| `/ubicaciones` | Lista de sensores. Al seleccionar uno, abre su Dashboard. |

Ejemplos de rutas dinámicas:

```text
/sensor/sensor_001
/sensor/sensor_004
/sensor/sensor_010
```

Para comprobar la navegación entre sensores, la RTDB debe contener los registros de `sensor_001` a `sensor_010` en los tres nodos principales. Se recomienda importar el archivo `firebase-rtdb-10-sensores-campus-la-maria.json` antes de ejecutar la aplicación.

## 3. Arquitectura de datos

Se utilizarán tres nodos principales en Firebase RTDB:

```text
/
├── valorActual
│   └── sensor_001
├── valoresHistoricos
│   └── sensor_001
│       └── registro
└── ubicacionesSensores
    └── sensor_001
```

- `valorActual`: conserva únicamente la lectura más reciente de cada sensor.
- `valoresHistoricos`: conserva las mediciones anteriores con su marca de tiempo.
- `ubicacionesSensores`: conserva los datos estáticos de ubicación e identificación.

Esta separación evita repetir la información de ubicación en cada lectura y permite escuchar únicamente el nodo dinámico que necesita la interfaz.

## 4. Creación del proyecto Firebase

1. Ingresar a <https://console.firebase.google.com/>.
2. Crear un proyecto llamado `monitoreo-sensores-uteq`.
3. Agregar una aplicación Web.
4. Abrir **Compilación > Realtime Database**.
5. Crear la base de datos en modo de prueba solamente para realizar la carga inicial.
6. Copiar el objeto `firebaseConfig` de la aplicación web.

> El objeto de configuración de una aplicación web identifica el proyecto, pero no reemplaza las reglas de seguridad. No se deben colocar cuentas de servicio ni claves privadas en React o GitHub.

## 5. JSON para crear la estructura de la RTDB de una sola vez

Guardar el siguiente contenido como `firebase-rtdb-seed.json`. En Firebase Console, abrir **Realtime Database**, seleccionar el menú de opciones del nodo raíz y elegir **Importar JSON**.

> Importar en el nodo raíz reemplaza los datos que existan allí. Utilizar este archivo inicialmente sobre una base vacía.

```json
{
  "ubicacionesSensores": {
    "sensor_001": {
      "nombre": "Estación Ambiental 1",
      "campus": "Campus La María - UTEQ",
      "zona": "Área de cultivos experimentales",
      "ciudad": "Quevedo",
      "provincia": "Los Ríos",
      "latitud": -1.08422,
      "longitud": -79.50104,
      "estado": "activo"
    }
  },
  "valorActual": {
    "sensor_001": {
      "temperatura": 27.6,
      "humedad": 78.4,
      "presionAtmosferica": 1008.9,
      "timestamp": 1786541100000
    }
  },
  "valoresHistoricos": {
    "sensor_001": {
      "1786539600000": {
        "temperatura": 26.8,
        "humedad": 81.2,
        "presionAtmosferica": 1009.7,
        "timestamp": 1786539600000
      },
      "1786539900000": {
        "temperatura": 27.0,
        "humedad": 80.5,
        "presionAtmosferica": 1009.5,
        "timestamp": 1786539900000
      },
      "1786540200000": {
        "temperatura": 27.2,
        "humedad": 79.8,
        "presionAtmosferica": 1009.3,
        "timestamp": 1786540200000
      },
      "1786540500000": {
        "temperatura": 27.3,
        "humedad": 79.2,
        "presionAtmosferica": 1009.2,
        "timestamp": 1786540500000
      },
      "1786540800000": {
        "temperatura": 27.5,
        "humedad": 78.8,
        "presionAtmosferica": 1009.0,
        "timestamp": 1786540800000
      },
      "1786541100000": {
        "temperatura": 27.6,
        "humedad": 78.4,
        "presionAtmosferica": 1008.9,
        "timestamp": 1786541100000
      }
    }
  }
}
```

## 6. Reglas para la aplicación de consulta

Después de importar los datos, reemplazar el modo de prueba por estas reglas. La aplicación React podrá consultar los datos, pero no modificarlos.

```json
{
  "rules": {
    ".read": true,
    ".write": false,
    "valoresHistoricos": {
      "$sensorId": {
        ".indexOn": ["timestamp"]
      }
    }
  }
}
```

Para un sistema real, se debe integrar Firebase Authentication y permitir que solamente el dispositivo, un servidor confiable o una Cloud Function escriba mediciones. No se debe mantener escritura pública en producción.

## 7. Script JavaScript alternativo para cargar la base

La importación JSON es la opción más sencilla. Como alternativa, se puede crear un proyecto Node temporal, instalar `firebase` y ejecutar el siguiente script mientras la RTDB todavía esté en modo de prueba.

```bash
mkdir cargar-firebase
cd cargar-firebase
npm init -y
npm install firebase
```

Crear `seedDatabase.mjs`:

```js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  databaseURL: "https://TU_PROYECTO-default-rtdb.firebaseio.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.firebasestorage.app",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};

const datosIniciales = {
  ubicacionesSensores: {
    sensor_001: {
      nombre: "Estación Ambiental 1",
      campus: "Campus La María - UTEQ",
      zona: "Área de cultivos experimentales",
      ciudad: "Quevedo",
      provincia: "Los Ríos",
      latitud: -1.08422,
      longitud: -79.50104,
      estado: "activo"
    }
  },
  valorActual: {
    sensor_001: {
      temperatura: 27.6,
      humedad: 78.4,
      presionAtmosferica: 1008.9,
      timestamp: 1786541100000
    }
  },
  valoresHistoricos: {
    sensor_001: {
      "1786540200000": {
        temperatura: 27.2,
        humedad: 79.8,
        presionAtmosferica: 1009.3,
        timestamp: 1786540200000
      },
      "1786540500000": {
        temperatura: 27.3,
        humedad: 79.2,
        presionAtmosferica: 1009.2,
        timestamp: 1786540500000
      },
      "1786540800000": {
        temperatura: 27.5,
        humedad: 78.8,
        presionAtmosferica: 1009.0,
        timestamp: 1786540800000
      },
      "1786541100000": {
        temperatura: 27.6,
        humedad: 78.4,
        presionAtmosferica: 1008.9,
        timestamp: 1786541100000
      }
    }
  }
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

try {
  await set(ref(db), datosIniciales);
  console.log("Base de datos creada correctamente.");
  process.exit(0);
} catch (error) {
  console.error("No se pudo cargar la base:", error.message);
  process.exit(1);
}
```

Ejecutar una sola vez:

```bash
node seedDatabase.mjs
```

## 8. Creación de la aplicación React

```bash
npm create vite@latest monitoreo-sensores-uteq -- --template react
cd monitoreo-sensores-uteq
npm install
npm install firebase react-router-dom
npm run dev
```

Estructura recomendada:

```text
src/
├── components/
│   ├── Navbar.jsx
│   └── SensorCard.jsx
├── hooks/
│   └── useSensorData.js
├── pages/
│   ├── Dashboard.jsx
│   └── Ubicaciones.jsx
├── services/
│   └── firebase.js
├── App.jsx
├── main.jsx
└── styles.css
```

## 9. Variables de entorno

Crear `.env` en la raíz del proyecto:

```env
VITE_FIREBASE_API_KEY=TU_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=TU_PROYECTO.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://TU_PROYECTO-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=TU_PROYECTO
VITE_FIREBASE_STORAGE_BUCKET=TU_PROYECTO.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=TU_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=TU_APP_ID
```

Crear también `.env.example` con los nombres de las variables y sin valores reales. Incluir `.env` en `.gitignore`.

## 10. Conexión con Firebase

Archivo `src/services/firebase.js`:

```js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
```

## 11. Hook para recibir los datos del sensor seleccionado

Archivo `src/hooks/useSensorData.js`:

```js
import { useEffect, useState } from "react";
import {
  limitToLast,
  onValue,
  orderByChild,
  query,
  ref
} from "firebase/database";
import { db } from "../services/firebase";

export function useSensorData(sensorId) {
  const [actual, setActual] = useState(null);
  const [historicos, setHistoricos] = useState([]);
  const [ubicacion, setUbicacion] = useState(null);
  const [error, setError] = useState("");
  const [cargados, setCargados] = useState({
    actual: false,
    historicos: false,
    ubicacion: false
  });

  useEffect(() => {
    setActual(null);
    setHistoricos([]);
    setUbicacion(null);
    setError("");
    setCargados({ actual: false, historicos: false, ubicacion: false });

    const actualRef = ref(db, `valorActual/${sensorId}`);
    const ubicacionRef = ref(db, `ubicacionesSensores/${sensorId}`);
    const historicosQuery = query(
      ref(db, `valoresHistoricos/${sensorId}`),
      orderByChild("timestamp"),
      limitToLast(20)
    );

    const cancelarActual = onValue(
      actualRef,
      (snapshot) => {
        setActual(snapshot.exists() ? snapshot.val() : null);
        setCargados((estado) => ({ ...estado, actual: true }));
      },
      (firebaseError) => {
        setError(firebaseError.message);
        setCargados((estado) => ({ ...estado, actual: true }));
      }
    );

    const cancelarHistoricos = onValue(
      historicosQuery,
      (snapshot) => {
        const datos = snapshot.val() ?? {};
        const lista = Object.entries(datos)
          .map(([id, valor]) => ({ id, ...valor }))
          .sort((a, b) => b.timestamp - a.timestamp);
        setHistoricos(lista);
        setCargados((estado) => ({ ...estado, historicos: true }));
      },
      (firebaseError) => {
        setError(firebaseError.message);
        setCargados((estado) => ({ ...estado, historicos: true }));
      }
    );

    const cancelarUbicacion = onValue(
      ubicacionRef,
      (snapshot) => {
        setUbicacion(snapshot.exists() ? snapshot.val() : null);
        setCargados((estado) => ({ ...estado, ubicacion: true }));
      },
      (firebaseError) => {
        setError(firebaseError.message);
        setCargados((estado) => ({ ...estado, ubicacion: true }));
      }
    );

    return () => {
      cancelarActual();
      cancelarHistoricos();
      cancelarUbicacion();
    };
  }, [sensorId]);

  const cargando =
    !cargados.actual || !cargados.historicos || !cargados.ubicacion;

  return { actual, historicos, ubicacion, cargando, error };
}
```

El hook recibe `sensorId` y construye dinámicamente tres referencias: valor actual, historial y ubicación. `onValue` ejecuta el callback con el estado inicial del nodo y vuelve a ejecutarlo cuando los datos cambian. Las funciones devueltas por `onValue` cancelan los listeners cuando cambia el sensor o se desmonta el componente.

## 12. Tarjeta reutilizable

Archivo `src/components/SensorCard.jsx`:

```jsx
export default function SensorCard({ titulo, valor, unidad, icono }) {
  return (
    <article className="sensor-card">
      <span className="sensor-card__icon" aria-hidden="true">{icono}</span>
      <div>
        <p>{titulo}</p>
        <strong>{valor ?? "--"} {unidad}</strong>
      </div>
    </article>
  );
}
```

## 13. Página Dashboard

Archivo `src/pages/Dashboard.jsx`:

```jsx
import SensorCard from "../components/SensorCard";
import { useSensorData } from "../hooks/useSensorData";
import { Link, useParams } from "react-router-dom";

const formatearFecha = (timestamp) => {
  if (!timestamp) return "Sin información";
  return new Intl.DateTimeFormat("es-EC", {
    dateStyle: "medium",
    timeStyle: "medium",
    timeZone: "America/Guayaquil"
  }).format(new Date(timestamp));
};

export default function Dashboard() {
  const { sensorId } = useParams();
  const { actual, historicos, ubicacion, cargando, error } =
    useSensorData(sensorId);

  if (cargando) return <main className="container centered"><p>Cargando sensor…</p></main>;
  if (error) return <main className="container"><p className="error">Error: {error}</p></main>;

  if (!actual || !ubicacion) {
    return (
      <main className="container centered">
        <h1>Sensor no encontrado</h1>
        <p>No existen datos para el identificador: {sensorId}</p>
        <Link className="button-link" to="/ubicaciones">
          Seleccionar otro sensor
        </Link>
      </main>
    );
  }

  return (
    <main className="container dashboard">
      <header className="page-header dashboard-header">
        <div>
          <p className="eyebrow">Campus La María · UTEQ</p>
          <h1>{ubicacion.nombre}</h1>
          <p>{ubicacion.zona}</p>
        </div>
        <span className="status">● En línea</span>
      </header>

      <section className="cards" aria-label="Valores actuales">
        <SensorCard
          titulo="Temperatura"
          valor={actual?.temperatura}
          unidad="°C"
          icono="🌡️"
        />
        <SensorCard
          titulo="Humedad"
          valor={actual?.humedad}
          unidad="%"
          icono="💧"
        />
        <SensorCard
          titulo="Presión atmosférica"
          valor={actual?.presionAtmosferica}
          unidad="hPa"
          icono="🧭"
        />
      </section>

      <p className="updated">
        Última actualización: {formatearFecha(actual?.timestamp)}
      </p>

      <p className="sensor-id">Identificador: {sensorId}</p>

      <section className="table-panel">
        <h2>Historial de mediciones</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Fecha y hora</th>
                <th>Temperatura</th>
                <th>Humedad</th>
                <th>Presión</th>
              </tr>
            </thead>
            <tbody>
              {historicos.map((registro) => (
                <tr key={registro.id}>
                  <td>{formatearFecha(registro.timestamp)}</td>
                  <td>{registro.temperatura} °C</td>
                  <td>{registro.humedad} %</td>
                  <td>{registro.presionAtmosferica} hPa</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Link className="button-link" to="/ubicaciones">
        ← Ver todos los sensores
      </Link>
    </main>
  );
}
```

`useParams()` obtiene el identificador incluido en la URL. Por ejemplo, al abrir `/sensor/sensor_007`, el componente envía `sensor_007` al hook y el Dashboard presenta solamente las mediciones de ese sensor.

## 14. Página de ubicaciones

Archivo `src/pages/Ubicaciones.jsx`:

```jsx
import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { Link } from "react-router-dom";
import { db } from "../services/firebase";

export default function Ubicaciones() {
  const [sensores, setSensores] = useState([]);

  useEffect(() => {
    const ubicacionesRef = ref(db, "ubicacionesSensores");
    return onValue(ubicacionesRef, (snapshot) => {
      const datos = snapshot.val() ?? {};
      setSensores(
        Object.entries(datos).map(([id, sensor]) => ({ id, ...sensor }))
      );
    });
  }, []);

  return (
    <main className="container">
      <header className="page-header">
        <div>
          <p className="eyebrow">Red de sensores</p>
          <h1>Ubicaciones</h1>
          <p>Seleccione un sensor para consultar su Dashboard en tiempo real.</p>
        </div>
      </header>

      <section className="locations">
        {sensores.map((sensor) => (
          <Link
            className="location-card"
            key={sensor.id}
            to={`/sensor/${sensor.id}`}
            aria-label={`Abrir Dashboard de ${sensor.nombre}`}
          >
            <span className="status">● {sensor.estado}</span>
            <h2>{sensor.nombre}</h2>
            <p><strong>Campus:</strong> {sensor.campus}</p>
            <p><strong>Zona:</strong> {sensor.zona}</p>
            <p><strong>Ciudad:</strong> {sensor.ciudad}, {sensor.provincia}</p>
            <p><strong>Coordenadas:</strong> {sensor.latitud}, {sensor.longitud}</p>
            <span className="location-card__action">Ver Dashboard →</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
```

Cada sensor se presenta como un enlace accesible. Al hacer clic, React Router cambia la URL a `/sensor/{id}` y carga el Dashboard correspondiente sin recargar completamente la aplicación.

## 15. Navegación y rutas

Archivo `src/components/Navbar.jsx`:

```jsx
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <strong>UTEQ Sensor Monitor</strong>
      <div>
        <NavLink to="/sensor/sensor_001">Dashboard</NavLink>
        <NavLink to="/ubicaciones">Ubicaciones</NavLink>
      </div>
    </nav>
  );
}
```

Archivo `src/App.jsx`:

```jsx
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Ubicaciones from "./pages/Ubicaciones";
import "./styles.css";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/sensor/sensor_001" replace />} />
        <Route path="/sensor/:sensorId" element={<Dashboard />} />
        <Route path="/ubicaciones" element={<Ubicaciones />} />
        <Route path="*" element={<Navigate to="/ubicaciones" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## 16. Estilos mínimos

Archivo `src/styles.css`:

```css
:root {
  font-family: Inter, system-ui, sans-serif;
  color: #15342f;
  background: #f4f8f6;
}

* { box-sizing: border-box; }
body { margin: 0; }

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem max(1rem, calc((100% - 1180px) / 2));
  color: white;
  background: #006b4f;
}

.navbar div { display: flex; gap: 1rem; }
.navbar a { color: #d8f5ea; text-decoration: none; }
.navbar a.active { color: white; font-weight: 700; }

.container { width: min(1180px, 92%); margin: 2rem auto; }
.page-header { display: flex; justify-content: space-between; gap: 1rem; }
.dashboard { text-align: center; }
.dashboard-header {
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.centered { min-height: 60vh; display: grid; place-content: center; text-align: center; }
.eyebrow { color: #008d68; font-weight: 700; margin-bottom: .3rem; }
.status { color: #087f5b; font-weight: 700; text-transform: capitalize; }

.cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
  text-align: left;
}

.sensor-card, .table-panel, .location-card {
  background: white;
  border: 1px solid #dce9e4;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgb(18 66 53 / 8%);
}

.sensor-card { display: flex; gap: 1rem; align-items: center; padding: 1.25rem; }
.sensor-card__icon { font-size: 2rem; }
.sensor-card p { margin: 0 0 .4rem; color: #5c706a; }
.sensor-card strong { font-size: 1.7rem; }
.updated { color: #5c706a; }
.sensor-id { color: #72827d; font-size: .9rem; }

.table-panel { padding: 1.25rem; margin-bottom: 1.25rem; text-align: left; }
.table-scroll { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: .9rem; text-align: left; border-bottom: 1px solid #e6eeeb; }
th { color: #48635b; }

.locations { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; }
.location-card {
  display: block;
  padding: 1.25rem;
  color: inherit;
  text-decoration: none;
  transition: transform .2s ease, box-shadow .2s ease;
}
.location-card:hover,
.location-card:focus-visible {
  transform: translateY(-4px);
  box-shadow: 0 14px 30px rgb(18 66 53 / 16%);
  outline: 3px solid #8ddbc3;
}
.location-card__action { display: inline-block; margin-top: .7rem; color: #007b5b; font-weight: 700; }
.button-link {
  display: inline-block;
  padding: .75rem 1rem;
  border-radius: 10px;
  color: white;
  background: #007b5b;
  text-decoration: none;
  font-weight: 700;
}
.error { color: #b42318; }

@media (max-width: 760px) {
  .cards { grid-template-columns: 1fr; }
  .navbar, .page-header { align-items: flex-start; flex-direction: column; }
}
```

## 17. Prueba del tiempo real

1. Ejecutar la aplicación con `npm run dev`.
2. Abrir la ruta `/ubicaciones`.
3. Hacer clic en `Estación Ambiental 4` y comprobar que se abre `/sensor/sensor_004`.
4. Verificar que el título, las tarjetas y la tabla pertenecen a `sensor_004`.
5. En Firebase Console, editar `valorActual/sensor_004/temperatura`.
6. Comprobar que la tarjeta cambia sin actualizar manualmente el navegador.
7. Agregar un hijo en `valoresHistoricos/sensor_004` con temperatura, humedad, presión y `timestamp`.
8. Comprobar que el nuevo registro aparece automáticamente en la primera fila de la tabla.
9. Regresar a Ubicaciones, seleccionar otro sensor y verificar que cambien todos los datos del Dashboard.


