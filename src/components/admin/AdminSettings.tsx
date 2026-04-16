import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Save, Type, Palette, Phone } from "lucide-react";
import type { SiteSettings } from "@/hooks/useSiteSettings";

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

interface Props {
  settings: SiteSettings;
  queryClient: any;
  toast: any;
}

export default function AdminSettings({ settings, queryClient, toast }: Props) {
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
        whatsapp: form.whatsapp,
        address: form.address,
        instagram: form.instagram,
      })
      .eq("id", form.id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Salvo!", description: "Configurações atualizadas." });
      queryClient.invalidateQueries({ queryKey: ["site_settings"] });
    }
    setSaving(false);
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

      <div className="glass p-6 rounded-2xl border border-border space-y-4">
        <h2 className="font-heading text-lg flex items-center gap-2"><Phone size={20} className="text-gold" /> Contato</h2>
        <div>
          <label className="text-sm text-muted-foreground font-body">WhatsApp (com DDI+DDD)</label>
          <input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} className="w-full mt-1 px-4 py-3 bg-secondary border border-border rounded-xl text-foreground font-body text-sm focus:outline-none focus:border-gold" placeholder="5575981465876" />
        </div>
        <div>
          <label className="text-sm text-muted-foreground font-body">Endereço</label>
          <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full mt-1 px-4 py-3 bg-secondary border border-border rounded-xl text-foreground font-body text-sm focus:outline-none focus:border-gold" placeholder="Salvador, BA" />
        </div>
        <div>
          <label className="text-sm text-muted-foreground font-body">Instagram</label>
          <input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} className="w-full mt-1 px-4 py-3 bg-secondary border border-border rounded-xl text-foreground font-body text-sm focus:outline-none focus:border-gold" placeholder="@fisio.arimoreira" />
        </div>
      </div>

      <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-body text-sm font-medium tracking-widest uppercase rounded-xl hover:bg-gold-light transition-colors disabled:opacity-50">
        <Save size={16} />
        {saving ? "Salvando..." : "Salvar Configurações"}
      </button>
    </div>
  );
}
