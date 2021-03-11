import React from 'react'
import { FaChessPawn, FaChessKnight, FaChessBishop, FaChessRook, FaChessKing, FaChessQueen } from 'react-icons/fa';

class Loader extends React.Component {
    state = {
    }

    render() {
        return (
        <React.Fragment>
        <div class={`l-container ${this.props.size}`}>
            <div className='chess-loader'>
                <FaChessPawn className="pawn"/>
                <FaChessKnight className="knight"/>
                <FaChessRook className="rook"/>
                <FaChessQueen className="queen"/>
            </div>
        </div>
        </React.Fragment>)
    }
}

export default Loader
