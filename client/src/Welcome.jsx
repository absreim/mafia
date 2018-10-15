/*
Default welcome content for the site.
Required props:
- handleLogin - request navigation to the log in component
- handleCreate - request navigation to the create account component
*/

import React, {Component} from "react"

class Welcome extends Component{
    constructor(props){
        super(props)
        this.handleLogin = this.handleLogin.bind(this)
        this.handleCreate = this.handleCreate.bind(this)
    }
    handleLogin(){
        this.props.handleLogin()
    }
    handleCreate(){
        this.props.handleCreate()
    }
    render(){
        return(
            <React.Fragment>
                <h3>Welcome to Absreim's Mafia</h3>
                <button onClick={this.handleLogin}>Log in</button>
                <button onClick={this.handleCreate}>Create Account</button>
            </React.Fragment>
        )
    }
}

export default Welcome