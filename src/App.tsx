import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Login } from '@/components/Login';
import { AdminDashboard } from '@/components/AdminDashboard';
import { AttendeeDashboard } from '@/components/AttendeeDashboard';

function AppContent() {
    const { currentUser, isAuthenticated } = useAuth();

    if (!isAuthenticated || !currentUser) {
        return <Login />;
    }

    if (currentUser.role === 'STAFF') {
        return <AdminDashboard />;
    }

    return <AttendeeDashboard />;
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
            <Toaster position="top-right" richColors />
        </AuthProvider>
    );
}

export default App