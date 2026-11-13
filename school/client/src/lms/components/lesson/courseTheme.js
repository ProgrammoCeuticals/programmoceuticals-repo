// Course visual identity map
// Each theme defines: colors, layout variant, code style, personality

export const COURSE_THEMES = {
  python: {
    name: 'Notebook',
    variant: 'notebook',
    primary: '#3776ab',
    accent: '#ffd43b',
    bg: '#fefcf7',
    surface: '#fffef9',
    codeBg: '#2b2b2b',
    codeAccent: '#ffd43b',
    fontHeading: "'Georgia', 'Times New Roman', serif",
    borderRadius: '4px',
    ruled: true,           // notebook ruled lines
    leftBorder: '#3776ab', // left accent border on cards
  },

  javascript: {
    name: 'Terminal',
    variant: 'terminal',
    primary: '#f7df1e',
    accent: '#f7df1e',
    bg: '#0a0a0a',
    surface: '#111111',
    codeBg: '#1a1a1a',
    codeAccent: '#f7df1e',
    fontHeading: "'JetBrains Mono', 'Fira Code', monospace",
    borderRadius: '2px',
    scanlines: true,       // subtle scanline overlay
    promptChar: '> ',      // terminal prompt on code
  },

  html: {
    name: 'Blueprint',
    variant: 'blueprint',
    primary: '#e34f26',
    accent: '#f16529',
    bg: '#0a1628',
    surface: '#0d1f3c',
    codeBg: '#061020',
    codeAccent: '#e34f26',
    fontHeading: "'Courier New', monospace",
    borderRadius: '0px',
    grid: true,            // blueprint grid background
    tagStyle: true,        // render content as HTML tag chips
  },

  css: {
    name: 'Studio',
    variant: 'studio',
    primary: '#1572b6',
    accent: '#33a9dc',
    bg: '#fafafa',
    surface: '#ffffff',
    codeBg: '#1e1e2e',
    codeAccent: '#33a9dc',
    fontHeading: "'Inter', sans-serif",
    borderRadius: '16px',
    gradients: true,       // gradient accents on cards
    colorSwatches: true,   // show color swatches in relevant slides
  },

  react: {
    name: 'Component',
    variant: 'component',
    primary: '#61dafb',
    accent: '#61dafb',
    bg: '#0d1117',
    surface: '#161b22',
    codeBg: '#0d1117',
    codeAccent: '#61dafb',
    fontHeading: "'Inter', sans-serif",
    borderRadius: '8px',
    componentBrackets: true, // cards look like JSX components
    propsStyle: true,        // show key-value as props
  },

  nodejs: {
    name: 'Server Room',
    variant: 'serverroom',
    primary: '#68a063',
    accent: '#3c873a',
    bg: '#0d0d0d',
    surface: '#111111',
    codeBg: '#0a0a0a',
    codeAccent: '#68a063',
    fontHeading: "'JetBrains Mono', monospace",
    borderRadius: '3px',
    statusDots: true,      // green status indicator dots
    monospaceAll: true,    // everything in mono
  },

  dsa: {
    name: 'Whiteboard',
    variant: 'whiteboard',
    primary: '#2563eb',
    accent: '#f59e0b',
    bg: '#fafafa',
    surface: '#ffffff',
    codeBg: '#1e293b',
    codeAccent: '#f59e0b',
    fontHeading: "'Inter', sans-serif",
    borderRadius: '6px',
    markerStyle: true,     // marker/whiteboard drawn borders
    complexityBadge: true, // O(n) complexity badges
    stepNumbers: true,     // bold step numbers
  },

  hosting: {
    name: 'Dashboard',
    variant: 'dashboard',
    primary: '#00d4aa',
    accent: '#00b894',
    bg: '#0f172a',
    surface: '#1e293b',
    codeBg: '#0f172a',
    codeAccent: '#00d4aa',
    fontHeading: "'Inter', sans-serif",
    borderRadius: '8px',
    statusIndicators: true, // online/offline status dots
    metricCards: true,      // metric/stat card style
  },

  django: {
    name: 'Framework',
    variant: 'framework',
    primary: '#092e20',
    accent: '#44b78b',
    bg: '#f8fffe',
    surface: '#ffffff',
    codeBg: '#092e20',
    codeAccent: '#44b78b',
    fontHeading: "'Inter', sans-serif",
    borderRadius: '6px',
    mvcBoxes: true,        // MVT/MVC box diagrams
    layerStyle: true,      // layered architecture feel
  },

  sql: {
    name: 'Database',
    variant: 'database',
    primary: '#336791',
    accent: '#0064a5',
    bg: '#f0f4f8',
    surface: '#ffffff',
    codeBg: '#1a1a2e',
    codeAccent: '#4fc3f7',
    fontHeading: "'Courier New', monospace",
    borderRadius: '2px',
    tableGrid: true,       // table row/column grid aesthetic
    rowStripes: true,      // alternating row colors
  },

  mongodb: {
    name: 'Document',
    variant: 'document',
    primary: '#00684a',
    accent: '#00ed64',
    bg: '#001e2b',
    surface: '#023430',
    codeBg: '#001e2b',
    codeAccent: '#00ed64',
    fontHeading: "'Inter', sans-serif",
    borderRadius: '8px',
    jsonBraces: true,      // JSON brace aesthetic on cards
    nestedStyle: true,     // nested document indentation
  },

  angularjs: {
    name: 'MVC Board',
    variant: 'mvcboard',
    primary: '#dd1b16',
    accent: '#dd1b16',
    bg: '#fafafa',
    surface: '#ffffff',
    codeBg: '#1a1a1a',
    codeAccent: '#dd1b16',
    fontHeading: "'Inter', sans-serif",
    borderRadius: '4px',
    mvcFlow: true,         // MVC flow diagram style
    enterpriseStyle: true, // clean enterprise aesthetic
  },

  excel: {
    name: 'Spreadsheet',
    variant: 'spreadsheet',
    primary: '#217346',
    accent: '#33a852',
    bg: '#f8f9fa',
    surface: '#ffffff',
    codeBg: '#1d3124',
    codeAccent: '#33a852',
    fontHeading: "'Calibri', 'Arial', sans-serif",
    borderRadius: '2px',
    cellGrid: true,        // spreadsheet cell grid
    formulaBar: true,      // formula bar on code slides
  },

  spss: {
    name: 'Research Lab',
    variant: 'researchlab',
    primary: '#1f4e79',
    accent: '#2e75b6',
    bg: '#f5f7fa',
    surface: '#ffffff',
    codeBg: '#1a2744',
    codeAccent: '#2e75b6',
    fontHeading: "'Georgia', serif",
    borderRadius: '4px',
    academicStyle: true,   // academic paper aesthetic
    outputTable: true,     // SPSS output table style
  },

  networking: {
    name: 'Network Map',
    variant: 'networkmap',
    primary: '#0066cc',
    accent: '#0066cc',
    bg: '#ffffff',
    surface: '#f8fafc',
    codeBg: '#1e1e1e',
    codeAccent: '#0066cc',
    fontHeading: "'Inter', sans-serif",
    borderRadius: '8px',
    nodeLinks: true,
    packetFlow: true,
    layerColors: true,
  },
};

export function getCourseTheme(courseSlug) {
  return COURSE_THEMES[courseSlug] || COURSE_THEMES.python;
}

// CSS class name for a course theme
export function getThemeClass(courseSlug) {
  const theme = getCourseTheme(courseSlug);
  return `theme-${theme.variant}`;
}
