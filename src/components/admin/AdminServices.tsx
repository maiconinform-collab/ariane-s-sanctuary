import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit2, Trash2, Check, X } from "lucide-react";
import ImageUpload from "./ImageUpload";

const iconOptions = ["Activity", "Dumbbell", "Sparkles", "Users", "Heart", "Shield", "Zap", "Star"];

interface Props {
  services: any[];
  queryClient: any;
  toast: any;
}

export default function AdminServices({ services, queryClient, toast }: Props) {
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<any>({ title: "", description: "", detailed_text: "", icon_name: "Activity", image_url: null });
  const [showNew, setShowNew] = useState(false);

  const handleSave = async (id?: string) => {
    if (id) {
      const { error } = await supabase.from("services").update(form).eq("id", id);
      if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
      else { toast({ title: "Atualizado!" }); setEditing(null); }
    } else {
      const { error } = await supabase.from("services").insert({ ...form, sort_order: services.length });
      if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
      else { toast({ title: "Adicionado!" }); setShowNew(false); setForm({ title: "", description: "", detailed_text: "", icon_name: "Activity", image_url: null }); }
    }
    queryClient.invalidateQueries({ queryKey: ["services"] });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { toast({ title: "Excluído!" }); queryClient.invalidateQueries({ queryKey: ["services"] }); }
  };

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-heading text-xl">Serviços</h2>
        <button onClick={() => { setShowNew(true); setForm({ title: "", description: "", detailed_text: "", icon_name: "Activity", image_url: null }); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-body rounded-xl">
          <Plus size={16} /> Novo
        </button>
      </div>

      {showNew && (
        <ItemForm form={form} setForm={setForm} iconOptions={iconOptions} onSave={() => handleSave()} onCancel={() => setShowNew(false)} />
      )}

      {services.map((s: any) => (
        <div key={s.id} className="glass p-4 rounded-2xl border border-border">
          {editing === s.id ? (
            <ItemForm form={form} setForm={setForm} iconOptions={iconOptions} onSave={() => handleSave(s.id)} onCancel={() => setEditing(null)} />
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-heading font-semibold">{s.title}</p>
                <p className="text-sm text-muted-foreground font-body">{s.description}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(s.id); setForm({ title: s.title, description: s.description, detailed_text: s.detailed_text || "", icon_name: s.icon_name, image_url: s.image_url || null }); }} className="p-2 text-muted-foreground hover:text-gold"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(s.id)} className="p-2 text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ItemForm({ form, setForm, iconOptions, onSave, onCancel }: any) {
  return (
    <div className="glass p-4 rounded-2xl border border-gold/30 space-y-3">
      <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Título" className="w-full px-4 py-2 bg-secondary border border-border rounded-xl text-foreground font-body text-sm focus:outline-none focus:border-gold" />
      <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descrição curta" rows={2} className="w-full px-4 py-2 bg-secondary border border-border rounded-xl text-foreground font-body text-sm focus:outline-none focus:border-gold resize-none" />
      <textarea value={form.detailed_text} onChange={(e) => setForm({ ...form, detailed_text: e.target.value })} placeholder="Texto detalhado (opcional)" rows={3} className="w-full px-4 py-2 bg-secondary border border-border rounded-xl text-foreground font-body text-sm focus:outline-none focus:border-gold resize-none" />
      <select value={form.icon_name} onChange={(e) => setForm({ ...form, icon_name: e.target.value })} className="px-4 py-2 bg-secondary border border-border rounded-xl text-foreground font-body text-sm focus:outline-none focus:border-gold">
        {iconOptions.map((i: string) => <option key={i} value={i}>{i}</option>)}
      </select>
      <div>
        <label className="text-xs text-muted-foreground font-body block mb-2">Imagem (opcional)</label>
        <ImageUpload value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} folder="services" />
      </div>
      <div className="flex gap-2">
        <button onClick={onSave} className="flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground text-sm font-body rounded-xl"><Check size={14} /> Salvar</button>
        <button onClick={onCancel} className="flex items-center gap-1 px-4 py-2 bg-secondary text-foreground text-sm font-body rounded-xl"><X size={14} /> Cancelar</button>
      </div>
    </div>
  );
}
