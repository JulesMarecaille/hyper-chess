import React from 'react'
import { Link } from 'react-router-dom';
import { MdHome, MdVideogameAsset, MdStore, MdPowerSettingsNew, MdPerson, MdShowChart } from 'react-icons/md';
import { FaChessBishop } from 'react-icons/fa';
import { GiLockedChest } from 'react-icons/gi';
import { BiCoin } from 'react-icons/bi'
import { ImTrophy } from 'react-icons/im';
import '../style.css'
import { withRouter } from 'react-router-dom';

class LeftMenu extends React.Component {
    state = {}


    isSelected(route, search=''){
        return ((route === this.props.location.pathname && search === this.props.location.search) ? "selected" : "")
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
                            <span className="name">My decks</span>
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
                            <span className="name">My collection</span>
                        </div>
                    </Link>
                    <Link to="/leaderboard">
                        <div className={`entry ${this.isSelected("/leaderboard")}`}>
                            <ImTrophy className="icon"/>
                            <span className="name">Leaderboard</span>
                        </div>
                    </Link>
                </div>
                <div className="bottom content">
                    <Link to={"/profile?id=" + this.props.user.id}>
                        <div className={`entry ${this.isSelected("/profile", "?id="+this.props.user.id)}`}>
                            <div>
                                <div class="main">
                                    <MdPerson className="icon"/>
                                    <span className="name">{this.props.user.name}</span>
                                </div>
                                <div className="sub green">
                                    <MdShowChart className="icon"/>
                                    <span className="name">{this.props.user.elo}</span>
                                </div>
                                <div className="sub coins">
                                    <BiCoin className="icon"/>
                                    <span className="name">{this.props.user.coins}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                    <div className="entry" onClick={this.props.onLogout}>
                        <MdPowerSettingsNew className="icon"/>
                        <span className="name">Logout</span>
                    </div>
                </div>
            </div>
        </React.Fragment>)
    }
}

export default withRouter(LeftMenu)
