import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetCommentsQuery, usePostCommentMutation } from '../../redux/services/commentsApi';
import { FaSpinner } from 'react-icons/fa';
import AuthModal from '../../components/auth/AuthModal';
import { styles } from '../../styles/styles';
import moment from 'moment';

const Comments = ({ movieId }) => {
  const [content, setContent] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { data, isFetching, error } = useGetCommentsQuery(
    { contentId: movieId, contentType: 'movie' },
    { skip: !movieId }
  );
  const [postComment, { isLoading: isPosting }] = usePostCommentMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!content.trim()) return;

    try {
      await postComment({
        contentId: movieId,
        contentType: 'movie',
        content,
      }).unwrap();
      setContent('');
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
  };

  return (
    <div className="mt-8 dark:text-textDark text-textLight">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      {/* Post Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="w-full h-24 p-3 rounded-lg bg-gray-200 dark:bg-gray-800 dark:text-textDark text-textLight border border-gray-300 dark:border-gray-600 resize-none focus:outline-none focus:border-btn"
          disabled={isPosting || !isAuthenticated}
        />
        <button
          type="submit"
          disabled={isPosting || !content.trim()}
          className={`${styles.loginBtn} mt-3 px-6 py-2 ${isPosting || !content.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isPosting ? <FaSpinner className="animate-spin text-xl" /> : 'Post Comment'}
        </button>
      </form>

      {/* Comments List */}
      {isFetching ? (
        <div className="flex justify-center">
          <FaSpinner className="animate-spin text-3xl text-btn" />
        </div>
      ) : error ? (
        <p className="text-center text-red-500">Failed to load comments.</p>
      ) : !data?.length ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No comments yet. Be the first to comment!</p>
      ) : (
        <div className="space-y-4">
          {data.map((comment) => (
            <div
              key={comment._id}
              className="flex gap-4 p-4 rounded-lg border backdrop-blur-sm
                        dark:bg-screenDark dark:bg-opacity-80 dark:border-border
                        bg-gray-100 border-gray-300"
            >
              <img
                src={comment.user.profilePicture || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg'}
                alt={comment.user.username}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="font-semibold dark:text-textDark text-gray-900">
                    {comment.user.username}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {moment(comment.createdAt).fromNow()}
                  </p>
                </div>
                <p className="mt-1 dark:text-textDark text-gray-800">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

export default Comments;