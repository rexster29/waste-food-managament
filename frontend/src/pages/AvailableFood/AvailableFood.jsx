import "./AvailableFood.css";
import Header from "../../common/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import axiosInstance from "../../services/axios";
import api from "../../utils/apiList";
import { formatDateAsDDMMYYYYHHMMSS } from "../../utils/utilityFunction";
import instance from "../../../env";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../../common/footer";
// import slider
import ShimmerUi from "../../common/ShimmerUi";
import { useLocation, useNavigate } from "react-router-dom";
import { encryptData } from "../../utils/encryption";
import { setFoodList } from "../../store/reducers/foodReducer";
import { useDispatch, useSelector } from "react-redux";
import { addData, fetchData } from "../../utils/indexedDBUtils";

const AvailableFood = () => {
    const [recordsCount, setRecordsCount] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [timeLimit, setTimeLimit] = useState("");
    const [distanceRange, setDistanceRange] = useState("");
    const [foodTypeChoice, setFoodTypeChoice] = useState("");
    const [foodDonationList, setFoodDonationList] = useState([]);
    const [filterOptions, setFilterOptions] = useState({});
    const user = useSelector((state) => state.auth.user);
    const [showRecentOptions, setShowRecentOptions] = useState(false);
    const [showItemTypeOptions, setShowItemTypeOptions] = useState(false);
    const [isLoding, setisLoding] = useState(false);
    const [userPosition, setUserPosition] = useState({
        latitude: "",
        longitude: "",
    });
    const [pincode, setPincode] = useState("");
    const location = useLocation();
    let searchTerm = new URLSearchParams(location.search).get("s") || "";
    let categoryId = new URLSearchParams(location.search).get("category") || "";
    const [category, setCategory] = useState(categoryId);
    const [givenReq, setGivenReq] = useState(searchTerm);
    // const [townCity, setTownCity] = useState('');
    const recentRef = useRef();
    const itemTypeRef = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const foodDonationStoreData = useSelector(
        (state) => state.food.foodDonationList
    );

    // API to fetch list of available food donations
    async function fetchAvailableFood(timeLimit = null, foodTypeChoice = null, user, givenReq, categoryId) {
        const data = (await fetchData(api.VIEW_FOOD_DONATION_LIST.url))?.data;
        console.log("data", data);
        let res;
        try {
            setisLoding(true);
            // fetch api data via api call or from local storage
            if (data) {
                console.log(1);
                res = {
                    data: {
                        foodDonationData: data,
                    },
                };
            } else {
                console.log(2);
                res = await axiosInstance.post(api.VIEW_FOOD_DONATION_LIST.url, {
                    page_size: recordsCount,
                    page_number: pageNumber,
                    timeLimit,
                    userLatitude: user?.latitude || 20.3010259,
                    userLongitude: user?.longitude || 85.7380521,
                    distanceRange,
                    foodType: foodTypeChoice,
                    categoryId: categoryId,
                    // givenReq: givenReq
                });
                console.log(
                    "Response of fetchAvailableFood API",
                    res.data.foodDonationData,
                    new Date().toISOString()
                );
                await addData({
                    id: api.VIEW_FOOD_DONATION_LIST.url,
                    data: res.data.foodDonationData,
                });
            }

            // if (pincode && pincode.length == 6) {
            //     let donationList = res.data.foodDonationData;
            //     donationList = donationList.filter((data) => {
            //         return JSON.stringify(data.address).toLowerCase().includes(Array.from(townCityList)[0].toLowerCase())
            //     });
            //     // console.log("donation list filtered by pincode", donationList);
            //     setFoodDonationList(donationList);
            // }
            // else {
            //     setFoodDonationList(res.data.foodDonationData);
            // }

            let donationList = [];
            if (res.data?.foodDonationData.length > 0) {
                if (categoryId && givenReq) {
                    donationList = res.data.foodDonationData.filter((item) => {
                        // console.log(item.foodName, item.address);
                        return (
                            item.categoryId == categoryId &&
                            (item?.foodName?.toLowerCase().includes(givenReq.toLowerCase()) ||
                                JSON.stringify(item.address)?.includes(givenReq))
                        );
                    });
                    setFoodDonationList(donationList);
                } else if (categoryId) {
                    donationList = res.data.foodDonationData.filter((item) => {
                        // console.log(item.foodName, item.address);
                        return item.categoryId == categoryId;
                    });
                    setFoodDonationList(donationList);
                } else if (givenReq) {
                    donationList = res.data.foodDonationData.filter((item) => {
                        // console.log(item.foodName, item.address);
                        return (
                            item?.foodName?.includes(givenReq) ||
                            JSON.stringify(item.address)?.includes(givenReq)
                        );
                    });
                    setFoodDonationList(donationList);
                } else {
                    donationList = res.data.foodDonationData;
                    setFoodDonationList(donationList);
                }
                dispatch(setFoodList(donationList));
                await addData({
                    id: api.VIEW_FOOD_DONATION_LIST.url,
                    data: donationList,
                });
            } else {
                setFoodDonationList([]);
                dispatch(setFoodList([]));
            }
            setisLoding(false);
        } catch (error) {
            if (foodDonationStoreData.length > 0) {
                setFoodDonationList(foodDonationStoreData);
            } else {
                setFoodDonationList([]);
            }
            console.error("Error while fetching available food", error);
            setisLoding(false);
        }
    }
    // API to fetch filter dropdown data
    async function fetchFilterDropdown() {
        const data = (await fetchData(api.INITIAL_FOOD_DROPDOWN_DATA.url))?.data;
        console.log("fetchFilterDropdown indexed DB", data);
        let res;
        try {
            if (data) {
                res = {
                    data: data,
                };
            } else {
                res = await axiosInstance.get(api.INITIAL_FOOD_DROPDOWN_DATA.url);
                console.log("Response of fetchFilterDropdown API", res.data);
            }
            setFilterOptions({
                timeRange: res.data.timeRange,
                distanceRange: res.data.distanceRange,
                foodType: res.data.foodType,
                category: res.data.findAllCategories,
            });
            await addData({ id: api.INITIAL_FOOD_DROPDOWN_DATA.url, data: res.data });
        } catch (error) {
            setFilterOptions({
                timeRange: res.data.timeRange,
                distanceRange: res.data.distanceRange,
                foodType: res.data.foodType,
                category: res.data.findAllCategories,
            });
            console.error("Error while fetching available food", error);
        }
    }

    // function getUserGeoLocation() {
    //     console.log("getUserGeoLocation");
    //     if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition(
    //             (position) => {
    //                 const { latitude, longitude } = position.coords;
    //                 setUserPosition({ latitude, longitude });
    //                 return;
    //             },
    //             (error) => {
    //                 console.log("error", error);
    //                 let response;
    //                 switch (error.code) {
    //                     case error.PERMISSION_DENIED:
    //                         console.error("User denied the request for Geolocation.");
    //                         response = {
    //                             success: 0,
    //                             error:
    //                                 "Location access denied. Please enable location services to use this feature.",
    //                         };
    //                         // alert('Location access denied. Please enable location services to use this feature.');
    //                         break;
    //                     case error.POSITION_UNAVAILABLE:
    //                         console.error("Location information is unavailable.");
    //                         response = {
    //                             success: 0,
    //                             error:
    //                                 "Location information is currently unavailable. Please try again later.",
    //                         };
    //                         // alert('Location information is currently unavailable. Please try again later.');
    //                         break;
    //                     case error.TIMEOUT:
    //                         console.error("The request to get user location timed out.");
    //                         response = {
    //                             success: 0,
    //                             error:
    //                                 "Request to access location timed out. Please try again.",
    //                         };
    //                         // alert('Request to access location timed out. Please try again.');
    //                         break;
    //                     default:
    //                         console.error("An unknown error occurred.");
    //                         response = {
    //                             success: 0,
    //                             error:
    //                                 "An unknown error occurred while accessing your location.",
    //                         };
    //                     // alert('An unknown error occurred while accessing your location.');
    //                 }
    //                 alert(response.error);
    //                 return;
    //             }
    //         );
    //     } else {
    //         console.error("Geolocation is not supported by this browser");
    //         let response = {
    //             success: 0,
    //             error: "Geolocation is not supported by this browser",
    //         };
    //         toast.error(response.error);
    //     }
    //     return;
    // }

    function debounce(fn) {
        let timeoutId;
        return function (...args) {
            timeoutId = setTimeout(() => fn(...args), 700);
        };
    }

    // async function fetchPincodeDetails(pincode) {
    //     try {
    //         console.log("pincode", pincode);
    //         if (pincode && pincode.length == 6) {
    //             let response = await axios.get(api.SEARCH_PLACE_BY_PINCODE.url + `${pincode}`);
    //             console.log("Response from pincode suggestion", response.data);
    //             let townCityList = new Set(response.data[0].PostOffice.map((data) => { return data.Division || data.District }));
    //             console.log("townCity", Array.from(townCityList)[0]);
    //             // setGivenReq(Array.from(townCityList)[0]);
    //             let donationList = Object.assign(foodDonationList);
    //             donationList = donationList.filter((data) => {
    //                 return JSON.stringify(data.address).toLowerCase().includes(Array.from(townCityList)[0].toLowerCase())
    //             });
    //             console.log("donation list filtered by pincode", donationList);
    //             setFoodDonationList(donationList);
    //         }
    //         else {
    //             console.error("pincode less than 6.");
    //         }
    //     }
    //     catch (error) {
    //         console.error("Error at fetchPincodeDetails API", error);
    //     }
    // }

    let debouncedFetchAvailableFood = useCallback(
        debounce(fetchAvailableFood),
        []
    );

    useEffect(() => {
        fetchAvailableFood();
        fetchFilterDropdown();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (recentRef.current && !recentRef.current.contains(event.target)) {
                setShowRecentOptions(false);
                setShowItemTypeOptions(false);
            }
            if (itemTypeRef.current && !itemTypeRef.current.contains(event.target)) {
                setShowRecentOptions(false);
                setShowItemTypeOptions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        // console.log({ timeLimit, foodTypeChoice, givenReq });
        debouncedFetchAvailableFood(timeLimit, foodTypeChoice, userPosition, givenReq, category);
    }, [timeLimit, foodTypeChoice, userPosition, givenReq, category]);

    // here Function to encryptDataid (Pass the Id)----------------------------------------------
    function encryptDataId(id) {
        let res = encryptData(id);
        return res;
    }

    // useNavigate

    return (
        <div className="main_container">
            <Header /> {/* Your header component */}
            <ToastContainer />
            <div className="content_wrapper">
                {/* Left Sidebar Filter */}
                <div className="filter_sidebar">
                    <ul className="filter_menu">
                        <li
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                            onClick={(e) => {
                                setCategory("");
                                setFoodTypeChoice('');
                                navigate(0);
                            }}
                        >
                            Clear All &nbsp; &nbsp;
                            <FontAwesomeIcon icon={faTrash} />
                        </li>
                        {filterOptions?.category?.length > 0 &&
                            filterOptions?.category.map((item, index) => {
                                if (category && category == item.categoryId) {
                                    return (
                                        <li
                                            key={index}
                                            className="selected"
                                            onClick={(e) => setCategory(item.categoryId)}
                                        >
                                            {item.description}
                                        </li>
                                    );
                                } else {
                                    return (
                                        <li
                                            key={index}
                                            onClick={(e) => setCategory(item.categoryId)}
                                        >
                                            {item.description}
                                        </li>
                                    );
                                }
                            })}
                    </ul>
                </div>

                {/* Right Side Grid Content */}

                <div className="grid_content_area">
                    {isLoding ? (
                        <ShimmerUi />
                    ) : foodDonationList?.length > 0 ? (
                        foodDonationList?.map((food, index) => (
                            <div
                                className="item_grid"
                                key={index}
                                onClick={() =>
                                    navigate(
                                        `/AvailableFoodDetails?foodListingId=${encryptDataId(
                                            food.foodListingId
                                        )}`
                                    )
                                }
                            >
                                {/* Image placeholder */}
                                <img
                                    className="item_image"
                                    src={`${instance().baseURL}/static${food.url}`}
                                ></img>
                                <div className="item_content">
                                    <h2 className="item_title">{food.foodName}</h2>
                                    <p className="text">
                                        {food.address
                                            ? food.address.townCity + ", " + food.address.state
                                            : "NA"}
                                    </p>
                                    <p className="text">
                                        Expiration date -{" "}
                                        {
                                            formatDateAsDDMMYYYYHHMMSS(food.expirationdate).split(
                                                " "
                                            )[0]
                                        }
                                    </p>
                                    {/* <p className="exp_date">
                                        <FontAwesomeIcon icon={faPhone} /> &nbsp;
                                        <a href={`tel: ${food.phoneNumber}`}>{food.phoneNumber}</a>
                                    </p>
                                    {/* <p
                                        className="map-location"
                                        onClick={() =>
                                            window.open(
                                                instance().GOOGLE_MAPS_BASE_URL +
                                                `&destination=${food.latitude},${food.longitude}`
                                            )
                                        }
                                    >
                                        <FontAwesomeIcon icon={faMapLocationDot} /> Direction in map
                                    </p> */}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>
                            <p>No donation available at the moment.</p>
                        </div>
                    )}
                    {/* Multiple Grid Items */}
                </div>
            </div>
            <Footer />
        </div>
    );
};
export default AvailableFood;
