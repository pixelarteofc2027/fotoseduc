export default function Home() {
  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center">
      <h2 className="text-4xl font-extrabold">Bem-vindo ao FotoEduc</h2>
      <p className="mt-4 text-lg text-slate-600 max-w-2xl text-center">
        Plataforma SaaS para fotógrafos venderem e entregarem fotos com segurança e escala.
      </p>
      <div className="mt-8 flex gap-4">
        <a href="/auth/register" className="px-4 py-2 bg-indigo-600 text-white rounded">Criar conta</a>
        <a href="/auth/login" className="px-4 py-2 border rounded">Entrar</a>
      </div>
    </section>
  );
}
