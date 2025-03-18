import React, { useState, useRef, useCallback } from 'react'
import { Upload, Button, message, Progress, Spin, Modal } from 'antd'
import { UploadOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import type { UploadFile, UploadProps } from 'antd/es/upload/interface'
import axios from 'axios'

interface CloudinaryUploadProps {
  onUploadComplete?: (urls: string[]) => void
  onUploadError?: (error: Error) => void
  maxFiles?: number
  maxSize?: number // in MB
  acceptedFileTypes?: string
  buttonText?: string
  showPreview?: boolean
  className?: string
  disabled?: boolean
}

const CloudinaryUpload: React.FC<CloudinaryUploadProps> = ({
  onUploadComplete,
  onUploadError,
  maxFiles = 5,
  maxSize = 10, // 10MB default
  acceptedFileTypes = 'image/*',
  buttonText = 'Upload Image',
  showPreview = true,
  className = '',
  disabled = false
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')

  const uploadRef = useRef<any>()

  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'default_preset'
  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your_cloud_name'
  const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning('Please select at least one file to upload')
      return
    }

    setUploading(true)
    const uploadedUrls: string[] = []
    const newProgress: Record<string, number> = {}

    try {
      const uploadPromises = fileList.map(async (file) => {
        const formData = new FormData()
        formData.append('file', file.originFileObj as Blob)
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

        // Initialize progress for this file
        newProgress[file.uid] = 0
        setUploadProgress(newProgress)

        const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
            setUploadProgress((prev) => ({
              ...prev,
              [file.uid]: percentCompleted
            }))
          }
        })

        if (response.data && response.data.secure_url) {
          uploadedUrls.push(response.data.secure_url)
          return response.data.secure_url
        }
        throw new Error('Upload failed')
      })

      await Promise.all(uploadPromises)

      message.success(`${uploadedUrls.length} file(s) uploaded successfully`)
      onUploadComplete?.(uploadedUrls)
      setFileList([])
      setUploadProgress({})
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error)
      message.error('Upload failed')
      onUploadError?.(error as Error)
    } finally {
      setUploading(false)
    }
  }

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as Blob)
    }

    setPreviewImage(file.url || (file.preview as string))
    setPreviewVisible(true)
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1))
  }

  const getBase64 = (file: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    // Filter out files that exceed the size limit
    const filteredFileList = newFileList.filter((file) => {
      if (file.size && file.size / 1024 / 1024 > maxSize) {
        message.error(`${file.name} exceeds the ${maxSize}MB size limit`)
        return false
      }
      return true
    })

    setFileList(filteredFileList)
  }

  const uploadButton = (
    <Button icon={<UploadOutlined />} loading={uploading} disabled={disabled || fileList.length >= maxFiles}>
      {buttonText}
    </Button>
  )

  const customRequest = ({ file, onSuccess }: any) => {
    setTimeout(() => {
      onSuccess('ok')
    }, 0)
  }

  const beforeUpload = (file: File) => {
    // Check file type
    if (acceptedFileTypes) {
      const acceptedTypes = acceptedFileTypes.split(',')
      const isAcceptedType = acceptedTypes.some((type) => {
        // For generic types like 'image/*'
        if (type.includes('*')) {
          const mainType = type.split('/')[0]
          return file.type.startsWith(`${mainType}/`)
        }
        // For specific types
        return type.trim() === file.type
      })

      if (!isAcceptedType) {
        message.error(`${file.name} is not an accepted file type`)
        return Upload.LIST_IGNORE
      }
    }

    // Check file size
    const isLessThanMaxSize = file.size / 1024 / 1024 < maxSize
    if (!isLessThanMaxSize) {
      message.error(`${file.name} exceeds the ${maxSize}MB size limit`)
      return Upload.LIST_IGNORE
    }

    // Check max files
    if (fileList.length >= maxFiles) {
      message.error(`You can only upload a maximum of ${maxFiles} files`)
      return Upload.LIST_IGNORE
    }

    return true
  }

  const onRemove = (file: UploadFile) => {
    const newFileList = fileList.filter((item) => item.uid !== file.uid)
    setFileList(newFileList)

    // Also remove from progress tracking
    const newProgress = { ...uploadProgress }
    delete newProgress[file.uid]
    setUploadProgress(newProgress)

    return true
  }

  return (
    <div className={className}>
      <Upload
        ref={uploadRef}
        listType='picture'
        fileList={fileList}
        onPreview={showPreview ? handlePreview : undefined}
        onChange={handleChange}
        beforeUpload={beforeUpload}
        onRemove={onRemove}
        customRequest={customRequest}
        multiple={maxFiles > 1}
        accept={acceptedFileTypes}
        disabled={disabled || uploading}
      >
        {fileList.length >= maxFiles ? null : uploadButton}
      </Upload>

      {fileList.length > 0 && (
        <div className='mt-4'>
          {Object.keys(uploadProgress).map((uid) => {
            const file = fileList.find((f) => f.uid === uid)
            const progress = uploadProgress[uid]

            return file ? (
              <div key={uid} className='mb-2'>
                <div className='flex justify-between items-center mb-1'>
                  <span className='text-sm truncate' style={{ maxWidth: '200px' }}>
                    {file.name}
                  </span>
                  <span className='text-xs'>{progress}%</span>
                </div>
                <Progress percent={progress} size='small' status={progress === 100 ? 'success' : 'active'} />
              </div>
            ) : null
          })}

          <Button
            type='primary'
            onClick={handleUpload}
            disabled={fileList.length === 0}
            loading={uploading}
            style={{ marginTop: 16 }}
          >
            {uploading ? 'Uploading' : 'Start Upload'}
          </Button>
        </div>
      )}

      <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={() => setPreviewVisible(false)}>
        <img alt='preview' style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  )
}

export default CloudinaryUpload
