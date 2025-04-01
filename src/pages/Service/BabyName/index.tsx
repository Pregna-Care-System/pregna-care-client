import { Modal } from 'antd'
import { useState } from 'react'
import { FaMagic } from 'react-icons/fa'

const BabyNameApp = () => {
  const [selectedName, setSelectedName] = useState<GeneratedName | null>(null)

  type GeneratedName = {
    id: number
    generatedName: string
    createdAt: string
    gender: 'male' | 'female' | ''
    origin: string
    personality: string
    meaning: string
    explanation: string
  }

  const openModal = (name: GeneratedName) => {
    setSelectedName(name)
  }

  const closeModal = () => {
    setSelectedName(null)
  }

  const [nameForm, setNameForm] = useState({
    gender: '',
    origin: '',
    personality: '',
    meaning: ''
  })

  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([])

  const handleGenerateBabyName = async () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Generate a baby name based on the following criteria:
                - Gender: ${nameForm.gender}
                - Origin: ${nameForm.origin}
                - Personality: ${nameForm.personality}
                - Desired Meaning: ${nameForm.meaning}
                Also, explain why this name was chosen and how it fits the criteria.`
              }
            ]
          }
        ]
      })
    }

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions)
      const data = await response.json()

      if (data.candidates && data.candidates.length > 0) {
        const responseText = data.candidates[0].content.parts[0].text
        const generatedName = responseText.split('\n')[0].trim()

        const newGeneratedName: GeneratedName = {
          id: Date.now(),
          generatedName: generatedName,
          createdAt: new Date().toLocaleDateString(),
          gender: nameForm.gender as 'male' | 'female' | '',
          origin: nameForm.origin,
          personality: nameForm.personality,
          meaning: nameForm.meaning,
          explanation: responseText // Lưu toàn bộ phản hồi vào trường explanation
        }
        setGeneratedNames((prevNames) => [...prevNames, newGeneratedName])
      }
    } catch (error) {
      console.error('Error generating baby name:', error)
    }
  }

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

      {/* Name Generator Section */}
      <section className='max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-lg my-8'>
        <h2 className='text-2xl font-bold text-purple-800 text-center mb-6'>Baby Name Generator</h2>
        <div className='flex flex-col md:flex-row items-center gap-6'>
          {/* Form */}
          <div className='w-full space-y-4'>
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
                  <option value='Celtic'>Celtic</option>
                  <option value='Latin'>Latin</option>
                  <option value='Greek'>Greek</option>
                  <option value='Nordic'>Nordic</option>
                  <option value='Sanskrit'>Sanskrit</option>
                  <option value='Arabic'>Arabic</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700'>Personality</label>
                <input
                  type='text'
                  className='w-full p-2 border rounded-lg'
                  value={nameForm.personality}
                  onChange={(e) => setNameForm({ ...nameForm, personality: e.target.value })}
                  placeholder='E.g., Brave, Kind, Creative'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700'>Desired Meaning</label>
                <input
                  type='text'
                  className='w-full p-2 border rounded-lg'
                  value={nameForm.meaning}
                  onChange={(e) => setNameForm({ ...nameForm, meaning: e.target.value })}
                  placeholder='E.g., Strength, Wisdom, Love'
                />
              </div>
            </div>

            <button
              onClick={handleGenerateBabyName}
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
              <p className='text-gray-600'>{name.origin}</p>
            </div>
          ))}
        </div>

        {/* Modal hiển thị thông tin chi tiết */}
        <Modal
         title={
          <h3 style={{ color: '#6b46c1', fontSize: '1.5rem', fontWeight: 'bold' }}>
            {selectedName?.generatedName || 'Name Details'}
          </h3>
        }
          open={!!selectedName} 
          onCancel={closeModal} 
          footer={null}
          width={600}
        >
          {selectedName && (
            <>
              <p className='text-gray-600 mt-2'>
                <strong>Created on:</strong> {selectedName.createdAt}
              </p>
              <p className='text-gray-700 mt-2'>
                <strong>Gender:</strong> {selectedName.gender}
              </p>
              <p className='text-gray-700 mt-2'>
                <strong>Origin:</strong> {selectedName.origin}
              </p>
              <p className='text-gray-700 mt-2'>
                <strong>Personality:</strong> {selectedName.personality}
              </p>
              <p className='text-gray-700 mt-2'>
                <strong>Desired Meaning:</strong> {selectedName.meaning}
              </p>
              <p className='text-gray-700 mt-2'>
                <strong>Explanation:</strong> {selectedName.explanation}
              </p>
            </>
          )}
        </Modal>
      </section>
    </div>
  )
}

export default BabyNameApp
