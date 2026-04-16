import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Check, X, Trash2, Star, Eye, EyeOff } from "lucide-react";
import type { Review } from "@/hooks/useReviews";

interface Props {
  reviews: Review[];
  queryClient: any;
  toast: any;
}

export default function AdminReviews({ reviews, queryClient, toast }: Props) {
  const toggleApproval = async (id: string, current: boolean) => {
    const { error } = await supabase.from("reviews").update({ is_approved: !current }).eq("id", id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { toast({ title: current ? "Ocultado" : "Aprovado!" }); queryClient.invalidateQueries({ queryKey: ["reviews"] }); }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { toast({ title: "Excluído!" }); queryClient.invalidateQueries({ queryKey: ["reviews"] }); }
  };

  return (
    <div className="max-w-3xl space-y-4">
      <h2 className="font-heading text-xl">Avaliações & Depoimentos</h2>
      {reviews.length === 0 && <p className="text-muted-foreground font-body text-sm">Nenhuma avaliação recebida ainda.</p>}
      {reviews.map((r) => (
        <div key={r.id} className={`glass p-4 rounded-2xl border ${r.is_approved ? "border-gold/30" : "border-border"}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <p className="font-heading font-semibold text-sm">{r.author_name}</p>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className={i < r.rating ? "text-gold fill-gold" : "text-muted-foreground"} />
                  ))}
                </div>
                {r.is_approved ? (
                  <span className="px-2 py-0.5 text-xs bg-primary/20 text-gold rounded-full font-body">Visível</span>
                ) : (
                  <span className="px-2 py-0.5 text-xs bg-secondary text-muted-foreground rounded-full font-body">Pendente</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground font-body">{r.content}</p>
              <p className="text-xs text-muted-foreground/60 font-body">{new Date(r.created_at).toLocaleDateString("pt-BR")}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => toggleApproval(r.id, r.is_approved)} className={`p-2 ${r.is_approved ? "text-gold hover:text-muted-foreground" : "text-muted-foreground hover:text-gold"}`} title={r.is_approved ? "Ocultar" : "Aprovar"}>
                {r.is_approved ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <button onClick={() => handleDelete(r.id)} className="p-2 text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
