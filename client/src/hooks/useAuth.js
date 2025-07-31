// This hook provides access to the authentication context, allowing components to easily access user data, token, and authentication methods.
// It also ensures that the context is used within an AuthProvider, throwing an error if not used correctly.

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;

