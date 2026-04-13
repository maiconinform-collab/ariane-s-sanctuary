import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useServices } from "@/hooks/useServices";
import { useCourses } from "@/hooks/useCourses";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, Settings, BookOpen, Briefcase, Palette, Type, Save, Plus, Trash2, Edit2, X, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: settings } = useSiteSettings();
  const { data: services } = useServices();
  const { data: courses } = useCourses();
  const [activeTab, setActiveTab] = useState<"settings" | "services" | "courses">("settings");

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-gold animate-pulse font-heading text-xl">Carregando...</div></div>;
  if (!user) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const tabs = [
    { id: "settings" as const, label: "Configurações", icon: Settings },
    { id: "services" as const, label: "Serviços", icon: Briefcase },
    { id: "courses" as const, label: "Cursos", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="glass border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-xl font-semibold">
              <span className="text-foreground">Painel</span>{" "}
              <span className="text-gold">Admin</span>
            </h1>
            <p className="text-xs text-muted-foreground font-body">{user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm text-muted-foreground hover:text-gold font-body transition-colors">Ver Site</a>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-secondary text-foreground text-sm font-body rounded-xl hover:bg-destructive/20 hover:text-destructive transition-colors">
              <LogOut size={16} /> Sair
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-body text-sm transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "settings" && settings && (
          <SettingsPanel settings={settings} queryClient={queryClient} toast={toast} />
        )}
        {activeTab === "services" && (
          <ServicesPanel services={services || []} queryClient={queryClient} toast={toast} />
        )}
        {activeTab === "courses" && (
          <CoursesPanel courses={courses || []} queryClient={queryClient} toast={toast} />
        )}
      </div>
    </div>
  );
};

