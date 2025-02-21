import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signIn } from '../app/features/userSlice';
import { Compass } from 'lucide-react';
import { AppDispatch } from '../app/store';
import { UserDTO } from '../types';

const SignInPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch: AppDispatch = useDispatch();

  // ... rest of the file remains the same
};
