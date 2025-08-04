import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import AuthContainer from '../components/AuthContainer';
import FormInput from '../../../shared/components/FormInput';
import ErrorMessage from '../../../shared/components/ErrorMessage';
import GoogleSignInButton from '../components/GoogleSignInButton';
import { getAuthErrorMessage } from '../utils/authErrors';

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.displayName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await signup(formData.email, formData.password, formData.displayName);
      navigate('/');
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error.code, 'signup');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/');
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error.code, 'signup');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer
      title="Create your account"
      subtitle={
        <>
          Or{' '}
          <Link
            to="/signin"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            sign in to your existing account
          </Link>
        </>
      }
    >
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <ErrorMessage message={error} />
        
        <div className="space-y-4">
          <FormInput
            id="displayName"
            name="displayName"
            type="text"
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.displayName}
            onChange={handleChange}
            required
            autoComplete="name"
          />
          
          <FormInput
            id="email"
            name="email"
            type="email"
            label="Email address"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
          
          <FormInput
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="Enter your password (min. 6 characters)"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
          
          <FormInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Create account'}
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
              onClick={handleGoogleSignUp}
              disabled={loading}
              text="Sign up with Google"
            />
          </div>
        </div>
      </form>
    </AuthContainer>
  );
};

export default SignUp;