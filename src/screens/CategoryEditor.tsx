import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Btn, Header, theme } from '../components/ui';
import { PALETTE } from '../presets';
import { useStore } from '../store/useStore';
import type { Category, Level } from '../store/types';

const uid = () => Math.random().toString(36).slice(2, 10);

export function CategoryEditor({ id, back }: { id: string | 'new'; back: () => void }) {
  const existing = useStore((s) => s.categories.find((c) => c.id === id));
  const save = useStore((s) => s.saveCategory);
  const del = useStore((s) => s.deleteCategory);

  const [name, setName] = useState(existing?.name ?? '');
  const [levels, setLevels] = useState<Level[]>(
    existing?.levels ?? [
      { id: uid(), label: 'Not done', color: PALETTE[11] },
      { id: uid(), label: 'Done', color: PALETTE[0] },
    ],
  );
  const [picking, setPicking] = useState<number | null>(null);

  const patch = (i: number, p: Partial<Level>) => setLevels(levels.map((l, j) => (j === i ? { ...l, ...p } : l)));

  const onSave = () => {
    if (!name.trim()) return Alert.alert('Name required');
    if (levels.some((l) => !l.label.trim())) return Alert.alert('Every level needs a label');
    const cat: Category = existing
      ? { ...existing, name: name.trim(), levels }
      : { id: uid(), name: name.trim(), levels, createdAt: new Date().toISOString() };
    save(cat);
    back();
  };

  const onDelete = () =>
    Alert.alert('Delete category?', 'Its whole history will be removed.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { del(id); back(); } },
    ]);

  return (
    <View style={{ flex: 1 }}>
      <Header title={existing ? 'Edit category' : 'New category'} onBack={back} />
      <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
        <Text style={styles.h}>Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. Workout" placeholderTextColor={theme.muted} />

        <Text style={[styles.h, { marginTop: 20 }]}>Levels (first = default, taps cycle in order)</Text>
        {levels.map((l, i) => (
          <View key={l.id} style={styles.levelBox}>
            <View style={styles.levelRow}>
              <Pressable onPress={() => setPicking(picking === i ? null : i)} style={[styles.swatch, { backgroundColor: l.color }]} />
              <TextInput style={[styles.input, { flex: 1 }]} value={l.label} onChangeText={(t) => patch(i, { label: t })} />
              <Pressable
                hitSlop={8}
                disabled={levels.length <= 1}
                onPress={() => {
                  if (existing) Alert.alert('Remove level?', 'Days at this level or higher are clamped to the new last level.', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Remove', style: 'destructive', onPress: () => setLevels(levels.filter((_, j) => j !== i)) },
                  ]);
                  else setLevels(levels.filter((_, j) => j !== i));
                }}
              >
                <Text style={[styles.x, levels.length <= 1 && { opacity: 0.25 }]}>✕</Text>
              </Pressable>
            </View>
            {picking === i && (
              <View style={styles.palette}>
                {PALETTE.map((c) => (
                  <Pressable key={c} onPress={() => { patch(i, { color: c }); setPicking(null); }} style={[styles.swatch, { backgroundColor: c }, l.color === c && styles.sel]} />
                ))}
              </View>
            )}
          </View>
        ))}
        <Btn label="+ Add level" onPress={() => setLevels([...levels, { id: uid(), label: `Level ${levels.length + 1}`, color: PALETTE[levels.length % PALETTE.length] }])} />
        <View style={{ height: 16 }} />
        <Btn label="Save" onPress={onSave} />
        {existing && <Btn label="Delete category" danger onPress={onDelete} />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  h: { color: theme.muted, fontSize: 13, textTransform: 'uppercase', marginBottom: 8 },
  input: { backgroundColor: theme.card, color: theme.text, borderRadius: 10, padding: 12, fontSize: 15 },
  levelBox: { marginBottom: 8 },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  swatch: { width: 30, height: 30, borderRadius: 8 },
  sel: { borderWidth: 2, borderColor: '#fff' },
  palette: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, padding: 10, backgroundColor: theme.card, borderRadius: 10, marginTop: 6 },
  x: { color: theme.muted, fontSize: 18, paddingHorizontal: 4 },
});
