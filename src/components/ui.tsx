import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export const Header = ({ title, onBack, right }: { title: string; onBack?: () => void; right?: React.ReactNode }) => (
  <View style={s.header}>
    <View style={s.side}>{onBack && <Pressable onPress={onBack} hitSlop={12}><Text style={s.icon}>‹</Text></Pressable>}</View>
    <Text style={s.title} numberOfLines={1}>{title}</Text>
    <View style={[s.side, { alignItems: 'flex-end' }]}>{right}</View>
  </View>
);

export const Btn = ({ label, onPress, danger }: { label: string; onPress: () => void; danger?: boolean }) => (
  <Pressable onPress={onPress} style={[s.btn, danger && { backgroundColor: '#5a1d1d' }]}>
    <Text style={s.btnText}>{label}</Text>
  </Pressable>
);

export const theme = { bg: '#0d1117', card: '#161b22', text: '#e6edf3', muted: '#8b949e', line: '#30363d' };

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 48 },
  side: { width: 48 },
  title: { flex: 1, color: theme.text, fontSize: 18, fontWeight: '600', textAlign: 'center' },
  icon: { color: theme.text, fontSize: 30, lineHeight: 32 },
  btn: { backgroundColor: '#21262d', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, alignItems: 'center', marginVertical: 4 },
  btnText: { color: theme.text, fontSize: 15, fontWeight: '500' },
});
