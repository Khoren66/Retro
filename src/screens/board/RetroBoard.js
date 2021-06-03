import React from 'react';
import Header from '../../components/Header';
import Board from '../../components/Board';
import "./retroBoard.css"

const RetroBoard = () => {
    return (
        <div className='wrapper-scroll'>
            <Board/>
        </div>
    );
};

export default RetroBoard;