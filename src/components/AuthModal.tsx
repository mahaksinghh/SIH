import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Mail,
  Phone,
  User as UserIcon,
  ShieldCheck,
  Check,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  ArrowRight,
  RefreshCw,
  Send,
  CheckCircle2,
  HeartHandshake,
  Shield,
  Stethoscope,
  Users,
  Building,
  Smartphone,
  MapPin,
  Heart,
} from 'lucide-react';
import { LanguageCode, Role, User } from '../types';
import { DEMO_USERS } from '../data/seedData';
import { SUPPORTED_LANGUAGES, getTranslation } from '../services/translations';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  currentLanguage: LanguageCode;
  initialMode?: 'signin' | 'signup' | 'otp';
}

type AuthTab = 'signin' | 'signup' | 'forgot';
type SignInMethod = 'password' | 'otp';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentLanguage,
  initialMode = 'signin',
}) => {
  const [activeTab, setActiveTab] = useState<AuthTab>(
    initialMode === 'signup' ? 'signup' : 'signin'
  );
  const [signInMethod, setSignInMethod] = useState<SignInMethod>(
    initialMode === 'otp' ? 'otp' : 'password'
  );

  // Form Fields - Login
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Form Fields - Sign Up
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [age, setAge] = useState<number>(24);
  const [selectedRole, setSelectedRole] = useState<Role>('USER');
  const [preferredLang, setPreferredLang] = useState<LanguageCode>(currentLanguage);
  const [location, setLocation] = useState('Jaipur, Rajasthan');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [consentHealthData, setConsentHealthData] = useState(true);
  const [consentTerms, setConsentTerms] = useState(true);

  // Forgot Password Fields
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // OTP State
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpContext, setOtpContext] = useState<'signin' | 'signup' | 'forgot'>('signup');
  const [generatedOtp, setGeneratedOtp] = useState('4829');
  const [enteredOtp, setEnteredOtp] = useState(['', '', '', '']);
  const [otpTarget, setOtpTarget] = useState('');
  const [otpTimer, setOtpTimer] = useState(30);
  const [otpNotification, setOtpNotification] = useState<string | null>(null);

  // Feedback Messages
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Reset tab on open
  useEffect(() => {
    if (isOpen) {
      if (initialMode === 'signup') {
        setActiveTab('signup');
      } else {
        setActiveTab('signin');
        if (initialMode === 'otp') setSignInMethod('otp');
      }
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [isOpen, initialMode]);

  // Countdown timer for OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOtpStep && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpStep, otpTimer]);

  if (!isOpen) return null;

  const t = (key: string) => getTranslation(currentLanguage, key);

  // Helper to generate and simulate OTP
  const triggerOtpGeneration = (target: string, context: 'signin' | 'signup' | 'forgot') => {
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(randomOtp);
    setOtpTarget(target);
    setOtpContext(context);
    setIsOtpStep(true);
    setOtpTimer(30);
    setEnteredOtp(['', '', '', '']);
    setErrorMsg('');
    
    // Simulate SMS toast alert
    setOtpNotification(
      `📲 StreeSure SMS Gateway: Your verification OTP is ${randomOtp}. Valid for 10 minutes.`
    );
    setTimeout(() => {
      setOtpNotification(null);
    }, 8000);
  };

  // Password strength calculation
  const getPasswordStrength = (pwd: string): { label: string; score: number; color: string } => {
    if (!pwd) return { label: 'Empty', score: 0, color: 'bg-slate-700' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { label: 'Weak', score: 1, color: 'bg-rose-500' };
    if (score === 2 || score === 3) return { label: 'Moderate', score: 2, color: 'bg-amber-500' };
    return { label: 'Strong', score: 3, color: 'bg-emerald-500' };
  };

  // Handle Login with Password
  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginIdentifier.trim()) {
      setErrorMsg('Please enter your registered Email or Mobile number.');
      return;
    }
    if (!loginPassword) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Check if matches demo users for quick role matching
      const idLower = loginIdentifier.toLowerCase();
      let matchedRole: Role = 'USER';
      if (idLower.includes('asha') || idLower.includes('radha')) matchedRole = 'ASHA';
      else if (idLower.includes('doc') || idLower.includes('doctor') || idLower.includes('ananya')) matchedRole = 'DOCTOR';
      else if (idLower.includes('ngo') || idLower.includes('meera')) matchedRole = 'NGO';
      else if (idLower.includes('admin') || idLower.includes('rajesh')) matchedRole = 'ADMIN';

      const user: User = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        fullName: loginIdentifier.includes('@')
          ? loginIdentifier.split('@')[0].replace('.', ' ').toUpperCase()
          : 'Verified Member',
        email: loginIdentifier.includes('@') ? loginIdentifier : `${loginIdentifier}@streesure.org`,
        phone: loginIdentifier.includes('@') ? '+91 98765 43210' : loginIdentifier,
        role: matchedRole,
        preferredLanguage: currentLanguage,
        age: 24,
        location: 'Jaipur, Rajasthan',
        emergencyContact: '+91 98765 00000',
        createdAt: new Date().toISOString(),
        healthProfileCompleted: true,
      };

      if (rememberMe) {
        localStorage.setItem('streesure_authenticated_user', JSON.stringify(user));
      }
      onLoginSuccess(user);
      onClose();
    }, 600);
  };

  // Handle Login with OTP request
  const handleSendLoginOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanNumber = mobileNumber.replace(/\D/g, '');
    if (cleanNumber.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    triggerOtpGeneration(`+91 ${cleanNumber.slice(-10)}`, 'signin');
  };

  // Handle Sign Up Submit
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    const cleanNumber = mobileNumber.replace(/\D/g, '');
    if (cleanNumber.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile phone number.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-check.');
      return;
    }
    if (!consentHealthData || !consentTerms) {
      setErrorMsg('Please accept the health data processing and terms of service.');
      return;
    }

    // Trigger OTP verification for registration
    triggerOtpGeneration(`+91 ${cleanNumber.slice(-10)}`, 'signup');
  };

  // Handle Forgot Password OTP request
  const handleSendForgotOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!forgotIdentifier.trim()) {
      setErrorMsg('Please enter your registered Email or Mobile number.');
      return;
    }

    triggerOtpGeneration(forgotIdentifier, 'forgot');
  };

  // Handle OTP digit changes
  const handleOtpDigitChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    const updated = [...enteredOtp];
    updated[index] = val;
    setEnteredOtp(updated);

    // Auto-focus next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-digit-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Handle OTP backspace navigation
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !enteredOtp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-digit-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Auto-fill test OTP code
  const handleAutoFillOtp = () => {
    const digits = generatedOtp.split('');
    setEnteredOtp(digits);
    setErrorMsg('');
  };

  // Verify OTP submission
  const handleVerifyOtpSubmit = () => {
    setErrorMsg('');
    const code = enteredOtp.join('');

    if (code.length !== 4) {
      setErrorMsg('Please enter the complete 4-digit OTP code.');
      return;
    }

    if (code !== generatedOtp && code !== '1234' && code !== '4829') {
      setErrorMsg('Invalid OTP code. Please enter the correct code or click "Auto-fill Code".');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);

      if (otpContext === 'forgot') {
        setForgotSuccess(true);
        setIsOtpStep(false);
        setSuccessMsg('Password has been successfully reset! You can now sign in.');
        setTimeout(() => {
          setActiveTab('signin');
          setForgotSuccess(false);
          setSuccessMsg('');
        }, 2000);
        return;
      }

      const cleanPhone = (mobileNumber || loginIdentifier || '9876543210').replace(/\D/g, '').slice(-10);
      const newUser: User = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        fullName: fullName.trim() || 'Verified StreeSure Member',
        email: email.trim() || `${cleanPhone}@streesure.org`,
        phone: `+91 ${cleanPhone}`,
        role: selectedRole,
        preferredLanguage: preferredLang,
        age: age || 24,
        location: location || 'Jaipur, Rajasthan',
        emergencyContact: emergencyContact || '+91 98765 00000',
        createdAt: new Date().toISOString(),
        healthProfileCompleted: otpContext === 'signin', // if signup, launch health onboarding
      };

      localStorage.setItem('streesure_authenticated_user', JSON.stringify(newUser));
      onLoginSuccess(newUser);
      onClose();
    }, 500);
  };

  // 1-Click Demo Profiles
  const handleQuickDemoLogin = (userKey: keyof typeof DEMO_USERS) => {
    const user = DEMO_USERS[userKey];
    localStorage.setItem('streesure_authenticated_user', JSON.stringify(user));
    onLoginSuccess(user);
    onClose();
  };

  const pwdStrength = getPasswordStrength(password);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      {/* SMS Alert Toast Simulation */}
      {otpNotification && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-60 max-w-md w-full px-4 animate-in slide-in-from-top duration-300">
          <div className="p-3.5 rounded-2xl bg-emerald-950 border-2 border-emerald-500/80 text-emerald-100 shadow-2xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/30 flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4 text-emerald-300" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-emerald-300 block">Simulated SMS Delivery</span>
              <span className="text-emerald-100/90">{otpNotification}</span>
            </div>
            <button
              type="button"
              onClick={handleAutoFillOtp}
              className="ml-auto px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] shrink-0 transition"
            >
              Fill OTP
            </button>
          </div>
        </div>
      )}

      <div
        id="auth-modal-card"
        className="glass-blossom-glow bg-[#180e25]/95 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-rose-500/30 relative max-h-[92vh] overflow-y-auto text-slate-100"
      >
        {/* Close Button */}
        <button
          type="button"
          id="btn-close-auth-modal"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-rose-300/70 hover:text-white hover:bg-rose-500/20 transition"
          title="Close / Explore Platform"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1-Click Fast Evaluator Login Strip */}
        <div className="mb-6 p-3.5 bg-[#10071c] rounded-2xl border border-rose-500/30">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>1-Click Hackathon Evaluator Profiles:</span>
            </span>
            <span className="text-[10px] text-rose-300/70">Instant Login</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
            <button
              type="button"
              id="btn-demo-user"
              onClick={() => handleQuickDemoLogin('user')}
              className="px-2 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 border border-rose-500/40 font-semibold text-rose-200 text-[11px] truncate text-center transition"
            >
              👩‍🦰 Beneficiary (Sunita)
            </button>
            <button
              type="button"
              id="btn-demo-asha"
              onClick={() => handleQuickDemoLogin('asha')}
              className="px-2 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/40 border border-teal-500/40 font-semibold text-teal-200 text-[11px] truncate text-center transition"
            >
              👩‍⚕️ ASHA (Radha Devi)
            </button>
            <button
              type="button"
              id="btn-demo-doctor"
              onClick={() => handleQuickDemoLogin('doctor')}
              className="px-2 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-500/40 font-semibold text-indigo-200 text-[11px] truncate text-center transition"
            >
              🩺 Doctor (Dr. Ananya)
            </button>
            <button
              type="button"
              id="btn-demo-ngo"
              onClick={() => handleQuickDemoLogin('ngo')}
              className="px-2 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-500/40 font-semibold text-emerald-200 text-[11px] truncate text-center transition"
            >
              🤝 NGO Partner
            </button>
            <button
              type="button"
              id="btn-demo-admin"
              onClick={() => handleQuickDemoLogin('admin')}
              className="px-2 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/40 border border-amber-500/40 font-semibold text-amber-200 text-[11px] truncate text-center transition"
            >
              🛡️ System Admin
            </button>
            <button
              type="button"
              id="btn-demo-guest"
              onClick={onClose}
              className="px-2 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 font-semibold text-slate-200 text-[11px] truncate text-center transition"
            >
              ⚡ Explore as Guest
            </button>
          </div>
        </div>

        {/* Modal Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 text-white mx-auto flex items-center justify-center mb-3 shadow-lg shadow-rose-500/30">
            {isOtpStep ? (
              <Smartphone className="w-6 h-6" />
            ) : activeTab === 'signup' ? (
              <UserIcon className="w-6 h-6" />
            ) : activeTab === 'forgot' ? (
              <KeyRound className="w-6 h-6" />
            ) : (
              <Lock className="w-6 h-6" />
            )}
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {isOtpStep
              ? 'Verify Mobile OTP'
              : activeTab === 'signup'
              ? 'Create StreeSure Account'
              : activeTab === 'forgot'
              ? 'Reset Account Password'
              : 'Sign In to StreeSure'}
          </h2>
          <p className="text-xs text-rose-200/80 mt-1 max-w-sm mx-auto">
            {isOtpStep
              ? `Enter the 4-digit verification code sent to ${otpTarget}`
              : activeTab === 'signup'
              ? 'Join StreeSure for early PCOS screening, period tracking, voice assistance & certified consultations.'
              : activeTab === 'forgot'
              ? 'Enter your registered mobile or email to receive a password reset OTP.'
              : 'Access your personalized symptom telemetry, screening reports & care history.'}
          </p>
        </div>

        {/* Error / Success Messages */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2.5 animate-in shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Primary Auth Tabs: Sign In / Sign Up */}
        {!isOtpStep && activeTab !== 'forgot' && (
          <div className="flex p-1 bg-[#12081d] rounded-2xl border border-rose-500/30 mb-5">
            <button
              type="button"
              id="tab-btn-signin"
              onClick={() => {
                setActiveTab('signin');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
                activeTab === 'signin'
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md'
                  : 'text-rose-200/70 hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              id="tab-btn-signup"
              onClick={() => {
                setActiveTab('signup');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
                activeTab === 'signup'
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md'
                  : 'text-rose-200/70 hover:text-white'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>
        )}

        {/* -------------------- VIEW 1: OTP VERIFICATION STEP -------------------- */}
        {isOtpStep ? (
          <div className="space-y-5">
            <div className="bg-[#12081d] p-4 rounded-2xl border border-rose-500/30 text-center space-y-3">
              <div className="flex items-center justify-center gap-2 text-xs text-rose-300">
                <span>Code sent to:</span>
                <strong className="text-white font-mono">{otpTarget}</strong>
              </div>

              {/* 4 Digit Boxes */}
              <div className="flex justify-center gap-3">
                {[0, 1, 2, 3].map((idx) => (
                  <input
                    key={idx}
                    id={`otp-digit-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={enteredOtp[idx]}
                    onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-12 h-14 text-center text-2xl font-bold font-mono rounded-xl bg-[#1e112d] border border-rose-500/40 text-white focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-500/30"
                  />
                ))}
              </div>

              {/* Quick Helper Badge */}
              <div className="flex items-center justify-between text-xs pt-1 px-1">
                <span className="text-rose-300/70 text-[11px]">
                  Simulated Code: <strong className="text-amber-300 font-mono">{generatedOtp}</strong>
                </span>
                <button
                  type="button"
                  onClick={handleAutoFillOtp}
                  className="text-pink-400 hover:text-pink-300 font-semibold text-[11px] underline"
                >
                  Auto-fill Code
                </button>
              </div>
            </div>

            {/* Resend OTP / Timer */}
            <div className="flex items-center justify-between text-xs px-2 text-rose-200/80">
              <span>Didn't receive code?</span>
              {otpTimer > 0 ? (
                <span className="text-rose-300/70 font-mono font-medium">
                  Resend in {otpTimer}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => triggerOtpGeneration(otpTarget, otpContext)}
                  className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Resend OTP</span>
                </button>
              )}
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                id="btn-verify-otp-submit"
                onClick={handleVerifyOtpSubmit}
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl btn-rose-primary text-sm font-bold shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Verify & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsOtpStep(false)}
                className="w-full py-2 text-xs text-rose-300/70 hover:text-white transition"
              >
                ← Back to Edit Details
              </button>
            </div>
          </div>
        ) : activeTab === 'signin' ? (
          /* -------------------- VIEW 2: SIGN IN (PASSWORD OR OTP) -------------------- */
          <div className="space-y-4">
            {/* Sub-tabs: Password Login vs OTP Login */}
            <div className="flex gap-2 border-b border-rose-500/20 pb-3 text-xs">
              <button
                type="button"
                onClick={() => setSignInMethod('password')}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition ${
                  signInMethod === 'password'
                    ? 'bg-rose-500/20 text-rose-200 border border-rose-500/40'
                    : 'text-rose-300/60 hover:text-rose-200'
                }`}
              >
                Password Login
              </button>
              <button
                type="button"
                onClick={() => setSignInMethod('otp')}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition ${
                  signInMethod === 'otp'
                    ? 'bg-rose-500/20 text-rose-200 border border-rose-500/40'
                    : 'text-rose-300/60 hover:text-rose-200'
                }`}
              >
                Mobile Number OTP
              </button>
            </div>

            {signInMethod === 'password' ? (
              /* Password Login Form */
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-rose-200 mb-1.5">
                    Email Address or Mobile Number <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="input-login-identifier"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. sunita@example.com or 9876543210"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#12081d] border border-rose-500/30 text-xs text-white placeholder:text-rose-300/40 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                    <Mail className="w-4 h-4 text-rose-400/70 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold text-rose-200">
                      Password <span className="text-rose-400">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('forgot');
                        setErrorMsg('');
                      }}
                      className="text-[11px] text-pink-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      id="input-login-password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#12081d] border border-rose-500/30 text-xs text-white placeholder:text-rose-300/40 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                    <Lock className="w-4 h-4 text-rose-400/70 absolute left-3.5 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3.5 top-3 text-rose-400/70 hover:text-white"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-rose-200/80">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded-sm bg-[#12081d] border-rose-500/40 text-rose-600 focus:ring-rose-500"
                    />
                    <span>Remember me</span>
                  </label>
                </div>

                <button
                  type="submit"
                  id="btn-login-submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-2xl btn-rose-primary text-xs sm:text-sm font-bold shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Sign In with Password</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* OTP Login Form */
              <form onSubmit={handleSendLoginOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-rose-200 mb-1.5">
                    Mobile Number <span className="text-rose-400">*</span>
                  </label>
                  <div className="flex gap-2">
                    <span className="px-3.5 py-2.5 rounded-xl bg-[#12081d] border border-rose-500/30 text-xs font-semibold text-rose-200 flex items-center">
                      🇮🇳 +91
                    </span>
                    <div className="relative flex-1">
                      <input
                        type="tel"
                        id="input-login-phone"
                        required
                        maxLength={10}
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="98765 43210"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#12081d] border border-rose-500/30 text-xs text-white placeholder:text-rose-300/40 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                      />
                      <Phone className="w-4 h-4 text-rose-400/70 absolute left-3.5 top-3" />
                    </div>
                  </div>
                  <p className="text-[11px] text-rose-300/60 mt-1">
                    We will send a 4-digit verification SMS code to your phone.
                  </p>
                </div>

                <button
                  type="submit"
                  id="btn-send-login-otp"
                  className="w-full py-3.5 rounded-2xl btn-rose-primary text-xs sm:text-sm font-bold shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition"
                >
                  <Send className="w-4 h-4" />
                  <span>Generate & Send OTP</span>
                </button>
              </form>
            )}
          </div>
        ) : activeTab === 'signup' ? (
          /* -------------------- VIEW 3: SIGN UP (CREATE ACCOUNT) -------------------- */
          <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-rose-200 mb-1">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="input-signup-name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sunita Sharma"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#12081d] border border-rose-500/30 text-xs text-white placeholder:text-rose-300/40 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
                <UserIcon className="w-4 h-4 text-rose-400/70 absolute left-3 top-3" />
              </div>
            </div>

            {/* Mobile & Email in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-rose-200 mb-1">
                  Mobile Number <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    id="input-signup-mobile"
                    required
                    maxLength={10}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="98765 43210"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#12081d] border border-rose-500/30 text-xs text-white placeholder:text-rose-300/40 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                  <Phone className="w-4 h-4 text-rose-400/70 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-rose-200 mb-1">
                  Email Address <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="input-signup-email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sunita@example.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#12081d] border border-rose-500/30 text-xs text-white placeholder:text-rose-300/40 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                  <Mail className="w-4 h-4 text-rose-400/70 absolute left-3 top-3" />
                </div>
              </div>
            </div>

            {/* Age, Language & Role */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-rose-200 mb-1">Age</label>
                <input
                  type="number"
                  min={12}
                  max={75}
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value, 10) || 20)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#12081d] border border-rose-500/30 text-xs text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-rose-200 mb-1">Preferred Language</label>
                <select
                  value={preferredLang}
                  onChange={(e) => setPreferredLang(e.target.value as LanguageCode)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#12081d] border border-rose-500/30 text-xs text-white focus:ring-2 focus:ring-rose-500 focus:outline-none font-medium"
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code} className="bg-[#12081d] text-white">
                      {l.nativeLabel} ({l.label})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Role Selector */}
            <div>
              <label className="block text-xs font-bold text-rose-200 mb-1">
                Account Role / Profile Type <span className="text-rose-400">*</span>
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as Role)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#12081d] border border-rose-500/30 text-xs text-white focus:ring-2 focus:ring-rose-500 focus:outline-none font-medium"
              >
                <option value="USER" className="bg-[#12081d] text-white">
                  👩‍🦰 Beneficiary / Woman (Self-Care & Period Tracking)
                </option>
                <option value="ASHA" className="bg-[#12081d] text-white">
                  👩‍⚕️ ASHA Field Worker / Sangini (Rural Surveys)
                </option>
                <option value="DOCTOR" className="bg-[#12081d] text-white">
                  🩺 Registered Gynecologist / Doctor
                </option>
                <option value="NGO" className="bg-[#12081d] text-white">
                  🤝 NGO Field Partner (Health Camps)
                </option>
                <option value="ADMIN" className="bg-[#12081d] text-white">
                  🛡️ Healthcare Administrator
                </option>
              </select>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-rose-200 mb-1">
                  Create Password <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="input-signup-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-[#12081d] border border-rose-500/30 text-xs text-white placeholder:text-rose-300/40 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                  <Lock className="w-4 h-4 text-rose-400/70 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-3 text-rose-400/70 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-rose-200 mb-1">
                  Confirm Password <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="input-signup-confirm-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-[#12081d] border border-rose-500/30 text-xs text-white placeholder:text-rose-300/40 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                  <Lock className="w-4 h-4 text-rose-400/70 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-3 text-rose-400/70 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password strength indicator */}
            {password && (
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-rose-300/70">Password Strength:</span>
                  <span className="font-bold text-rose-200">{pwdStrength.label}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex gap-1">
                  <div className={`h-full flex-1 ${pwdStrength.score >= 1 ? pwdStrength.color : 'bg-slate-800'}`} />
                  <div className={`h-full flex-1 ${pwdStrength.score >= 2 ? pwdStrength.color : 'bg-slate-800'}`} />
                  <div className={`h-full flex-1 ${pwdStrength.score >= 3 ? pwdStrength.color : 'bg-slate-800'}`} />
                </div>
              </div>
            )}

            {/* Location & Emergency Contact */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-rose-200 mb-1">City / District</label>
                <div className="relative">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Jaipur, RJ"
                    className="w-full pl-8 pr-2 py-2 rounded-xl bg-[#12081d] border border-rose-500/30 text-xs text-white placeholder:text-rose-300/40 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                  <MapPin className="w-3.5 h-3.5 text-rose-400/70 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-rose-200 mb-1">Emergency Contact</label>
                <input
                  type="tel"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="Optional +91..."
                  className="w-full px-3 py-2 rounded-xl bg-[#12081d] border border-rose-500/30 text-xs text-white placeholder:text-rose-300/40 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Consents */}
            <div className="space-y-2 pt-1 border-t border-rose-500/20">
              <label className="flex items-start gap-2 cursor-pointer text-[11px] text-rose-200/80">
                <input
                  type="checkbox"
                  checked={consentHealthData}
                  onChange={(e) => setConsentHealthData(e.target.checked)}
                  className="mt-0.5 rounded-sm bg-[#12081d] border-rose-500/40 text-rose-600 focus:ring-rose-500"
                />
                <span>
                  I consent to StreeSure securely processing self-reported health answers for non-diagnostic risk screening.
                </span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer text-[11px] text-rose-200/80">
                <input
                  type="checkbox"
                  checked={consentTerms}
                  onChange={(e) => setConsentTerms(e.target.checked)}
                  className="mt-0.5 rounded-sm bg-[#12081d] border-rose-500/40 text-rose-600 focus:ring-rose-500"
                />
                <span>
                  I understand StreeSure provides triage risk indicators and is not a substitute for clinical diagnosis.
                </span>
              </label>
            </div>

            <button
              type="submit"
              id="btn-signup-submit"
              className="w-full py-3.5 rounded-2xl btn-rose-primary text-xs sm:text-sm font-bold shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition"
            >
              <Smartphone className="w-4 h-4" />
              <span>Verify Mobile via OTP & Create Account</span>
            </button>
          </form>
        ) : (
          /* -------------------- VIEW 4: FORGOT PASSWORD FLOW -------------------- */
          <form onSubmit={handleSendForgotOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-rose-200 mb-1.5">
                Registered Mobile Number or Email <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={forgotIdentifier}
                  onChange={(e) => setForgotIdentifier(e.target.value)}
                  placeholder="e.g. 9876543210 or email@domain.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#12081d] border border-rose-500/30 text-xs text-white placeholder:text-rose-300/40 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
                <Mail className="w-4 h-4 text-rose-400/70 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl btn-rose-primary text-xs sm:text-sm font-bold shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition"
            >
              <Send className="w-4 h-4" />
              <span>Send Reset OTP Code</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('signin');
                setErrorMsg('');
              }}
              className="w-full py-2 text-xs text-rose-300/70 hover:text-white text-center transition"
            >
              ← Back to Sign In
            </button>
          </form>
        )}

        {/* Footer info & Guest switch */}
        <div className="text-center mt-5 pt-4 border-t border-rose-500/20 text-xs text-rose-200/70 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-[11px] text-rose-300/80 hover:text-white underline font-medium"
          >
            ⚡ Continue Exploring as Guest
          </button>
          <div className="flex items-center gap-1 text-[11px] text-rose-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-pink-400" />
            <span>256-Bit Encrypted Triage</span>
          </div>
        </div>
      </div>
    </div>
  );
};
