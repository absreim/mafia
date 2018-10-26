/*
In game chat box component.
Required props:
chatMessages - array of chat message objects
sendMessage(text) - function to send non-privileged
message
*/

import React, {Component} from "react"

class InGameChat extends Component {
    constructor(props){
        super(props)
        this.state = {
            inputBoxText: ""
        }
    }
    handleSubmit(event){
        event.preventDefault()
        this.props.sendMessage(this.state.inputBoxText)
        this.setState({
            inputBoxText: ""
        })
    }
    render(){
        let receivedMessagesArea = null
        if(!this.props.chatMessages || this.props.chatMessages.length === 0){
            receivedMessagesArea = <ul><li>No one has said anything yet. 
                Start the conversation yourself!</li></ul>
        }
        else{
            const chatMessageList = this.props.chatMessages.map((messageObj, index) => {
                if(messageObj.playerName && messageObj.text && messageObj.timeStamp){
                    const dateStr = (new Date(messageObj.timeStamp)).toLocaleDateString()
                    return <li key={index}>({dateStr}) <em>{messageObj.playerName}:</em> 
                        {messageObj.text}</li>
                }
            })
            receivedMessagesArea = <ul>{chatMessageList}</ul>
        }
        return(
            <div>
                {receivedMessagesArea}
                <form onSubmit={this.handleSubmit}>
                    <input type="text" value={this.state.inputBoxText} />
                    <input type="submit" value="Send" />
                </form>
            </div>
        )
    }
}