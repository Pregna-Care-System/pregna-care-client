import { motion } from 'framer-motion'
import { useState } from 'react'
import { FaHeart, FaComment, FaSearch, FaMagic, FaStar, FaBaby } from 'react-icons/fa'

const BabyNameApp = () => {
  const [newComment, setNewComment] = useState('')
  const [selectedName, setSelectedName] = useState<GeneratedName | null>(null)
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ 
    name: string;
    meaning: string;
    popularity: string;
    parentHopes: string;
    similarNames: string[];
    annualFrequency: string;
  }[]>([]);

  const handleSearch = () => {
    const results = [
      {
        name: 'Sophia',
        meaning: 'Wisdom',
        popularity: 'High',
        parentHopes: 'Parents hope their child will be wise and kind.',
        similarNames: ['Sophie', 'Sofia', 'Sonia'],
        annualFrequency: '10,000'
      },
      {
        name: 'Alexander',
        meaning: 'Defender of the people',
        popularity: 'Very High',
        parentHopes: 'Parents hope their child will be strong and protective.',
        similarNames: ['Alex', 'Xander', 'Lex'],
        annualFrequency: '15,000'
      }
    ];

    const filteredResults = results.filter(result => result.name.toLowerCase() === searchQuery.toLowerCase());
    setSearchResults(filteredResults.length > 0 ? filteredResults : [{ name: 'No Information', meaning: '', popularity: '', parentHopes: '', similarNames: [], annualFrequency: '' }]);
  };

  const [comments, setComments] = useState([
    {
      id: 1,
      username: 'Sarah',
      profilePic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
      text: 'Love these name suggestions! Perfect for my little one.',
      timestamp: '2 hours ago',
      likes: 12
    },
    {
      id: 2,
      username: 'Michael',
      profilePic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
      text: 'The name generator helped us find the perfect name!',
      timestamp: '4 hours ago',
      likes: 8
    },
    {
      id: 3,
      username: 'Emily',
      profilePic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      text: 'These traditional names are beautiful!',
      timestamp: '5 hours ago',
      likes: 15
    },
    {
      id: 4,
      username: 'David',
      profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      text: 'Great combination of modern and classic names.',
      timestamp: '6 hours ago',
      likes: 10
    },
    {
      id: 5,
      username: 'Sophie',
      profilePic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
      text: 'The meaning behind each name is fascinating!',
      timestamp: '7 hours ago',
      likes: 20
    }
  ])

  type GeneratedName = {
    origin: string
    theme: string
    style: string
    id: number
    generatedName: string
    createdAt: string
    gender: 'male' | 'female' | ''
    personality: string
    culture: string
    zodiacSign: string
    nameMeaning: string
    parentThoughts: string
    birthDate: string
  }

  const openModal = (name: GeneratedName) => {
    setSelectedName(name)
  }

  const closeModal = () => {
    setSelectedName(null)
  }

  const popularNames = [
    {
      name: 'Sophia',
      origin: 'Greek',
      meaning: 'Wisdom',
      rank: 1,
      image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba'
    },
    {
      name: 'Liam',
      origin: 'Irish',
      meaning: 'Strong-willed warrior',
      rank: 2,
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9'
    },
    {
      name: 'Emma',
      origin: 'Germanic',
      meaning: 'Universal',
      rank: 3,
      image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74'
    },
    {
      name: 'Oliver',
      origin: 'Latin',
      meaning: 'Olive tree',
      rank: 4,
      image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea'
    },
    {
      name: 'Ava',
      origin: 'Latin',
      meaning: 'Life',
      rank: 5,
      image: 'https://images.unsplash.com/photo-1519755898819-cef8c3021d6f'
    },
    {
      name: 'Noah',
      origin: 'Hebrew',
      meaning: 'Rest, comfort',
      rank: 6,
      image: 'https://images.unsplash.com/photo-1519238422297-d6d31932aff6'
    }
  ]

  const babyNames = {
    male: [
      'Alexander',
      'Benjamin',
      'Christopher',
      'Daniel',
      'Ethan',
      'Felix',
      'Gabriel',
      'Henry',
      'Isaac',
      'Jack',
      'Liam',
      'Mason',
      'Noah',
      'Oliver',
      'Patrick',
      'Quentin',
      'Ryan',
      'Samuel',
      'Thomas',
      'Victor',
      'William',
      'Xander',
      'Yusuf',
      'Zachary',
      'Adrian',
      'Bryan',
      'Caleb',
      'Damian',
      'Elijah',
      'Finn',
      'George',
      'Harrison',
      'Ivan',
      'Jacob',
      'Kevin',
      'Leonard',
      'Matthew',
      'Nathan',
      'Owen',
      'Peter',
      'Quincy',
      'Robert',
      'Sebastian',
      'Tristan',
      'Ulysses',
      'Vincent',
      'Wyatt',
      'Xavier',
      'Yannis',
      'Zane'
    ],
    female: [
      'Amelia',
      'Bella',
      'Charlotte',
      'Daisy',
      'Eleanor',
      'Fiona',
      'Grace',
      'Hannah',
      'Isla',
      'Julia',
      'Katherine',
      'Lillian',
      'Mia',
      'Natalie',
      'Olivia',
      'Penelope',
      'Quinn',
      'Rebecca',
      'Sophia',
      'Tatiana',
      'Ursula',
      'Victoria',
      'Willow',
      'Xena',
      'Yasmine',
      'Zoe',
      'Alice',
      'Beatrice',
      'Clara',
      'Delilah',
      'Emma',
      'Freya',
      'Gabriella',
      'Hazel',
      'Ivy',
      'Jasmine',
      'Kiara',
      'Lucy',
      'Madeline',
      'Nora',
      'Ophelia',
      'Paisley',
      'Rosalie',
      'Scarlett',
      'Tessa',
      'Uma',
      'Veronica',
      'Wendy',
      'Xiomara',
      'Yvette',
      'Zelda'
    ],
    '': [
      'Alexander',
      'Benjamin',
      'Christopher',
      'Daniel',
      'Ethan',
      'Felix',
      'Gabriel',
      'Henry',
      'Isaac',
      'Jack',
      'Liam',
      'Mason',
      'Noah',
      'Oliver',
      'Patrick',
      'Quentin',
      'Ryan',
      'Samuel',
      'Thomas',
      'Victor',
      'William',
      'Xander',
      'Yusuf',
      'Zachary',
      'Adrian',
      'Bryan',
      'Caleb',
      'Damian',
      'Elijah',
      'Finn',
      'George',
      'Harrison',
      'Ivan',
      'Jacob',
      'Kevin',
      'Leonard',
      'Matthew',
      'Nathan',
      'Owen',
      'Peter',
      'Quincy',
      'Robert',
      'Sebastian',
      'Tristan',
      'Ulysses',
      'Vincent',
      'Wyatt',
      'Xavier',
      'Yannis',
      'Zane',
      'Amelia',
      'Bella',
      'Charlotte',
      'Daisy',
      'Eleanor',
      'Fiona',
      'Grace',
      'Hannah',
      'Isla',
      'Julia',
      'Katherine',
      'Lillian',
      'Mia',
      'Natalie',
      'Olivia',
      'Penelope',
      'Quinn',
      'Rebecca',
      'Sophia',
      'Tatiana',
      'Ursula',
      'Victoria',
      'Willow',
      'Xena',
      'Yasmine',
      'Zoe',
      'Alice',
      'Beatrice',
      'Clara',
      'Delilah',
      'Emma',
      'Freya',
      'Gabriella',
      'Hazel',
      'Ivy',
      'Jasmine',
      'Kiara',
      'Lucy',
      'Madeline',
      'Nora',
      'Ophelia',
      'Paisley',
      'Rosalie',
      'Scarlett',
      'Tessa',
      'Uma',
      'Veronica',
      'Wendy',
      'Xiomara',
      'Yvette',
      'Zelda'
    ]
  }

  const popularSearchTerms = [
    'Alexander',
    'Isabella',
    'William',
    'Charlotte',
    'Benjamin',
    'Victoria',
    'James',
    'Oliver',
    'Amelia',
    'Lucas',
    'Sophia'
  ]

  const nameGeneratorOptions = {
    startLetters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    lengthOptions: ['Short (3-5)', 'Medium (6-8)', 'Long (9+)'],
    origins: ['Celtic', 'Latin', 'Greek', 'Nordic', 'Sanskrit', 'Arabic'],
    themes: ['Nature', 'Mythology', 'Celestial', 'Royal', 'Virtues'],
    styles: ['Classic', 'Modern', 'Unique', 'Traditional']
  }

  const [nameForm, setNameForm] = useState({
    origin: '',
    dateOfBirth: '',
    theme: '',
    style: '',
    gender: '',
    personality: '',
    culture: '',
    parentThoughts: ''
  })

  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([])

  const handleCommentSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment = {
      id: comments.length + 1,
      username: 'Guest User',
      profilePic: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377ffb',
      text: newComment,
      timestamp: 'Just now',
      likes: 0
    }

    setComments([comment, ...comments])
    setNewComment('')
  }

  const handleGenerateBabyName = () => {
    const result = generateBabyName({
      ...nameForm,
      birthDate: nameForm.dateOfBirth
    })

    if (result) {
      const newGeneratedName: GeneratedName = {
        ...result,
        personality: nameForm.personality || '',
        culture: nameForm.culture || '',
        origin: nameForm.origin || '',
        theme: nameForm.theme || '',
        style: nameForm.style || ''
      }

      setGeneratedNames((prevNames) => [...prevNames, newGeneratedName])
    }
  }

  const zodiacSigns = [
    { name: 'Aries', start: '03-21', end: '04-19' },
    { name: 'Taurus', start: '04-20', end: '05-20' },
    { name: 'Gemini', start: '05-21', end: '06-20' },
    { name: 'Cancer', start: '06-21', end: '07-22' },
    { name: 'Leo', start: '07-23', end: '08-22' },
    { name: 'Virgo', start: '08-23', end: '09-22' },
    { name: 'Libra', start: '09-23', end: '10-22' },
    { name: 'Scorpio', start: '10-23', end: '11-21' },
    { name: 'Sagittarius', start: '11-22', end: '12-21' },
    { name: 'Capricorn', start: '12-22', end: '01-19' },
    { name: 'Aquarius', start: '01-20', end: '02-18' },
    { name: 'Pisces', start: '02-19', end: '03-20' }
  ]

  const nameMeanings: Record<string, string> = {
    Alexander: 'Defender of the people',
    Benjamin: 'Son of the right hand',
    Christopher: 'Bearer of Christ',
    Daniel: 'God is my judge',
    Ethan: 'Strong, firm',
    Amelia: 'Industrious, striving',
    Bella: 'Beautiful',
    Charlotte: 'Free woman',
    Daisy: "Day's eye",
    Eleanor: 'Bright, shining one',
    Liam: 'Strong-willed warrior',
    Mason: 'One who works with stone',
    Noah: 'Rest, comfort',
    Oliver: 'Olive tree',
    Patrick: 'Noble, patrician',
    Quentin: 'Fifth-born child',
    Ryan: 'Little king',
    Samuel: 'God has heard',
    Thomas: 'Twin',
    Victor: 'Conqueror',
    William: 'Resolute protector',
    Sophia: 'Wisdom',
    Tatiana: 'Fairy queen',
    Ursula: 'Little she-bear',
    Victoria: 'Victory',
    Willow: 'Graceful and resilient',
    Xena: 'Hospitable and welcoming',
    Yasmine: 'Jasmine flower',
    Zoe: 'Life',
    Alice: 'Noble and kind',
    Beatrice: 'Bringer of joy',
    Clara: 'Bright and clear',
    Delilah: 'Delicate and charming',
    Emma: 'Whole and universal',
    Freya: 'Lady, noblewoman',
    Gabriella: 'God is my strength',
    Hazel: 'Wise and perceptive',
    Ivy: 'Faithfulness and eternity',
    Jasmine: 'Gift from God',
    Kiara: 'Bright and famous',
    Lucy: 'Light',
    Madeline: 'Woman from Magdala',
    Nora: 'Honor and light',
    Ophelia: 'Help and aid',
    Paisley: 'Church, beautiful pattern',
    Rosalie: 'Beautiful rose',
    Scarlett: 'Bright red, passionate',
    Tessa: 'Harvester',
    Uma: 'Tranquility and splendor',
    Veronica: 'She who brings victory',
    Wendy: 'Friend, blessed circle',
    Xiomara: 'Famous in battle',
    Yvette: 'Yew tree, strength',
    Zelda: 'Fighting maid'
  }

  const getZodiacSign = (birthDate: string | number | Date) => {
    const date = new Date(birthDate)
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const formattedDate = `${month}-${day}`

    return zodiacSigns.find((z) => z.start <= formattedDate && z.end >= formattedDate)?.name || ''
  }

  const generateBabyName = (nameForm: { gender: string | undefined; birthDate: any; parentThoughts: any }) => {
    const gender = nameForm.gender as keyof typeof babyNames

    const randomIndex = Math.floor(Math.random() * babyNames[gender].length)
    const generatedName = babyNames[gender][randomIndex]

    const zodiacSign = getZodiacSign(nameForm.birthDate || '2000-01-01')
    const nameMeaning =
      nameMeanings[generatedName] ||
      'A beautiful name with deep significance inside. You can choose gender for baby for more information. '

    return {
      ...nameForm,
      id: Date.now(),
      generatedName,
      createdAt: new Date().toLocaleDateString(),
      gender,
      zodiacSign,
      nameMeaning,
      parentThoughts: nameForm.parentThoughts || 'No thoughts provided'
    }
  }

  // Intro Section (Overview)
  const IntroSection = () => (
    <div className='bg-white rounded-xl shadow-lg p-8 mb-12 mt-8 max-w-7xl mx-auto'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
        {/* Nội dung giới thiệu */}
        <div className='space-y-6'>
          <h2 className='text-3xl font-bold text-purple-800 text-center md:text-left'>🎇 Begin Your Journey</h2>
          <p className='text-lg text-gray-700 leading-relaxed'>
            Choosing a name is one of the most significant decisions you'll make for your child. It's more than just a
            word—it's the beginning of their story, a reflection of your hopes, and a gateway to their future.
          </p>
          <p className='text-lg text-purple-600 italic border-l-4 border-purple-400 pl-4'>
            "A name carries with it destiny, heritage, and dreams. Let us help you find the perfect one."
          </p>
        </div>
        {/* Hình ảnh */}
        <div className='relative'>
          <img
            src='https://images.unsplash.com/photo-1519689680058-324335c77eba'
            alt='Baby name journey'
            className='rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300'
          />
          <div className='absolute -bottom-4 -right-4 bg-purple-100 rounded-lg p-4 shadow-lg flex items-center gap-2'>
            🎇 <p className='text-purple-800 font-semibold'>Create lasting memories</p>
          </div>
        </div>
      </div>
    </div>
  )

  return ( 
    <div className='min-h-screen bg-gradient-to-b from-pink-50 to-purple-50'> 
      {/* Header Section */}
      <div className='relative h-[60vh] flex items-center justify-center overflow-hidden mt-14'>
        <div className='absolute inset-0'>
          <img
            src='https://res.cloudinary.com/dhashlkpe/image/upload/v1740533357/photo-1516627145497-ae6968895b74_qxwird.jpg'
            alt='Baby items background'
            className='w-full h-full object-cover opacity-50'
          />
        </div>
        <div className='relative text-center px-4'>
          <h1 className='text-4xl md:text-6xl font-bold text-purple-800 mb-6 font-serif'>
            Discover Your Baby's Perfect Name
          </h1>
          <p className='text-xl text-purple-600 max-w-2xl mx-auto'>
            Explore thousands of beautiful names from various cultures and origins
          </p>
        </div>
      </div>

      {/* Overview Section */}
      <IntroSection />

      {/* Search Section */}
      <section className='max-w-7xl mx-auto p-6'>
        <h2 className='text-2xl font-bold text-purple-800 text-center mb-6'>Search for a Baby Name</h2>
        <div className='flex items-center gap-4'>
          <input
            type='text'
            className='w-full p-3 border rounded-lg'
            placeholder='Search for a name...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={() => {
              handleSearch();
              setSearchResults([]); // Reset animation on new search
              setTimeout(handleSearch, 50);
            }}
            className='bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2'
          >
            <FaSearch /> Search
          </button>
        </div>
        <div className='mt-6'>
          {searchResults.map((result, index) => (
            <motion.div 
              key={index} 
              className='border rounded-lg p-4 bg-white shadow-md mt-4' 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
            >
              <h3 className='text-xl font-semibold text-purple-800 flex items-center gap-2'><FaBaby /> {result.name}</h3>
              {result.name !== 'No Information' ? (
                <>
                  <p className='text-gray-700'><strong>Meaning:</strong> {result.meaning}</p>
                  <p className='text-gray-700'><strong>Popularity:</strong> {result.popularity}</p>
                  <p className='text-gray-700'><strong>Parent Hopes:</strong> {result.parentHopes}</p>
                  <p className='text-gray-700'><strong>Similar Names:</strong> {result.similarNames.join(', ')}</p>
                  <p className='text-gray-700'><strong>Annual Frequency:</strong> {result.annualFrequency}</p>
                </>
              ) : (
                <p className='text-gray-700 text-center text-lg'><FaStar /> Please choose another suitable name for more information!!! </p>
              )}
            </motion.div>
          ))}
        </div>
      </section>
      {/* Popular Searches Section */}
      <section className='max-w-7xl mx-auto p-6'>
        <h2 className='text-2xl font-bold text-purple-800 text-center mb-6'>Popular Searches</h2>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {popularSearchTerms.map((term) => (
            <button
              key={term}
              className='px-4 py-2 bg-white rounded-full shadow-md hover:bg-gradient-to-r from-purple-200 to-pink-200 transition-colors text-center'
              onClick={() => {
                setSearchQuery(term);
              }}
            >
              {term}
            </button>
          ))}
        </div>
      </section>
      {/* Name Generator Section */}
      <section className='max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-lg my-8'>
        <h2 className='text-2xl font-bold text-purple-800 text-center mb-6'>Baby Name Generator</h2>
        <div className='flex flex-col md:flex-row items-center gap-6'>
          {/* Ảnh bên trái */}
          <div className='md:w-1/2'>
            <img
              src='https://minhducpc.vn/uploads/images/hinh-nen-dien-thoai-em-be02.jpg'
              alt='Baby name generator'
              className='w-full h-auto rounded-xl object-cover'
            />
          </div>
          {/* Nội dung form bên phải */}
          <div className='md:w-1/2 space-y-4'>
            <div className='grid grid-cols-1 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Gender</label>
                <select
                  className='w-full p-2 border rounded-lg'
                  value={nameForm.gender}
                  onChange={(e) => setNameForm({ ...nameForm, gender: e.target.value })}
                >
                  <option value=''>Select Gender</option>
                  <option value='male'>Male</option>
                  <option value='female'>Female</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700'>Origin</label>
                <select
                  className='w-full p-2 border rounded-lg'
                  value={nameForm.origin}
                  onChange={(e) => setNameForm({ ...nameForm, origin: e.target.value })}
                >
                  <option value=''>Select Origin</option>
                  {nameGeneratorOptions.origins.map((origin) => (
                    <option key={origin} value={origin}>
                      {origin}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700'>Date of Birth</label>
                <input
                  type='date'
                  className='w-full p-2 border rounded-lg'
                  value={nameForm.dateOfBirth}
                  onChange={(e) => setNameForm({ ...nameForm, dateOfBirth: e.target.value })}
                />
              </div>
            </div>

            <div className='grid grid-cols-1 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Theme</label>
                <select
                  className='w-full p-2 border rounded-lg'
                  value={nameForm.theme}
                  onChange={(e) => setNameForm({ ...nameForm, theme: e.target.value })}
                >
                  <option value=''>Select Theme</option>
                  {nameGeneratorOptions.themes.map((theme) => (
                    <option key={theme} value={theme}>
                      {theme}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700'>Style</label>
                <select
                  className='w-full p-2 border rounded-lg'
                  value={nameForm.style}
                  onChange={(e) => setNameForm({ ...nameForm, style: e.target.value })}
                >
                  <option value=''>Select Style</option>
                  {nameGeneratorOptions.styles.map((style) => (
                    <option key={style} value={style}>
                      {style}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700'>Personality Trait</label>
                <select
                  className='w-full p-2 border rounded-lg'
                  value={nameForm.personality}
                  onChange={(e) => setNameForm({ ...nameForm, personality: e.target.value })}
                >
                  <option value=''>Select Personality</option>
                  <option value='brave'>Brave</option>
                  <option value='kind'>Kind</option>
                  <option value='wise'>Wise</option>
                  <option value='creative'>Creative</option>
                  <option value='strong'>Strong</option>
                  <option value='cheerful'>Cheerful</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700'>Cultural Preference</label>
                <select
                  className='w-full p-2 border rounded-lg'
                  value={nameForm.culture}
                  onChange={(e) => setNameForm({ ...nameForm, culture: e.target.value })}
                >
                  <option value=''>Select Culture</option>
                  <option value='western'>Western</option>
                  <option value='asian'>Asian</option>
                  <option value='african'>African</option>
                  <option value='latin'>Latin</option>
                  <option value='nordic'>Nordic</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700'>Your Thoughts & Hopes</label>
                <textarea
                  className='w-full p-2 border rounded-lg h-32'
                  value={nameForm.parentThoughts}
                  onChange={(e) => setNameForm({ ...nameForm, parentThoughts: e.target.value })}
                  placeholder="Share your thoughts about your future child's name..."
                />
              </div>
            </div>

            <button
              onClick={() => handleGenerateBabyName()}
              className='w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold hover:from-purple-600 hover:to-pink-600 transition-colors'
            >
              Generate Name <FaMagic className='inline ml-2' />
            </button>
          </div>
        </div>
      </section>

      {/* Generated Names History Section */}
      <section className='max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-lg my-8'>
        <h2 className='text-2xl font-bold text-purple-800 text-center mb-6'>Your Generated Names</h2>
        <div className='space-y-4'>
          {generatedNames.map((name) => (
            <div
              key={name.id}
              className='border rounded-lg p-4 hover:bg-gray-50 cursor-pointer'
              onClick={() => openModal(name)}
            >
              <h3 className='text-xl font-semibold text-purple-800'>{name.generatedName}</h3>
            </div>
          ))}
        </div>

        {/* Modal hiển thị thông tin chi tiết */}
        {selectedName && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
            <div className='bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-lg'>
              <h3 className='text-2xl font-bold text-purple-800'>{selectedName.generatedName}</h3>
              <p className='text-gray-600 mt-2'>
                <strong>Created on:</strong> {selectedName.createdAt}
              </p>
              <p className='text-gray-700 mt-2'>
                <strong>Date of birth:</strong> {selectedName.birthDate}
              </p>
              <p className='text-gray-700 mt-2'>
                <strong>Gender:</strong> {selectedName.gender}
              </p>
              <p className='text-gray-700 mt-2'>
                <strong>Origin:</strong> {selectedName.origin}
              </p>
              <p className='text-gray-700 mt-2'>
                <strong>Theme:</strong> {selectedName.theme}
              </p>
              <p className='text-gray-700 mt-2'>
                <strong>Style:</strong> {selectedName.style}
              </p>
              <p className='text-gray-700 mt-2'>
                <strong>Personality:</strong> {selectedName.personality}
              </p>
              <p className='text-gray-700 mt-2'>
                <strong>Culture:</strong> {selectedName.culture}
              </p>
              <p className='text-gray-700 mt-2'>
                <strong>Zodiac:</strong> {selectedName.zodiacSign}
              </p>
              <p className='text-gray-700 mt-2'>
                <strong>Meaning:</strong> {selectedName.nameMeaning}
              </p>
              <p className='text-gray-700 mt-2'>
                <strong>Parent's Thoughts:</strong> {selectedName.parentThoughts}
              </p>

              <button
                onClick={closeModal}
                className='mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700'
              >
                Close
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Popular Names Section */}
      <section className='max-w-7xl mx-auto p-6'>
        <h2 className='text-2xl font-bold text-purple-800 text-center mb-6'>Top Names</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {popularNames.map((name) => (
            <div
              key={name.name}
              className='bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105'
            >
              <img src={name.image} alt={name.name} className='w-full h-48 object-cover' />
              <div className='p-4'>
                <h3 className='text-xl font-semibold text-purple-800'>{name.name}</h3>
                <p className='text-gray-600'>Origin: {name.origin}</p>
                <p className='text-gray-500'>Meaning: {name.meaning}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comments Section */}
      <section className='max-w-7xl mx-auto p-6'>
        <h2 className='text-2xl font-bold text-purple-800 text-center mb-6'>Community Discussion</h2>
        {/* Form nhập comment với avatar bên trái */}
        <form onSubmit={handleCommentSubmit} className='mb-8'>
          <div className='flex items-start gap-4'>
            <img
              src='https://images.unsplash.com/photo-1516627145497-ae6968895b74'
              alt='Your avatar'
              className='w-16 h-16 rounded-full object-cover'
            />
            <textarea
              className='w-full p-3 border rounded-lg'
              placeholder='Share your thoughts...'
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
          </div>
          <div className='mt-4 text-right'>
            <button
              type='submit'
              className='bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors'
            >
              Post Comment
            </button>
          </div>
        </form>

        {/* Danh sách comment */}
        <div className='space-y-4'>
          {comments.map((comment) => (
            <div key={comment.id} className='bg-white rounded-lg shadow p-4'>
              <div className='flex items-center gap-3 mb-2'>
                <img src={comment.profilePic} alt={comment.username} className='w-10 h-10 rounded-full object-cover' />
                <div>
                  <h4 className='font-semibold'>{comment.username}</h4>
                  <p className='text-sm text-gray-500'>{comment.timestamp}</p>
                </div>
              </div>
              <p className='text-gray-700 mb-3'>{comment.text}</p>
              <div className='flex items-center gap-4 text-sm text-gray-500'>
                <button className='flex items-center gap-1 hover:text-purple-500'>
                  <FaHeart /> {comment.likes}
                </button>
                <button className='flex items-center gap-1 hover:text-purple-500'>
                  <FaComment /> Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default BabyNameApp
