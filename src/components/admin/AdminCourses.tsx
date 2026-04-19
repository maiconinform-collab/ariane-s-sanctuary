import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit2, Trash2, Check, X } from "lucide-react";
import ImageUpload from "./ImageUpload";

interface Props {
  courses: any[];
  queryClient: any;
  toast: any;
}

export default function AdminCourses({ courses, queryClient, toast }: Props) {
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<any>({ title: "", description: "", detailed_text: "", duration: "", has_certificate: false, is_featured: false, image_url: null });
  const [showNew, setShowNew] = useState(false);

  const handleSave = async (id?: string) => {
    if (id) {
      const { error } = await supabase.from("courses").update(form).eq("id", id);
      if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
      else { toast({ title: "Atualizado!" }); setEditing(null); }
    } else {
      const { error } = await supabase.from("courses").insert({ ...form, sort_order: courses.length });
      if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
      else { toast({ title: "Adicionado!" }); setShowNew(false); setForm({ title: "", description: "", detailed_text: "", duration: "", has_certificate: false, is_featured: false, image_url: null }); }
    }
    queryClient.invalidateQueries({ queryKey: ["courses"] });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { toast({ title: "Excluído!" }); queryClient.invalidateQueries({ queryKey: ["courses"] }); }
  };

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-heading text-xl">Cursos & Workshops</h2>
        <button onClick={() => { setShowNew(true); setForm({ title: "", description: "", detailed_text: "", duration: "", has_certificate: false, is_featured: false, image_url: null }); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-body rounded-xl">
          <Plus size={16} /> Novo
        </button>
      </div>

      {showNew && <CourseForm form={form} setForm={setForm} onSave={() => handleSave()} onCancel={() => setShowNew(false)} />}

      {courses.map((c: any) => (
        <div key={c.id} className="glass p-4 rounded-2xl border border-border">
          {editing === c.id ? (
            <CourseForm form={form} setForm={setForm} onSave={() => handleSave(c.id)} onCancel={() => setEditing(null)} />
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-heading font-semibold">{c.title}</p>
                  {c.is_featured && <span className="px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full font-body">Destaque</span>}
                </div>
                <p className="text-sm text-muted-foreground font-body">{c.duration} · {c.has_certificate ? "Com certificado" : "Sem certificado"}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(c.id); setForm({ title: c.title, description: c.description, detailed_text: c.detailed_text || "", duration: c.duration || "", has_certificate: c.has_certificate, is_featured: c.is_featured, image_url: c.image_url || null }); }} className="p-2 text-muted-foreground hover:text-gold"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(c.id)} className="p-2 text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function CourseForm({ form, setForm, onSave, onCancel }: any) {
  return (
    <div className="glass p-4 rounded-2xl border border-gold/30 space-y-3">
      <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Título" className="w-full px-4 py-2 bg-secondary border border-border rounded-xl text-foreground font-body text-sm focus:outline-none focus:border-gold" />
      <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descrição" rows={2} className="w-full px-4 py-2 bg-secondary border border-border rounded-xl text-foreground font-body text-sm focus:outline-none focus:border-gold resize-none" />
      <textarea value={form.detailed_text} onChange={(e) => setForm({ ...form, detailed_text: e.target.value })} placeholder="Texto detalhado (opcional)" rows={3} className="w-full px-4 py-2 bg-secondary border border-border rounded-xl text-foreground font-body text-sm focus:outline-none focus:border-gold resize-none" />
      <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="Duração (ex: 16 horas)" className="w-full px-4 py-2 bg-secondary border border-border rounded-xl text-foreground font-body text-sm focus:outline-none focus:border-gold" />
      <div>
        <label className="text-xs text-muted-foreground font-body block mb-2">Imagem (opcional)</label>
        <ImageUpload value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} folder="courses" />
      </div>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-muted-foreground font-body cursor-pointer">
          <input type="checkbox" checked={form.has_certificate} onChange={(e) => setForm({ ...form, has_certificate: e.target.checked })} className="accent-gold" /> Certificado
        </label>
        <label className="flex items-center gap-2 text-sm text-muted-foreground font-body cursor-pointer">
          <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="accent-gold" /> Destaque
        </label>
      </div>
      <div className="flex gap-2">
        <button onClick={onSave} className="flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground text-sm font-body rounded-xl"><Check size={14} /> Salvar</button>
        <button onClick={onCancel} className="flex items-center gap-1 px-4 py-2 bg-secondary text-foreground text-sm font-body rounded-xl"><X size={14} /> Cancelar</button>
      </div>
    </div>
  );
}
