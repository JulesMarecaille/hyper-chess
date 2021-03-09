import React from 'react'
import { COLORS_NAME } from '../model/constants.js'

class Piece extends React.Component {
    constructor(props) {
        super(props);
        let img = '/assets/pieces/' + this.props.piece.name + COLORS_NAME[this.props.piece.color] + '.svg'
        this.state = {
            img: img
        };
    }

    useDefaultImage(){
        this.setState({
            img: '/assets/pieces/Error.svg'
        })
    }

    render() {
        return (
        <React.Fragment>
            <div className="piece-container">
                <img src={`${process.env.PUBLIC_URL}${this.state.img}`}
                     alt=''
                     className="piece"
                     onError={this.useDefaultImage.bind(this)}
                ></img>
            </div>
        </React.Fragment>)
    }

}

export default Piece
