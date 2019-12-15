import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Login from './containers/Login.js'
import MainScreen from './containers/MainScreen.js'

const io = require('socket.io-client')
const socket = io.connect('localhost:3001')

function RenderLogin(props){

    return(props.isLoggedIn ?
        <MainScreen
             socket={props.socket}
             handleLogout = {props.handleLogout}
             status={props.status}/>
            :
        <Login
            handleLogin = {props.handleLogin}
            socket={props.socket} />)
}

class App extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            apiResponse: "",
            isLoggedIn:false,
            status:"",
            username:""
        }
        this.handleLogin = this.handleLogin.bind(this)
        this.handleLogout = this.handleLogout.bind(this)
    }

    handleLogin(object){
        this.setState({isLoggedIn:true, status:object.rank, username:object.username}, function(){
            console.log(object.username +" successfuly logged in with rank: " + object.rank)
        });
    }

    handleLogout(){

        this.setState({isLoggedIn:false, status:"", username:""}, function(){
            console.log("Successfuly logged out");
        });
    }

    render(){
        return(
            <RenderLogin
                socket={socket}
                handleLogin={this.handleLogin}
                handleLogout={this.handleLogout}
                isLoggedIn={this.state.isLoggedIn}
                status = {this.state.status}
                username = {this.props.username}/>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
