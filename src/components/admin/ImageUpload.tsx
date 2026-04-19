import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, ImageIcon } from "lucide-react";

interface Props {
  value?: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
}

export default function ImageUpload({ value, onChange, folder = "general" }: Props) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${folder}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("site-images").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (!error) {
      const { data } = supabase.storage.from("site-images").getPublicUrl(path);
      onChange(data.publicUrl);
    }
    setUploading(false);
  };

  return (
    <div className="flex items-center gap-3">
      {value ? (
        <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-border">
          <img src={value} alt="preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-1 right-1 p-1 bg-background/80 rounded-full text-destructive hover:bg-background"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <div className="w-20 h-20 rounded-xl border border-dashed border-border flex items-center justify-center text-muted-foreground">
          <ImageIcon size={24} />
        </div>
      )}
      <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-secondary text-foreground text-sm font-body rounded-xl hover:bg-secondary/70 transition-colors">
        <Upload size={14} />
        {uploading ? "Enviando..." : value ? "Trocar imagem" : "Enviar imagem"}
        <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
      </label>
    </div>
  );
}
