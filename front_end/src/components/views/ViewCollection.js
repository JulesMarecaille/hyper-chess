import React from 'react'
import Piece from '../../chess/ui/Piece'
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Loader } from '../navigation';
import { FaLock, FaUnlock } from 'react-icons/fa'
import { PIECE_MAPPING } from '../../chess/model/pieces'
import { WHITE, BLACK } from '../../chess/model/constants'

class ViewCollection extends React.Component {
    state = {
        collection: {},
        is_loading: true
    }

    componentWillMount(){
        this.props.api.getUserCollection(this.props.user.id).then((collection) => {
            this.setState({
                is_loading: false,
                collection: collection
            })
        }).catch((err) => {
        });
    }

    drawCollection(){
        let collection = []
        for(const [piece_name, is_bought] of Object.entries(this.state.collection)){
            collection.push(this.drawPiece(piece_name, is_bought))
        }
        return <div >{collection}</div>
    }

    drawPiece(piece_name, is_bought){
        let piece = new PIECE_MAPPING[piece_name](WHITE);
        let piece_black = new PIECE_MAPPING[piece_name](BLACK);
        let lock = ''
        if(!is_bought){
            lock = (<div class="locked"><FaLock class="lock"/><FaUnlock class="unlock"/></div>);
        }
        return (
            <div className="entry">
                <div class="main-infos">
                    <div class="image">
                        <div class="white">
                            <Piece piece={piece}/>
                        </div>
                        <div class="black">
                            <Piece piece={piece_black}/>
                        </div>
                    </div>
                    <span class="name">{piece.label}</span>
                    <span class="positions"></span>
                    <span class="value">({piece.value})</span>
                    {lock}
                </div>
                <div class="more-infos">
                    <span class="description">{piece.description}</span>
                </div>
            </div>
        )
    }

    drawPiecePositions(piece){

    }

    render() {
        let content = '';
        if(this.state.is_loading){
            content = <div class="info-container"><Loader/></div>
        } else {
            content = this.drawCollection()
        }
        return (
        <React.Fragment>
            <p>My Collection</p>
            <PerfectScrollbar className="collection-container">
                {content}
            </PerfectScrollbar>
        </React.Fragment>)
    }
}

export default ViewCollection
