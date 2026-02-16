import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import type { Product } from "@/lib/types";
import { Link } from "react-router-dom";

const emptySellerForm = {
  name: "",
  email: "",
  password: "",
  storeName: "",
  phone: "",
  address: {
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  },
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [sellerForm, setSellerForm] = useState({ ...emptySellerForm });

  const { data: sellersData, isLoading: isLoadingSellers } = useQuery({
    queryKey: ["admin-sellers"],
    queryFn: () => api.listSellers(),
  });

  const { data: products = [] } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => api.getProducts(),
  });

  const sellers = sellersData?.sellers || [];

  const featured = useMemo(
    () => products.filter(product => product.isFeatured),
    [products]
  );

  const toggleFeaturedMutation = useMutation({
    mutationFn: ({ id, isFeatured }: { id: string; isFeatured: boolean }) =>
      api.toggleFeaturedProduct(id, isFeatured),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: error => {
      toast("Update failed", { description: error instanceof Error ? error.message : "Try again" });
    },
  });

  const createSellerMutation = useMutation({
    mutationFn: () => api.createSeller(sellerForm),
    onSuccess: () => {
      toast("Seller added", { description: "New seller account created." });
      setSellerForm({ ...emptySellerForm });
      queryClient.invalidateQueries({ queryKey: ["admin-sellers"] });
    },
    onError: error => {
      toast("Create failed", { description: error instanceof Error ? error.message : "Try again" });
    },
  });

  const deleteSellerMutation = useMutation({
    mutationFn: (id: string) => api.deleteSeller(id),
    onSuccess: () => {
      toast("Seller removed", { description: "Seller and listings removed." });
      queryClient.invalidateQueries({ queryKey: ["admin-sellers"] });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: error => {
      toast("Delete failed", { description: error instanceof Error ? error.message : "Try again" });
    },
  });

  const handleCreateSeller = (event: React.FormEvent) => {
    event.preventDefault();
    if (!sellerForm.name || !sellerForm.email || !sellerForm.password) {
      toast("Missing details", { description: "Name, email, and password are required." });
      return;
    }
    createSellerMutation.mutate();
  };

  const summaryCards = [
    { label: "Total sellers", value: sellers.length },
    { label: "Total listings", value: products.length },
    { label: "Featured listings", value: featured.length },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pb-24 lg:pb-12">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Admin Console</p>
          <h1 className="mt-3 text-2xl sm:text-3xl font-heading font-bold text-foreground">
            Welcome, {user?.name}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">Manage featured collections and seller access.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {summaryCards.map(card => (
            <div key={card.label} className="rounded-2xl border border-border/60 bg-card p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{card.label}</p>
              <p className="mt-3 text-2xl font-heading font-semibold text-foreground">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-8">
          <aside className="rounded-2xl border border-border/60 bg-card p-6 h-fit">
            <h2 className="text-lg font-heading font-semibold text-foreground">Add seller</h2>
            <p className="mt-1 text-xs text-muted-foreground">Create a trusted seller with store details.</p>

            <form className="mt-4 space-y-3" onSubmit={handleCreateSeller}>
              <input
                value={sellerForm.name}
                onChange={event => setSellerForm(prev => ({ ...prev, name: event.target.value }))}
                placeholder="Seller name"
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
                required
              />
              <input
                value={sellerForm.email}
                onChange={event => setSellerForm(prev => ({ ...prev, email: event.target.value }))}
                placeholder="seller@email.com"
                type="email"
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
                required
              />
              <input
                value={sellerForm.password}
                onChange={event => setSellerForm(prev => ({ ...prev, password: event.target.value }))}
                placeholder="Temporary password"
                type="password"
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
                required
              />
              <input
                value={sellerForm.storeName}
                onChange={event => setSellerForm(prev => ({ ...prev, storeName: event.target.value }))}
                placeholder="Store name"
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
              />
              <input
                value={sellerForm.phone}
                onChange={event => setSellerForm(prev => ({ ...prev, phone: event.target.value }))}
                placeholder="Phone"
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
              />

              <div className="rounded-xl border border-border/60 bg-secondary/40 p-4 space-y-2">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Store address</p>
                <input
                  value={sellerForm.address.line1}
                  onChange={event =>
                    setSellerForm(prev => ({ ...prev, address: { ...prev.address, line1: event.target.value } }))
                  }
                  placeholder="Address line 1"
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                />
                <input
                  value={sellerForm.address.line2}
                  onChange={event =>
                    setSellerForm(prev => ({ ...prev, address: { ...prev.address, line2: event.target.value } }))
                  }
                  placeholder="Address line 2"
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={sellerForm.address.city}
                    onChange={event =>
                      setSellerForm(prev => ({ ...prev, address: { ...prev.address, city: event.target.value } }))
                    }
                    placeholder="City"
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                  />
                  <input
                    value={sellerForm.address.state}
                    onChange={event =>
                      setSellerForm(prev => ({ ...prev, address: { ...prev.address, state: event.target.value } }))
                    }
                    placeholder="State"
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={sellerForm.address.postalCode}
                    onChange={event =>
                      setSellerForm(prev => ({ ...prev, address: { ...prev.address, postalCode: event.target.value } }))
                    }
                    placeholder="Postal code"
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                  />
                  <input
                    value={sellerForm.address.country}
                    onChange={event =>
                      setSellerForm(prev => ({ ...prev, address: { ...prev.address, country: event.target.value } }))
                    }
                    placeholder="Country"
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={createSellerMutation.isPending}
                className="w-full rounded-full luxury-gradient px-4 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Add seller
              </button>
            </form>
          </aside>

          <section className="space-y-8">
            <div className="rounded-2xl border border-border/60 bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-heading font-semibold text-foreground">Featured listings</h2>
                <span className="text-xs text-muted-foreground">{featured.length} featured</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {products.map(product => (
                  <FeaturedCard
                    key={product.id}
                    product={product}
                    onToggle={() =>
                      toggleFeaturedMutation.mutate({ id: product.id, isFeatured: !product.isFeatured })
                    }
                    isUpdating={toggleFeaturedMutation.isPending}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-heading font-semibold text-foreground">Seller access</h2>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{sellers.length} sellers</span>
                  <Link
                    to="/admin/sellers"
                    className="text-xs font-semibold tracking-widest text-primary hover:text-primary/80"
                  >
                    VIEW ALL
                  </Link>
                </div>
              </div>

              {isLoadingSellers ? (
                <div className="py-6 text-sm text-muted-foreground">Loading sellers...</div>
              ) : (
                <div className="space-y-3">
                  {sellers.map(seller => (
                    <div key={seller.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{seller.storeName || seller.name}</p>
                        <p className="text-xs text-muted-foreground">{seller.email}</p>
                      </div>
                      <Link
                        to={`/admin/sellers/${seller.id}`}
                        className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:border-primary hover:text-primary"
                      >
                        View orders
                      </Link>
                      <button
                        type="button"
                        onClick={() => deleteSellerMutation.mutate(seller.id)}
                        className="rounded-full border border-destructive/50 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

const FeaturedCard = ({
  product,
  onToggle,
  isUpdating,
}: {
  product: Product;
  onToggle: () => void;
  isUpdating: boolean;
}) => (
  <div className="rounded-2xl border border-border/60 p-4 bg-secondary/40">
    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-secondary mb-3">
      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
    </div>
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-foreground line-clamp-2">{product.name}</p>
        <p className="text-[11px] text-muted-foreground">{product.seller.name}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        disabled={isUpdating}
        className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
          product.isFeatured
            ? "bg-primary text-primary-foreground"
            : "border border-border text-muted-foreground"
        }`}
      >
        {product.isFeatured ? "Featured" : "Feature"}
      </button>
    </div>
  </div>
);

export default AdminDashboard;
