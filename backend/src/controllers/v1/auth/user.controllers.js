const db = require("../../../models/index");
let statusCode = require("../../../utils/statusCode");
const bcrypt = require("bcrypt");
const fs = require('fs')
let deviceLogin = db.device
let authSessions = db.authSessions
let users = db.users
let otpVerifications = db.otpVerifications
let QueryTypes = db.QueryTypes
const { sequelize, Sequelize } = require('../../../models')
let jwt = require('jsonwebtoken');
const { encrypt } = require('../../../middlewares/encryption.middlewares')
const { decrypt } = require('../../../middlewares/decryption.middlewares')
const { Op, where } = require("sequelize");
let generateToken = require('../../../utils/generateToken');
const imageUpload = require('../../../utils/imageUpload');
const imageUpdate = require('../../../utils/imageUpdate')
const logger = require('../../../logger/index.logger')
const axios = require('axios')
const file = db.files;
const fileAttachement = db.fileAttachments;
const weekdayMaster = db.WeekdayMasters;
const timeMaster = db.timeMasters;
const roles = db.roles;
const verificationDocumentMaster = db.verificationDocumentMasters;
const availabilityUser = db.availabilityUsers;

function generateRandomOTP(numberValue = "1234567890", otpLength = 6) {
  console.log('incoming');
  let result = "";
  for (let i = 0; i < otpLength; i++) {
    result += numberValue.charAt(Math.floor(Math.random() * otpLength));
  }
  console.log('result', result);
  return result;
}

let createOtp = async (req, res) => {
  try {
    let { encryptMobile: mobileNo } = req.body;
    // console.log(req.body)
    console.log("encrypted mobile number", mobileNo);
    const generatedOTP = generateRandomOTP();
    console.log("generated OTP", generatedOTP);
    mobileNo = decrypt(mobileNo); //get the decrypted mobile number
    console.log("decrypted mobile number", mobileNo);
    // let expiryTime = new Date();
    // expiryTime = expiryTime.setMinutes(expiryTime.getMinutes() + 1);
    let otp = "123456";
    // let insertOtp;
    // console.log(expiryTime,'expiryTime')

    // if (mobileNo) { // if proper mobile number
    //   let isOtpValid = await otpVerifications.findOne({
    //     where: {
    //       expiryTime: {
    //         [Op.gte]: new Date(),
    //       },
    //       mobileNo: mobileNo
    //     }
    //   });
    //   console.log(1, isOtpValid)
    //   if (isOtpValid != null) { // if otp present, then expire the otp
    //     console.log(2)
    //     let expireOtp = await otpVerifications.update({
    //       expiryTime: new Date(Date.now() - 24 * 60 * 60 * 1000)
    //     }, {
    //       where: {
    //         mobileNo: mobileNo
    //       }
    //     });
    //     console.log(3, expireOtp);
    //     insertOtp = await otpVerifications.create({
    //       mobileNo:encrypt(mobileNo), 
    //       code: encrypt(otp), 
    //       expireTime:expiryTime, 
    //       verified: 0
    //     });
    //     console.log(4, insertOtp);
    //   }
    //   else {
    //     console.log(5)
    //     insertOtp = await otpVerifications.create({
    //       mobileNo:encrypt(mobileNo), 
    //       code: encrypt(otp),
    //       expiryTime:expiryTime,
    //       verified: 0,

    //     });

    //   }
    // }
    // console.log("insertOTP", insertOtp);
    // if (insertOtp != null) {
    //   console.log(6)
    return res.status(statusCode.SUCCESS.code).json({
      message: "OTP sent successfully. OTP is valid for 1 minute.",
      otp: otp,
    });
    // }
    // else {
    //   console.log(7)
    //   return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
    //     message: "Something went wrong!"
    //   })
    // }
  }
  catch (error) {
    logger.error(`An error occurred: ${error.message}`); // Log the error

    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message: error.message
    })
  }
}

let verifyOtp = async (req, res) => {
  try {
    let { encryptMobile: mobileNo, isOTPVerified } = req.body;
    console.log("req body params", { mobileNo, isOTPVerified });


  }
  catch (error) {
    logger.error(`An error occurred: ${error.message}`); // Log the error

  }
}

