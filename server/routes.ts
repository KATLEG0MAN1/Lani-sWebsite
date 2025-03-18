import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSubscriberSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/products", async (_req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get("/api/products/:id", async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  });

  app.post("/api/subscribe", async (req, res) => {
    try {
      const data = insertSubscriberSchema.parse(req.body);
      const subscriber = await storage.addSubscriber(data);
      res.status(201).json(subscriber);
    } catch (error) {
      res.status(400).json({ message: "Invalid email address" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
