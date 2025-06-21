import { useDispatch, useSelector } from 'react-redux';
import { useGetProfileQuery } from '../../redux/services/authApi';
import { logout as logoutAction } from '../../redux/slices/authSlice';
import { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { styles } from '../../styles/styles';
import { withRouter } from 'react-router-dom';

const ProfileSidebar = ({ isOpen, onClose, history }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { data: profile, isLoading, error } = useGetProfileQuery(undefined, {
    skip: !isOpen,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(profile?.username || '');

  const handleLogout = () => {
    dispatch(logoutAction());
    onClose();
    history.push('/');
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    // Implement profile update API call if needed
    setIsEditing(false);
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
        {isLoading ? (
          <p className="text-center dark:text-textDark text-textLight">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">Error loading profile</p>
        ) : (
          <div className="flex flex-col gap-4">
            <img
              src={profile?.profilePicture || 'https://via.placeholder.com/100'}
              alt="Profile"
              className="w-24 h-24 rounded-full self-center"
            />
            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 dark:text-textDark text-textLight border border-gray-300 dark:border-gray-600"
                />
                <button
                  type="submit"
                  className={`${styles.loginBtn} w-full`}
                >
                  Save
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
                  {profile?.username || user?.username}
                </p>
                <p className="text-center dark:text-textDark text-textLight">
                  {profile?.email || user?.email}
                </p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-btn hover:underline"
                >
                  Edit Profile
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
        )}
      </div>
    </div>
  );
};

export default withRouter(ProfileSidebar);