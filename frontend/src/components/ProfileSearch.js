import { useState, useEffect, useRef, useCallback } from "react";
import api from "../api/axios";
import UserSearchResult from "./UserSearchResult";
import "../Css/Search.css";

const DEBOUNCE_MS = 350;

function ProfileSearch() {

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [searched, setSearched] = useState(false);

    const wrapperRef = useRef(null);
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

    // Close on outside click.
    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target)
            ) {
                setOpen(false);
            }

        };

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

    }, []);

    return (

        <div className="profile-search-wrap" ref={wrapperRef}>

            <div className="profile-search-input-wrap">

                <svg
                    width="16"
                    height="16"
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
                    placeholder="Search travellers..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    className="profile-search-input"
                />

            </div>

            {open && query.trim() && (

                <div className="profile-search-dropdown">

                    {loading ? (

                        <p className="profile-search-empty">
                            Searching...
                        </p>

                    ) : results.length === 0 && searched ? (

                        <p className="profile-search-empty">
                            No users found.
                        </p>

                    ) : (

                        results.map((user) => (
                            <UserSearchResult
                                key={user._id}
                                user={user}
                                onSelect={() => {
                                    setOpen(false);
                                    setQuery("");
                                }}
                            />
                        ))

                    )}

                </div>

            )}

        </div>

    );

}

export default ProfileSearch;
