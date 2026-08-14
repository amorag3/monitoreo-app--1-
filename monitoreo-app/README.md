# UTEQ Sensor Monitor

Aplicación web en React + Vite que consume Firebase Realtime Database para
monitorear en tiempo real sensores ambientales del Campus La María (UTEQ).

Sensor asignado en este proyecto: **sensor_1250566351**
(MORA GANCHOZO ANGEL JANDRY · Centro de investigación - Sector 20)

## Estructura de datos en Firebase RTDB

```
ubicacionesSensores/
  sensor_1250566351/
    nombre, cedula, campus, zona, ciudad, provincia,
    latitud, longitud, estado

valorActual/
  sensor_1250566351/
    temperatura, humedad, presionAtmosferica, timestamp

valoresHistoricos/
  sensor_1250566351/
    <pushId>/ temperatura, humedad, presionAtmosferica, timestamp
```

## Puesta en marcha

1. Crear un proyecto en https://console.firebase.google.com
2. Crear una Realtime Database (modo prueba).
3. Importar el archivo `firebase-rtdb-seed.json` en el nodo raíz.
4. Copiar `.env.example` a `.env` y completar con los datos de tu proyecto Firebase.
5. Instalar dependencias:

   ```bash
   npm install
   ```

6. Ejecutar en modo desarrollo:

   ```bash
   npm run dev
   ```

7. Abrir `http://localhost:5173`

## Rutas

| Ruta               | Vista                          |
|---------------------|---------------------------------|
| `/`                 | Dashboard del sensor asignado  |
| `/sensor/:sensorId` | Dashboard dinámico de cualquier sensor |
| `/ubicaciones`      | Directorio con todos los sensores |
