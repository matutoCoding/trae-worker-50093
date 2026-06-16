import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import Reservoir from "@/pages/Reservoir";
import DamMonitoring from "@/pages/DamMonitoring";
import Seepage from "@/pages/Seepage";
import Patrol from "@/pages/Patrol";
import Emergency from "@/pages/Emergency";
import VideoMonitor from "@/pages/VideoMonitor";
import Assessment from "@/pages/Assessment";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reservoir" element={<Reservoir />} />
          <Route path="/dam-monitoring" element={<DamMonitoring />} />
          <Route path="/seepage" element={<Seepage />} />
          <Route path="/patrol" element={<Patrol />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/video" element={<VideoMonitor />} />
          <Route path="/assessment" element={<Assessment />} />
        </Route>
      </Routes>
    </Router>
  );
}
