import { useState, useEffect } from "react";

export interface TeamMember {
  name: string;
  title: string;
  bio: string;
  image: string;
  expertise: string[];
}

export interface Service {
  iconKey: string;
  title: string;
  description: string;
}

export interface Client {
  name: string;
  description: string;
  logoUrl: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SiteContent {
  hero: {
    headline: string;
    subtext: string;
    subtagline: string;
    whatsappUrl: string;
    businessWhatsappUrl: string;
    linkedinUrl: string;
  };
  about: {
    text: string;
  };
  team: TeamMember[];
  services: Service[];
  clients: Client[];
  gallery: GalleryImage[];
  faq: FaqItem[];
  contact: {
    email: string;
    whatsappUrl: string;
    linkedinUrl: string;
    instagramUrl: string;
  };
  cta: {
    headline: string;
    subtext: string;
    buttonText: string;
    whatsappButtonText: string;
  };
}

export function useContent() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/content.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load content");
        return res.json();
      })
      .then((data: SiteContent) => {
        setContent(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Content load error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { content, loading, error };
}
