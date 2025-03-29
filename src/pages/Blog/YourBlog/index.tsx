import { useCallback, useEffect, useState } from 'react'
import { Button, Form, Input, message, Modal, Select, Switch, Tag, Tooltip, Upload } from 'antd'
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useDispatch, useSelector } from 'react-redux'
import { selectBlogInfo, selectTagInfo } from '@/store/modules/global/selector'
import { jwtDecode } from 'jwt-decode'
import { convert } from 'html-to-text'
import debounce from 'lodash/debounce'
import request from '@/utils/axiosClient'

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
  const [form] = Form.useForm()
  const [userImage, setUserImage] = useState<string | null>(user?.picture || null)

  const handleCreatePost = () => {
    setCurrentPost(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEditPost = (post) => {
    console.log('EDIT INPUT', post)
    setCurrentPost(post)
    form.setFieldsValue({
      pageTitle: post.pageTitle || '',
      heading: post.heading || '',
      shortDescription: post.shortDescription || '',
      content: post.content || '',
      tagIds: post.tags?.map((tag) => tag.id) || [],
      featuredImageUrl: post.featuredImageUrl || 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f',
      isVisible: post.isVisible
    })
    setIsModalVisible(true)
  }

  const handleDeletePost = (postId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this blog?',
      content: 'This action cannot be undone.',
      onOk: () => {
        dispatch({ type: 'DELETE_BLOG', payload: postId })
      }
    })
  }

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const plainTextContent = convert(values.content)
        console.log('FORM VALUES', values)

        if (currentPost) {
          dispatch({
            type: 'UPDATE_BLOG',
            payload: { ...values, content: plainTextContent, userId: user?.id, id: currentPost.id }
          })
        } else {
          dispatch({
            type: 'CREATE_BLOG',
            payload: { 
              ...values, 
              content: plainTextContent, 
              userId: user?.id,
              featuredImageUrl: values.featuredImageUrl || 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f'
            }
          })
        }

        setIsModalVisible(false)
      })
      .catch((info) => {
        message.error('Please fill in the required fields')
      })
  }
  const debouncedSearchTerm = useCallback(
    debounce((value) => setSearchTerm(value), 1000),
    []
  )

  const handleSearchChange = (e) => {
    debouncedSearchTerm(e.target.value)
  }

  const filteredBlogs = blogs.filter((post) => post.pageTitle.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleUpload = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'PregnaCare')
    formData.append('cloud_name', 'dgzn2ix8w')
    try {
      const response = await request.post('https://api.cloudinary.com/v1_1/dgzn2ix8w/image/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      console.log('Upload response:', response.data)
      setUserImage(response.data.secure_url)

      form.setFieldsValue({ featuredImageUrl: response.data.secure_url })
      message.success('Image uploaded successfully')
    } catch (error) {
      message.error('Failed to upload image')
      console.error('Upload error details', error?.response.data || error.message)
    }
  }
  return (
    <div className='min-h-screen bg-gradient-to-br from-[#fff5f6] via-white to-[#fff5f6] p-8 mt-20'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex gap-8'>
          {/* Sidebar */}
          <div className='w-64 bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-24'>
            <h2 className='text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200'>Tags</h2>
            <div className='space-y-3'>
              {tags.map((tag) => (
                <Tag
                  key={tag.id}
                  className={`block w-full text-center py-2.5 cursor-pointer rounded-lg transition-all duration-200 ${
                    selectedTag === tag.name
                      ? 'bg-[#ff6b81] text-white border-[#ff6b81] shadow-sm'
                      : 'hover:bg-[#fff5f6] hover:border-[#ff6b81] text-gray-600'
                  }`}
                  onClick={() => setSelectedTag(tag.name === selectedTag ? null : tag.name)}
                >
                  {tag.name}
                </Tag>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className='flex-1'>
            <div className='flex justify-between items-center mb-8'>
              <div>
                <h1 className='text-4xl font-bold text-gray-800 mb-2'>My Blog</h1>
                <p className='text-gray-600'>Manage and create your blog posts</p>
              </div>
              <button
                onClick={handleCreatePost}
                className='bg-[#ff6b81] text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-[#ff5268] transition-all duration-200 shadow-lg hover:shadow-xl'
              >
                <FiPlus className='text-lg' /> New Blog
              </button>
            </div>

            <div className='mb-8'>
              <Input
                prefix={<FiSearch className='text-gray-400' />}
                placeholder='Search your blogs...'
                onChange={handleSearchChange}
                className='max-w-md rounded-xl'
                size='large'
              />
            </div>

            {filteredBlogs.length > 0 ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {filteredBlogs.map((post) => (
                  <div
                    key={post.id}
                    className='bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group'
                  >
                    <div className='relative h-48 overflow-hidden'>
                      <img
                        src={post.featuredImageUrl}
                        alt={post.title}
                        className='w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300'
                      />
                      <div className='absolute top-4 right-4 flex gap-2'>
                        <Tooltip title='Edit post'>
                          <button
                            onClick={() => handleEditPost(post)}
                            className='p-2 bg-white/90 text-[#ff6b81] rounded-lg hover:bg-white transition-colors shadow-md'
                          >
                            <FiEdit2 />
                          </button>
                        </Tooltip>
                        <Tooltip title='Delete post'>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className='p-2 bg-white/90 text-[#ff6b81] rounded-lg hover:bg-white transition-colors shadow-md'
                          >
                            <FiTrash2 />
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                    <div className='p-6'>
                      <h2 className='text-xl font-semibold text-gray-800 mb-2 line-clamp-2'>{post.pageTitle}</h2>
                      <p className='text-gray-600 mb-4 line-clamp-2'>{post.shortDescription}</p>
                      <div className='flex flex-wrap gap-2 mb-4'>
                        {post.tags?.map((tag) => (
                          <Tag
                            key={tag.id}
                            className='bg-[#fff5f6] text-[#ff6b81] border-[#ff6b81] rounded-full px-3 py-1'
                          >
                            {tag.name}
                          </Tag>
                        ))}
                      </div>
                      <div className='flex justify-between items-center'>
                        <div className='text-sm text-gray-500'>{post.timeAgo}</div>
                        {!post.isVisible && (
                          <Tag color='geekblue-inverse' className='rounded-full px-3 py-1'>
                            Draft
                          </Tag>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-12 bg-white rounded-2xl shadow-lg'>
                <div className='text-[#ff6b81] mb-4'>
                  <FiPlus className='w-16 h-16 mx-auto' />
                </div>
                <h3 className='text-xl font-semibold text-gray-700 mb-2'>No blogs yet</h3>
                <p className='text-gray-500 mb-6'>Start creating your first blog post to share your thoughts</p>
                <button
                  onClick={handleCreatePost}
                  className='bg-[#ff6b81] text-white px-6 py-3 rounded-xl hover:bg-[#ff5268] transition-all duration-200'
                >
                  Create Your First Blog
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        title={currentPost ? 'Edit Blog' : 'Create New Blog'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalVisible(false)
          form.resetFields()
        }}
        width={800}
        className='rounded-2xl'
        footer={[
          <Button
            key='cancel'
            onClick={() => {
              setIsModalVisible(false)
              form.resetFields()
            }}
            className='rounded-lg'
          >
            Cancel
          </Button>,
          <Button key='submit' onClick={handleSubmit} className='bg-[#ff6b81] text-white rounded-lg hover:bg-[#ff5268]'>
            {currentPost ? 'Update' : 'Create'}
          </Button>
        ]}
      >
        <Form form={form} layout='vertical' className='mt-4'>
          <Form.Item
            name='tagIds'
            rules={[{ required: true, message: 'Please select at least one tag!' }]}
            initialValue={[]}
          >
            <label className='block mb-2 text-gray-700 font-medium'>Tags</label>
            <Select
              mode='tags'
              placeholder='Select tags'
              className='w-full rounded-lg'
              onChange={(value) => form.setFieldsValue({ tagIds: value || [] })}
            >
              {tags.map((tag) => (
                <Select.Option key={tag.id} value={tag.id}>
                  {tag.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name='pageTitle' rules={[{ required: true, message: 'Please input the blog title!' }]}>
            <Input placeholder='Blog title' className='rounded-lg' />
          </Form.Item>
          <Form.Item name='heading'>
            <Input placeholder='Heading' className='rounded-lg' />
          </Form.Item>
          <Form.Item name='shortDescription'>
            <Input.TextArea placeholder='Short description' rows={2} className='rounded-lg' />
          </Form.Item>
          <Form.Item name='content' rules={[{ required: true, message: 'Please input the blog content!' }]}>
            <ReactQuill className='h-64 mb-12 rounded-lg' />
          </Form.Item>
          <Form.Item 
            name='isVisible' 
            label='Visibility' 
            valuePropName='checked' 
            initialValue={true} 
            className='mb-4'
          >
            <Switch 
              className='bg-gray-300'
              checkedChildren='Published'
              unCheckedChildren='Draft'
              onChange={(checked) => {
                form.setFieldsValue({ isVisible: checked })
                if (!checked) {
                  message.info('Blog will be saved as draft')
                }
              }}
            />
          </Form.Item>
          <Form.Item name='status' initialValue='pending' hidden>
            <Input />
          </Form.Item>
          <Form.Item name='featuredImageUrl'>
            <Upload
              maxCount={1}
              beforeUpload={(file) => {
                return new Promise((resolve, reject) => {
                  if (file.size > 900000) {
                    reject('File size exceeded')
                    message.error('File size exceeded')
                  } else {
                    resolve('Success')
                  }
                })
              }}
              customRequest={({ file, onSuccess, onError }) => {
                handleUpload(file)
                  .then(() => onSuccess('ok'))
                  .catch(onError)
              }}
              showUploadList={false}
            >
              <Button className='rounded-lg bg-[#ff6b81] text-white hover:bg-[#ff5268]'>Upload image</Button>
            </Upload>
            {userImage && (
              <div className='mt-4'>
                <img src={userImage} alt='Uploaded' className='w-full h-48 object-cover rounded-lg' />
              </div>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default BlogDashboard
