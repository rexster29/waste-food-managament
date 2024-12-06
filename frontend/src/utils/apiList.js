import instance from "../../env";
const baseURL = instance().baseURL;
const api = {
  ADD_FOOD_DONATION: {
    url: baseURL + "/food/addFoodDonationRequest",
    method: "post",
    /**
     * in req.body
     * 1. foodItemsArray [Object]:-
     *      foodItemsArray = [{ foodName, foodCategory, quantity, unit, expirationDate, imageData }, ...]
     * 2. receiverId integer
     * 3. address = {building: area: landmark: pincode: townCity: state:}
     *
     */
  },
  INITIAL_FOOD_DROPDOWN_DATA: {
    url: baseURL + "/food/initialData",
    method: "get",
    /**
     * for timeRange and distanceRange, send the option's value
     * for foodType, send the option's id
     */
  },
  VIEW_FOOD_DONATION_LIST: {
    url: baseURL + "/food/viewFoodDonationList",
    method: "post",
    /**
     * in req.body - page_size, page_number, timeLimit, userLatitude, userLongitude, distanceRange, foodType, givenReq
     */
  },
  VIEW_FOOD_DONATION_BY_ID: {
    url: baseURL + "/food/viewFoodDonationById",
    method: "get",
    /**
     * in req.params - foodListingId
     */
  },
  CLOSE_FOOD_DONATION: {
    url: baseURL + "/food/closeFoodDonation",
    method: "put",
    /**
     * in req.body - foodListingId
     */
  },
  LOGIN_CREATE_OTP: {
    url: baseURL + "/auth/createOtp",
    method: "post",
    /**
     * req body - encryptMobile
     */
  },
  LOGIN_WITH_OTP: {
    url: baseURL + "/auth/loginWithOTP",
    method: "post",
    /**
     * req body - encryptMobile, encryptOtp
     */
  },
  LOGIN_WITH_GOOGLE: {
    url: baseURL + "/auth/loginWithOAuth",
    method: "post",
    /**
     * googleTokenId, userType
     */
  },
  LOGOUT: {
    url: baseURL + "/auth/logout",
    method: "post",
  },
  SIGNUP: {
    url: baseURL + "/auth/signup",
    method: "post",
    /**
     * name, email, phoneNumber, longitude, latitude, userType, userImage
     */
  },
  USER_INITIALDATA: {
    url: baseURL + "/auth/initialData",
    method: "get",
  },
  REFRESH_TOKEN: {
    url: baseURL + "/auth/refresh-token",
    method: "post",
  },
  SEARCH_PLACE_BY_PINCODE: {
    url: "https://api.postalpincode.in/pincode/",
    method: "get",
  },
  DONATION_HISTORY: {
    url: baseURL + "/food/donationHistory",
    method: "post",
    /**
     * page_size, page_number
     */
  },
  VIEW_PROFILE: {
    url: baseURL + "/auth/viewUserProfile",
    method: "get",
  },
  UPDATE_PROFILE: {
    url: baseURL + "/auth/updateProfile",
    method: "put",
    // {"name":"jk",
    //     "email":"kh@gmail.com",
    //     "userImage":{"fileId":7,
    //     "data":"fjdljfdjldjldfj"}
    //     phoneNumber:9800909090,
    //     address:{}
    //     }
  },
  REQUEST_CONTACT: {
    url: baseURL + "/food/contactDonor",
    method: "post",
    /**
     * name, mobileNo, userType, emailId
     */
  },
  CONTACT_US: {
    url: baseURL + "/activity/contact-us",
    method: "post",
    /**
     * firstName, lastName, email, phoneNumber, message
     */
  },
  REGISTER_VOLUNTEER: {
    url: baseURL + "/auth/registerVolunteer",
    method: "post",
    /**
     * name, phoneNumber, email, city, pincode, verificationDocId, docFile (file as base64 encoded), 
     * timeOfDay (in array of IDs), weekDay (in array of IDs), userImage
     */
  },
  VIEW_VOLUNTEER_PROFILE_DATA: {
    url: baseURL + "/auth/viewVolunteerProfile",
    method: "get",
  },
  UPDATE_VOLUNTEER_PROFILE_DATA: {
    url: baseURL + "/auth/updateVolunteerProfile",
    method: 'put',
    /**
     * name, phoneNumber, email, city, pincode, verificationDocId, docFile {fileId: '', data: ''} (file as base64 encoded), 
     * timeOfDay (in array of IDs), weekDay (in array of IDs), userImage: {fileId: '', data: ''}
     */
  }
};

export default api;