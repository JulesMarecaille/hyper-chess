import React from 'react'
import Piece from './Piece'

class Square extends React.Component {

    state = {
    }

    handleClick(evt){
        this.props.onClick(this.props.square);
    }

    render() {
        let option_marker = '';
        let piece = '';
        // Add option marker if square is a move option
        if (this.props.isAnOption) {
            option_marker = <div className="option-marker-container"><div className="option-marker"></div></div>
        }
        // Add Piece if there's a piece on this square
        if (this.props.piece) {
            piece = <Piece piece={this.props.piece}/>
        }
        // Add style if the Square is selected or if it's pointable by the player
        return (
        <React.Fragment>
            <td className={`${this.props.color} ${this.props.isSelected ? "selected" : ""} ${this.props.isClickable ? "clickable" : ""}`}
                onClick={this.handleClick.bind(this)}>
                {option_marker}
                {piece}
            </td>
        </React.Fragment>)
    }
}

export default Square