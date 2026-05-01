import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

export function useLogo() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const docRef = doc(db, "settings", "logo");

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setLogoUrl(docSnap.data().value || null);
        } else {
          setLogoUrl(null);
        }
      },
      (error) => {
        console.error("Error fetching logo realtime:", error);
      },
    );

    return () => unsubscribe();
  }, []);

  return logoUrl;
}
