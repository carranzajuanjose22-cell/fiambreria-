import { FormEvent, useState } from 'react';

interface LoginViewProps {
  onSubmit: (email: string, password: string) => Promise<void>;
}

export function LoginView({ onSubmit }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSubmit(email, password);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error de autenticación';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-[#121212] border border-[#2a2a2a] rounded-xl p-6">
        <h1 className="text-white text-2xl mb-2">Ingreso al sistema</h1>
        <p className="text-white400 text-sm mb-6">Ingresá con tu usuario para abrir el panel por rol.</p>

        <label className="block text-sm text-white300 mb-2">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-blue-500"
          placeholder="admin@fiambreria.local"
        />

        <label className="block text-sm text-white300 mb-2">Contraseña</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-blue-500"
          placeholder="••••••••"
        />

        {error ? <p className="text-red-400 text-sm mb-4">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Validando...' : 'Iniciar sesión'}
        </button>
      </form>
    </div>
  );
}
