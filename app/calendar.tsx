import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { BottomNav } from '../components/BottomNav';

const filters = ['Todos', 'Eventos', 'Prazos', 'Meu curso'];

const eventsList = [
  {
    date: '13 DE MAIO',
    title: 'Entrega de TCC',
    location: 'Coordenação · Sala B-204',
    category: 'Engenharia de Software',
    color: '#E24B4A',
  },
  {
    date: '15 A 19 DE MAIO',
    title: 'Semana Acadêmica',
    location: 'Campus · Auditório Principal',
    category: 'Todos os cursos',
    color: '#F5C200',
  },
];

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export default function Calendar() {
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [selectedDay, setSelectedDay] = useState(13);

  const eventDays: Record<number, string> = {
    14: '#E24B4A',
    15: '#F5C200',
    22: '#1a1a1a',
  };

  const weekendDays = [20, 21];
  const offset = 4;
  const totalDays = 31;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calendário</Text>
        <Text style={styles.headerSub}>Maio 2025</Text>
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

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.calendarBox}>
          <View style={styles.weekRow}>
            {weekDays.map((d, i) => (
              <Text key={i} style={styles.weekDay}>{d}</Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {Array.from({ length: offset }).map((_, i) => (
              <View key={`empty-${i}`} style={styles.dayCell} />
            ))}
            {Array.from({ length: totalDays }, (_, i) => {
              const day = i + 1;
              const isSelected = day === selectedDay;
              const eventColor = eventDays[day];
              const isWeekend = weekendDays.includes(day);
              return (
                <Pressable key={day} style={styles.dayCell} onPress={() => setSelectedDay(day)}>
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
              <View style={[styles.legendDot, { backgroundColor: '#1a1a1a' }]} />
              <Text style={styles.legendText}>Feriado</Text>
            </View>
          </View>
        </View>

        {eventsList.map((event, index) => (
          <View key={index} style={styles.eventGroup}>
            <Text style={styles.eventDate}>{event.date}</Text>
            <View style={styles.eventCard}>
              <View style={[styles.eventBorder, { backgroundColor: event.color }]} />
              <View style={styles.eventBody}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventLocation}>{event.location}</Text>
                <Text style={styles.eventCategory}>{event.category}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

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