function SettingsPanel({ settings, queryClient, toast }: any) {
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setForm(settings); }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .update({
        site_name: form.site_name,
        slogan: form.slogan,
        font_heading: form.font_heading,
        font_body: form.font_body,
        color_primary: form.color_primary,
        color_secondary: form.color_secondary,
        color_background: form.color_background,
      })
      .eq("id", form.id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Salvo!", description: "Configurações atualizadas." });
      queryClient.invalidateQueries({ queryKey: ["site_settings"] });
    }
    setSaving(false);
  };

  const hslToHex = (hsl: string) => {
    const parts = hsl.split(" ");
    if (parts.length < 3) return "#c5a059";
    const h = parseFloat(parts[0]);
    const s = parseFloat(parts[1]) / 100;
    const l = parseFloat(parts[2]) / 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break;
        case g: h = ((b - r) / d + 2) * 60; break;
        case b: h = ((r - g) / d + 4) * 60; break;
      }
    }
    return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div className="glass p-6 rounded-2xl border border-border space-y-4">
        <h2 className="font-heading text-lg flex items-center gap-2"><Type size={20} className="text-gold" /> Identidade</h2>
        <div>
          <label className="text-sm text-muted-foreground font-body">Nome do Site</label>
          <input value={form.site_name} onChange={(e) => setForm({ ...form, site_name: e.target.value })} className="w-full mt-1 px-4 py-3 bg-secondary border border-border rounded-xl text-foreground font-body text-sm focus:outline-none focus:border-gold" />
        </div>
        <div>
          <label className="text-sm text-muted-foreground font-body">Slogan</label>
          <input value={form.slogan} onChange={(e) => setForm({ ...form, slogan: e.target.value })} className="w-full mt-1 px-4 py-3 bg-secondary border border-border rounded-xl text-foreground font-body text-sm focus:outline-none focus:border-gold" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground font-body">Fonte Título</label>
            <select value={form.font_heading} onChange={(e) => setForm({ ...form, font_heading: e.target.value })} className="w-full mt-1 px-4 py-3 bg-secondary border border-border rounded-xl text-foreground font-body text-sm focus:outline-none focus:border-gold">
              <option value="Playfair Display">Playfair Display</option>
              <option value="Cormorant Garamond">Cormorant Garamond</option>
              <option value="Merriweather">Merriweather</option>
              <option value="Lora">Lora</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground font-body">Fonte Corpo</label>
            <select value={form.font_body} onChange={(e) => setForm({ ...form, font_body: e.target.value })} className="w-full mt-1 px-4 py-3 bg-secondary border border-border rounded-xl text-foreground font-body text-sm focus:outline-none focus:border-gold">
              <option value="Inter">Inter</option>
              <option value="Poppins">Poppins</option>
              <option value="Raleway">Raleway</option>
              <option value="Open Sans">Open Sans</option>
            </select>
          </div>
        </div>
      </div>

      <div className="glass p-6 rounded-2xl border border-border space-y-4">
        <h2 className="font-heading text-lg flex items-center gap-2"><Palette size={20} className="text-gold" /> Cores</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Cor Primária", key: "color_primary" },
            { label: "Cor Secundária", key: "color_secondary" },
            { label: "Cor de Fundo", key: "color_background" },
          ].map((c) => (
            <div key={c.key}>
              <label className="text-sm text-muted-foreground font-body">{c.label}</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={hslToHex(form[c.key as keyof typeof form] as string)}
                  onChange={(e) => setForm({ ...form, [c.key]: hexToHsl(e.target.value) })}
                  className="w-12 h-12 rounded-xl border border-border cursor-pointer"
                />
                <span className="text-xs text-muted-foreground font-body">{form[c.key as keyof typeof form]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-body text-sm font-medium tracking-widest uppercase rounded-xl hover:bg-gold-light transition-colors disabled:opacity-50">
        <Save size={16} />
        {saving ? "Salvando..." : "Salvar Configurações"}
      </button>
    </div>
  );
}

function ServicesPanel({ services, queryClient, toast }: any) {
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", detailed_text: "", icon_name: "Activity" });
  const [showNew, setShowNew] = useState(false);

  const iconOptions = ["Activity", "Dumbbell", "Sparkles", "Users", "Heart", "Shield", "Zap", "Star"];

  const handleSave = async (id?: string) => {
    if (id) {
      const { error } = await supabase.from("services").update(form).eq("id", id);
      if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
      else { toast({ title: "Atualizado!" }); setEditing(null); }
    } else {
      const { error } = await supabase.from("services").insert({ ...form, sort_order: services.length });
      if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
      else { toast({ title: "Adicionado!" }); setShowNew(false); setForm({ title: "", description: "", detailed_text: "", icon_name: "Activity" }); }
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
        <button onClick={() => { setShowNew(true); setForm({ title: "", description: "", detailed_text: "", icon_name: "Activity" }); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-body rounded-xl">
          <Plus size={16} /> Novo
        </button>
      </div>

      {showNew && (
        <ServiceForm form={form} setForm={setForm} iconOptions={iconOptions} onSave={() => handleSave()} onCancel={() => setShowNew(false)} />
      )}

      {services.map((s: any) => (
        <div key={s.id} className="glass p-4 rounded-2xl border border-border">
          {editing === s.id ? (
            <ServiceForm form={form} setForm={setForm} iconOptions={iconOptions} onSave={() => handleSave(s.id)} onCancel={() => setEditing(null)} />
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-heading font-semibold">{s.title}</p>
                <p className="text-sm text-muted-foreground font-body">{s.description}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(s.id); setForm({ title: s.title, description: s.description, detailed_text: s.detailed_text || "", icon_name: s.icon_name }); }} className="p-2 text-muted-foreground hover:text-gold"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(s.id)} className="p-2 text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ServiceForm({ form, setForm, iconOptions, onSave, onCancel }: any) {
  return (
    <div className="glass p-4 rounded-2xl border border-gold/30 space-y-3">
      <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Título" className="w-full px-4 py-2 bg-secondary border border-border rounded-xl text-foreground font-body text-sm focus:outline-none focus:border-gold" />
      <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descrição curta" rows={2} className="w-full px-4 py-2 bg-secondary border border-border rounded-xl text-foreground font-body text-sm focus:outline-none focus:border-gold resize-none" />
      <textarea value={form.detailed_text} onChange={(e) => setForm({ ...form, detailed_text: e.target.value })} placeholder="Texto detalhado (opcional)" rows={3} className="w-full px-4 py-2 bg-secondary border border-border rounded-xl text-foreground font-body text-sm focus:outline-none focus:border-gold resize-none" />
      <select value={form.icon_name} onChange={(e) => setForm({ ...form, icon_name: e.target.value })} className="px-4 py-2 bg-secondary border border-border rounded-xl text-foreground font-body text-sm focus:outline-none focus:border-gold">
        {iconOptions.map((i: string) => <option key={i} value={i}>{i}</option>)}
      </select>
      <div className="flex gap-2">
        <button onClick={onSave} className="flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground text-sm font-body rounded-xl"><Check size={14} /> Salvar</button>
        <button onClick={onCancel} className="flex items-center gap-1 px-4 py-2 bg-secondary text-foreground text-sm font-body rounded-xl"><X size={14} /> Cancelar</button>
      </div>
    </div>
  );
}

function CoursesPanel({ courses, queryClient, toast }: any) {
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", detailed_text: "", duration: "", has_certificate: false, is_featured: false });
  const [showNew, setShowNew] = useState(false);

  const handleSave = async (id?: string) => {
    if (id) {
      const { error } = await supabase.from("courses").update(form).eq("id", id);
      if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
      else { toast({ title: "Atualizado!" }); setEditing(null); }
    } else {
      const { error } = await supabase.from("courses").insert({ ...form, sort_order: courses.length });
      if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
      else { toast({ title: "Adicionado!" }); setShowNew(false); setForm({ title: "", description: "", detailed_text: "", duration: "", has_certificate: false, is_featured: false }); }
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
        <button onClick={() => { setShowNew(true); setForm({ title: "", description: "", detailed_text: "", duration: "", has_certificate: false, is_featured: false }); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-body rounded-xl">
          <Plus size={16} /> Novo
        </button>
      </div>

      {showNew && (
        <CourseForm form={form} setForm={setForm} onSave={() => handleSave()} onCancel={() => setShowNew(false)} />
      )}

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
                <button onClick={() => { setEditing(c.id); setForm({ title: c.title, description: c.description, detailed_text: c.detailed_text || "", duration: c.duration || "", has_certificate: c.has_certificate, is_featured: c.is_featured }); }} className="p-2 text-muted-foreground hover:text-gold"><Edit2 size={16} /></button>
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

export default Admin;
