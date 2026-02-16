import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { api } from "@/lib/api";
import { Link } from "react-router-dom";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const Orders = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => api.getOrders(),
  });

  const orders = data?.orders || [];
  const steps = ["payment_pending", "confirmed", "packed", "shipped", "delivered"] as const;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 pb-24 lg:pb-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">My Orders</p>
            <h1 className="mt-3 text-2xl sm:text-3xl font-heading font-bold text-foreground">Order history</h1>
          </div>
          <Link to="/products" className="text-xs font-semibold tracking-widest text-primary hover:text-primary/80">
            CONTINUE SHOPPING
          </Link>
        </div>

        {isLoading ? (
          <div className="py-16 text-sm text-muted-foreground">Loading your orders...</div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-border/60 bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">You do not have any orders yet.</p>
            <Link
              to="/products"
              className="mt-4 inline-flex items-center rounded-full border border-primary/30 px-4 py-2 text-xs font-bold tracking-widest text-primary hover:bg-primary hover:text-primary-foreground"
            >
              BROWSE PRODUCTS
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-card rounded-2xl border border-border/60 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Order #{order.id.slice(-6)}</p>
                    <p className="text-xs text-muted-foreground">Placed {formatDate(order.createdAt)}</p>
                  </div>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">{order.status.replace("_", " ")}</span>
                </div>

                <div className="mt-4 space-y-2">
                  {order.items.map(item => (
                    <div key={`${order.id}-${item.product}`} className="flex items-center justify-between text-sm">
                      <span className="text-foreground">{item.name}</span>
                      <span className="text-muted-foreground">{item.quantity} x ₹{item.price.toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Tracking</p>
                  <div className="grid grid-cols-5 gap-2">
                    {steps.map(step => {
                      const isActive = steps.indexOf(step) <= steps.indexOf(order.status as typeof steps[number]);
                      return (
                        <div key={step} className="text-center">
                          <div
                            className={`mx-auto h-2 w-full rounded-full ${
                              isActive ? "bg-emerald-500" : "bg-border"
                            }`}
                          />
                          <p className="mt-1 text-[10px] text-muted-foreground capitalize">
                            {step.replace("_", " ")}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  {order.status === "cancelled" && (
                    <p className="mt-2 text-xs text-destructive">This order was cancelled.</p>
                  )}
                </div>

                {order.shippingAddress && (
                  <div className="mt-4 rounded-xl border border-border/60 bg-secondary/40 p-3 text-xs">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Shipping to</p>
                    <p className="mt-2 text-sm font-semibold text-foreground">
                      {order.shippingAddress.name}
                    </p>
                    <p className="text-muted-foreground">{order.shippingAddress.phone}</p>
                    <p className="text-muted-foreground">
                      {order.shippingAddress.line1} {order.shippingAddress.line2}
                    </p>
                    <p className="text-muted-foreground">
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                    </p>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between text-sm font-semibold">
                  <span>Total</span>
                  <span>₹{order.total.toLocaleString("en-IN")}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Orders;
