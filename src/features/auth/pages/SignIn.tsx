import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import AuthContainer from '../components/AuthContainer';
import FormInput from '../../../shared/components/FormInput';
import ErrorMessage from '../../../shared/components/ErrorMessage';
import GoogleSignInButton from '../components/GoogleSignInButton';
import { getAuthErrorMessage } from '../utils/authErrors';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error.code, 'signin');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/');
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error.code, 'signin');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer
      title="Sign in to your account"
      subtitle={
        <>
          Or{' '}
          <Link
            to="/signup"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            create a new account
          </Link>
        </>
      }
    >
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <ErrorMessage message={error} />
        
        <div className="space-y-4">
          <FormInput
            id="email"
            name="email"
            type="email"
            label="Email address"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          
          <FormInput
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <Link
              to="/reset-password"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <GoogleSignInButton
              onClick={handleGoogleSignIn}
              disabled={loading}
              text="Sign in with Google"
            />
          </div>
        </div>
      </form>
    </AuthContainer>
  );
};

export default SignIn;