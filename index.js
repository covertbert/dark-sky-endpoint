const express = require('express')
const RateLimit = require('express-rate-limit')
const cors = require('cors')
const axios = require('axios')

const DarkSky = require('dark-sky')

const keys = require('./keys')

const app = express()

const limiter = new RateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // 100 requests per windowMs
  delayMs: 0 // disable delaying
})

app.use(limiter)
app.use(cors())

const forecast = new DarkSky(keys.darksky)

app.get('/', (req, res) => {
  res.send('There be nothing here')
})

app.get('/weather/json', (req, res) => {
  const lat = req.query.lat
  const lon = req.query.lon
  const units = req.query.units

  forecast
    .latitude(lat)
    .longitude(lon)
    .units(units)
    .language('en')
    .exclude('minutely,hourly,flags')
    .get()
    .then(response => {
      res.send(response)
    })
    .catch(error => {
      res.send(error)
    })
})

app.get('/location_data/json', (req, res) => {
  const lat = req.query.lat
  const lon = req.query.lon
  const url = 'https://maps.googleapis.com/maps/api/place/'
  const placeDataQuery = `${url}nearbysearch/json?location=${lat},${lon}&radius=1000&key=${
    keys.images
  }`

  axios
    .get(placeDataQuery)
    .then(response => {
      const placeData = response.data.results

      const locationFromPlaceArray = placeData[0]
      const imageIDFromArray = locationFromPlaceArray.photos[0].photo_reference

      const imageQuery = `${url}photo?minwidth=1200&photoreference=${imageIDFromArray}&key=${
        keys.images
      }`

      res.send(imageQuery)
    })
    .catch(error => {
      res.send(error)
    })
})

app.listen(3000, () => {
  console.log('Listening on port 3000')
})
