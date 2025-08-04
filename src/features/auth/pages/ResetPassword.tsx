import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import AuthContainer from '../components/AuthContainer';
import FormInput from '../../../shared/components/FormInput';
import ErrorMessage from '../../../shared/components/ErrorMessage';
import SuccessMessage from '../../../shared/components/SuccessMessage';
import Button from '../../../shared/components/Button';
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
          <Button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white"
          >
            {loading ? 'Sending...' : 'Reset Password'}
          </Button>
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