let tokenAndSessionCreation = async (isUserExist, lastLoginTime, deviceInfo) => {
  try {
    console.log("tokenAndSessionCreationFunction")
    let userName = isUserExist.name;
    let sessionId;

    let userId = isUserExist.userId
    let roleId = isUserExist.userType
    console.log(isUserExist, 'user exist near token and session creation')

    console.log(userId, userName, roleId, 'roleId')

    let accessAndRefreshToken = await generateToken(userId, userName);

    console.log(accessAndRefreshToken, "accessAndRefreshToken")
    if (accessAndRefreshToken?.error) {
      return {
        error: accessAndRefreshToken.error
      }
    }
    let { accessToken, refreshToken } = accessAndRefreshToken;

    console.log(accessToken, refreshToken, 'accessToken and refresh token')
    const options = {
      httpOnly: true,
      secure: true
    };

    let updateLastLoginTime = await users.update({ lastLogin: lastLoginTime }, {
      where: {
        userId: isUserExist.userId
      }
    })
    // check for active session

    let checkForActiveSession = await authSessions.findOne({
      where: {
        [Op.and]: [{ userId: isUserExist.userId },
        { active: 1 }]
      }
    })
    // if active
    if (checkForActiveSession) {

      let updateTheSessionToInactive = await authSessions.update({ active: 2 }, {
        where: {
          sessionId: checkForActiveSession.sessionId
        }
      })
      console.log('update the session To inactive', updateTheSessionToInactive)
      // after inactive
      if (updateTheSessionToInactive.length > 0) {
        // check if it is present in the device table or not
        let checkDeviceForParticularSession = await deviceLogin.findOne({
          where: {
            sessionId: checkForActiveSession.sessionId
          }
        })
        if (checkDeviceForParticularSession) {
          if (checkDeviceForParticularSession.deviceName == deviceInfo.deviceName && checkDeviceForParticularSession.deviceType == deviceInfo.deviceType) {
            // insert to session table first 
            let insertToAuthSession = await authSessions.create({
              lastActivity: new Date(),
              active: 1,
              deviceId: checkDeviceForParticularSession.deviceId,
              userId: isUserExist.userId
            })
            // then update the session id in the device table
            let updateTheDeviceTable = await deviceLogin.update({
              sessionId: insertToAuthSession.sessionId
            }, {
              where: {
                deviceId: checkDeviceForParticularSession.deviceId
              }
            })
            sessionId = insertToAuthSession.sessionId
          }
          else {
            // insert to device table 
            let insertToDeviceTable = await deviceLogin.create({
              deviceType: deviceInfo.deviceType,
              deviceName: deviceInfo.deviceName,

            })

            // Insert to session table
            let insertToAuthSession = await authSessions.create({
              lastActivity: new Date(),
              active: 1,
              deviceId: insertToDeviceTable.deviceId,
              userId: isUserExist.userId
            })
            // update the session id in the device table
            let updateSessionIdInDeviceTable = await deviceLogin.update({
              sessionId: insertToAuthSession.sessionId
            }, {
              where: {
                deviceId: insertToDeviceTable.deviceId
              }
            })

            sessionId = insertToAuthSession.sessionId
          }
          console.log('session id ', sessionId)
        }
        else {
          console.log('session id2 ', sessionId)

          // insert to device table 
          let insertToDeviceTable = await deviceLogin.create({
            deviceType: deviceInfo.deviceType,
            deviceName: deviceInfo.deviceName,

          })

          // Insert to session table
          let insertToAuthSession = await authSessions.create({
            lastActivity: new Date(),
            active: 1,
            deviceId: insertToDeviceTable.deviceId,
            userId: isUserExist.userId
          })
          // update the session id in the device table
          let updateSessionIdInDeviceTable = await deviceLogin.update({
            sessionId: insertToAuthSession.sessionId
          }, {
            where: {
              deviceId: insertToDeviceTable.deviceId
            }
          })
          sessionId = insertToAuthSession.sessionId

        }
        console.log('session 3', sessionId)
      }
      else {
        console.log('session 4', sessionId)

        return {
          error: 'Something Went Wrong'
        }

      }


    }
    else {
      // insert to device table 
      let insertToDeviceTable = await deviceLogin.create({
        deviceType: deviceInfo.deviceType,
        deviceName: deviceInfo.deviceName,

      })

      // Insert to session table
      let insertToAuthSession = await authSessions.create({
        lastActivity: new Date(),
        active: 1,
        deviceId: insertToDeviceTable.deviceId,
        userId: isUserExist.userId
      })
      // update the session id in the device table
      let updateSessionIdInDeviceTable = await deviceLogin.update({
        sessionId: insertToAuthSession.sessionId
      }, {
        where: {
          deviceId: insertToDeviceTable.deviceId
        }
      })
      sessionId = insertToAuthSession.sessionId
    }
    console.log('session id5', encrypt(sessionId), sessionId)
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      sessionId: encrypt(sessionId),
      options: options
    }

  } catch (err) {
    return {
      error: 'Something Went Wrong'
    }
  }
}

let loginWithOTP = async (req, res) => {
  try {
    console.log('loginwithotp', req.body)
    let statusId = 1;

    let { encryptMobile: mobileNo, encryptOtp: otp } = req.body

    let userAgent = req.headers['user-agent'];

    // console.log('userAgent', userAgent)
    let deviceInfo = parseUserAgent(userAgent)
    let lastLoginTime = new Date();
    // mobileNo = decrypt(mobileNo);
    // otp = decrypt(otp);

    if (mobileNo && otp) {
      // let isOtpValid = await otpVerifications.findOne({
      //   where: {
      //     expiryTime: { [Op.gte]: new Date() },
      //     code: otp,
      //     mobileNo: mobileNo
      //   }
      // })
      // console.log('207 line', isOtpValid)
      // if (isOtpValid) {
      // let updateTheVerifiedValue = await otpVerifications.update({ verified: 1 }
      //   , {
      //     where: {
      //       id: isOtpValid.id || isOtpValid.dataValues.id
      //     }
      //   }
      // )
      // console.log(updateTheVerifiedValue, 'update the verified value')
      let isUserExist = await users.findOne({
        where: {
          [Op.and]: [{ phoneNumber: decrypt(mobileNo) }, { statusId: statusId }]
        }
      })
      console.log(isUserExist, 'check user 223 line')
      // If the user does not exist then we have to send a message to the frontend so that the sign up page will get render
      if (!isUserExist) {
        return res.status(statusCode.SUCCESS.code).json({
          message: "please render the sign up page",
          decideSignUpOrLogin: 0,
          user: {}
        });
      }

      // console.log('2')
      let tokenGenerationAndSessionStatus = await tokenAndSessionCreation(isUserExist, lastLoginTime, deviceInfo);

      // console.log('all the data', tokenGenerationAndSessionStatus)

      if (tokenGenerationAndSessionStatus?.error) {

        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
          message: tokenAndSessionCreation.error
        })

      }

      // console.log('here upto it is coming')
      let { accessToken, refreshToken, options, sessionId } = tokenGenerationAndSessionStatus


      // Set the access token in an HTTP-only cookie named 'accessToken'
      res.cookie('accessToken', accessToken, options);

      // Set the refresh token in a separate HTTP-only cookie named 'refreshToken'
      res.cookie('refreshToken', refreshToken, options)

      // bearer is actually set in the first to tell that  this token is used for the authentication purposes

      return res.status(statusCode.SUCCESS.code)
        .header('Authorization', `Bearer ${accessToken}`)
        .json({
          message: "please render the donor landing page",
          decideSignUpOrLogin: 1,
          user: {
            username: isUserExist,
            accessToken: accessToken,
            refreshToken: refreshToken,
            decideSignUpOrLogin: 1,
            sid: sessionId
          }
        });
      // }
      // else {
      //   return res.status(statusCode.BAD_REQUEST.code).json({
      //     message: "Invalid Otp"
      //   })
      // }
    }
  }
  catch (err) {
    logger.error(`An error occurred: ${err.message}`); // Log the error

    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message: err.message
    })
  }
}

