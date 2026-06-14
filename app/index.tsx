import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { loginStyles } from '../styles/loginStyles';
import { CAMPUS_LIST, DEFAULT_CAMPUS } from '../utils/constants';

export default function Login() {
  const router = useRouter();
  const { login, signup } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [campus, setCampus] = useState(DEFAULT_CAMPUS);
  const [campusOpen, setCampusOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha email e senha');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      router.replace('/home');
    } catch (error: any) {
      Alert.alert('Erro no login', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha email e senha');
      return;
    }

    setIsLoading(true);
    try {
      await signup(email, password);
      Alert.alert('Sucesso', 'Conta criada! Você será redirecionado...');
      setTimeout(() => router.replace('/home'), 1500);
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={loginStyles.container}>
      <View style={loginStyles.card}>

        {/* Header preto */}
        <View style={loginStyles.header}>
          <Image source={require('../assets/utfpr1.png')}
          style={{ width: 200, height: 80, resizeMode: 'contain' }} />
          <Text style={loginStyles.title}>Agenda Acadêmica</Text>
        </View>

        {/* Form */}
        <View style={loginStyles.form}>

          <Text style={loginStyles.label}>E-MAIL INSTITUCIONAL</Text>
          <TextInput
            style={loginStyles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="aluno@utfpr.edu.br"
            placeholderTextColor="#B4B2A9"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />

          <Text style={loginStyles.label}>SENHA</Text>
          <TextInput
            style={loginStyles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="#B4B2A9"
            secureTextEntry
            editable={!isLoading}
          />

          <Pressable
            style={[loginStyles.btnPrimary, isLoading && loginStyles.btnDisabled]}
            onPress={isSignUp ? handleSignUp : handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#1a1a1a" />
            ) : (
              <Text style={loginStyles.btnPrimaryText}>
                {isSignUp ? 'Criar conta' : 'Entrar'}
              </Text>
            )}
          </Pressable>

          <Pressable onPress={() => setIsSignUp(!isSignUp)} disabled={isLoading}>
            <Text style={loginStyles.btnLinkText}>
              {isSignUp ? 'Já tem conta? Faça login' : 'Não tem conta? Criar uma'}
            </Text>
          </Pressable>

          {/* Divider */}
          <View style={loginStyles.divider}>
            <View style={loginStyles.dividerLine} />
            <Text style={loginStyles.dividerText}>ou</Text>
            <View style={loginStyles.dividerLine} />
          </View>

          {/* Campus selector */}
          <Text style={[loginStyles.label, { textAlign: 'center', marginTop: 24 }]}>
            SELECIONE SEU CAMPUS
          </Text>
          <Pressable
            style={loginStyles.input}
            onPress={() => setCampusOpen(!campusOpen)}
            disabled={isLoading}
          >
            <Text style={{ color: '#2C2C2A' }}>{campus}</Text>
          </Pressable>

          {campusOpen && (
            <View style={loginStyles.dropdown}>
              <ScrollView nestedScrollEnabled style={{ maxHeight: 200 }}>
                {CAMPUS_LIST.map((c) => (
                  <Pressable
                    key={c}
                    style={loginStyles.dropdownItem}
                    onPress={() => { setCampus(c); setCampusOpen(false); }}
                  >
                    <Text style={loginStyles.dropdownItemText}>{c}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}

        </View>
      </View>
    </ScrollView>
  );
}