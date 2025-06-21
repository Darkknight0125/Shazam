import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSignupMutation, useLoginMutation } from '../../redux/services/authApi';
import { setCredentials } from '../../redux/slices/authSlice';
import { styles } from '../../styles/styles';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const [signup, { isLoading: isSigningUp }] = useSignupMutation();
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      let result;
      if (isLogin) {
        result = await login({
          email: formData.email,
          password: formData.password,
        }).unwrap();
      } else {
        result = await signup({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }).unwrap();
      }
      // Assuming the API returns { token, user }
      dispatch(setCredentials({ token: result.token, user: result.user }));
      onClose();
    } catch (err) {
      setError(err.data?.message || 'An error occurred');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="dark:bg-[#101018] bg-white rounded-2xl p-6 w-[90%] max-w-md">
        <h2 className="text-2xl font-bold text-center dark:text-textDark text-textLight mb-4">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="p-3 rounded-lg bg-gray-200 dark:bg-gray-800 dark:text-textDark text-textLight border border-gray-300 dark:border-gray-600 focus:outline-none"
              required
            />
          )}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="p-3 rounded-lg bg-gray-200 dark:bg-gray-800 dark:text-textDark text-textLight border border-gray-300 dark:border-gray-600 focus:outline-none"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="p-3 rounded-lg bg-gray-200 dark:bg-gray-800 dark:text-textDark text-textLight border border-gray-300 dark:border-gray-600 focus:outline-none"
            required
          />
          <button
            type="submit"
            disabled={isSigningUp || isLoggingIn}
            className={`${styles.loginBtn} w-full`}
          >
            {isSigningUp || isLoggingIn ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center mt-4 dark:text-textDark text-textLight">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <span
            className="text-btn cursor-pointer hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
        <button
          onClick={onClose}
          className="mt-4 w-full text-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AuthModal;