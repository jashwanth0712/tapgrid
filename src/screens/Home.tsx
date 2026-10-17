import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Header, theme } from '../components/ui';
import { useStore } from '../store/useStore';
import { cleanStreak, toKey } from '../lib/dates';

export function Home({ open, settings }: { open: (id: string) => void; settings: () => void }) {
  const categories = useStore((s) => s.categories);
  const entries = useStore((s) => s.entries);
  return (
    <View style={{ flex: 1 }}>
      <Header title="TapGrid" right={<Pressable onPress={settings} hitSlop={12}><Text style={{ fontSize: 22 }}>⚙️</Text></Pressable>} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {categories.length === 0 && <Text style={styles.empty}>No categories yet. Tap ⚙️ to add one.</Text>}
        {categories.map((c) => {
          const e = entries[c.id] ?? {};
          const today = e[toKey(new Date())] ?? 0;
          return (
            <Pressable key={c.id} style={styles.card} onPress={() => open(c.id)}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{c.name}</Text>
                <Text style={styles.sub}>Streak at level 1: {cleanStreak(e)} days · Today: {c.levels[today]?.label}</Text>
              </View>
              <View style={[styles.dot, { backgroundColor: c.levels[today]?.color }]} />
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.card, borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: theme.line },
  name: { color: theme.text, fontSize: 17, fontWeight: '600' },
  sub: { color: theme.muted, fontSize: 12, marginTop: 4 },
  dot: { width: 22, height: 22, borderRadius: 6 },
  empty: { color: theme.muted, textAlign: 'center', marginTop: 40 },
});
