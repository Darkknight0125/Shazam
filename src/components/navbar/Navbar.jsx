import { DarkModeToggle } from '@anatoliygatt/dark-mode-toggle';
import { MdMenu, MdMenuOpen } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { styles } from '../../styles/styles';
import logoImage from '../../assets/logoImage.png';
import logoImageDark from '../../assets/logoImageDark.png';
import Search from './Search';
import AuthModal from '../auth/AuthModal';
import ProfileSidebar from '../auth/ProfileSidebar';
import { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';

const Navbar = ({ isSearch, setIsSearch, mode, setMode, openMenu, setOpenMenu, isProfileSidebarOpen, setIsProfileSidebarOpen }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="flex justify-between pt-3 mx-3 md:mx-7">
      <div className="flex self-center justify-center">
        <div
          className="self-center"
          onClick={() => setOpenMenu(!openMenu)}
        >
          {openMenu ? (
            <MdMenuOpen className="text-[27px] mt-4 sm:mx-3 cursor-pointer text-btn" />
          ) : (
            <MdMenu className="text-[27px] mt-4 sm:mx-3 cursor-pointer hover:text-btn duration-200" />
          )}
        </div>
        <div className="self-center font-extrabold sm:mx-3 mt-4 flex min-w-[145px] sm:min-w-[150px]">
          <img
            src={mode === 'dark' ? logoImage : logoImageDark}
            alt="logoImage"
            className="w-[25px] h-[31.6px] sm:w-[30px] sm:h-[38px] mx-1"
          />
          <p className="self-center text-[18px] sm:text-[21px]">
            <span className="text-btn">SHAZAM</span>
          </p>
        </div>
      </div>
      <Search isSearch={isSearch} setIsSearch={setIsSearch} />
      <div className="self-center z-20 flex items-center">
        <div className="self-center mx-2 lg:mx-2 hidden lg:block">
          <DarkModeToggle
            mode={mode}
            dark="dark"
            light="light"
            size="sm"
            inactiveTrackColor="#e2e8f0"
            inactiveTrackColorOnHover="#f8fafc"
            inactiveTrackColorOnActive="#cbd5e1"
            activeTrackColor="#334155"
            activeTrackColorOnHover="#1e293b"
            activeTrackColorOnActive="#0f172a"
            inactiveThumbColor="#1e293b"
            activeThumbColor="#e2e8f0"
            onChange={(mode) => setMode(mode)}
          />
        </div>
        {isAuthenticated ? (
          <div className="relative">
            {user ? (
              <img
                src={user.profilePicture || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg'}
                alt="Profile"
                className="w-8 h-8 lg:w-10 lg:h-10 rounded-full cursor-pointer"
                onClick={() => setIsProfileSidebarOpen(true)}
              />
            ) : (
              <FaSpinner className="animate-spin text-2xl text-btn" />
            )}
          </div>
        ) : (
          <button
            className={`${styles.loginBtn} text-sm lg:text-base px-3 lg:px-4 py-1 lg:py-2`}
            onClick={() => setIsAuthModalOpen(true)}
          >
            LOG IN
          </button>
        )}
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <ProfileSidebar
        isOpen={isProfileSidebarOpen}
        onClose={() => setIsProfileSidebarOpen(false)}
        key={user?.id || 'nouser'}
        setOpenMenu={setOpenMenu}
      />
    </div>
  );
};

export default Navbar;