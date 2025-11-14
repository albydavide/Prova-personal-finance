import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Finanza di Coppia',
  description: 'App per la gestione della finanza personale e di coppia con investimenti',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
