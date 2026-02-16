import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { api } from "@/lib/api";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const AdminSellerProfile = () => {
  const { id } = useParams();

  const { data: sellerData, isLoading: isLoadingSeller } = useQuery({
    queryKey: ["admin-seller", id],
    queryFn: () => api.getSeller(id || ""),
    enabled: Boolean(id),
  });

  const { data: ordersData, isLoading: isLoadingOrders } = useQuery({
    queryKey: ["admin-seller-orders", id],
    queryFn: () => api.getSellerOrders(id || ""),
    enabled: Boolean(id),
  });

  const seller = sellerData?.seller;
  const orders = ordersData?.orders || [];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pb-24 lg:pb-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Admin Console</p>
            <h1 className="mt-3 text-2xl sm:text-3xl font-heading font-bold text-foreground">Seller profile</h1>
          </div>
          <Link to="/admin/sellers" className="text-xs font-semibold tracking-widest text-primary hover:text-primary/80">
            BACK TO SELLERS
          </Link>
        </div>

        {isLoadingSeller ? (
          <div className="py-10 text-sm text-muted-foreground">Loading seller profile...</div>
        ) : !seller ? (
          <div className="rounded-2xl border border-border/60 bg-card p-8 text-sm text-muted-foreground">
            Seller not found.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-2xl border border-border/60 bg-card p-6">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Seller info</p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-heading font-semibold text-foreground">{seller.storeName || seller.name}</p>
                  <p className="text-sm text-muted-foreground">{seller.email}</p>
                  {seller.phone && <p className="text-sm text-muted-foreground">{seller.phone}</p>}
                </div>
                <div className="text-xs text-muted-foreground">
                  <p>Seller ID: {seller.id}</p>
                </div>
              </div>
              {seller.address && (
                <div className="mt-4 rounded-xl border border-border/60 bg-secondary/40 p-3 text-xs">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Store address</p>
                  <p className="mt-2 text-sm font-semibold text-foreground">{seller.address.line1}</p>
                  <p className="text-muted-foreground">{seller.address.line2}</p>
                  <p className="text-muted-foreground">
                    {seller.address.city}, {seller.address.state} {seller.address.postalCode}
                  </p>
                  <p className="text-muted-foreground">{seller.address.country}</p>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-heading font-semibold text-foreground">Seller orders</h2>
                <span className="text-xs text-muted-foreground">{orders.length} total</span>
              </div>

              {isLoadingOrders ? (
                <div className="py-8 text-sm text-muted-foreground">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="text-sm text-muted-foreground">No orders yet.</div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="rounded-2xl border border-border/60 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-foreground">Order #{order.id.slice(-6)}</p>
                          <p className="text-xs text-muted-foreground">Placed {formatDate(order.createdAt)}</p>
                        </div>
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">
                          {order.status.replace("_", " ")}
                        </span>
                      </div>

                      <div className="mt-3 space-y-2">
                        {order.items.map(item => (
                          <div key={`${order.id}-${item.product}`} className="flex items-center justify-between text-xs">
                            <span className="text-foreground">{item.name}</span>
                            <span className="text-muted-foreground">
                              {item.quantity} x INR {item.price.toLocaleString("en-IN")}
                            </span>
                          </div>
                        ))}
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

                      <div className="mt-3 flex items-center justify-between text-xs font-semibold">
                        <span>Total</span>
                        <span>INR {order.total.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminSellerProfile;
