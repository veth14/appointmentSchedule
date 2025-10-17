import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Doctor Meeting Schedule Tracker',
  description: 'Track and manage doctor meetings across multiple hospitals',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
        {children}
      </body>
    </html>
  );
}
