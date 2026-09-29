import { create } from "zustand";
import { ProductData } from "@/types/api";

interface ShoppingState {
  products: ProductData[];
  comparisonUrls: string[];
  isScraping: boolean;
  selectedProduct: ProductData | null;
  addProduct: (product: ProductData) => void;
  setProducts: (products: ProductData[]) => void;
  setSelectedProduct: (product: ProductData | null) => void;
  setIsScraping: (isScraping: boolean) => void;
  toggleCompare: (url: string) => void;
  clearCompare: () => void;
}

const initialProducts: ProductData[] = [
  {
    id: "prod-1",
    url: "https://www.amazon.in/dp/B0CX21C8S4",
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    current_price: 26990,
    original_price: 34990,
    currency: "INR",
    rating: 4.6,
    review_count: 8420,
    seller: "Appario Retail Pvt Ltd",
    availability: "In Stock",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60",
    ],
    specifications: {
      "Noise Cancellation": "Dual Noise Sensor technology",
      "Battery Life": "Up to 30 hours",
      "Connectivity": "Bluetooth 5.2 / LDAC",
      "Weight": "250g",
    },
    source: "amazon_in",
    scraped_at: new Date().toISOString(),
  },
  {
    id: "prod-2",
    url: "https://www.flipkart.com/sony-wh-1000xm5-bluetooth-headset",
    title: "SONY WH-1000XM5 with Active Noise Cancellation Bluetooth Headset",
    current_price: 27999,
    original_price: 34990,
    currency: "INR",
    rating: 4.7,
    review_count: 5310,
    seller: "IndiFlashMart",
    availability: "In Stock",
    images: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=60",
    ],
    specifications: {
      "Noise Cancellation": "HD Noise Cancelling Processor QN1",
      "Battery Life": "Up to 30 hours",
      "Fast Charging": "3 min for 3 hours",
      "Weight": "250g",
    },
    source: "flipkart",
    scraped_at: new Date().toISOString(),
  },
];

export const useShoppingStore = create<ShoppingState>((set) => ({
  products: initialProducts,

  comparisonUrls: [],
  isScraping: false,
  selectedProduct: null,
  addProduct: (product) =>
    set((state) => ({ products: [product, ...state.products] })),
  setProducts: (products) => set({ products }),
  setSelectedProduct: (selectedProduct) => set({ selectedProduct }),
  setIsScraping: (isScraping) => set({ isScraping }),
  toggleCompare: (url) =>
    set((state) => ({
      comparisonUrls: state.comparisonUrls.includes(url)
        ? state.comparisonUrls.filter((u) => u !== url)
        : [...state.comparisonUrls, url].slice(0, 4),
    })),
  clearCompare: () => set({ comparisonUrls: [] }),
}));
