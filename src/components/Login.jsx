import React, { useState } from 'react';
import SiteCredit from './SiteCredit.jsx';
import WaveBackground from './WaveBackground.jsx';
import './Login.css';

function Login({ onLogin, onForgot, onSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const found = {};
    if (!email.trim()) found.email = 'Enter your email address.';
    else if (!/^\S+@\S+\.\S+$/.test(email.trim())) found.email = 'Enter a valid email address.';
    if (!password) found.password = 'Enter your password.';
    else if (password.length < 6) found.password = 'Password must be at least 6 characters.';
    return found;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    setFormError('');
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    try {
      await onLogin(email.trim(), password);
    } catch (err) {
      setFormError(err.message || 'Could not log in. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <WaveBackground />

      <div className="auth-main">
        <div className="auth-card">
          <h1 className="auth-logo">
            <span className="auth-logo-quiz">Quiz</span>
            <span className="auth-logo-buzz">Buzz</span>
          </h1>

          <form onSubmit={handleSubmit} noValidate>
            {formError && <p className="auth-banner" role="alert">{formError}</p>}

            <div className="auth-field">
              <label htmlFor="login-email" className="auth-label">Email Address</label>
              <input
                id="login-email"
                type="email"
                className={`auth-input ${errors.email ? 'invalid' : ''}`}
                placeholder="your.email@example.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="auth-field-error">{errors.email}</p>}
            </div>

            <div className="auth-field">
              <label htmlFor="login-password" className="auth-label">Password</label>
              <input
                id="login-password"
                type="password"
                className={`auth-input ${errors.password ? 'invalid' : ''}`}
                placeholder="********"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <p className="auth-field-error">{errors.password}</p>}
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="auth-links">
            <button type="button" className="auth-link" onClick={onForgot}>Forgot Password?</button>
            <button type="button" className="auth-link" onClick={onSignUp}>Sign Up</button>
          </div>

          <p className="auth-footer">
            Don't have an account?{' '}
            <button type="button" className="auth-link auth-link-strong" onClick={onSignUp}>Sign Up</button>
          </p>
        </div>
      </div>

      <SiteCredit />
    </div>
  );
}

export default Login;