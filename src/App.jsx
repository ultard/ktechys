import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home.jsx';
import Settings from './pages/Settings.jsx';
import Statistics from './pages/Statistics.jsx';

import Technologies from './pages/Technologies.jsx';
import TechnologiesAdd from './pages/TechnologiesAdd.jsx';
import TechnologiesEdit from './pages/TechnologiesEdit.jsx';

import Navigation from './components/Navigation.jsx';
import MuiProvider from './providers/MuiProvider.jsx';
import NotificationProvider from './providers/NotificationProvider.jsx';

function App() {
  return (
    <BrowserRouter basename="maukys">
      <MuiProvider>
        <NotificationProvider>
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/technologies" element={<Technologies />} />
              <Route path="/technologies/add" element={<TechnologiesAdd />} />
              <Route path="/technologies/edit" element={<TechnologiesEdit />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </NotificationProvider>
      </MuiProvider>
    </BrowserRouter>
  );
}

export default App;
