
import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Creative Developer',
  description: 'Creative Developer Portfolio',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" async></script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
