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
            payload: { ...values, content: plainTextContent, userId: user?.id }
          })
        }

        setIsModalVisible(false)
      })
      .catch((info) => {
        message.error('Please fill in the required fields')
      })
  }
  const debouncedSearchTerm = useCallback(
    debounce((value) => setSearchTerm(value), 500),
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
            onChange={handleSearchChange}
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
                <img
                  src={post.featuredImageUrl}
                  alt={post.title}
                  className='w-full h-48 object-cover rounded-md mb-4'
                />
                <div className='flex flex-wrap gap-2 mb-4'>
                  {post.tags?.map((tag) => {
                    const tagData = tags.find((t) => t.name === tag.name)
                    return <Tag key={tag} color={tagData?.color}></Tag>
                  })}
                </div>
                <div className='flex justify-between items-center'>
                  <div className='flex gap-2'>
                    <Tooltip title='Edit post'>
                      <button
                        onClick={() => handleEditPost(post)}
                        className='p-2 bg-gray-100 text-blue-500 border border-blue-300 rounded-md hover:bg-gray-200'
                      >
                        <FiEdit2 />
                      </button>
                    </Tooltip>
                    <Tooltip title='Delete post'>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className='p-2 bg-red-200 text-red-500 border border-red-300 rounded-md hover:bg-gray-200'
                      >
                        <FiTrash2 />
                      </button>
                    </Tooltip>
                  </div>
                  {!post.isVisible && <Tag color='gray'>Draft</Tag>}
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
          onCancel={() => {
            setIsModalVisible(false)
            form.resetFields()
          }}
          width={800}
        >
          <Form form={form} layout='vertical'>
            <Form.Item
              name='tagIds'
              rules={[{ required: true, message: 'Please select at least one tag!' }]}
              initialValue={[]}
            >
              <label className='block mb-2'>Tags</label>
              <Select
                mode='tags'
                placeholder='Select tags'
                className='w-full'
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
              <Input placeholder='Blog title' />
            </Form.Item>
            <Form.Item name='heading'>
              <Input placeholder='Heading' />
            </Form.Item>
            <Form.Item name='shortDescription'>
              <Input.TextArea placeholder='Short description' rows={2} />
            </Form.Item>
            <Form.Item name='content' rules={[{ required: true, message: 'Please input the blog content!' }]}>
              <ReactQuill className='h-64 mb-12' />
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
                <Button>Upload image</Button>
              </Upload>
              {userImage && (
                <div className='mt-4'>
                  <img src={userImage} alt='Uploaded' className='w-full h-48 object-cover rounded-md' />
                </div>
              )}
            </Form.Item>
            <Form.Item name='isVisible' valuePropName='checked' initialValue={true}>
              <label className='block mb-2'>DRAFT</label>
              <Switch />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  )
}

export default BlogDashboard
