import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Big 404 */}
        <h1
          className="text-[10rem] sm:text-[14rem] font-extrabold leading-none tracking-tighter select-none"
          style={{
            background: 'linear-gradient(135deg, #ec4899 0%, #2dd4bf 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          404
        </h1>

        <p className="text-white/60 text-lg font-light mt-2 mb-2">
          Esta página no existe.
        </p>
        <p className="text-white/30 text-sm font-light mb-10">
          Puede que el enlace esté roto o que la página haya sido movida.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest text-white transition-all duration-300 hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #ec4899, #c026d3)' }}
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
