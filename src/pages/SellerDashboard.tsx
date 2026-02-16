import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { api, type Order } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { Product } from "@/lib/types";
import { productImageOptions } from "@/lib/product-images";
import { toast } from "@/components/ui/sonner";

const emptyForm = {
  name: "",
  category: "jewellery",
  subCategory: "",
  price: "",
  originalPrice: "",
  description: "",
  stock: "",
  imageKey: productImageOptions[0]?.key || "product-necklace",
  imageMode: "library",
  imageUrl: "",
};

const SellerDashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["seller-products", user?.id],
    queryFn: () => api.getProducts({ seller: user?.id || "" }),
    enabled: Boolean(user?.id),
  });

  const { data: ordersData } = useQuery({
    queryKey: ["seller-orders"],
    queryFn: () => api.getOrders(),
  });

  const orders = ordersData?.orders || [];

  const resetForm = () => {
    setEditing(null);
    setForm({ ...emptyForm });
  };

  const createMutation = useMutation({
    mutationFn: (payload: Partial<Product>) => api.createProduct(payload),
    onSuccess: () => {
      toast("Listing created", { description: "Your product is now live." });
      queryClient.invalidateQueries({ queryKey: ["seller-products"] });
      resetForm();
    },
    onError: error => {
      toast("Create failed", { description: error instanceof Error ? error.message : "Try again" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Product> }) => api.updateProduct(id, payload),
    onSuccess: () => {
      toast("Listing updated", { description: "Your changes are saved." });
      queryClient.invalidateQueries({ queryKey: ["seller-products"] });
      resetForm();
    },
    onError: error => {
      toast("Update failed", { description: error instanceof Error ? error.message : "Try again" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteProduct(id),
    onSuccess: () => {
      toast("Listing removed", { description: "Product removed from storefront." });
      queryClient.invalidateQueries({ queryKey: ["seller-products"] });
    },
    onError: error => {
      toast("Delete failed", { description: error instanceof Error ? error.message : "Try again" });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Order["status"] }) =>
      api.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-orders"] });
    },
    onError: error => {
      toast("Status update failed", { description: error instanceof Error ? error.message : "Try again" });
    },
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => api.uploadImage(file),
    onSuccess: data => {
      setForm(prev => ({ ...prev, imageMode: "upload", imageUrl: data.url }));
      toast("Image uploaded", { description: "Your listing will use the new image." });
    },
    onError: error => {
      toast("Upload failed", { description: error instanceof Error ? error.message : "Try again" });
    },
  });

  const handleEdit = (product: Product) => {
    const isLibraryImage = Boolean(product.imageKey);
    setEditing(product);
    setForm({
      name: product.name,
      category: product.category,
      subCategory: product.subCategory,
      price: String(product.price),
      originalPrice: product.originalPrice ? String(product.originalPrice) : "",
      description: product.description,
      stock: String(product.stock),
      imageKey: product.imageKey || productImageOptions[0]?.key,
      imageMode: isLibraryImage ? "library" : "upload",
      imageUrl: isLibraryImage ? "" : product.images[0] || "",
    });
  };

  const payload = useMemo(() => {
    const imageUrl = form.imageMode === "upload" ? form.imageUrl.trim() : "";
    const images = imageUrl
      ? [imageUrl]
      : form.imageKey
        ? [`asset:${form.imageKey}`]
        : [];

    return {
      name: form.name.trim(),
      category: form.category as Product["category"],
      subCategory: form.subCategory.trim(),
      price: Number(form.price || 0),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      description: form.description.trim(),
      stock: Number(form.stock || 0),
      images,
    };
  }, [form]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!payload.name || !payload.subCategory || !payload.description) {
      toast("Missing details", { description: "Fill all required fields." });
      return;
    }

    if (editing) {
      updateMutation.mutate({ id: editing.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pb-24 lg:pb-12">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Seller Studio</p>
          <h1 className="mt-3 text-2xl sm:text-3xl font-heading font-bold text-foreground">Welcome, {user?.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Manage listings and track orders in real time.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8">
          <aside className="bg-card rounded-2xl border border-border/60 p-6 h-fit">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading font-semibold text-foreground">
                {editing ? "Edit listing" : "New listing"}
              </h2>
              {editing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs font-semibold text-muted-foreground hover:text-primary"
                >
                  Cancel
                </button>
              )}
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product name</label>
                <input
                  value={form.name}
                  onChange={event => setForm(prev => ({ ...prev, name: event.target.value }))}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
                  placeholder="Royal Heritage Necklace"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</label>
                  <select
                    value={form.category}
                    onChange={event => setForm(prev => ({ ...prev, category: event.target.value }))}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm"
                  >
                    <option value="jewellery">Jewellery</option>
                    <option value="saree">Saree</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sub category</label>
                  <input
                    value={form.subCategory}
                    onChange={event => setForm(prev => ({ ...prev, subCategory: event.target.value }))}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm"
                    placeholder="Bridal"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price</label>
                  <input
                    value={form.price}
                    onChange={event => setForm(prev => ({ ...prev, price: event.target.value }))}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm"
                    placeholder="4999"
                    type="number"
                    min="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Original</label>
                  <input
                    value={form.originalPrice}
                    onChange={event => setForm(prev => ({ ...prev, originalPrice: event.target.value }))}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm"
                    placeholder="5999"
                    type="number"
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</label>
                <textarea
                  value={form.description}
                  onChange={event => setForm(prev => ({ ...prev, description: event.target.value }))}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm min-h-[120px]"
                  placeholder="Describe the craftsmanship, materials, and occasion."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stock</label>
                  <input
                    value={form.stock}
                    onChange={event => setForm(prev => ({ ...prev, stock: event.target.value }))}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm"
                    type="number"
                    min="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Image source</label>
                  <select
                    value={form.imageMode}
                    onChange={event =>
                      setForm(prev => ({
                        ...prev,
                        imageMode: event.target.value,
                        imageUrl: event.target.value === "library" ? "" : prev.imageUrl,
                      }))
                    }
                    className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm"
                  >
                    <option value="library">Preset</option>
                    <option value="upload">Upload</option>
                  </select>
                </div>
              </div>

              {form.imageMode === "library" ? (
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Image</label>
                  <select
                    value={form.imageKey}
                    onChange={event => setForm(prev => ({ ...prev, imageKey: event.target.value }))}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm"
                  >
                    {productImageOptions.map(option => (
                      <option key={option.key} value={option.key}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Upload image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={event => {
                        const file = event.target.files?.[0];
                        if (file) {
                          uploadMutation.mutate(file);
                        }
                      }}
                      className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Max 4 MB · JPG or PNG recommended
                    </p>
                  </div>
                  {uploadMutation.isPending && (
                    <p className="text-xs text-muted-foreground">Uploading image...</p>
                  )}
                  {form.imageUrl && (
                    <div className="rounded-xl overflow-hidden border border-border/60">
                      <img src={form.imageUrl} alt="Upload preview" className="w-full h-40 object-cover" />
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-full luxury-gradient px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01]"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editing ? "Update listing" : "Publish listing"}
              </button>
            </form>
          </aside>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading font-semibold text-foreground">Your listings</h2>
              <span className="text-xs text-muted-foreground">{products.length} active</span>
            </div>

            {isLoading ? (
              <div className="py-12 text-sm text-muted-foreground">Loading listings...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {products.map(product => (
                  <div key={product.id} className="bg-card rounded-2xl border border-border/60 p-4">
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-secondary mb-3">
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="font-heading font-semibold text-foreground text-sm mb-1">{product.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      {product.category} · {product.subCategory}
                    </p>
                    <div className="flex items-center justify-between text-sm mb-3">
                      <span className="font-semibold">₹{product.price.toLocaleString("en-IN")}</span>
                      <span className="text-xs text-muted-foreground">Stock: {product.stock}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(product)}
                        className="flex-1 rounded-full border border-border px-3 py-2 text-xs font-semibold hover:border-primary hover:text-primary"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteMutation.mutate(product.id)}
                        className="flex-1 rounded-full border border-border px-3 py-2 text-xs font-semibold text-destructive hover:border-destructive"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-10">
              <h2 className="text-lg font-heading font-semibold text-foreground mb-4">Recent orders</h2>
              {orders.length === 0 ? (
                <div className="text-sm text-muted-foreground">No orders yet.</div>
              ) : (
                <div className="space-y-3">
                  {orders.map(order => (
                    <div key={order.id} className="bg-card rounded-2xl border border-border/60 p-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold">Order #{order.id.slice(-6)}</span>
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">{order.status}</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Total: ₹{order.total.toLocaleString("en-IN")}</span>
                        <select
                          value={order.status}
                          onChange={event => statusMutation.mutate({ id: order.id, status: event.target.value as Order["status"] })}
                          className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs"
                        >
                          <option value="payment_pending" disabled>Payment pending</option>
                          <option value="confirmed" disabled>Confirmed</option>
                          <option value="packed">Packed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      {order.shippingAddress && (
                        <div className="mt-4 rounded-xl border border-border/60 bg-secondary/40 p-3 text-xs">
                          <p className="text-xs uppercase tracking-wider text-muted-foreground">Shipping details</p>
                          {order.shippingAddress.name && (
                            <p className="mt-2 text-sm font-semibold text-foreground">{order.shippingAddress.name}</p>
                          )}
                          {order.shippingAddress.phone && (
                            <p className="text-muted-foreground">{order.shippingAddress.phone}</p>
                          )}
                          <p className="text-muted-foreground">
                            {order.shippingAddress.line1} {order.shippingAddress.line2}
                          </p>
                          <p className="text-muted-foreground">
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                          </p>
                        </div>
                      )}
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

export default SellerDashboard;
