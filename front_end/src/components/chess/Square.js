import React from 'react'
import PieceImage from './PieceImage'

class Square extends React.Component {

    state = {
    }

    handleClick(evt){
        this.props.onClick(this.props.square);
    }

    handleDragStart(evt){
        this.props.dragStart(evt, this.props.square);
    }

    handleDragOver(evt){
        evt.preventDefault();
        evt.dataTransfer.dropEffect = "move";
        this.props.dragOver(this.props.square);
    }

    getColorClass(evt){
        if(this.props.isPremove){
            return "premove"
        } else if(this.props.isSelected){
            return "selected"
        } else if(this.props.isLastMove){
            return "last-move"
        }
        return "";
    }

    drawOverlayNumber(piece){
        if (!piece){
            return ;
        }
        let number = piece.getDisplayNumber();
        if (number === null){
            return ;
        }
        return(
            <div className="overlay-number">{number}</div>);
    }

    render() {
        let option_marker = '';
        let piece = '';
        let check_marker = '';
        // Add option marker if square is a move option
        if (this.props.isAnOption) {
            option_marker = <div className="option marker-container"><div className="option-marker"></div></div>
        }
        // Add Piece if there's a piece on this square
        if (this.props.piece) {
            piece = <PieceImage piece={this.props.piece}
                           dragStart={this.handleDragStart.bind(this)}
                           dragEnd={this.props.dragEnd}
                           dragging={this.props.dragging}
                           isDraggable={this.props.isDraggable}/>
        }
        //Add check marker if this piece is in check
        if (this.props.isCheck){
            check_marker = <div className="check marker-container"><div className="check-marker"></div></div>
        }
        // Add style if the Square is selected or if it's pointable by the player
        return (
        <React.Fragment>
            <td className={`${this.props.color} ${this.props.isClickable ? "clickable" : ""} ${this.getColorClass()}`}
                onClick={this.handleClick.bind(this)}
                onDragOver={this.handleDragOver.bind(this)}>
                {option_marker}
                {piece}
                {this.drawOverlayNumber(this.props.piece)}
                {check_marker}
            </td>
        </React.Fragment>)
    }
}

export default Square
