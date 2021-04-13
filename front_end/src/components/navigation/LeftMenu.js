import React from 'react'
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { MdHome, MdVideogameAsset, MdStore, MdPowerSettingsNew, MdPerson, MdShowChart } from 'react-icons/md';
import { FaChessBishop } from 'react-icons/fa';
import { GiLockedChest } from 'react-icons/gi';
import { BiCoin } from 'react-icons/bi'
import { ImTrophy } from 'react-icons/im';
import { HiChevronDoubleLeft } from 'react-icons/hi';
import '../style.css'
import { withRouter } from 'react-router-dom';

class LeftMenu extends React.Component {
    state = {
    }

    isSelected(route, search=''){
        return ((route === this.props.location.pathname && search === this.props.location.search) ? "selected" : "")
    }

    render() {
        return (
        <React.Fragment>
            <div className={`leftmenu ${this.props.collapsedClass}`}>
                <ReactTooltip className="tooltip" place="right" delayShow="600" effect="solid"/>
                <div className="menu-title">
                    <img src={process.env.PUBLIC_URL + '/assets/logos/logo_text.svg'}></img>
                </div>
                <div className="menu-title collapsed">
                    <img src={process.env.PUBLIC_URL + '/assets/logos/logo_icon_green.svg'}></img>
                </div>
                <div className="content">
                    <Link to="/home" data-tip="Home">
                        <div className={`entry ${this.isSelected("/home")}`} >
                            <MdHome className="icon"/>
                            <span className="name">Home</span>
                        </div>
                    </Link>
                    <Link to="/play" data-tip="Play">
                        <div className={`entry ${this.isSelected("/play")}`}>
                            <MdVideogameAsset className="icon"/>
                            <span className="name">Play</span>
                        </div>
                    </Link>
                    <Link to="/decks" data-tip="My decks">
                        <div className={`entry ${this.isSelected("/decks")}`}>
                            <FaChessBishop className="icon"/>
                            <span className="name">My decks</span>
                        </div>
                    </Link>
                    <Link to="/shop" data-tip="Shop">
                        <div className={`entry ${this.isSelected("/shop")}`}>
                            <MdStore className="icon"/>
                            <span className="name">Shop</span>
                        </div>
                    </Link>
                    <Link to="/leaderboard" data-tip="Leaderboard">
                        <div className={`entry ${this.isSelected("/leaderboard")}`}>
                            <ImTrophy className="icon"/>
                            <span className="name">Leaderboard</span>
                        </div>
                    </Link>
                </div>
                <div className="bottom content">
                    <Link to={"/profile?id=" + this.props.user.id} data-tip="My profile">
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
                    <div className="entry" onClick={this.props.onLogout} data-tip="Log out">
                        <MdPowerSettingsNew className="icon"/>
                        <span className="name">Log out</span>
                    </div>
                    <div className="entry collapse-entry" onClick={this.props.onToggleCollapse} data-tip="Expand menu">
                        <HiChevronDoubleLeft className="icon rotate"/>
                        <span className="name">Collapse menu</span>
                    </div>
                </div>
            </div>
        </React.Fragment>)
    }
}

export default withRouter(LeftMenu)
