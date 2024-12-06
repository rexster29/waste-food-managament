import React, { useState, useEffect } from "react";
import "./Registration.css";
import Regd_image from "../../assets/Regd_image.png";
import profile_image from "../../assets/profileImgLogo.png";
import tokenService from "../../services/token.service";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/axios";
import api from "../../utils/apiList";
import { useLocation, useNavigate } from "react-router-dom";
import { faLocationCrosshairs } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { decryptData } from "../../utils/encryption";

function Registration() {
  const location = useLocation();
  const userRole = decryptData(new URLSearchParams(location.search).get('userType'));
  console.log("userRole", userRole);
  const [profileImg, setProfileImg] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    location: {
      latitude: "",
      longitude: "",
    },
    landmark: "",
    userType: userRole || "",
    userImage: "",
    termsAccepted: false,
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [userTypeList, setUserTypeList] = useState([]);

  function getUserGeoLocation() {
    console.log("getUserGeoLocation");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData({
            ...formData,
            ["location"]: { latitude, longitude },
          });
          return;
        },
        (error) => {
          console.log("error", error);
          let response;
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.error("User denied the request for Geolocation.");
              response = {
                success: 0,
                error:
                  "Location access denied. Please enable location services to use this feature.",
              };
              // alert('Location access denied. Please enable location services to use this feature.');
              break;
            case error.POSITION_UNAVAILABLE:
              console.error("Location information is unavailable.");
              response = {
                success: 0,
                error:
                  "Location information is currently unavailable. Please try again later.",
              };
              // alert('Location information is currently unavailable. Please try again later.');
              break;
            case error.TIMEOUT:
              console.error("The request to get user location timed out.");
              response = {
                success: 0,
                error:
                  "Request to access location timed out. Please try again.",
              };
              // alert('Request to access location timed out. Please try again.');
              break;
            default:
              console.error("An unknown error occurred.");
              response = {
                success: 0,
                error:
                  "An unknown error occurred while accessing your location.",
              };
            // alert('An unknown error occurred while accessing your location.');
          }
          alert(response.error);
          return;
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser");
      let response = {
        success: 0,
        error: "Geolocation is not supported by this browser",
      };
      toast.error(response.error);
    }
    return;
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name == "location") {
      const res = getUserGeoLocation();
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
    console.log("formData", formData);
  };

  const handleProfileImgChange = (e) => {
    let image = e.target.files[0];
    console.log("image", image);
    if (parseInt(image.size / 1024) <= 500) {
      setProfileImg(URL.createObjectURL(e.target.files[0]));
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = () => {
        setFormData({
          ...formData,
          ["userImage"]: reader.result,
        });
      };
    } else {
      toast.dismiss();
      toast.error("Choose an image with size less than 500 KB.");
    }
  };

  const handleProfileImgRemove = () => {
    setProfileImg(null);
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.firstName) formErrors.firstName = "First Name is required";
    if (!formData.lastName) formErrors.lastName = "Last Name is required";
    if (!formData.phoneNumber)
      formErrors.phoneNumber = "Phone Number is required";
    else if (!/^\d{10}$/.test(formData.phoneNumber))
      formErrors.phoneNumber = "Phone Number must be 10 digits";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email))
      formErrors.email = "Email is invalid";
    if (!formData.termsAccepted)
      formErrors.termsAccepted = "You must accept the terms and conditions";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      let modifiedData = {
        ...formData,
        name: formData.firstName + " " + formData.lastName,
        latitude: formData.latitude,
        longitude: formData.longitude,
        userImage: formData.userImage || null
      };
      delete modifiedData.firstName;
      delete modifiedData.lastName;
      delete modifiedData.location;

      try {
        let res = await axiosInstance.post(api.SIGNUP.url, modifiedData);
        console.log("response of sign up API", res.data);
        toast.success("Profile created successfully. Kindly login.", {
          autoClose: 1500,
          onClose: () => {
            setTimeout(() => {
              navigate("/Login");
            }, 500);
          }
        });
      } catch (error) {
        console.error("error of sign up api", error);
      }
    }
  };

  async function fetchUserTypeList() {
    try {
      let res = await axiosInstance.get(api.USER_INITIALDATA.url);
      console.log("response of fetchUserTypeList", res.data.roles);
      setUserTypeList(res.data.roles);
    } catch (error) {
      console.error("error while fetching user type list", error);
    }
  }

  useEffect(() => {
    // fetch user type list
    fetchUserTypeList();
  }, []);

  return (
    <div className="registrationContainer">
      <ToastContainer />
      <div className="formSection">
        <div className="info">
          <div className="leftInfo">Input your information</div>
          <div className="rightInfo">
            We need you to help us with some basic information for your account
            creation. Here are our <a className="tac"> terms and conditions</a>.
            Please read them carefully.
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="profilePhotoSection">
            <label htmlFor="profileImgUpload" className="profileLabel">
              {profileImg ? (
                <img src={profileImg} alt="Profile" className="profileImage" />
              ) : (
                <div className="profilePlaceholder">
                  <img
                    src={profile_image}
                    alt="Default Profile"
                    className="defaultProfileIcon"
                  />
                  <button
                    type="button"
                    className="uploadProfileImg"
                    onClick={() =>
                      document.getElementById("profileImgUpload").click()
                    }
                  >
                    Upload Profile Picture
                  </button>
                </div>
              )}
            </label>
            <input
              type="file"
              id="profileImgUpload"
              style={{ display: "none" }}
              onChange={handleProfileImgChange}
              accept="image/*"
            />
            {profileImg && (
              <button
                type="button"
                className="removeProfileImg"
                onClick={handleProfileImgRemove}
              >
                Remove
              </button>
            )}
          </div>

          <div className="flexContainer">
            <div className="inputRow">
              <div className="inputGroup">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
                {errors.firstName && (
                  <span className="error">{errors.firstName}</span>
                )}
              </div>
              <div className="inputGroup">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
                {errors.lastName && (
                  <span className="error">{errors.lastName}</span>
                )}
              </div>
            </div>

            <div className="inputRow">
              <div className="inputGroup">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
                {errors.phoneNumber && (
                  <span className="error">{errors.phoneNumber}</span>
                )}
              </div>
              <div className="inputGroup">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>
            </div>

            <div className="inputRow">
              <div className="inputGroup">
                <label htmlFor="location">Location</label>
                <button
                  name="location"
                  type="button"
                  className={`locationButton ${formData.location.latitude ? 'active' : ''}`}
                  onClick={handleInputChange}
                >
                  <FontAwesomeIcon icon={faLocationCrosshairs} /> &nbsp;
                  {formData.location.latitude ? 'Location captured' : 'Use my location'}
                </button>
                {/* <input
                  type="text"
                  id="location"
                  name="location"
                  value={
                    formData.location.latitude
                      ? formData.location.latitude +
                        ", " +
                        formData.location.longitude
                      : ""
                  }
                  onClick={handleInputChange}
                  readOnly={true}
                  // onChange={handleInputChange}
                /> */}
              </div>
              <div className="inputGroup">
                <label htmlFor="landmark">Landmark</label>
                <input
                  type="text"
                  id="landmark"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* for Donors */}
          <div className="userTypeSection">
            <label>Sign in as</label>
            <div className="userTypeButtons">
              {userTypeList.map((userType, index) => {
                return (
                  <button
                    key={index}
                    type="button"
                    className={
                      formData.userType == userType.roleId ? "selected" : ""
                    }
                    onClick={() =>
                      setFormData({ ...formData, userType: userType.roleId })
                    }
                  >
                    {userType.roleName}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="termsAndProceed">
            <div className="termsCheckbox">
              <input
                type="checkbox"
                id="termsAccepted"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleInputChange}
              />
              <label htmlFor="termsAccepted">
                &nbsp;Accept terms and conditions
              </label>
              {errors.termsAccepted && (
                <span className="error">{errors.termsAccepted}</span>
              )}
            </div>
            <button type="submit" className="proceedButton">
              Proceed
            </button>
          </div>
        </form>
      </div>

      <div className="imageSection">
        <img src={Regd_image} alt="Registration" />
      </div>
    </div>
  );
}

export default Registration;
