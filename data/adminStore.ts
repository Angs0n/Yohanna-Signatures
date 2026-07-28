import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdminProduct, Order } from '@/types';

interface AdminStore {
  products: AdminProduct[];
  notifications: Array<{ id: string; message: string; type: string; read: boolean; createdAt: string }>;
  addProduct: (product: AdminProduct) => void;
  updateProduct: (id: number, updates: Partial<AdminProduct>) => void;
  deleteProduct: (id: number) => void;
  addNotification: (message: string, type: string) => void;
  markNotificationRead: (id: string) => void;
  getOrders: () => Order[];
}

const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      products: [],
      notifications: [],
      
      addProduct: (product) => {
        set((state) => ({
          products: [...state.products, product],
          notifications: [...state.notifications, {
            id: Date.now().toString(),
            message: `New product "${product.name}" added`,
            type: 'product',
            read: false,
            createdAt: new Date().toISOString(),
          }],
        }));
      },
      
      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }));
      },
      
      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },
      
      addNotification: (message, type) => {
        set((state) => ({
          notifications: [...state.notifications, {
            id: Date.now().toString(),
            message,
            type,
            read: false,
            createdAt: new Date().toISOString(),
          }],
        }));
      },
      
      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },
      
      getOrders: () => {
        // In a real app, this would fetch from API
        return [];
      },
    }),
    {
      name: 'yohanna-admin-storage',
    }
  )
);

export default useAdminStore;