import { useState, useEffect } from "react";
import { supabase } from "./supabase";

export function useLogo() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogo = async () => {
      const { data, error } = await supabase.from('settings').select('value').eq('id', 'logo').single();
      if (data && data.value) {
        setLogoUrl(typeof data.value === 'string' ? data.value : String(data.value));
      } else {
        setLogoUrl(null);
      }
    };

    fetchLogo();
  }, []);

  return logoUrl;
}
