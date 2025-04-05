# CloudinaryUpload Component

A reusable React component for uploading images to Cloudinary with progress tracking, preview functionality, and error
handling.

## Features

- Multiple file upload support
- Upload progress tracking for each file
- File type and size validation
- Image preview functionality
- Customizable appearance and behavior
- Responsive design

## Setup

### 1. Environment Variables

Create or update your `.env` file with your Cloudinary credentials:

```
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### 2. Installation

Make sure you have the required dependencies:

```bash
npm install axios antd @ant-design/icons
# or
yarn add axios antd @ant-design/icons
```

## Usage

### Basic Example

```jsx
import React, { useState } from 'react'
import CloudinaryUpload from '@/components/CloudinaryUpload'

const MyComponent = () => {
  const [uploadedImages, setUploadedImages] = useState([])

  const handleUploadComplete = (urls) => {
    setUploadedImages(urls)
  }

  const handleUploadError = (error) => {
    console.error('Upload error:', error)
  }

  return (
    <div>
      <h2>Upload Images</h2>
      <CloudinaryUpload
        onUploadComplete={handleUploadComplete}
        onUploadError={handleUploadError}
        maxFiles={3}
        maxSize={5} // 5MB
        buttonText='Upload Photos'
      />

      {uploadedImages.length > 0 && (
        <div className='mt-4'>
          <h3>Uploaded Images:</h3>
          <div className='flex flex-wrap gap-2'>
            {uploadedImages.map((url, index) => (
              <img key={index} src={url} alt={`Uploaded ${index}`} className='w-24 h-24 object-cover rounded' />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MyComponent
```

### Advanced Example with Form Integration

```jsx
import React from 'react'
import { Form, Button, message } from 'antd'
import CloudinaryUpload from '@/components/CloudinaryUpload'

const CreatePostForm = () => {
  const [form] = Form.useForm()
  const [imageUrls, setImageUrls] = useState([])

  const handleUploadComplete = (urls) => {
    setImageUrls(urls)
    form.setFieldsValue({ images: urls })
  }

  const onFinish = (values) => {
    // Submit form with image URLs
    // API call to create post with images
  }

  return (
    <Form form={form} onFinish={onFinish} layout='vertical'>
      <Form.Item name='title' label='Title' rules={[{ required: true }]}>
        <Input placeholder='Enter post title' />
      </Form.Item>

      <Form.Item name='content' label='Content' rules={[{ required: true }]}>
        <Input.TextArea rows={4} placeholder='Write your post content' />
      </Form.Item>

      <Form.Item name='images' label='Images'>
        <CloudinaryUpload
          onUploadComplete={handleUploadComplete}
          onUploadError={() => message.error('Failed to upload images')}
          maxFiles={5}
          buttonText='Add Images'
          className='mb-4'
        />
      </Form.Item>

      <Form.Item>
        <Button type='primary' htmlType='submit'>
          Create Post
        </Button>
      </Form.Item>
    </Form>
  )
}
```

## Props

| Prop                | Type                       | Default          | Description                                                     |
|---------------------|----------------------------|------------------|-----------------------------------------------------------------|
| `onUploadComplete`  | `(urls: string[]) => void` | -                | Callback function that receives an array of uploaded image URLs |
| `onUploadError`     | `(error: Error) => void`   | -                | Callback function that receives any error during upload         |
| `maxFiles`          | `number`                   | `5`              | Maximum number of files that can be uploaded                    |
| `maxSize`           | `number`                   | `10`             | Maximum file size in MB                                         |
| `acceptedFileTypes` | `string`                   | `'image/*'`      | Accepted file types (MIME types)                                |
| `buttonText`        | `string`                   | `'Upload Image'` | Text displayed on the upload button                             |
| `showPreview`       | `boolean`                  | `true`           | Whether to enable image preview functionality                   |
| `className`         | `string`                   | `''`             | Additional CSS class for the component                          |
| `disabled`          | `boolean`                  | `false`          | Whether the upload functionality is disabled                    |

## Customization

You can customize the appearance and behavior of the component by adjusting the props. For example:

```jsx
<CloudinaryUpload
  maxFiles={10}
  maxSize={20}
  acceptedFileTypes='image/jpeg,image/png'
  buttonText='Upload Photos'
  showPreview={false}
  className='my-custom-uploader'
  disabled={isSubmitting}
/>
```

## Error Handling

The component handles various error scenarios:

- File type validation
- File size validation
- Maximum file count validation
- Upload failures

Error messages are displayed using Ant Design's message component.

## Notes

- This component uses Cloudinary's upload API directly from the browser. For production applications with sensitive
  upload presets, consider implementing a server-side proxy.
- Make sure your Cloudinary upload preset has the appropriate settings (signed/unsigned, folder restrictions, etc.).
- For larger applications, consider implementing a more robust state management solution for tracking uploads.
