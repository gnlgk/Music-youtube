import React, { createContext, useEffect, useState } from 'react'

export const MusicPlayerContext = createContext();

const MusicPlayerProvider = ({ children }) => {
    // 음악 데이터를 저장할 상태 변수
    const [musicData, setMusicData] = useState([]);
    // 현재 재생 중인 트랙의 인덱스를 저장할 상태 변수
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    // 재생 상태를 저장할 상태 변수 (재생 중인지 여부)
    const [isPlaying, setIsPlaying] = useState(false);
    // 현재 재생된 시간(초)을 저장할 상태 변수
    const [played, setPlayed] = useState(0);
    // 트랙의 총 길이(초)를 저장할 상태 변수
    const [duration, setDuration] = useState(0);
    // 셔플 모드 상태를 저장할 상태 변수
    const [isShuffling, setIsShuffling] = useState(false);
    // 반복 재생 모드 상태를 저장할 상태 변수
    const [isRepeating, setIsRepeating] = useState(false);
    // 볼륨
    const [volume, setVolume] = useState(50);               // 볼륨

    // 컴포넌트가 처음 마운트될 때 음악 데이터를 불러옵니다.
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`./music-data/Daewon.json`);
                const data = await response.json();
                setMusicData(data);
                // console.log(data);
            } catch (error) {
                console.error('데이터를 가져오는데 실패했습니다.', error);
            }
        };
        fetchData();
    }, []);

    // 특정 트랙을 재생하는 함수
    const playTrack = (index) => {
        setCurrentTrackIndex(index);
        setIsPlaying(true);
        setPlayed(0);
    };

    // 현재 트랙을 일시 정지하는 함수
    const pauseTrack = () => {
        setIsPlaying(false);
    };

    // 다음 트랙으로 넘어가는 함수
    const nextTrack = () => {
        if (isShuffling) {
            // 셔플 모드일 경우 랜덤한 트랙을 재생합니다.
            setCurrentTrackIndex(Math.floor(Math.random() * musicData.length));
        } else {
            // 셔플 모드가 아닐 경우 다음 트랙을 재생합니다.
            setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % musicData.length);
        }
        setIsPlaying(true);
        setPlayed(0);
    };

    // 이전 트랙으로 돌아가는 함수
    const prevTrack = () => {
        setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + musicData.length) % musicData.length);
        setIsPlaying(true);
        setPlayed(0);
    };

    // 재생된 시간을 업데이트하는 함수
    const updatePlayed = (played) => {
        setPlayed(played);
    };

    // 트랙의 총 길이를 업데이트하는 함수
    const updateDuration = (duration) => {
        setDuration(duration);
    };

    // 셔플 모드를 토글하는 함수
    const toggleShuffle = () => {
        setIsShuffling(!isShuffling);
    };

    // 반복 재생 모드를 토글하는 함수
    const toggleRepeat = () => {
        setIsRepeating(!isRepeating);
    };

    // 트랙이 끝났을 때 호출되는 함수
    const handleTrackEnd = () => {
        if (isRepeating) {
            // 반복 재생 모드일 경우 트랙을 처음부터 다시 재생합니다.
            setIsPlaying(true);
            setPlayed(0);
        } else {
            // 반복 재생 모드가 아닐 경우 다음 트랙을 재생합니다.
            nextTrack();
        }
    };

    // 재생 목록에 트랙을 추가하는 함수
    const addTrackToList = (track) => {
        setMusicData((prevMusicData) => [track, ...prevMusicData]);
    };

    // 재생 목록의 끝에 트랙을 추가하는 함수
    const addTrackToEnd = (track) => {
        setMusicData((prevMusicData) => [...prevMusicData, track]);
    };

    // 재생 목록을 초기화하는 함수
    const clearMusicData = () => {
        setMusicData([]);
    };

    //볼륨
    const handleVolume = (e) => setVolume(parseInt(e.target.value, 10) / 100);


    return (
        <MusicPlayerContext.Provider 
        value={{ 
            musicData,  // 현재 음악 데이터
            currentTrackIndex,  // 현재 재생 중인 트랙의 인덱스
            isPlaying,  // 재생 상태
            played,  // 재생된 시간
            duration,  // 트랙의 총 길이
            isShuffling,
            isRepeating,
            volume,
            playTrack,  // 특정 트랙을 재생하는 함수
            pauseTrack,  // 현재 트랙을 일시 정지하는 함수
            nextTrack,  // 다음 트랙으로 넘어가는 함수
            prevTrack,  // 이전 트랙으로 돌아가는 함수
            updatePlayed,  // 재생된 시간을 업데이트하는 함수
            updateDuration,  // 트랙의 총 길이를 업데이트하는 함수
            toggleShuffle,  // 셔플 모드를 토글하는 함수
            toggleRepeat,  // 반복 재생 모드를 토글하는 함수
            handleTrackEnd, // 트랙이 끝났을 때 호출되는 함수
            addTrackToList,
            addTrackToEnd,
            clearMusicData, // 재생 목록을 초기화하는 함수
            handleVolume
        }}>
            {children}
        </MusicPlayerContext.Provider>
    )
}

export default MusicPlayerProvider
