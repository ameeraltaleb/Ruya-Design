import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export function useLogo() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const docRef = doc(db, "settings", "logo");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setLogoUrl(docSnap.data().value || null);
        }
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };
    fetchLogo();
  }, []);

  return logoUrl;
}
