import "./App.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button, Container, Form, Navbar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import sunny from "./videos/sunny.mp4";
import cloudy from "./videos/cloudy.mp4";
import strom from "./videos/strom.mp4";
import lightning from "./videos/lightning.mp4";
import rain from "./videos/rain.mp4";
import mist from "./videos/v1.mp4";

function App() {
  const [weather, setweather] = useState(null);
  const cityName = useRef(null);
  const [location, setLocation] = useState(null);
  const [submit, setSubmit] = useState(false);
  const [videoBg, setVideoBg] = useState(null);
  useEffect(() => {
    let name = "";
    if (cityName.current.value) {
      name = `q=${cityName.current.value}`;
    }else if (location === null){
      name = `q=london`
    }
     else if (location) {
      if (!location) {
      } else if (location === "fail") {
        name = "q=new york";
      } else if (location && location.latitude) {
        name = `lat=${location.latitude}&lon=${location.longitude}`;
      }
    }
    if (name) {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?${name}&appid=8dad3db309e50de33c8cdefbe69cec74&units=metric`
        )
        .then((res) => {
          const newWeather = res.data;
          setweather(newWeather);
          if (newWeather.weather[0].main === "Clouds") {
            setVideoBg(cloudy);
          } else if (newWeather.weather[0].main === "Rain") {
            setVideoBg(rain);
          } else if (newWeather.weather[0].main === "Strom") {
            setVideoBg(strom);
          } else if (
            newWeather.weather[0].main ===
            ("Lightning" || newWeather.weather[0].main === "Thunder")
          ) {
            setVideoBg(lightning);
          } else if (newWeather.weather[0].main === "Mist") {
            setVideoBg(mist);
          } else {
            setVideoBg(sunny);
          }
        });
    }
  }, [submit, location]);

  useEffect(() => {
    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        });
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    }
    getLocation();
  }, []);

  return (
    <>
      <div>
        <Navbar
          collapseOnSelect
          expand="lg"
          style={{ background: "#152238" }}
          variant="dark"
        >
          <Container>
            <Navbar.Brand href="#">Weather-App</Navbar.Brand>
          </Container>
        </Navbar>{" "}
        <Container className="mt-4 showBackground">
          <video src={videoBg} muted loop autoPlay></video>
          <h1>City Name:</h1>          
          <Form.Control
            tabIndex="1"
            placeholder="Type Your City Name..."
            ref={cityName}
            size="lg"
          />
          <Button
            tabIndex="2"
            className="my-3"
            style={{ background: "#152238" }}
            onClick={() => {
              setSubmit(!submit);
            }}
            size="lg"
          >
            Submit
          </Button>
                   
          <div className="myStyling">
                
            {weather !== null ? (
              <>
                <h1>{weather.name} Weather</h1>
                <h2>
                  Nature: {weather.weather[0].main} (Description:{" "}
                  {weather.weather[0].description})
                </h2>
                <h2>Temperature: {weather.main.temp}</h2>
                <h2>Wind Speed: {weather.wind.speed}</h2>
                <h2>Humidity: {weather.main.humidity}</h2>
                <h2>Country: {weather.sys.country}</h2>                  
              </>
            ) : (
              <h1>Loading...</h1>
            )}{" "}
                  
          </div>
        </Container>
      </div>
          
    </>
  );
}
export default App;
