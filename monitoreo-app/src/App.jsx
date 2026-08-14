import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { Ubicaciones } from './pages/Ubicaciones';

// Sensor asignado al estudiante (cédula 1250566351)
const MI_SENSOR = 'sensor_1250566351';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard defaultSensor={MI_SENSOR} />} />
        <Route path="/sensor/:sensorId" element={<Dashboard />} />
        <Route path="/ubicaciones" element={<Ubicaciones />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
