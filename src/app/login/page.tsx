import { LoginForm } from "@/features/auth/components/LoginForm";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Bienvenido</CardTitle>
                    <CardDescription>
                        Ingresa tus credenciales para acceder al panel de administración.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                </CardContent>
            </Card>
            <div className="mt-8 flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                <span className="font-mono text-[10px] bg-primary/10 px-2 py-0.5 rounded text-primary border border-primary/20">α-antigravity-v1</span>
                <span className="text-[10px] text-muted-foreground tabular-nums">SYNC: {new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}</span>
            </div>
        </div>
    );
}
