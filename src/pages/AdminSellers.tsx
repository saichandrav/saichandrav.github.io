import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { api } from "@/lib/api";

const AdminSellers = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-sellers"],
    queryFn: () => api.listSellers(),
  });

  const sellers = data?.sellers || [];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pb-24 lg:pb-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Admin Console</p>
            <h1 className="mt-3 text-2xl sm:text-3xl font-heading font-bold text-foreground">All sellers</h1>
          </div>
          <Link to="/admin" className="text-xs font-semibold tracking-widest text-primary hover:text-primary/80">
            BACK TO DASHBOARD
          </Link>
        </div>

        {isLoading ? (
          <div className="py-12 text-sm text-muted-foreground">Loading sellers...</div>
        ) : sellers.length === 0 ? (
          <div className="rounded-2xl border border-border/60 bg-card p-8 text-sm text-muted-foreground">
            No sellers found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {sellers.map(seller => (
              <div key={seller.id} className="rounded-2xl border border-border/60 bg-card p-5">
                <p className="text-sm font-semibold text-foreground">{seller.storeName || seller.name}</p>
                <p className="text-xs text-muted-foreground">{seller.email}</p>
                {seller.phone && <p className="mt-2 text-xs text-muted-foreground">{seller.phone}</p>}
                {seller.address?.city && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {seller.address.city}, {seller.address.state}
                  </p>
                )}
                <Link
                  to={`/admin/sellers/${seller.id}`}
                  className="mt-4 inline-flex items-center rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:border-primary hover:text-primary"
                >
                  View orders
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminSellers;
