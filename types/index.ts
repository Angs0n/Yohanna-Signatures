export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: 'Featured' | 'New Arrival' | 'Best Seller';
  images: string[];
  sizes: string[];
  colors: string[];
  materials: string;
  care: string;
  quantity: number;
}

export interface CartItem extends Product {
  selectedSize: string;
  selectedColor: string;
  cartQuantity: number;
}

export interface Collection {
  id: number;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

export interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  text: string;
}

export interface FormData {
  name: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  address: string;
  paymentMethod: 'card' | 'bank_transfer';
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    country: string;
    state: string;
    city: string;
    address: string;
  };
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
}

export interface AdminProduct {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  images: string[];
  sizes: string[];
  colors: string[];
  materials: string;
  care: string;
  quantity: number;
  createdAt: string;
}