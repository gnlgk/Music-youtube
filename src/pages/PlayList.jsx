import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Chart from '../components/Chart';

const Playlist = () => {
    const { id } = useParams();
    const [playlist, setPlaylist] = useState({ name: '', items: [] });
    const [loading, setLoading] = useState(true);

    

    useEffect(() => {
        try {
            const storedPlaylist = JSON.parse(localStorage.getItem(id)) || { name: '', items: [] };
            setPlaylist(storedPlaylist);
        } catch (error) {
            console.error("Failed to parse playlist from localStorage:", error);
            setPlaylist({ name: '', items: [] });
        } finally {
            setLoading(false);
        }
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <section id="playlist">
            {playlist.items.length > 0 ? (
                <Chart
                    title={`${playlist.name} List`}
                    data={playlist.items}
                    showCalendar={false}
                />
            ) : (
                <section className='music-chart'>
                    <div className="title">
                        <h2>🎶 {`${playlist.name}`}</h2>
                    </div>
                    <div className="list">
                        <ul>
                            <li>!!아직 리스트가 없습니다. 노래를 추가해주세요!</li>
                        </ul>
                    </div>
                </section>
            )}
        </section>
    );
}

export default Playlist;
