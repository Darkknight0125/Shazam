import { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";
import NavBar from "./components/navbar/Navbar";
import SideBar from "./components/Sidebar/SideBar";
import Explore from "./pages/Explore";
import Genres from "./pages/genres/Genres";
import MoviesByGenre from "./pages/genres/MoviesByGenre";
import MoviePage from "./pages/moviePage/MoviePage";
import MoviesPage from "./pages/moviesPage/MoviesPage";
import SeriesPage from "./pages/seriesPage/SeriesPage";
import Friends from "./pages/friends/Friends";
import "./styles/globalStyles.css";
import { useGetProfileQuery } from './redux/services/authApi';
import { setCredentials, logout } from './redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { FaSpinner } from "./common/icons";

const App = () => {
  const [isSearchItemsShow, setIsSearchItemsShow] = useState(false);
  const [mode, setMode] = useState(() => localStorage.getItem('theme') || 'dark');
  const [openMenu, setOpenMenu] = useState(false);
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const token = localStorage.getItem('authToken');
  const user = useSelector((state) => state.auth.user);

  const { data: profile, isSuccess, isError, isLoading } = useGetProfileQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (isSuccess && profile?.user) {
      const { id, username, email, profilePicture } = profile.user;
      dispatch(setCredentials({
        token,
        user: {
          id,
          username,
          email,
          profilePicture: profilePicture || null,
        },
      }));
    } else if (isError) {
      console.error('Failed to fetch profile on app load:', isError);
      dispatch(logout());
    }
  }, [isSuccess, isError, profile, token, dispatch]);

  useEffect(() => {
    localStorage.setItem('theme', mode);
    if (mode === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, [mode]);

  if (token && (isLoading || (!profile && !isError))) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-3xl text-btn" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div
        onClick={() => setIsSearchItemsShow(false)}
        className={`${
          !isSearchItemsShow && "hidden"
        } fixed z-40 w-full h-full bg-black backdrop-blur-sm dark:bg-opacity-60 bg-opacity-25 `}
      />
      <div
        onClick={() => setOpenMenu(false)}
        className={`${
          !openMenu && "hidden"
        } fixed z-[48] w-full h-full bg-black lg:hidden backdrop-blur-sm dark:bg-opacity-70 bg-opacity-25`}
      />
      <div
        className={`dark:text-textDark text-textLight ${
          mode === "dark" ? "gradient-06" : "lightTheme"
        }`}
      >
        <NavBar
          key={user?.id || 'nouser'}
          isSearch={isSearchItemsShow}
          setIsSearch={setIsSearchItemsShow}
          setMode={setMode}
          mode={mode}
          openMenu={openMenu}
          setOpenMenu={setOpenMenu}
          isProfileSidebarOpen={isProfileSidebarOpen}
          setIsProfileSidebarOpen={setIsProfileSidebarOpen}
        />
        <div className="flex">
          <SideBar
            mode={mode}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
            setMode={setMode}
            isProfileSidebarOpen={isProfileSidebarOpen}
            setIsProfileSidebarOpen={setIsProfileSidebarOpen}
          />
          <div className="w-full flex flex-col">
            <Switch>
              <Route path={"/series"} component={() => <SeriesPage />} />
              <Route path={"/movies/:id"} exact component={() => <MoviePage />} />
              <Route path={"/genres/:id"} exact component={() => <MoviesByGenre />} />
              <Route path={"/movies"} exact component={() => <MoviesPage />} />
              <Route path={"/genres"} exact component={() => <Genres />} />
              <Route path={"/friends"} exact component={() => <Friends />} />
              <Route path={"/"} exact component={() => <Explore />} />
            </Switch>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;