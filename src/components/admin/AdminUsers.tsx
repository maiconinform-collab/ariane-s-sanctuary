import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus, Shield } from "lucide-react";

interface Props {
  queryClient: any;
  toast: any;
}

export default function AdminUsers({ queryClient, toast }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!email || !password || password.length < 6) return;
    setCreating(true);

    const { data, error } = await supabase.functions.invoke("create-admin-user", {
      body: { email, password },
    });

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else if (data?.error) {
      toast({ title: "Erro", description: data.error, variant: "destructive" });
    } else {
      toast({ title: "Admin criado!", description: `${email} agora é administrador.` });
    }

    setEmail("");
    setPassword("");
    setCreating(false);
  };

  return (
    <div className="max-w-xl space-y-6">
      <h2 className="font-heading text-xl flex items-center gap-2"><Shield size={20} className="text-gold" /> Gerenciar Administradores</h2>
      <p className="text-sm text-muted-foreground font-body">Cadastre novos administradores que terão acesso ao painel.</p>

      <div className="glass p-6 rounded-2xl border border-border space-y-4">
        <div>
          <label className="text-sm text-muted-foreground font-body">E-mail do novo admin</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 px-4 py-3 bg-secondary border border-border rounded-xl text-foreground font-body text-sm focus:outline-none focus:border-gold"
            placeholder="admin@exemplo.com"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground font-body">Senha inicial</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 px-4 py-3 bg-secondary border border-border rounded-xl text-foreground font-body text-sm focus:outline-none focus:border-gold"
            placeholder="Mínimo 6 caracteres"
            minLength={6}
          />
        </div>
        <button
          onClick={handleCreate}
          disabled={creating || !email || !password}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body text-sm font-medium tracking-widest uppercase rounded-xl hover:bg-gold-light transition-colors disabled:opacity-50"
        >
          <UserPlus size={16} />
          {creating ? "Criando..." : "Cadastrar Admin"}
        </button>
      </div>
    </div>
  );
}
