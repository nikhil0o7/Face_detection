import React from "react";
import Tilt from 'react-parallax-tilt';
import './Logo.css';
import brain from './brain.png';
const Logo = () =>{
    return(
        <div className="ma4 mt0"> 
          <Tilt>
      <div className="Tilt br2 shadow2" options={{ max:55 }}style={{ height: '150px', width: '150px' }}>
        <div className="Tilt-inner pa3"><img style = {{paddingTop:'5px' }} alt="brain" src = {brain} ></img></div>
      </div>
    </Tilt>
        </div>
    );

}

export default Logo;