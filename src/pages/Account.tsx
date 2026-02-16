import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";

const Account = () => {
  const { user, logout, updateProfile, isLoading } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: {
      line1: user?.address?.line1 || "",
      line2: user?.address?.line2 || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      postalCode: user?.address?.postalCode || "",
      country: user?.address?.country || "India",
    },
  });

  useEffect(() => {
    if (!user) {
      return;
    }
    setForm({
      name: user.name || "",
      phone: user.phone || "",
      address: {
        line1: user.address?.line1 || "",
        line2: user.address?.line2 || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        postalCode: user.address?.postalCode || "",
        country: user.address?.country || "India",
      },
    });
  }, [user]);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await updateProfile({
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: {
          ...form.address,
          country: form.address.country || "India",
        },
      });
      toast("Profile updated", { description: "Your details are saved." });
    } catch (error) {
      toast("Update failed", { description: error instanceof Error ? error.message : "Try again" });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 pb-24 lg:pb-12">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">My Account</p>
          <h1 className="mt-3 text-2xl sm:text-3xl font-heading font-bold text-foreground">
            Welcome, {user?.name}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">Manage your profile, orders, and listings.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          <aside className="bg-card rounded-2xl border border-border/60 p-6 h-fit">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Profile</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-semibold text-foreground">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Role</span>
                <span className="font-semibold text-foreground capitalize">{user?.role}</span>
              </div>
            </div>

            <button
              onClick={logout}
              className="mt-6 w-full rounded-full border border-border px-4 py-2 text-xs font-semibold tracking-widest text-foreground/70 hover:text-primary"
            >
              LOGOUT
            </button>
          </aside>

          <section className="space-y-4">
            <div className="bg-card rounded-2xl border border-border/60 p-6">
              <h2 className="text-lg font-heading font-semibold text-foreground">Orders</h2>
              <p className="mt-2 text-sm text-muted-foreground">Track your recent purchases and delivery status.</p>
              <Link
                to="/orders"
                className="mt-4 inline-flex items-center rounded-full border border-primary/30 px-4 py-2 text-xs font-bold tracking-widest text-primary hover:bg-primary hover:text-primary-foreground"
              >
                VIEW ORDERS
              </Link>
            </div>

            {user?.role === "seller" && (
              <div className="bg-card rounded-2xl border border-border/60 p-6">
                <h2 className="text-lg font-heading font-semibold text-foreground">Seller Studio</h2>
                <p className="mt-2 text-sm text-muted-foreground">Create listings, manage stock, and update orders.</p>
                <Link
                  to="/seller"
                  className="mt-4 inline-flex items-center rounded-full border border-primary/30 px-4 py-2 text-xs font-bold tracking-widest text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  OPEN STUDIO
                </Link>
              </div>
            )}

            {user?.role === "admin" && (
              <div className="bg-card rounded-2xl border border-border/60 p-6">
                <h2 className="text-lg font-heading font-semibold text-foreground">Admin Console</h2>
                <p className="mt-2 text-sm text-muted-foreground">Feature listings and manage seller access.</p>
                <Link
                  to="/admin"
                  className="mt-4 inline-flex items-center rounded-full border border-primary/30 px-4 py-2 text-xs font-bold tracking-widest text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  OPEN CONSOLE
                </Link>
              </div>
            )}

            <div className="bg-card rounded-2xl border border-border/60 p-6">
              <h2 className="text-lg font-heading font-semibold text-foreground">Delivery details</h2>
              <p className="mt-2 text-sm text-muted-foreground">Keep your shipping address up to date.</p>
              <form className="mt-4 space-y-3" onSubmit={handleSave}>
                <input
                  value={form.name}
                  onChange={event => setForm(prev => ({ ...prev, name: event.target.value }))}
                  placeholder="Full name"
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
                  required
                />
                <input
                  value={form.phone}
                  onChange={event => setForm(prev => ({ ...prev, phone: event.target.value }))}
                  placeholder="Phone number"
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
                />
                <input
                  value={form.address.line1}
                  onChange={event =>
                    setForm(prev => ({ ...prev, address: { ...prev.address, line1: event.target.value } }))
                  }
                  placeholder="Address line 1"
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
                />
                <input
                  value={form.address.line2}
                  onChange={event =>
                    setForm(prev => ({ ...prev, address: { ...prev.address, line2: event.target.value } }))
                  }
                  placeholder="Address line 2"
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={form.address.city}
                    onChange={event =>
                      setForm(prev => ({ ...prev, address: { ...prev.address, city: event.target.value } }))
                    }
                    placeholder="City"
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
                  />
                  <input
                    value={form.address.state}
                    onChange={event =>
                      setForm(prev => ({ ...prev, address: { ...prev.address, state: event.target.value } }))
                    }
                    placeholder="State"
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={form.address.postalCode}
                    onChange={event =>
                      setForm(prev => ({ ...prev, address: { ...prev.address, postalCode: event.target.value } }))
                    }
                    placeholder="Postal code"
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
                  />
                  <input
                    value={form.address.country}
                    onChange={event =>
                      setForm(prev => ({ ...prev, address: { ...prev.address, country: event.target.value } }))
                    }
                    placeholder="Country"
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center rounded-full border border-primary/30 px-4 py-2 text-xs font-bold tracking-widest text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  SAVE DETAILS
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Account;
