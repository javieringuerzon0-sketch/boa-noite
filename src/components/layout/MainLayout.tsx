import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { WhatsAppButton } from '../ui/WhatsAppButton';

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col w-full bg-background text-foreground">
      <ScrollRestoration getKey={({ pathname }) => pathname} />
      <Header />
      <main className="flex-1 w-full relative">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
