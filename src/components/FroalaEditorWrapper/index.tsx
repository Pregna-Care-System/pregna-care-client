import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

// Import Froala Editor
import FroalaEditor from 'react-froala-wysiwyg'
// Import Froala Editor CSS files
import 'froala-editor/css/froala_style.min.css'
import 'froala-editor/css/froala_editor.pkgd.min.css'
// Import Font Awesome for Froala Editor icons
import 'font-awesome/css/font-awesome.css'
import 'froala-editor/js/plugins.pkgd.min.js'
import 'froala-editor/js/third_party/embedly.min.js'
import 'froala-editor/js/languages/vi.js'

const FroalaEditorWrapper = forwardRef(({ model, onModelChange, config }, ref) => {
  const editorRef = useRef(null)

  // Expose editor methods to parent component
  useImperativeHandle(ref, () => ({
    getEditor: () => (editorRef.current ? editorRef.current.editor : null),
    getHTML: () => (editorRef.current ? editorRef.current.editor.html.get() : ''),
    getModel: () => model
  }))

  // Handle cleanup on unmount
  useEffect(() => {
    return () => {
      // Try to manually destroy the editor when component unmounts
      if (editorRef.current && editorRef.current.editor) {
        try {
          editorRef.current.editor.destroy()
        } catch (e) {
          console.warn('Could not destroy Froala editor:', e)
        }
      }
    }
  }, [])

  return (
    <FroalaEditor
      ref={editorRef}
      model={model}
      onModelChange={onModelChange}
      config={{
        placeholderText: 'Write something...',
        heightMin: 200,
        language: 'vi',
        attribution: false,
        ...config
      }}
    />
  )
})

export default FroalaEditorWrapper
