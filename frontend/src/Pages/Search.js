import { useState, useEffect, useCallback, useRef } from "react";
import api from "../api/axios";
import UserSearchResult from "../components/UserSearchResult";
import "../Css/Search.css";

const DEBOUNCE_MS = 350;

function Search() {

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const debounceRef = useRef(null);

    const runSearch = useCallback(async (term) => {

        try {

            setLoading(true);

            const response = await api.get(
                "/api/users/search/query",
                { params: { q: term } }
            );

            setResults(response.data.users);
            setSearched(true);

        } catch (error) {

            console.log("Search Users Error:", error);
            setResults([]);

        } finally {

            setLoading(false);

        }

    }, []);

    useEffect(() => {

        clearTimeout(debounceRef.current);

        const trimmed = query.trim();

        if (!trimmed) {

            setResults([]);
            setSearched(false);
            return;

        }

        debounceRef.current = setTimeout(() => {
            runSearch(trimmed);
        }, DEBOUNCE_MS);

        return () => clearTimeout(debounceRef.current);

    }, [query, runSearch]);

    return (

        <div className="search-page">

            <h2 className="search-page-title">
                Find travellers
            </h2>

            <div className="profile-search-input-wrap search-page-input-wrap">

                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="profile-search-icon"
                >
                    <circle cx="11" cy="11" r="7" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>

                <input
                    type="text"
                    placeholder="Search by name or username..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="profile-search-input"
                    autoFocus
                />

            </div>

            <div className="search-page-results">

                {loading ? (

                    <p className="profile-search-empty">
                        Searching...
                    </p>

                ) : results.length === 0 && searched ? (

                    <p className="profile-search-empty">
                        No users found.
                    </p>

                ) : results.length === 0 ? (

                    <p className="profile-search-empty">
                        Search for a traveller by name or username.
                    </p>

                ) : (

                    results.map((user) => (
                        <UserSearchResult
                            key={user._id}
                            user={user}
                        />
                    ))

                )}

            </div>

        </div>

    );

}

export default Search;
