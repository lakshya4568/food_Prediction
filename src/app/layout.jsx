import { Poppins } from "next/font/google";
import "./globals.css";
import ClientProviders from "../components/ClientProviders"; // add client providers wrapper

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "NutriVision - AI-Powered Nutrition Analysis",
  description:
    "Take a photo of your food and instantly get detailed nutritional information to help you make healthier choices.",
  keywords: "nutrition, AI, food analysis, health, diet, calories",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
      </head>
      <body className={`${poppins.variable} antialiased font-sans`}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
