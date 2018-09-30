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
            <table>
                <tbody>
                    <tr>
                        <td><h2>Welcome to Absreim's Mafia</h2></td>
                    </tr>
                    <tr>
                        <td><button onClick={this.handleLogin}>Log in</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={this.handleCreate}>Create Account</button></td>
                    </tr>
                </tbody>
            </table>
        )
    }
}

export default Welcome