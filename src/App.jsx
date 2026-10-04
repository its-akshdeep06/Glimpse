import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import ScrollToTop from './components/ScrollToTop';
import ThemeManager from '@/components/ThemeManager';
import CursorHighlight from '@/components/fx/CursorHighlight';
import LandingPage from '@/pages/LandingPage';
import GeneratorPage from '@/pages/GeneratorPage';

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
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
      <Toaster />
    </QueryClientProvider>
  )
}

export default App