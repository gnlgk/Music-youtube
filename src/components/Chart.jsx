import React, { forwardRef, useContext, useEffect, useState } from 'react';
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

const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <button onClick={onClick} ref={ref}>
        <FcCalendar size={24} />
        <span>{value}</span>
    </button>
));

const Chart = ({ title, showCalendar, selectedDate, onDateChange, minDate, maxDate, data }) => {
    const { id} = useParams();
    const { searchKeyword } = useParams();

    const { addTrackToList, addTrackToEnd, playTrack, clearMusicData } = useContext(MusicPlayerContext);

    const [youtubeResults, setYoutubeResults] = useState([]);
    const [selectedTitle, setSelectedTitle] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [chartData, setChartData] = useState(data);

    useEffect(() => {
        if (searchKeyword) {
            console.log("Searching for:", searchKeyword);
            searchYoutube(searchKeyword);
        }
    }, [searchKeyword]);

    const searchYoutube = async (query) => {
        try {
            const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    part: 'snippet',
                    q: query,
                    type: 'video',
                    maxResults: 5,
                    key: process.env.REACT_APP_YOUTUBE_API_KEY,
                },
            });
            setYoutubeResults(response.data.items);
        } catch (error) {
            console.error('YouTube 검색에 실패했습니다.', error);
        }
    };

    const handlePlayAll = () => {
        clearMusicData([]);
        data.forEach(item => {
            addTrackToEnd(item);
        });
        playTrack(0);
    };

    const handleItemClick = (title) => {
        setSelectedTitle(title);
        searchYoutube(title);
    };

    const handlePlayNow = (result) => {
        const newTrack = {
            title: result.snippet.title,
            videoID: result.id.videoId,
            imageURL: result.snippet.thumbnails.default.url,
            artist: result.snippet.channelTitle,
            rank: 1
        };
        addTrackToList(newTrack);
        playTrack(0);
    };

    const handleAddToList = (result) => {
        const newTrack = {
            title: result.snippet.title,
            videoID: result.id.videoId,
            imageURL: result.snippet.thumbnails.default.url,
            artist: result.snippet.channelTitle,
            rank: 1
        };
        addTrackToEnd(newTrack);
        toast.success('리스트에 추가했습니다.');
    };

    const handleAddToPlaylistClick = (result) => {
        setSelectedTrack({
            title: result.snippet.title,
            videoID: result.id.videoId,
            imageURL: result.snippet.thumbnails.default.url,
            artist: result.snippet.channelTitle,
            rank: 1
        });
        setIsModalOpen(true);
    };

    const handleAddToPlaylist = (playlistId) => {
        const playlist = JSON.parse(localStorage.getItem(playlistId));
        if (playlist && selectedTrack) {
            playlist.items.push(selectedTrack);
            localStorage.setItem(playlistId, JSON.stringify(playlist));
        }
        setIsModalOpen(false);
    };

    const handleDeleteItem = (playlistId, title, index) => {
        const playlist = JSON.parse(localStorage.getItem(playlistId));
        const newData = [...chartData];
        newData.splice(index, 1);
        setChartData(newData);

        if (playlist) {
            const updatedItems = playlist.items.filter(item => item.title !== title);
            playlist.items = updatedItems;
            localStorage.setItem(playlistId, JSON.stringify(playlist));
        }

        toast.success('항목을 삭제했습니다.');
    };

    const isUserCreatedFolder = (folderId) => {
        const userCreatedFolders = localStorage.getItem(folderId);
        return !!userCreatedFolders;
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
                    {isUserCreatedFolder(id) && (
                        <button onClick={handlePlayAll}>전체목록재생하기</button>
                    )}
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
                                        e.stopPropagation();
                                        handleDeleteItem(id, item.title, index);
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
                track={selectedTrack} // 선택된 트랙을 모달에 전달
            />
        </>
    );
};

export default Chart;
