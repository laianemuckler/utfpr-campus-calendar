import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const events = [
  {
    id: '1',
    type: 'PRAZO',
    typeColor: '#E24B4A',
    title: 'Entrega de TCC',
    date: '13 de maio de 2025',
    course: 'Engenharia de Software',
    location: 'Coordenação · Sala B-204',
    countdown: '2 dias',
    details: [
      { label: 'Horário', value: '08h às 17h' },
      { label: 'Local', value: 'Sala B-204' },
      { label: 'Responsável', value: 'Coord. de Curso' },
      { label: 'Público', value: '4º e 5º períodos' },
    ],
    description: 'Prazo final para entrega da versão final do Trabalho de Conclusão de Curso na coordenação do curso.',
  },
  {
    id: '2',
    type: 'EVENTO',
    typeColor: '#F5C200',
    title: 'Semana Acadêmica',
    date: '15 a 19 de maio de 2025',
    course: 'Todos os cursos',
    location: 'Campus · Auditório Principal',
    countdown: '4 dias',
    details: [
      { label: 'Horário', value: '08h às 22h' },
      { label: 'Local', value: 'Auditório Principal' },
      { label: 'Responsável', value: 'Diretoria Acadêmica' },
      { label: 'Público', value: 'Todos os alunos' },
    ],
    description: 'Semana de palestras, workshops e atividades culturais abertas a todos os alunos do campus.',
  },
  {
    id: '3',
    type: 'PRAZO',
    typeColor: '#E24B4A',
    title: 'Matrícula 2025/2',
    date: '02 a 06 de junho de 2025',
    course: 'Todos os cursos',
    location: 'Portal do Aluno',
    countdown: '24 dias',
    details: [
      { label: 'Horário', value: 'Até as 23h59' },
      { label: 'Local', value: 'Portal do Aluno' },
      { label: 'Responsável', value: 'Secretaria Acadêmica' },
      { label: 'Público', value: 'Todos os alunos' },
    ],
    description: 'Período de solicitação de matrícula para o segundo semestre de 2025 via portal do aluno.',
  },
];

export default function EventDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const event = events.find((e) => e.id === id) ?? events[0];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Voltar</Text>
        </Pressable>
        <View style={styles.badgeWrapper}>
          <View style={[styles.badge, { backgroundColor: event.typeColor }]}>
            <Text style={styles.badgeText}>{event.type}</Text>
          </View>
        </View>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.date}>{event.date}</Text>
        <Text style={styles.sub}>{event.course}</Text>
        <Text style={styles.sub}>{event.location}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Detalhes */}
        <Text style={styles.sectionLabel}>DETALHES</Text>
        <View style={styles.detailsBox}>
          {event.details.map((item, index) => (
            <View
              key={index}
              style={[
                styles.detailRow,
                index < event.details.length - 1 && styles.detailRowBorder,
              ]}
            >
              <Text style={styles.detailLabel}>{item.label}</Text>
              <Text style={styles.detailValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Descrição */}
        <Text style={styles.sectionLabel}>DESCRIÇÃO</Text>
        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionText}>{event.description}</Text>
        </View>

        {/* Countdown */}
        <View style={styles.countdown}>
          <Text style={styles.countdownLabel}>faltam</Text>
          <Text style={styles.countdownValue}>{event.countdown}</Text>
        </View>

        {/* Botões */}
        <View style={styles.actions}>
          <Pressable style={styles.btnSecondary}>
            <Text style={styles.btnSecondaryText}>🔔 Lembrete</Text>
          </Pressable>
          <Pressable style={styles.btnPrimary}>
            <Text style={styles.btnPrimaryText}>↗ Compartilhar</Text>
          </Pressable>
        </View>
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
        <Pressable style={styles.navItem} onPress={() => router.push('/profile')}>
          <Text style={styles.navIcon}>◉</Text>
          <Text style={styles.navLabel}>Perfil</Text>
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
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backBtn: { marginBottom: 16 },
  backText: { color: 'white', fontSize: 14 },
  badgeWrapper: { alignItems: 'center', marginBottom: 12 },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: { color: 'white', fontSize: 10, letterSpacing: 1 },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
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
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  detailRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#D3D1C7',
  },
  detailLabel: { fontSize: 12, color: '#888780' },
  detailValue: { fontSize: 12, color: '#2C2C2A' },
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
  navLabel: { fontSize: 9, color: '#B4B2A9', marginTop: 2 },
});