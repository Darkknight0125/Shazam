import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { FaSpinner, FaSearch, FaUserPlus, FaCheck, FaTimes } from 'react-icons/fa';
import { useGetFriendsQuery, useGetFriendRequestsQuery, useSearchUsersQuery, useSendFriendRequestMutation, useAcceptFriendRequestMutation, useGetChatHistoryQuery, useSendMessageMutation } from '../../redux/services/friendsApi';
import { styles } from '../../styles/styles';
import AuthModal from '../../components/auth/AuthModal';
import { BASE_API_URL } from '../../constants/api';
import { useGetProfileQuery } from '../../redux/services/authApi';

const Friends = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { data: profile, isFetching: isFetchingProfile } = useGetProfileQuery(undefined, { skip: !isAuthenticated });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socketError, setSocketError] = useState(null);
  const socket = useRef(null);
  const messagesEndRef = useRef(null);

  const { data: friends, isFetching: isFetchingFriends } = useGetFriendsQuery(undefined, { skip: !isAuthenticated });
  const { data: friendRequests, isFetching: isFetchingRequests } = useGetFriendRequestsQuery(undefined, { skip: !isAuthenticated });
  const { data: searchResults, isFetching: isFetchingSearch } = useSearchUsersQuery(searchQuery, { skip: !searchQuery || !isAuthenticated });
  const [sendFriendRequest, { isLoading: isSendingRequest }] = useSendFriendRequestMutation();
  const [acceptFriendRequest, { isLoading: isAcceptingRequest }] = useAcceptFriendRequestMutation();
  const [sendMessage, { isLoading: isSendingMessage }] = useSendMessageMutation();
  const { data: chatHistory, isFetching: isFetchingChat } = useGetChatHistoryQuery(selectedFriend?._id, { skip: !selectedFriend || !isAuthenticated });

  useEffect(() => {
    console.log('Auth state:', { isAuthenticated, user });
    if (!isAuthenticated || !user || !user.id) {
      console.log('Socket setup skipped: User not authenticated or user.id missing', { isAuthenticated, userId: user?.id });
      setSocketError('User not authenticated or user ID missing');
      return;
    }

    socket.current = io(BASE_API_URL, {
      auth: { token: localStorage.getItem('authToken') },
    });

    socket.current.on('connect', () => {
      console.log('Socket connected:', socket.current.id);
      console.log('Emitting join with userId:', user.id);
      socket.current.emit('join', user.id);
    });

    socket.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      setSocketError(error.message);
    });

    socket.current.on('newMessage', (message) => {
      console.log('Received new message:', message);
      if (message.sender === selectedFriend?._id || message.receiver === selectedFriend?._id) {
        setMessages((prev) => [...prev, {
          _id: message._id,
          sender: { _id: message.sender, username: message.senderUsername || 'Unknown' },
          receiver: { _id: message.receiver, username: message.receiverUsername || 'Unknown' },
          content: message.content,
          timestamp: message.timestamp,
        }]);
      }
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
        console.log('Socket disconnected');
      }
    };
  }, [isAuthenticated, user, selectedFriend]);

  useEffect(() => {
    if (chatHistory) {
      setMessages(chatHistory);
    }
  }, [chatHistory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSendRequest = async (userId) => {
    try {
      await sendFriendRequest({ userId }).unwrap();
    } catch (error) {
      console.error('Failed to send friend request:', error);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await acceptFriendRequest({ requestId }).unwrap();
    } catch (error) {
      console.error('Failed to accept friend request:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedFriend) return;

    try {
      const message = await sendMessage({ receiverId: selectedFriend._id, content: newMessage }).unwrap();
      setMessages((prev) => [...prev, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (isFetchingProfile) {
    return (
      <div className="flex justify-center items-center h-screen dark:text-textDark text-textLight">
        <FaSpinner className="animate-spin text-3xl text-btn" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen dark:text-textDark text-textLight">
        <p className="text-xl mb-4">Please log in to access friends and chat.</p>
        <button
          className={`${styles.loginBtn}`}
          onClick={() => setIsAuthModalOpen(true)}
        >
          Log In
        </button>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    );
  }

  return (
    <div className="flex h-screen mt-16 mx-5 dark:bg-[#101018] bg-white">
      {socketError && (
        <div className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded">
          Socket Error: {socketError}
        </div>
      )}
      {/* Sidebar */}
      <div className="w-full md:w-1/3 lg:w-1/4 dark:bg-gray-800 bg-gray-100 rounded-xl p-4 flex flex-col">
        <div className="mb-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-textDark text-textLight border border-gray-300 dark:border-gray-600 focus:outline-none"
            />
          </div>
          {searchQuery && (
            <div className="mt-2 max-h-40 overflow-y-auto">
              {isFetchingSearch ? (
                <FaSpinner className="animate-spin text-xl text-btn mx-auto" />
              ) : searchResults?.length ? (
                searchResults.map((u) => (
                  <div key={u._id} className="flex items-center justify-between p-2 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md">
                    <div className="flex items-center">
                      <img
                        src={u.profilePicture || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg'}
                        alt={u.username}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <span>{u.username}</span>
                    </div>
                    <button
                      onClick={() => handleSendRequest(u._id)}
                      disabled={isSendingRequest || friends?.some(f => f._id === u._id)}
                      className="text-btn hover:text-blue-700 disabled:opacity-50"
                    >
                      <FaUserPlus />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No users found.</p>
              )}
            </div>
          )}
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Friend Requests</h3>
          {isFetchingRequests ? (
            <FaSpinner className="animate-spin text-xl text-btn mx-auto" />
          ) : friendRequests?.length ? (
            friendRequests.map((req) => (
              <div key={req._id} className="flex items-center justify-between p-2 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md">
                <div className="flex items-center">
                  <img
                    src={req.sender.profilePicture || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg'}
                    alt={req.sender.username}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span>{req.sender.username}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAcceptRequest(req._id)}
                    disabled={isAcceptingRequest}
                    className="text-green-500 hover:text-green-700"
                  >
                    <FaCheck />
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    <FaTimes />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No friend requests.</p>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-2">Friends</h3>
          {isFetchingFriends ? (
            <FaSpinner className="animate-spin text-xl text-btn mx-auto" />
          ) : friends?.length ? (
            friends.map((friend) => (
              <div
                key={friend._id}
                onClick={() => setSelectedFriend(friend)}
                className={`flex items-center p-2 cursor-pointer rounded-md ${
                  selectedFriend?.id === friend._id ? 'bg-gray-300 dark:bg-gray-600' : 'hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <img
                  src={friend.profilePicture || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg'}
                  alt={friend.username}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span>{friend.username}</span>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No friends yet.</p>
          )}
        </div>
      </div>
      {/* Chat Area */}
      <div className="flex-1 p-4 flex flex-col">
        {selectedFriend ? (
          <>
            <div className="flex items-center mb-4">
              <img
                src={selectedFriend.profilePicture || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg'}
                alt={selectedFriend.username}
                className="w-10 h-10 rounded-full mr-2"
              />
              <h2 className="text-xl font-semibold dark:text-textDark text-textLight">{selectedFriend.username}</h2>
            </div>
            <div className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
              {isFetchingChat ? (
                <FaSpinner className="animate-spin text-xl text-btn mx-auto" />
              ) : messages.length ? (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex mb-2 ${msg.sender._id === user.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-lg ${
                        msg.sender._id === user.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-300 dark:bg-gray-600 dark:text-textDark'
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p className="text-xs mt-1 ${msg.sender._id === user.id ? 'text-blue-200' : 'text-gray-400'}">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No messages yet.</p>
              )}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="mt-4 flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-3 rounded-l-lg bg-gray-200 dark:bg-gray-700 dark:text-textDark text-textLight border border-gray-300 dark:border-gray-600 focus:outline-none h-12"
              />
              <button
                type="submit"
                disabled={isSendingMessage || !newMessage.trim()}
                className={`${styles.loginBtn} rounded-l-none px-6 h-12 flex items-center justify-center`}
              >
                {isSendingMessage ? <FaSpinner className="animate-spin text-xl" /> : 'Send'}
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center dark:text-textDark text-textLight">
            <p className="text-xl">Select a friend to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Friends;