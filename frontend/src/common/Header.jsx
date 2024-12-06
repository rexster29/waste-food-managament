import React, { useEffect, useRef, useState } from "react";
import "./Header.css"; // Import the CSS file for styling
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/soul_share.svg";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faRightFromBracket, faSearch, faUser } from "@fortawesome/free-solid-svg-icons";
import { logout } from "../store/reducers/authReducer";
import axiosInstance from "../services/axios";
import api from "../utils/apiList";
import { toast } from "react-toastify";
import googlePlayStore from "../assets/google-play.svg";
import appleStore from "../assets/apple.svg";
import { addData, fetchData } from "../utils/indexedDBUtils";
import useOnlineStatus from "../services/useOnlineStatus";


const Header = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [givenReq, setGivenReq] = useState('');
  const [categoryList, setCategoryList] = useState([]);
  const [itemCategory, setItemCategory] = useState('');
  const [displayAppLink, setDisplayAppLink] = useState(false);
  let location = useLocation();
  const appDisplayContainer = useRef();
  const isOnline = useOnlineStatus();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  async function logoutUser(e) {
    e.preventDefault();
    try {
      let res = await axiosInstance.post(api.LOGOUT.url);
      console.log("response of log out API", res);
      dispatch(logout());
      toast.success("Logged out successfully!", {
        autoClose: 1500,
        onClose: () => {
          setTimeout(() => {
            navigate("/");
            sessionStorage.clear();
            localStorage.clear();
          }, 500);
        }
      });
    } catch (error) {
      console.error("error in log out api", error);
    }
  }

  async function fetchCategoryList() {
    try {
      let data = (await fetchData(api.INITIAL_FOOD_DROPDOWN_DATA.url))?.data;
      if (data) {  // if api data is locally stored, then fetch
        console.log("fetch from indexed Db: ", data);
        setCategoryList(data.findAllCategories);
      }
      else {  // if api data not present in local storage, then fetch
        let response = await axiosInstance.get(api.INITIAL_FOOD_DROPDOWN_DATA.url);
        console.log("fetchCategoryList", response.data);
        setCategoryList(response.data.findAllCategories);
        await addData({ id: api.INITIAL_FOOD_DROPDOWN_DATA.url, data: response.data });
      }
    }
    catch (error) {
      setCategoryList(data.findAllCategories);
      console.log("Error at fetchCategoryList", error);
    }
  }

  function handleNavigation(e) {
    // console.log("handle navigation");
    if (user) {
      navigate("/DonorDetails");
    } else {
      toast.error("Kindly log in or register first!");
    }
  }

  function handleSearch(e) {
    let searchLink = '/AvailableFood';
    if (givenReq && !itemCategory) {
      searchLink += `?s=${givenReq}`;
    }
    else if (itemCategory && !givenReq) {
      searchLink += `?category=${itemCategory}`;
    }
    else if (givenReq && itemCategory) {
      searchLink += `?s=${givenReq}&category=${itemCategory}`
    }
    else {
      return;
    }
    navigate(searchLink);
  }

  function handleDisplayAppLink(e) {
    e.preventDefault();
    setDisplayAppLink(true);
    return;
  }

  useEffect(() => {
    fetchCategoryList();
    // Request notification permission
    // if ('Notification' in window && navigator.serviceWorker) {
    //   Notification.requestPermission().then((permission) => {
    //     if (permission === 'granted') {
    //       console.log('Notification permission granted.');
    //     } else {
    //       console.log('Notification permission denied.');
    //     }
    //   });
    // }

    // Cleanup interval on unmount
    return () => {
      // console.log("Clearing notification interval...");
      // clearInterval(intervalId);
    };
  }, []);

  // const fetchNotifications = async () => {
  //   console.log('Fetching notifications...');
  //   try {
  //     const response = await axios.post(api.VIEW_FOOD_DONATION_LIST.url + `?t=${Date.now()}`, {
  //       randomKey: Math.random()
  //     });
  //     const data = response.data;
  //     console.log('Fetched Notifications:', data);

  //     // Ensure data.message exists before sending it
  //     if (data.message && navigator.serviceWorker && navigator.serviceWorker.controller) {
  //       navigator.serviceWorker.controller.postMessage({
  //         type: 'NOTIFICATIONS',
  //         id: Date.now(),
  //         url: '',
  //         data: data?.message, // Assuming data.message is a string or similar
  //       });
  //     } else {
  //       console.error('Service worker controller is not available or data.message is undefined.');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching notifications:', error);
  //   }
  // };

  return (
    <header className="header">
      <div className="offline-header">
        {
          !isOnline && <p className="offline-text">You are in offline mode.</p>
        }
      </div>
      <div className="header__container">
        <div className="header__logo">
          <img className="app_logo" src={Logo} onClick={(e) => { user ? navigate('/') : navigate('/') }} />
        </div>
        {
          // !user &&
          <div className="header_search_bar">
            <div className="search_categories">
              <select value={itemCategory} onChange={(e) => setItemCategory(e.target.value)}>
                <option value={""}>Select categories</option>
                {
                  categoryList?.length > 0 && categoryList.map((item, index) => {
                    return (
                      <option key={index} value={item.categoryId}>{item.description}</option>
                    )
                  })
                }
              </select>
            </div>
            <div className="search_field">
              <input type="text" value={givenReq} onChange={(e) => setGivenReq(e.target.value)} />
              <button onClick={handleSearch}><FontAwesomeIcon icon={faSearch} /></button>
            </div>
          </div>
        }
        <nav className={`header__nav ${isSidebarOpen ? "open" : ""}`}>
          <ul className="header__nav-list">
            {location.pathname != '/' && <li className="header__nav-item">
              <Link onClick={handleDisplayAppLink}>
                Get the App
              </Link>
            </li>}
            <li className="header__nav-item">
              {!user && <Link to={user ? "/DonorLandingPage" : "/"}>Home</Link>}
            </li>
            <li className="header__nav-item">
              {/* {!user && ( */}
              <Link
                to={user ? "/DonorDetails" : ""}
                onClick={handleNavigation}
              >
                Donate Now
              </Link>
              {/* )} */}
            </li>

            {user && (
              <li className="header__nav-item">
                <Link to={"/DonateHistory"}>Donation History</Link>
              </li>
            )}
            <li className="header__nav-item">
              <Link to={"/About"}>About</Link>
            </li>
            <li className="header__nav-item">
              {!user && (
                <Link className="Login_button" to={"/Login"}>
                  Login
                </Link>
              )}
              {
                user && <li className="header__nav-item header-profile-container">
                  <FontAwesomeIcon icon={faUser} className="icon_profile" />
                  <ul className="profile-submenu">
                    <li>
                      <Link to="/profile">View Profile</Link>
                    </li>
                    {/* <li>
                      <Link to="/settings">Settings</Link>
                    </li> */}
                    <li className="logout" onClick={logoutUser}>
                      <FontAwesomeIcon icon={faRightFromBracket} /> Logout
                    </li>
                  </ul>
                </li>
              }
            </li>
          </ul>
        </nav>
        <div className="header__hamburger" onClick={toggleSidebar}>
          <span
            className="header__hamburger-line"
            onClick={toggleSidebar}
          ></span>
          <span
            className="header__hamburger-line"
            onClick={toggleSidebar}
          ></span>
          <span
            className="header__hamburger-line"
            onClick={toggleSidebar}
          ></span>
        </div>
        {
          // !user &&
          <div className="header_search_bar_mobile">
            <div className="search_categories">
              <select>
                <option value={""}>Select categories</option>
                <option value={"Food"}>Food</option>
                <option value={"Clothes"}>Clothes</option>
              </select>
            </div>
            <div className="search_field">
              <input type="text" value={givenReq} onChange={(e) => setGivenReq(e.target.value)} />
              <button onClick={handleSearch}><FontAwesomeIcon icon={faSearch} /></button>
            </div>
          </div>
        }
      </div>
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <button className="sidebar__close" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faClose} size="sm" />
        </button>
        <ul className="sidebar__list">
          {
            location.pathname != '/' &&
            <li className="sidebar__item">
              <Link onClick={(e) => { setSidebarOpen(false); handleDisplayAppLink(e); }}>
                Get the App
              </Link>
            </li>
          }
          <li className="sidebar__item">
            {!user && <Link to={user ? "/DonorLandingPage" : "/"}>Home</Link>}
          </li>
          <li className="sidebar__item">
            {/* {!user && ( */}
            <Link to={user ? "/DonorDetails" : ""} onClick={handleNavigation}>
              Donate Now
            </Link>
            {/* )} */}
          </li>

          {user && (
            <li className="sidebar__item">
              <Link to={"/DonateHistory"}>Donation History</Link>
            </li>
          )}
          <li className="sidebar__item">
            {" "}
            <Link to={"/About"}>About</Link>
          </li>
          <li className="sidebar__item">
            {!user && (
              <Link className="Login_button" to={"/Login"}>
                Login
              </Link>
            )}
            {user && (
              <Link className="Login_button" onClick={logoutUser} to={"/"}>
                <FontAwesomeIcon icon={faRightFromBracket} />
                &nbsp; Logout
              </Link>
            )}
          </li>
        </ul>
      </div>
      {
        displayAppLink &&
        <>
          <div className="overlay-container" />
          <div ref={appDisplayContainer} className="header-mobile-app-link">
            <div onClick={(e) => { setDisplayAppLink(false); appDisplayContainer.current.style.display = 'none'; }}><FontAwesomeIcon icon={faClose} size="xl" /></div>
            <div><h5>Your Small Act, Their Big Change. Donate via App!🥰</h5></div>
            <div className="app-photo-display"></div>
            <div className="app-icons">
              <a><img src={googlePlayStore} /></a>
              <a><img src={appleStore} /></a>
            </div>
          </div>
        </>
      }
    </header>
  );
};

export default Header;
