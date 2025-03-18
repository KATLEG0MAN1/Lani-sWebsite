import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSubscriberSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/tracks", async (_req, res) => {
    const tracks = await storage.getTracks();
    res.json(tracks);
  });

  app.get("/api/tracks/:id", async (req, res) => {
    const track = await storage.getTrack(Number(req.params.id));
    if (!track) {
      return res.status(404).json({ message: "Track not found" });
    }
    res.json(track);
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