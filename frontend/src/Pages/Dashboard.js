import { useNavigate } from "react-router-dom";
import "../Css/Dashboard.css";


function Dashboard(){

    const navigate = useNavigate();


    const name = localStorage.getItem("userName");


    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("userName");

        navigate("/login");

    };


    return(

        <div className="dashboard">

            <h1>
              Welcome {name} 👋
            </h1>


            <p>
              Manage your trips with TravelMet
            </p>


            <button onClick={logout}>
              Logout
            </button>


        </div>

    );

}


export default Dashboard;