import * as React from 'react';
import { useState, useEffect  } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import { Room, Star } from '@material-ui/icons';
import "./app.css";
import axios from 'axios';
import { format } from 'timeago.js';
import Register from "./components/Register"
import Login from "./components/Login"

function App() {

  // @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
  mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

  const myStorage = window.localStorage
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 46,
    longitude: 17,
    zoom: 4
  });
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

    
 

 
  

 

  const handleMarkerClick = (id,lat,long)=>{
    setCurrentPlaceId(id);
    setViewport({...viewport, latitude:lat, longitude:long})
  }

  const handledAddClick = (e) => {
    const [long, lat] = e.lngLat;
    setNewPlace({
        lat,
        long
    })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username:currentUser,
      title,
      desc,
      rating,
      lat:newPlace.lat,
      long:newPlace.long
    }
    try{
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data])
      setNewPlace(null);
    }catch(err){
      console.log(err)
    }
  }

  useEffect(() => {
    const getPins = async ()=> {
      try{
        const res = await axios.get("/pins");
        setPins(res.data)
        // console.log(res.data);
      }catch (err) {
        console.log(err)
      }
    };
    getPins()   
   },[]);

  const handleLogout = ()=>{
    setCurrentUser(null)
    myStorage.removeItem("user");
  }


  return (
    <div className='App' >
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={"pk.eyJ1Ijoibm1pcmFuZGEiLCJhIjoiY2twOXEzejB4MGcyZDJxcW12bm5nNTlmaSJ9.AVTCNjWHbHSfeugmxIkpWA" }
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapStyle="mapbox://styles/nmiranda/ckpec000b043b17muziwoxsds"
      onDblClick = {handledAddClick}
      transitionDuration="200"
      >
        
     {pins.map((p)=>(
       <div  key={p._id}>
         
      <Marker          
           latitude={p.lat}
           longitude={p.long} 
           offsetLeft={-viewport.zoom * 3.5} 
           offsetTop={-viewport.zoom * 7}
           >
        <Room 
        style={{ fontSize:viewport.zoom * 7, color: p.username === currentUser ? "#39a6a3" : "#bf1363", cursor:"pointer" }}
        onClick ={()=>handleMarkerClick(p._id,p.lat,p.long)}
        />
      </Marker>
      {p._id === currentPlaceId && (
      <Popup
      latitude={p.lat}
      longitude={p.long}
      closeButton={true}
      closeOnClick={false}
      onClose={() => setCurrentPlaceId(null)}
      anchor="left">
        <div key={p._id} className="card">
        <label>Place</label>
        <h4 className="place">{p.title}</h4>
        <label>Review</label>
        <p className="desc">{p.desc}</p>
        <label>Rating</label>
        <div className="starts">
        {Array(p.rating).fill(<Star className="start"
        />)}
        </div>
        <label>Information</label>    
        <span className="username">Created by: <b>{p.username}</b></span>        
        <span className="date">{format(p.createdAt)}</span>        
        </div>
      </Popup>
      )}
      </div>
            
     ))}
     
     
      {newPlace && (
        <Popup
        latitude={newPlace.lat}
        longitude={newPlace.long}
        closeButton={true}
        closeOnClick={false}
        onClose={() => setNewPlace(null)}
        >
        <div >
          <form onSubmit={handleSubmit}>
            <label>Title</label>
            <input
             placeholder="Enter a title" 
             onChange={(e)=>setTitle(e.target.value)}
            />
            <label>Review</label>
            <textarea
             placeholder="Say us something about this place."
             onChange={(e)=>setDesc(e.target.value)}
             />
            <label>Rating</label>
            <select  onChange={(e)=>setRating(e.target.value)}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
            <button className="submitButton" type="submit">
              Add Pin
            </button>
          </form>
        </div>
      </Popup>
      )}
      {currentUser ? (
        <button className="button logout" onClick={handleLogout} >Log out</button>
      ) : (
      <div className="buttons">
      <button className="button login" onClick={()=>setShowLogin(true)}>
        Login
      </button>
      <button className="button register" onClick={()=>setShowRegister(true)}>
        Register
      </button>
      </div>

      )}
      {showRegister && <Register setShowRegister={setShowRegister}/>}
      {showLogin && (
      <Login 
      setShowLogin={setShowLogin} 
      myStorage={myStorage} 
      setCurrentUser={setCurrentUser}/>)}


      
    </ReactMapGL>
        

      </div>
      
  );
}

export default App;


