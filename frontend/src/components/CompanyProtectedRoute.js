import { Navigate } from "react-router-dom";

function CompanyProtectedRoute({ children }) {

    const companyToken =
        localStorage.getItem("companyToken");

    const company =
        localStorage.getItem("company");

    if (!companyToken || !company) {

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
