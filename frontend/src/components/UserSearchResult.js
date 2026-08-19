import { useNavigate } from "react-router-dom";

function UserSearchResult({ user, onSelect }) {

    const navigate = useNavigate();

    const handleClick = () => {

        if (onSelect) onSelect();

        navigate(`/profile/${user._id}`);

    };

    return (

        <div
            className="user-search-result"
            onClick={handleClick}
        >

            <img
                src={
                    user.profileImage ||
                    "https://i.pravatar.cc/100"
                }
                alt={user.username}
                className="user-search-avatar"
            />

            <div className="user-search-info">

                <p className="user-search-name">
                    {user.firstName} {user.lastName}
                </p>

                <span className="user-search-username">
                    @{user.username}
                </span>

            </div>

        </div>

    );

}

export default UserSearchResult;
