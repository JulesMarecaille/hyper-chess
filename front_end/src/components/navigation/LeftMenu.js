import React from 'react'
import { Link } from 'react-router-dom';
import { MdHome, MdVideogameAsset, MdStore, MdPowerSettingsNew, MdPerson } from 'react-icons/md';
import { FaChessBishop } from 'react-icons/fa';
import { GiLockedChest } from 'react-icons/gi';
import '../style.css'

class LeftMenu extends React.Component {
    state = {}


    isSelected(route){
        return (route === this.props.location ? "selected" : "")
    }

    render() {
        return (
        <React.Fragment>
            <div className="leftmenu">
                <div className="menu-title">
                    Hyper Chess
                </div>
                <div className="content">
                    <Link to="/home">
                        <div className={`entry ${this.isSelected("/home")}`}>
                            <MdHome className="icon"/>
                            <span className="name">Home</span>
                        </div>
                    </Link>
                    <Link to="/play">
                        <div className={`entry ${this.isSelected("/play")}`}>
                            <MdVideogameAsset className="icon"/>
                            <span className="name">Play</span>
                        </div>
                    </Link>
                    <Link to="/decks">
                        <div className={`entry ${this.isSelected("/decks")}`}>
                            <FaChessBishop className="icon"/>
                            <span className="name">Decks</span>
                        </div>
                    </Link>
                    <Link to="/shop">
                        <div className={`entry ${this.isSelected("/shop")}`}>
                            <MdStore className="icon"/>
                            <span className="name">Shop</span>
                        </div>
                    </Link>
                    <Link to="/collection">
                        <div className={`entry ${this.isSelected("/collection")}`}>
                            <GiLockedChest className="icon"/>
                            <span className="name">Collection</span>
                        </div>
                    </Link>
                </div>
                <div className="bottom content">
                    <div className={`entry ${this.isSelected("/profile")}`} onClick={this.props.onLogout}>
                        <MdPerson className="icon"/>
                        <span className="name">{this.props.user.name}</span>
                    </div>
                    <div className="entry" onClick={this.props.onLogout}>
                        <MdPowerSettingsNew className="icon"/>
                        <span className="name">Logout</span>
                    </div>
                </div>
            </div>
        </React.Fragment>)
    }
}

export default LeftMenu
