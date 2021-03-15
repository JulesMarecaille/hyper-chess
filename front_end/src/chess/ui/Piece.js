import React from 'react'
import { COLORS_NAME } from '../model/constants.js'

class Piece extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
        }
    }

    errorImage(){
        this.setState({
            error: true
        })
    }

    render() {
        let img = process.env.PUBLIC_URL + '/assets/pieces/' + this.props.piece.name + COLORS_NAME[this.props.piece.color] + '.svg';
        if (this.state.error){
            img = process.env.PUBLIC_URL + '/assets/pieces/Error.svg';
        }
        return (
        <React.Fragment>
            <div className="piece-container">
                <div style={{backgroundImage: `url(${img})`}}
                     onDragStart={this.props.dragStart}
                     onDrag={this.props.dragging}
                     onDragEnd={this.props.dragEnd}
                     className="piece"
                     draggable={this.props.isDraggable}>
                </div>
            </div>
        </React.Fragment>)
    }

    /*
    onDragStart={this.props.onDragStart}
    onDragEnd={this.props.onDragEnd}
    draggable={true}
    */

}

export default Piece
