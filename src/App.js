import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Particles from 'react-particles-js';
import './App.css';

const particleOptions = {
  particles: {
    number: {
      value: 180,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

//default initial state
const initialState = {
  input: '',
  imageURL: '',
  box: {},
  route: 'signin',
  isSignedIn: false,//could use packages to help, but implement from scratch to help understand how it works
  user: {
    id: "",
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}
class App extends Component {
  constructor(){
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user:{
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    console.log(clarifaiFace);
    //dom manipulation
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width, height);
    return {
      //identify dots to make up square around face id
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }

  onInputChange = (event) => {
    console.log(event);
    this.setState({input: event.target.value});
  }

  //could rename to onPictureSubmit
  onButtonSubmit = () => {
    console.log("click");
    this.setState({imageURL: this.state.input});
      fetch('http://localhost:3000/imageurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            input: this.state.input
        })
      })
      .then(response => response.json())
      .then(response => {
        if(response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count} ))
          })
          .catch(console.log);
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(error => console.log(error));
  }

  onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState(initialState);
      //find way to direct logout to signin page
    } else if(route === 'home') {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  

  render() {
    const { isSignedIn, imageURL, route, box} = this.state; //destructure props
    return (
      <div className="App">
        <Particles className ="particles"
        params={particleOptions}
        />
        <Navigation isSignedIn = {isSignedIn} onRouteChange = {this.onRouteChange}/>
        {route === 'home' ? <div> 
          <Logo />
          <Rank name={this.state.user.name} entries={this.state.user.entries} />
          <ImageLinkForm onInputChange = {this.onInputChange} onButtonSubmit ={this.onButtonSubmit} />
          <FaceRecognition box={box} imageURL={imageURL} />  
        </div> :(
          this.state.route === 'signin' 
          ? <Signin loadUser={this.loadUser} onRouteChange = {this.onRouteChange} />  
          : <Register loadUser={this.loadUser} onRouteChange = {this.onRouteChange} />
        )
        
        }
      </div>
    );
  }
}

export default App;
