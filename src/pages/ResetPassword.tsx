import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, KeyRound } from "lucide-react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase recovery link cria uma sessão temporária
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(!!data.session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setHasSession(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (password.length < 6) return setError("Senha deve ter no mínimo 6 caracteres.");
    if (password !== confirm) return setError("As senhas não coincidem.");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) setError(error.message);
    else {
      setMessage("Senha alterada com sucesso! Redirecionando...");
      setTimeout(() => navigate("/admin"), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-semibold">
            <span className="text-foreground">Nova</span>{" "}
            <span className="text-gold">Senha</span>
          </h1>
          <p className="text-muted-foreground font-body text-sm mt-2">
            Defina sua nova senha de acesso
          </p>
        </div>

        {!hasSession ? (
          <div className="glass p-8 rounded-2xl border border-border text-center space-y-4">
            <p className="text-muted-foreground font-body text-sm">
              Link inválido ou expirado. Solicite um novo link de redefinição.
            </p>
            <a href="/login" className="inline-block text-gold hover:underline font-body text-sm">
              ← Voltar ao login
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 glass p-8 rounded-2xl border border-border">
            <div className="relative">
              <label className="text-sm font-body text-muted-foreground">Nova senha</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-4 py-3 bg-secondary border border-border rounded-xl text-foreground font-body text-sm focus:outline-none focus:border-gold transition-colors pr-12"
                required
                minLength={6}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-muted-foreground hover:text-gold">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div>
              <label className="text-sm font-body text-muted-foreground">Confirmar senha</label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full mt-1 px-4 py-3 bg-secondary border border-border rounded-xl text-foreground font-body text-sm focus:outline-none focus:border-gold transition-colors"
                required
                minLength={6}
              />
            </div>
            {error && <p className="text-destructive text-sm font-body">{error}</p>}
            {message && <p className="text-gold text-sm font-body">{message}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body text-sm font-medium tracking-widest uppercase rounded-xl hover:bg-gold-light transition-colors disabled:opacity-50"
            >
              <KeyRound size={16} />
              {loading ? "Salvando..." : "Definir nova senha"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
