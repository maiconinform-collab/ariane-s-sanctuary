import { useState } from "react";
import { Star, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const ReviewForm = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      toast.error("Preencha todos os campos.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("reviews").insert({
        author_name: name.trim(),
        content: content.trim(),
        rating,
      });

      if (error) throw error;

      setSubmitted(true);
      setName("");
      setContent("");
      setRating(5);
      toast.success("Avaliação enviada com sucesso! Ela aparecerá após aprovação.");
    } catch {
      toast.error("Erro ao enviar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div ref={ref} className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto text-center p-10 rounded-2xl glass border border-gold/20 space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-gold/10 flex items-center justify-center">
              <Star className="text-gold fill-gold" size={24} />
            </div>
            <h3 className="font-heading text-xl font-semibold">Obrigada pela sua avaliação!</h3>
            <p className="text-muted-foreground text-sm font-body font-light">
              Seu depoimento será exibido no site após aprovação.
            </p>
            <button onClick={() => setSubmitted(false)} className="text-gold text-sm font-body hover:underline mt-2">
              Enviar outra avaliação
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="py-16">
      <div className="container mx-auto px-4">
        <div className={`max-w-lg mx-auto p-8 rounded-2xl glass border border-border/50 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h3 className="font-heading text-xl font-semibold text-center mb-6">Deixe sua Avaliação</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-secondary/50 border border-border/50 rounded-lg px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold/50 transition-colors"
              />
            </div>
            <div className="flex items-center gap-1 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    size={22}
                    className={`transition-colors ${
                      star <= (hoveredStar || rating) ? "text-gold fill-gold" : "text-muted-foreground/40"
                    }`}
                  />
                </button>
              ))}
            </div>
            <div>
              <textarea
                placeholder="Conte sua experiência..."
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-secondary/50 border border-border/50 rounded-lg px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold/50 transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-gold-light transition-colors duration-300 tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Enviando...
                </span>
              ) : (
                <>
                  <Send size={15} /> Enviar Avaliação
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;
