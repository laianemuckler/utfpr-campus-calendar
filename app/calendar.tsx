import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebaseConfig';
import { BottomNav } from '../components/BottomNav';

const filters = ['Todos', 'Eventos', 'Prazos', 'Matrículas', 'Feriados'];

const FILTER_TO_CATEGORY: Record<string, string | null> = {
  Todos: null,
  Eventos: 'evento',
  Prazos: 'prazo',
  Matrículas: 'matricula',
  Feriados: 'feriado',
};

const CATEGORY_COLORS: Record<string, string> = {
  prazo: '#E24B4A',
  evento: '#F5C200',
  matricula: '#7F77DD',
  feriado: '#888780',
};

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

interface Event {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string | null;
  curso: string | null;
  audience: string;
}

function parseDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return { year, month: month - 1, day };
}

function formatDateKey(year: number, month: number, day: number) {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

export default function Calendar() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onValue(ref(db, 'events'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const list: Event[] = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setEvents(list);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthLabel = `${MONTH_NAMES[month]} ${year}`;

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const filteredEvents = events.filter((event) => {
    const categoryFilter = FILTER_TO_CATEGORY[selectedFilter];
    if (categoryFilter && event.category !== categoryFilter) return false;

    const start = parseDate(event.startDate);
    const end = parseDate(event.endDate);
    const startKey = `${start.year}-${String(start.month + 1).padStart(2, '0')}`;
    const endKey = `${end.year}-${String(end.month + 1).padStart(2, '0')}`;
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;

    return startKey <= monthKey && endKey >= monthKey;
  });

  const eventDaysMap: Record<number, string> = {};
  filteredEvents.forEach((event) => {
    const start = parseDate(event.startDate);
    const end = parseDate(event.endDate);

    const startDay = (start.year === year && start.month === month) ? start.day : 1;
    const endDay = (end.year === year && end.month === month) ? end.day : totalDays;

    for (let d = startDay; d <= endDay; d++) {
      eventDaysMap[d] = CATEGORY_COLORS[event.category] || '#888780';
    }
  });

  const eventsToShow = selectedDay
    ? filteredEvents.filter((event) => {
        const checkKey = formatDateKey(year, month, selectedDay);
        return event.startDate <= checkKey && event.endDate >= checkKey;
      })
    : [...filteredEvents].sort((a, b) => a.startDate.localeCompare(b.startDate));

  const formatEventDate = (startDate: string, endDate: string) => {
    const s = parseDate(startDate);
    const e = parseDate(endDate);
    const startLabel = `${s.day} de ${MONTH_NAMES[s.month]}`;
    if (startDate === endDate) return startLabel.toUpperCase();
    const endLabel = `${e.day} de ${MONTH_NAMES[e.month]}`;
    return `${s.day} A ${endLabel}`.toUpperCase();
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  const weekendDays: number[] = [];
  for (let d = 1; d <= totalDays; d++) {
    const dow = new Date(year, month, d).getDay();
    if (dow === 0 || dow === 6) weekendDays.push(d);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calendário</Text>
        <View style={styles.monthNav}>
          <Pressable onPress={goToPreviousMonth} style={styles.monthNavBtn}>
            <Text style={styles.monthNavText}>‹</Text>
          </Pressable>
          <Text style={styles.headerSub}>{monthLabel}</Text>
          <Pressable onPress={goToNextMonth} style={styles.monthNavBtn}>
            <Text style={styles.monthNavText}>›</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.filtersWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {filters.map((filter) => (
            <Pressable
              key={filter}
              style={[styles.filterBtn, selectedFilter === filter && styles.filterBtnActive]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[styles.filterText, selectedFilter === filter && styles.filterTextActive]}>
                {filter}
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
          <View style={styles.calendarBox}>
            <View style={styles.weekRow}>
              {weekDays.map((d, i) => (
                <Text key={i} style={styles.weekDay}>{d}</Text>
              ))}
            </View>

            <View style={styles.daysGrid}>
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <View key={`empty-${i}`} style={styles.dayCell} />
              ))}
              {Array.from({ length: totalDays }, (_, i) => {
                const day = i + 1;
                const isSelected = day === selectedDay;
                const eventColor = eventDaysMap[day];
                const isWeekend = weekendDays.includes(day);
                return (
                  <Pressable
                    key={day}
                    style={styles.dayCell}
                    onPress={() => setSelectedDay(isSelected ? null : day)}
                  >
                    {isSelected ? (
                      <View style={styles.selectedDay}>
                        <Text style={styles.selectedDayText}>{day}</Text>
                      </View>
                    ) : (
                      <>
                        <Text style={[styles.dayText, isWeekend && styles.dayTextWeekend]}>
                          {day}
                        </Text>
                        {eventColor && (
                          <View style={[styles.eventDot, { backgroundColor: eventColor }]} />
                        )}
                      </>
                    )}
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#E24B4A' }]} />
                <Text style={styles.legendText}>Prazo</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#F5C200' }]} />
                <Text style={styles.legendText}>Evento</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#7F77DD' }]} />
                <Text style={styles.legendText}>Matrícula</Text>
              </View>
            </View>
          </View>

          {selectedDay && (
            <Pressable onPress={() => setSelectedDay(null)} style={styles.clearDayBtn}>
              <Text style={styles.clearDayText}>✕ Mostrar todos os eventos do mês</Text>
            </Pressable>
          )}

          {eventsToShow.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum evento neste período</Text>
          ) : (
            eventsToShow.map((event) => (
              <Pressable
                key={event.id}
                style={styles.eventGroup}
                onPress={() => router.push(`/event/${event.id}`)}
              >
                <Text style={styles.eventDate}>
                  {formatEventDate(event.startDate, event.endDate)}
                </Text>
                <View style={styles.eventCard}>
                  <View style={[styles.eventBorder, { backgroundColor: CATEGORY_COLORS[event.category] || '#888780' }]} />
                  <View style={styles.eventBody}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventLocation}>{event.subtitle}</Text>
                    <Text style={styles.eventCategory}>
                      {event.audience === 'geral' ? 'Todos os cursos' : event.curso}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))
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
  headerTitle: { color: 'white', fontSize: 18, fontWeight: '500', marginBottom: 8 },
  monthNav: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  monthNavBtn: { paddingHorizontal: 8 },
  monthNavText: { color: '#F5C200', fontSize: 18, fontWeight: '600' },
  headerSub: { color: '#888780', fontSize: 12, minWidth: 100, textAlign: 'center' },
  filtersWrapper: {
    backgroundColor: 'white',
    borderBottomWidth: 0.5,
    borderBottomColor: '#D3D1C7',
  },
  filters: { paddingHorizontal: 16, paddingVertical: 10, gap: 8, flexDirection: 'row' },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D3D1C7',
    backgroundColor: 'white',
  },
  filterBtnActive: { backgroundColor: '#1a1a1a', borderColor: '#1a1a1a' },
  filterText: { fontSize: 10, color: '#888780' },
  filterTextActive: { color: '#F5C200', fontWeight: '500' },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 24, paddingBottom: 100 },
  calendarBox: {
    backgroundColor: '#F5F4F0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E8E6DF',
  },
  weekRow: { flexDirection: 'row', marginBottom: 8 },
  weekDay: { flex: 1, textAlign: 'center', fontSize: 10, color: '#888780' },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: { fontSize: 10, color: '#2C2C2A' },
  dayTextWeekend: { color: '#B4B2A9' },
  selectedDay: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F5C200',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDayText: { fontSize: 10, color: '#1a1a1a', fontWeight: '500' },
  eventDot: { width: 5, height: 5, borderRadius: 3, marginTop: 2 },
  legend: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: '#D3D1C7',
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 10, color: '#888780' },
  clearDayBtn: {
    alignSelf: 'center',
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearDayText: { fontSize: 11, color: '#888780' },
  emptyText: { color: '#B4B2A9', fontSize: 12, textAlign: 'center', marginTop: 24 },
  eventGroup: { marginBottom: 16 },
  eventDate: { fontSize: 9, color: '#888780', fontWeight: '500', letterSpacing: 1, marginBottom: 8 },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D3D1C7',
    overflow: 'hidden',
  },
  eventBorder: { width: 4 },
  eventBody: { flex: 1, padding: 16 },
  eventTitle: { fontWeight: '500', color: '#2C2C2A', fontSize: 14, marginBottom: 4 },
  eventLocation: { fontSize: 12, color: '#888780', marginBottom: 2 },
  eventCategory: { fontSize: 12, color: '#B4B2A9' },
});