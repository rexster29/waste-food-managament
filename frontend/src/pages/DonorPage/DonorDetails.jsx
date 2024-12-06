import "./DonorDetails.css";
import Header from "../../common/Header";
import Donor_image from "../../assets/Donor_details_image.png";
import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../services/axios";
import api from "../../utils/apiList";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../../common/footer";
import { useNavigate } from "react-router-dom";
import instance from "../../../env";

const DonorDetails = () => {
    // Initialize state ---------
    const [DonorType, setDonorType] = useState([]);
    const [getUnit, setgetUnit] = useState([]);
    const [showError, setshowError] = useState('')
    const [DonorData, setDonorData] = useState({
        foodName: "",
        foodCategory: "",
        quantity: "",
        unit: "",
        expirationDate: new Date().toISOString().split("T")[0],
        imageData: "",
        address: {
            building: "",
            area: "",
            landmark: "",
            pincode: "",
            townCity: "",
            state: "",
            country: ""
        },
        categoryId: ""
    });
    const [categoryList, setCategoryList] = useState([]);
    const navigate = useNavigate();

    // Function to handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDonorData(prevState => ({
            ...prevState,
            [name]: value
        }));
        setshowError(prevState => ({
            ...prevState, [name]: ''
        }))
        console.log("DonorData", DonorData);
    };
    // Function to handle address input changes
    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setDonorData(prevState => ({
            ...prevState,
            address: {
                ...prevState.address,
                [name]: value
            }
        }));
    };
    // handle Upload Image (in base 64) ------
    const handleImageChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            const file = files[0]
            // check the size of file
            if ((file.size / 1024) <= 450) {
                const reader = new FileReader();
                reader.onload = () => {
                    const base64Image = reader.result;
                    console.log("image ", base64Image);
                    setDonorData({
                        ...DonorData, imageData: base64Image //Update imageData
                    });
                };
                reader.readAsDataURL(file)
            } else {
                alert("file size acceeds 450 KB.!")
            }
        }
    }

    // Get initial donor type and unit data
    async function GetDonorType() {
        try {
            let res = await axiosInstance.get(api.INITIAL_FOOD_DROPDOWN_DATA.url);
            setDonorType(res.data.foodType);
            setgetUnit(res.data.unitsData);
            setCategoryList(res.data.findAllCategories);
            console.log("Response of initial data", res);
        } catch (err) {
            console.log("Error getting initial data GetDonorType", err);
        }
    }
    // Auto suggestion of address based on pincode
    async function AutoSugestion(pincode) {
        try {
            let res = await axios.get(api.SEARCH_PLACE_BY_PINCODE.url + `${pincode}`);
            console.log("Response from pincode suggestion", res.data[0].PostOffice[0]);
            const postOfficeData = res.data[0].PostOffice[0];
            console.log("Pincode auto-suggestion response", postOfficeData);

            // Update address in DonorData
            setDonorData(prevState => ({
                ...prevState,
                address: {
                    ...prevState.address,
                    pincode: pincode,
                    townCity: postOfficeData.Division || postOfficeData.District,
                    state: postOfficeData.State,
                    country: postOfficeData.Country,
                    building: prevState.address.building, // Preserve manually entered values
                    area: prevState.address.area,
                    landmark: prevState.address.landmark
                }
            }));
        } catch (err) {
            console.log("Error in auto-suggestion", err);
        }
    }

    // Handle pincode input change
    const handlePincode = (e) => {
        const value = e.target.value;
        setDonorData(prevState => ({
            ...prevState,
            address: {
                ...prevState.address,
                pincode: value
            }
        }));
        // if (value.length === 6) { // Assuming pincode length is 6
        //     AutoSugestion(value);
        // }
    };

    function debounce(fn, delay) {
        let timeoutId;
        return function (...args) {
            timeoutId = setTimeout(() => {
                fn(...args)
            }, [])
        }
    }

    let debouncedFetchPincodeDetails = useCallback(debounce(AutoSugestion, 1000), []);

    // Fetch donor type on component mount
    useEffect(() => {
        // GetDonorType();
        if (DonorData.address.pincode && DonorData.address.pincode.length == 6) {
            debouncedFetchPincodeDetails(DonorData.address.pincode)
        }
    }, [DonorData.address.pincode, debouncedFetchPincodeDetails, DonorData.categoryId]);

    useEffect(() => {
        GetDonorType();
    }, [])

    // Post donor data to backend
    async function PostDonorData(e) {
        e.preventDefault()
        console.log("post donor data");
        const Error = DonorValidation(DonorData)
        if (Object.keys(Error).length > 0) {
            setshowError(Error) // set error state
            return
        }
        try {
            let res = await axiosInstance.post(api.ADD_FOOD_DONATION.url, {
                foodItemsArray: [
                    {
                        foodName: DonorData.foodName,
                        foodCategory: DonorData.foodCategory,
                        quantity: DonorData.quantity,
                        unit: DonorData.unit,
                        expirationDate: DonorData.expirationDate,
                        imageData: DonorData.imageData,
                        address: DonorData.address,
                        categoryId: DonorData.categoryId
                    }
                ]
            });
            console.log("Response of Donor Data", res);
            toast.success(res.data.message, {
                autoClose: 1000,
                onClose: () => {
                    setTimeout(() => {
                        navigate('/DonateHistory');
                    }, 500)
                }
            })
        } catch (err) {
            console.log("Donor Response Error", err);
        }
    }

    // Validation of donor item--------------------
    const DonorValidation = (value) => {
        console.log("donor validation");
        const err = {};
        const checkSpecialChar = /^(?!\s*$)[a-zA-Z0-9,-\s]*$/;
        const UnitCheck = /^(?!0$)(?!0\.[0]*$)([1-9]\d*|0\.[1-9]\d*)$/;
        // here is the regex code ..
        const RegexPincode = /^\d{6}$/;
        const Addresspattern = /^(?!\s*$)[\w\s,.\-\/]+$/;
        const foodRegex = /^[A-Za-z&',.-][A-Za-z\s&',.-]*$/;


        if (!value.foodName) {
            err.foodName = "Please enter item name";
        }
        else if(!foodRegex.test(value.foodName)) {
            err.foodName = "Please enetr valid item name."
        }
        if (!value.foodCategory) {
            err.foodCategory = "Please select a item category"
        }
        if (!value.quantity) {
            err.quantity = "Please enter quantity"
        } else if (!UnitCheck.test(value.quantity)) {
            err.quantity = "Please enter valid quantity (cannot be zero and no special characters)";
        }
        if (!value.unit) {
            err.unit = "Please select a unit"
        }
        if (!value.expirationDate) {
            err.expirationDate = "Please select a expirationDate"
        }
        if (!value.address.building) {
            err.building = "Please enter flat,house No, sector"
        } else if (!Addresspattern.test(value.address.building)) {
            err.building = "Please enter vaild flat,house No, sector"
        }
        if (!value.address.area) {
            err.area = "Please enter area"
        } else if (!Addresspattern.test(value.address.area)) {
            err.area = "Please enter vaild area"
        }
        if (value.address.landmark) {
            if (!Addresspattern.test(value.address.landmark)) {
                err.landmark = "Please enter vaild landmark"
            }
        }

        if (!value.address.pincode) {
            err.pincode = "Please enter pincode"
        } else if (!RegexPincode.test(value.address.pincode)) {
            err.pincode = "Please enter valid pincode (6 digit number)";
        }
        return err;
    }

    return (
        <div className="main_conatiner_donor_details">
            <Header />
            <ToastContainer />
            <div className="Child_container_donor_details">
                <div className="form_conainer">
                    <h1>Donation Details</h1>
                    <form className="form_conatiner_form" onSubmit={PostDonorData}>
                        <span className="input_text_conatiner">
                            <label>Item Name</label>
                            <input
                                type="text"
                                name="foodName"
                                placeholder="Enter Item Name"
                                value={DonorData.foodName}
                                onChange={handleChange}
                            />
                            {showError.foodName && <span className="error_msg">{showError.foodName} </span>}
                        </span>
                        <span className="input_text_conatiner1">
                            <label htmlFor="foodType">Category*</label>
                            <select
                                id="categoryId"
                                name="categoryId"
                                value={DonorData.categoryId}
                                onChange={handleChange}
                            >
                                <option value="">Select Item Category</option>
                                {categoryList?.length > 0 && categoryList.map((item, index) => (
                                    <option key={index} value={item.categoryId}>
                                        {item.description}
                                    </option>
                                ))}
                            </select>
                            {showError.foodCategory && <span className="error_msg">{showError.foodCategory} </span>}
                        </span>
                        <span className="input_text_conatiner1">
                            <label htmlFor="foodType">Sub Category*</label>
                            <select
                                id="foodType"
                                name="foodCategory"
                                value={DonorData.foodCategory}
                                onChange={handleChange}
                            >
                                <option value="">Select Sub Category</option>
                                {DonorType?.length > 0 && DonorType.map((item, index) => {
                                    if(parseInt(DonorData.categoryId) == parseInt(item.categoryId)) {
                                        return (
                                            <option key={index} value={item.foodCategoryId}>
                                                {item.foodCategoryName}
                                            </option>
                                        );
                                    } 
                                })}
                            </select>
                            {showError.foodCategory && <span className="error_msg">{showError.foodCategory} </span>}
                        </span>

                        <span className="input_text_conatiner">
                            <label>Select Quantity*</label>
                            <input
                                type="text"
                                name="quantity"
                                placeholder="Enter Quantity"
                                value={DonorData.quantity}
                                onChange={handleChange}
                            />
                            {showError.quantity && <span className="error_msg">{showError.quantity} </span>}
                        </span>
                        <span className="input_text_conatiner1">
                            <label htmlFor="foodType">Select Unit*</label>
                            <select
                                id="foodType"
                                name="unit"
                                value={DonorData.unit}
                                onChange={handleChange}
                            >
                                <option value="">Select unit</option>
                                {getUnit?.length > 0 && getUnit.map((item, index) => (
                                    <option key={index} value={item.unitId}>
                                        {item.unitName}
                                    </option>
                                ))}
                            </select>
                            {showError.unit && <span className="error_msg"> {showError.unit}</span>}
                        </span>
                        <span className="input_text_conatiner">
                            <label>Expiry Date*</label>
                            <input
                                type="date"
                                name="expirationDate"
                                value={DonorData.expirationDate}
                                onChange={handleChange}
                                min={new Date().toISOString().split("T")[0]}
                            />
                            {showError.expirationDate && <span className="error_msg"> {showError.expirationDate}</span>}
                        </span>
                        <span className="input_text_conatiner">
                            <label>Item Photo*</label>
                            <input type="file"
                                onChange={handleImageChange}
                                accept="image/*"
                                capture="environment"
                            />
                        </span>

                        <div className="Address_form">
                            <label className="ads_name">Flat, House No, Sector</label>
                            <input
                                type="text"
                                name="building"
                                placeholder="Flat, House No, Sector"
                                value={DonorData.address.building}
                                onChange={handleAddressChange}
                            />
                            {showError.building && <span className="error_msg">{showError.building} </span>}
                            <label className="ads_name">Landmark</label>
                            <input
                                type="text"
                                name="landmark"
                                placeholder="Landmark"
                                value={DonorData.address.landmark}
                                onChange={handleAddressChange}
                            />
                            {showError.landmark && <span className="error_msg">{showError.landmark}</span>}
                            <label className="ads_name">Area</label>
                            <input
                                type="text"
                                name="area"
                                placeholder="Area"
                                value={DonorData.address.area}
                                onChange={handleAddressChange}
                            />
                            {showError.area && <span className="error_msg">{showError.area}</span>}
                            <div className="ads_two_input">
                                <div className="input_group">
                                    <label>Pincode</label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={DonorData.address.pincode}
                                        onChange={handlePincode}
                                        placeholder="Pin Code"
                                    />
                                    {showError.pincode && <span className="error_msg">{showError.pincode}</span>}
                                </div>

                                <div className="input_group">
                                    <label>Town/City</label>
                                    <input
                                        type="text"
                                        name="townCity"
                                        value={DonorData.address.townCity}
                                        onChange={handleAddressChange}
                                        placeholder="Town/City"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="ads_two_input">
                                <div className="input_group">
                                    <label>State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={DonorData.address.state}
                                        onChange={handleAddressChange}
                                        placeholder="State"
                                        disabled
                                    />
                                </div>
                                <div className="input_group">
                                    <label>Country</label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={DonorData.address.country}
                                        onChange={handleAddressChange}
                                        placeholder="Country"
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>

                        <span className="input_text_conatiner11">
                            <button type="submit" className="send_Req_button" onClick={PostDonorData}>Submit</button>
                        </span>
                    </form>
                </div>
                <div className="donor_image">
                    <img src={Donor_image} alt="Donor Image" />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DonorDetails;
