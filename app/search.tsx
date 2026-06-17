import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebaseConfig';
import { BottomNav } from '../components/BottomNav';

const CATEGORIES = [
  { key: 'todos', label: 'Todos' },
  { key: 'prazo', label: 'Prazos' },
  { key: 'evento', label: 'Eventos' },
  { key: 'matricula', label: 'Matrículas' },
  { key: 'feriado', label: 'Feriados' },
];

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

interface Event {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string | null;
  audience: string;
  urgent: boolean;
}

export default function Search() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const eventsRef = ref(db, 'events');
    const unsubscribe = onValue(eventsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const list = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        list.sort((a, b) => a.startDate.localeCompare(b.startDate));
        setEvents(list);
      }
      setLoading(false);
    }, (error) => {
      console.error('Erro ao buscar eventos:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (startDate: string, endDate: string) => {
    const [sy, sm, sd] = startDate.split('-').map(Number);
    const [, em, ed] = endDate.split('-').map(Number);
    if (startDate === endDate) return `${sd} de ${MONTH_NAMES_SHORT[sm - 1]}`;
    return `${sd} de ${MONTH_NAMES_SHORT[sm - 1]} → ${ed} de ${MONTH_NAMES_SHORT[em - 1]}`;
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

  const filtered = events.filter((event) => {
    const matchSearch =
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.subtitle?.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      selectedCategory === 'todos' || event.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Buscar Eventos</Text>
        <Text style={styles.headerSub}>Encontre eventos e prazos</Text>
      </View>

      <View style={styles.searchWrapper}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar evento ou prazo..."
            placeholderTextColor="#B4B2A9"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <Text style={styles.clearBtn}>✕</Text>
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.filtersWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat.key}
              style={[styles.filterBtn, selectedCategory === cat.key && styles.filterBtnActive]}
              onPress={() => setSelectedCategory(cat.key)}
            >
              <Text style={[styles.filterText, selectedCategory === cat.key && styles.filterTextActive]}>
                {cat.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#F5C200" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {filtered.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>Nenhum evento encontrado</Text>
            </View>
          ) : (
            <>
              <Text style={styles.resultCount}>
                {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}
              </Text>
              {filtered.map((event) => (
                <Pressable
                  key={event.id}
                  style={styles.eventCard}
                  onPress={() => router.push(`/event/${event.id}`)}
                >
                  <View style={[styles.eventBorder, { backgroundColor: CATEGORY_COLORS[event.category] || '#888780' }]} />
                  <View style={styles.eventBody}>
                    <View style={styles.eventHeader}>
                      <Text style={styles.eventTitle}>{event.title}</Text>
                      <View style={[styles.categoryBadge, { backgroundColor: CATEGORY_COLORS[event.category] || '#888780' }]}>
                        <Text style={styles.categoryBadgeText}>
                          {CATEGORIES.find((c) => c.key === event.category)?.label || event.category}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.eventSubtitle}>{event.subtitle}</Text>
                    <View style={styles.eventFooter}>
                      <Text style={styles.eventDate}>
                        📅 {formatDate(event.startDate, event.endDate)}
                      </Text>
                      <Text style={[styles.daysLeft, { color: event.urgent ? '#E24B4A' : '#888780' }]}>
                        {getDaysLeft(event.startDate)}
                      </Text>
                    </View>
                    {event.location && (
                      <Text style={styles.eventLocation}>📍 {event.location}</Text>
                    )}
                  </View>
                </Pressable>
              ))}
            </>
          )}
        </ScrollView>
      )}

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F4F0' },
  header: {
    backgroundColor: '#1a1a1a',
    paddingTop: 48,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: 'center',
  },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: '500', marginBottom: 4 },
  headerSub: { color: '#888780', fontSize: 12 },
  searchWrapper: { padding: 16, paddingBottom: 8 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D3D1C7',
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchIcon: { fontSize: 14, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#2C2C2A' },
  clearBtn: { fontSize: 14, color: '#B4B2A9', paddingLeft: 8 },
  filtersWrapper: {
    backgroundColor: '#F5F4F0',
    borderBottomWidth: 0.5,
    borderBottomColor: '#D3D1C7',
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D3D1C7',
    backgroundColor: 'white',
    height: 32,
    justifyContent: 'center',
  },
  filterBtnActive: { backgroundColor: '#1a1a1a', borderColor: '#1a1a1a' },
  filterText: { fontSize: 10, color: '#888780' },
  filterTextActive: { color: '#F5C200', fontWeight: '500' },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 16, paddingBottom: 100 },
  emptyBox: { alignItems: 'center', paddingTop: 48 },
  emptyText: { color: '#888780', fontSize: 14 },
  resultCount: {
    fontSize: 9,
    color: '#888780',
    fontWeight: '500',
    letterSpacing: 1,
    marginBottom: 12,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D3D1C7',
    overflow: 'hidden',
    marginBottom: 10,
  },
  eventBorder: { width: 4 },
  eventBody: { flex: 1, padding: 14 },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  eventTitle: { fontWeight: '500', fontSize: 13, color: '#2C2C2A', flex: 1, marginRight: 8 },
  categoryBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  categoryBadgeText: { fontSize: 8, color: 'white', fontWeight: '500' },
  eventSubtitle: { fontSize: 11, color: '#888780', marginBottom: 8 },
  eventFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eventDate: { fontSize: 10, color: '#888780' },
  daysLeft: { fontSize: 10, fontWeight: '500' },
  eventLocation: { fontSize: 10, color: '#B4B2A9', marginTop: 4 },
});