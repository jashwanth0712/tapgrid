import React, { memo, useMemo, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { buildYear, toKey } from '../lib/dates';
import { EMPTY_COLOR, FUTURE_COLOR } from '../presets';
import type { Category } from '../store/types';

const CELL = 18;
const GAP = 4;

type CellProps = { day: string; color: string; disabled: boolean; isToday: boolean; onTap: (day: string) => void };

const Cell = memo(({ day, color, disabled, isToday, onTap }: CellProps) => (
  <Pressable
    disabled={disabled}
    onPress={() => onTap(day)}
    hitSlop={2}
    style={[styles.cell, { backgroundColor: color }, isToday && styles.today]}
  />
));

type Props = {
  year: number;
  category: Category;
  entries: Record<string, number>;
  onTap: (day: string) => void;
};

export function Grid({ year, category, entries, onTap }: Props) {
  const todayKey = toKey(new Date());
  const weeks = useMemo(() => buildYear(year), [year, todayKey]);
  const scroller = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const todayWeek = weeks.findIndex((w) => w.cells.some((c) => c?.key === todayKey));

  const tap = (day: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onTap(day);
  };

  return (
    <ScrollView
      ref={scroller}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.pad}
      onContentSizeChange={() => {
        const x = todayWeek >= 0 ? todayWeek * (CELL + GAP) - 120 : 9999;
        scroller.current?.scrollTo({ x: Math.max(0, x), animated: false });
      }}
    >
      {weeks.map((w, wi) => (
        <View key={wi} style={styles.week}>
          <Text style={styles.month}>{w.monthLabel ?? ''}</Text>
          {w.cells.map((c, i) =>
            c === null ? (
              <View key={i} style={styles.cell} />
            ) : (
              <Cell
                key={c.key}
                day={c.key}
                disabled={c.future}
                isToday={c.key === todayKey}
                color={c.future ? FUTURE_COLOR : category.levels[entries[c.key] ?? 0]?.color ?? EMPTY_COLOR}
                onTap={tap}
              />
            ),
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pad: { paddingHorizontal: 16, paddingVertical: 8 },
  week: { marginRight: GAP },
  month: { color: '#8b949e', fontSize: 11, height: 16, width: 30 },
  cell: { width: CELL, height: CELL, borderRadius: 4, marginBottom: GAP },
  today: { borderWidth: 1.5, borderColor: '#fff' },
});
