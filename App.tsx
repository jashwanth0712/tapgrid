import React, { useEffect, useState } from 'react';
import { AppState, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Home } from './src/screens/Home';
import { GridScreen } from './src/screens/GridScreen';
import { Settings } from './src/screens/Settings';
import { CategoryEditor } from './src/screens/CategoryEditor';
import { theme } from './src/components/ui';

type Route =
  | { name: 'home' }
  | { name: 'grid'; id: string }
  | { name: 'settings' }
  | { name: 'edit'; id: string | 'new' };

export default function App() {
  const [route, setRoute] = useState<Route>({ name: 'home' });
  const [, bump] = useState(0);

  // re-render on foreground so "today" and future-gray roll over at midnight
  useEffect(() => {
    const sub = AppState.addEventListener('change', (st) => st === 'active' && bump((n) => n + 1));
    return () => sub.remove();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <StatusBar style="light" />
      {route.name === 'home' && <Home open={(id) => setRoute({ name: 'grid', id })} settings={() => setRoute({ name: 'settings' })} />}
      {route.name === 'grid' && <GridScreen id={route.id} back={() => setRoute({ name: 'home' })} />}
      {route.name === 'settings' && <Settings back={() => setRoute({ name: 'home' })} edit={(id) => setRoute({ name: 'edit', id })} />}
      {route.name === 'edit' && <CategoryEditor id={route.id} back={() => setRoute({ name: 'settings' })} />}
    </SafeAreaView>
  );
}
