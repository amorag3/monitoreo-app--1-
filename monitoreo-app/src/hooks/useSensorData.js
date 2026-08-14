import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../services/firebase';

/**
 * Escucha en tiempo real el valor actual de un sensor.
 * Nodo: valorActual/{sensorId}
 * Campos: temperatura, humedad, presionAtmosferica, timestamp
 */
export const useSensorActual = (sensorId) => {
  const [actual, setActual] = useState(null);

  useEffect(() => {
    if (!sensorId) return;
    const sensorRef = ref(db, `valorActual/${sensorId}`);
    const unsubscribe = onValue(sensorRef, (snapshot) => {
      setActual(snapshot.val());
    });
    return () => unsubscribe(); // Cleanup vital: evita listeners duplicados
  }, [sensorId]);

  return actual;
};

/**
 * Escucha en tiempo real el historial de mediciones de un sensor.
 * Nodo: valoresHistoricos/{sensorId} -> objeto de registros con push-id
 */
export const useSensorHistorial = (sensorId) => {
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    if (!sensorId) return;
    const historialRef = ref(db, `valoresHistoricos/${sensorId}`);

    const unsubscribe = onValue(historialRef, (snapshot) => {
      const registros = [];
      snapshot.forEach((child) => {
        registros.push({ id: child.key, ...child.val() });
      });
      // Más reciente primero
      registros.sort((a, b) => b.timestamp - a.timestamp);
      setHistorial(registros);
    });

    return () => unsubscribe();
  }, [sensorId]);

  return historial;
};

/**
 * Hook combinado: valor actual + historial de un mismo sensor,
 * pensado para alimentar directamente la vista Dashboard.
 */
export const useSensorData = (sensorId) => {
  const actual = useSensorActual(sensorId);
  const historial = useSensorHistorial(sensorId);
  return { actual, historial };
};
