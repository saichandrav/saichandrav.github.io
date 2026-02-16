import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
    const { login, isLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = (location.state as { from?: string } | null)?.from || '/';

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await login(email, password);
            toast('Welcome back', { description: 'You are signed in.' });
            navigate(redirectTo);
        } catch (error) {
            toast('Login failed', { description: error instanceof Error ? error.message : 'Try again.' });
        }
    };

    return (
        <main className="min-h-screen px-4 py-10 sm:py-14">
            <div className="mx-auto w-full max-w-md ">
                <div className="mb-6 text-center">
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Aurelia</p>
                    <h1 className="mt-3 text-3xl font-heading font-semibold text-foreground">Welcome back</h1>
                    <p className="mt-2 text-sm text-muted-foreground">Sign in to continue shopping timeless pieces.</p>
                </div>

                <div className="glass-card rounded-2xl p-6 sm:p-8">
                    <form className="space-y-4" onSubmit={handleLogin}>
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

                        <div className="space-y-2 text-left">
                            <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={event => setPassword(event.target.value)}
                                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                                required
                            />
                            <div className="text-right">
                                <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:text-primary/80">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <div className="rounded-xl border border-border/70 bg-secondary/40 px-4 py-3 text-xs text-muted-foreground">
                            Demo seller: seller@aurelia.demo · Password: Seller@123
                            <br />
                            Demo admin: admin@aurelia.demo · Password: Admin@123
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-full luxury-gradient px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-70"
                        >
                            Sign in
                        </button>
                    </form>
                </div>

                <p className="mt-6 text-center text-xs text-muted-foreground">
                    New here?{' '}
                    <Link to="/signup" className="font-semibold text-primary hover:text-primary/80">
                        Create an account
                    </Link>
                </p>
            </div>
        </main>
    );
};

export default Login;