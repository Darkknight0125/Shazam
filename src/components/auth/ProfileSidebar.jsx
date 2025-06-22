import { useDispatch, useSelector } from 'react-redux';
import { useUpdateUsernameMutation, useUploadProfilePictureMutation } from '../../redux/services/authApi';
import { logout as logoutAction, updateUser } from '../../redux/slices/authSlice';
import { useState, useRef, useEffect } from 'react';
import { AiOutlineClose, AiOutlineEdit } from 'react-icons/ai';
import { FaSpinner } from 'react-icons/fa';
import { styles } from '../../styles/styles';
import { withRouter } from 'react-router-dom';

const ProfileSidebar = ({ isOpen, onClose, history }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [updateUsername, { isLoading: isUpdatingUsername }] = useUpdateUsernameMutation();
  const [uploadProfilePicture, { isLoading: isUploadingPicture }] = useUploadProfilePictureMutation();
  const fileInputRef = useRef(null);

  // Update local username state when user changes
  useEffect(() => {
    setUsername(user?.username || '');
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutAction());
    onClose();
    history.push('/');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const updatedProfile = await updateUsername({ username }).unwrap();
      const user = updatedProfile.user; 
      dispatch(updateUser({
        id: user.id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture || null,
      }));
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update username:', err);
    }
  };
  

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append('profilePicture', file);
  
    try {
      const updatedProfile = await uploadProfilePicture(formData).unwrap();
      const user = updatedProfile.user;
      dispatch(updateUser({
        id: user.id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture || null,
      }));
    } catch (err) {
      console.error('Failed to upload profile picture:', err);
    }
  };
  

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-[300px] dark:bg-[#101018] bg-white p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold dark:text-textDark text-textLight">Profile</h2>
          <AiOutlineClose
            className="text-2xl cursor-pointer dark:text-textDark text-textLight"
            onClick={onClose}
          />
        </div>
        {user ? (
          <div className="flex flex-col gap-4">
            <div className="relative self-center">
              <img
                src={user.profilePicture || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg'}
                alt="Profile"
                className="w-24 h-24 rounded-full"
              />
              <div className="absolute bottom-0 right-0">
                {isUploadingPicture ? (
                  <FaSpinner className="animate-spin text-2xl text-btn" />
                ) : (
                  <AiOutlineEdit
                    className="text-2xl cursor-pointer text-btn bg-white dark:bg-gray-800 rounded-full p-1"
                    onClick={triggerFileInput}
                    title="Edit Profile Picture"
                  />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleProfilePictureUpload}
              />
            </div>
            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter Username"
                  className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 dark:text-textDark text-textLight border border-gray-300 dark:border-gray-600"
                  required
                />
                <button
                  type="submit"
                  disabled={isUpdatingUsername}
                  className={`${styles.loginBtn} w-full`}
                >
                  {isUpdatingUsername ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <p className="text-center text-lg font-semibold dark:text-textDark text-textLight">
                  {user.username || 'Loading...'}
                </p>
                <p className="text-center dark:text-textDark text-textLight">
                  {user.email || ''}
                </p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-btn hover:underline"
                >
                  Edit Username
                </button>
              </>
            )}
            <button
              onClick={handleLogout}
              className={`${styles.loginBtn} w-full mt-4`}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <FaSpinner className="animate-spin text-3xl text-btn" />
          </div>
        )}
      </div>
    </div>
  );
};

export default withRouter(ProfileSidebar);