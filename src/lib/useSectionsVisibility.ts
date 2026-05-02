import { useState, useEffect } from "react";
import { supabase } from "./supabase";

export interface SectionsVisibility {
  hero: boolean;
  about: boolean;
  services: boolean;
  stats: boolean;
  portfolio: boolean;
  testimonials: boolean;
  contact: boolean;
}

export const DEFAULT_VISIBILITY: SectionsVisibility = {
  hero: true,
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
      const { data, error } = await supabase.from('settings').select('value').eq('id', 'sections_visibility').single();
      if (data && data.value) {
        try {
          const fetched = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
          setVisibility({ ...DEFAULT_VISIBILITY, ...fetched });
        } catch (e) {}
      }
      setLoading(false);
    };

    fetchVisibility();
  }, []);

  return { visibility, loading };
}
