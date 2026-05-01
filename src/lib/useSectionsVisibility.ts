import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export interface SectionsVisibility {
  hero: boolean;
  clients: boolean;
  about: boolean;
  services: boolean;
  stats: boolean;
  portfolio: boolean;
  testimonials: boolean;
  contact: boolean;
}

export const DEFAULT_VISIBILITY: SectionsVisibility = {
  hero: true,
  clients: true,
  about: true,
  services: true,
  stats: true,
  portfolio: true,
  testimonials: true,
  contact: true,
};

export function useSectionsVisibility() {
  const [visibility, setVisibility] =
    useState<SectionsVisibility>(DEFAULT_VISIBILITY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisibility = async () => {
      try {
        const docRef = doc(db, "settings", "sections_visibility");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().value) {
          const fetched = JSON.parse(docSnap.data().value);
          setVisibility({ ...DEFAULT_VISIBILITY, ...fetched });
        }
      } catch (error) {
        console.error("Error fetching sections visibility:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVisibility();
  }, []);

  return { visibility, loading };
}
