import React, { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiImage, FiSmile, FiSun, FiMoon, FiHeart, FiBookmark, FiPlus } from "react-icons/fi";
import { AiOutlineBold, AiOutlineItalic, AiOutlineUnderline, AiOutlineOrderedList, AiOutlineUnorderedList } from "react-icons/ai";


const BlogDashboard = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [posts, setPosts] = useState([
        {
            id: 1,
            title: "Getting Started with React and Tailwind",
            excerpt: "Learn how to build modern web applications using React and Tailwind CSS framework...",
            thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
            createdAt: "2024-01-20",
            mood: "🚀",
            likes: 15,
            isSaved: false,
            authorId: 1
        },
        {
            id: 2,
            title: "The Future of Web Development",
            excerpt: "Exploring the latest trends and technologies shaping the future of web development...",
            thumbnail: "https://images.unsplash.com/photo-1504639725590-34d0984388bd",
            createdAt: "2024-01-19",
            mood: "💡",
            likes: 23,
            isSaved: true,
            authorId: 2
        }
    ]);

    type Post = {
        id: number;
        title: string;
        excerpt: string;
        thumbnail: string;
        createdAt: string;
        mood: string;
        likes: number;
        isSaved: boolean;
        authorId?: number;
    };


    const [currentUserId] = useState(1);
    const [userStats, setUserStats] = useState({
        totalLikes: 0,
        savedPosts: 0
    });
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSavedPosts, setShowSavedPosts] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newPost, setNewPost] = useState({
        title: "",
        excerpt: "",
        mood: "🚀",
        thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97"
    });

    useEffect(() => {
        const totalLikes = posts
            .filter(post => post.authorId === currentUserId)
            .reduce((sum, post) => sum + post.likes, 0);
        const savedPosts = posts.filter(post => post.isSaved).length;
        setUserStats({ totalLikes, savedPosts });
    }, [posts, currentUserId]);

    const handleDelete = (postId: number) => {
        setPosts(posts.filter(post => post.id !== postId));
        setShowDeleteModal(false);
    };

    const toggleSavePost = (postId: number) => {
        setPosts(posts.map(post =>
            post.id === postId ? { ...post, isSaved: !post.isSaved } : post
        ));
    };

    const handleCreatePost = () => {
        const newBlogPost = {
            ...newPost,
            id: posts.length + 1,
            createdAt: new Date().toISOString().split('T')[0],
            likes: 0,
            isSaved: false,
            authorId: currentUserId
        };
        setPosts([...posts, newBlogPost]);
        setIsCreating(false);
        setNewPost({ title: "", excerpt: "", mood: "🚀", thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97" });
    };

    return (
        <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
            <nav className="bg-white shadow-lg dark:bg-gray-800 ">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center mt-20">
                        <h1 className="text-2xl font-bold">Blog Dashboard</h1>
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setShowSavedPosts(!showSavedPosts)}>
                                <FiBookmark className="w-5 h-5 text-blue-500" />
                                <span>{userStats.savedPosts} saved posts</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <FiHeart className="w-5 h-5 text-red-500" />
                                <span>{userStats.totalLikes} total likes</span>
                            </div>
                            <button
                                onClick={() => setIsCreating(true)}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <FiPlus className="w-5 h-5" />
                                <span>Create New Blog</span>
                            </button>
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                                {darkMode ? <FiSun className="w-6 h-6" /> : <FiMoon className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {showSavedPosts
                        ? posts.filter(post => post.isSaved).map((post) => (
                            <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800">
                                <a href={`/blog/${post.id}`} className="block hover:opacity-90 transition-opacity">
                                    <img src={post.thumbnail} alt={post.title} className="w-full h-48 object-cover" loading="lazy" />
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-2xl">{post.mood}</span>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">{post.createdAt}</span>
                                        </div>
                                        <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                                        <p className="text-gray-600 dark:text-gray-300 mb-4">{post.excerpt}</p>
                                    </div>
                                </a>
                            </article>
                        ))
                        : posts.map((post) => (
                            <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800">
                                <img src={post.thumbnail} alt={post.title} className="w-full h-48 object-cover" loading="lazy" />
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-2xl">{post.mood}</span>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">{post.createdAt}</span>
                                    </div>
                                    <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                                    <p className="text-gray-600 dark:text-gray-300 mb-4">{post.excerpt}</p>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-2">
                                            <FiHeart className={`w-5 h-5 ${post.likes > 0 ? "text-red-500" : "text-gray-400"}`} />
                                            <span>{post.likes}</span>
                                        </div>
                                        <button onClick={() => toggleSavePost(post.id)} className={`p-2 rounded-full ${post.isSaved ? "text-blue-500" : "text-gray-400"} hover:bg-gray-100`}>
                                            <FiBookmark className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="flex justify-end align-bottom space-x-2">
                                        <button onClick={() => { setSelectedPost(post); setIsEditing(true); }} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full dark:hover:bg-blue-900">
                                            <FiEdit2 className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => setShowDeleteModal(true)} className="p-2 text-red-600 hover:bg-red-100 rounded-full dark:hover:bg-red-900">
                                            <FiTrash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                </div>

                {isEditing && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl p-6">
                            <div className="mb-6">
                                <input
                                    type="text"
                                    placeholder="Blog Title"
                                    className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                                    value={selectedPost?.title || ""}
                                />
                            </div>
                            <div className="mb-4 flex space-x-2 border-b pb-4">
                                <button className="p-2 hover:bg-gray-100 rounded dark:hover:bg-gray-700">
                                    <AiOutlineBold className="w-5 h-5" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded dark:hover:bg-gray-700">
                                    <AiOutlineItalic className="w-5 h-5" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded dark:hover:bg-gray-700">
                                    <AiOutlineUnderline className="w-5 h-5" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded dark:hover:bg-gray-700">
                                    <AiOutlineOrderedList className="w-5 h-5" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded dark:hover:bg-gray-700">
                                    <AiOutlineUnorderedList className="w-5 h-5" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded dark:hover:bg-gray-700">
                                    <FiImage className="w-5 h-5" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded dark:hover:bg-gray-700">
                                    <FiSmile className="w-5 h-5" />
                                </button>
                            </div>
                            <textarea
                                className="w-full h-64 px-4 py-2 rounded-lg border resize-none dark:bg-gray-700 dark:border-gray-600"
                                placeholder="Write your blog content here..."
                                value={selectedPost?.excerpt || ""}
                            />
                            <div className="flex justify-end space-x-4 mt-6">
                                <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700">Cancel</button>
                                <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
                            </div>
                        </div>
                    </div>
                )}

                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
                            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to delete this blog post? This action cannot be undone.</p>
                            <div className="flex justify-end space-x-4">
                                <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700">Cancel</button>
                                <button
                                    onClick={() => selectedPost?.id !== undefined && handleDelete(selectedPost.id)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    Delete
                                </button>              </div>
                        </div>
                    </div>
                )}

                {isCreating && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl p-6">
                            <div className="mb-6">
                                <input
                                    type="text"
                                    placeholder="Blog Title"
                                    className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                                    value={newPost.title}
                                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                                />
                            </div>
                            <div className="mb-4 flex space-x-2 border-b pb-4">
                                <button className="p-2 hover:bg-gray-100 rounded dark:hover:bg-gray-700">
                                    <AiOutlineBold className="w-5 h-5" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded dark:hover:bg-gray-700">
                                    <AiOutlineItalic className="w-5 h-5" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded dark:hover:bg-gray-700">
                                    <AiOutlineUnderline className="w-5 h-5" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded dark:hover:bg-gray-700">
                                    <AiOutlineOrderedList className="w-5 h-5" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded dark:hover:bg-gray-700">
                                    <AiOutlineUnorderedList className="w-5 h-5" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded dark:hover:bg-gray-700">
                                    <FiImage className="w-5 h-5" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded dark:hover:bg-gray-700">
                                    <FiSmile className="w-5 h-5" />
                                </button>
                            </div>
                            <textarea
                                className="w-full h-64 px-4 py-2 rounded-lg border resize-none dark:bg-gray-700 dark:border-gray-600"
                                placeholder="Write your blog content here..."
                                value={newPost.excerpt}
                                onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                            />
                            <div className="flex justify-end space-x-4 mt-6">
                                <button onClick={() => setIsCreating(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700">Cancel</button>
                                <button onClick={handleCreatePost} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Create Post</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default BlogDashboard;