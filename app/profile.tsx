import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ref, get } from 'firebase/database';
import { db } from '../firebaseConfig';
import { useAuth } from '../contexts/AuthContext';
import { BottomNav } from '../components/BottomNav';

type NotificationKeys = 'prazos' | 'eventos';

const notificationOptions: { key: NotificationKeys; title: string; subtitle: string }[] = [
  { key: 'prazos', title: 'Prazos do meu curso', subtitle: 'Aviso 2 dias antes' },
  { key: 'eventos', title: 'Eventos gerais', subtitle: 'Notificar ao publicar' },
];

interface UserData {
  nome: string;
  email: string;
  campus: string;
  tipo: string;
  curso?: string;
  periodo?: string;
  departamento?: string;
}

export default function Profile() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState({
    prazos: true,
    eventos: false,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      try {
        const snapshot = await get(ref(db, `users/${user.uid}`));
        if (snapshot.exists()) {
          setUserData(snapshot.val());
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const toggle = (key: NotificationKeys) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  const getInitials = (nome: string) => {
    return nome
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const turma = userData?.tipo === 'aluno'
    ? [
        { label: 'Curso', value: userData?.curso || '-' },
        { label: 'Período', value: userData?.periodo || '-' },
        { label: 'Campus', value: userData?.campus || '-' },
      ]
    : [
        { label: 'Departamento', value: userData?.departamento || '-' },
        { label: 'Campus', value: userData?.campus || '-' },
      ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F5C200" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {userData?.nome ? getInitials(userData.nome) : '?'}
          </Text>
        </View>
        <Text style={styles.name}>{userData?.nome || 'Usuário'}</Text>
        <Text style={styles.course}>
          {userData?.tipo === 'aluno'
            ? `${userData?.curso || ''} · ${userData?.periodo || ''}`
            : `Servidor · ${userData?.departamento || ''}`}
        </Text>
        <Text style={styles.campus}>Campus {userData?.campus || ''}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Minha Turma */}
        <Text style={styles.sectionLabel}>
          {userData?.tipo === 'aluno' ? 'MINHA TURMA' : 'MEUS DADOS'}
        </Text>
        <View style={styles.box}>
          {turma.map((item, index) => (
            <View
              key={index}
              style={[styles.row, index < turma.length - 1 && styles.rowBorder]}
            >
              <Text style={styles.rowLabel}>{item.label}</Text>
              <Text style={styles.rowValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Email */}
        <Text style={styles.sectionLabel}>CONTA</Text>
        <View style={styles.box}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Email</Text>
            <Text style={styles.rowValue}>{userData?.email || ''}</Text>
          </View>
          <View style={[styles.row, styles.rowBorder]}>
            <Text style={styles.rowLabel}>Tipo</Text>
            <Text style={styles.rowValue}>
              {userData?.tipo === 'aluno' ? 'Aluno' : 'Servidor'}
            </Text>
          </View>
        </View>

        {/* Notificações */}
        <Text style={styles.sectionLabel}>NOTIFICAÇÕES</Text>
        <View style={styles.notifBox}>
          {notificationOptions.map((item) => (
            <View key={item.key} style={styles.notifRow}>
              <View>
                <Text style={styles.notifTitle}>{item.title}</Text>
                <Text style={styles.notifSub}>
                  {notifications[item.key] ? item.subtitle : 'Desativado'}
                </Text>
              </View>
              <Pressable
                style={[
                  styles.toggle,
                  { backgroundColor: notifications[item.key] ? '#1a1a1a' : '#D3D1C7' },
                ]}
                onPress={() => toggle(item.key)}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    {
                      backgroundColor: notifications[item.key] ? '#F5C200' : 'white',
                      alignSelf: notifications[item.key] ? 'flex-end' : 'flex-start',
                    },
                  ]}
                />
              </Pressable>
            </View>
          ))}
        </View>

        {/* Logout */}
        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>↩ Sair da conta</Text>
        </Pressable>
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F4F0' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F4F0' },
  header: {
    backgroundColor: '#1a1a1a',
    paddingTop: 48,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F5C200',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { color: '#1a1a1a', fontSize: 20, fontWeight: '500' },
  name: { color: 'white', fontSize: 18, fontWeight: '500', marginBottom: 4 },
  course: { color: '#888780', fontSize: 12, marginBottom: 4 },
  campus: { color: '#F5C200', fontSize: 12 },
  content: { padding: 24, paddingBottom: 100 },
  sectionLabel: {
    fontSize: 9,
    color: '#888780',
    fontWeight: '500',
    letterSpacing: 1,
    marginBottom: 8,
  },
  box: {
    backgroundColor: '#F5F4F0',
    borderRadius: 10,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E8E6DF',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#D3D1C7',
  },
  rowLabel: { fontSize: 12, color: '#888780' },
  rowValue: { fontSize: 12, color: '#2C2C2A', flexShrink: 1, textAlign: 'right', marginLeft: 8 },
  notifBox: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D3D1C7',
    borderRadius: 10,
    padding: 12,
    gap: 10,
    marginBottom: 24,
  },
  notifRow: {
    backgroundColor: '#F5F4F0',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notifTitle: { fontSize: 12, color: '#2C2C2A', marginBottom: 2 },
  notifSub: { fontSize: 10, color: '#888780' },
  toggle: {
    width: 40,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  logoutBtn: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E24B4A',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: { color: '#E24B4A', fontSize: 14 },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 0.5,
    borderTopColor: '#D3D1C7',
    paddingVertical: 8,
    paddingBottom: 16,
  },
  navItem: { flex: 1, alignItems: 'center' },
  navIcon: { fontSize: 18, color: '#B4B2A9' },
  navIconActive: { fontSize: 18, color: '#F5C200' },
  navLabel: { fontSize: 9, color: '#B4B2A9', marginTop: 2 },
  navLabelActive: { fontSize: 9, color: '#F5C200', fontWeight: '500', marginTop: 2 },
});