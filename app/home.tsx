import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const events = [
  {
    id: '1',
    title: 'Entrega de TCC',
    subtitle: 'Coordenação · Sala B-204',
    badge: 'em 2 dias',
    badgeColor: '#E24B4A',
    borderColor: '#F5C200',
    urgent: true,
  },
  {
    id: '2',
    title: 'Semana Acadêmica',
    subtitle: 'Campus · Auditório Principal',
    date: '15 a 19 de maio',
    borderColor: '#F5C200',
    urgent: false,
  },
  {
    id: '3',
    title: 'Matrícula 2025/2',
    subtitle: 'Período de solicitação',
    date: '02 a 06 de junho',
    borderColor: '#888780',
    urgent: false,
  },
];

const editais = [
  { title: 'Bolsa Pesquisa IC', deadline: 'Inscrições até 30/04' },
  { title: 'Monitoria Cálculo I', deadline: 'Inscrições até 05/05' },
];

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Olá, Ada</Text>
          <Text style={styles.headerSub}>Engenharia de Software · 4º período</Text>
        </View>
        <View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AS</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Próximos Eventos */}
        <Text style={styles.sectionLabel}>PRÓXIMOS EVENTOS</Text>

        {events.map((event) => (
          <Pressable
            key={event.id}
            style={[styles.eventCard, event.urgent && styles.eventCardUrgent]}
            onPress={() => router.push(`/event/${event.id}`)}
          >
            <View style={[styles.eventBorder, { backgroundColor: event.borderColor }]} />
            <View style={styles.eventBody}>
              <Text style={[styles.eventTitle, event.urgent && styles.eventTitleUrgent]}>
                {event.title}
              </Text>
              <Text style={styles.eventSubtitle}>{event.subtitle}</Text>
              {event.badge && (
                <View style={[styles.eventBadge, { backgroundColor: event.badgeColor }]}>
                  <Text style={styles.eventBadgeText}>{event.badge}</Text>
                </View>
              )}
              {event.date && (
                <Text style={styles.eventDate}>{event.date}</Text>
              )}
            </View>
          </Pressable>
        ))}

        {/* Editais */}
        <Text style={[styles.sectionLabel, { marginTop: 8 }]}>EDITAIS ABERTOS</Text>

        {editais.map((edital, index) => (
          <View key={index} style={styles.editalCard}>
            <Text style={styles.editalTitle}>{edital.title}</Text>
            <Text style={styles.editalDeadline}>{edital.deadline}</Text>
            <Pressable style={styles.editalBtn}>
              <Text style={styles.editalBtnText}>Ver edital</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem} onPress={() => router.push('/home')}>
          <Text style={styles.navIconActive}>⌂</Text>
          <Text style={styles.navLabelActive}>Início</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#F5F4F0',
  },
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
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 4,
  },
  headerSub: {
    color: '#888780',
    fontSize: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5C200',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#1a1a1a',
    fontWeight: '500',
    fontSize: 16,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E24B4A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
  },
  content: {
    padding: 24,
    paddingBottom: 100,
  },
  sectionLabel: {
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
  eventCardUrgent: {
    backgroundColor: '#1a1a1a',
    borderColor: '#1a1a1a',
  },
  eventBorder: {
    width: 4,
  },
  eventBody: {
    flex: 1,
    padding: 16,
  },
  eventTitle: {
    fontWeight: '500',
    fontSize: 14,
    color: '#2C2C2A',
    marginBottom: 4,
  },
  eventTitleUrgent: {
    color: 'white',
  },
  eventSubtitle: {
    fontSize: 12,
    color: '#888780',
    marginBottom: 6,
  },
  eventBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  eventBadgeText: {
    color: 'white',
    fontSize: 10,
  },
  eventDate: {
    fontSize: 12,
    color: '#B4B2A9',
  },
  editalCard: {
    backgroundColor: '#FAEEDA',
    borderWidth: 1,
    borderColor: '#F5C200',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  editalTitle: {
    color: '#412402',
    fontWeight: '500',
    fontSize: 14,
    marginBottom: 4,
  },
  editalDeadline: {
    color: '#633806',
    fontSize: 12,
    marginBottom: 12,
  },
  editalBtn: {
    backgroundColor: '#F5C200',
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  editalBtnText: {
    color: '#1a1a1a',
    fontSize: 10,
    fontWeight: '500',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 0.5,
    borderTopColor: '#D3D1C7',
    paddingVertical: 8,
    paddingBottom: 16,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 18,
    color: '#B4B2A9',
  },
  navIconActive: {
    fontSize: 18,
    color: '#F5C200',
  },
  navLabel: {
    fontSize: 9,
    color: '#B4B2A9',
    marginTop: 2,
  },
  navLabelActive: {
    fontSize: 9,
    color: '#F5C200',
    fontWeight: '500',
    marginTop: 2,
  },
});