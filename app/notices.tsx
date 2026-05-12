import { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const filters = ['Todos', 'Bolsas', 'Monitoria', 'Extensão'];

const editais = [
  {
    title: 'Bolsa de Pesquisa IC',
    department: 'DAELN · Departamento de Elétrica',
    deadline: 'Inscrições até 30/04/2025',
    daysLeft: 'Encerra em 17 dias',
    status: 'ABERTO',
    statusBg: '#1a1a1a',
    statusText: '#F5C200',
    headerBg: '#F5C200',
    headerText: '#1a1a1a',
    daysLeftColor: '#E24B4A',
  },
  {
    title: 'Monitoria · Cálculo I',
    department: 'DACOC · Departamento de Matemática',
    deadline: 'Inscrições até 05/05/2025',
    daysLeft: 'Encerra em 22 dias',
    status: 'ABERTO',
    statusBg: '#F5C200',
    statusText: '#1a1a1a',
    headerBg: '#1a1a1a',
    headerText: 'white',
    daysLeftColor: '#888780',
  },
  {
    title: 'Estágio · Empresa Parceira',
    department: 'DIREC · Setor de Estágios',
    deadline: 'Encerrado em 10/04/2025',
    daysLeft: 'Resultado em breve',
    status: 'ENCERRADO',
    statusBg: '#888780',
    statusText: 'white',
    headerBg: '#B4B2A9',
    headerText: 'white',
    daysLeftColor: '#B4B2A9',
  },
];

export default function Notices() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [search, setSearch] = useState('');

  const filtered = editais.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Editais</Text>
        <Text style={styles.headerSub}>Oportunidades abertas</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Search */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar edital..."
            placeholderTextColor="#B4B2A9"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
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

        <View style={styles.divider} />

        {/* Editais List */}
        {filtered.map((edital, index) => (
          <View key={index} style={styles.card}>
            {/* Card Header */}
            <View style={[styles.cardHeader, { backgroundColor: edital.headerBg }]}>
              <Text style={[styles.cardTitle, { color: edital.headerText }]}>
                {edital.title}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: edital.statusBg }]}>
                <Text style={[styles.statusText, { color: edital.statusText }]}>
                  {edital.status}
                </Text>
              </View>
            </View>

            {/* Card Body */}
            <View style={styles.cardBody}>
              <Text style={styles.department}>{edital.department}</Text>
              <Text style={styles.deadline}>{edital.deadline}</Text>
              <Text style={[styles.daysLeft, { color: edital.daysLeftColor }]}>
                {edital.daysLeft}
              </Text>
            </View>
          </View>
        ))}
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
        <Pressable style={styles.navItem}>
          <Text style={styles.navIconActive}>◎</Text>
          <Text style={styles.navLabelActive}>Editais</Text>
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
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: 'center',
  },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: '500', marginBottom: 4 },
  headerSub: { color: '#888780', fontSize: 12 },
  content: { padding: 24, paddingBottom: 100 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F4F0',
    borderWidth: 1,
    borderColor: '#D3D1C7',
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
  },
  searchIcon: { fontSize: 14, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#2C2C2A' },
  filters: { flexDirection: 'row', gap: 8, paddingBottom: 4 },
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
  divider: { height: 1, backgroundColor: '#D3D1C7', marginVertical: 16 },
  card: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D3D1C7',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 14,
  },
  cardHeader: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: { fontSize: 13, fontWeight: '500', flex: 1, marginRight: 8 },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: { fontSize: 9, fontWeight: '500', letterSpacing: 0.5 },
  cardBody: { padding: 16 },
  department: { fontSize: 12, color: '#2C2C2A', marginBottom: 4 },
  deadline: { fontSize: 10, color: '#888780', marginBottom: 2 },
  daysLeft: { fontSize: 10 },
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