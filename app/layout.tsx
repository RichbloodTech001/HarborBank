import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "HarborBank — Banking with a clearer view", template: "%s | HarborBank" },
  description: "Manage your profile and review demo banking requests in HarborBank. Real-money transactions are not enabled.",
  robots: { index: false, follow: false }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
