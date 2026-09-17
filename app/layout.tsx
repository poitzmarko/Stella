import "./globals.css";

export const metadata = {
  title: "FX Pro Travel Gold",
  description:
    "Die intelligente Reise-App für Wechselkurse, Navigation, lokale Tipps, Phrasen, Events und Urlaubshilfe.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
