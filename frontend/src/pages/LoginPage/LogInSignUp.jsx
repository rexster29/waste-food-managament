import React, { useState, useEffect } from "react";
import "./LogInSignUp.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../../services/axios";
import api from "../../utils/apiList";
import { encryptData, decryptData } from "../../utils/encryption";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../store/reducers/authReducer";
import tokenService from "../../services/token.service";
import { useGoogleLogin } from '@react-oauth/google';
import axios from "axios";
import googleIcon from "../../assets/google_icon.png";

function LogInSignUp() {
  const [userType, setUserType] = useState("Donor");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [userTypeList, setUserTypeList] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // asunc func to fetch user types
  async function fetchInitialUserData() {
    try {
      let res = await axiosInstance.get(api.USER_INITIALDATA.url);
      console.log("Response at fetchInitialUserData", res.data.roles);
      setUserTypeList(res.data.roles);  // maintain user types list after api call
      setUserType(res.data.roles[0].roleId);  // default set first user type from the list
    }
    catch (error) {
      console.error("Error at fetchInitialUserData", error);
    }
  }

  // Handles the radio button change for user type
  const handleUserTypeChange = (event, roleId) => {
    event.preventDefault();
    console.log("handleUserTypeChange", roleId);
    setUserType(roleId);
  };

  // Handles the phone number input change
  const handlePhoneNumberChange = (event) => {
    let { value } = event.target;
    value = value.replace(/\D/g, ''); //remove any characters other than digits
    if (value.length == 1 && value == 0) { // dont allow first character as 0
      value = "";
    }
    value = value.replace(/^([1-9]{1}\d{9}).*/, '$1');  //regex to check if the number is valid: 10 digits and starts with 1-9
    setPhoneNumber(value);
  };

  // Handles OTP input change
  const handleOtpChange = (event) => {
    let { value } = event.target;
    value = value.replace(/\D{6}/g, ''); //remove any characters other than digits
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  // Simulates sending OTP
  const handleGetOtp = async () => {
    if (!phoneNumber) {
      return;
    }
    try {
      let res = await axiosInstance.post(api.LOGIN_CREATE_OTP.url, {
        encryptMobile: encryptData(phoneNumber)
      });
      console.log("response of get otp api", res.data);
      sessionStorage.setItem('check', encryptData(res.data.otp));
      setOtpSent(true);
      setTimer(60);
      toast.success(res.data.message, {
        autoClose: 700
      });
    }
    catch (error) {
      console.error('otp generation failed!', error);
      toast.error(error.response.data.message);
    }
  };

  // Handles OTP verification (you can add real verification logic here)
  const handleVerifyOtp = async () => {
    // alert(`Verifying OTP: ${otp}`);
    try {
      let res = await axiosInstance.post(api.LOGIN_WITH_OTP.url, {
        encryptMobile: encryptData(phoneNumber), encryptOtp: encryptData(otp)
      });
      console.log("response of verify otp api", res.data);
      let checkOTP = (sessionStorage.getItem('check')) == encryptData(otp);
      console.log("checkOTP", checkOTP);
      if(!checkOTP) {
        toast.error("Incorrect OTP!");
        return;
      }
      if (res.data.decideSignUpOrLogin) {
        dispatch(login(res.data.user));
        tokenService.setUser(res.data.user);
        toast.dismiss();
        toast.success("Login successful!", {
          autoClose: 500,
          onClose: () => {
            setTimeout(() => {
              navigate('/DonorDetails');
            }, 100);
          }
        })
      }
      else {
        toast.dismiss();
        toast.success("Please create your profile.", {
          autoClose: 800,
          onClose: () => {
            setTimeout(() => {
              navigate(`/Registration?userType=${encryptData(userType)}`);
            }, 500);
          }
        })
      }
    }
    catch (error) {
      console.error("OTP Verification failed!", error);
    }
  };

  // Function to handle Google OAuth login
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const { access_token } = tokenResponse;
        console.log({ access_token });
        // Fetch Google profile information
        // const googleUser = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        //   headers: {
        //     Authorization: `Bearer ${access_token}`,
        //   },
        // });
        // console.error("googleuser.data", googleUser.data);
        // Extract user information from Google response
        // const { email, name, picture } = googleUser.data;

        // Call your own API to verify if the user exists
        const response = await axios.post(api.LOGIN_WITH_GOOGLE.url, { googleTokenId: access_token, userType: userType });
        console.log("LOGIN_WITH_GOOGLE response", response.data);

        if (response.data.decideSignUpOrLogin) {
          tokenService.setUser(response.data.user);
          dispatch(login(response.data.user));
          toast.success('Login successful', {
            autoClose: 1500,
            onClose: () => {
              setTimeout(() => {
                navigate('/DonorDetails');
              }, 500)
            }
          })
        }
        else {
          toast.success('Please create profile.', {
            autoClose: 1500,
            onClose: () => {
              setTimeout(() => {
                navigate(`/Registration?userType=${encryptData(userType)}`);
              }, 500)
            }
          })
        }
      } catch (error) {
        console.error('Error during Google login:', error);
      }
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });

  // Timer effect for OTP expiration countdown
  useEffect(() => {
    if (otpSent && timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(countdown);
    } else if (timer === 0) {
      setOtpSent(false);
      setOtp("");
    }
  }, [otpSent, timer, userType]);

  useEffect(() => {
    fetchInitialUserData();
  }, []);


  return (
    <div className="logInSignUpContainer">
      <div className="log_p">
        <div className="headers_P">
          <h1>Login / SignUp to Your Account</h1>
          <p>
            A simple act of donating can have a profound impact on someone's life.
          </p>
          <div className="logInType">
            <h3>Login/SignUp as a </h3>
            <div className="radiobutton">
              {
                userTypeList?.length > 0 && userTypeList?.map((user, index) => {
                  if(userType == user.roleId){
                    return (
                      <div key={index} className="insideRadioButton">
                        <input
                          type="radio"
                          id="donor"
                          checked={userType == user.roleId}
                          onChange={(e) => handleUserTypeChange(e, user.roleId)}
                          className={userType == user.roleId ? "greenText" : ""}
                        />
                        <label
                          htmlFor="donor"
                          className={userType == user.roleId ? "greenText" : ""}
                        >
                          {user.roleName}
                        </label>
                      </div>
                    )
                  }
                  else {
                    return (
                      <div key={index} className="insideRadioButton">
                        <input
                          type="radio"
                          id="donor"
                          checked={userType == user.roleId}
                          onChange={(e) => handleUserTypeChange(e, user.roleId)}
                          // className={userType == user.roleId ? "greenText" : ""}
                        />
                        <label
                          htmlFor="donor"
                          // className={userType == user.roleId ? "greenText" : ""}
                        >
                          {user.roleName}
                        </label>
                      </div>
                    )
                  }
                })
              }
              {/* <div className="insideRadioButton">
                <input
                  type="radio"
                  id="charity"
                  value="Charity"
                  checked={userType === "Charity"}
                  onChange={handleUserTypeChange}
                  className={userType === "charity" ? "greenText" : ""}
                />
                <label
                  htmlFor="charity"
                  className={userType === "Charity" ? "greenText" : ""}
                >
                  Charity
                </label>
              </div> */}
            </div>
          </div>

          <div className="inputFieldButton">
            {/* Phone Number Input or OTP Input */}
            {!otpSent ? (
              <div className="phoneNumberSection">
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                />
                <button className="button_verify_OTP" onClick={handleGetOtp}>
                  <p>Get OTP</p>
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
            ) : (
              <div className="otpSection">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={handleOtpChange}
                />
                <button className="button_verify_OTP" onClick={handleVerifyOtp}>
                  Verify OTP
                </button>
                <p>OTP expires in: {timer} seconds</p>
              </div>
            )}

            {/* Social Media Sign Up */}
            <div className="socialSignUp">
              <button className="googleSignUp" onClick={() => loginWithGoogle()}>
                <img className="socialLogo" src={googleIcon} alt="" />
                <div>Sign up with Google</div>
              </button>
              {/* <button className="facebookSignUp">Sign up with Facebook</button> */}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default LogInSignUp;
