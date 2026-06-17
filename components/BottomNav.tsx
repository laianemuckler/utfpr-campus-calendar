import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';

const navItems = [
  { label: 'Início', icon: '🏠', route: '/home' },
  { label: 'Calendário', icon: '📅', route: '/calendar' },
  { label: 'Buscar', icon: '🔍', route: '/search' },
  { label: 'Perfil', icon: '👤', route: '/profile' },
];

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.bottomNav}>
      {navItems.map((item) => {
        const isActive = pathname === item.route;
        return (
          <Pressable
            key={item.route}
            style={styles.navItem}
            onPress={() => router.push(item.route)}
          >
            <Text style={styles.navIcon}>{item.icon}</Text>
            <Text style={isActive ? styles.navLabelActive : styles.navLabel}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 0.5,
    borderTopColor: '#D3D1C7',
    paddingVertical: 8,
    paddingBottom: 16,
  },
  navItem: { flex: 1, alignItems: 'center' },
  navIcon: { fontSize: 18 },
  navLabel: { fontSize: 9, color: '#B4B2A9', marginTop: 2 },
  navLabelActive: { fontSize: 9, color: '#F5C200', fontWeight: '500', marginTop: 2 },
});
