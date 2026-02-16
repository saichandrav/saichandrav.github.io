import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";

const Signup = () => {
  const { signup, isLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from || "/";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await signup(name, email, password);
      toast("Account created", { description: "Welcome to Aurelia." });
      navigate(redirectTo);
    } catch (error) {
      toast("Signup failed", { description: error instanceof Error ? error.message : "Try again" });
    }
  };

  return (
    <main className="min-h-screen px-4 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Aurelia</p>
          <h1 className="mt-3 text-3xl font-heading font-semibold text-foreground">Create account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Join to save favorites and checkout faster.</p>
        </div>

        <div className="glass-card rounded-2xl p-6 sm:p-8">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2 text-left">
              <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={event => setName(event.target.value)}
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Your name"
                required
              />
            </div>

            <div className="space-y-2 text-left">
              <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-2 text-left">
              <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Create a password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full luxury-gradient px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-70"
            >
              Create account
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:text-primary/80">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Signup;
