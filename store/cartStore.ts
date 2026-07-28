import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, Order } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface CartStore {
  items: CartItem[];
  orders: Order[];
  addToCart: (product: Product, size?: string, color?: string, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  placeOrder: (customerInfo: { name: string; email: string; phone: string; address: any }) => Order;
  getOrders: () => Order[];
}

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      orders: [],
      
      addToCart: (product: Product, size: string = 'M', color: string = 'Default', quantity: number = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.id === product.id && item.selectedSize === size && item.selectedColor === color
          );
          
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === existingItem.id
                  ? { ...item, cartQuantity: item.cartQuantity + quantity }
                  : item
              ),
            };
          }
          
          return {
            items: [...state.items, { ...product, selectedSize: size, selectedColor: color, cartQuantity: quantity }],
          };
        });
      },
      
      removeFromCart: (productId: number) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },
      
      updateQuantity: (productId: number, quantity: number) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId ? { ...item, cartQuantity: Math.max(1, quantity) } : item
          ),
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotal: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.price * item.cartQuantity, 0);
      },
      
      getItemCount: () => {
        const state = get();
        return state.items.reduce((count, item) => count + item.cartQuantity, 0);
      },
      
      placeOrder: (customerInfo) => {
        const state = get();
        const order: Order = {
          id: uuidv4(),
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
          shippingAddress: customerInfo.address,
          items: [...state.items],
          total: state.getTotal(),
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          orders: [...state.orders, order],
          items: [], // Clear cart after order
        }));
        
        return order;
      },
      
      getOrders: () => {
        return get().orders;
      },
    }),
    {
      name: 'yohanna-cart-storage',
    }
  )
);

export default useCartStore;