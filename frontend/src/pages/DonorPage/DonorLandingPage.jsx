
import Header from "../../common/Header";
import "./DonorLandingPage.css";
import Ads_image from "../../assets/ad.jpg"
import dis_image from "../../assets/dis.png"
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Footer from "../../common/footer";

const DonorLandingPage = () => {
    const user = useSelector((state) => state.auth.user);

    return (
        <div className="main_conatiner_DonorPage">
            <Header />
            <div className="Child_conatiner_DonorPage">
                <span className="Profile_details_section">
                    <h1>{user.username.name}</h1>
                </span>
                <span className="Profile_section">
                    <img className="image_profile" src="https://img.freepik.com/free-photo/portrait-man-laughing_23-2148859448.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1725494400&semt=ais_hybrid"></img>
                </span>
            </div>
            <div className="Ads_conatiner">
                <img className="Ads_image" src={Ads_image}></img>
                <img className="Ads_image" src={Ads_image}></img>
                <img className="Ads_image" src={Ads_image}></img>
                <img className="Ads_image" src={Ads_image}></img>
            </div>
            <div className="exp_donot">
                <div className="Button_donor">
                    <Link to={"/DonorDetails"}><button className="button-5" role="button">Donate</button></Link>
                    <Link to={"/DonateHistory"}><button className="button-5" role="button">Donation history</button></Link>
                    <Link to={"/AvailableFood"}><button className="button-5" role="button">Explore food requests</button></Link>
                </div>
                <div className="donor_details">
                    <img className="dis_image"  src={dis_image}></img>
                    <p>A hundred years from now it will not matter what your bank account was, the sort of house you lived in, or the kind of clothes you wore, but the world may be much different because you were important in the life of a child. </p>
                    <h5>Donate</h5>
                </div>
            </div>
            <Footer />
        </div>
    )
}
export default DonorLandingPage;