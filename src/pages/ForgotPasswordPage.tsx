import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ForgotPasswordPage.css'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<'email' | 'verification' | 'reset' | 'success'>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    email: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!formData.email) {
        setError('Please enter your email address')
        setLoading(false)
        return
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError('Please enter a valid email address')
        setLoading(false)
        return
      }

      // Call backend API
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      })

      if (!response.ok) {
        throw new Error('Email not found in system')
      }

      const data = await response.json()
      setSuccess(data.message || 'Verification code sent to your email')
      setStep('verification')
    } catch (err) {
      setError((err as Error).message || 'Failed to process request')
    } finally {
      setLoading(false)
    }
  }

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!formData.verificationCode) {
        setError('Please enter the verification code')
        setLoading(false)
        return
      }

      if (formData.verificationCode.length !== 6) {
        setError('Verification code must be 6 digits')
        setLoading(false)
        return
      }

      // Call backend API
      const response = await fetch('/api/auth/verify-reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          code: formData.verificationCode
        })
      })

      if (!response.ok) {
        throw new Error('Invalid or expired verification code')
      }

      setSuccess('Code verified! Now set your new password.')
      setStep('reset')
    } catch (err) {
      setError((err as Error).message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!formData.newPassword || !formData.confirmPassword) {
        setError('Please fill in all password fields')
        setLoading(false)
        return
      }

      if (formData.newPassword.length < 8) {
        setError('Password must be at least 8 characters')
        setLoading(false)
        return
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setError('Passwords do not match')
        setLoading(false)
        return
      }

      // Call backend API
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          code: formData.verificationCode,
          newPassword: formData.newPassword
        })
      })

      if (!response.ok) {
        throw new Error('Failed to reset password')
      }

      setSuccess('Password reset successfully! Redirecting to login...')
      setStep('success')
      
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError((err as Error).message || 'Password reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-bg-orb"></div>
      <div className="forgot-password-bg-orb-2"></div>

      <div className="forgot-password-container">
        <div className="forgot-password-card">
          <div className="forgot-password-header">
            <button 
              className="back-button"
              onClick={() => navigate('/login')}
              title="Back to login"
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            <h1>Recover Your Account</h1>
            <p>We'll help you regain access to your Africoin account</p>
          </div>

          {/* Progress Indicator */}
          <div className="password-reset-progress">
            <div className={`progress-step ${step === 'email' || ['verification', 'reset', 'success'].includes(step) ? 'completed' : ''}`}>
              <div className="step-circle">1</div>
              <span>Email</span>
            </div>
            <div className={`progress-line ${['verification', 'reset', 'success'].includes(step) ? 'completed' : ''}`}></div>
            <div className={`progress-step ${['verification', 'reset', 'success'].includes(step) ? 'active' : ''}`}>
              <div className="step-circle">2</div>
              <span>Verify</span>
            </div>
            <div className={`progress-line ${['reset', 'success'].includes(step) ? 'completed' : ''}`}></div>
            <div className={`progress-step ${['reset', 'success'].includes(step) ? 'active' : ''}`}>
              <div className="step-circle">3</div>
              <span>Reset</span>
            </div>
          </div>

          {error && (
            <div className="alert alert-error">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              <i className="fas fa-check-circle"></i>
              {success}
            </div>
          )}

          {/* Step 1: Email */}
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="forgot-password-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                  required
                />
                <small>We'll send a verification code to this email</small>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <i className="fas fa-envelope"></i>
                    Send Verification Code
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2: Verification */}
          {step === 'verification' && (
            <form onSubmit={handleVerificationSubmit} className="forgot-password-form">
              <div className="form-group">
                <label htmlFor="code">Verification Code</label>
                <input
                  id="code"
                  type="text"
                  name="verificationCode"
                  placeholder="000000"
                  value={formData.verificationCode}
                  onChange={handleInputChange}
                  disabled={loading}
                  maxLength={6}
                  inputMode="numeric"
                  required
                />
                <small>Enter the 6-digit code sent to {formData.email}</small>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Verifying...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check"></i>
                    Verify Code
                  </>
                )}
              </button>

              <button 
                type="button" 
                className="btn-secondary-link"
                onClick={() => setStep('email')}
              >
                Use different email
              </button>
            </form>
          )}

          {/* Step 3: Reset Password */}
          {step === 'reset' && (
            <form onSubmit={handlePasswordReset} className="forgot-password-form">
              <div className="form-group">
                <label htmlFor="new-password">New Password</label>
                <input
                  id="new-password"
                  type="password"
                  name="newPassword"
                  placeholder="••••••••"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  disabled={loading}
                  required
                />
                <small>Minimum 8 characters with numbers and symbols</small>
              </div>

              <div className="form-group">
                <label htmlFor="confirm-password">Confirm Password</label>
                <input
                  id="confirm-password"
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={loading}
                  required
                />
              </div>

              <div className="password-requirements">
                <h4>Password Requirements:</h4>
                <ul>
                  <li className={formData.newPassword.length >= 8 ? 'met' : ''}>
                    <i className="fas fa-check"></i> At least 8 characters
                  </li>
                  <li className={/[A-Z]/.test(formData.newPassword) ? 'met' : ''}>
                    <i className="fas fa-check"></i> One uppercase letter
                  </li>
                  <li className={/[a-z]/.test(formData.newPassword) ? 'met' : ''}>
                    <i className="fas fa-check"></i> One lowercase letter
                  </li>
                  <li className={/[0-9]/.test(formData.newPassword) ? 'met' : ''}>
                    <i className="fas fa-check"></i> One number
                  </li>
                  <li className={/[!@#$%^&*]/.test(formData.newPassword) ? 'met' : ''}>
                    <i className="fas fa-check"></i> One special character (!@#$%^&*)
                  </li>
                </ul>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Resetting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-lock"></i>
                    Reset Password
                  </>
                )}
              </button>
            </form>
          )}

          {/* Success State */}
          {step === 'success' && (
            <div className="success-state">
              <div className="success-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h2>Password Reset Successfully!</h2>
              <p>Your password has been updated. Redirecting to login...</p>
              <button 
                type="button" 
                className="btn-primary"
                onClick={() => navigate('/login')}
              >
                Go to Login
              </button>
            </div>
          )}

          <div className="forgot-password-footer">
            <p>Remember your password? <button type="button" className="link-button" onClick={() => navigate('/login')}>Sign in</button></p>
          </div>
        </div>
      </div>
    </div>
  )
}
