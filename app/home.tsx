import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ref, get, onValue } from 'firebase/database';
import { db } from '../firebaseConfig';
import { useAuth } from '../contexts/AuthContext';
import { useProtectedRoute } from '../utils/useProtectedRoute';
import { BottomNav } from '../components/BottomNav';

const CATEGORY_COLORS: Record<string, string> = {
  prazo: '#E24B4A',
  evento: '#F5C200',
  matricula: '#7F77DD',
  feriado: '#888780',
};

const MONTH_NAMES_SHORT = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

function getTodayKey() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

interface UserData {
  nome: string;
  curso?: string;
  periodo?: string;
  departamento?: string;
  tipo: string;
}

interface Event {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  startDate: string;
  endDate: string;
  urgent: boolean;
  audience: string;
  curso: string | null;
}

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const { loading } = useProtectedRoute();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [otherEvents, setOtherEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      try {
        const snapshot = await get(ref(db, `users/${user.uid}`));
        if (snapshot.exists()) setUserData(snapshot.val());
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };
    fetchUserData();
  }, [user]);

  useEffect(() => {
    const unsubscribe = onValue(ref(db, 'events'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const todayKey = getTodayKey();

        const list: Event[] = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        const future = list
          .filter((e) => e.endDate >= todayKey)
          .sort((a, b) => a.startDate.localeCompare(b.startDate));

        setUpcomingEvents(future.slice(0, 3));
        setOtherEvents(future.slice(3, 6));
      }
      setEventsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getInitials = (nome: string) =>
    nome.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();

  const getPrimeiroNome = (nome: string) => nome.split(' ')[0];

  const getSubtitle = () => {
    if (!userData) return '';
    if (userData.tipo === 'aluno') return `${userData.curso || ''} · ${userData.periodo || ''}`;
    return `Servidor · ${userData.departamento || ''}`;
  };

  const getDaysLeft = (startDate: string) => {
    const todayKey = getTodayKey();
    const diff = Math.ceil(
      (new Date(startDate + 'T00:00:00').getTime() - new Date(todayKey + 'T00:00:00').getTime()) /
        (1000 * 60 * 60 * 24)
    );
    if (diff < 0) return 'Encerrado';
    if (diff === 0) return 'Hoje';
    if (diff === 1) return 'Amanhã';
    return `em ${diff} dias`;
  };

  const formatDate = (startDate: string, endDate: string) => {
    const [sy, sm, sd] = startDate.split('-').map(Number);
    const [, em, ed] = endDate.split('-').map(Number);
    if (startDate === endDate) return `${sd} de ${MONTH_NAMES_SHORT[sm - 1]}`;
    return `${sd} a ${ed} de ${MONTH_NAMES_SHORT[em - 1]}`;
  };

  if (loading) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>
            Olá, {userData ? getPrimeiroNome(userData.nome) : '...'}
          </Text>
          <Text style={styles.headerSub}>{getSubtitle()}</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {userData ? getInitials(userData.nome) : '...'}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionLabel}>PRÓXIMOS EVENTOS</Text>

        {eventsLoading ? (
          <ActivityIndicator color="#F5C200" style={{ marginBottom: 16 }} />
        ) : upcomingEvents.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum evento próximo</Text>
        ) : (
          upcomingEvents.map((event) => (
            <Pressable
              key={event.id}
              style={[styles.eventCard, event.urgent && styles.eventCardUrgent]}
              onPress={() => router.push(`/event/${event.id}`)}
            >
              <View style={[styles.eventBorder, { backgroundColor: CATEGORY_COLORS[event.category] || '#888780' }]} />
              <View style={styles.eventBody}>
                <Text style={[styles.eventTitle, event.urgent && styles.eventTitleUrgent]}>
                  {event.title}
                </Text>
                <Text style={styles.eventSubtitle}>{event.subtitle}</Text>
                <View style={[styles.eventBadge, { backgroundColor: event.urgent ? '#E24B4A' : (CATEGORY_COLORS[event.category] || '#888780') }]}>
                  <Text style={styles.eventBadgeText}>{getDaysLeft(event.startDate)}</Text>
                </View>
              </View>
            </Pressable>
          ))
        )}

        {otherEvents.length > 0 && (
          <>
            <Text style={[styles.sectionLabel, { marginTop: 8 }]}>OUTROS EVENTOS</Text>
            {otherEvents.map((event) => (
              <Pressable
                key={event.id}
                style={styles.outroEventoCard}
                onPress={() => router.push(`/event/${event.id}`)}
              >
                <View style={styles.eventBody}>
                  <Text style={styles.outroEventoTitle}>{event.title}</Text>
                  <Text style={styles.outroEventoSub}>
                    {formatDate(event.startDate, event.endDate)}
                  </Text>
                </View>
                <Text style={styles.outroEventoArrow}>›</Text>
              </Pressable>
            ))}
          </>
        )}

        <Pressable style={styles.searchBtn} onPress={() => router.push('/search')}>
          <Text style={styles.searchBtnText}>🔍 Buscar eventos</Text>
        </Pressable>
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F4F0' },
  header: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: '500', marginBottom: 4 },
  headerSub: { color: '#888780', fontSize: 12 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5C200',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#1a1a1a', fontWeight: '500', fontSize: 16 },
  content: { padding: 24, paddingBottom: 100 },
  sectionLabel: {
    fontSize: 9,
    color: '#888780',
    fontWeight: '500',
    letterSpacing: 1,
    marginBottom: 12,
  },
  emptyText: { color: '#B4B2A9', fontSize: 12, marginBottom: 16 },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D3D1C7',
    overflow: 'hidden',
    marginBottom: 10,
  },
  eventCardUrgent: { backgroundColor: '#1a1a1a', borderColor: '#1a1a1a' },
  eventBorder: { width: 4 },
  eventBody: { flex: 1, padding: 16 },
  eventTitle: { fontWeight: '500', fontSize: 14, color: '#2C2C2A', marginBottom: 4 },
  eventTitleUrgent: { color: 'white' },
  eventSubtitle: { fontSize: 12, color: '#888780', marginBottom: 6 },
  eventBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  eventBadgeText: { color: 'white', fontSize: 10 },
  outroEventoCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D3D1C7',
    overflow: 'hidden',
    marginBottom: 10,
    alignItems: 'center',
  },
  outroEventoTitle: { fontWeight: '500', fontSize: 14, color: '#2C2C2A', marginBottom: 4 },
  outroEventoSub: { fontSize: 12, color: '#888780' },
  outroEventoArrow: { fontSize: 24, color: '#B4B2A9', paddingRight: 16 },
  searchBtn: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  searchBtnText: { color: '#F5C200', fontSize: 14, fontWeight: '500' },
});