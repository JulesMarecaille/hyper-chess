import React from 'react'
import { ViewShopBrowse, ViewShopPiece } from './shop'
import { Loader } from '../navigation';
import { InfoPanel } from '../navigation';

class ViewShop extends React.Component {
    constructor(props){
        super(props)
        this.state={
            selected_piece: new URLSearchParams(this.props.search).get("piece"),
            collection: [],
            is_loading: true,
            piece_bought: null
        }
    }

    componentWillMount(){
        this.refreshCollection();
    }

    refreshCollection(){
        this.setState({
            is_loading: true
        })
        this.props.api.getUserCollection(this.props.user.id).then((collection) => {
            this.setState({
                collection: collection,
                is_loading: false
            })
        }).catch((err) => {});
    }

    handlePieceBought(){
        this.refreshCollection();
        this.props.onUpdateUser();
        this.setState({
            piece_bought: this.state.selected_piece,
            selected_piece: null
        })
    }

    handlePieceSelected(piece){
        this.setState({
            selected_piece: piece,
            piece_bought: null
        })
    }

    render() {
        let content = '';
        let info = ''
        if(this.state.is_loading){
            content = <Loader/>
        } else if(this.state.selected_piece){
            content = (
                <ViewShopPiece api={this.props.api}
                               piece={this.state.selected_piece}
                               user={this.props.user}
                               isOwned={this.state.collection[this.state.selected_piece.name]}
                               onPieceBought={this.handlePieceBought.bind(this)}
                               onReturn={this.handlePieceSelected.bind(this)}/>
            )
        } else {
            content = (
                <ViewShopBrowse api={this.props.api}
                                user={this.props.user}
                                collection={this.state.collection}
                                onSelectedPiece={this.handlePieceSelected.bind(this)}
                                onUpdateUser={this.props.onUpdateUser}/>
            )
        }
        if(this.state.piece_bought){
            info = <InfoPanel message={`${this.state.piece_bought.label} has been purchased!`} type="success" isOpen={true}/>
        }
        return (
        <React.Fragment>
            {info}
            {content}
        </React.Fragment>)
    }
}

export default ViewShop
