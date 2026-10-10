import React, { useState, useEffect, useRef } from 'react';
import { getFirebaseAuth, getFirebaseFirestore } from '../services/firebaseConfig';
import {
  Lock,
  Mail,
  Phone,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';

interface AuthModalProps {
  onSuccess?: () => void;
}

export const AuthGateView: React.FC<AuthModalProps> = ({ onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'google' | 'email' | 'phone'>('google');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Email form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Phone OTP form state
  const [phoneNumber, setPhoneNumber] = useState('+8801');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const recaptchaVerifierRef = useRef<any>(null);

  // Unauthorized Domain helper state
  const [unauthorizedDomain, setUnauthorizedDomain] = useState<string | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);

  useEffect(() => {
    // Clear messages when tab changes
    setErrorMessage(null);
    setSuccessMessage(null);
    setUnauthorizedDomain(null);
    setCopiedDomain(false);
  }, [activeTab, isSignUp]);

  // Clean up recaptcha on unmount
  useEffect(() => {
    return () => {
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch {
          // Ignore
        }
      }
    };
  }, []);

  // 1. Google Sign-In with real popup
  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setLoading(true);
    try {
      const auth = getFirebaseAuth();
      if (!auth) {
        throw new Error('Firebase Auth লোড হতে পারেনি। পেজটি রিফ্রেশ করে আবার চেষ্টা করুন।');
      }
      const provider = new window.firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await auth.signInWithPopup(provider);
      
      // Store user profile record if firestore exists
      try {
        const db = getFirebaseFirestore();
        if (db && result.user) {
          await db.collection('users').doc(result.user.uid).set({
            uid: result.user.uid,
            displayName: result.user.displayName || 'কৃষক',
            email: result.user.email || '',
            photoURL: result.user.photoURL || '',
            lastLoginAt: window.firebase.firestore.FieldValue.serverTimestamp(),
          }, { merge: true });
        }
      } catch (dbErr) {
        console.warn('Firestore user profile sync warning:', dbErr);
      }

      setSuccessMessage('গুগল অ্যাকাউন্ট দিয়ে সফলভাবে প্রবেশ করেছেন!');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      let msg = err.message || 'গুগল সাইন-ইন সম্পন্ন করা যায়নি।';
      if (err.code === 'auth/popup-closed-by-user') {
        msg = 'লগইন উইন্ডো বন্ধ করা হয়েছে। আবার চেষ্টা করুন।';
      } else if (err.code === 'auth/cancelled-popup-request') {
        msg = 'পূর্ববর্তী অনুরোধ বাতিল হয়েছে।';
      } else if (err.code === 'auth/unauthorized-domain') {
        msg = 'এই ডোমেইনটি Firebase Console-এ অনুমোদিত নয় (OAuth Authorized Domains)। নিচে দেওয়া নির্দেশনা অনুসরণ করে ডোমেইনটি যোগ করুন:';
        setUnauthorizedDomain(typeof window !== 'undefined' ? window.location.hostname : null);
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // 2. Email & Password (Login or Sign Up)
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setErrorMessage('অনুগ্রহ করে ইমেইল ও পাসওয়ার্ড সঠিকভাবে লিখুন।');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }

    setLoading(true);
    try {
      const auth = getFirebaseAuth();
      if (!auth) {
        throw new Error('Firebase Auth লোড হতে পারেনি। পেজটি রিফ্রেশ করুন।');
      }

      if (isSignUp) {
        const userCred = await auth.createUserWithEmailAndPassword(email.trim(), password);
        if (displayName && userCred.user) {
          await userCred.user.updateProfile({ displayName: displayName.trim() });
        }
        // Save to firestore
        try {
          const db = getFirebaseFirestore();
          if (db && userCred.user) {
            await db.collection('users').doc(userCred.user.uid).set({
              uid: userCred.user.uid,
              displayName: displayName.trim() || 'কৃষক ভাই',
              email: email.trim(),
              createdAt: window.firebase.firestore.FieldValue.serverTimestamp(),
            });
          }
        } catch {
          // ignore
        }
        setSuccessMessage('আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!');
      } else {
        await auth.signInWithEmailAndPassword(email.trim(), password);
        setSuccessMessage('সফলভাবে লগইন হয়েছে!');
      }

      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Email Auth Error:', err);
      let msg = err.message;
      if (err.code === 'auth/user-not-found') {
        msg = 'এই ইমেইলে কোনো অ্যাকাউন্ট পাওয়া যায়নি। অনুগ্রহ করে নতুন একাউন্ট তৈরি করুন।';
      } else if (err.code === 'auth/wrong-password') {
        msg = 'ভুল পাসওয়ার্ড লিখেছেন। আবার চেষ্টা করুন।';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'এই ইমেইলটি ইতিপূর্বে নিবন্ধিত হয়েছে। সরাসরি লগইন করুন।';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'ইমেইল অ্যাড্রেসটি সঠিক নয়।';
      } else if (err.code === 'auth/invalid-credential') {
        msg = 'ভুল ইমেইল অথবা পাসওয়ার্ড। সঠিক তথ্য দিয়ে চেষ্টা করুন।';
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // 3. Phone OTP Flow
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!phoneNumber || phoneNumber.length < 11) {
      setErrorMessage('অনুগ্রহ করে সঠিক মোবাইল নম্বর লিখুন (যেমন: +8801712345678)।');
      return;
    }

    setLoading(true);
    try {
      const auth = getFirebaseAuth();
      if (!auth) throw new Error('Firebase Auth লোড হয়নি।');

      // Setup recaptcha container
      if (!recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current = new window.firebase.auth.RecaptchaVerifier(
          'recaptcha-container',
          {
            size: 'invisible',
            callback: () => {
              // reCAPTCHA solved
            },
          }
        );
      }

      const formattedNumber = phoneNumber.trim().startsWith('+')
        ? phoneNumber.trim()
        : `+88${phoneNumber.trim().replace(/^0/, '')}`;

      const confirmation = await auth.signInWithPhoneNumber(
        formattedNumber,
        recaptchaVerifierRef.current
      );
      window.confirmationResult = confirmation;
      setOtpSent(true);
      setSuccessMessage('আপনার নম্বরে ওটিপি কোড পাঠানো হয়েছে। অনুগ্রহ করে কোডটি প্রবেশ করান।');
    } catch (err: any) {
      console.error('Phone OTP Send Error:', err);
      let msg = err.message || 'ওটিপি পাঠাতে সমস্যা হয়েছে।';
      if (err.code === 'auth/invalid-phone-number') {
        msg = 'মোবাইল নম্বরটি সঠিক নয়। কান্ট্রি কোড সহ দিন (+880...)।';
      } else if (err.code === 'auth/quota-exceeded') {
        msg = 'এসএমএস কোটা সীমা পূর্ণ হয়েছে। কিছুক্ষণ পর চেষ্টা করুন।';
      }
      setErrorMessage(msg);
      // Reset reCAPTCHA if failed
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
          recaptchaVerifierRef.current = null;
        } catch {
          // ignore
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!otpCode || otpCode.length < 4) {
      setErrorMessage('অনুগ্রহ করে সঠিক ওটিপি কোড দিন।');
      return;
    }

    if (!window.confirmationResult) {
      setErrorMessage('ওটিপি সেশন মেয়াদোত্তীর্ণ হয়েছে। পুনরায় ওটিপি কোড পাঠান।');
      setOtpSent(false);
      return;
    }

    setLoading(true);
    try {
      const result = await window.confirmationResult.confirm(otpCode.trim());
      // Sync to firestore
      try {
        const db = getFirebaseFirestore();
        if (db && result.user) {
          await db.collection('users').doc(result.user.uid).set({
            uid: result.user.uid,
            phoneNumber: result.user.phoneNumber,
            displayName: result.user.phoneNumber,
            lastLoginAt: window.firebase.firestore.FieldValue.serverTimestamp(),
          }, { merge: true });
        }
      } catch {
        // ignore
      }
      setSuccessMessage('মোবাইল ওটিপি সফলভাবে যাচাই হয়েছে!');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('OTP Verify Error:', err);
      let msg = err.message || 'ভুল ওটিপি কোড। পুনরায় চেষ্টা করুন।';
      if (err.code === 'auth/invalid-verification-code') {
        msg = 'প্রদত্ত ওটিপি কোডটি ভুল। সঠিক ৬ সংখ্যার কোড লিখুন।';
      } else if (err.code === 'auth/code-expired') {
        msg = 'ওটিপির মেয়াদ শেষ হয়েছে। আবার নতুন কোড পাঠান।';
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F5F6F8] flex flex-col items-center justify-center p-3 sm:p-6 selection:bg-[#E2136E]/20 selection:text-[#E2136E]">
      {/* Invisible reCAPTCHA container for Phone Auth */}
      <div id="recaptcha-container"></div>

      {/* Main Auth Container - Centered and cleanly positioned */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-pink-100 overflow-hidden flex flex-col my-auto animate-fade-in">
        {/* Top bKash Brand Hero Header with Animated Village Sky */}
        <div className="bg-gradient-to-r from-[#C20F5D] via-[#D01063] to-[#E2136E] text-white p-5 sm:p-6 relative overflow-hidden text-center">
          {/* Subtle background animated sky elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-25">
            <svg
              className="w-full h-full object-cover"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 400 180"
            >
              {/* Sun Glow */}
              <circle cx="340" cy="50" r="40" fill="#FEF08A" opacity="0.6" />
              {/* Birds */}
              <g className="animate-[birdsFly_18s_linear_infinite]">
                <path d="M 60,40 Q 66,34 72,40 Q 78,34 84,40 Q 78,37 72,41 Q 66,37 60,40 Z" fill="#FFFFFF" />
                <path d="M 85,50 Q 90,45 95,50 Q 100,45 105,50 Q 100,47 95,51 Q 90,47 85,50 Z" fill="#FFFFFF" />
              </g>
              {/* Clouds */}
              <g className="animate-[villageCloudsSlow_32s_linear_infinite]">
                <path d="M 20,60 Q 40,40 65,55 Q 90,38 115,58 L 120,70 L 15,70 Z" fill="#FFFFFF" opacity="0.4" />
              </g>
            </svg>
          </div>

          {/* bKash Pink Origami Bird / Satellite Logo */}
          <div className="mx-auto w-16 h-16 bg-white rounded-2xl p-2.5 shadow-md flex items-center justify-center mb-3">
            <svg
              className="w-full h-full text-[#E2136E]"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polygon points="50,5 95,50 65,50 50,25 35,50 5,50" fill="#E2136E" />
              <polygon points="50,95 85,55 50,55 50,75 15,55" fill="#C20F5D" opacity="0.85" />
              <circle cx="50" cy="50" r="10" fill="#FFFFFF" />
              <circle cx="50" cy="50" r="5" fill="#E2136E" />
            </svg>
          </div>

          <span className="inline-block text-[11px] px-2.5 py-0.5 rounded-full bg-white/20 text-pink-100 uppercase tracking-widest mb-1.5">
            কৃষি স্পেস ইন্টেলিজেন্স • লাইভ ফায়ারবেস
          </span>
          <h1 className="text-xl sm:text-2xl text-white font-normal tracking-tight">
            এগ্রিকাস্ট (AgriCast)
          </h1>
          <p className="text-xs text-pink-100 mt-1 max-w-xs mx-auto font-normal">
            কৃষকের বিশ্বস্ত নাসার স্যাটেলাইট ও নাসা জিআইবিএস ভিত্তিক কৃষি ব্যবস্থাপনা
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-[11px] font-normal">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>সুরক্ষিত প্রোডাকশন একাউন্ট (khetdrishti.firebaseapp.com)</span>
          </div>
        </div>

        {/* Auth Method Navigation Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/70 p-1">
          <button
            type="button"
            onClick={() => setActiveTab('google')}
            className={`flex-1 py-2.5 px-2 text-xs text-center rounded-xl transition-all flex items-center justify-center gap-1.5 font-normal ${
              activeTab === 'google'
                ? 'bg-white text-[#E2136E] shadow-sm border border-pink-100'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>গুগল লগইন</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('email')}
            className={`flex-1 py-2.5 px-2 text-xs text-center rounded-xl transition-all flex items-center justify-center gap-1.5 font-normal ${
              activeTab === 'email'
                ? 'bg-white text-[#E2136E] shadow-sm border border-pink-100'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Mail className="w-4 h-4 shrink-0 text-[#E2136E]" />
            <span>ইমেইল ও পাসওয়ার্ড</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('phone')}
            className={`flex-1 py-2.5 px-2 text-xs text-center rounded-xl transition-all flex items-center justify-center gap-1.5 font-normal ${
              activeTab === 'phone'
                ? 'bg-white text-[#E2136E] shadow-sm border border-pink-100'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Phone className="w-4 h-4 shrink-0 text-[#E2136E]" />
            <span>মোবাইল ওটিপি</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 sm:p-6 flex flex-col gap-4">
          {/* Status Notifications */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex flex-col gap-2.5 animate-fadeIn font-normal">
              <div className="flex items-start gap-2 font-normal">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                <div className="flex-1 leading-relaxed font-normal">{errorMessage}</div>
              </div>

              {unauthorizedDomain && (
                <div className="mt-1 p-3 bg-white rounded-xl border border-red-100 flex flex-col gap-2 font-normal text-gray-700">
                  <div className="text-[11px] text-gray-500 font-normal">
                    অনুমোদন করার জন্য বর্তমান প্রিভিউ ডোমেইন:
                  </div>
                  <div className="flex items-center justify-between gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200 text-[11px] text-gray-800 break-all font-normal">
                    <span className="font-normal select-all">{unauthorizedDomain}</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(unauthorizedDomain);
                          setCopiedDomain(true);
                          setTimeout(() => setCopiedDomain(false), 2000);
                        }
                      }}
                      className="shrink-0 px-2.5 py-1 bg-[#E2136E] text-white rounded-md text-[11px] flex items-center gap-1 hover:bg-[#C20F5D] transition-colors cursor-pointer font-normal"
                    >
                      {copiedDomain ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span className="font-normal">কপি হয়েছে</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span className="font-normal">কপি করুন</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-[11px] text-gray-600 leading-normal flex flex-col gap-1 font-normal pt-1">
                    <div className="font-normal">১. ফায়ারবেস কনসোলে যান:</div>
                    <a
                      href="https://console.firebase.google.com/project/khetdrishti/authentication/settings"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#E2136E] hover:underline text-[11px] font-normal"
                    >
                      <span className="font-normal">khetdrishti &gt; Authentication &gt; Settings &gt; Authorized domains</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <div className="font-normal">২. "Add domain" বাটনে ক্লিক করে উপরের ডোমেইনটি পেস্ট করে সেভ করুন।</div>
                  </div>

                  <div className="mt-1 pt-2 border-t border-gray-100 flex items-center justify-between font-normal">
                    <span className="text-[11px] text-gray-500 font-normal">দ্রুত সাইন-ইন করতে চান?</span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('email');
                        setErrorMessage(null);
                        setUnauthorizedDomain(null);
                      }}
                      className="text-[11px] text-[#E2136E] hover:underline cursor-pointer font-normal"
                    >
                      ইমেইল ও পাসওয়ার্ড দিয়ে প্রবেশ করুন &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-start gap-2 animate-fadeIn font-normal">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <div className="flex-1 leading-relaxed font-normal">{successMessage}</div>
            </div>
          )}

          {/* TAB 1: GOOGLE SIGN-IN */}
          {activeTab === 'google' && (
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center mb-4 text-[#E2136E]">
                <Sparkles className="w-8 h-8 text-[#E2136E] animate-pulse" />
              </div>
              <h3 className="text-base text-gray-900 font-normal mb-1">
                এক ক্লিকে গুগল সাইন-ইন
              </h3>
              <p className="text-xs text-gray-500 font-normal max-w-xs mb-6">
                আপনার গুগল একাউন্টের নাম, ছবি এবং ইমেইল স্বয়ংক্রিয়ভাবে এগ্রিকাস্টে (AgriCast) যুক্ত হবে।
              </p>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-3.5 px-4 bg-[#E2136E] hover:bg-[#C20F5D] active:scale-[0.99] text-white rounded-xl shadow-md shadow-pink-500/20 transition-all flex items-center justify-center gap-3 font-normal text-sm disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 text-white animate-spin" />
                ) : (
                  <svg className="w-5 h-5 shrink-0 bg-white p-0.5 rounded-full" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>{loading ? 'যাচাই করা হচ্ছে...' : 'Google দিয়ে চালিয়ে যান'}</span>
              </button>

              <div className="mt-4 text-[11px] text-gray-500 font-normal">
                প্রোজেক্ট আইডি: <span className="text-[#E2136E]">khetdrishti</span>
              </div>
            </div>
          )}

          {/* TAB 2: EMAIL & PASSWORD */}
          {activeTab === 'email' && (
            <form onSubmit={handleEmailAuth} className="flex flex-col gap-3.5">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs text-gray-700 font-normal">
                  {isSignUp ? 'নতুন একাউন্ট তৈরি করুন' : 'ইমেইল দিয়ে লগইন করুন'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-xs text-[#E2136E] hover:underline font-normal cursor-pointer"
                >
                  {isSignUp ? 'ইতিমধ্যে একাউন্ট আছে? লগইন' : 'নতুন একাউন্ট খুলবেন? সাইন-আপ'}
                </button>
              </div>

              {isSignUp && (
                <div>
                  <label className="block text-xs text-gray-600 mb-1 font-normal">
                    আপনার নাম (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="যেমন: মোঃ রফিকুল ইসলাম"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E2136E] focus:ring-1 focus:ring-[#E2136E] text-xs bg-gray-50/50 font-normal"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs text-gray-600 mb-1 font-normal">
                  ইমেইল অ্যাড্রেস
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="farmer@example.com"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E2136E] focus:ring-1 focus:ring-[#E2136E] text-xs bg-gray-50/50 font-normal"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1 font-normal">
                  পাসওয়ার্ড
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E2136E] focus:ring-1 focus:ring-[#E2136E] text-xs bg-gray-50/50 font-normal"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 bg-[#E2136E] hover:bg-[#C20F5D] active:scale-[0.99] text-white rounded-xl shadow-md shadow-pink-500/20 transition-all flex items-center justify-center gap-2 font-normal text-xs sm:text-sm disabled:opacity-70 cursor-pointer"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4 text-white" />
                )}
                <span>
                  {loading
                    ? 'অপেক্ষা করুন...'
                    : isSignUp
                    ? 'নিবন্ধন সম্পন্ন করুন'
                    : 'লগইন করুন'}
                </span>
              </button>
            </form>
          )}

          {/* TAB 3: PHONE OTP */}
          {activeTab === 'phone' && (
            <div className="flex flex-col gap-3.5">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="flex flex-col gap-3.5">
                  <p className="text-xs text-gray-500 font-normal">
                    আপনার সচল মোবাইল নম্বর দিন। আমরা একটি যাচাইকরণ কোড (OTP) পাঠাব।
                  </p>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1 font-normal">
                      মোবাইল নম্বর (+880...)
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+8801712345678"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E2136E] focus:ring-1 focus:ring-[#E2136E] text-xs bg-gray-50/50 font-normal"
                      />
                      <Smartphone className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-1 py-3 px-4 bg-[#E2136E] hover:bg-[#C20F5D] text-white rounded-xl shadow-md shadow-pink-500/20 transition-all flex items-center justify-center gap-2 font-normal text-xs sm:text-sm disabled:opacity-70 cursor-pointer"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 text-white animate-spin" />
                    ) : (
                      <Phone className="w-4 h-4 text-white" />
                    )}
                    <span>{loading ? 'এসএমএস পাঠানো হচ্ছে...' : 'ওটিপি কোড পাঠান'}</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="flex flex-col gap-3.5">
                  <div className="p-3 bg-pink-50 border border-pink-100 rounded-xl text-xs text-[#E2136E] flex items-center justify-between font-normal">
                    <span>প্রেরিত নম্বর: {phoneNumber}</span>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-xs underline text-[#C20F5D] cursor-pointer"
                    >
                      নম্বর পরিবর্তন
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1 font-normal">
                      ৬ সংখ্যার ওটিপি (OTP) কোড
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-full tracking-widest text-center py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E2136E] focus:ring-1 focus:ring-[#E2136E] text-base bg-gray-50/50 font-normal"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-1 py-3 px-4 bg-[#E2136E] hover:bg-[#C20F5D] text-white rounded-xl shadow-md shadow-pink-500/20 transition-all flex items-center justify-center gap-2 font-normal text-xs sm:text-sm disabled:opacity-70 cursor-pointer"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 text-white animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    )}
                    <span>{loading ? 'যাচাই করা হচ্ছে...' : 'ওটিপি নিশ্চিত করে প্রবেশ করুন'}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Quick Footer Security Note */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[11px] text-gray-400 font-normal">
            <Lock className="w-3 h-3 text-emerald-500" />
            <span>নিরাপদ ফায়ারবেস অথেন্টিকেশন এন্ডপয়েন্ট সক্রিয়</span>
          </div>
        </div>
      </div>
    </div>
  );
};
