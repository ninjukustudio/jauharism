import React, { useState, useEffect } from "react";
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
} from "../services/firebase.ts";
import { X, Lock, Mail, User as UserIcon, Sparkles, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "signin" | "signup";
  contextMessage?: string | null;
  onAuthSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = "signin",
  contextMessage = null,
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError(null);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (mode === "signup") {
        await signUpWithEmail(email, password, displayName);
      } else {
        await signInWithEmail(email, password);
      }
      onClose();
      if (onAuthSuccess) onAuthSuccess();
    } catch (err: any) {
      console.error("Auth error:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please sign in instead.");
      } else if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        setError("Invalid email or password. Please verify and try again.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError(err.message || "Authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      onClose();
      if (onAuthSuccess) onAuthSuccess();
    } catch (err: any) {
      console.error("Google sign in error:", err);
      if (err.code !== "auth/popup-closed-by-user") {
        setError(err.message || "Failed to sign in with Google.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#060E1D]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md rounded-2xl bg-[#0A192F] border border-[#D4AF37]/35 shadow-[0_20px_50px_rgba(0,0,0,0.7)] p-6 sm:p-8 text-[#F8F9FA] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative gold light glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8F9FA] hover:bg-[#0E2445] transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#060E1D] border border-[#D4AF37]/40 text-[#D4AF37] mb-3 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-[#F8F9FA] tracking-wide">
            {mode === "signin" ? "Scholar Sign In" : "Create Scholar Account"}
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Access your recent Jauhari AI inquiries and sync to Google Drive
          </p>

          {/* Contextual prompt if triggered by Save action */}
          {contextMessage && (
            <div className="mt-3 p-2.5 rounded-lg bg-[#060E1D] border border-[#D4AF37]/30 text-xs text-[#F3E5AB] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
              <span>{contextMessage}</span>
            </div>
          )}
        </div>

        {/* Mode Toggle Tabs */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#060E1D] border border-[#D4AF37]/20 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setError(null);
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === "signin"
                ? "bg-[#D4AF37] text-[#060E1D] shadow-md"
                : "text-[#94A3B8] hover:text-[#F8F9FA]"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setError(null);
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === "signup"
                ? "bg-[#D4AF37] text-[#060E1D] shadow-md"
                : "text-[#94A3B8] hover:text-[#F8F9FA]"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Google One-Click Sign In (Official styling adapted to navy & gold) */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-[#060E1D] hover:bg-[#0E2445] border border-[#D4AF37]/40 text-[#F8F9FA] text-sm font-medium transition-all shadow-sm hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 disabled:opacity-60 mb-4"
        >
          {/* Google 4-color SVG */}
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          </svg>
          <span>Continue with Google & Drive</span>
        </button>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-[#D4AF37]/20 w-full"></div>
          <span className="bg-[#0A192F] px-3 text-[11px] uppercase tracking-wider text-[#94A3B8]">
            Or with email
          </span>
          <div className="border-t border-[#D4AF37]/20 w-full"></div>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-semibold text-[#CBD5E1] mb-1">
                Full Name / Alias
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Ibn Rushd"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#060E1D] border border-[#D4AF37]/30 text-[#F8F9FA] text-xs placeholder-[#64748B] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#CBD5E1] mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="scholar@jauhari.org"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#060E1D] border border-[#D4AF37]/30 text-[#F8F9FA] text-xs placeholder-[#64748B] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#CBD5E1] mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#060E1D] border border-[#D4AF37]/30 text-[#F8F9FA] text-xs placeholder-[#64748B] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] hover:brightness-105 text-[#060E1D] font-bold text-sm tracking-wide transition-all shadow-[0_4px_15px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#060E1D]" />
            ) : mode === "signin" ? (
              "Sign In to Dashboard"
            ) : (
              "Complete Registration"
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-5 text-center text-[11px] text-[#94A3B8]">
          {mode === "signin" ? (
            <span>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError(null);
                }}
                className="text-[#D4AF37] hover:underline font-semibold"
              >
                Create one now
              </button>
            </span>
          ) : (
            <span>
              Already registered?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setError(null);
                }}
                className="text-[#D4AF37] hover:underline font-semibold"
              >
                Sign in here
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
