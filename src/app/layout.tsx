import { ReactNode } from 'react';
import './globals.css';

//setting page metadata like the title and description that appear in browser tabs and search engine results.
export const metadata = {
  title: 'Data Table App',
  description: 'A feature-rich data table with JSON Server backend',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}