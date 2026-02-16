import type { Product, UserRole } from "@/lib/types";
import { resolveProductImages } from "@/lib/product-images";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  storeName?: string;
  phone?: string;
  address?: Address;
}

export interface Address {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface OrderPayloadItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  items: Array<{ product: string; name: string; price: number; quantity: number; seller?: string }>;
  subtotal: number;
  shipping: number;
  total: number;
  status: "payment_pending" | "confirmed" | "packed" | "shipped" | "delivered" | "cancelled";
  tracking?: Array<{ status: string; message?: string; createdAt: string }>;
  shippingAddress?: Address & { name?: string; phone?: string };
  createdAt: string;
}

export interface SellerProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  storeName?: string;
  phone?: string;
  address?: Address;
}

const getToken = () => {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem("auth_token");
};

const apiFetch = async (path: string, options: RequestInit & { token?: string | null } = {}) => {
  const token = options.token ?? getToken();
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
};

const normalizeProduct = (product: Product) => {
  const rawImage = product.images?.[0] || "";
  const imageKey = rawImage.startsWith("asset:") ? rawImage.replace("asset:", "") : undefined;
  return {
    ...product,
    images: resolveProductImages(product.images || []),
    imageKey,
  };
};

export const api = {
  async login(email: string, password: string) {
    return apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }) as Promise<{ token: string; user: AuthUser }>;
  },
  async signup(name: string, email: string, password: string) {
    return apiFetch("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }) as Promise<{ token: string; user: AuthUser }>;
  },
  async requestPasswordReset(email: string) {
    return apiFetch("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }) as Promise<{ message: string }>;
  },
  async resetPassword(email: string, otp: string, password: string) {
    return apiFetch("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, otp, password }),
    }) as Promise<{ message: string }>;
  },
  async me() {
    return apiFetch("/auth/me") as Promise<{ user: AuthUser }>;
  },
  async getProducts(params?: Record<string, string>) {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    const data = await apiFetch(`/products${query}`) as { products: Product[] };
    return data.products.map(normalizeProduct);
  },
  async getProduct(id: string) {
    const data = await apiFetch(`/products/${id}`) as { product: Product };
    return normalizeProduct(data.product);
  },
  async createProduct(payload: Partial<Product>) {
    const data = await apiFetch("/products", {
      method: "POST",
      body: JSON.stringify(payload),
    }) as { product: Product };
    return normalizeProduct(data.product);
  },
  async updateProduct(id: string, payload: Partial<Product>) {
    const data = await apiFetch(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }) as { product: Product };
    return normalizeProduct(data.product);
  },
  async deleteProduct(id: string) {
    return apiFetch(`/products/${id}`, { method: "DELETE" }) as Promise<{ success: boolean }>;
  },
  async createOrder(items: OrderPayloadItem[]) {
    return apiFetch("/orders", {
      method: "POST",
      body: JSON.stringify({ items }),
    }) as Promise<{ order: Order }>;
  },
  async getOrders() {
    return apiFetch("/orders") as Promise<{ orders: Order[] }>;
  },
  async updateOrderStatus(id: string, status: Order["status"]) {
    return apiFetch(`/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }) as Promise<{ order: Order }>;
  },
  async updateProfile(payload: { name?: string; phone?: string; address?: Address }) {
    return apiFetch("/users/me", {
      method: "PUT",
      body: JSON.stringify(payload),
    }) as Promise<{ user: AuthUser }>;
  },
  async listSellers() {
    return apiFetch("/admin/sellers") as Promise<{ sellers: SellerProfile[] }>;
  },
  async getSeller(id: string) {
    return apiFetch(`/admin/sellers/${id}`) as Promise<{ seller: SellerProfile }>;
  },
  async getSellerOrders(id: string) {
    return apiFetch(`/admin/sellers/${id}/orders`) as Promise<{ orders: Order[] }>;
  },
  async createSeller(payload: {
    name: string;
    email: string;
    password: string;
    storeName?: string;
    phone?: string;
    address?: Address;
  }) {
    return apiFetch("/admin/sellers", {
      method: "POST",
      body: JSON.stringify(payload),
    }) as Promise<{ seller: SellerProfile }>;
  },
  async deleteSeller(id: string) {
    return apiFetch(`/admin/sellers/${id}`, { method: "DELETE" }) as Promise<{ success: boolean }>;
  },
  async toggleFeaturedProduct(id: string, isFeatured: boolean) {
    const data = await apiFetch(`/admin/products/${id}/feature`, {
      method: "PATCH",
      body: JSON.stringify({ isFeatured }),
    }) as { product: Product };
    return normalizeProduct(data.product);
  },
  async createRazorpayOrder(items: OrderPayloadItem[]) {
    return apiFetch("/payments/razorpay/order", {
      method: "POST",
      body: JSON.stringify({ items }),
    }) as Promise<{
      order: Order;
      razorpayOrder: { id: string; amount: number; currency: string };
      keyId: string;
    }>;
  },
  async verifyRazorpayPayment(payload: {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) {
    return apiFetch("/payments/razorpay/verify", {
      method: "POST",
      body: JSON.stringify(payload),
    }) as Promise<{ order: Order }>;
  },
  async uploadImage(file: File) {
    const token = getToken();
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE}/uploads`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || "Upload failed");
    }
    return data as { url: string };
  },
};
