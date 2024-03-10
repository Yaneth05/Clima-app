// console.log(import.meta.env.VITE_API_KEY);//acceder a la clave de la api

import { LoadingButton } from "@mui/lab";
import { Box, Container, TextField, Typography } from "@mui/material";//importar container
import { useState } from "react";

//const API_WEATHER = 'https://api.weatherapi.com/v1/current.json?key=${import.meta.env.VITE_API_KEY}&q=';
const API_WEATHER = "https://api.weatherapi.com/v1/current.json?key=09daf36865094846b1535638241003&lang=es&q=";

export default function App() {
  //relacionar la cajita con un estado
  const [city, setCity] = useState("");
  //constante para trabajar el true o false del btn
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    error: false,
    message: "",
  });

  const [weather, setWeather] = useState({
    city: "",
    country: "",
    temp: "",
    condition: "",
    icon: "",
    conditionText: "",
  })
    


  //onSubmit debe consultar la url
  const onSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);//cd vez q intentemos hacer una consulta a la api externa,
                      //dejaremos el btn cargando
    setError({
    error: false,
    message: "",
    });
    try{
      //si un usuario deja el city con espacios en blanco(trim) se manda un msj
      if(!city.trim()) throw { message: "Ingresa una ciudad" };
      //si el usuario ingresa una ciudad, se consulta la api
      const response = await fetch(`${API_WEATHER}${city}`);
      const data = await response.json();
      //si se encuentra la ciudad correspondiente
      if (data.error) throw {message: data.error.message};
      //se muestran los datos
      setWeather({
        city: data.location.name,
        country: data.location.country,
        temp: data.current.temp_c,
        condition: data.current.condition.code,
        icon: data.current.condition.icon,
        conditionText: data.current.condition.text,
      });
      //console.log(data);//la data es lo q vamos a pintar
    }catch (error){
      //console.log(error);
      setError({
        error: true,
        message: error.message,
      });
    } finally {
      setLoading(false);//si todo sale bien, se queda en false
    }
  };

  return (
    <Container
    maxWidth="xs"
    xs={{mt: 2}}
    >
      <Typography
        variant="h3"
        component="h1"
        align="center"
        gutterBottom//espacio en partInferior
      >
        Weather App
      </Typography>

      <Box
        sx={{display: 'grid', gap: 2}}//separar los elemn al interior del box
        component="form"
        autoComplete="off"
        onSubmit={onSubmit}
      >

        <TextField
          id="city"
          label="Ciudad"
          variant="outlined"
          size="small"
          required
          fullWidth
          value={city}
          onChange={(e) => setCity(e.target.value)}
          //sale cd vez q el error sea verdadero
          error={error.error}
          helperText={error.message}//mensaje q muestra el error
        />

        <LoadingButton
        type="submit"
        variant="contained"
        loading={loading}//si es true el btn se bloquea y aparece el sig msj
        loadingIndicator="Cargando..."//msj q aparece en el btn
        >
          Buscar
        </LoadingButton>
        
      </Box>
      {/**inicio weather.city */}
      {/**pintar la ciudad */}
      {weather.city && (
        <Box
        sx={{
          mt: 2,
          display: "grid",
          gap: 2,
          textAlign: "center",
        }}
        >
          <Typography variant="h4" component="h2">
            {weather.city}, {weather.country}
          </Typography>

          <Box
          component="img"
          alt={weather.conditionText}
          src={weather.icon}
          sx={{ margin: "0 auto" }}
          />

          <Typography variant="h5" component="h3">
            {weather.temp}°C
          </Typography>

          <Typography variant="h6" component="h4">
            {weather.conditionText}
          </Typography>
        </Box>
      )}{/**fin weather.city */}

      <Typography
        textAlign="center"
        sx={{ mt: 2, fontSize: "10px" }}
      >
        Powered by:{" "}
        <a
          href="https://www.weatherapi.com/"
          title="Weather API"
        >
          WeatherAPI.com
        </a>
      </Typography>

    </Container>
  );
}