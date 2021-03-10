import React from 'react'
import { COLORS_NAME } from '../model/constants.js'

class Piece extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false
        }
    }

    errorImage(){
        this.setState({
            error: true
        })
    }

    render() {
        let img = '/assets/pieces/' + this.props.piece.name + COLORS_NAME[this.props.piece.color] + '.svg';
        if (this.state.error){
            img = '/assets/pieces/Error.svg';
        }
        return (
        <React.Fragment>
            <div className="piece-container">
                <img src={`${process.env.PUBLIC_URL}${img}`}
                     alt=''
                     className="piece"
                     onError={this.errorImage.bind(this)}
                ></img>
            </div>
        </React.Fragment>)
    }

}

export default Piece
