const formatearFecha = (timestamp) => {
  if (!timestamp) return '--';
  return new Date(timestamp).toLocaleString('es-EC', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const HistorialTable = ({ registros }) => {
  return (
    <div className="historial">
      <h3>Historial de mediciones</h3>
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
          {registros.map((r) => (
            <tr key={r.id}>
              <td>{formatearFecha(r.timestamp)}</td>
              <td>{r.temperatura} °C</td>
              <td>{r.humedad} %</td>
              <td>{r.presionAtmosferica} hPa</td>
            </tr>
          ))}
          {registros.length === 0 && (
            <tr>
              <td colSpan={4}>Sin registros históricos aún.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
