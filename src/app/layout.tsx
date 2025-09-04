
import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MoodyO - Mood Based Audio',
  description: 'A mood-based audio player experience.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap" rel="stylesheet" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" async></script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
