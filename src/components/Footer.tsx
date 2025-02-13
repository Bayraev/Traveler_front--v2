import React from 'react';
import { Compass } from 'lucide-react';
import siteConfig from '../config/siteConfig.json';

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Compass className="h-6 w-6" />
              <span className="text-xl font-semibold">{siteConfig.site.logo.text}</span>
            </div>
            <p className="text-white/80">{siteConfig.site.description}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-white/80 transition-colors">Главная</a></li>
              <li><a href="/profile" className="hover:text-white/80 transition-colors">Профиль</a></li>
              <li><a href="/profile/quests" className="hover:text-white/80 transition-colors">Достижения</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Контакты</h3>
            <ul className="space-y-2">
              <li>Email: support@traveler.com</li>
              <li>Телефон: +7 (999) 123-45-67</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-white/60">
          <p>&copy; {new Date().getFullYear()} Traveler. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;