import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Lock, User } from "lucide-react";

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

export default function LoginModal() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // backend expects { username, password }
  const [form, setForm] = useState({ username: "", password: "" });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const usernameValid = form.username.trim().length >= 3;
  const passwordValid = form.password.length >= 6;
  const isFormValid = usernameValid && passwordValid;

  useEffect(() => setSubmitError(null), [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setLoading(true);

    try {
      const res = await fetch("/api/public/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username.trim(),
          password: form.password,
        }),
      });

      const text = await res.text();
      if (!res.ok) {
        // backend responds 401 + "Invalid Credentials"
        setSubmitError(text || "Login failed");
      } else {
        // successful login → {"token":"…","username":"…"}
        const { token } = JSON.parse(text) as { token: string; username: string };
        // save the JWT for future calls
        localStorage.setItem("jwtToken", token);
        // optionally: attach it as default header for your fetch wrapper, etc.

        // go to dashboard/IDE
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={() => navigate("/")} modal={!isMobile}>
      <DialogPortal>
        <DialogOverlay
          className="fixed inset-0 z-40 bg-blue-100/80 transition-opacity"
        />

        <DialogContent className="z-50 w-full sm:max-w-lg bg-white rounded-lg shadow-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl">Log In</DialogTitle>
            <DialogDescription>
              Welcome back! Please sign in to your account.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="space-y-1">
              <Label htmlFor="username" className="flex items-center gap-1">
                <User className="w-4 h-4" /> Username
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                value={form.username}
                onChange={handleChange}
                minLength={3}
                className={!usernameValid && form.username ? "ring-2 ring-destructive" : ""}
              />
              {!usernameValid && form.username && (
                <p className="text-destructive text-xs">
                  Username must be at least 3 characters
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label htmlFor="password" className="flex items-center gap-1">
                <Lock className="w-4 h-4" /> Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={handleChange}
                className={!passwordValid && form.password ? "ring-2 ring-destructive" : ""}
              />
              {!passwordValid && form.password && (
                <p className="text-destructive text-xs">
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            {submitError && (
              <p className="text-destructive text-sm" role="alert">
                {submitError}
              </p>
            )}

            <Button
              type="submit"
              disabled={!isFormValid || loading}
              className="
                block mx-auto w-1/2 py-3 rounded-full
                bg-blue-600 hover:bg-blue-700
                text-white font-medium
                transition-colors
              "
            >
              {loading ? "Signing in…" : "Log In"}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Don’t have an account?
              <a
                href="/signup"
                className="underline ml-1"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/signup");
                }}
              >
                Sign Up
              </a>
            </p>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
