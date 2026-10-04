import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import ScrollToTop from './components/ScrollToTop';
import ThemeManager from '@/components/ThemeManager';
import CursorHighlight from '@/components/fx/CursorHighlight';
import LandingPage from '@/pages/LandingPage';
import GeneratorPage from '@/pages/GeneratorPage';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <ThemeManager />
      <CursorHighlight />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<GeneratorPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  )
}

export default App