import React, { useEffect, useState } from 'react'
import Header from "../../common/Header";
import Footer from "../../common/footer";
import "./ContactUs.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLocationDot, faPhone, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../../services/axios';
import api from '../../utils/apiList';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';

export default function ContactUs() {
    const [contactForm, setContactForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        message: ""
    });
    const navigate = useNavigate();
    const [captcha, setCaptcha] = useState(generateCaptcha(6));
    const [confirmCaptcha, setConfirmCaptcha] = useState('')

    async function submitForm(e) {
        e.preventDefault();
        console.log(contactForm);
        if (confirmCaptcha && captcha != confirmCaptcha) {
            toast.error('Please enter the valid captcha.');
        }
        if (contactForm.firstName && (contactForm.email || contactForm.phoneNumber) && contactForm.message && !confirmCaptcha) {
            toast.error("Please enter the captcha.");
        }
        let errors = validateUserInput();
        if (errors.length > 0) {
            toast.warn("Please fill the form properly.");
            return;
        }

        try {
            let res = await axiosInstance.post(api.CONTACT_US.url, contactForm);
            console.log("response at submitForm func", res.data.message);
            toast.success(res.data.message, {
                autoClose: 1000,
                onClose: () => {
                    setTimeout(navigate(0), 1000);
                }
            });
        }
        catch (error) {
            toast.error(error.response.data.message);
            console.error("Error at submit form func", error);
        }
    }

    function validateUserInput() {
        let errors = {};
        console.log(contactForm);
        let nameRegex = "^[A-Z][a-zA-Z'-]+(?:\s[A-Z][a-zA-Z'-]+)*$";
        let emailRegex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";
        let phoneRegex = "^[7-9]\d{9}$";
        let messageRegex = "^(?!.*[\p{Emoji}]).+?(\n|$)+";

        if(contactForm.firstName && !nameRegex.match(contactForm.firstName)) {
            errors.firstName = "Please provide a valid name."
        }

        if(!contactForm.email && !contactForm.phoneNumber) {
            errors.email = "Please provide either email or phone number.";
            errors.phoneNumber = "Please provide either email or phone number.";
        }

        if(contactForm.email && !emailRegex.match(contactForm.email)) {
            errors.email = "Please provide a valid email.";
        }

        if(contactForm.phoneNumber && !phoneRegex.match(contactForm.phoneNumber)) {
            errors.phoneNumber = "Please provide a valid phone number.";
        }

        if(contactForm.message && !messageRegex.match(contactForm.message)) {
            errors.message = "Please type a valid message and there should be no emoji."
        }

        return errors;
    }

    function generateCaptcha(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let captcha = '';
    
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            captcha += characters[randomIndex];
        }
    
        return captcha;
    }

    function drawRandomLines(ctx, width, height) {
        for (let i = 0; i < 8; i++) { // Draw 10 random lines
            ctx.beginPath();
            ctx.moveTo(Math.random() * width, Math.random() * height);
            ctx.lineTo(Math.random() * width, Math.random() * height);
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)'; // Light gray color
            ctx.lineWidth = 2; // Line width
            ctx.stroke();
        }
    }

    function generateAndDisplayCaptcha() {
        const captchaText = captcha;
        const canvas = document.getElementById('captcha-canvas');
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#aab7ca';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw random lines in the background
        drawRandomLines(ctx, canvas.width, canvas.height);

        // Set font properties
        ctx.font = 'italic 20px "Times New Roman"';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Draw the CAPTCHA text in the center of the canvas
        ctx.fillText(captchaText, canvas.width / 2, canvas.height / 2);
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setContactForm({...contactForm, [name]: value});
        console.log("contactForm at handleChange", contactForm);
    }

    useEffect(() => { }, [contactForm]);

    useEffect(() => { generateAndDisplayCaptcha(); }, [captcha]);

    useEffect(() => {
        generateAndDisplayCaptcha();
    }, [])

    return (
        <>
            <Header />
            <ToastContainer />
            <div className='contact-container'>
                <div className='contact-left'>
                    <div className='contact-header'>
                        <h5>Contact Information</h5>
                        <h6>Feel free to reach out to us.</h6>
                    </div>
                    <div className='contact-details'>
                        <div className='contact-number'><FontAwesomeIcon icon={faPhone} />&nbsp;&nbsp;+91-7077769335</div>
                        <div className='contact-email'><FontAwesomeIcon icon={faEnvelope} />&nbsp;&nbsp;soul@soulunileaders.com</div>
                        <div className='contact-address'><FontAwesomeIcon icon={faLocationDot} />&nbsp;&nbsp;E/42/D, Infocity Avenue, Chandaka Industrial Estate, Bhubaneswar, Odisha, India - 751024</div>
                    </div>
                    {/* <div className='contact-socials'>
                    </div> */}
                </div>
                <div className='contact-right'>
                    <div>
                        <label htmlFor="firstName">First Name</label>
                        <input name='firstName' className='input-data' type='text' maxLength={50} value={contactForm.firstName} onChange={handleChange}/>
                    </div>
                    <div>
                        <label htmlFor="lastName">Last Name</label>
                        <input name='lastName' className='input-data' type='text' maxLength={50} value={contactForm.lastName} onChange={handleChange} />
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input name='email' className='input-data' type='text' maxLength={50} value={contactForm.email} onChange={handleChange} />
                    </div>
                    <div>
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <input name='phoneNumber' className='input-data' type='text' maxLength={10} value={contactForm.phoneNumber} onChange={handleChange} />
                    </div>
                    <div>
                        <label htmlFor="message">Message</label>
                        <textarea name='message' className='textarea' maxLength={200} value={contactForm.message} onChange={handleChange} />
                    </div>
                    <span className='captcha-text'>
                        {/* <input type='text' value={captcha} disabled/> */}
                        <canvas id='captcha-canvas' width={100} height={30}>abcd</canvas>
                        <input name='captcha' className='input-data' type='text' maxLength={6} value={confirmCaptcha} onChange={(e) => setConfirmCaptcha(e.target.value)} />
                        <FontAwesomeIcon style={{cursor: 'pointer'}} icon={faRotateRight} onClick={(e) => { setCaptcha(generateCaptcha(6)); }}/>
                    </span>
                    <div>
                        <button className='contact-submit' onClick={submitForm}>Send Message</button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
