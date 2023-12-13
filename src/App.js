import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SplashScreen from './pages/Splash';
import LoginScreen from './pages/Login';
import ProviderLoginScreen from './pages/ProviderLogin';
import RegistrationScreen from './pages/Registration';
import ProviderRegistrationScreen from './pages/ProviderRegistration';
import ProfileScreen from './pages/Profile';
import ProviderProfileScreen from './pages/ProviderProfile';
import PatientProfileScreen from './pages/PatientProfile';
import SymptomFormScreen from './pages/SymptomForm';
import KeySymptomsScreen from './pages/KeySymptoms';
import CareProviderSymptomFormScreen from './pages/CareProviderSymptomForm';
import DiagnosisScreen from './pages/Diagnosis';
import ProviderDiagnosisScreen from './pages/ProviderDiagnosis';
import DiseaseStatsScreen from './pages/DiseaseStats';
import RiskFactorInputScreen from './pages/RiskFactorsInput';
import RiskFactorsScreen from './pages/RiskFactors';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/provider-login" element={<ProviderLoginScreen/>} />
        <Route path="/registration" element={<RegistrationScreen />} />
        <Route path="/provider-registration" element={<ProviderRegistrationScreen/>} />
        <Route path="/profile" element={<ProfileScreen/>} />
        <Route path="/provider-profile" element={<ProviderProfileScreen/>} />
        <Route path="/patient-profile" element={<PatientProfileScreen/>} />
        <Route path="/symptom" element={<SymptomFormScreen/>} />
        <Route path="/care-provider-symptoms" element={<CareProviderSymptomFormScreen/>} />
        <Route path="/diagnosis" element={<DiagnosisScreen/>} />
        <Route path="/provider-diagnosis" element={<ProviderDiagnosisScreen/>} />
        <Route path="/disease-stats" element={<DiseaseStatsScreen/>} />
        <Route path="/risk-factors-input" element={<RiskFactorInputScreen/>} />
        <Route path="/key-symptoms" element={<KeySymptomsScreen/>} />
        <Route path="/risk-factors" element={<RiskFactorsScreen/>} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
