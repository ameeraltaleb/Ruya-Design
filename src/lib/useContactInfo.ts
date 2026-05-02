import { useState, useEffect } from "react";
import { supabase } from "./supabase";

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
  email: "info@ruya.com",
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
    const fetchContact = async () => {
      const { data, error } = await supabase.from('settings').select('value').eq('id', 'contact_info').single();
      if (data && data.value) {
        try {
          const fetched = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
          setContactInfo({ ...DEFAULT_CONTACT_INFO, ...fetched });
        } catch (e) {}
      }
      setLoading(false);
    };

    fetchContact();
  }, []);

  return { contactInfo, loading };
}
