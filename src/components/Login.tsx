import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Ticket, Crown, GraduationCap, Users2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ticketTiers = [
  {
    name: 'Full Access',
    type: 'FULL',
    icon: Crown,
    price: '$299',
    features: [
      'Acceso a todas las sesiones académicas',
      'Eventos sociales incluidos',
      'Material del congreso',
      'Certificado de participación',
      'Networking VIP',
    ],
    color: 'bg-gradient-to-br from-amber-500 to-orange-600',
  },
  {
    name: 'Académico',
    type: 'ACADEMIC',
    icon: GraduationCap,
    price: '$199',
    features: [
      'Acceso a sesiones académicas',
      'Material del congreso',
      'Certificado de participación',
      'Coffee breaks incluidos',
    ],
    color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
  },
  {
    name: 'Social',
    type: 'SOCIAL',
    icon: Users2,
    price: '$99',
    features: [
      'Acceso a eventos sociales',
      'Almuerzo y cena de gala',
      'Actividades de networking',
      'Acceso a áreas comunes',
    ],
    color: 'bg-gradient-to-br from-purple-500 to-pink-600',
  },
];

export function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = await login(email, password);
    
    if (!success) {
      setError('Credenciales inválidas. Por favor, intente nuevamente.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-primary">
              XX Congreso Nacional
            </h1>
            <h2 className="text-3xl lg:text-4xl font-semibold text-foreground">
              de la Abogacía
            </h2>
            <p className="text-lg text-muted-foreground mt-4">
              Plataforma de gestión de eventos para asistentes y organizadores
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2">
                  <Ticket className="h-5 w-5" />
                  Adquirir Entradas
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Opciones de Entrada</DialogTitle>
                  <DialogDescription>
                    Selecciona el tipo de entrada que mejor se adapte a tus necesidades
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid md:grid-cols-3 gap-6 mt-6">
                  {ticketTiers.map((tier) => {
                    const Icon = tier.icon;
                    return (
                      <Card key={tier.type} className="relative overflow-hidden">
                        <div className={`h-2 ${tier.color}`} />
                        <CardHeader>
                          <div className={`w-12 h-12 rounded-full ${tier.color} flex items-center justify-center mb-4`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <CardTitle>{tier.name}</CardTitle>
                          <div className="text-3xl font-bold text-primary mt-2">
                            {tier.price}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <ul className="space-y-2">
                            {tier.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <div className="h-5 w-5 rounded-full bg-accent/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                                  <div className="h-2 w-2 rounded-full bg-accent" />
                                </div>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                          <Button 
                            className="w-full" 
                            onClick={() => window.open('https://intranet.bma.com.ar/entradas', '_blank')}
                          >
                            Comprar Ahora
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-2">Credenciales de prueba:</p>
            <div className="grid gap-2 text-xs font-mono bg-muted/50 p-3 rounded-lg">
              <div><span className="font-semibold">Admin:</span> admin@congreso.com / admin123</div>
              <div><span className="font-semibold">Asistente:</span> maria.garcia@email.com / pass123</div>
            </div>
          </div>
        </div>

        <Card className="w-full shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para acceder a la plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Ingresando...' : 'Ingresar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
