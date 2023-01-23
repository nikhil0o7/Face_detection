import './App.css';
import Clarifai from 'clarifai';
import React,{ Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import ParticlesBg from 'particles-bg';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';



//You must add your own API key here from Clarifai.
const app = new Clarifai.App({
  apiKey: 'b6f24ee2489b433e921c4aaf3e323144'
 });

class App extends Component{
  constructor(){
    super();
    this.state ={
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedin:
    }
  }
  calculateFaceLocation = (data) => {
   const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
   const image = document.getElementById('inputimage');
   const width = Number(image.width);
   const height = Number(image.height);
  return {
    leftcol: clarifaiFace.left_col * width,
    topRow : clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height),
  }
  }

  displayFaceBox = (box) => {
    this.setState({box:box});
  }

  onInputChange = (event) => {
      this.setState({input: event.target.value});
  }

  onButtonSubmit = () =>{
    this.setState({imageUrl:this.state.input});
    app.models.predict(
        {
          id: 'face-detection',
          name: 'face-detection',
          version: '6dc7e46bc9124c5c8824be4822abe105',
          type: 'visual-detector',
        }, this.state.input)
        .then(response => {
          console.log('hi', response)
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })
  
          }
          this.displayFaceBox(this.calculateFaceLocation(response))
        })
        .catch(err => console.log(err));
        // we can use .catch whenever there is a .then
    }
    
    onRouteChange = (route) =>{
      if(route === 'signout'){
        this.setState({isSignedin:false});
      }else if(route ==='home'){
        this.setState({isSignedin:true});
      }
      this.setState({route:route});
    }


  render(){
    return (
      <div className="App">

       <ParticlesBg  type="fountain" bg={true} />
      
       <Navigation isSignedin={this.state.isSignedin} onRouteChange={this.onRouteChange}/>

      { 
      this.state.route ==='home'?
      <div>
        <Logo />
       <Rank />
       <ImageLinkForm onInputChange = {this.onInputChange} onButtonSubmit = { this.onButtonSubmit }  />        
       <FaceRecognition box = {this.state.box}imageUrl = {this.state.imageUrl} />
       </div>
     :(
        this.state.route === 'signin'?
        <Signin onRouteChange = {this.onRouteChange} />
        : <Register onRouteChange = {this.onRouteChange} />

     ) 
       
    }

      </div>
    );
  }
}
// api key : b6f24ee2489b433e921c4aaf3e323144
// model id: 6dc7e46bc9124c5c8824be4822abe105
// user id: thp5nk7hxm1m



export default App;
