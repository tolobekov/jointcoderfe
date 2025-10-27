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
import { Mail, Lock, User } from "lucide-react";

/**
 * Media-query hook for responsive modal behaviour.
 */
function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );
  React.useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

export default function SignUpModal() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ── Validation flags ─────────────────────────────────
  const emailValid = /.+@.+\..+/.test(form.email);
  const passwordsMatch =
    form.password === form.confirm && form.password.length >= 8;
  const allFilled = Object.values(form).every(Boolean);
  const isFormValid = emailValid && passwordsMatch && allFilled;

  // reset generic error when user changes any field
  useEffect(() => setSubmitError(null), [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setLoading(true);
    try {
     // 1. Send registration to your Spring backend
     const res = await fetch("/api/public/register", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
        username: form.username,
        fullName: form.fullName,
         email: form.email,
         password: form.password,
       }),
     });

     if (res.ok) {
       // 2. Success ─ parse the returned profile if you need it
       //    (UserProfileDTO in your controller)
       const profile = await res.json();
       console.log("Registered user:", profile);
       // 3. Navigate into the IDE/dashboard
       navigate("/dashboard");
     } else {
       // 4. Registration failed ─ backend is returning a text error
       const errorText = await res.text();
       setSubmitError(errorText || "Registration failed");
     }
    } catch (err) {
      console.error(err);
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={() => navigate("/")} modal={!isMobile}>
      <DialogPortal>
        {/* Light-blue background instead of dimming overlay */}
          <DialogOverlay className="fixed inset-0 z-40 bg-blue-250 transition-opacity" />

        <DialogContent className="z-50 w-full sm:max-w-lg bg-white rounded-lg shadow-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl">Create your account</DialogTitle>
            <DialogDescription>
              Start collaborating in real-time. It only takes a moment.
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
       autoComplete="username"
      />
    </div>
            {/* Full Name */}
            <div className="space-y-1">
              <Label htmlFor="fullName" className="flex items-center gap-1">
                <User className="w-4 h-4" /> Full Name
              </Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={form.fullName}
                onChange={handleChange}
                autoComplete="fullName"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email" className="flex items-center gap-1">
                <Mail className="w-4 h-4" /> Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                className={
                  !emailValid && form.email ? "ring-2 ring-destructive" : ""
                }
              />
              {!emailValid && form.email && (
                <p className="text-destructive text-xs">Enter a valid email</p>
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
                minLength={8}
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <Label htmlFor="confirm" className="flex items-center gap-1">
                <Lock className="w-4 h-4" /> Confirm password
              </Label>
              <Input
                id="confirm"
                name="confirm"
                type="password"
                required
                minLength={8}
                value={form.confirm}
                onChange={handleChange}
                autoComplete="new-password"
                className={
                  !passwordsMatch && form.confirm ? "ring-2 ring-destructive" : ""
                }
              />
              {!passwordsMatch && form.confirm && (
                <p className="text-destructive text-xs">Passwords do not match</p>
              )}
            </div>

            {submitError && (
              <p className="text-destructive text-sm" role="alert">
                {submitError}
              </p>
            )}

          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={loading || !isFormValid}
              className="
                w-1/2            /* half width */
                mx-auto          /* center horizontally */
                py-3              /* nice vertical padding */
                rounded-full      /* pill shape */
                bg-blue-600       /* primary blue */
                hover:bg-blue-700 /* darker on hover */
                text-white        /* white text */
                font-medium       /* a bit bolder */
                transition-colors
              "
            >
              {loading ? "Creating account…" : "Sign Up"}
            </Button>
</div>
            <p className="text-xs text-muted-foreground text-center">
              By signing up, you agree to our
              <a href="/terms" className="underline ml-1">
                Terms of Service
              </a>{" "}
              and
              <a href="/privacy" className="underline ml-1">
                Privacy Policy
              </a>
              .
            </p>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
