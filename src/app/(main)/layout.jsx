import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ProfileProvider } from "../../components/ProfileContext";
import { AuthProvider } from "../../components/AuthContext";

export default function MainLayout({ children }) {
  return (
    <AuthProvider>
      <ProfileProvider>
        <a
          href="#main-content"
          className="absolute left-[-9999px] top-auto w-px h-px overflow-hidden focus:left-auto focus:top-auto focus:w-auto focus:h-auto focus:p-2 focus:bg-white focus:text-black focus:z-50"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="min-h-screen pt-16">
          {children}
        </main>
        <Footer />
      </ProfileProvider>
    </AuthProvider>
  );
}
