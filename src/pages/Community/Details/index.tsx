import { useState } from "react";
import { FaHeart, FaReply, FaShare, FaFlag, FaChevronLeft } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const CommunityCommentDetails = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([
    {
      id: 1,
      user: {
        name: "Emma Wilson",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
        expertise: "Health Enthusiast",
      },
      content: "I completely agree with Sarah! Staying hydrated made a huge difference for me during my first trimester.",
      timestamp: "1 hour ago",
    },
    {
      id: 2,
      user: {
        name: "James Brown",
        avatar: "src/assets/th.jpg",
        expertise: "New Sister",
      },
      content: "Great advice, Sarah! My wife found ginger tea really helpful as well.",
      timestamp: "30 minutes ago",
    },
  ]);

  const addComment = () => {
    if (newComment.trim() === "") return;

    setComments([
      ...comments,
      {
        id: comments.length + 1,
        user: {
          name: "You",
          avatar: "https://via.placeholder.com/150",
          expertise: "Community Member",
        },
        content: newComment,
        timestamp: "Just now",
      },
    ]);
    setNewComment("");
  };

  const comment = {
    id: 1,
    user: {
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      expertise: "Experienced Mom",
      badges: ["Verified Member", "Community Guide"],
      credibilityScore: 98,
    },
    content:
      "As someone who's been through three pregnancies, I understand the anxiety about morning sickness. What helped me was eating small, frequent meals and staying hydrated. Remember, every pregnancy is different, and it's completely normal to feel overwhelmed. I'd recommend discussing your specific symptoms with your healthcare provider for personalized advice.",
    timestamp: "2 hours ago",
    topic: "First Trimester Concerns",
    stage: "Week 8-12",
    helpfulCount: 156,
    replies: 23,
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gradient-to-b from-pink-50 to-white min-h-screen">
      
      <div className="mb-6 mt-16">
        <button
          className="flex items-center text-gray-600 hover:text-pink-600 transition-colors"
          onClick={() => window.history.back()}
        >
          <FaChevronLeft className="mr-2" />
          Back to Community
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-start space-x-4 mb-6">
          <img
            src={comment.user.avatar}
            alt={comment.user.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h2 className="font-semibold text-gray-800">{comment.user.name}</h2>
              <MdVerified className="text-blue-500" />
              <span className="text-sm text-pink-600 bg-pink-50 px-2 py-1 rounded-full">
                {comment.user.expertise}
              </span>
            </div>
            <div className="text-sm text-gray-500 flex space-x-2">
              <span>{comment.timestamp}</span>
              <span>•</span>
              <span>{comment.topic}</span>
            </div>
          </div>
        </div>

        <div className="prose max-w-none mb-6">
          <p className="text-gray-700 leading-relaxed">{comment.content}</p>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center space-x-2 ${isLiked ? "text-pink-600" : "text-gray-500"} hover:text-pink-600 transition-colors`}
            >
              <FaHeart />
              <span>{comment.helpfulCount} Helpful</span>
            </button>

            <button
              onClick={() => setShowReplyBox(!showReplyBox)}
              className="flex items-center space-x-2 text-gray-500 hover:text-pink-600 transition-colors"
            >
              <FaReply />
              <span>Reply</span>
            </button>

            <button className="flex items-center space-x-2 text-gray-500 hover:text-pink-600 transition-colors">
              <FaShare />
              <span>Share</span>
            </button>

            <button className="flex items-center space-x-2 text-gray-500 hover:text-red-600 transition-colors ml-auto">
              <FaFlag />
              <span>Report</span>
            </button>
          </div>

          {showReplyBox && (
            <div className="mt-4">
              <textarea
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all"
                placeholder="Write your supportive reply..."
                rows={3}
              ></textarea>
              <div className="mt-2 flex justify-end space-x-2">
                <button
                  onClick={() => setShowReplyBox(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                  Reply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* List of other comments */}
      <div className="mb-6 space-y-4">
        {comments.map((c) => (
          <div
            key={c.id}
            className="flex items-start space-x-4 p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-md"
          >
            <img
              src={c.user.avatar}
              alt={c.user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-semibold text-gray-800">{c.user.name}</h4>
                <span className="text-sm text-pink-600 bg-pink-50 px-2 py-1 rounded-full">
                  {c.user.expertise}
                </span>
              </div>
              <p className="text-gray-700">{c.content}</p>
              <span className="text-sm text-gray-500">{c.timestamp}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add your comment section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-gray-800 font-semibold mb-2">Add Your Comment</h3>
        <textarea
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all"
          placeholder="Share your thoughts..."
          rows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        ></textarea>
        <div className="mt-2 flex justify-end space-x-2">
          <button
            onClick={() => setNewComment("")}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={addComment}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            Post Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityCommentDetails;
