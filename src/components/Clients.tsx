import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function Clients() {
  const [clients, setClients] = useState([
    {
      id: 1,
      url: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    },
    {
      id: 2,
      url: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
    },
    {
      id: 3,
      url: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
    },
    {
      id: 4,
      url: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg",
    },
    {
      id: 5,
      url: "https://upload.wikimedia.org/wikipedia/commons/0/08/Spotify_logo_without_text.svg",
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "settings", "clients");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().value) {
          const parsed = JSON.parse(docSnap.data().value);
          if (Array.isArray(parsed) && parsed.length > 0) {
            if (typeof parsed[0] === "string") {
              setClients(parsed.map((url, i) => ({ id: i, url })));
            } else {
              setClients(parsed);
            }
          } else {
            setClients([]);
          }
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    fetchData();
  }, []);

  if (clients.length === 0) return null;

  return (
    <section className="py-16 bg-slate-900 border-y border-white/5" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-gray-500 font-medium">
            شركاء النجاح الذين يثقون بنا
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {clients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <img
                src={client.url}
                alt="شعار عميل"
                className="h-8 md:h-12 object-contain"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
