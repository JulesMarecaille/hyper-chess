import React from 'react'
import { ViewShopBrowse, ViewShopPiece } from './shop'

class ViewShop extends React.Component {
    constructor(props){
        super(props)
        this.state={
            piece: null
        }
    }

    render() {
        let content = ''
        if(this.state.piece){
            content = (
                <ViewShopPiece piece={this.state.piece}
                               isOwned={false}/>
            )
        } else {
            content = (
                <ViewShopBrowse api={this.props.api}
                                user={this.props.user}
                                onUpdateUser={this.props.onUpdateUser}/>
            )
        }
        return (
        <React.Fragment>
            {content}
        </React.Fragment>)
    }
}

export default ViewShop
