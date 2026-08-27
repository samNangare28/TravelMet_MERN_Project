import { Navigate } from "react-router-dom";

function CompanyProtectedRoute({ children }) {

    const token =
        localStorage.getItem("companyToken");

    const company =
        localStorage.getItem("company");


    if (!token || !company) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    return children;

}

export default CompanyProtectedRoute;