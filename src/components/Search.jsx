import React, { useState } from "react";
import { LuSearch } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const Search = () => {
    const [searchKeyword, setSearchKeyword] = useState('');
    const navigate = useNavigate();    

    const handleSearch = () => {
        // console.log(searchKeyword);
        if (searchKeyword) {
            navigate(`/${searchKeyword}`);
            setSearchKeyword('');
        }
    }

    return (
        <article className="search">
            <label htmlFor="searchInput">
                <LuSearch />
            </label>
            <input 
            type="text" 
            placeholder="Search" 
            id="searchInput"
            onChange={e => setSearchKeyword(e.target.value)}
            onKeyDown={e => {
                if (e.key === 'Enter') {
                    handleSearch();
                }
            }}
            />
        </article>
    );
};

export default Search;