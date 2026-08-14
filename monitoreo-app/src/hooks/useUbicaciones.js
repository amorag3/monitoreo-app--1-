import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../services/firebase';

/**
 * Escucha en tiempo real el nodo "ubicacionesSensores" completo.
 * Se usa en la página de Ubicaciones para listar TODOS los sensores.
 * Cada registro trae: nombre, cedula, campus, zona, ciudad,
 * provincia, latitud, longitud, estado.
 */
export const useUbicaciones = () => {
  const [sensores, setSensores] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const ubicacionesRef = ref(db, 'ubicacionesSensores');
    const unsubscribe = onValue(ubicacionesRef, (snapshot) => {
      const lista = [];
      snapshot.forEach((child) => {
        lista.push({ id: child.key, ...child.val() });
      });
      // Orden alfabético por nombre del estudiante
      lista.sort((a, b) => a.nombre.localeCompare(b.nombre));
      setSensores(lista);
      setCargando(false);
    });
    return () => unsubscribe(); // Cleanup: cancela el listener al desmontar
  }, []);

  return { sensores, cargando };
};

/**
 * Escucha en tiempo real la ubicación de UN solo sensor.
 * Se usa en el Dashboard para mostrar nombre/zona/estado en el encabezado.
 */
export const useUbicacionSensor = (sensorId) => {
  const [ubicacion, setUbicacion] = useState(null);

  useEffect(() => {
    if (!sensorId) return;
    const sensorRef = ref(db, `ubicacionesSensores/${sensorId}`);
    const unsubscribe = onValue(sensorRef, (snapshot) => {
      setUbicacion(snapshot.val());
    });
    return () => unsubscribe();
  }, [sensorId]);

  return ubicacion;
};
