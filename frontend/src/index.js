import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Login from './containers/Login.js'
import MainScreen from './containers/MainScreen.js'


function RenderLogin(props){

    return(props.isLoggedIn ? <MainScreen status = {props.status} /> : <Login handleLogin = {props.handleLogin} />)
}

class App extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            apiResponse: "",
            isLoggedIn:true,
            status:"admin"
        }
        this.handleLogin = this.handleLogin.bind(this)
        this.handleLogout = this.handleLogout.bind(this)
    }

    handleLogin(rank){
        this.setState({isLoggedIn:true, status:rank}, function(){
            console.log("Successfuly logged in with rank: " + rank)
        });
    }

    handleLogout(){
        console.log("je suis las")
        this.setState({isLoggedIn:false, status:""}, function(){
            console.log("Successfuly logged out");
        });
    }
    callAPI(){
        fetch("http://localhost:9000/testAPI")
        .then(res => res.text())
        .then(res => this.setState({apiResponse: res}))
        .catch(err => console.log(err))

    }

    componentDidMount(){
        this.callAPI()
    }

    render(){
        return(
            <RenderLogin
                handleLogin={this.handleLogin}
                handleLogout={this.handleLogout}
                isLoggedIn={this.state.isLoggedIn}
                status = {this.state.status}/>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
