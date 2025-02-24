import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import MainPage from './pages/MainPage';
import ProfilePage from './pages/ProfilePage';
import FriendsPage from './pages/FriendsPage';
import QuestsPage from './pages/QuestsPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import Cookies from 'js-cookie';
import { Toaster } from 'sonner';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const usernameCookie = Cookies.get('username');
  const passwordCookie = Cookies.get('password');
  const user =
    (usernameCookie ? JSON.parse(usernameCookie) : null) &&
    (passwordCookie ? JSON.parse(passwordCookie) : null);

  if (!user) {
    return <Navigate to="/sign/in" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/sign/in" element={<SignInPage />} />
          <Route path="/sign/up" element={<SignUpPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/friends"
            element={
              <ProtectedRoute>
                <FriendsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/quests"
            element={
              <ProtectedRoute>
                <QuestsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
      <Toaster position="bottom-left" richColors />
    </div>
  );
}

export default App;
