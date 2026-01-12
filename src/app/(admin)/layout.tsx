import { auth, signOut } from "@/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Scan, LogOut } from "lucide-react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-40 border-b bg-background shadow-sm">
                <div className="container flex h-16 items-center justify-between py-4">
                    <div className="flex gap-6 md:gap-10">
                        <Link href="/dashboard/events" className="flex items-center space-x-2">
                            <span className="inline-block font-bold">Event Experience Admin</span>
                        </Link>
                        <nav className="hidden md:flex gap-6">
                            <Link
                                href="/dashboard/events"
                                className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors gap-1"
                            >
                                <Calendar className="w-4 h-4" />
                                Eventos
                            </Link>
                            <Link
                                href="/dashboard/checkin"
                                className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors gap-1"
                            >
                                <Scan className="w-4 h-4" />
                                Check-in
                            </Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium hidden sm:inline-block">
                            {session?.user?.name || session?.user?.email}
                        </span>
                        <form
                            action={async () => {
                                "use server";
                                await signOut({ redirectTo: "/login" });
                            }}
                        >
                            <Button variant="ghost" size="sm" className="gap-2">
                                <LogOut className="w-4 h-4" />
                                Salir
                            </Button>
                        </form>
                    </div>
                </div>
            </header>
            <main className="flex-1 container py-8">
                {children}
            </main>
        </div>
    );
}
