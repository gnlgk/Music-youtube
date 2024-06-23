import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { FcRating, FcPlus, FcApproval } from "react-icons/fc";
import { GiMusicalNotes } from "react-icons/gi";

const Header = () => {
    // Create input박스 표시 여부 상태
    const [showInput, setShowInput] = useState(false);
    // 새 항목의 제목 상태
    const [newItem, setNewItem] = useState('');
    // 플레이리스트 개수 상태
    const [playlistCount, setPlaylistCount] = useState(0);
    

    // 컴포넌트가 마운트될 때 실행되는 useEffect
    useEffect(() => {
        // 로컬 스토리지에서 플레이리스트 개수를 가져와 상태를 업데이트합니다.
        const count = localStorage.getItem('playlistCount') || 0;
        setPlaylistCount(Number(count));
    }, []);

    // 입력 박스 표시 함수
    const handleAddClick = () => {
        setShowInput(true);
    };

    // 입력 값 변경 시 호출되는 함수
    const handleInputChange = (e) => {
        setNewItem(e.target.value); // 입력 값 업데이트
    };

    // 새 항목 추가 함수
    const handleAddItem = () => {
        if (newItem.trim() !== '') { // 입력 값이 비어있지 않은 경우
            const newCount = playlistCount + 1; // 새로운 플레이리스트 번호
            const playlistKey = `playlist${newCount}`; // 플레이리스트 키 (예: playlist1, playlist2)
            const newPlaylist = {
                id: playlistKey,
                name: newItem,
                items: [] // 초기 항목 배열
            };

            // 로컬 스토리지에 새 플레이리스트 추가
            localStorage.setItem(playlistKey, JSON.stringify(newPlaylist));
            // 플레이리스트 개수 업데이트
            localStorage.setItem('playlistCount', newCount.toString());
            setPlaylistCount(newCount); // 상태 업데이트
            setNewItem(''); // 입력 값 초기화
            setShowInput(false); // 입력 박스 숨기기
        }
    };

    // 플레이리스트 삭제 함수
    const deletePlaylist = (playlistKey) => {
        localStorage.removeItem(playlistKey); // 로컬 스토리지에서 플레이리스트 삭제
        const updatedCount = playlistCount - 1;
        localStorage.setItem('playlistCount', updatedCount.toString()); // 플레이리스트 개수 업데이트
        setPlaylistCount(updatedCount);
    };

    // 플레이리스트 링크 배열 생성
    const playlistLinks = [];
    for (let i = 1; i <= playlistCount; i++) {
        const playlistKey = `playlist${i}`;
        const playlist = JSON.parse(localStorage.getItem(playlistKey));
        playlistLinks.push(
            <li key={i}>
                {/* 플레이리스트 링크 생성 */}
                <Link to={`/playlist/${playlistKey}`}><span className='icon2'><FcApproval /></span>{playlist.name}</Link>
                {/* 플레이리스트 삭제 버튼 */}
                <button onClick={() => deletePlaylist(playlistKey)}>Del</button>
            </li>
        );
    }

    return (
        <header id='header' role='banner'>
            {/* 로고 및 메인 타이틀 */}
            <h1 className='logo'>
                <Link to='/'><GiMusicalNotes />My Music Chart</Link>
            </h1>
            {/* 차트 섹션 */}
            <h2>chart</h2>
            <ul>
                {/* 각 차트 페이지 링크 */}
                <li><Link to='chart/melon'><span className='icon'></span>Melon Chart</Link></li>
                <li><Link to='chart/bugs'><span className='icon'></span>Bugs Chart</Link></li>
                <li><Link to='chart/apple'><span className='icon'></span>Apple Chart</Link></li>
                <li><Link to='chart/genie'><span className='icon'></span>Genie Chart</Link></li>
                <li><Link to='chart/billboard'><span className='icon'></span>Billboard Chart</Link></li>
            </ul>
            {/* 플레이리스트 섹션 */}
            <h2>playlist</h2>
            <ul>
                {/* Mymusic 페이지 링크 */}
                <li><Link to='/mymusic'><span className='icon2'><FcRating /></span>Mymusic</Link></li>
                {/* 저장된 플레이리스트 링크들 */}
                {playlistLinks}
                {/* 새 플레이리스트 추가 및 삭제 기능 */}
                <li>
                    {showInput ? (
                        // 입력 박스 표시 상태일 때
                        <div className='text__box'>
                            <input
                                type='text'
                                value={newItem}
                                onChange={handleInputChange}
                            />
                            <button onClick={handleAddItem}>Add</button>
                        </div>
                    ) : (
                        // 입력 박스 표시 상태가 아닐 때
                        <Link to='#' onClick={handleAddClick}><span className='icon2'><FcPlus /></span>Create</Link>
                    )}
                </li>
            </ul>
        </header>
    );
}

export default Header;
