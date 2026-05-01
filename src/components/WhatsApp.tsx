import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";

export default function WhatsApp() {
  const whatsappNumber = "966500000000"; // Replace with real number
  const message = "مرحباً رؤية ديزاين، أرغب في الاستفسار عن خدماتكم.";
  
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center hover:bg-[#128C7E] transition-colors"
    >
      <MessageCircle size={32} />
      <span className="absolute -top-2 -left-2 flex h-5 w-5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-5 w-5 bg-[#25D366] border-2 border-white"></span>
      </span>
    </motion.a>
  );
}
