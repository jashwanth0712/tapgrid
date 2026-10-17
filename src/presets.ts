import type { Category } from './store/types';

export const PALETTE = [
  '#2ea043', '#e3b341', '#f0883e', '#f85149', '#b62324', '#7d1a1a',
  '#58a6ff', '#1f6feb', '#a371f7', '#db61a2', '#39d3c3', '#8b949e',
];

export const FUTURE_COLOR = '#2d333b';
export const EMPTY_COLOR = '#161b22';

export const foodPreset = (): Category => ({
  id: 'food',
  name: 'Outside Food',
  createdAt: new Date().toISOString(),
  levels: [
    { id: 'l0', label: 'None outside', color: '#2ea043' },
    { id: 'l1', label: 'Once', color: '#e3b341' },
    { id: 'l2', label: 'Twice', color: '#f85149' },
    { id: 'l3', label: 'Thrice', color: '#b62324' },
    { id: 'l4', label: 'Extra snacks too', color: '#6e1212' },
  ],
});
