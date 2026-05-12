import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

type NotificationKeys = 'prazos' | 'editais' | 'eventos';

const turma = [
  { label: 'Curso', value: 'Eng. de Software' },
  { label: 'Período', value: '4º período' },
  { label: 'Turno', value: 'Noturno' },
];

const notificationOptions: { key: NotificationKeys; title: string; subtitle: string }[] = [
  { key: 'prazos', title: 'Prazos do meu curso', subtitle: 'Aviso 2 dias antes' },
  { key: 'editais', title: 'Novos editais', subtitle: 'Notificar ao publicar' },
  { key: 'eventos', title: 'Eventos gerais', subtitle: 'Desativado' },
];

export default function Profile() {
  const router = useRouter();
  const [notifications, setNotifications] = useState({
    prazos: true,
    editais: true,
    eventos: false,
  });

  const toggle = (key: NotificationKeys) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>AS</Text>
        </View>
        <Text style={styles.name}>Ada da Silva</Text>
        <Text style={styles.course}>Eng. de Software · 4º período</Text>
        <Text style={styles.campus}>Campus Dois Vizinhos</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Minha Turma */}
        <Text style={styles.sectionLabel}>MINHA TURMA</Text>
        <View style={styles.box}>
          {turma.map((item, index) => (
            <View
              key={index}
              style={[
                styles.row,
                index < turma.length - 1 && styles.rowBorder,
              ]}
            >
              <Text style={styles.rowLabel}>{item.label}</Text>
              <Text style={styles.rowValue}>{item.value}</Text>
            </View>
          ))}
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
        <Pressable
          style={styles.logoutBtn}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.logoutText}>↩ Sair da conta</Text>
        </Pressable>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem} onPress={() => router.push('/home')}>
          <Text style={styles.navIcon}>⌂</Text>
          <Text style={styles.navLabel}>Início</Text>
        </Pressable>
        <Pressable style={styles.navItem} onPress={() => router.push('/calendar')}>
          <Text style={styles.navIcon}>▦</Text>
          <Text style={styles.navLabel}>Calendário</Text>
        </Pressable>
        <Pressable style={styles.navItem} onPress={() => router.push('/notices')}>
          <Text style={styles.navIcon}>◎</Text>
          <Text style={styles.navLabel}>Editais</Text>
        </Pressable>
        <Pressable style={styles.navItem}>
          <Text style={styles.navIconActive}>◉</Text>
          <Text style={styles.navLabelActive}>Perfil</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F4F0' },
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
  rowValue: { fontSize: 12, color: '#2C2C2A' },
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