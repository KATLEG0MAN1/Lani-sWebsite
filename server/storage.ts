import { products, subscribers, type Product, type InsertProduct, type Subscriber, type InsertSubscriber } from "@shared/schema";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  addSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private subscribers: Map<number, Subscriber>;
  private currentProductId: number;
  private currentSubscriberId: number;

  constructor() {
    this.products = new Map();
    this.subscribers = new Map();
    this.currentProductId = 1;
    this.currentSubscriberId = 1;

    // Initialize with sample products
    const sampleProducts: InsertProduct[] = [
      {
        name: "Classic Leather Loafers",
        description: "Handcrafted luxury leather loafers",
        price: 29900,
        imageUrl: "https://images.unsplash.com/photo-1588186939549-c087e0796efd",
        category: "shoes"
      },
      {
        name: "Silk Evening Dress",
        description: "Elegant silk dress for special occasions",
        price: 89900,
        imageUrl: "https://images.unsplash.com/photo-1592914637125-28479601c75a",
        category: "dresses"
      }
      // Add more sample products as needed
    ];

    sampleProducts.forEach(product => {
      const id = this.currentProductId++;
      this.products.set(id, { ...product, id });
    });
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async addSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    const id = this.currentSubscriberId++;
    const subscriber = { ...insertSubscriber, id };
    this.subscribers.set(id, subscriber);
    return subscriber;
  }
}

export const storage = new MemStorage();
