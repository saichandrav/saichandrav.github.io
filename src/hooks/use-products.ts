import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useProducts = (params?: Record<string, string>) =>
  useQuery({
    queryKey: ["products", params],
    queryFn: () => api.getProducts(params),
  });

export const useProduct = (id?: string) =>
  useQuery({
    queryKey: ["product", id],
    queryFn: () => api.getProduct(id || ""),
    enabled: Boolean(id),
  });
