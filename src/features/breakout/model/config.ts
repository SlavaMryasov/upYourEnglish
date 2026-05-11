export type BreakoutPattern = 'full' | 'smiley' | 'bird' | 'claude'
export type BreakoutGridSize = 'small' | 'medium' | 'large'
export type BreakoutDifficulty = 'easy' | 'medium' | 'hard'

export const GRID_CONFIG: Record<
  BreakoutGridSize,
  { cols: number; rows: number; blockH: number; margin: number }
> = {
  small: { cols: 8, rows: 6, blockH: 24, margin: 4 },
  medium: { cols: 12, rows: 9, blockH: 18, margin: 3 },
  large: { cols: 16, rows: 12, blockH: 13, margin: 2 },
}

export const SPEED_CONFIG: Record<BreakoutDifficulty, number> = {
  easy: 5,
  medium: 7,
  hard: 9,
}

export const ROW_COLORS = ['#f04438', '#fdb022', '#42b883', '#42d392', '#60a5fa', '#a78bfa']

export const PATTERN_DATA: Record<
  Exclude<BreakoutPattern, 'full'>,
  { fg: string; bg: string; cells: string[] }
> = {
  smiley: {
    fg: '#fdb022',
    bg: '#1e293b',
    cells: [
      '.....XXXXXX.....',
      '...XX......XX...',
      '..X..........X..',
      '.X............X.',
      '.X...XX..XX...X.',
      'X....XX..XX....X',
      'X..............X',
      'X..X........X..X',
      '.X..X......X..X.',
      '..X..XXXXXX..X..',
      '...XX......XX...',
      '.....XXXXXX.....',
    ],
  },
  bird: {
    fg: '#cbd5e1',
    bg: '#0f172a',
    cells: [
      '................',
      '................',
      '....X......X....',
      '....XX....XX....',
      '....XXX..XXX....',
      '.....XXX.XXX....',
      '.....XXXXXX.....',
      '....XXXXXXXX....',
      '......XXXX......',
      '.......XX.......',
      '................',
      '................',
    ],
  },
  claude: {
    fg: '#f04438',
    bg: '#1e293b',
    cells: [
      '.......XX.......',
      'X......XX......X',
      '.X.....XX.....X.',
      '..X....XX....X..',
      '...X...XX...X...',
      '....X..XX..X....',
      'XXXXXXXXXXXXXXXX',
      'XXXXXXXXXXXXXXXX',
      '....X..XX..X....',
      '...X...XX...X...',
      '..X....XX....X..',
      '.X.....XX.....X.',
    ],
  },
}
