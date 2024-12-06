import "./AvailableFoodDetails.css"
import Header from "../../common/Header";
import Footer from "../../common/footer";
import { useState, useEffect } from "react";
import axiosInstance from "../../services/axios";
import { decryptData, encryptData } from "../../utils/encryption";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../../utils/apiList";
import instance from "../../../env";
import { formatDateAsDDMMYYYYHHMMSS } from "../../utils/utilityFunction";
// toast -------------
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const AvailableFoodDetails = () => {
    const [isPopupOpen, setisPopupOpen] = useState(false)
    // get data of itemByid
    const [getDataById, setgetDataById] = useState([])
    const foodListingId = decryptData(new URLSearchParams(location.search).get("foodListingId"))
    // filter data
    const [FilteredDonationData, setFilteredDonationData] = useState([])
    // get initail data in drop down ---------
    const[initailData, setinitailData]=useState([])
    // Contact Us ----
    const [contactUs, setcontactUs] = useState({
        name: '',
        mobileNo: '',
        userType: '',
        emailId: '',
        donorEmail: ''
    });
    const navigate = useNavigate();

    //get data --------------
    async function GetitemDataById(foodListingId) {
        console.log("decypt food list id", foodListingId);
        try {
            let res = await axiosInstance.get(`${api.VIEW_FOOD_DONATION_BY_ID.url}/${foodListingId}`)
            const data=res.data.fetchFoodListingDetails[0]
            setgetDataById(data)
            console.log("here Response of GetitemDataById", res.data.fetchFoodListingDetails[0]);
            const categoryId = data.categoryId;
            GetDataByList(categoryId, data.foodListingId)
            setcontactUs({...contactUs, ["donorEmail"]: data.email});
          console.log("Extracted categoryId:", categoryId);
        } catch (err) {
            console.log("Error : Response of GetItemDataById", err);
        }
    }
    // ByList Api ------------
    async function GetDataByList(categoryId, foodListingId) {
        console.log("categoryId", categoryId);
        try {
       
            let res = await axiosInstance.post(api.VIEW_FOOD_DONATION_LIST.url)

            const filterData = res.data.foodDonationData.filter((item) => { return item.categoryId === categoryId && item.foodListingId != foodListingId });
            setFilteredDonationData(filterData);
            console.log("here Response of get data By List ", res);

        } catch (err) {
            console.log("throw error of GetDataByList", err);
        }
    }
    //handle Submit ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setcontactUs(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
   // handle drop down data
   const handleDropDownChange=(e)=>{
    // set roleid to userTypeid
    setcontactUs(prevState => ({
        ...prevState,
        userType: e.target.value // Set selected roleId to userType
      })); 
   }

    // call Api for Post the Contact us data --------------------
    async function PostData(e) {
        e.preventDefault()
        try {
            let res = await axiosInstance.post(api.REQUEST_CONTACT.url, {
                name: contactUs.name,
                emailId: contactUs.emailId,
                mobileNo: contactUs.mobileNo,
                userType:contactUs.userType,
                donorEmail:contactUs.donorEmail
            });
            toast.success("Thank you for reaching out! Our team will get back to you shortly.");
            console.log("Response of Post Conact us Data", res);
            navigate(0);
        } catch (err) {
            toast.error("Oops! Something went wrong. Please try again.");
            console.log("here Error handler", err);
        }
    }
    // const get the initail data ------------------------
    async function GetInitailData() {
        try {
            let res = await axiosInstance.get(api.USER_INITIALDATA.url)
            setinitailData(res.data.roles.filter((role) => {return role.roleName != "Donor"}))
            console.log("Resoponse of get intailData", res);

        } catch (err) {
            console.log("Error Response of Get Intail Data", err)
        }
    }

    function showDonationDetails(e, data) {
        e.preventDefault();
        e.stopPropagation();
        if(data) {
            navigate(`/AvailableFoodDetails?foodListingId=${encryptData(data.foodListingId)}`);
            navigate(0);
        }
        else {
            return;
        }
    }
    //   useEffect for Update the data
    useEffect(() => {
        GetInitailData()
        GetitemDataById(foodListingId);
        // GetDataByList()
    }, [])

    // handle Popup(Open)
    const handleOpenPopup = () => {
        setisPopupOpen(true)
    }
    // handle Popup (Close)
    const handleClosePopup = () => {
        setisPopupOpen(false)
    }

    return (
        <div className="main_container_item_details">
            <Header />
            <ToastContainer/>
            <div className="product-container">
                <div className="image-section">
                    <img src={`${instance().baseURL}/static${getDataById.url}`} ></img>
                </div>
                <div className="details-section">
                    <h2>{getDataById.foodName}</h2>
                    <ul className="product-details">
                        <li> <strong>{getDataById.foodCategoryName}</strong></li>
                        <li><strong>Quantity:</strong>&nbsp; {getDataById.quantity} {getDataById.unitName}</li>
                        <li><strong>Expiration Date: </strong>&nbsp; {formatDateAsDDMMYYYYHHMMSS(getDataById.expirationdate)}</li>

                    </ul>
                    {/* <p className="description">Skin Cutting software with CAMEO 4 Cutting Plotter model, you can cut up to 12-inch width, and in roll format skins...</p> */}
                    <button className="button-9" onClick={handleOpenPopup}>Contact</button>
                </div>

            </div>
            <div className="product-container1">
                <p className="p_tag_similar">Find Similar More Donation:</p>
                <div className="product_card_item" >
                    {FilteredDonationData?.length > 0 && FilteredDonationData?.map((item, index) => (
                        <div className="item_card" key={index} onClick={(e) => showDonationDetails(e, item)}>
                            <img src={`${instance().baseURL}/static${item.url}`} alt="Product Image" className="product-image" />
                            <p className="product-name">{item.foodName}</p>
                            <h8>Address: {item.address.townCity}</h8><br />
                            <h8>Expiration Date:&nbsp;{formatDateAsDDMMYYYYHHMMSS(item.expirationdate)}</h8>
                        </div>
                    ))}
                    {
                        FilteredDonationData.length == 0 &&
                        <div>There's no data to display.</div>
                    }
                </div>
            </div>
            {/* Popup component */}
            {isPopupOpen && (
                <form onSubmit={PostData}>
                    <div className="popup-overlay">
                        <div className="popup-content">
                            <h3>Contact Us</h3>
                            <p>Feel free to reach out for more information .</p>
                            <label>Name</label>
                            <input type="text" name="name" id="name"
                                value={contactUs.name}
                                onChange={handleChange}
                                placeholder="Your Name" />
                            <label>Email_Id</label>
                            <input type="email" name="emailId" id="emailId"
                                value={contactUs.emailId}
                                onChange={handleChange}
                                placeholder="Your Email" />
                            <label>Mobile Number</label>
                            <input type="text" name="mobileNo" id="mobileNo"
                                value={contactUs.mobileNo}
                                onChange={handleChange}
                                placeholder="Your Phone Number" />
                              
                                              
                                <select className="custom_dropdown"
                                name="userType"
                                value={contactUs.userType}
                                 onChange={handleDropDownChange} >
                                    <option value={""}>Select</option>
                                    {initailData?.map((item)=>(
                                        <option key={item.roleId} value={item.roleId}>{item.roleName}</option>  
                                    ))}
                                </select>
                          

                            <div className="button_close_submit">
                                <button className="button-9" role="button">Submit</button>
                                <button className="button-42" role="button" onClick={handleClosePopup}>Close</button>
                            </div>
                        </div>
                    </div>
                </form>

            )}
            <Footer />
        </div>
    )
}
export default AvailableFoodDetails;