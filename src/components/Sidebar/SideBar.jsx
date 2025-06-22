import { sidbarItem } from '../../constants';
import SideBarList from './SideBarList';
import { styles } from '../../styles/styles';
import { MdMenu, MdMenuOpen } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { DarkModeToggle } from '@anatoliygatt/dark-mode-toggle';
import { useSelector } from 'react-redux';
import AuthModal from '../auth/AuthModal';
import ProfileSidebar from '../auth/ProfileSidebar';
import { FaSpinner } from 'react-icons/fa';

const SideBar = ({ openMenu, setOpenMenu, mode, setMode }) => {
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  useEffect(() => {
    if (windowSize[0] >= 1024) {
      setOpenMenu(true);
    } else {
      setOpenMenu(false);
    }
  }, [windowSize]);

  return (
    <div
      className={`${styles.sideBar} origin-left ${
        !openMenu && 'scale-x-0 fixed'
      } ${
        openMenu && 'fixed lg:sticky dark:bg-[#07070a] lg:dark:bg-transparent bg-screenLight'
      } duration-300 z-[52]`}
    >
      <div className="lg:hidden" onClick={() => setOpenMenu(!openMenu)}>
        {openMenu && (
          <MdMenuOpen className="text-[27px] mt-10 mx-10 cursor-pointer text-btn" />
        )}
      </div>
      <div className={`lg:hidden flex ${!openMenu && 'hidden'} flex-col`}>
        {isAuthenticated ? (
          user ? (
            <button
              className={`${styles.loginBtn2} mx-5 my-5`}
              onClick={() => setIsProfileSidebarOpen(true)}
            >
              PROFILE
            </button>
          ) : (
            <div className="flex justify-center mx-5 my-5">
              <FaSpinner className="animate-spin text-2xl text-btn" />
            </div>
          )
        ) : (
          <button
            className={`${styles.loginBtn2} mx-5 my-5`}
            onClick={() => setIsAuthModalOpen(true)}
          >
            LOG IN
          </button>
        )}
        <div className="mx-2">
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
      </div>
      <div>
        <SideBarList subTitle="MENU" items={sidbarItem} menu={openMenu} />
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <ProfileSidebar
        isOpen={isProfileSidebarOpen}
        onClose={() => setIsProfileSidebarOpen(false)}
      />
    </div>
  );
};

export default SideBar;