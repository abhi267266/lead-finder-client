"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { resetPassword, confirmResetPassword } from "aws-amplify/auth";

export default function ForgotPassword() {
  const router = useRouter();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const output = await resetPassword({ username: email });
      console.log("Reset Password Output:", output);
      
      setStep(2);
      setSuccessMessage("If the email is registered and verified, a verification code has been sent.");
    } catch (err: any) {
      console.error("Reset Password Error:", err);
      setError(err.message || "Failed to request password reset code");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword
      });
      setSuccessMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden bg-dark">
      {/* Dynamic Background Blurs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="glass-panel w-full max-w-md p-8 rounded-2xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Reset Password
          </h1>
          <p className="text-slate-400 mt-2">
            {step === 1 ? "Enter your email to receive a reset code." : "Enter the verification code and your new password."}
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-5 p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-sm">
            {successMessage}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestCode} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input w-full px-4 py-3 rounded-lg"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-primary to-indigo-500 text-white font-medium rounded-lg hover:from-indigo-500 hover:to-primary transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.3)] disabled:opacity-70"
            >
              {loading ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleConfirmReset} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="code">
                Verification Code
              </label>
              <input
                id="code"
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="glass-input w-full px-4 py-3 rounded-lg text-center tracking-widest font-mono text-xl"
                placeholder="000000"
                maxLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="newPassword">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="glass-input w-full px-4 py-3 rounded-lg"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-primary to-indigo-500 text-white font-medium rounded-lg hover:from-indigo-500 hover:to-primary transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.3)] disabled:opacity-70"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-slate-400">
          Remember your password?{" "}
          <Link href="/login" className="text-primary hover:text-indigo-400 font-medium transition-colors">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
