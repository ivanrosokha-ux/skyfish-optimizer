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
    <div className="min-h-[75vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-[#241c19] border border-[#382b26] rounded-2xl p-7 space-y-5 shadow-2xl">
        {/* Tabs */}
        <div className="flex border-b border-[#382b26] pb-3 gap-6 text-sm font-semibold">
          <button
            onClick={() => setIsRegister(false)}
            className={`transition relative pb-2 ${
              !isRegister
                ? 'text-[#269f4d] after:absolute after:bottom-[-13px] after:left-0 after:right-0 after:h-[2px] after:bg-[#269f4d]'
                : 'text-[#87796a] hover:text-[#e5e2de]'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsRegister(true)}
            className={`transition relative pb-2 ${
              isRegister
                ? 'text-[#269f4d] after:absolute after:bottom-[-13px] after:left-0 after:right-0 after:h-[2px] after:bg-[#269f4d]'
                : 'text-[#87796a] hover:text-[#e5e2de]'
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-[#87796a] block mb-1.5 font-medium">Email</label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-[#87796a] text-xs">✉️</span>
              <input
                type="email"
                defaultValue="angler@example.com"
                className="w-full bg-[#14100e] border border-[#382b26] rounded-lg pl-9 pr-3 py-2.5 text-[#e5e2de] font-mono focus:outline-none focus:border-[#269f4d]"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[#87796a] font-medium">Password</label>
              <span className="text-[11px] text-[#87796a] hover:text-[#e5e2de] cursor-pointer">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-[#87796a] text-xs">🔒</span>
              <input
                type="password"
                defaultValue="••••••••••••"
                className="w-full bg-[#14100e] border border-[#382b26] rounded-lg pl-9 pr-3 py-2.5 text-[#e5e2de] font-mono focus:outline-none focus:border-[#269f4d]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#269f4d] hover:bg-[#2eb557] text-white font-semibold rounded-lg transition shadow-sm text-xs mt-2"
          >
            {isRegister ? 'Register' : 'Log in'}
          </button>
        </form>

        <p className="text-[11px] text-[#87796a] text-center pt-1">
          Log in to sync your saved builds across devices.
        </p>
      </div>
    </div>
  );
}
