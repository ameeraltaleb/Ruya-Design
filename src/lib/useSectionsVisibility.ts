import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
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
    const docRef = doc(db, "settings", "sections_visibility");

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists() && docSnap.data().value) {
          try {
            const fetched = JSON.parse(docSnap.data().value);
            setVisibility({ ...DEFAULT_VISIBILITY, ...fetched });
          } catch (e) {}
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching sections visibility:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  return { visibility, loading };
}
