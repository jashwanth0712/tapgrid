import React, { useState } from 'react';
import { Alert, ScrollView, Share, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { Btn, Header, theme } from '../components/ui';
import { useStore } from '../store/useStore';

export function Settings({ back, edit }: { back: () => void; edit: (id: string | 'new') => void }) {
  const categories = useStore((s) => s.categories);
  const move = useStore((s) => s.move);
  const exportData = useStore((s) => s.exportData);
  const importData = useStore((s) => s.importData);
  const [text, setText] = useState('');

  return (
    <View style={{ flex: 1 }}>
      <Header title="Settings" onBack={back} />
      <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
        <Text style={styles.h}>Categories</Text>
        {categories.map((c, i) => (
          <View key={c.id} style={styles.row}>
            <Pressable style={{ flex: 1 }} onPress={() => edit(c.id)}>
              <Text style={styles.name}>{c.name}</Text>
              <Text style={styles.sub}>{c.levels.length} levels · tap to edit</Text>
            </Pressable>
            <Pressable onPress={() => move(c.id, -1)} disabled={i === 0} hitSlop={8}><Text style={[styles.arrow, i === 0 && { opacity: 0.25 }]}>↑</Text></Pressable>
            <Pressable onPress={() => move(c.id, 1)} disabled={i === categories.length - 1} hitSlop={8}><Text style={[styles.arrow, i === categories.length - 1 && { opacity: 0.25 }]}>↓</Text></Pressable>
          </View>
        ))}
        <Btn label="+ Add category" onPress={() => edit('new')} />

        <Text style={[styles.h, { marginTop: 28 }]}>Backup</Text>
        <Btn label="Export (share JSON)" onPress={() => Share.share({ message: exportData() })} />
        <TextInput
          style={styles.input}
          multiline
          placeholder="Paste a backup here to import"
          placeholderTextColor={theme.muted}
          value={text}
          onChangeText={setText}
        />
        <Btn
          label="Import pasted backup (replaces data)"
          danger
          onPress={() =>
            Alert.alert('Replace all data?', 'This overwrites your current categories and history.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Import', style: 'destructive', onPress: () => {
                const err = importData(text.trim());
                if (err) Alert.alert('Import failed', err); else { setText(''); Alert.alert('Imported'); }
              } },
            ])
          }
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  h: { color: theme.muted, fontSize: 13, textTransform: 'uppercase', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.card, borderRadius: 12, padding: 14, marginBottom: 8, gap: 14 },
  name: { color: theme.text, fontSize: 16, fontWeight: '600' },
  sub: { color: theme.muted, fontSize: 12, marginTop: 2 },
  arrow: { color: theme.text, fontSize: 22 },
  input: { backgroundColor: theme.card, color: theme.text, borderRadius: 10, padding: 12, minHeight: 80, marginTop: 8, marginBottom: 4 },
});
