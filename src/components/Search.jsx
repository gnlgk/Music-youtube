import React, { useState } from "react";
import { LuSearch } from "react-icons/lu"; // 검색 아이콘을 가져옵니다.
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 useNavigate 훅을 가져옵니다.
import axios from "axios"; // axios를 가져옵니다.

const Search = () => {
    const [searchKeyword, setSearchKeyword] = useState(''); // 검색 키워드를 상태로 관리합니다.
    const navigate = useNavigate(); // useNavigate 훅을 사용하여 페이지 이동을 처리합니다.
    const [youtubeResults, setYoutubeResults] = useState([]); // 유튜브 검색 결과 상태
    const [searched, setSearched] = useState(false); // 검색 여부를 상태로 관리합니다.

    // 검색을 처리하는 함수입니다.
    const handleSearch = async () => {
        // searchKeyword가 있을 때만 검색을 처리합니다.
        if (searchKeyword) {
            await searchYoutube(searchKeyword); // YouTube 검색 실행
            navigate(`/search/${searchKeyword}`); // 검색 키워드를 URL에 포함하여 페이지를 이동합니다.
            setSearchKeyword(''); // 검색이 끝난 후 검색 키워드를 초기화합니다.
            setSearched(true); // 검색을 수행했음을 표시합니다.
        }
    };

    // YouTube 검색을 실행하는 함수
    const searchYoutube = async (keyword) => {
        try {
            const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    part: 'snippet',
                    q: keyword,
                    type: 'video',
                    maxResults: 5,
                    key: process.env.REACT_APP_YOUTUBE_API_KEY,
                },
            });

            // 검색 결과를 JSON 형식으로 변환
            const results = response.data.items.map((item, index) => ({
                rank: index + 1,
                title: item.snippet.title,
                artist: item.snippet.channelTitle,
                imageURL: item.snippet.thumbnails.high.url,
                videoID: item.id.videoId,
            }));

            setYoutubeResults(results); // 검색 결과를 상태에 저장합니다.

            // JSON 파일로 저장 (예시: 콘솔에 출력)
            console.log(JSON.stringify(results, null, 2));
        } catch (error) {
            console.error('YouTube 검색에 실패했습니다.', error); // 검색 실패 시 콘솔에 에러를 출력합니다.
        }
    };

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
            {/* YouTube 검색 결과를 화면에 표시 */}
            <div className="results">
                {searched && youtubeResults.length === 0 ? (
                    <p>결과가 없습니다.</p>
                ) : (
                    youtubeResults.map(result => (
                        <div key={result.videoID} className="result-item">
                            <img src={result.imageURL} alt={result.title} />
                            <div>
                                <h3>{result.title}</h3>
                                <p>{result.artist}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </article>
    );
};

export default Search;
