import React, { useState, useEffect } from "react";
import "./Profile.css";
import profile_image from "../../assets/profileImgLogo.png";
import Regd_image from "../../assets/Regd_image.png";
import axiosInstance from "../../services/axios";
import api from "../../utils/apiList";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import instance from "../../../env";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../common/Header";
import Footer from "../../common/footer";

const Profile = () => {
  const [profileImg, setProfileImg] = useState(null);
  const [profileImgChanged, setProfileImgChanged] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    fileId: "",
    userImage: null,
    userType: ''
  });
  const [errors, setErrors] = useState({});
  const [isPhotoUpdated, setIsPhotoUpdated] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log(`Changed ${name}:`, value); // Log input changes
  };

  const handleProfileImgChange = (e) => {
    const image = e.target.files[0];
    if (image.size <= 500 * 1024) {
      const imgURL = URL.createObjectURL(image);
      setProfileImg(imgURL);
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, userImage: reader.result }));
        setIsPhotoUpdated(true);
        console.log("Updated userImage:", reader.result); // Log updated image data
      };

    } else {
      toast.error("Choose an image with size less than 500 KB.");
    }
  };

  const handleProfileImgRemove = () => {
    setProfileImg(null);
    setFormData((prev) => ({ ...prev, userImage: null }));
    // setIsPhotoUpdated(false);
    setProfileImgChanged(true);
    console.log("Profile image removed."); // Log when image is removed
  };

  const fetchUserProfile = async () => {
    try {
      const { data } = await axiosInstance.get(api.VIEW_PROFILE.url);
      console.log("Response of profile data: ", data);
      const { name, phoneNumber, email, url, fileId, roleName } = data.public_user[0];
      const [firstName, lastName] = name.split(" ");
      setFormData({
        firstName,
        lastName,
        phoneNumber,
        email,
        fileId,
        userImage: url ? `${instance().baseURL}/static/${url}` : null,
        userType: roleName
      });
      setProfileImg(url ? `${instance().baseURL}/static/${url}` : null);
    } catch (error) {
      toast.error("Error fetching profile data.");
    }
  };

  const validateForm = () => {
    const formErrors = {};
    if (!formData.firstName) formErrors.firstName = "First Name is required";
    if (!formData.lastName) formErrors.lastName = "Last Name is required";
    if (!formData.phoneNumber)
      formErrors.phoneNumber = "Phone Number is required";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email))
      formErrors.email = "Email is invalid";
    setErrors(formErrors);
    return !Object.keys(formErrors).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {

      let userImage = {};

      if (profileImgChanged && isPhotoUpdated) {
        console.log("here data", formData.userImage);
        userImage = { fileId: formData.fileId, data: formData.userImage };
        console.log("photo response 2:  ", formData.fileId);
      }
      else if (profileImgChanged) {
        userImage = { fileId: formData.fileId };
        console.log("photo response 3:  ", formData.fileId);
      }
      else if (isPhotoUpdated) {
        console.log("here data", formData.userImage);
        userImage = { fileId: 0, data: formData.userImage };
        console.log("photo response 4:  ", formData.fileId);
      }
      else if (!isPhotoUpdated) {
        userImage = {};
        console.log("photo response 1:  ", formData.fileId);
      }


      const updatedData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        userImage,
        phoneNumber: formData.phoneNumber,
        address: {},
      };

      console.log("Submitting updated profile data:", updatedData); // Log the data being submitted

      try {
        const response = await axiosInstance.put(
          api.UPDATE_PROFILE.url,
          updatedData
        );
        console.log("Profile updated successfully. Response:", response.data); // Log the response after update
        toast.success("Profile updated successfully!");
      } catch (error) {
        console.error(
          "Error updating profile:",
          error.response?.data || error.message
        );
        toast.error("Error updating profile.");
      }
    } else {
      console.log("Validation failed. Errors:", errors); // Log validation errors if any
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <>
      <Header />
      <div className="profile-container">
        <div className="profile-form-section">
          <h2 className="profile-header">Edit Your Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="profile-photo-section">
              <label htmlFor="profileImgUpload" className="profile-image-label">
                {profileImg ? (
                  <img src={profileImg} alt="Profile" className="profile-image" />
                ) : (
                  <div className="profile-placeholder">
                    <img
                      src={profile_image}
                      alt="Default Profile"
                      className="default-profile-icon"
                    />
                    <button
                      type="button"
                      className="upload-button"
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
                  className="remove-button"
                  onClick={handleProfileImgRemove}
                >
                  Remove
                </button>
              )}
            </div>
            <div className="profile-flex-container">
              <div className="profile-input-row">
                <div className="profile-input-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                  {errors.firstName && (
                    <span className="profile-error">{errors.firstName}</span>
                  )}
                </div>
                <div className="profile-input-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                  {errors.lastName && (
                    <span className="profile-error">{errors.lastName}</span>
                  )}
                </div>
              </div>
              <div className="profile-input-row">
                <div className="profile-input-group">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                  {errors.phoneNumber && (
                    <span className="profile-error">{errors.phoneNumber}</span>
                  )}
                </div>
                <div className="profile-input-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    readOnly
                  />
                </div>
              </div>
              <div className="profile-input-row">
                <div className="profile-input-group">
                  <label htmlFor="email">Access type</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.userType}
                    onChange={handleInputChange}
                    readOnly
                  />
                </div>
              </div>
            </div>
            <button type="submit" className="profile-submit-button">
              Update Profile
            </button>
          </form>
        </div>
        <img src={Regd_image} alt="Registration" className="registration-image" />
        <ToastContainer />
      </div>
      <Footer />
    </>
  );
};

export default Profile;
