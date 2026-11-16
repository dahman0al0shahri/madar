import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "مَدار · لأنك أساس الحكاية",
  description: "هذه النسخة المجانية من مَدار لمذاكرة الاختبار الدوري الأول لمقرر تطبيقات الحاسب المتقدمة: دروس وتدريبات ومراجعة وحسابك الشخصي.",
  icons: {
    icon: "/assets/favicon-orbit.svg",
    shortcut: "/assets/favicon-orbit.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">{children}</body>
    </html>
  );
}
