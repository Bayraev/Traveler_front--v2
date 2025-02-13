import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import Header from './components/Header';
import Footer from './components/Footer';
import MainPage from './pages/MainPage';
import ProfilePage from './pages/ProfilePage';
import FriendsPage from './pages/FriendsPage';
import QuestsPage from './pages/QuestsPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector((state: RootState) => state.user.currentUser);

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
    </div>
  );
}

export default App;
