import food_dontaion_image from "../../assets/food_donation_home.jpeg"
import "./landingPage.css"
import ads_image from "../../assets/ad.jpg"
import what_to_do_1st_image from "../../assets/boy_food_image.png"
import Bike_ride_drivery_body from "../../assets/bike_ride_boyd.png"
import dis from "../../assets/dis.png"
import community_image from "../../assets/community.png"
import Header from "../../common/Header"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../common/footer"
import { useState, useEffect, useRef } from "react"
import landing_image from "../../assets/food_donation_home.jpeg"
import Landing_image2 from "../../assets/save_food_image1.jpg"
import Landing_image3 from "../../assets/Save_food_image_3.jpg"
import { useSelector } from "react-redux"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import googlePlayStore from "../../assets/google-play.svg";
import appleStore from "../../assets/apple.svg";

const LandingPage = () => {
    const navigate = useNavigate()
    const user = useSelector((state) => state.auth.user);
    // track the current image
    // Array of images to be swapped
    const images = [landing_image, Landing_image2, Landing_image3];

    // State to track the current image index
    const [currentIndex, setCurrentIndex] = useState(0);
    const trackRef = useRef(null)

    // Effect to change the background image every 5 seconds
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000);
        console.log("interval", intervalId);
        // Cleanup the interval on component unmount
        return () => clearInterval(intervalId);
    }, [images.length]);

    function handleNavigation(e) {
        // console.log("handle navigation");
        if (user) {
            navigate('/DonorDetails')
        }
        else {
            toast.error('Kindly log in or register first!')
        }
    }
    // Ads Auto slide / swap  image ------

    const image_Ads = [ads_image, Landing_image2, ads_image, Landing_image2];
    // handle Mouse Hovor
    // Function to pause the animation
    const handleMouseOver = () => {
        if (trackRef.current) {
            trackRef.current.style.animationPlayState = 'paused';
        }
    };

    // Function to resume the animation
    const handleMouseOut = () => {
        if (trackRef.current) {
            trackRef.current.style.animationPlayState = 'running';
        }
    };


    return (
        <div className="Landing_page_main_conatiner">
            <Header />
            <div className="image_content_conatiner" style={{
                backgroundImage: `linear-gradient(
          10deg,
          rgba(0, 0, 0, 0.9),
          rgba(0, 0, 0, 0.2)
        ), url(${images[currentIndex]})`,
            }}>
                <span className="image_text">
                    <h1>Donate What You Can, <br>
                    </br>Help Where It Counts</h1>
                    <p>
                        Your unused items have the power to make a difference. Every contribution counts, bringing communities together and making a lasting impact.
                    </p>
                    <span className="Button_on_image">
                        <button className="button-19" role="button" onClick={(e) => handleNavigation(e)}>Donate Now</button>
                        <button className="button-9" role="button" onClick={() => navigate('/AvailableFood')}>Explore donations</button>
                    </span>
                </span>
            </div>
            <div
                className="ads-carousel"
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
            >
                <div className="ads-track" ref={trackRef}>
                    {image_Ads.map((image, index) => (
                        <img
                            key={index}
                            className="ads-image"
                            src={image}
                            alt={`Ad ${index + 1}`}
                        />
                    ))}
                    {/* Duplicating images to make the transition seamless */}
                    {image_Ads.map((image, index) => (
                        <img
                            key={`duplicate-${index}`}
                            className="ads-image"
                            src={image}
                            alt={`Ad duplicate ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
            <div className="what_to_do">
                <div className="what_to_do_text">
                    <h1>What We Do ?</h1>
                    <p>
                        We have created a compassionate community where individuals unite to donate various essential items, and dedicated volunteers actively work to collect and distribute these donations to those in need. Our mission is to ensure that no one is deprived of basic necessities by delivering resources directly to charities and individuals who struggle to access them. Together, we are committed to making a difference and uplifting those who require support the most.
                    </p>
                </div>
                <div className="what_to_do_explain">
                    <div className="what_to_do_1st_container">
                        <div className="image_text_ads" onClick={(e) => { e.stopPropagation(); navigate("/Login") }}>
                            <div className="each_image_ads">
                                <img className="image_logo" src={what_to_do_1st_image} alt="Rescue Food"></img>
                                <p className="text_color">We rescue fresh leftover food from individuals, restaurants, grocery stores, caterers, and events as well as other goods such as clothes, electronics, etc.</p>
                                <h2 className="b_donor">Be a Donor    <FontAwesomeIcon icon={faArrowRight} /></h2>
                            </div>
                            <div className="each_image_ads" onClick={(e) => { e.stopPropagation(); navigate("/Login") }}>
                                <img className="image_logo" src={Bike_ride_drivery_body} alt="Bike Ride"></img>
                                <p className="text_color">Volunteers can join our team to help by collecting donations directly from donors, ensuring it reaches those in need.</p>
                                <h2 className="b_donor">Be a Volunteer    <FontAwesomeIcon icon={faArrowRight} /></h2>
                            </div>
                        </div>
                        <div className="image_text_ads">
                            <div className="each_image_ads" onClick={(e) => { e.stopPropagation(); navigate("/Login") }}>
                                <img className="image_logo" src={dis} alt="Distribution"></img>
                                <p className="text_color">We donate essentials directly to people or through charities, and facilitate communication between donors and volunteers.</p>
                                <h2 className="b_donor">Register Charity   <FontAwesomeIcon icon={faArrowRight} /></h2>
                            </div>
                            <div className="each_image_ads" onClick={(e) => { e.stopPropagation(); navigate("/Login") }}>
                                <img className="image_logo" src={community_image} alt="Community"></img>
                                <p className="text_color">We are building a compassionate community united to by connecting donors, volunteers, and those in need.</p>
                                <h2 className="b_donor">Join    <FontAwesomeIcon icon={faArrowRight} /></h2>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mobile-app-link">
                    <div>DOWNLOAD THE APP</div>
                    <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                        <a className="icon-app-link">
                            <img src={googlePlayStore} />
                        </a>
                        <a className="icon-app-link">
                            <img src={appleStore} />
                        </a>
                    </div>
                </div>
            </div>
            <Footer />
            <ToastContainer />
        </div>
    )
}
export default LandingPage;