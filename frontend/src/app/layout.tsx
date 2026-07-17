import './globals.css';

export const metadata = {
  title: 'FotoEduc',
  description: 'Plataforma profissional para fotógrafos'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 text-gray-900"> 
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold">FotoEduc</h1>
            <nav className="space-x-4">
              <a href="/" className="text-sm text-slate-600">Home</a>
              <a href="/auth/login" className="text-sm text-slate-600">Login</a>
              <a href="/auth/register" className="text-sm text-slate-600">Register</a>
            </nav>
          </div>
        </header>
        <main className="max-w-7xl mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
