
import Header from "../../common/Header";
import "./fooddetails.css"
const FoodDetails = () => {
    return (
        <div className="main_conatiner_fooddetails">
            <Header />
            <div className="child_conatiner_fooddetails">
                <div className="name_child">
                    <h1>Mantosh Das</h1>
                    <p>(You will be notified once your request is accepted)</p>
                    <p>Matosree Building, C/O ORF, Duplex 4, Centre Point, Near, Tulasi Vihar</p>
                    <p>Contact No : <p1>8383838284</p1></p>
                </div>
               <div className="food_list">
                  <h1>Food Lists</h1>
               </div>
            </div>
        </div>
    );
};

export default FoodDetails;
