const db = require("../../../models/index");
const { contactRequest, files, fileAttachments, sequelize } = db;
let statusCode = require("../../../utils/statusCode");
const imageUpload = require("../../../utils/imageUpload");
const { QueryTypes } = require("sequelize");
const logger = require('../../../logger/index.logger');
const sendEMail = require("../../../utils/generateEmail");

let contact = async (req, res) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        let { firstName, lastName, email, phoneNumber, message } = req.body;
        console.log({ firstName, lastName, email, phoneNumber, message })
        let missingInfo = [];
        if(!firstName)
            missingInfo.push('First Name');
        if(!email || !phoneNumber)
            missingInfo.push('Email/Phone Number');
        if(!message)
            missingInfo.push('Message');

        if(missingInfo.length > 0) {
            return res.status(statusCode.BAD_REQUEST.code).json({
                message: `Please provide the following data: ${missingInfo.toString()}.`
            })
        }
        // insert data
        let insertContactInfo = await contactRequest.create({
            firstName, 
            lastName, 
            email, 
            phoneNumber, 
            message, 
            statusId: 1,
        }, { transaction });

        if(insertContactInfo) {
            try {
                let messageBody = `
                    <p>I hope this message finds you well!</p>
                    <p>Below are the details of the consumer who has recently engaged with your business:</p>
                    <h3>Contact Details:</h3>
                    <p>Name: ${firstName} ${lastName}</p>
                    <p>Email: ${email || 'NA'}</p>
                    <p>Mobile No: ${phoneNumber || 'NA'}</p>
                    <p>Message: ${message || 'NA'}</p>
                `;
                let option = {
                    email: process.env.MAIL_USERNAME,
                    subject: 'Contact Request ' + new Date().toLocaleDateString(),
                    html: messageBody
                }
                await sendEMail(option);
                await transaction.commit();
                return res.status(statusCode.CREATED.code).json({
                    message: "Your message is received. Thanks for reaching out!"
                })
            }
            catch(error) {
                await transaction.rollback();
                return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                    message: "Something went wrong!"
                })
            }
        }
        else {
            await transaction.rollback();
            return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                message: "Something went wrong!"
            })
        }
    }
    catch (error) {
        await transaction.rollback();
        logger.error(`An error occurred: ${error.message}`); // Log the error
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}

module.exports = {
    contact
}