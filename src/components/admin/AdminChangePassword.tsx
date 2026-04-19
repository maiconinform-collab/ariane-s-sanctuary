import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { KeyRound, Eye, EyeOff } from "lucide-react";

interface Props { toast: any }

export default function AdminChangePassword({ toast }: Props) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (password.length < 6) return toast({ title: "Senha curta", description: "Mínimo 6 caracteres.", variant: "destructive" });
    if (password !== confirm) return toast({ title: "Erro", description: "As senhas não coincidem.", variant: "destructive" });
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Senha alterada!", description: "Sua nova senha está ativa." });
      setPassword("");
      setConfirm("");
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <h2 className="font-heading text-xl flex items-center gap-2"><KeyRound size={20} className="text-gold" /> Alterar Minha Senha</h2>
      <p className="text-sm text-muted-foreground font-body">Defina uma nova senha para sua conta de acesso ao painel.</p>

      <div className="glass p-6 rounded-2xl border border-border space-y-4">
        <div className="relative">
          <label className="text-sm text-muted-foreground font-body">Nova senha</label>
          <input
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 px-4 py-3 bg-secondary border border-border rounded-xl text-foreground font-body text-sm focus:outline-none focus:border-gold pr-12"
            placeholder="Mínimo 6 caracteres"
            minLength={6}
          />
          <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-9 text-muted-foreground hover:text-gold">
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <div>
          <label className="text-sm text-muted-foreground font-body">Confirmar nova senha</label>
          <input
            type={show ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full mt-1 px-4 py-3 bg-secondary border border-border rounded-xl text-foreground font-body text-sm focus:outline-none focus:border-gold"
            placeholder="Repita a nova senha"
            minLength={6}
          />
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !password || !confirm}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body text-sm font-medium tracking-widest uppercase rounded-xl hover:bg-gold-light transition-colors disabled:opacity-50"
        >
          <KeyRound size={16} />
          {saving ? "Salvando..." : "Salvar Nova Senha"}
        </button>
      </div>
    </div>
  );
}
