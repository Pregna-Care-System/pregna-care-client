export const initialState = {
  isAuthenticated: localStorage.getItem('accessToken') !== null,
  userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo') as string) : {},
  currentLoginUser: {},
  services: [
    {
      id: 1,
      title: 'Pregnancy Tracking',
      description:
        'Helps monitor fetal development, schedule checkups, track maternal health, provide tips, and ensure a healthy pregnancy'
    },
    {
      id: 2,
      title: 'Schedule Management',
      description:
        'Organizes integrates calendars, sets reminders, tracks time, and enhances productivity through efficient planning and collaboration'
    },
    {
      id: 3,
      title: 'Sharing and Community',
      description:
        'Fosters connection, collaboration, resource sharing, and support, empowering individuals and groups to achieve common goals'
    }
  ],
  reason: [
    {
      id: 1,
      title: 'Monitoring both maternal health and fetal development',
      description: [
        'Track weekly milestones for fetal growth with detailed updates.',
        'Schedule and manage prenatal checkups with reminders for key appointments.',
        'Access professional advice and tools tailored for every stage of pregnancy.',
        'Record health metrics like weight, blood pressure, and activity levels.'
      ],
      image: 'https://res.cloudinary.com/drcj6f81i/image/upload/v1736848318/PregnaCare/oa3zuazyvqgi2y9ef7ec.png'
    },
    {
      id: 2,
      title: 'Schedule Management',
      description: [
        'Plan, prioritize, and allocate resources effectively to meet deadlines.',
        'Use tools that integrate with calendars for streamlined scheduling.',
        'Set reminders and notifications to stay on track with tasks and events.',
        'Ongoing adjustments and professional scheduling tools ensure effective time management.'
      ],
      image: 'https://res.cloudinary.com/drcj6f81i/image/upload/v1737045412/PregnaCare/gliukls4rzhznryjgpju.png'
    },
    {
      id: 3,
      title: 'Building connections and sharing resources',
      description: [
        'Identify platforms where communities thrive and facilitate meaningful interactions.',
        'Share knowledge, resources, and experiences to empower others.',
        'Build a sense of belonging through collaboration and mutual support.',
        'Professional services and tools are available to create and maintain thriving communities.'
      ],
      image: 'https://res.cloudinary.com/drcj6f81i/image/upload/v1737046142/PregnaCare/wutvenrgacglazpmntwp.png'
    }
  ],
  membershipPlans: [],
  pregnancyRecord: [],
  fetalGrowthRecord: [],
  testimonials: [
    {
      id: 1,
      rating: 5,
      userInfo: {
        name: 'Jessica Thompson',
        profession: 'Nurse',
        location: 'NY, USA',
        avatar: 'https://res.cloudinary.com/drcj6f81i/image/upload/v1736877741/PregnaCare/cu1iprwqkhzbjb4ysoqk.png'
      },
      content: `"Absolutely love this app! It's been my daily pregnancy companion, offering personalized tips and updates. Can't wait for the official release!"`
    },
    {
      id: 2,
      rating: 4,
      userInfo: {
        name: 'Gauri Patel',
        profession: 'Home Maker',
        location: 'New Jersey, USA',
        avatar: 'https://res.cloudinary.com/drcj6f81i/image/upload/v1736877741/PregnaCare/cu1iprwqkhzbjb4ysoqk.png'
      },
      content: `"As a first-time mom, this app has been a lifesaver. Easy to use, informative, and it feels like a friend guiding me through each trimester. Thanks, team! “`
    },
    {
      id: 3,
      rating: 3,
      userInfo: {
        name: 'Archita Vats',
        profession: 'Assistant Manager',
        location: 'Delhi, India',
        avatar: 'https://res.cloudinary.com/drcj6f81i/image/upload/v1736877741/PregnaCare/cu1iprwqkhzbjb4ysoqk.png'
      },
      content: `"Impressed with the beta version! The design is sleek, and the daily insights have been spot on.  ”`
    },
    {
      id: 4,
      rating: 5,
      userInfo: {
        name: 'Brian Simmons',
        profession: 'VP Product',
        location: 'Fondo',
        avatar: 'https://res.cloudinary.com/drcj6f81i/image/upload/v1736877741/PregnaCare/cu1iprwqkhzbjb4ysoqk.png'
      },
      content: `"Absolutely loveThis beta version is fantastic! It's like having a pregnancy coach in my pocket. Love the daily updates and the ability to connect with other moms."`
    },
    {
      id: 5,
      rating: 3,
      userInfo: {
        name: 'Anmol Abrol',
        profession: 'Web Developer',
        location: 'Mumbai, India',
        avatar: 'https://res.cloudinary.com/drcj6f81i/image/upload/v1736877741/PregnaCare/cu1iprwqkhzbjb4ysoqk.png'
      },
      content: `"A must-have for expectant moms! The app's features are incredibly helpful, and the community aspect is a nice touch. Thank you for making my pregnancy more enjoyable!“`
    },
    {
      id: 6,
      rating: 4,
      userInfo: {
        name: 'Kai Hiroshi',
        profession: 'Marketing Specialist',
        location: 'Sydney, Australia',
        avatar: 'https://res.cloudinary.com/drcj6f81i/image/upload/v1736877741/PregnaCare/cu1iprwqkhzbjb4ysoqk.png'
      },
      content: `"AI've tried a few pregnancy apps, but this one takes the cake. The beta version is polished, and the features are exactly what I needed. Well done!  ”`
    }
  ],
  motherInfo: [],
  transactionInfo: [
    {
      fullName: 'Tina Pham',
      email: 'tina@gmail.com',
      type: 'Free trial',
      price: '$0.00',
      date: '2025-01-26'
    },
    {
      fullName: 'Tina Pham',
      email: 'tina@gmail.com',
      type: 'Free trial',
      price: '$0.00',
      date: '2025-01-26'
    },
    {
      fullName: 'Tina Pham',
      email: 'tina@gmail.com',
      type: 'Free trial',
      price: '$0.00',
      date: '2025-01-26'
    },
    {
      fullName: 'Tina Pham',
      email: 'tina@gmail.com',
      type: 'Free trial',
      price: '$0.00',
      date: '2025-01-26'
    },
    {
      fullName: 'Tina Pham',
      email: 'tina@gmail.com',
      type: 'Free trial',
      price: '$0.00',
      date: '2025-01-26'
    }
  ],
  memberInfo: [
    {
      fullName: 'Tina Pham',
      email: 'tina@gmail.com',
      phone: '0812654342',
      address: 'KTX Khu B',
      status: true
    },
    {
      fullName: 'Tina Pham',
      email: 'tina@gmail.com',
      phone: '0812654342',
      address: 'KTX Khu B',
      status: false
    },
    {
      fullName: 'Tina Pham',
      email: 'tina@gmail.com',
      phone: '0812654342',
      address: 'KTX Khu B',
      status: true
    },
    {
      fullName: 'Tina Pham',
      email: 'tina@gmail.com',
      phone: '0812654342',
      address: 'KTX Khu B',
      status: true
    },
    {
      fullName: 'Tina Pham',
      email: 'tina@gmail.com',
      phone: '0812654342',
      address: 'KTX Khu B',
      status: true
    }
  ],
  membershipPlansAdminInfo: [
    {
      packageName: 'Free trial',
      feature: ['hehe', 'huhu', 'haha'],
      price: '$0.00',
      createdAt: '2025-01-26'
    },
    {
      packageName: 'Vip',
      feature: ['hehe', 'huhu', 'haha'],
      price: '$99.00',
      createdAt: '2025-01-26'
    },
    {
      packageName: 'Free trial',
      feature: ['hehe', 'huhu', 'haha'],
      price: '$0.00',
      createdAt: '2025-01-26'
    }
  ],
  featureInfo: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
  growthMetrics: [],
  growthMetricsOfWeek: [],
  reminderInfo: [],
  reminderTypeInfo: [],
  reminderActiveInfo: [],
  statistics: [
    {
      title: 'Total Members',
      value: '12,543',
      increase: '+15.3%',
      isIncrease: true
    },
    {
      title: 'Total Users',
      value: '45,233',
      increase: '+8.2%',
      isIncrease: true
    },
    {
      title: 'Total Transactions',
      value: '23,847',
      increase: '-12.4%',
      isIncrease: false
    },
    {
      title: 'Total Revenue',
      value: '$154,239',
      increase: '-16.8%',
      isIncrease: false
    }
  ],
  notificationInfo: [],
  mostUsedPlan: {},
  tagInfo: [],
  blogInfo: []
}
