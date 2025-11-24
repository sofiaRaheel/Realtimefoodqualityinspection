import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { TestingPage } from './components/TestingPage';
import { RealtimePage } from './components/RealtimePage';
import { ThemeProvider } from './components/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors">
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/testing" element={<TestingPage />} />
            <Route path="/realtime" element={<RealtimePage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}