import React, { forwardRef, useContext, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from './Modal';

import { FcCalendar } from 'react-icons/fc';
import { RiPlayListFill } from "react-icons/ri";

import { MdFormatListBulletedAdd, MdOutlinePlayCircleFilled, MdClose, MdHive } from 'react-icons/md';
import { MusicPlayerContext } from '../context/MusicPlayerProvider';
import { useParams } from 'react-router-dom';

// 달력 버튼을 커스터마이징하는 CustomInput 컴포넌트
const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <button onClick={onClick} ref={ref}>
        <FcCalendar size={24} />
        <span>{value}</span>
    </button>
));

const Chart = ({ title, showCalendar, selectedDate, onDateChange, minDate, maxDate, data }) => {
    const { id } = useParams(); // URL에서 차트리스트랑 플레이리스트의 id를 가져옵니다.

    const { addTrackToList, addTrackToEnd, playTrack, clearMusicData } = useContext(MusicPlayerContext); // 음악 플레이어 컨텍스트를 사용합니다.

    const [youtubeResults, setYoutubeResults] = useState([]); // 유튜브 검색 결과 상태
    const [selectedTitle, setSelectedTitle] = useState(null); // 선택된 타이틀 상태
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 오픈 상태
    const [selectedTrack, setSelectedTrack] = useState(null); // 선택된 트랙 상태
    const [chartData, setChartData] = useState(data); // 차트 데이터 상태
    // console.log(chartData)

    // 유튜브 API를 사용하여 검색을 수행하는 함수(검색결과 모달창)
    const searchYoutube = async (query) => {
        try {
            const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    part: 'snippet',
                    q: query,
                    type: 'video',
                    maxResults: 5,
                    key: 'AIzaSyAe0158qTGe-yXh3Qq3FHJ1jIfH6g6AExA',
                },
            });
            setYoutubeResults(response.data.items); // 검색 결과를 상태에 저장합니다.
            console.log(query)
        } catch (error) {
            console.error('YouTube 검색에 실패했습니다.', error); // 검색 실패 시 콘솔에 에러를 출력합니다.
        }
    };

    // 전체 목록을 재생하는 함수
    const handlePlayAll = () => {
        clearMusicData([]); // 기존 음악 데이터를 초기화합니다.
        data.forEach(item => {
            addTrackToEnd(item); // 각 트랙을 재생 목록에 추가합니다.
        });
        playTrack(0); // 첫 번째 트랙을 재생합니다.
    };

    // 아이템 클릭 시 유튜브 검색을 실행하는 함수
    const handleItemClick = (title) => {
        setSelectedTitle(title); // 선택된 타이틀을 상태에 저장합니다.
        searchYoutube(title); // 해당 타이틀로 유튜브 검색을 실행합니다.
    };

    // 즉시 재생하는 함수
    const handlePlayNow = (result) => {
        const newTrack = {
            title: result.snippet.title,
            videoID: result.id.videoId,
            imageURL: result.snippet.thumbnails.default.url,
            artist: result.snippet.channelTitle,
            rank: 1
        };
        addTrackToList(newTrack); // 새 트랙을 재생 목록에 추가합니다.
        playTrack(0); // 첫 번째 트랙을 재생합니다.
    };

    // 리스트에 추가하는 함수
    const handleAddToList = (result) => {
        const newTrack = {
            title: result.snippet.title,
            videoID: result.id.videoId,
            imageURL: result.snippet.thumbnails.default.url,
            artist: result.snippet.channelTitle,
            rank: 1
        };
        addTrackToEnd(newTrack); // 새 트랙을 리스트 끝에 추가합니다.
        toast.success('리스트에 추가했습니다.'); // 성공 메시지를 표시합니다.
    };

    // 모달을 통해 플레이리스트에 추가하는 함수
    const handleAddToPlaylistClick = (result) => {
        setSelectedTrack({
            title: result.snippet.title,
            videoID: result.id.videoId,
            imageURL: result.snippet.thumbnails.default.url,
            artist: result.snippet.channelTitle,
            rank: 1
        });
        setIsModalOpen(true); // 모달을 엽니다.
    };

    // 선택된 트랙을 특정 플레이리스트에 추가하는 함수
    const handleAddToPlaylist = (playlistId) => {
        const playlist = JSON.parse(localStorage.getItem(playlistId));
        if (playlist && selectedTrack) {
            playlist.items.push(selectedTrack); // 플레이리스트에 선택된 트랙을 추가합니다.
            localStorage.setItem(playlistId, JSON.stringify(playlist)); // 업데이트된 플레이리스트를 로컬스토리지에 저장합니다.
        }
        setIsModalOpen(false); // 모달을 닫습니다.
    };

    // 아이템을 삭제하는 함수
    const handleDeleteItem = (playlistId, title, index) => {
        const playlist = JSON.parse(localStorage.getItem(playlistId));
        const newData = [...chartData];
        newData.splice(index, 1); // 차트 데이터에서 해당 아이템을 제거합니다.
        setChartData(newData); // 업데이트된 차트 데이터를 상태에 저장합니다.

        if (playlist) {
            const updatedItems = playlist.items.filter(item => item.title !== title); // 플레이리스트에서 해당 아이템을 제거합니다.
            playlist.items = updatedItems; 
            localStorage.setItem(playlistId, JSON.stringify(playlist)); // 업데이트된 플레이리스트를 로컬스토리지에 저장합니다.
        }

        toast.success('항목을 삭제했습니다.'); // 성공 메시지를 표시합니다.
    };

    // 폴더가 사용자 생성 폴더인지 확인하는 함수
    const isUserCreatedFolder = (folderId) => {
        const userCreatedFolders = localStorage.getItem(folderId);
        return !!userCreatedFolders; // 사용자 생성 폴더인지 확인합니다.
    };

    return (
        <>
            <section className='music-chart'>
                <div className="title">
                    <h2>{title}</h2>
                    {showCalendar && (
                        <div className='date'>
                            <DatePicker
                                selected={selectedDate}
                                onChange={onDateChange}
                                dateFormat="yyyy-MM-dd"
                                minDate={minDate}
                                maxDate={maxDate}
                                customInput={<CustomInput />}
                            />
                        </div>
                    )}
                </div>
                <div className="alllist">
                    <button onClick={handlePlayAll}>전체목록재생하기</button>
                </div>
                <div className="list">
                    <ul>
                        {chartData.map((item, index) => (
                            <li key={index} onClick={() => handleItemClick(item.title)}>
                                <span className='rank'>#{item.rank}</span>
                                <span className='img' style={{ backgroundImage: `url(${item.imageURL})` }}></span>
                                <span className='title'>{item.title}</span>
                                {isUserCreatedFolder(id) && (
                                    <button className='deleteButton' onClick={(e) => {
                                        e.stopPropagation(); // 클릭 이벤트가 상위 요소로 전파되지 않도록 합니다.
                                        handleDeleteItem(id, item.title, index); // 아이템을 삭제합니다.
                                    }}>Del</button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
            {youtubeResults.length > 0 && (
                <section className='youtube-result'>
                    <h3><RiPlayListFill />  "{selectedTitle}"에 대한 유튜브 검색 결과입니다.</h3>
                    <ul>
                        {youtubeResults.map((result, index) => (
                            <li key={index}>
                                <span className='img' style={{ backgroundImage: `url(${result.snippet.thumbnails.default.url})` }}></span>
                                <span className='title'>{result.snippet.title}</span>
                                <span className='playNow' onClick={() => handlePlayNow(result)}>
                                    <MdOutlinePlayCircleFilled /><span className='ir'>노래듣기</span>
                                </span>
                                <span className='listAdd' onClick={() => handleAddToList(result)}>
                                    <MdFormatListBulletedAdd /><span className='ir'>리스트 추가하기</span>
                                </span>
                                <span className='chartAdd' onClick={() => handleAddToPlaylistClick(result)}>
                                    <MdHive /><span className='ir'>나의 리스트에 추가하기</span>
                                </span>
                            </li>
                        ))}
                    </ul>
                    <span className='close' onClick={() => setYoutubeResults([])}><MdClose /></span>
                </section>
            )}
            <ToastContainer />
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddToPlaylist={handleAddToPlaylist}
                track={selectedTrack} // 선택된 트랙을 모달에 전달합니다.
                
            />
        </>
    );
};

export default Chart;
