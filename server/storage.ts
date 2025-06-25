import {
  tracks,
  subscribers,
  type Track,
  type InsertTrack,
  type Subscriber,
  type InsertSubscriber,
} from "@shared/schema";

export interface IStorage {
  getTracks(): Promise<Track[]>;
  getTrack(id: number): Promise<Track | undefined>;
  addSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
}

export class MemStorage implements IStorage {
  private tracks: Map<number, Track>;
  private subscribers: Map<number, Subscriber>;
  private currentTrackId: number;
  private currentSubscriberId: number;

  constructor() {
    this.tracks = new Map();
    this.subscribers = new Map();
    this.currentTrackId = 1;
    this.currentSubscriberId = 1;

    // Initialize with sample tracks
    //this is where you can add more tracks
    const sampleTracks: InsertTrack[] = [
      {
        title: "LANI COLORS - Come Alive",
        description:
          "An energetic anthem that captures the essence of living life to the fullest",
        videoUrl:
          "https://www.youtube.com/watch?v=JecrUel-fKw&list=OLAK5uy_nuxS0Xu_7RAuYMjjl0n1L0slUatar_TEY&index=1&pp=8AUB",
        imageUrl: "/images/codee-silhouette.jpg",
        category: "Single",
      },
      {
        title: "LANI COLORS - Spectrum",
        description: "A vibrant journey through sound and emotion",
        videoUrl: "https://www.youtube.com/watch?v=example1",
        imageUrl: "/images/codee-tree.jpg",
        category: "Single",
      },
      {
        title: "LANI COLORS - Rainbow",
        description: "Experience the full spectrum of musical artistry",
        videoUrl: "https://www.youtube.com/watch?v=example2",
        imageUrl: "/images/codee-studio.jpg",
        category: "Album",
      },
    ];

    sampleTracks.forEach((track) => {
      const id = this.currentTrackId++;
      this.tracks.set(id, { ...track, id });
    });
  }

  async getTracks(): Promise<Track[]> {
    return Array.from(this.tracks.values());
  }

  async getTrack(id: number): Promise<Track | undefined> {
    return this.tracks.get(id);
  }

  async addSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    const id = this.currentSubscriberId++;
    const subscriber = { ...insertSubscriber, id };
    this.subscribers.set(id, subscriber);
    return subscriber;
  }
}

export const storage = new MemStorage();
