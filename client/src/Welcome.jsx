/*
Default welcome content for the site.
Required props:
-handleLogin - request navigation to the log in component
-handleCreate - request navigation to the create account component
-handleInstructions() - function to go to instructions page
-handleAbout() - function to go to About page
*/

import React, {Component} from "react"

class Welcome extends Component{
    constructor(props){
        super(props)
        this.handleLogin = this.handleLogin.bind(this)
        this.handleCreate = this.handleCreate.bind(this)
        this.handleInstructions = this.handleInstructions.bind(this)
        this.handleAbout = this.handleAbout.bind(this)
    }
    handleLogin(){
        this.props.handleLogin()
    }
    handleCreate(){
        this.props.handleCreate()
    }
    handleInstructions(){
        this.props.handleInstructions()
    }
    handleAbout(){
        this.props.handleAbout()
    }
    render(){
        return(
            <React.Fragment>
                <h3>Welcome to Absreim's Mafia</h3>
                <button
                    onClick={this.handleLogin}>Log in</button>
                <button
                    onClick={this.handleCreate}>Create Account</button>
                <button
                    onClick={this.handleInstructions}>Instructions</button>
                <button
                    onClick={this.handleAbout}>About</button>
            </React.Fragment>
        )
    }
}

export default Welcome