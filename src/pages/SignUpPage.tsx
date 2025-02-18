import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Camera, X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../app/store';
import { signUp } from '../app/features/userSlice';
import { validateImage } from '../utils/fileValidation';
import { toast } from 'sonner';

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImage(file);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (!avatar) {
      setError('Пожалуйста, добавьте аватар');
      return;
    }

    try {
      await dispatch(signUp({ username, password, avatar })).unwrap();
      navigate('/');
    } catch (err) {
      setError(err as string);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <Compass className="h-12 w-12 text-primary" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Регистрация</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Уже есть аккаунт?{' '}
            <Link to="/sign/in" className="font-medium text-primary hover:text-primary/80">
              Войдите
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          <div className="flex justify-center">
            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <Camera className="h-8 w-8 text-gray-400" />
                )}
              </div>
              {avatarPreview && (
                <button
                  type="button"
                  onClick={() => {
                    setAvatar(null);
                    setAvatarPreview('');
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Имя пользователя
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Имя пользователя"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Подтвердите пароль
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Подтвердите пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              Зарегистрироваться
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
