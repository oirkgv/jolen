import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "جولين | متجر الآيس كريم والحلويات",
  description:
    "متجر جولين للآيس كريم على الصاج والموهيتو وورق العنب. طعم خيال، لحظات جميلة.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="font-arabic bg-jolen-cream antialiased">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontFamily: "Cairo, sans-serif",
              direction: "rtl",
              borderRadius: "1rem",
              background: "#fff",
              color: "#333",
              border: "1px solid #FFE066",
            },
            success: {
              iconTheme: { primary: "#FF8FAB", secondary: "#fff" },
            },
          }}
        />
      </body>
    </html>
  );
}
