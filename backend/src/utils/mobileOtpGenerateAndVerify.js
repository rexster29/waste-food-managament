const fetch = require('node-fetch');

async function generateOTP(mobileNumber) {
    const apiKey = 'YOUR_API_KEY';
    const response = await fetch(`https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&route=q&message=Your%20OTP%20is%20{#AA#}&language=english&flash=0&numbers=${mobileNumber}`);
    const data = await response.json();
    return data;
}





async function verify1OTP(mobileNumber, otp) {
    const apiKey = 'YOUR_API_KEY';
    const response = await fetch(`https://www.fast2sms.com/dev/verify?authorization=${apiKey}&otp=${otp}&sender_id=FSTSMS&message_id=YOUR_MESSAGE_ID&mobile=${mobileNumber}&checksum=YOUR_CHECKSUM`);
    const data = await response.json();
    return data;
}
    






   



module.exports={
    generateOTP,
    verify1OTP
}