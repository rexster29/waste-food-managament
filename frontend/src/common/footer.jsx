
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./footer.css"
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";

const Footer = () => {
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();
    function handleNavigation(e) {
        // console.log("handle navigation");
        if (user) {
            console.log(1)
            navigate('/DonorDetails')
        }
        else {
            console.log(2)
            toast.error('Kindly log in or register first!')
        }
    }
    return (
        <footer>
            {/* <ToastContainer /> */}
            <span className="text_overcom">
                <h1>Transforming Generosity into Action</h1>
            </span>
            <div className="footer_button_vol_do">
                <button className="volunteer_button" onClick={(e) => { toast.info("Development inprogres..."); }}>VOLUNTEER</button>
                <button className="donate_button" onClick={handleNavigation}>DONATE</button>
            </div>
            <div className="content_footer">
                <div className="footer-section">
                    <h4>Navigation</h4>
                    <ul>
                        <li><Link to={'/DonorDetails'}>Donate now</Link></li>
                        <li><Link to={'/AvailableFood'}>Explore Donations</Link></li>
                        <li><Link to={'/About'}>About</Link></li>
                        <li><Link to={'/Contact'}>Contact us</Link></li>
                    </ul>
                </div>
                {/* 2nd */}
                <div className="footer-section">
                    <h4>TALK TO US</h4>
                    <ul>
                        <li>
                            {/* <FontAwesomeIcon icon={faEnvelope} /> */}
                            <b>Email:</b> <a href="mailto:soul@soulunileaders.com">soul@soulunileaders.com</a>
                        </li>
                        <li>
                            {/* <FontAwesomeIcon icon={faPhone} /> */}
                            <b>Phone:</b> <a href="tel:+917077769335">+91 7077769335</a>
                        </li>
                        <li>
                            {/* <FontAwesomeIcon icon={faLocationDot} /> */}
                            <p><b>Address:</b> E/42/D, Infocity Avenue, Chandaka Industrial Estate, Bhubaneswar, Odisha, India - 751024</p>
                        </li>
                    </ul>
                </div>
                {/* <div className="footer-section">
                    <h4>TALK TO US</h4>
                    <ul>
                        <li><a href="mailto:support@ercom.com">support@ercom.com</a></li>
                        <li><a href="tel:+6623991145">+66 2399 1145</a></li>
                        <li><a href="#">Contact Us</a></li>
                        <li><a href="https://facebook.com">Facebook</a></li>
                        <li><a href="https://linkedin.com">LinkedIn</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>TALK TO US</h4>
                    <ul>
                        <li><a href="mailto:support@ercom.com">support@ercom.com</a></li>
                        <li><a href="tel:+6623991145">+66 2399 1145</a></li>
                        <li><a href="#">Contact Us</a></li>
                        <li><a href="https://facebook.com">Facebook</a></li>
                        <li><a href="https://linkedin.com">LinkedIn</a></li>
                    </ul>
                </div> */}

            </div>
            <span className="copy_right">
                <h1>© 2024 SOUL Limited. All Rights Reserved.</h1>
            </span>
        </footer>
    )
}

export default Footer;