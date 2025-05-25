import { Project } from '@/types/project';

export const projects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    subtitle: 'Modern React-based Shopping Experience',
    description:
      'A full-featured e-commerce platform built with Next.js, featuring real-time inventory, secure payments, and advanced analytics.',
    longDescription:
      'This comprehensive e-commerce solution demonstrates modern web development practices with a focus on performance, security, and user experience. Built with server-side rendering for optimal SEO and featuring a robust admin dashboard for inventory management.',
    category: 'fullstack',
    status: 'completed',
    featured: true,
    priority: 1,

    thumbnail: '/projects/ecommerce-thumb.jpg',
    images: [
      {
        src: '/projects/ecommerce-1.jpg',
        alt: 'Homepage showcase',
        caption: 'Clean, modern homepage design',
      },
      {
        src: '/projects/ecommerce-2.jpg',
        alt: 'Product page',
        caption: 'Detailed product view with reviews',
      },
      {
        src: '/projects/ecommerce-3.jpg',
        alt: 'Admin dashboard',
        caption: 'Comprehensive admin interface',
      },
    ],

    technologies: [
      { name: 'Next.js', category: 'frontend' },
      { name: 'TypeScript', category: 'frontend' },
      { name: 'TailwindCSS', category: 'frontend' },
      { name: 'Node.js', category: 'backend' },
      { name: 'PostgreSQL', category: 'database' },
      { name: 'Stripe', category: 'tools' },
      { name: 'Vercel', category: 'cloud' },
    ],

    features: [
      { title: 'Real-time Inventory', description: 'Live stock updates and availability tracking' },
      { title: 'Secure Payments', description: 'Stripe integration with multiple payment methods' },
      { title: 'Advanced Search', description: 'Elasticsearch-powered search with filters' },
      { title: 'Admin Dashboard', description: 'Comprehensive management interface' },
    ],

    challenges: [
      'Implementing real-time inventory synchronization across multiple sales channels',
      'Optimizing database queries for large product catalogs',
      'Ensuring PCI compliance for payment processing',
    ],

    learnings: [
      'Advanced Next.js SSR patterns for e-commerce',
      'Database optimization techniques for high-traffic applications',
      'Integration testing strategies for payment systems',
    ],

    links: [
      { type: 'live', url: 'https://ecommerce-demo.vercel.app', label: 'Live Demo' },
      {
        type: 'github',
        url: 'https://github.com/manuel-schmid/ecommerce-platform',
        label: 'Source Code',
      },
    ],

    repository: 'https://github.com/manuel-schmid/ecommerce-platform',
    liveUrl: 'https://ecommerce-demo.vercel.app',

    startDate: '2023-08-01',
    endDate: '2023-11-15',
    lastUpdated: '2024-01-10',

    slug: 'ecommerce-platform',
    tags: ['Next.js', 'E-commerce', 'PostgreSQL', 'Stripe', 'TypeScript'],
    excerpt:
      'A full-featured e-commerce platform with real-time inventory, secure payments, and comprehensive admin dashboard.',
  },

  {
    id: '2',
    title: 'Task Management App',
    subtitle: 'Collaborative Project Management Tool',
    description:
      'A modern task management application with real-time collaboration, drag-and-drop interfaces, and team productivity insights.',
    longDescription:
      'Built as a Trello/Asana alternative, this application showcases advanced React patterns, real-time features with WebSockets, and sophisticated state management. The interface emphasizes usability with smooth animations and intuitive interactions.',
    category: 'frontend',
    status: 'completed',
    featured: true,
    priority: 2,

    thumbnail: '/projects/taskapp-thumb.jpg',
    images: [
      {
        src: '/projects/taskapp-1.jpg',
        alt: 'Kanban board view',
        caption: 'Drag-and-drop Kanban interface',
      },
      {
        src: '/projects/taskapp-2.jpg',
        alt: 'Team dashboard',
        caption: 'Team productivity analytics',
      },
      { src: '/projects/taskapp-3.jpg', alt: 'Mobile view', caption: 'Responsive mobile design' },
    ],

    technologies: [
      { name: 'React', category: 'frontend' },
      { name: 'TypeScript', category: 'frontend' },
      { name: 'Zustand', category: 'frontend' },
      { name: 'Framer Motion', category: 'frontend' },
      { name: 'Socket.io', category: 'backend' },
      { name: 'Express.js', category: 'backend' },
      { name: 'MongoDB', category: 'database' },
      { name: 'Jest', category: 'testing' },
    ],

    features: [
      { title: 'Real-time Collaboration', description: 'Live updates across team members' },
      { title: 'Drag & Drop', description: 'Intuitive task organization' },
      { title: 'Team Analytics', description: 'Productivity insights and reporting' },
      { title: 'Mobile Responsive', description: 'Optimized for all devices' },
    ],

    challenges: [
      'Implementing smooth drag-and-drop with real-time synchronization',
      'Managing complex state across multiple collaborative sessions',
      'Optimizing performance for large task lists',
    ],

    learnings: [
      'Advanced React performance optimization techniques',
      'WebSocket architecture for real-time applications',
      'State management patterns for collaborative tools',
    ],

    links: [
      { type: 'live', url: 'https://taskapp-demo.netlify.app', label: 'Live Demo' },
      {
        type: 'github',
        url: 'https://github.com/manuel-schmid/task-management',
        label: 'Source Code',
      },
      { type: 'figma', url: 'https://figma.com/taskapp-design', label: 'Design System' },
    ],

    repository: 'https://github.com/manuel-schmid/task-management',
    liveUrl: 'https://taskapp-demo.netlify.app',

    startDate: '2023-05-01',
    endDate: '2023-07-30',
    lastUpdated: '2023-12-15',

    slug: 'task-management-app',
    tags: ['React', 'TypeScript', 'Real-time', 'Collaboration', 'WebSockets'],
    excerpt:
      'A collaborative task management tool with real-time updates, drag-and-drop interface, and team productivity analytics.',
  },

  {
    id: '3',
    title: 'React Component Library',
    subtitle: 'Design System and UI Components',
    description:
      'A comprehensive React component library with TypeScript, Storybook documentation, and automated testing.',
    longDescription:
      'This project demonstrates expertise in creating reusable, accessible components that can be shared across multiple projects. Built with modern development practices including automated testing, comprehensive documentation, and semantic versioning.',
    category: 'library',
    status: 'in-progress',
    featured: false,
    priority: 3,

    thumbnail: '/projects/components-thumb.jpg',
    images: [
      {
        src: '/projects/components-1.jpg',
        alt: 'Storybook showcase',
        caption: 'Interactive component documentation',
      },
      {
        src: '/projects/components-2.jpg',
        alt: 'Component examples',
        caption: 'Variety of UI components',
      },
      {
        src: '/projects/components-3.jpg',
        alt: 'Testing coverage',
        caption: 'Comprehensive test suite',
      },
    ],

    technologies: [
      { name: 'React', category: 'frontend' },
      { name: 'TypeScript', category: 'frontend' },
      { name: 'Storybook', category: 'tools' },
      { name: 'Rollup', category: 'tools' },
      { name: 'Testing Library', category: 'testing' },
      { name: 'Chromatic', category: 'testing' },
      { name: 'NPM', category: 'tools' },
    ],

    features: [
      { title: 'TypeScript Support', description: 'Full type safety and IntelliSense' },
      { title: 'Accessibility First', description: 'WCAG 2.1 compliant components' },
      { title: 'Storybook Docs', description: 'Interactive documentation' },
      { title: 'Automated Testing', description: 'Unit and visual regression tests' },
    ],

    challenges: [
      'Creating truly reusable components with flexible APIs',
      'Implementing comprehensive accessibility features',
      'Setting up efficient build and release processes',
    ],

    learnings: [
      'Component API design principles',
      'Accessibility implementation best practices',
      'Library distribution and versioning strategies',
    ],

    links: [
      { type: 'npm', url: 'https://npmjs.com/package/@manuel/ui-components', label: 'NPM Package' },
      {
        type: 'github',
        url: 'https://github.com/manuel-schmid/ui-components',
        label: 'Source Code',
      },
      { type: 'docs', url: 'https://components.manuel-schmid.dev', label: 'Documentation' },
    ],

    repository: 'https://github.com/manuel-schmid/ui-components',

    startDate: '2023-12-01',
    lastUpdated: '2024-01-20',

    slug: 'react-component-library',
    tags: ['React', 'TypeScript', 'Storybook', 'NPM', 'Component Library'],
    excerpt:
      'A comprehensive React component library with TypeScript support, Storybook documentation, and automated testing.',
  },

  {
    id: '4',
    title: 'Weather Analytics Dashboard',
    subtitle: 'Data Visualization & APIs',
    description:
      'An interactive weather analytics dashboard featuring real-time data, advanced charts, and location-based forecasting.',
    longDescription:
      'This project showcases data visualization skills and API integration expertise. Built with modern charting libraries and featuring responsive design, the dashboard provides comprehensive weather insights with beautiful, interactive visualizations.',
    category: 'frontend',
    status: 'completed',
    featured: false,
    priority: 4,

    thumbnail: '/projects/weather-thumb.jpg',
    images: [
      {
        src: '/projects/weather-1.jpg',
        alt: 'Main dashboard',
        caption: 'Interactive weather overview',
      },
      {
        src: '/projects/weather-2.jpg',
        alt: 'Charts view',
        caption: 'Advanced data visualizations',
      },
      {
        src: '/projects/weather-3.jpg',
        alt: 'Mobile interface',
        caption: 'Mobile-optimized design',
      },
    ],

    technologies: [
      { name: 'Vue.js', category: 'frontend' },
      { name: 'TypeScript', category: 'frontend' },
      { name: 'Chart.js', category: 'frontend' },
      { name: 'Leaflet', category: 'frontend' },
      { name: 'Axios', category: 'frontend' },
      { name: 'Vite', category: 'tools' },
      { name: 'Netlify', category: 'cloud' },
    ],

    features: [
      { title: 'Real-time Data', description: 'Live weather updates from multiple APIs' },
      { title: 'Interactive Maps', description: 'Geographical weather visualization' },
      { title: 'Historical Charts', description: 'Trend analysis and forecasting' },
      { title: 'Location Search', description: 'Global location-based weather data' },
    ],

    challenges: [
      'Handling and normalizing data from multiple weather APIs',
      'Creating responsive chart layouts for various screen sizes',
      'Implementing efficient caching for API rate limit management',
    ],

    learnings: [
      'Advanced data visualization techniques',
      'API integration and error handling strategies',
      'Performance optimization for data-heavy applications',
    ],

    links: [
      { type: 'live', url: 'https://weather-analytics.netlify.app', label: 'Live Demo' },
      {
        type: 'github',
        url: 'https://github.com/manuel-schmid/weather-dashboard',
        label: 'Source Code',
      },
    ],

    repository: 'https://github.com/manuel-schmid/weather-dashboard',
    liveUrl: 'https://weather-analytics.netlify.app',

    startDate: '2023-03-15',
    endDate: '2023-04-30',
    lastUpdated: '2023-10-05',

    slug: 'weather-analytics-dashboard',
    tags: ['Vue.js', 'Data Visualization', 'APIs', 'Charts', 'TypeScript'],
    excerpt:
      'An interactive weather analytics dashboard with real-time data, advanced charts, and location-based forecasting.',
  },

  {
    id: '5',
    title: 'Mobile Banking App',
    subtitle: 'React Native Financial Application',
    description:
      'A secure mobile banking application with biometric authentication, real-time transactions, and comprehensive financial management.',
    longDescription:
      'This React Native application demonstrates mobile development expertise with a focus on security, performance, and user experience. Features include biometric authentication, offline capabilities, and smooth animations throughout the interface.',
    category: 'mobile',
    status: 'completed',
    featured: true,
    priority: 5,

    thumbnail: '/projects/banking-thumb.jpg',
    images: [
      {
        src: '/projects/banking-1.jpg',
        alt: 'App interface',
        caption: 'Clean, intuitive mobile interface',
      },
      {
        src: '/projects/banking-2.jpg',
        alt: 'Transaction flow',
        caption: 'Smooth transaction experience',
      },
      {
        src: '/projects/banking-3.jpg',
        alt: 'Security features',
        caption: 'Biometric authentication setup',
      },
    ],

    technologies: [
      { name: 'React Native', category: 'frontend' },
      { name: 'TypeScript', category: 'frontend' },
      { name: 'Redux Toolkit', category: 'frontend' },
      { name: 'React Navigation', category: 'frontend' },
      { name: 'Reanimated', category: 'frontend' },
      { name: 'Firebase', category: 'backend' },
      { name: 'Expo', category: 'tools' },
    ],

    features: [
      { title: 'Biometric Auth', description: 'Fingerprint and Face ID security' },
      { title: 'Offline Support', description: 'Core features work without internet' },
      { title: 'Real-time Updates', description: 'Instant transaction notifications' },
      { title: 'Smooth Animations', description: 'Native-level performance and feel' },
    ],

    challenges: [
      'Implementing secure biometric authentication',
      'Managing offline/online data synchronization',
      'Ensuring consistent performance across iOS and Android',
    ],

    learnings: [
      'Mobile security best practices',
      'Cross-platform development optimization',
      'Native module integration and customization',
    ],

    links: [
      { type: 'github', url: 'https://github.com/manuel-schmid/banking-app', label: 'Source Code' },
      { type: 'other', url: 'https://expo.dev/@manuel/banking-demo', label: 'Expo Demo' },
    ],

    repository: 'https://github.com/manuel-schmid/banking-app',

    startDate: '2023-09-01',
    endDate: '2023-12-20',
    lastUpdated: '2024-01-15',

    slug: 'mobile-banking-app',
    tags: ['React Native', 'Mobile', 'Security', 'TypeScript', 'Redux'],
    excerpt:
      'A secure mobile banking application with biometric authentication, real-time transactions, and offline capabilities.',
  },
];

export const getProjectById = (id: string): Project | undefined => {
  return projects.find(project => project.id === id);
};

export const getProjectBySlug = (slug: string): Project | undefined => {
  return projects.find(project => project.slug === slug);
};

export const getFeaturedProjects = (): Project[] => {
  return projects.filter(project => project.featured).sort((a, b) => (a.priority || 0) - (b.priority || 0));
};

export const getProjectsByCategory = (category: Project['category']): Project[] => {
  return projects.filter(project => project.category === category);
};

export const getProjectsByStatus = (status: Project['status']): Project[] => {
  return projects.filter(project => project.status === status);
};
