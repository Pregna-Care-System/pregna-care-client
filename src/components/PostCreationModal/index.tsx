import React, { useRef, useState } from 'react'
import { message, Modal, Select } from 'antd'
import { FaImage, FaTags, FaTimes } from 'react-icons/fa'
import CloudinaryUpload from '@/components/CloudinaryUpload'
import FroalaEditorWrapper from '@/components/FroalaEditorWrapper'

interface Tag {
  id: string
  name: string
  color?: string
}

interface PostCreationModalProps {
  isVisible: boolean
  onCancel: () => void
  onSubmit: (postData: { content: string; images: string[]; tagIds: string[]; type?: string; chartData?: any }) => void
  currentUser: any
  tags: Tag[]
  submitting: boolean
  title?: string
  type?: string
  chartData?: any
  children?: React.ReactNode
}

const PostCreationModal: React.FC<PostCreationModalProps> = ({
  isVisible,
  onCancel,
  onSubmit,
  currentUser,
  tags,
  submitting,
  title = 'New post',
  type = 'community',
  chartData,
  children
}) => {
  const [postContent, setPostContent] = useState('')
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [showImageUploader, setShowImageUploader] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const editorRef = useRef<any>(null)

  const handleCancel = () => {
    setPostContent('')
    setUploadedImages([])
    setShowImageUploader(false)
    setSelectedTags([])
    onCancel()
  }

  const handleUploadComplete = (urls: string[]) => {
    setUploadedImages((prev) => [...prev, ...urls])
    message.success(`${urls.length} ảnh đã được tải lên thành công`)
  }

  const handleUploadError = (error: Error) => {
    console.error('Upload error:', error)
    message.error('Tải ảnh lên thất bại. Vui lòng thử lại.')
  }

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const toggleImageUploader = () => {
    setShowImageUploader(!showImageUploader)
  }

  const triggerImageUpload = () => {
    if (editorRef.current && editorRef.current.editor) {
      editorRef.current.editor.image.showInsertPopup()
    }
  }

  const handleCreatePost = async () => {
    // Strip HTML tags for validation
    const textContent = postContent.replace(/<[^>]*>/g, '').trim()

    if (!textContent && uploadedImages.length === 0 && !chartData) {
      message.error('Vui lòng nhập nội dung bài viết hoặc tải lên ít nhất một ảnh')
      return
    }

    try {
      // Submit post data to parent component
      onSubmit({
        content: postContent,
        images: uploadedImages,
        tagIds: selectedTags,
        type,
        chartData
      })
    } catch (error) {
      console.error('Error creating post:', error)
      message.error('Đã xảy ra lỗi khi đăng bài viết')
    }
  }

  return (
    <Modal
      title={
        <div className='flex justify-between items-center border-b pb-3'>
          <h3 className='text-xl font-medium'>{title}</h3>
          <button onClick={handleCancel} className='text-gray-500 hover:text-gray-700'>
            <FaTimes />
          </button>
        </div>
      }
      open={isVisible}
      onCancel={handleCancel}
      footer={null}
      width={800}
      centered
      closable={false}
    >
      <div className='py-3'>
        <div className='flex items-center mb-4'>
          <img
            src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'}
            alt={currentUser?.name || 'User'}
            className='w-10 h-10 rounded-full mr-3'
          />
          <div>
            <p className='font-medium'>{currentUser?.name || 'User'}</p>
          </div>
        </div>

        {/* Additional content (like chart preview) */}
        {children}

        {/* Froala Editor */}
        <div className='mb-4'>
          <FroalaEditorWrapper content={postContent} onContentChange={setPostContent} ref={editorRef} />
        </div>

        {/* Tag selection */}
        <div className='mt-3'>
          <div className='flex items-center mb-2'>
            <FaTags className='text-blue-500 mr-2' />
            <span className='font-medium'>Tag</span>
          </div>
          <Select
            mode='multiple'
            placeholder='Choose tags for your post'
            value={selectedTags}
            onChange={setSelectedTags}
            style={{ width: '100%' }}
            optionFilterProp='children'
            className='rounded-md'
          >
            {tags.map((tag: Tag) => (
              <Select.Option key={tag.id} value={tag.id}>
                {tag.name}
              </Select.Option>
            ))}
          </Select>
        </div>

        {/* Display uploaded images */}
        {uploadedImages.length > 0 && (
          <div className='mt-3 border rounded-lg p-3'>
            <div className='grid grid-cols-3 gap-2'>
              {uploadedImages.map((image, index) => (
                <div key={index} className='relative group'>
                  <img src={image} alt={`Uploaded ${index}`} className='w-full h-24 object-cover rounded-lg' />
                  <button
                    onClick={() => removeImage(index)}
                    className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Image uploader */}
        {showImageUploader && (
          <div className='mt-3 border rounded-lg p-3'>
            <CloudinaryUpload
              onUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
              maxFiles={5}
              maxSize={5}
              buttonText='Choose pictures'
              className='mb-2'
            />
          </div>
        )}

        <div className='border rounded-lg mt-3 p-2'>
          <div className='flex justify-between items-center'>
            <span className='font-medium'>Add to your post</span>
            <div className='flex space-x-3 text-xl'>
              <button
                className={`text-green-500 hover:bg-gray-100 p-2 rounded-full ${showImageUploader ? 'bg-gray-100' : ''}`}
                onClick={toggleImageUploader}
                title='Upload separate images'
              >
                <FaImage />
              </button>
              <button
                className='text-blue-500 hover:bg-gray-100 p-2 rounded-full'
                onClick={triggerImageUpload}
                title='Insert images into content'
              >
                <FaImage />
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleCreatePost}
          disabled={(!postContent.trim() && uploadedImages.length === 0 && !chartData) || submitting}
          className={`w-full mt-3 py-2 rounded-lg font-medium ${
            (!postContent.trim() && uploadedImages.length === 0 && !chartData) || submitting
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-pink-600 text-white hover:bg-pink-700'
          }`}
        >
          {submitting ? 'Posting...' : 'Post'}
        </button>
      </div>
    </Modal>
  )
}

export default PostCreationModal
