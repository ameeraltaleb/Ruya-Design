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
}

const DEFAULT_CONTACT_INFO: ContactInfo = {
  phone: "+966 50 000 0000",
  email: "info@locospace.com",
  address: "الرياض، المملكة العربية السعودية",
  instagram: "#",
  facebook: "#",
  twitter: "#",
  whatsapp: "+966500000000",
};

export function useContactInfo() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(DEFAULT_CONTACT_INFO);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, "settings", "contact_info");
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setContactInfo({ ...DEFAULT_CONTACT_INFO, ...docSnap.data() });
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching contact info realtime:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { contactInfo, loading };
}
