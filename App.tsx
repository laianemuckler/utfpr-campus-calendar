import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

function RootNavigation() {
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

  // Se tá logado, Expo Router renderiza naturalmente
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}