import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { CAMPUS_LIST, DOMINIOS_UTFPR } from '../utils/constants';
import { db } from '../firebaseConfig';
import { ref, set } from 'firebase/database';

const CURSOS = [
  'Engenharia de Software',
  'Engenharia Civil',
  'Engenharia Elétrica',
  'Engenharia Mecânica',
  'Ciência da Computação',
  'Sistemas de Informação',
  'Administração',
  'Outro',
];

const PERIODOS = ['1º', '2º', '3º', '4º', '5º', '6º', '7º', '8º', '9º', '10º'];

const DEPARTAMENTOS = [
  'DAELN - Elétrica',
  'DACOC - Civil',
  'DAMEC - Mecânica',
  'DAINF - Informática',
  'DAMAT - Matemática',
  'DAGRO - Agronomia',
  'Outro',
];

type TipoUsuario = 'aluno' | 'servidor';

export default function Register() {
  const router = useRouter();
  const { signup } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<TipoUsuario>('aluno');
  const [campus, setCampus] = useState('');
  const [curso, setCurso] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [campusOpen, setCampusOpen] = useState(false);
  const [cursoOpen, setCursoOpen] = useState(false);
  const [periodoOpen, setPeriodoOpen] = useState(false);
  const [departamentoOpen, setDepartamentoOpen] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !nome || !campus) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    const emailValido = DOMINIOS_UTFPR.some((dominio) =>
      email.endsWith(dominio),
    );
    if (!emailValido) {
      Alert.alert('Email inválido', 'Use seu email institucional UTFPR');
      return;
    }

    if (tipo === 'aluno' && email.endsWith('@utfpr.edu.br')) {
      Alert.alert('Email inválido', 'Alunos devem usar @alunos.utfpr.edu.br');
      return;
    }

    if (tipo === 'servidor' && email.endsWith('@alunos.utfpr.edu.br')) {
      Alert.alert('Email inválido', 'Servidores devem usar @utfpr.edu.br');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Senha fraca', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    if (tipo === 'aluno' && (!curso || !periodo)) {
      Alert.alert('Erro', 'Preencha curso e período');
      return;
    }

    if (tipo === 'servidor' && !departamento) {
      Alert.alert('Erro', 'Preencha o departamento');
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await signup(email, password);

      await set(ref(db, `users/${userCredential.user.uid}`), {
        nome,
        email,
        campus,
        tipo,
        curso: tipo === 'aluno' ? curso : null,
        periodo: tipo === 'aluno' ? periodo : null,
        departamento: tipo === 'servidor' ? departamento : null,
        criadoEm: new Date().toISOString(),
      });

      Alert.alert('Sucesso', 'Conta criada com sucesso!');
      setTimeout(() => router.replace('/home'), 1500);
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Voltar</Text>
          </Pressable>
          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.subtitle}>UTFPR · Agenda Acadêmica</Text>
        </View>

        <View style={styles.form}>
          {/* Nome */}
          <Text style={styles.label}>NOME COMPLETO</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Seu nome completo"
            placeholderTextColor="#B4B2A9"
            editable={!isLoading}
          />

          {/* Email */}
          <Text style={styles.label}>E-MAIL INSTITUCIONAL</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="aluno@alunos.utfpr.edu.br"
            placeholderTextColor="#B4B2A9"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />

          {/* Senha */}
          <Text style={styles.label}>SENHA</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor="#B4B2A9"
            secureTextEntry
            editable={!isLoading}
          />

          {/* Confirmar senha */}
          <Text style={styles.label}>CONFIRMAR SENHA</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Repita a senha"
            placeholderTextColor="#B4B2A9"
            secureTextEntry
            editable={!isLoading}
          />

          {/* Tipo de usuário */}
          <Text style={styles.label}>TIPO DE USUÁRIO</Text>
          <View style={styles.tipoRow}>
            <Pressable
              style={[styles.tipoBtn, tipo === 'aluno' && styles.tipoBtnActive]}
              onPress={() => setTipo('aluno')}
            >
              <Text
                style={[
                  styles.tipoBtnText,
                  tipo === 'aluno' && styles.tipoBtnTextActive,
                ]}
              >
                Aluno
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.tipoBtn,
                tipo === 'servidor' && styles.tipoBtnActive,
              ]}
              onPress={() => setTipo('servidor')}
            >
              <Text
                style={[
                  styles.tipoBtnText,
                  tipo === 'servidor' && styles.tipoBtnTextActive,
                ]}
              >
                Servidor
              </Text>
            </Pressable>
          </View>

          {/* Campus */}
          <Text style={styles.label}>CAMPUS</Text>
          <Pressable
            style={styles.input}
            onPress={() => setCampusOpen(!campusOpen)}
          >
            <Text style={{ color: campus ? '#2C2C2A' : '#B4B2A9' }}>
              {campus || 'Selecione seu campus'}
            </Text>
          </Pressable>
          {campusOpen && (
            <View style={styles.dropdown}>
              <ScrollView nestedScrollEnabled style={{ maxHeight: 160 }}>
                {CAMPUS_LIST.map((c) => (
                  <Pressable
                    key={c}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setCampus(c);
                      setCampusOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownText}>{c}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Campos de Aluno */}
          {tipo === 'aluno' && (
            <>
              <Text style={styles.label}>CURSO</Text>
              <Pressable
                style={styles.input}
                onPress={() => setCursoOpen(!cursoOpen)}
              >
                <Text style={{ color: curso ? '#2C2C2A' : '#B4B2A9' }}>
                  {curso || 'Selecione seu curso'}
                </Text>
              </Pressable>
              {cursoOpen && (
                <View style={styles.dropdown}>
                  <ScrollView nestedScrollEnabled style={{ maxHeight: 160 }}>
                    {CURSOS.map((c) => (
                      <Pressable
                        key={c}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setCurso(c);
                          setCursoOpen(false);
                        }}
                      >
                        <Text style={styles.dropdownText}>{c}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              )}

              <Text style={styles.label}>PERÍODO</Text>
              <Pressable
                style={styles.input}
                onPress={() => setPeriodoOpen(!periodoOpen)}
              >
                <Text style={{ color: periodo ? '#2C2C2A' : '#B4B2A9' }}>
                  {periodo || 'Selecione o período'}
                </Text>
              </Pressable>
              {periodoOpen && (
                <View style={styles.dropdown}>
                  <ScrollView nestedScrollEnabled style={{ maxHeight: 160 }}>
                    {PERIODOS.map((p) => (
                      <Pressable
                        key={p}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setPeriodo(p);
                          setPeriodoOpen(false);
                        }}
                      >
                        <Text style={styles.dropdownText}>{p}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              )}
            </>
          )}

          {/* Campos de Servidor */}
          {tipo === 'servidor' && (
            <>
              <Text style={styles.label}>DEPARTAMENTO</Text>
              <Pressable
                style={styles.input}
                onPress={() => setDepartamentoOpen(!departamentoOpen)}
              >
                <Text style={{ color: departamento ? '#2C2C2A' : '#B4B2A9' }}>
                  {departamento || 'Selecione o departamento'}
                </Text>
              </Pressable>
              {departamentoOpen && (
                <View style={styles.dropdown}>
                  <ScrollView nestedScrollEnabled style={{ maxHeight: 160 }}>
                    {DEPARTAMENTOS.map((d) => (
                      <Pressable
                        key={d}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setDepartamento(d);
                          setDepartamentoOpen(false);
                        }}
                      >
                        <Text style={styles.dropdownText}>{d}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              )}
            </>
          )}

          {/* Botão cadastrar */}
          <Pressable
            style={[styles.btnPrimary, isLoading && { opacity: 0.6 }]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#1a1a1a" />
            ) : (
              <Text style={styles.btnPrimaryText}>Criar conta</Text>
            )}
          </Pressable>

          <Pressable onPress={() => router.back()}>
            <Text style={styles.btnLinkText}>Já tem conta? Faça login</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F4F0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 24,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#1a1a1a',
    paddingTop: 48,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  backBtn: { marginBottom: 16 },
  backText: { color: 'white', fontSize: 14 },
  title: { color: 'white', fontSize: 22, fontWeight: '500', marginBottom: 4 },
  subtitle: { color: '#F5C200', fontSize: 12 },
  form: { padding: 24, paddingBottom: 48 },
  label: {
    fontSize: 8,
    color: '#888780',
    letterSpacing: 1,
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D3D1C7',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#2C2C2A',
    marginBottom: 16,
    justifyContent: 'center',
  },
  tipoRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  tipoBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D3D1C7',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  tipoBtnActive: {
    backgroundColor: '#1a1a1a',
    borderColor: '#1a1a1a',
  },
  tipoBtnText: { fontSize: 13, color: '#888780' },
  tipoBtnTextActive: { color: '#F5C200', fontWeight: '500' },
  dropdown: {
    borderWidth: 1,
    borderColor: '#D3D1C7',
    borderRadius: 10,
    backgroundColor: 'white',
    marginTop: -10,
    marginBottom: 16,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#D3D1C7',
  },
  dropdownText: { fontSize: 14, color: '#2C2C2A' },
  btnPrimary: {
    backgroundColor: '#F5C200',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  btnPrimaryText: { color: '#1a1a1a', fontWeight: '500', fontSize: 15 },
  btnLinkText: { color: '#888780', fontSize: 12, textAlign: 'center' },
});
