import React from 'react'
import { useParams } from 'react-router-dom';
import Chart from '../components/Chart';

const SearchList = () => {
    const { searchKeyword } = useParams();

    return (
        <div>
            <h1>{searchKeyword}를 검색한 결과입니다</h1>
            <Chart searchKeyword={searchKeyword} />
        </div>
    );
}

export default SearchList
