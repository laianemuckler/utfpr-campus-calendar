import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';

const campusList = [
  'Apucarana', 'Campo Mourão', 'Cornélio Procópio', 'Curitiba',
  'Dois Vizinhos', 'Francisco Beltrão', 'Guarapuava', 'Londrina',
  'Medianeira', 'Pato Branco', 'Ponta Grossa', 'Santa Helena', 'Toledo',
];

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [campus, setCampus] = useState('Dois Vizinhos');
  const [campusOpen, setCampusOpen] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>

        {/* Header preto */}
        <View style={styles.header}>
          <Image source={require('../assets/utfpr1.png')}
          style={{ width: 200, height: 80, resizeMode: 'contain' }} />
          <Text style={styles.title}>Agenda Acadêmica</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>

          <Text style={styles.label}>E-MAIL INSTITUCIONAL</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="aluno@utfpr.edu.br"
            placeholderTextColor="#B4B2A9"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>SENHA</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="#B4B2A9"
            secureTextEntry
          />

          <Pressable
            style={styles.btnPrimary}
            onPress={() => router.push('/home')}
          >
            <Text style={styles.btnPrimaryText}>Entrar</Text>
          </Pressable>

          <Pressable style={styles.btnLink}>
            <Text style={styles.btnLinkText}>Esqueci minha senha</Text>
          </Pressable>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable style={styles.btnSecondary}>
            <Text style={styles.btnSecondaryText}>Entrar com Portal UTFPR</Text>
          </Pressable>

          {/* Campus selector */}
          <Text style={[styles.label, { textAlign: 'center', marginTop: 24 }]}>
            SELECIONE SEU CAMPUS
          </Text>
          <Pressable
            style={styles.input}
            onPress={() => setCampusOpen(!campusOpen)}
          >
            <Text style={{ color: '#2C2C2A' }}>{campus}</Text>
          </Pressable>

          {campusOpen && (
            <View style={styles.dropdown}>
              <ScrollView nestedScrollEnabled style={{ maxHeight: 200 }}>
                {campusList.map((c) => (
                  <Pressable
                    key={c}
                    style={styles.dropdownItem}
                    onPress={() => { setCampus(c); setCampusOpen(false); }}
                  >
                    <Text style={styles.dropdownItemText}>{c}</Text>
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
    paddingTop: 40,
    paddingBottom: 32,
    alignItems: 'center',
  },
  logo: {
    fontSize: 36,
    fontWeight: '700',
    color: '#F5C200',
    marginBottom: 4,
  },
  logoSub: {
    fontSize: 9,
    color: '#888780',
    letterSpacing: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#F5C200',
    marginTop: 16,
  },
  form: {
    padding: 32,
  },
  label: {
    fontSize: 8,
    color: '#888780',
    letterSpacing: 1,
    marginBottom: 6,
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
  btnPrimary: {
    backgroundColor: '#F5C200',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  btnPrimaryText: {
    color: '#1a1a1a',
    fontWeight: '500',
    fontSize: 15,
  },
  btnLink: {
    alignItems: 'center',
    marginBottom: 4,
  },
  btnLinkText: {
    color: '#888780',
    fontSize: 12,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D3D1C7',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#B4B2A9',
    fontSize: 12,
  },
  btnSecondary: {
    borderWidth: 1,
    borderColor: '#D3D1C7',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnSecondaryText: {
    color: '#444441',
    fontSize: 14,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#D3D1C7',
    borderRadius: 10,
    backgroundColor: 'white',
    marginTop: -8,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#D3D1C7',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#2C2C2A',
  },
});