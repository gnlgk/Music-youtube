import React, { useState, useEffect } from "react";
import { LuSearch } from "react-icons/lu"; // 검색 아이콘을 가져옵니다.
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 useNavigate 훅을 가져옵니다.
import axios from "axios"; // axios를 가져옵니다.

const Search = () => {
    const [searchKeyword, setSearchKeyword] = useState(''); // 검색 키워드를 상태로 관리합니다.
    const navigate = useNavigate(); // useNavigate 훅을 사용하여 페이지 이동을 처리합니다.
    const [youtubeResults, setYoutubeResults] = useState([]); // 유튜브 검색 결과 상태

    // 검색을 처리하는 함수입니다.
    const handleSearch = () => {
        // searchKeyword가 있을 때만 검색을 처리합니다.
        if (searchKeyword) {
            navigate(`/search/${searchKeyword}`); // 검색 키워드를 URL에 포함하여 페이지를 이동합니다.
            setSearchKeyword(''); // 검색이 끝난 후 검색 키워드를 초기화합니다.
        }
    };

    // 검색 키워드가 변경될 때마다 유튜브 검색을 실행합니다.
    useEffect(() => {
        const searchYoutube = async () => {
            try {
                const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                    params: {
                        part: 'snippet',
                        q: searchKeyword,
                        type: 'video',
                        maxResults: 5,
                        key: process.env.REACT_APP_YOUTUBE_API_KEY,
                    },
                });
                setYoutubeResults(response.data.items); // 검색 결과를 상태에 저장합니다.
                
            } catch (error) {
                console.error('YouTube 검색에 실패했습니다.', error); // 검색 실패 시 콘솔에 에러를 출력합니다.
            }
        };

        if (searchKeyword) {
            searchYoutube(); // 검색 키워드가 변경될 때마다 유튜브 검색을 실행합니다.
        }
    }, [searchKeyword]);

    return (
        <article className="search">
            <label htmlFor="searchInput">
                <LuSearch /> {/* 검색 아이콘을 표시합니다. */}
            </label>
            <input 
                type="text" 
                placeholder="Search" 
                id="searchInput"
                // 검색 입력이 변경될 때마다 검색 키워드 상태를 업데이트합니다.
                onChange={e => setSearchKeyword(e.target.value)}
                // 엔터 키를 눌렀을 때 검색을 처리합니다.
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
