import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import ClientLayout from '../components/layout/ClientLayout';
import Providers from '../components/Providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-display' });

export const metadata = {
  title: 'AFFORA | Premium Indian Spices',
  description: 'Experience the finest, responsibly sourced Indian spices with AFFORA. Luxury, natural, and premium quality.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-brand-bg text-brand-textMain`}>
        <div className="flex flex-col min-h-screen">
          <Providers>
            <ClientLayout>
              {children}
            </ClientLayout>
          </Providers>
        </div>
      </body>
    </html>
  );
}
