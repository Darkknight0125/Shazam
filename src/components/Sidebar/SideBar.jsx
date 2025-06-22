import { sidbarItem } from '../../constants';
import SideBarList from './SideBarList';
import { styles } from '../../styles/styles';
import { useEffect, useState } from 'react';
import { DarkModeToggle } from '@anatoliygatt/dark-mode-toggle';
import { useSelector } from 'react-redux';
import AuthModal from '../auth/AuthModal';
import { FaSpinner } from 'react-icons/fa';
import logoImage from '../../assets/logoImage.png';
import logoImageDark from '../../assets/logoImageDark.png';

const SideBar = ({ openMenu, setOpenMenu, mode, setMode, isProfileSidebarOpen, setIsProfileSidebarOpen }) => {
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize(window.innerWidth);
    };
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  useEffect(() => {
    if (windowSize >= 1024) {
      setOpenMenu(true);
    } else {
      setOpenMenu(false);
    }
  }, [windowSize, setOpenMenu]);

  return (
    <div
      className={`${styles.sideBar} origin-left ${
        !openMenu && 'scale-x-0 hidden'
      } ${
        openMenu && 'fixed lg:sticky top-0 dark:bg-[#07070a] lg:dark:bg-transparent bg-screenLight z-[49]'
      } duration-300`}
    >
      <div
        className={`relative ${isProfileSidebarOpen ? 'blur-sm brightness-75 pointer-events-none' : ''}`}
      >
      <div className="flex items-center gap-2 mt-5 mb-3 pl-4 lg:hidden">
        <img
          src={mode === 'dark' ? logoImage : logoImageDark}
          alt="logo"
          className="w-[25px] h-[31.6px] sm:w-[30px] sm:h-[38px]"
        />
        <p className="text-[20px] font-extrabold">
          <span className="text-btn">SHAZAM</span>
        </p>
      </div>
      <div className={`lg:hidden flex ${!openMenu && 'hidden'} flex-col items-center`}>
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
    </div>
  </div>
  );
};

export default SideBar;