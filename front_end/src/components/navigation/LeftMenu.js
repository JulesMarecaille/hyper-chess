import React from 'react'
import { Link } from 'react-router-dom';
import { MdHome, MdVideogameAsset, MdStore, MdPowerSettingsNew } from 'react-icons/md';
import { FaChessBishop } from 'react-icons/fa';
import '../style.css'

class LeftMenu extends React.Component {
    state = {
    }

    render() {
        return (
        <React.Fragment>
            <div className="leftmenu">
                <div className="menu-title">
                    Hyper Chess
                </div>
                <div className="content">
                    <Link to="/">
                        <div className="entry">
                            <MdHome className="icon"/>
                            <span className="name">Home</span>
                        </div>
                    </Link>
                    <Link to="/game">
                        <div className="entry">
                            <MdVideogameAsset className="icon"/>
                            <span className="name">Play</span>
                        </div>
                    </Link>
                    <Link to="/decks">
                        <div className="entry">
                            <FaChessBishop className="icon"/>
                            <span className="name">Decks</span>
                        </div>
                    </Link>
                    <Link to="/shop">
                        <div className="entry">
                            <MdStore className="icon"/>
                            <span className="name">Shop</span>
                        </div>
                    </Link>
                </div>
                <div className="bottom content">
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
