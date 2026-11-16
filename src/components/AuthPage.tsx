import React, { useState } from "react";
import { Sparkles, ArrowRight, UserCheck, Shield } from "lucide-react";
import { User } from "../types";
import Logo from "./Logo";

interface AuthPageProps {
  onAuthSuccess: (user: User) => void;
}

export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      onAuthSuccess(data.user);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestMode = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Guest access failed");
      }

      onAuthSuccess(data.user);
    } catch (err: any) {
      setError(err.message || "Could not login as guest");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2EF] flex flex-col justify-between animate-fade-in" id="auth-container">
      {/* Decorative Brand Header */}
      <header className="px-8 py-4 flex justify-between items-center border-b border-[#1A1A1A]/10 bg-white shadow-xs">
        <div className="flex items-center gap-2">
          {/* Elegant Mini Logo Emblem */}
          <Logo size="sm" showTagline={false} />
        </div>
        <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1.5 uppercase tracking-wider">
          <Shield className="h-3.5 w-3.5 text-[#8B4513]" />
          <span>Secure Cloud Auth</span>
        </div>
      </header>

      {/* Main Form Box */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white border border-[#1A1A1A]/10 rounded-none p-10 space-y-6 shadow-sm">
          {/* Premium Logo brand mark */}
          <div className="flex justify-center pb-2">
            <Logo size="lg" />
          </div>

          <div className="text-center space-y-2 border-t border-[#1A1A1A]/10 pt-6">
            <h1 className="font-serif text-2xl font-light tracking-tight text-[#1A1A1A] italic">
              {isLogin ? "Welcome Back" : "Curate Your Closet"}
            </h1>
            <p className="text-xs font-serif text-[#1A1A1A]/60 italic">
              {isLogin
                ? "Sign in to access your digital wardrobe & recommendations"
                : "Register to save custom outfits & wardrobe items"}
            </p>
          </div>

          {error && (
            <div className="p-3.5 text-xs bg-red-50 border border-red-100 text-red-600 rounded-none font-mono uppercase tracking-wider">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-[#1A1A1A]/50 tracking-widest mb-1.5 uppercase font-mono">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-[#1A1A1A]/10 rounded-none text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] transition"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#1A1A1A]/50 tracking-widest mb-1.5 uppercase font-mono">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-[#1A1A1A]/10 rounded-none text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white py-3 rounded-none text-xs font-bold uppercase tracking-widest transition duration-150 flex items-center justify-center gap-1.5 disabled:opacity-50 mt-2"
            >
              {loading ? "Authenticating..." : isLogin ? "Sign In" : "Register Closet"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="relative flex py-2 items-center text-[10px] text-gray-400 font-mono tracking-widest">
            <div className="flex-grow border-t border-[#1A1A1A]/10"></div>
            <span className="flex-shrink mx-4 font-bold">OR</span>
            <div className="flex-grow border-t border-[#1A1A1A]/10"></div>
          </div>

          {/* Guest Entry & Toggle option */}
          <div className="space-y-4">
            <button
              onClick={handleGuestMode}
              disabled={loading}
              className="w-full bg-[#FAF6F0] hover:bg-[#F5F2EF] border border-[#1A1A1A]/10 text-[#1A1A1A] py-3 rounded-none text-xs font-bold uppercase tracking-widest transition duration-150 flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4 text-[#8B4513]" />
              Explore as Guest (Instant Access)
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="text-[10px] text-[#8B4513] hover:underline font-mono uppercase tracking-widest font-bold"
              >
                {isLogin
                  ? "Don't have an account? Create one now"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-[10px] text-gray-400 font-mono border-t border-[#1A1A1A]/10 bg-white uppercase tracking-wider">
        TrendFits Wardrobe Organizer &copy; 2026. Made with styling precision.
      </footer>
    </div>
  );
}
