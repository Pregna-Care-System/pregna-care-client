import { useState, useEffect } from 'react'
import { Modal, Select, Input, Switch, Upload, message, Tag, Tooltip } from 'antd'
import { FiEdit2, FiTrash2, FiImage, FiSearch, FiPlus } from 'react-icons/fi'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useDispatch, useSelector } from 'react-redux'
import { selectBlogInfo, selectTagInfo } from '@/store/modules/global/selector'
import { jwtDecode } from 'jwt-decode'
import { convert } from 'html-to-text'

const BlogDashboard = () => {
  const [blogs, setBlogs] = useState([])
  const [tags, setTags] = useState([])
  const token = localStorage.getItem('accessToken')
  const user = jwtDecode(token) ?? null
  const dispatch = useDispatch()
  const tagResponse = useSelector(selectTagInfo)
  const blogResponse = useSelector(selectBlogInfo)
  
  useEffect(() => {
    dispatch({ type: 'GET_ALL_TAGS' })
    dispatch({ type: 'GET_ALL_BLOGS_BY_USERID', payload: user })
  }, [dispatch])

  useEffect(() => {
    if (tagResponse.length > 0 && tagResponse !== null) {
      setTags(tagResponse)
    }
    if (blogResponse.length > 0 && blogResponse !== null) {
      setBlogs(blogResponse)
    }
  }, [tagResponse, blogResponse])

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentPost, setCurrentPost] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState(null)
  const [form, setForm] = useState({
    pageTitle: '',
    heading: '',
    shortDescription: '',
    content: '',
    tagIds: [],
    featuredImageUrl: '',
    isVisible: false
  })


  const handleCreatePost = () => {
    setCurrentPost(null)
    setForm({
      pageTitle: '',
      heading: '',
      shortDescription: '',
      content: '',
      tagIds: [],
      featuredImageUrl: 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f',
      isVisible: false
    })
    setIsModalVisible(true)
  }

  const handleEditPost = (post) => {
    setCurrentPost(post)
    setForm(post)
    setIsModalVisible(true)
  }

  const handleDeletePost = (postId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this post?',
      content: 'This action cannot be undone.',
      onOk: () => {
        setBlogs(blogs.filter((post) => post.id !== postId))
        message.success('Post deleted successfully')
      }
    })
  }

  const handleSubmit = () => {
    if (!form.pageTitle || !form.content) {
      message.error('Title and content are required')
      return
    }
    const plainTextContent = convert(form.content)

    dispatch({
      type: 'CREATE_BLOG',
      payload: { ...form, content: plainTextContent, userId: user?.id }
    })
    setIsModalVisible(false)
  }
  

  const filteredBlogs = blogs.filter((post) => post.pageTitle.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div
      className='flex min-h-screen bg-background p-6 mt-20'
      style={{ background: 'linear-gradient(to bottom,#f0f8ff, #f6e3e1 )' }}
    >
      <div className='w-1/6 p-4 bg-white shadow-md rounded-xl'>
        <h2 className='text-lg font-semibold mb-4'>Tag</h2>
        <div className='space-y-2'>
          {tags.map((tag) => (
            <Tag
              key={tag.id}
              className={`block w-full text-center py-2 cursor-pointer rounded-md transition-all ${selectedTag === tag.name ? ' bg-red-200' : 'hover:bg-gray-100 hover:border-red-200'}`}
              onClick={() => setSelectedTag(tag.name === selectedTag ? null : tag.name)}
            >
              {tag.name}
            </Tag>
          ))}
        </div>
      </div>
      <div className='w-5/6 ml-6'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='font-bold text-3xl'>My Blog</h1>
          <button
            onClick={handleCreatePost}
            className='bg-[#f68999] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-black transition-colors'
          >
            <FiPlus /> New Blog
          </button>
        </div>

        <div className='mb-6'>
          <Input
            prefix={<FiSearch className='text-gray-400' />}
            placeholder='Search blogs...'
            onChange={(e) => setSearchTerm(e.target.value)}
            className='max-w-md'
          />
        </div>

        {filteredBlogs.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredBlogs.map((post) => (
              <div
                key={post.id}
                className='bg-gray-50 border border-red-200 shadow-2xl rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer'
              >
                <h2 className='text-xl font-semibold mb-2'>{post.pageTitle}</h2>
                <h3 className='mb-2'>{post.shortDescription}</h3>
                <img src={post.image} alt={post.title} className='w-full h-48 object-cover rounded-md mb-4' />
                <div className='flex flex-wrap gap-2 mb-4'>
                  {post.tags?.map((tag) => {
                    const tagData = tags.find((t) => t.name === tag.name)
                    return (
                      <Tag key={tag} color={tagData?.color}>
                        {tag.name}
                      </Tag>
                    )
                  })}
                </div>
                <div className='flex justify-between items-center'>
                  <div className='flex gap-2'>
                    <Tooltip title='Edit post'>
                      <button
                        onClick={() => handleEditPost(post)}
                        className='p-2 text-gray-600 hover:text-primary transition-colors'
                      >
                        <FiEdit2 />
                      </button>
                    </Tooltip>
                    <Tooltip title='Delete post'>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className='p-2 text-gray-600 hover:text-destructive transition-colors'
                      >
                        <FiTrash2 />
                      </button>
                    </Tooltip>
                  </div>
                  {post.isVisible && <span className='text-sm text-muted-foreground'>Draft</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center text-gray-500 text-lg mt-10'>
            There are not blogs. Please create new your blog.
          </div>
        )}

        <Modal
          title={currentPost ? 'Edit Blog' : 'Create New Blog'}
          open={isModalVisible}
          onOk={handleSubmit}
          onCancel={() => setIsModalVisible(false)}
          width={800}
        >
          <div className='space-y-4'>
            <Input
              placeholder='Blog title'
              value={form.pageTitle}
              onChange={(e) => setForm({ ...form, pageTitle: e.target.value })}
            />
            <Input
              placeholder='Heading'
              value={form.heading}
              onChange={(e) => setForm({ ...form, heading: e.target.value })}
            />
            <Input.TextArea
              placeholder='Short description'
              value={form.shortDescription}
              onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
              rows={2}
            />
            <ReactQuill
              value={form.content}
              onChange={(content) => setForm({ ...form, content })}
              className='h-64 mb-12'
            />
            <Select
              mode='tags'
              placeholder='Select tags'
              value={form.tagIds}
              onChange={(tagIds) => setForm({ ...form, tagIds })}
              className='w-full'
            >
              {tags.map((tag) => (
                <Select.Option key={tag.id} value={tag.id}>
                  {tag.name}
                </Select.Option>
              ))}
            </Select>
            <div className='flex justify-between items-center'>
              <Upload
                accept='image/*'
                showUploadList={false}
                beforeUpload={(file) => {
                  const reader = new FileReader()
                  reader.onload = (e) => {
                    setForm({ ...form, featuredImageUrl: e.target.result })
                  }
                  reader.readAsDataURL(file)
                  return false
                }}
              >
                <button className='flex items-center gap-2 text-primary'>
                  <FiImage /> Upload Image
                </button>
              </Upload>
              <div className='flex items-center gap-2'>
                <span>Draft</span>
                <Switch checked={form.isVisible} onChange={(checked) => setForm({ ...form, isVisible: checked })} />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default BlogDashboard
