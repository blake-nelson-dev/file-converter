import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import AuthContainer from '../components/AuthContainer';
import FormInput from '../../../shared/components/FormInput';
import ErrorMessage from '../../../shared/components/ErrorMessage';
import SuccessMessage from '../../../shared/components/SuccessMessage';
import { getAuthErrorMessage } from '../utils/authErrors';

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setMessage('');
      setError('');
      setLoading(true);
      await resetPassword(email);
      setMessage('Check your inbox for password reset instructions');
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error.code, 'reset');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer
      title="Reset your password"
      subtitle="Enter your email address and we'll send you a link to reset your password."
    >
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <ErrorMessage message={error} />
        <SuccessMessage message={message} />
        
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

        <div>
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Reset Password'}
          </button>
        </div>

        <div className="text-center">
          <Link
            to="/signin"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Back to Sign In
          </Link>
        </div>
      </form>
    </AuthContainer>
  );
};

export default ResetPassword;