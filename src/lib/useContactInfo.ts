import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  instagram: string;
  facebook: string;
  twitter: string;
  whatsapp: string;
  footerText: string;
  workingHours: {
    weekdays: string;
    saturday: string;
    friday: string;
  };
}

const DEFAULT_CONTACT_INFO: ContactInfo = {
  phone: "+90 530 899 51 85",
  address: "الريحانية،هاتاي / تركيا",
  instagram: "#",
  facebook: "#",
  twitter: "#",
  whatsapp: "905308995185",
  footerText:
    "نقدم حلولاً إبداعية في عالم التصميم والطباعة، حيث نجمع بين الخبرة والابتكار لنضع علامتك التجارية في الصدارة.",
  workingHours: {
    weekdays: "9:00 ص - 6:00 م",
    saturday: "10:00 ص - 4:00 م",
    friday: "مغلق",
  },
};

export function useContactInfo() {
  const [contactInfo, setContactInfo] =
    useState<ContactInfo>(DEFAULT_CONTACT_INFO);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, "settings", "contact_info");

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists() && docSnap.data().value) {
          try {
            const fetched = JSON.parse(docSnap.data().value);
            setContactInfo({ ...DEFAULT_CONTACT_INFO, ...fetched });
          } catch (e) {}
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching contact info realtime:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  return { contactInfo, loading };
}
