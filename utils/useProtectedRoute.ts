import { useAuth } from '../contexts/AuthContext';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

/**
 * Hook para proteger telas que requerem autenticação
 * Se não está logado, redireciona para login
 */
export function useProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#F5C200" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/" />;
  }

  return null; // Tudo ok, renderiza a tela
}
