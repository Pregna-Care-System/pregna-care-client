import React, { forwardRef } from 'react'
import { message } from 'antd'

// Import Froala Editor
import FroalaEditor from 'react-froala-wysiwyg'
// Import Froala Editor CSS files
import 'froala-editor/css/froala_style.min.css'
import 'froala-editor/css/froala_editor.pkgd.min.css'
// Import Font Awesome for Froala Editor icons
import 'font-awesome/css/font-awesome.css'
import 'froala-editor/js/plugins.pkgd.min.js'

interface FroalaEditorWrapperProps {
  content: string
  onContentChange: (content: string) => void
  placeholder?: string
  minHeight?: number
  maxHeight?: number
  className?: string
}

const FroalaEditorWrapper = forwardRef<any, FroalaEditorWrapperProps>(
  (
    {
      content,
      onContentChange,
      placeholder = 'What do you think right now?',
      minHeight = 150,
      maxHeight = 300,
      className = ''
    },
    ref
  ) => {
    // Froala Editor configuration
    const froalaConfig = {
      placeholderText: placeholder,
      toolbarButtons: [
        'bold',
        'italic',
        'underline',
        'strikeThrough',
        '|',
        'paragraphFormat',
        'align',
        '|',
        'formatOL',
        'formatUL',
        '|',
        'insertImage',
        'insertLink',
        'insertTable',
        '|',
        'emoticons',
        'undo',
        'redo'
      ],
      heightMin: minHeight,
      heightMax: maxHeight,
      charCounterCount: true,
      charCounterMax: 1000,
      // Configure Cloudinary image upload
      imageUploadMethod: 'POST',
      imageUploadURL: `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      imageUploadParams: {
        upload_preset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
        api_key: import.meta.env.VITE_CLOUDINARY_API_KEY
      },
      imageUploadParam: 'file',
      imageUploadRemoteUrls: true,
      imageDefaultDisplay: 'block',
      imageDefaultWidth: 'auto',
      imageDefaultAlign: 'center',
      // Image upload callbacks
      events: {
        'image.beforeUpload': function (images: any) {
          // Show a message when upload starts
          message.loading('Đang tải ảnh lên...', 0.5)
          return images
        },
        'image.uploaded': function (response: any) {
          // Handle successful upload
          message.success('Tải ảnh lên thành công')
          // Return the URL from Cloudinary response
          return response.secure_url ? response.secure_url : response
        },
        'image.error': function (error: any, response: any) {
          // Handle upload error
          console.error('Froala image upload error:', error, response)
          message.error('Tải ảnh lên thất bại. Vui lòng thử lại.')
          return error
        }
      },
      language: 'vi',
      attribution: false, // Remove Froala branding
      imageInsertButtons: ['imageBack', '|', 'imageUpload', 'imageByURL'],
      pluginsEnabled: ['image', 'link', 'table', 'emoticons', 'url', 'colors', 'entities']
    }

    const handleModelChange = (model: string) => {
      onContentChange(model)
    }

    // Function to trigger image upload dialog in Froala
    const triggerImageUpload = () => {
      if (ref && typeof ref !== 'function' && ref.current && ref.current.editor) {
        ref.current.editor.image.showInsertPopup()
      }
    }

    return (
      <div className={className}>
        <FroalaEditor
          tag='textarea'
          config={froalaConfig}
          model={content}
          onModelChange={handleModelChange}
          ref={ref}
        />
      </div>
    )
  }
)

export default FroalaEditorWrapper
