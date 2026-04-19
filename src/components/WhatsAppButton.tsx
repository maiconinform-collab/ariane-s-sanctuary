import { MessageCircle, Star } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useReviews } from "@/hooks/useReviews";

const WhatsAppButton = () => {
  const { data: settings } = useSiteSettings();
  const { data: reviews } = useReviews(true);
  const whatsapp = settings?.whatsapp || "5575981465876";

  const count = reviews?.length || 0;
  const avg =
    count > 0
      ? (reviews!.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1)
      : "5.0";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2">
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-md border border-border shadow-lg">
        <Star size={14} className="text-gold fill-gold" />
        <span className="font-body font-semibold text-sm text-foreground">{avg}</span>
        <span className="font-body text-xs text-muted-foreground">({count})</span>
      </div>
      <a
        href={`https://wa.me/${whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 transition-transform duration-300"
        aria-label="Agendar via WhatsApp"
      >
        <MessageCircle size={28} />
      </a>
    </div>
  );
};

export default WhatsAppButton;