let loginWithOAuth = async (req, res) => {
  try {
    let { googleTokenId, userType } = req.body
    userType = 1;
    let userAgent = req.headers['user-agent'];
    console.log("googleTokenId", googleTokenId);
    // console.log('userAgent', userAgent)
    let deviceInfo = parseUserAgent(userAgent)
    let statusId = 1;
    let lastLoginTime = new Date();

    if (googleTokenId) {
      console.log("01")
      // first we will verify the id token with google api
      // const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${googleTokenId}`)
      // Fetch Google profile information
      const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${googleTokenId}`,
        },
      });

      console.log("response", response);
      // Destructure the information from the response

      const { sub: googleId, name, email } = response.data;
      console.log(1)
      // Check if the user already exist
      let isUserExist = await users.findOne({
        where: {
          [Op.and]: [{ googleAccountId: googleId }, { statusId: statusId }]
        }
      })
      console.log(2)
      if (!isUserExist) {
        console.log(3)
        isUserExist = await users.create({
          name: name,
          email: email,
          userType: userType,
          lastLogin: lastLoginTime, // Example of setting a default value
          statusId: 1, // Example of setting a default value
          createdBy: 1,
          googleAccountId: googleId,
          createdOn: new Date(),
          updatedOn: new Date(), // Set current timestamp for updatedOn
        });
      }
      console.log(4)
      // console.log('2')
      let tokenGenerationAndSessionStatus = await tokenAndSessionCreation(isUserExist, lastLoginTime, deviceInfo);
      console.log(5)
      // console.log('all the data', tokenGenerationAndSessionStatus)

      if (tokenGenerationAndSessionStatus?.error) {
        console.log(6)
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
          message: tokenAndSessionCreation.error
        })

      }

      // console.log('here upto it is coming')
      let { accessToken, refreshToken, options, sessionId } = tokenGenerationAndSessionStatus
      console.log(7)

      // Set the access token in an HTTP-only cookie named 'accessToken'
      res.cookie('accessToken', accessToken, options);
      console.log(8)
      // Set the refresh token in a separate HTTP-only cookie named 'refreshToken'
      res.cookie('refreshToken', refreshToken, options)

      // bearer is actually set in the first to tell that  this token is used for the authentication purposes
      console.log(9)
      return res.status(statusCode.SUCCESS.code)
        .header('Authorization', `Bearer ${accessToken}`)
        .json({
          message: "please render the donor landing page",
          decideSignUpOrLogin: 1,
          user: {
            username: isUserExist,
            accessToken: accessToken,
            refreshToken: refreshToken,
            decideSignUpOrLogin: 1,
            sid: sessionId
          }
        });
    }
    else {
      console.log(10)
      return res.status(statusCode.BAD_REQUEST.code).json({
        message: 'Invalid Request'
      })
    }
  }
  catch (error) {
    if (error.response) {
      console.log(11)
      logger.error(`An error occurred: ${error.message}`); // Log the error
      return res.status(statusCode.UNAUTHORIZED.code).json({ message: 'Invalid or expired token' });

    }
    else {
      console.log(12)
      logger.error(`An error occurred: ${error.message}`); // Log the error

      return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: error.message });

    }

  }
}


const viewUserProfile = async (req, res) => {
  console.log("view user profile details");
  try {
    console.log(21, req.user.userId)
    let userId = req.user?.userId || 1;

    let publicRole = await users.findOne({
      where: {
        userId: userId
      }
    })

    if (!publicRole) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
        message: `Something went wrong`
      })
    }
    let statusId = 1;
    let entityType = 'users'




    let showpublic_user = await sequelize.query(`
      select u.*, r."roleName"  from soulshare.users u
      inner join soulshare.roles r on r."roleId" = u."userType"
      where u."statusId" = ? and u."userType" =? and u."userId" = ?
   `, {
      type: QueryTypes.SELECT,
      replacements: [statusId, publicRole.userType, userId]
    })

    let findTheImageUrl = await sequelize.query(` select f."fileId", fl."url"  from soulshare.users u 
    inner join soulshare.files f on u."userId" = f."entityId" 
    inner join soulshare."fileAttachments" fl on fl."fileId" = f."fileId"  
    where f."entityType" = ? and u."statusId" = ? and u."userType" =? and u."userId" = ? and fl."statusId" = ? and f."statusId" = ?`,
      {
        type: QueryTypes.SELECT,
        replacements: [entityType, statusId, publicRole.userType, userId, statusId, statusId]
      })

    if (findTheImageUrl.length > 0) {
      showpublic_user[0].url = findTheImageUrl[0].url;
      showpublic_user[0].fileId = findTheImageUrl[0].fileId;
    }

    console.log('show public user', showpublic_user)

    return res.status(statusCode.SUCCESS.code).json({
      message: "Show Public User",
      public_user: showpublic_user,
    });
  } catch (err) {
    // logger.error(`An error occurred: ${err.message}`); // Log the error
    logger.error(`An error occurred: ${err.message}`); // Log the error

    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message: err.message,
    });
  }
};

let updateUserProfile = async (req, res) => {
  let transaction;
  try {
    console.log('232')
    transaction = await sequelize.transaction();
    console.log('req body', req.body, req.user.userId)
    let statusId = 1;
    let inActiveStatus = 2;
    let userId = req.user.userId;
    let updatedDt = new Date();
    let createdDt = new Date();
    console.log(userId, 'userId', req.user.userId)
    let {
      name,
      email,
      phoneNumber,
      address,
      userImage
    } = req.body;

    // console.log("Update Profile", req.body)
    console.log("profile Update", req.body)
    let imageUpdateVariable = 0;
    let updatepublicUserCount;
    let params = {};
    let roleId = 1;


    let findPublicuserWithTheGivenId = await users.findOne({
      where: {
        userId: userId,
      },
      transaction
    });
    console.log('2323')

    if (findPublicuserWithTheGivenId.name != name && name) {
      params.name = name;
    }

    if (findPublicuserWithTheGivenId.phoneNumber != phoneNumber && phoneNumber) {
      const existingphoneNo = await users.findOne({
        where: { phoneNumber: phoneNumber, statusId: statusId, userType: roleId },
      });
      if (existingphoneNo) {
        await transaction.rollback();
        return res
          .status(statusCode.CONFLICT.code)
          .json({ message: "User already exist same phoneNo" });
      }
      params.phoneNumber = phoneNumber;
    }


    if (findPublicuserWithTheGivenId.email != email && email) {

      const existingemailId = await users.findOne({
        where: { email: email, statusId: statusId, userType: roleId },
        transaction
      });
      if (existingemailId) {
        await transaction.rollback();
        return res.status(statusCode.CONFLICT.code).json({
          message: "User already exist with given emailId",
        });
      }
      params.email = email;
    }

    if (address) {

      params.address = address;
    }

    if (Object.keys(userImage).length > 0) {
      // console.log('profilePicture?.data',profilePicture?.data)
      if (userImage?.fileId != 0 && userImage?.data) {
        console.log('inside image part', userImage?.fileId)
        let findThePreviousFilePath = await fileAttachement.findOne({
          where: {
            statusId: statusId,
            fileId: userImage.fileId
          },
          transaction
        })
        let oldFilePath = findThePreviousFilePath?.url
        console.log('old file path ', findThePreviousFilePath)
        let errors = [];
        let insertionData = {
          id: userId,
          name: name,
          fileId: userImage.fileId
        }
        let subDir = "userDir"
        //update the data
        let updateSingleImage = await imageUpdate(userImage.data, subDir, insertionData, userId, errors, 1, transaction, oldFilePath)
        if (errors.length > 0) {

          await transaction.rollback();

          if (errors.some(error => error.includes("something went wrong"))) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: errors })
          }
          return res.status(statusCode.BAD_REQUEST.code).json({ message: errors })
        }
        imageUpdateVariable = 1;
        console.log('inside image update')

      }
      else if (userImage?.fileId == 0 && userImage?.data) {
        console.log('inside new image part')
        let insertionData = {
          id: userId,
          name: name
        }
        // create the data
        let entityType = 'users'
        let errors = [];
        let subDir = "userDir"

        let uploadSingleImage = await imageUpload(userImage.data, entityType, subDir, insertionData, userId, errors, 1, transaction)
        console.log(uploadSingleImage, '165 line facility image')
        if (errors.length > 0) {
          await transaction.rollback();
          if (errors.some(error => error.includes("something went wrong"))) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: errors })
          }
          return res.status(statusCode.BAD_REQUEST.code).json({ message: errors })
        }
        imageUpdateVariable = 1;

        console.log('inside image upload')
      }
      else if (userImage.fileId != 0) {
        console.log('inside file')
        let inactiveTheFileId = await file.update({ statusId: inActiveStatus },
          {
            where: {
              fileId: userImage.fileId
            },
            transaction
          }
        )

        console.log('fileid', inactiveTheFileId)
        let inActiveTheFileInFileAttachmentTable = await fileAttachement.update({
          statusId: inActiveStatus
        },
          {
            where: {
              fileId: userImage.fileId
            },
            transaction
          }
        )
        console.log('file update check', inactiveTheFileId, 'file attachemnt ', inActiveTheFileInFileAttachmentTable)

        if (inactiveTheFileId.length == 0 || inActiveTheFileInFileAttachmentTable == 0) {
          await transaction.rollback();
          return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: `Something went wrong`
          })
        }
        else {
          imageUpdateVariable = 1;
        }

      }
      else {
        await transaction.rollback();
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
          message: `Something went wrong`
        })
      }

    }
    console.log('outside profile update part', params)

    if (Object.keys(params).length > 0) {
      console.log('inside update part')

      params.updatedBy = userId;
      params.updatedDt = updatedDt;
      console.log('near 225 line')

      updatepublicUserCount =
        await users.update(params, {
          where: {
            [Op.and]: [{ userId: userId }, { statusId: statusId }]
          },
          transaction
        });

    }
    if (updatepublicUserCount >= 1 || imageUpdateVariable == 1) {

      await transaction.commit();
      console.log('data updated')
      return res.status(statusCode.SUCCESS.code).json({
        message: "Updated Successfully",
      });
    } else {
      await transaction.rollback();
      return res.status(statusCode.BAD_REQUEST.code).json({
        message: "Data not Updated ",
      });
    }



  } catch (error) {
    if (transaction) await transaction.rollback();
    logger.error(`An error occurred: ${error.message}`); // Log the error

    res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }

}



let logout = async (req, res) => {
  try {
    let userId = req.user?.userId || 1;
    let sessionId = decrypt(req.session)
    const options = {
      expires: new Date(Date.now() - 1), // Expire the cookie immediately
      httpOnly: true,
      secure: true
    };
    let updateTheSessionToInactive = await authSessions.update({ active: 2 }, {
      where: {
        sessionId: sessionId
      }
    })
    // Clear both access token and refresh token cookies
    res.clearCookie('accessToken', options);
    res.clearCookie('refreshToken', options);

    res.status(statusCode.SUCCESS.code).json({ message: 'Logged out successfully', sessionExpired: true });
  } catch (err) {
    logger.error(`An error occurred: ${err.message}`); // Log the error

    res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: err.message, sessionExpired: true });

  }
}



let signUp = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    console.log('1')
    let roleId = 1;
    let statusId = 1;
    let { name, email, phoneNumber, longitude, latitude, address, userType, userImage } = req.body;

    // console.log('req.body', { name, phoneNumber, longitude, latitude, userType })
    // let updatedOn = new Date();

    //check if address details present correctly
    let addressDetails = ['building', 'area', 'landmark', 'pincode', 'townCity', 'state'];
    if (address != null || typeof address != 'undefined') {
      for (let key of Object.keys(address)) {
        if (!addressDetails.includes(key) || (key != 'landmark' && !address[key])) {
          return res.status(statusCode.BAD_REQUEST.code).json({
            message: `please provide all required data to set up the profile`
          });
        }
      }
    }

    if (!name && !phoneNumber && !longitude && !latitude && !userType) {
      console.log(2)
      await transaction.rollback();
      return res.status(statusCode.BAD_REQUEST.code).json({
        message: `please provide all required data to set up the profile`
      })
    }
    console.log(3)
    let checkDuplicateMobile = await users.findOne({
      where:
      {
        [Op.and]: [
          { phoneNumber: phoneNumber },
          { statusId: statusId }
        ]
      },
      transaction
    })
    console.log('checkDuplicateMobile', checkDuplicateMobile);
    console.log(4)
    if (checkDuplicateMobile) {
      console.log(5)
      await transaction.rollback();
      return res.status(statusCode.CONFLICT.code).json({
        message: "This phone number is already allocated to existing user."
      })
    }
    console.log(6)
    let lastLogin = Date.now();
    console.log(7)
    const newUser = await users.create({
      name: name,
      email: email,
      phoneNumber: phoneNumber,
      userType: userType || null,
      address: address,
      longitude: longitude,
      latitude: latitude,
      lastLogin: lastLogin, // Example of setting a default value
      statusId: 1, // Example of setting a default value
      createdBy: 1,
      updatedOn: null, // Set current timestamp for updatedOn
    },
      {
        transaction
      });
    console.log(8)

    if (!newUser) {
      console.log(9)
      await transaction.rollback();
      return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
        message: "Something went wrong"
      })
    }
    console.log(10)
    // after the user created successfully then the image can be added 
    if (userImage) {
      console.log(11)
      let insertionData = {
        id: newUser.userId,
        name: name
      }
      // create the data
      let entityType = 'users'
      let errors = [];
      let subDir = "userDir"
      let filePurpose = "User Image"
      let uploadSingleImage = await imageUpload(userImage, entityType, subDir, insertionData, newUser.userId, errors, 1, transaction)
      console.log(uploadSingleImage, 'error image')
      if (errors.length > 0) {
        console.log(12)
        await transaction.rollback();
        if (errors.some(error => error.includes("something went wrong"))) {
          return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: errors })
        }
        return res.status(statusCode.BAD_REQUEST.code).json({ message: errors })
      }
    }
    if (newUser) {
      console.log(13)
      await transaction.commit();
      // Return success response
      return res.status(statusCode.SUCCESS.code).json({
        message: "User created successfully", user: newUser
      })
    }
    else {
      console.log(14)
      await transaction.rollback();
      return res.status(statusCode.BAD_REQUEST.code).json({
        message: `User signup failed.`
      })
    }
  } catch (err) {
    // Handle errors
    console.log(15)
    if (transaction) await transaction.rollback();
    logger.error(`An error occurred: ${err.message}`); // Log the error

    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message: err.message
    })
  }
};



function parseUserAgent(userAgent) {
  let deviceType = 'Unknown';
  let deviceName = 'Unknown Device';

  // Check if the User-Agent string contains patterns indicative of specific device types
  if (userAgent.includes('Windows')) {
    deviceType = 'Desktop';
    deviceName = 'Windows PC';
  } else if (userAgent.includes('Macintosh')) {
    deviceType = 'Desktop';
    deviceName = 'Mac';
  } else if (userAgent.includes('Linux')) {
    deviceType = 'Desktop';
    deviceName = 'Linux PC';
  } else if (userAgent.includes('Android')) {
    deviceType = 'Mobile';
    deviceName = 'Android Device';
  } else if (userAgent.includes('iPhone') || userAgent.includes('iPad') || userAgent.includes('iPod')) {
    deviceType = 'Mobile';
    deviceName = 'iOS Device';
  }
  else if (userAgent.includes('Postman')) {
    deviceType = 'PC'
    deviceName = 'Postman'

  }

  return { deviceType, deviceName };
}

let initialData = async (req, res) => {
  try {
    console.log('inside initial data')
    let fetchRoles = await db.roles.findAll({
      where: {
        statusId: 1
      }
    });
    console.log("fetchRoles", fetchRoles);

    let timeSlotMasterData = await timeMaster.findAll({
      where: {
        statusId: 1
      }
    });
    console.log("timeSlots", timeSlotMasterData);

    let weekDaysMasterData = await weekdayMaster.findAll({
      where: {
        statusId: 1
      }
    });
    console.log("weekDaysMaster", weekDaysMasterData);

    let verificationDocumentMasterData = await verificationDocumentMaster.findAll({
      where: {
        statusId: 1
      }
    });
    console.log("verificationDocumentMaster", verificationDocumentMasterData);

    return res.status(statusCode.SUCCESS.code).json({
      message: "roles category, timeSlot, dayOfWeek, verificationDocType data",
      roles: fetchRoles,
      timeSlotMasterData, weekDaysMasterData, verificationDocumentMasterData
    });
  }
  catch (error) {
    logger.error(`An error occurred: ${error.message}`); // Log the error

    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message: error.message
    })
  }
}

let volunteerRegistration = async (req, res) => {
  let transaction = await sequelize.transaction();
  try {
    console.log("volunteerRegistration");
    let { name, phoneNumber, email, city, pincode, verificationDocId, docFile, timeOfDay, weekDay, userImage } = req.body;
    console.log({ name, phoneNumber, email, city, pincode, verificationDocId, docFile, timeOfDay, weekDay });
    let inputFields = ['name', 'phoneNumber', 'email', 'city', 'pincode', 'timeOfDay', 'weekDay']; //'verificationDocId', 'docFile', 
    let emptyFields = [];
    let statusId = 1;

    // fetch user type
    let volunteerType = await roles.findAll({
      where: {
        statusId: 1,
        roleName: 'Volunteer'
      }
    });
    console.log("volunteerType", volunteerType);

    // check for input data
    console.log("check for input data fields");
    inputFields.forEach((field) => {
      if (!req.body[field]) {
        if (emptyFields.includes('phoneNumber') && field == 'email') {
          // skip
        }
        else if (!emptyFields.includes('phoneNumber') && field == 'email') {
          emptyFields.push(field);
        }
        else {
          emptyFields.push(field);
        }
      }
    });
    console.log("emptyFields", emptyFields.toString());
    // if there are empty fields, then return with error
    if (emptyFields.length > 0) {
      return res.status(statusCode.BAD_REQUEST.code).json({
        message: `Kindly fill the following fields: ${emptyFields.toString()}`,
      });
    }
    let checkForDuplicateData = await users.findOne({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { phoneNumber: phoneNumber },
              { email: email }
            ]
          },
          { statusId: 1 }
        ]
      },
      type: QueryTypes.SELECT
    });

    console.log("checkForDuplicateData:- ", checkForDuplicateData);

    if (checkForDuplicateData) {
      return res.status(statusCode.CONFLICT.code).json({
        message: "User details already exist.",
      });
    }
    //insert into users table
    let insertVolunteerData = await users.create({
      name, email, phoneNumber,
      userType: volunteerType[0].roleId,
      address: { city, pincode },
      createdBy: 1,
      statusId: 1,
      timeOfDay: timeOfDay.toString(),
      weekDay: weekDay.toString(),
      verificationDocumentId: verificationDocId,
    }, transaction);

    if (insertVolunteerData) { // if insertion of data successful
      console.log("insertion of volunteer data success...");
      console.log("insert verification doc file");

      let insertionData = {
        id: insertVolunteerData.userId,
        name: name,
      };
      let entityType = '';
      let errors = [];
      let subDir = "";

      if (userImage) {  // if profile picture provided, then insert
        entityType = 'users';
        subDir = "userDir";
        uploadSingleImage = await imageUpload(userImage, entityType, subDir, insertionData, insertVolunteerData.userId, errors, 1, transaction)

        if (errors.length > 0) {
          console.log("first")
          await transaction.rollback();
          if (errors.some(error => error.includes("something went wrong"))) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: errors })
          }
          return res.status(statusCode.BAD_REQUEST.code).json({ message: errors })
        }
      }

      if (docFile) { // if verification document provided, then insert
        // create the verification doc file
        entityType = "Volunteer Verification Doc";
        errors = [];
        subDir = "verificationDoc";

        let uploadSingleDocument = await imageUpload(docFile.data, entityType, subDir, insertionData, insertVolunteerData.userId, errors, 1, transaction);

        console.log('inside new verify doc part end');
        if (errors.length > 0) {
          await transaction.rollback();
          if (errors.some(error => error.includes("something went wrong"))) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: errors })
          }
          return res.status(statusCode.BAD_REQUEST.code).json({ message: errors })
        }
      }

      await transaction.commit();
      return res.status(statusCode.CREATED.code).json({
        message: 'Details are successfully submitted. Kindly login!',
        insertVolunteerData
      });
    }
    else {  //if insertion of user details failed, then rollback transaction
      await transaction.rollback();
      logger.error(`An error occurred: ${error.message}`); // Log the error
      return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
        message: error.message
      });
    }
  }
  catch (error) {
    if (transaction) await transaction.rollback();
    logger.error(`An error occurred: ${error.message}`); // Log the error
    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message: error.message
    });
  }
}

let viewVolunteerProfileData = async (req, res) => {
  try {
    let userId = req.user?.userId || 1;
    let viewProfileData = await users.findOne({
      where: {
        userId: userId
      }
    });
    console.log("viewProfileData", viewProfileData);
    return res.status(statusCode.SUCCESS.code).json({
      message: "Profile data",
      data: {
        ...viewProfileData,
        "timeOfDay": viewProfileData.timeOfDay.split(','),
        "weekDay": viewProfileData.weekDay.split(',')
      }
    });
  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message: error.message
    })
  }
}

let updateVolunteerProfileData = async (req, res) => {
  let transaction;
  try {
    console.log("updateVolunteerProfileData");
    transaction = await sequelize.transaction();
    let statusId = 1;
    let inActiveStatus = 2;
    let updatedDt = new Date();
    let { name, phoneNumber, email, city, pincode, verificationDocId, docFile, timeOfDay, weekDay, userImage } = req.body;
    console.log("updated field data", { name, phoneNumber, email, city, pincode, verificationDocId, docFile, timeOfDay, weekDay });
    let userId = req.user?.userId || 1;
    let params = {};
    let updatepublicUserCount;
    let imageUpdateVariable = 0;
    let docFileUpdateVariable = 0;
    // fetch saved data
    let fetchSavedDetails = await users.findOne({
      where: {
        userId: userId
      }
    });
    console.log("fetchSavedDetails", fetchSavedDetails.dataValues);
    // check for any change in data
    if (name && fetchSavedDetails.dataValues.name != name) {
      params.name = name;
    }
    if (phoneNumber && fetchSavedDetails.dataValues.phoneNumber != phoneNumber) {
      params.phoneNumber = phoneNumber;
    }
    if (email && fetchSavedDetails.dataValues.email != email) {
      params.email = email;
    }
    if (city && fetchSavedDetails.dataValues.address.city != city) {
      params.address = { city: city };
    }
    if (pincode && fetchSavedDetails.dataValues.address.pincode != pincode) {
      params.address = { ...params.address, pincode: pincode };
    }
    if (verificationDocId && fetchSavedDetails.dataValues.verificationDocId != verificationDocId) {
      params.verificationDocId = verificationDocId;
    }
    console.log("Params to be updated", params);
    console.log("doc file update -- start")
    if (Object.keys(docFile).length > 0) {
      if (docFile?.fileId != 0 && docFile?.data) { //if fileId and doc data sent, then update the file data
        console.log("inside image update - fileId && data");
        let previousFilePath = await fileAttachement.findOne({
          where: {
            statusId: statusId,
            fileId: docFile.fileId
          },
          transaction
        });
        let oldFilePath = previousFilePath?.url
        let errors = [];
        let insertionData = {
          id: userId,
          name: name,
          fileId: docFile.fileId
        }
        let subDir = "verificationDoc";

        console.log("update verification doc file -- start");
        let updateSingleDocument = await imageUpdate(docFile.data, subDir, insertionData, userId, errors, 1, transaction, oldFilePath);
        if (errors.length > 0) {

          await transaction.rollback();

          if (errors.some(error => error.includes("something went wrong"))) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: errors });
          }
          return res.status(statusCode.BAD_REQUEST.code).json({ message: errors });
        }
        docFileUpdateVariable = 1;
        console.log("update verification doc file -- end")
      }
      else if (docFile?.fileId == 0 && docFile?.data) {  // if new file received
        console.log('inside new verify doc part start');
        let insertionData = {
          id: userId,
          name: name
        }

        // create the verification doc file
        let entityType = "Volunteer Verification Doc";
        let errors = [];
        let subDir = "verificationDoc";

        let uploadSingleDocument = await imageUpload(docFile.data, entityType, subDir, insertionData, userId, errors, 1, transaction);

        console.log('inside new verify doc part end');
        if (errors.length > 0) {
          await transaction.rollback();
          if (errors.some(error => error.includes("something went wrong"))) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: errors })
          }
          return res.status(statusCode.BAD_REQUEST.code).json({ message: errors })
        }
        docFileUpdateVariable = 1;
      }
      else if (docFile?.fileId != 0) { // if fileId is sent, then to remove existing doc file
        console.log('remove doc file');
        // update status of file to inactive
        let inactiveTheFileId = await file.update({ statusId: inActiveStatus },
          {
            where: {
              fileId: docFile.fileId
            },
            transaction
          }
        );
        console.log('status of file changed to inactive', inactiveTheFileId);
        let inActiveTheFileInFileAttachmentTable = await fileAttachement.update({
          statusId: inActiveStatus
        },
          {
            where: {
              fileId: docFile.fileId
            },
            transaction
          }
        );
        console.log("status of file attachment changed to inactive", inActiveTheFileInFileAttachmentTable);
        if (inactiveTheFileId.length == 0 || inActiveTheFileInFileAttachmentTable == 0) {
          await transaction.rollback();
          return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: `Something went wrong`
          })
        }
        else {
          // successful updation of status of verification doc file to inactive
          docFileUpdateVariable = 1;
        }
      }
      else {
        // default condition
        await transaction.rollback();
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
          message: "Something went wrong."
        })
      }
    }
    console.log('outside of verification doc file update');
    console.log('user profile photo update -- start');
    if (Object.keys(userImage).length > 0) {
      // console.log('profilePicture?.data',profilePicture?.data)
      if (userImage?.fileId != 0 && userImage?.data) {
        console.log('inside image part', userImage?.fileId)
        let findThePreviousFilePath = await fileAttachement.findOne({
          where: {
            statusId: statusId,
            fileId: userImage.fileId
          },
          transaction
        })
        let oldFilePath = findThePreviousFilePath?.url
        console.log('old file path ', findThePreviousFilePath)
        let errors = [];
        let insertionData = {
          id: userId,
          name: name,
          fileId: userImage.fileId
        }
        let subDir = "userDir"
        //update the data
        let updateSingleImage = await imageUpdate(userImage.data, subDir, insertionData, userId, errors, 1, transaction, oldFilePath)
        if (errors.length > 0) {

          await transaction.rollback();

          if (errors.some(error => error.includes("something went wrong"))) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: errors })
          }
          return res.status(statusCode.BAD_REQUEST.code).json({ message: errors })
        }
        imageUpdateVariable = 1;
        console.log('inside image update')

      }
      else if (userImage?.fileId == 0 && userImage?.data) {
        console.log('inside new image part')
        let insertionData = {
          id: userId,
          name: name
        }
        // create the data
        let entityType = 'users'
        let errors = [];
        let subDir = "userDir"

        let uploadSingleImage = await imageUpload(userImage.data, entityType, subDir, insertionData, userId, errors, 1, transaction)
        console.log(uploadSingleImage, '165 line facility image')
        if (errors.length > 0) {
          await transaction.rollback();
          if (errors.some(error => error.includes("something went wrong"))) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: errors })
          }
          return res.status(statusCode.BAD_REQUEST.code).json({ message: errors })
        }
        imageUpdateVariable = 1;

        console.log('inside image upload')
      }
      else if (userImage.fileId != 0) {
        console.log('inside file')
        let inactiveTheFileId = await file.update({ statusId: inActiveStatus },
          {
            where: {
              fileId: userImage.fileId
            },
            transaction
          }
        )

        console.log('fileid', inactiveTheFileId)
        let inActiveTheFileInFileAttachmentTable = await fileAttachement.update({
          statusId: inActiveStatus
        },
          {
            where: {
              fileId: userImage.fileId
            },
            transaction
          }
        )
        console.log('file update check', inactiveTheFileId, 'file attachemnt ', inActiveTheFileInFileAttachmentTable)

        if (inactiveTheFileId.length == 0 || inActiveTheFileInFileAttachmentTable == 0) {
          await transaction.rollback();
          return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: `Something went wrong`
          })
        }
        else {
          imageUpdateVariable = 1;
        }

      }
      else {
        await transaction.rollback();
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
          message: `Something went wrong`
        })
      }

    }
    console.log('user profile photo update -- end');
    //if params to update
    if (Object.keys(params).length > 0) {
      console.log("params update");
      params.updatedBy = userId;
      params.updatedDt = new Date();

      updatepublicUserCount = await users.update(params, {
        where: {
          [Op.and]: [{ userId: userId }, { statusId: 1 }]
        },
        transaction
      });
    }
    if (updatepublicUserCount >= 1 || docFileUpdateVariable == 1 || imageUpdateVariable == 1) {
      await transaction.commit();
      console.log('data updated');
      return res.status(statusCode.SUCCESS.code).json({
        message: "Profile updated successfully!",
      });
    } else {
      await transaction.rollback();
      return res.status(statusCode.BAD_REQUEST.code).json({
        message: "Profile updation failed!",
      });
    }
  }
  catch (error) {
    if (transaction) await transaction.rollback();
    logger.error(`An error occurred: ${error.message}`); // Log the error

    res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

let updateAvailability = async (req, res) => {
  let transaction = await sequelize.transaction();
  try {
    console.log("update availability");
    let { availabilityStatus } = req.body;
    let userId = req.user?.userId;

    // check if user availability record exists
    let userAvailability = await availabilityUser.findAll({
      where: {
        userId: userId
      },
      type: QueryTypes.SELECT
    }, transaction);
    console.log("user availability info", userAvailability, userAvailability.length);
    // return res.status(statusCode.SUCCESS.code).json({
    //   message: availabilityStatus == 1 ? 'Marked available for volunteering' : 'Marked unavailable for volunteering',
    //   userAvailability
    // });

    if (userAvailability.length > 0) {  // if records present, then update
      console.log(1)
      let [updateCount] = await availabilityUser.update({
        statusId: availabilityStatus,
        updatedBy: userId,
        updatedOn: new Date()
      }, {
        where: {
          userId: userId
        },
        transaction
      });
      console.log(2, updateCount);
      if(updateCount > 0) {
        console.log(3)
        await transaction.commit();
        return res.status(statusCode.SUCCESS.code).json({
          message: availabilityStatus == 1 ? 'Marked available for volunteering' : 'Marked unavailable for volunteering'
        });
      }
      else {
        console.log(4);
        await transaction.rollback();
        logger.error(`An error occurred: updating availability of volunteer failed.`); // Log the error
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
          message: 'something went wrong'
        })
      }
    }
    else {  // if records not present, then insert
      console.log(5)
      let insertAvailabilityData = await availabilityUser.create({
        userId: userId,
        statusId: availabilityStatus,
        createdBy: userId,
        createdOn: new Date()
      }, {
        transaction
      });
      console.log(6)
      if(insertAvailabilityData) {
        console.log(7)
        await transaction.commit();
        return res.status(statusCode.SUCCESS.code).json({
          message: availabilityStatus == 1 ? 'Marked available for volunteering' : 'Marked unavailable for volunteering',
          userAvailability, insertAvailabilityData
        });
      }
      else {
        console.log(8)
        await transaction.rollback();
        logger.error(`An error occurred: Inserting availability data failed`); // Log the error
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
          message: 'something went wrong'
        })
      }
    }
  } catch (error) {
    if (transaction) transaction.rollback();
    logger.error(`An error occurred: ${error.message}`); // Log the error

    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

module.exports = {
  createOtp,
  verifyOtp,
  loginWithOTP,
  loginWithOAuth,
  viewUserProfile,
  logout,
  signUp,
  volunteerRegistration,
  viewVolunteerProfileData,
  initialData,
  updateUserProfile,
  updateVolunteerProfileData,
  updateAvailability
}

