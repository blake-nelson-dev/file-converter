export const getAuthErrorMessage = (errorCode: string, context: 'signin' | 'signup' | 'reset' = 'signin') => {
  // Common errors across all contexts
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    case 'auth/too-many-requests':
      return 'Too many requests. Please try again later.';
    case 'auth/popup-closed-by-user':
      return `Sign-${context === 'signup' ? 'up' : 'in'} popup was closed. Please try again.`;
    case 'auth/popup-blocked':
      return 'Popup was blocked by your browser. Please enable popups and try again.';
    case 'auth/cancelled-popup-request':
      return `Sign-${context === 'signup' ? 'up' : 'in'} was cancelled. Please try again.`;
  }

  // Context-specific errors
  if (context === 'signin') {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please check your credentials.';
      default:
        return 'An error occurred during sign in. Please try again.';
    }
  }

  if (context === 'signup') {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'An account with this email address already exists.';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled. Please contact support.';
      case 'auth/weak-password':
        return 'Password is too weak. Please choose a stronger password.';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with the same email but different sign-in credentials.';
      default:
        return 'An error occurred during account creation. Please try again.';
    }
  }

  if (context === 'reset') {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      default:
        return 'Failed to send password reset email. Please try again.';
    }
  }

  return 'An unexpected error occurred. Please try again.';
};