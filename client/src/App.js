import React, { Component } from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import Login from "./Pages/Login";
import Landing from "./Pages/Landing";
import Home from "./Pages/Home";
import AddEvent from "./Pages/AddEvent";
import Signup from "./Pages/Signup";
import Profile from "./Pages/Profile";
import axios from 'axios';
import './App.css';

class App extends Component {
 state = {
    user: {
      loggedIn: false,
      currentUser: {
        id: null,
        fullName: '',
        email: '',
        picture: null
      }
    }
  }
  
  componentDidMount() {
    this.checkLogin()
    console.log(this.state)
  }

  checkLogin = () => {
    axios.get("/api/session").then((res) => {
      console.log(this.state, "this is checklogin state")
      console.log(res)
      this.setState({ user: res.data});
      console.log(this.state)
    })
  }
  
  userDidLogin = (userData) => {
    console.log(userData)
    axios.post("/api/login", userData).then((res) => {
      window.location.href = '/home';
      console.log(res)
      this.checkLogin()
    })
  }

  userDidSignup = (userData) => {
    console.log(userData)
    axios.post("/api/signUp", userData).then((res) => {
      window.location.href = '/profile';
      console.log(res)
      this.checkLogin()
    })
  }

  userDidUpdate = (userData) => {
    console.log(userData)
    axios.put(`/api/update/${userData.email}`, userData).then((res) => {
      console.log(res)
      this.checkLogin()
    })
  }

  userDidAddEvent = (userData) => {
    console.log(userData)
    axios.post("/api/addEvent", userData).then((res) => {
      window.location.href = '/home';
      console.log(res)
      this.checkLogin()
    })
  }

  userLogOut = () => {
    axios.get("/api/logout").then((res) => {
      console.log(res)
      this.setState({ user: res.data });
    })
  }
  
  render() {
    return (
      <Router>
        <div>
          
          <Switch>  
            <Route exact path="/home" component={Home}/>
            <Route exact path="/" render={() => (
            <Landing handleLogin={this.userDidLogin} handleSignup={this.userDidSignup} />
            )} />
            <Route exact path="/profile" render={(props) => {
              return <Profile user={this.state.user} {...props} handleUpdate={this.userDidUpdate} />
            }} />
            <Route handleAddEvent={this.userDidAddEvent}  path="/addEvent" component={AddEvent}/>
            <Route path="/user/:username" render={(props) => {
               return <Profile {...props} />
            }} />

            <Route exact path="/logout" render={() => (
              <button onClick={this.userLogOut}> logOut</button>
            )} />
            <Route exact path="/login" render={() => (
              <Login handleLogin={this.userDidLogin} />
            )} />
            <Route exact path="/signup" render={() => (
              <Signup handleSignup={this.userDidSignup} />
            )} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
