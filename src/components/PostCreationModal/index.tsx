import React, { useState, useRef, useEffect } from 'react'
import { Modal, Button, message, Select } from 'antd'
import { FaTimes, FaImage, FaTags } from 'react-icons/fa'
import CloudinaryUpload from '@/components/CloudinaryUpload'
import FroalaEditorWrapper from '@/components/FroalaEditorWrapper'
import 'froala-editor/css/froala_style.min.css'
import 'froala-editor/css/froala_editor.pkgd.min.css'

interface Tag {
  id: string
  name: string
  color?: string
}

interface PostCreationModalProps {
  isVisible: boolean
  onCancel: () => void
  onSubmit: (postData: {
    content: string
    images: string[] | string
    featuredImageUrl?: string
    tagIds: string[]
    type?: string
    chartData?: any
  }) => Promise<boolean> | void // Make it accept Promise<boolean> or void return type
  currentUser: any
  tags: Tag[]
  submitting: boolean
  title?: string
  type?: string
  chartData?: any
  children?: React.ReactNode
  initialData?: {
    content: string
    images: string[] | string
    tagIds: string[]
    type?: string
    chartData?: any
  }
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
  children,
  initialData
}) => {
  const [postContent, setPostContent] = useState(initialData?.content || '')
  const [uploadedImages, setUploadedImages] = useState<string[] | string>(initialData?.images || [])
  const [showImageUploader, setShowImageUploader] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.tagIds || [])
  const editorRef = useRef<any>(null)
  const [isEditorMounted, setIsEditorMounted] = useState(false)

  // Reset state when initialData changes
  useEffect(() => {
    if (initialData) {
      setPostContent(initialData.content || '')
      setUploadedImages(initialData.images || [])
      setSelectedTags(initialData.tagIds || [])
    }
  }, [initialData])

  useEffect(() => {
    if (isVisible) {
      if (initialData) {
        setPostContent(initialData.content || '')
        setUploadedImages(initialData.images || '')
        setSelectedTags(initialData.tagIds || [])
      }
      // Delay mounting editor to ensure DOM is ready
      setTimeout(() => {
        setIsEditorMounted(true)
      }, 100)
    } else {
      // Delay unmounting to ensure editor is properly destroyed
      setTimeout(() => {
        setIsEditorMounted(false)
      }, 100)
    }
  }, [isVisible, initialData])

  const handleCancel = () => {
    setPostContent('')
    setUploadedImages('')
    setShowImageUploader(false)
    setSelectedTags([])
    setIsEditorMounted(false)
    setTimeout(() => {
      onCancel()
    }, 50)
  }

  const handleUploadComplete = (urls: string[]) => {
    setUploadedImages((prev) => {
      // If prev is a string, convert it to an array first
      const prevArray = typeof prev === 'string' ? (prev ? prev.split(',').map((url) => url.trim()) : []) : prev

      return [...prevArray, ...urls]
    })
    message.success(`${urls.length} ảnh đã được tải lên thành công`)
  }

  const handleUploadError = (error: Error) => {
    console.error('Upload error:', error)
    message.error('Tải ảnh lên thất bại. Vui lòng thử lại.')
  }

  const removeImage = (index: number) => {
    setUploadedImages((prev) => {
      if (typeof prev === 'string') {
        const urlArray = prev.split(',').map((url) => url.trim())
        urlArray.splice(index, 1)
        return urlArray.join(',')
      } else {
        return prev.filter((_, i) => i !== index)
      }
    })
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
      // Format the images correctly based on the API requirements
      let featuredImageUrl = ''

      // If we have uploaded images, take the first one as the featured image
      if (uploadedImages && uploadedImages.length > 0) {
        // If uploadedImages is a string (as in your current state type), use the first item after splitting
        if (typeof uploadedImages === 'string') {
          // If it's a comma-separated string
          if (uploadedImages.includes(',')) {
            featuredImageUrl = uploadedImages.split(',')[0].trim()
          } else {
            featuredImageUrl = uploadedImages
          }
        }
        // If it's already an array (after you fix the type)
        else if (Array.isArray(uploadedImages) && uploadedImages.length > 0) {
          featuredImageUrl = uploadedImages[0]
        }
      }

      // Submit post data to parent component and wait for result
      const result = await onSubmit({
        content: postContent,
        featuredImageUrl: featuredImageUrl,
        images: uploadedImages,
        tagIds: selectedTags,
        type,
        chartData
      })

      // If result is true or undefined (for backward compatibility), consider it successful
      if (result === true || result === undefined) {
        // Reset the form fields
        setPostContent('')
        setUploadedImages([])
        setSelectedTags([])

        // This is just a backup in case onSubmit doesn't handle closing
        // The parent component should actually handle closing the modal
        setTimeout(() => {
          if (isVisible) {
            handleCancel()
          }
        }, 500)
      }
    } catch (error) {
      console.error('Error creating post:', error)
      message.error('Đã xảy ra lỗi khi đăng bài viết')
    } finally {
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
      destroyOnClose={true}
    >
      <div className='py-3'>
        <div className='flex items-center mb-4'>
          <img
            src={currentUser?.picture || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'}
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
        {isVisible && isEditorMounted && (
          <div key={`editor-${isVisible}-${initialData?.id || 'new'}`} className='mb-6'>
            <FroalaEditorWrapper
              ref={editorRef}
              model={postContent}
              onModelChange={setPostContent}
              config={{
                placeholderText: 'What do you want to share?',
                charCounterCount: true,
                toolbarButtons: {
                  moreText: {
                    buttons: [
                      'bold',
                      'italic',
                      'underline',
                      'strikeThrough',
                      'subscript',
                      'superscript',
                      'fontFamily',
                      'fontSize',
                      'textColor',
                      'backgroundColor',
                      'clearFormatting'
                    ],
                    align: 'left',
                    buttonsVisible: 3
                  },
                  moreParagraph: {
                    buttons: [
                      'alignLeft',
                      'alignCenter',
                      'alignRight',
                      'alignJustify',
                      'formatOL',
                      'formatUL',
                      'paragraphFormat',
                      'paragraphStyle',
                      'lineHeight',
                      'indent',
                      'outdent'
                    ],
                    align: 'left',
                    buttonsVisible: 3
                  },
                  moreRich: {
                    buttons: [
                      'insertLink',
                      'insertImage',
                      'insertVideo',
                      'insertTable',
                      'emoticons',
                      'specialCharacters',
                      'embedly',
                      'insertHR'
                    ],
                    align: 'left',
                    buttonsVisible: 3
                  },
                  moreMisc: {
                    buttons: ['undo', 'redo', 'fullscreen', 'html'],
                    align: 'right',
                    buttonsVisible: 2
                  }
                },
                events: {
                  initialized: function () {
                    console.log('Froala Editor initialized successfully')
                  },
                  focus: function () {
                    console.log('Froala Editor is focused')
                  },
                  blur: function () {
                    console.log('Froala Editor lost focus')
                  }
                }
              }}
            />
          </div>
        )}

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
        {uploadedImages &&
          (typeof uploadedImages === 'string' ? uploadedImages.length > 0 : uploadedImages.length > 0) && (
            <div className='mt-3 border rounded-lg p-3'>
              <div className='grid grid-cols-3 gap-2'>
                {(typeof uploadedImages === 'string'
                  ? uploadedImages
                    ? uploadedImages.split(',').map((url) => url.trim())
                    : []
                  : uploadedImages
                ).map((image, index) => (
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
              maxFiles={1}
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
          disabled={
            (!postContent.trim() &&
              (typeof uploadedImages === 'string' ? !uploadedImages : uploadedImages.length === 0) &&
              !chartData) ||
            submitting
          }
          className={`w-full mt-3 py-2 rounded-lg font-medium ${
            (!postContent.trim() &&
              (typeof uploadedImages === 'string' ? !uploadedImages : uploadedImages.length === 0) &&
              !chartData) ||
            submitting
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
