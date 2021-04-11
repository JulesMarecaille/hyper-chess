import React from 'react'
import { Helmet } from 'react-helmet'

class ViewHome extends React.Component {
    state = {
    }

    render() {
        return (
        <React.Fragment>
            <Helmet>
                <title>HyperChess - Home</title>
            </Helmet>
            <p>This is the home</p>
        </React.Fragment>)
    }
}

export default ViewHome
