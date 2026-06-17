import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ref, onValue } from 'firebase/database';
import { db } from '../../firebaseConfig';
import { BottomNav } from '../../components/BottomNav';

const CATEGORY_LABELS: Record<string, string> = {
  prazo: 'PRAZO',
  evento: 'EVENTO',
  matricula: 'MATRÍCULA',
  feriado: 'FERIADO',
};

const CATEGORY_COLORS: Record<string, string> = {
  prazo: '#E24B4A',
  evento: '#F5C200',
  matricula: '#7F77DD',
  feriado: '#888780',
};

const MONTH_NAMES_FULL = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

function getTodayKey() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

interface EventData {
  title: string;
  subtitle: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string | null;
  responsible: string | null;
  audience: string;
  curso: string | null;
  urgent: boolean;
}

export default function EventDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const eventRef = ref(db, `events/${id}`);
    const unsubscribe = onValue(eventRef, (snapshot) => {
      if (snapshot.exists()) {
        setEvent(snapshot.val());
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [id]);

  const formatDate = (startDate: string, endDate: string) => {
    const [sy, sm, sd] = startDate.split('-').map(Number);
    const [ey, em, ed] = endDate.split('-').map(Number);
    if (startDate === endDate) {
      return `${sd} de ${MONTH_NAMES_FULL[sm - 1]} de ${sy}`;
    }
    return `${sd} de ${MONTH_NAMES_FULL[sm - 1]} a ${ed} de ${MONTH_NAMES_FULL[em - 1]} de ${ey}`;
  };

  const getDaysLeft = (startDate: string) => {
    const todayKey = getTodayKey();
    const diff = Math.ceil(
      (new Date(startDate + 'T00:00:00').getTime() - new Date(todayKey + 'T00:00:00').getTime()) /
        (1000 * 60 * 60 * 24)
    );
    if (diff < 0) return 'Encerrado';
    if (diff === 0) return 'Hoje';
    if (diff === 1) return '1 dia';
    return `${diff} dias`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F5C200" />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: '#888780' }}>Evento não encontrado</Text>
      </View>
    );
  }

  const typeColor = CATEGORY_COLORS[event.category] || '#888780';
  const typeLabel = CATEGORY_LABELS[event.category] || event.category.toUpperCase();
  const daysLeft = getDaysLeft(event.startDate);
  const isEncerrado = daysLeft === 'Encerrado';

  const details = [
    event.location && { label: 'Local', value: event.location },
    event.responsible && { label: 'Responsável', value: event.responsible },
    { label: 'Público', value: event.audience === 'geral' ? 'Todos os alunos' : event.curso || '-' },
    { label: 'Tipo', value: typeLabel },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Voltar</Text>
        </Pressable>
        <View style={styles.badgeWrapper}>
          <View style={[styles.badge, { backgroundColor: typeColor }]}>
            <Text style={styles.badgeText}>{typeLabel}</Text>
          </View>
        </View>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.date}>{formatDate(event.startDate, event.endDate)}</Text>
        <Text style={styles.sub}>
          {event.audience === 'geral' ? 'Todos os cursos' : event.curso}
        </Text>
        {event.location && <Text style={styles.sub}>{event.location}</Text>}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionLabel}>DETALHES</Text>
        <View style={styles.detailsBox}>
          {details.map((item, index) => (
            <View
              key={index}
              style={[styles.detailRow, index < details.length - 1 && styles.detailRowBorder]}
            >
              <Text style={styles.detailLabel}>{item.label}</Text>
              <Text style={styles.detailValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        {event.description && (
          <>
            <Text style={styles.sectionLabel}>DESCRIÇÃO</Text>
            <View style={styles.descriptionBox}>
              <Text style={styles.descriptionText}>{event.description}</Text>
            </View>
          </>
        )}

        <View style={styles.countdown}>
          <Text style={styles.countdownLabel}>{isEncerrado ? '' : 'faltam'}</Text>
          <Text style={[styles.countdownValue, isEncerrado && { color: '#888780' }]}>
            {daysLeft}
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.btnSecondary}>
            <Text style={styles.btnSecondaryText}>🔔 Lembrete</Text>
          </Pressable>
          <Pressable style={styles.btnPrimary}>
            <Text style={styles.btnPrimaryText}>↗ Compartilhar</Text>
          </Pressable>
        </View>
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
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backBtn: { marginBottom: 16 },
  backText: { color: 'white', fontSize: 14 },
  badgeWrapper: { alignItems: 'center', marginBottom: 12 },
  badge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  badgeText: { color: 'white', fontSize: 10, letterSpacing: 1 },
  title: { color: 'white', fontSize: 20, fontWeight: '500', textAlign: 'center', marginBottom: 8 },
  date: { color: '#F5C200', fontSize: 12, textAlign: 'center', marginBottom: 4 },
  sub: { color: '#888780', fontSize: 12, textAlign: 'center' },
  content: { padding: 24, paddingBottom: 100 },
  sectionLabel: {
    fontSize: 9,
    color: '#888780',
    fontWeight: '500',
    letterSpacing: 1,
    marginBottom: 8,
  },
  detailsBox: {
    backgroundColor: '#F5F4F0',
    borderRadius: 10,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E8E6DF',
  },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  detailRowBorder: { borderBottomWidth: 0.5, borderBottomColor: '#D3D1C7' },
  detailLabel: { fontSize: 12, color: '#888780' },
  detailValue: { fontSize: 12, color: '#2C2C2A', textAlign: 'right', flex: 1, marginLeft: 8 },
  descriptionBox: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D3D1C7',
    borderRadius: 10,
    padding: 16,
    marginBottom: 24,
  },
  descriptionText: { fontSize: 12, color: '#2C2C2A', lineHeight: 20 },
  countdown: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  countdownLabel: { color: '#888780', fontSize: 12, marginBottom: 4 },
  countdownValue: { color: '#F5C200', fontSize: 24, fontWeight: '500' },
  actions: { flexDirection: 'row', gap: 12 },
  btnSecondary: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D3D1C7',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnSecondaryText: { color: '#444441', fontSize: 14 },
  btnPrimary: {
    flex: 1,
    backgroundColor: '#F5C200',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnPrimaryText: { color: '#1a1a1a', fontSize: 14, fontWeight: '500' },
});