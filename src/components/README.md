# Reusable Components

This directory contains reusable components that can be used across the application.

## Component Consolidation

The chart sharing functionality has been consolidated into a single reusable component. The old `ShareChartModal` component in `src/pages/Member/FetalGrowthChartDetail/Components/ShareChartModal` has been replaced with the new `ChartShareModal` component in this directory.

The `EnhancedFetalChart` component has been updated to use the new `ChartShareModal` component, ensuring consistent chart sharing functionality across the application.

## FroalaEditorWrapper

A wrapper component for the Froala WYSIWYG editor with pre-configured settings for Cloudinary image uploads.

### Props

- `content`: The current content of the editor
- `onContentChange`: Callback function when content changes
- `placeholder`: Placeholder text (default: "What do you think right now?")
- `minHeight`: Minimum height of the editor (default: 150px)
- `maxHeight`: Maximum height of the editor (default: 300px)
- `className`: Additional CSS classes

### Usage

```jsx
import React, { useRef } from 'react'
import FroalaEditorWrapper from '@/components/FroalaEditorWrapper'

const MyComponent = () => {
  const [content, setContent] = useState('')
  const editorRef = useRef(null)

  return <FroalaEditorWrapper content={content} onContentChange={setContent} ref={editorRef} />
}
```

## PostCreationModal

A reusable modal component for creating posts with rich text editing and image upload capabilities.

### Props

- `isVisible`: Controls the visibility of the modal
- `onCancel`: Callback function when the modal is closed
- `onSubmit`: Callback function when a post is submitted
- `currentUser`: Current user object
- `tags`: Array of available tags
- `submitting`: Boolean indicating if a submission is in progress
- `title`: Modal title (default: "New post")
- `type`: Post type (default: "community")
- `chartData`: Optional chart data for chart posts
- `children`: Optional additional content to display in the modal

### Usage

```jsx
import React, { useState } from 'react'
import PostCreationModal from '@/components/PostCreationModal'

const MyComponent = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleCreatePost = (postData) => {
    setSubmitting(true)
    // Process post data
    setSubmitting(false)
    setIsModalVisible(false)
  }

  return (
    <>
      <button onClick={() => setIsModalVisible(true)}>Create Post</button>

      <PostCreationModal
        isVisible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleCreatePost}
        currentUser={currentUser}
        tags={availableTags}
        submitting={submitting}
      />
    </>
  )
}
```

## ChartShareModal

A specialized modal component for sharing charts with the community, extending the PostCreationModal.

### Props

- `isVisible`: Controls the visibility of the modal
- `onCancel`: Callback function when the modal is closed
- `onSubmit`: Callback function when a post is submitted
- `currentUser`: Current user object
- `tags`: Array of available tags
- `submitting`: Boolean indicating if a submission is in progress
- `chartData`: Chart data to be shared

### Usage

```jsx
import React, { useState } from 'react'
import ChartShareModal from '@/components/ChartShareModal'

const ChartComponent = () => {
  const [isShareModalVisible, setIsShareModalVisible] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [chartData, setChartData] = useState(null)

  const handleShareChart = (postData) => {
    setSubmitting(true)
    // Process chart sharing
    setSubmitting(false)
    setIsShareModalVisible(false)
  }

  return (
    <>
      <button
        onClick={() => {
          // Set chart data and open modal
          setChartData(currentChartData)
          setIsShareModalVisible(true)
        }}
      >
        Share Chart
      </button>

      <ChartShareModal
        isVisible={isShareModalVisible}
        onCancel={() => setIsShareModalVisible(false)}
        onSubmit={handleShareChart}
        currentUser={currentUser}
        tags={availableTags}
        submitting={submitting}
        chartData={chartData}
      />
    </>
  )
}
```
