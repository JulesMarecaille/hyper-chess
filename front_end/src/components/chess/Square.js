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

    getQuarterOrHalf(indice, size){
        let part = "";
        if (size === 1){
            return "whole";
        }
        if (size === 2){ part = "half-"; }
        if (size === 4){ part = "quarter-"; }
        if (size === 3 && (indice === 0 || indice === 1)){ part = "quarter-"; }
        if (size === 3 && (indice === 2)){ part = "half-"; }
        if (indice === 0){ part += "one"; }
        if (indice === 1){ part += "two"; }
        if (indice === 2){ part += "three"; }
        if (indice === 3){ part += "four"; }
        return part;
    }

    drawMarker(){
        let option_marker = '';
        let marker = [];
        if (this.props.isAnOption) {
            let option_marker_class = "option-marker";
            if (this.props.optionMarkerColor){
                let options = this.props.optionMarkerColor.split(" ");
                let k = 0;
                for (let option of options){
                    let option_marker_class_color = "option-marker " + option + " " + this.getQuarterOrHalf(k, options.length);
                    marker.push(<div className="option marker-container"><div className={option_marker_class_color}></div></div>);
                    k++;
                }
                option_marker_class += " " + this.props.optionMarkerColor;
            } else {
                marker.push(<div className={option_marker_class}></div>);
            }
            return option_marker = <div className="option marker-container">{marker}</div>;
        }
    }

    render() {
        let piece = '';
        let check_marker = '';
        let option_marker = this.drawMarker();
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
