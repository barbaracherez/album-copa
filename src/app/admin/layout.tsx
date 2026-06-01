import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Providers from "@/components/layout/Providers";
import Navbar from "@/components/layout/Navbar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <Providers>
      <div className="min-h-screen bg-cream">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
      </div>
    </Providers>
  );
}
