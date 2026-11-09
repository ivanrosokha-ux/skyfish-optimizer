import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/account');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-surface border border-surface-border rounded-xl p-6 space-y-4 shadow-xl">
        <div className="flex border-b border-surface-border pb-2 gap-4 text-sm font-semibold">
          <button
            onClick={() => setIsRegister(false)}
            className={`pb-2 transition ${
              !isRegister ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-zinc-500'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsRegister(true)}
            className={`pb-2 transition ${
              isRegister ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-zinc-500'
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="text-zinc-400 block mb-1">Email</label>
            <input
              type="email"
              defaultValue="angler@example.com"
              className="w-full bg-black/50 border border-surface-border rounded-lg px-3 py-2 text-zinc-100 font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-zinc-400">Password</label>
              <span className="text-[10px] text-zinc-500 hover:text-zinc-400 cursor-pointer">
                Forgot password?
              </span>
            </div>
            <input
              type="password"
              defaultValue="••••••••••••"
              className="w-full bg-black/50 border border-surface-border rounded-lg px-3 py-2 text-zinc-100 font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition"
          >
            {isRegister ? 'Register' : 'Log in'}
          </button>
        </form>

        <p className="text-[11px] text-zinc-500 text-center">
          Log in to sync your saved builds across devices.
        </p>
      </div>
    </div>
  );
}
