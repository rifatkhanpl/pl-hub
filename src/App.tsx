import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Shell } from './components/Shell';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CMPModule } from './pages/modules/CMPModule';
import { COMMSModule } from './pages/modules/COMMSModule';
import { GEOSModule } from './pages/modules/GEOSModule';
import { GMEModule } from './pages/modules/GMEModule';
import { HCOModule } from './pages/modules/HCOModule';
import { JOBSModule } from './pages/modules/JOBSModule';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Auth0ManagementPage } from './pages/Auth0ManagementPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Shell>
                  <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/comms/*" element={<COMMSModule />} />
                    <Route path="/geos/*" element={<GEOSModule />} />
                    <Route path="/gme/*" element={<GMEModule />} />
                    <Route path="/hco/*" element={<HCOModule />} />
                    <Route path="/cmp/*" element={<CMPModule />} />
                    <Route path="/hl/*" element={<div>HL Module - Coming Soon</div>} />
                    <Route path="/jobs/*" element={<JOBSModule />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/analytics/*" element={<div>Analytics Module - Coming Soon</div>} />
                    <Route path="/udbs/*" element={<div>UDBS Module - Coming Soon</div>} />
                    <Route path="/settings/*" element={<div>Settings Module - Coming Soon</div>} />
                    <Route path="/auth0" element={<Auth0ManagementPage />} />
                    <Route path="*" element={<DashboardPage />} />
                  </Routes>
                </Shell>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
