import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { api } from "@/lib/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSending(true);
    try {
      const result = await api.requestPasswordReset(email);
      toast("Reset code sent", { description: result.message });
      setOtpSent(true);
    } catch (error) {
      toast("Unable to send code", { description: error instanceof Error ? error.message : "Try again." });
    } finally {
      setIsSending(false);
    }
  };

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsResetting(true);
    try {
      const result = await api.resetPassword(email, otp, password);
      toast("Password updated", { description: result.message });
      setOtp("");
      setPassword("");
    } catch (error) {
      toast("Reset failed", { description: error instanceof Error ? error.message : "Try again." });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Aurelia</p>
          <h1 className="mt-3 text-3xl font-heading font-semibold text-foreground">Reset password</h1>
          <p className="mt-2 text-sm text-muted-foreground">We will email a 6-digit code to your Gmail.</p>
        </div>

        <div className="glass-card rounded-2xl p-6 sm:p-8">
          <form className="space-y-4" onSubmit={handleSendOtp}>
            <div className="space-y-2 text-left">
              <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={event => setEmail(event.target.value)}
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full rounded-full luxury-gradient px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-70"
            >
              {isSending ? "Sending..." : "Send reset code"}
            </button>
          </form>

          <div className="mt-6 border-t border-border/60 pt-6">
            <form className="space-y-4" onSubmit={handleResetPassword}>
              <div className="space-y-2 text-left">
                <label htmlFor="otp" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Reset code
                </label>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  placeholder="6-digit code"
                  value={otp}
                  onChange={event => setOtp(event.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>

              <div className="space-y-2 text-left">
                <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  New password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Create a new password"
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isResetting || !otpSent}
                className="w-full rounded-full luxury-gradient px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-70"
              >
                {isResetting ? "Updating..." : "Update password"}
              </button>
            </form>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Remembered your password?{" "}
          <Link to="/login" className="font-semibold text-primary hover:text-primary/80">
            Back to sign in
          </Link>
        </p>
      </div>
    </main>
  );
};

export default ForgotPassword;
