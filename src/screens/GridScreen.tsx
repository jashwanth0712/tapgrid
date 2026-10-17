import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Grid } from '../components/Grid';
import { Header, theme } from '../components/ui';
import { useStore } from '../store/useStore';
import { cleanStreak } from '../lib/dates';

const EMPTY: Record<string, number> = {};

export function GridScreen({ id, back }: { id: string; back: () => void }) {
  const cat = useStore((s) => s.categories.find((c) => c.id === id));
  const entries = useStore((s) => s.entries[id]) ?? EMPTY;
  const cycle = useStore((s) => s.cycle);
  const [year, setYear] = useState(new Date().getFullYear());

  const counts = useMemo(() => {
    const out = new Array(cat?.levels.length ?? 0).fill(0);
    for (const [k, v] of Object.entries(entries)) if (k.startsWith(String(year)) && out[v] !== undefined) out[v]++;
    return out;
  }, [entries, year, cat]);

  if (!cat) return null;
  const now = new Date();
  const elapsed = year === now.getFullYear()
    ? Math.floor((now.getTime() - new Date(year, 0, 1).getTime()) / 86400000) + 1
    : year < now.getFullYear() ? 365 : 0;
  const marked = counts.slice(1).reduce((a, b) => a + b, 0);
  counts[0] = Math.max(0, elapsed - marked); // unmarked past days count as level 0

  return (
    <View style={{ flex: 1 }}>
      <Header title={cat.name} onBack={back} />
      <View style={styles.yearRow}>
        <Pressable onPress={() => setYear(year - 1)} hitSlop={12}><Text style={styles.arrow}>‹</Text></Pressable>
        <Text style={styles.year}>{year}</Text>
        <Pressable onPress={() => setYear(year + 1)} disabled={year >= now.getFullYear()} hitSlop={12}>
          <Text style={[styles.arrow, year >= now.getFullYear() && { opacity: 0.25 }]}>›</Text>
        </Pressable>
      </View>
      <Grid year={year} category={cat} entries={entries} onTap={(d) => cycle(id, d)} />
      <View style={styles.legend}>
        {cat.levels.map((l, i) => (
          <View key={l.id} style={styles.legendRow}>
            <View style={[styles.swatch, { backgroundColor: l.color }]} />
            <Text style={styles.legendText}>{l.label}</Text>
            <Text style={styles.count}>{counts[i]}</Text>
          </View>
        ))}
        <Text style={styles.hint}>Tap a day to cycle. Current streak at first level: {cleanStreak(entries)} days.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  yearRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 24, paddingVertical: 8 },
  year: { color: theme.text, fontSize: 16, fontWeight: '600' },
  arrow: { color: theme.text, fontSize: 28 },
  legend: { padding: 16 },
  legendRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5 },
  swatch: { width: 16, height: 16, borderRadius: 4, marginRight: 10 },
  legendText: { color: theme.text, flex: 1 },
  count: { color: theme.muted },
  hint: { color: theme.muted, fontSize: 12, marginTop: 12 },
});
