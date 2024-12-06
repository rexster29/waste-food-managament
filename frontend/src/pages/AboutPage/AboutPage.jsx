
import Header from "../../common/Header.jsx"
import SaveImage from "../../assets/Save_food.png"
import "./AboutPage.css"
import Footer from "../../common/footer.jsx"
import Mission_image from "../../assets/dis.png"
import { useSelector } from "react-redux"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom"

const About = () => {
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
        <div className="About_main_container">
            <Header />
            <ToastContainer />
            <div className="child_about_main_container">
                <div className="content_text">
                    <h1 className="text_about">From Your Hands to <br /> Those in Need
                        {/* <h2 className="text_about1"> without  Hunger</h2>  */}
                    </h1>
                    <p>
                        Whether it's donating essential items, clothing, or food, your support directly reaches those in need.
                    </p>
                    <span className="button_donate_volunteer">
                        <button className="donated_button" onClick={handleNavigation}>Donate Now</button>
                        {/* <button className="donated_button">Join as a volunteer</button> */}
                    </span>
                </div>
                <div className="set_image_food">
                    <img className="food-image" src={SaveImage}></img>
                </div>
            </div>
            <div className="mission_conatiner">
                <h1 className="text_mission">Our Mission</h1>
                <div className="mission_child_food">
                    <div className="image_mission_div">
                        <img className="mission_image" src={Mission_image}></img>
                    </div>
                    <div className="mission_content">
                        <h1>Mission</h1>
                        <p>
                            Our initiative is built on the belief that everyone has something valuable to give, and through collective generosity, 
                            we can make a lasting impact. By bridging communities, we connect those who are able to donate with individuals in need, 
                            fostering unity and compassion. Our mission is to fight inequality by ensuring that essential items reach the most vulnerable, 
                            helping to reduce disparity. With every donation, we create lasting change and a brighter future for those facing hardships. 
                            Your contributions provide not only material support but also hope and dignity to those who need it most.
                        </p>
                        <h1>Belief</h1>
                        <p>
                            Our belief is rooted in the idea that when we lift others, we elevate society as a whole. 
                            By providing essential goods to those in need, we strive to create a world where generosity bridges gaps and restores hope.
                        </p>
                    </div>

                </div>
            </div>
            {/* <div className="mission_child_food">
                <div className="mission_content">
                    <h1>How It Works</h1>
                    <p>Through our platform, food donors - whether</p>
                </div>
            </div> */}
            <Footer />
        </div>
    )
}

export default About;