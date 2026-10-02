import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SearchBarModal } from './components/SearchBar';

// Pages
import { Home } from './pages/Home';
import { Companies } from './pages/Companies';
import { CompanyDetails } from './pages/CompanyDetails';
import { Questions } from './pages/Questions';
import { QuestionDetails } from './pages/QuestionDetails';
import { InterviewExperiences } from './pages/InterviewExperiences';
import { Practice } from './pages/Practice';
import { CodingPractice } from './pages/CodingPractice';
import { MockInterview } from './pages/MockInterview';
import { Roadmap } from './pages/Roadmap';
import { ResumeAnalyzer } from './pages/ResumeAnalyzer';
import { Dashboard } from './pages/Dashboard';
import { Bookmarks } from './pages/Bookmarks';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Admin } from './pages/Admin';

// Scroll to top on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-mesh-glow selection:bg-sky-500 selection:text-white">
            <Navbar onOpenSearch={() => setSearchModalOpen(true)} />
            
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/companies" element={<Companies />} />
                <Route path="/company/:slug" element={<CompanyDetails />} />
                <Route path="/questions" element={<Questions />} />
                <Route path="/questions/:id" element={<QuestionDetails />} />
                <Route path="/experiences" element={<InterviewExperiences />} />
                <Route path="/practice" element={<Practice />} />
                <Route path="/practice/coding/:slug" element={<CodingPractice />} />
                <Route path="/mock-interview" element={<MockInterview />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/resume-ai" element={<ResumeAnalyzer />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/bookmarks" element={<Bookmarks />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </main>

            <Footer />

            {/* Global Search Modal */}
            <SearchBarModal
              isOpen={searchModalOpen}
              onClose={() => setSearchModalOpen(false)}
            />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
