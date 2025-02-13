import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Compass, Menu, X, User, Users, Map, CheckSquare, LogOut } from 'lucide-react';
import { RootState } from '../store/store';
import { logout } from '../store/slices/userSlice';
import siteConfig from '../config/siteConfig.json';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/sign/in');
  };

  const menuItems = user
    ? [
        { to: '/', text: 'Карта', icon: Map },
        { to: '/profile', text: 'Профиль', icon: User },
        { to: '/profile/friends', text: 'Друзья', icon: Users },
        { to: '/profile/quests', text: 'Достижения', icon: CheckSquare },
      ]
    : [];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 text-primary">
            <Compass className="h-6 w-6" />
            <span className="text-xl font-semibold">{siteConfig.site.logo.text}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center space-x-1 text-gray-600 hover:text-primary transition-colors">
                <item.icon className="h-4 w-4" />
                <span>{item.text}</span>
              </Link>
            ))}
            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-600 hover:text-primary transition-colors">
                <LogOut className="h-4 w-4" />
                <span>Выйти</span>
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.text}</span>
                </Link>
              ))}
              {user && (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors">
                  <LogOut className="h-4 w-4" />
                  <span>Выйти</span>
                </button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
