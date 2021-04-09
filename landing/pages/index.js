import React from 'react';
import Head from 'next/head'
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

const URL_FRONT_END = '';

export default function Home() {
    const [header_class, setHeaderClass] = React.useState("header");

    return (
        <div>
            <Head>
                <title>HyperChess - Welcome</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={header_class}>
                <div class="logo">
                    <img src="/assets/logos/logo_icon_gradient.svg" className="icon"></img>
                    <img src="/assets/logos/logo_text.svg" className="text"></img>
                </div>


                {/*
                    <div class="nav-container">
                        <a class="nav">The Game</a>
                        <a class="nav"></a>
                        <a class="nav">About us</a>
                    </div>
                */}
                <div className="buttons-container">
                    <a className="button light" target={process.env.URL_FRONT_END + '/login'}>Log In</a>
                    <a className="button" target={process.env.URL_FRONT_END + '/signup'}>Sign Up for free</a>
                </div>
            </div>
            <PerfectScrollbar className="container"
                              onScrollY={() => {setHeaderClass("header sticky")}}
                              onYReachStart={() => {setHeaderClass("header")}}>
                <div className="section centered dark">
                    <div className="content centered">
                        <h1>Discover a new kind of Chess.</h1>
                        <a className="button" target={process.env.URL_FRONT_END + '/login'}>Play now</a>
                    </div>
                    <img src="/landing_page.svg" className="background"></img>
                </div>

                <div className="section paragraph">
                    <h2 class="title">What is HyperChess?</h2>
                    <p>
                        HyperChess is the next level of Chess variants. It features 30+ exclusive new pieces that you can combine into powerful decks.
                    </p>
                    <p>
                        You can trade the classic old Knights for new shiny Unicorns, change your Queen for an Empress or try out an Elephant for a Rook.
                        Try to find the best synergies between your pieces to come up with a deck that defeats every player of the ladder.
                    </p>
                </div>
            </PerfectScrollbar>
        </div>
    )
}
