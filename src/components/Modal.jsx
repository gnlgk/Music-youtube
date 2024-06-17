import React, { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';

const Modal = ({ isOpen, onClose, onAddToPlaylist, track }) => {
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        if (isOpen) {
            const count = Number(localStorage.getItem('playlistCount')) || 0;
            const loadedPlaylists = [];
            for (let i = 1; i <= count; i++) {
                const playlistKey = `playlist${i}`;
                const playlist = JSON.parse(localStorage.getItem(playlistKey));
                if (playlist) {
                    loadedPlaylists.push(playlist);
                }
            }
            setPlaylists(loadedPlaylists);
        }
    }, [isOpen]);

    const handleAddClick = (playlistId) => {
        onAddToPlaylist(playlistId);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}><MdClose /></span>
                <h2>플레이리스트 선택</h2>
                {track ? (
                    <div>
                        <h3>선택된 트랙:</h3>
                        <p>제목: {track.title}</p>
                        <p>아티스트: {track.artist}</p>
                        <ul>
                            {playlists.map((playlist) => (
                                <li key={playlist.id}>
                                    {playlist.name}
                                    <button onClick={() => handleAddClick(playlist.id)}>추가</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p>트랙 정보가 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default Modal;
