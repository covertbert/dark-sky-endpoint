const express = require('express')
const RateLimit = require('express-rate-limit')
const cors = require('cors')
const axios = require('axios')

require('dotenv').config()

const DarkSky = require('dark-sky')

const app = express()

const limiter = new RateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // 100 requests per windowMs
  delayMs: 0 // disable delaying
})

app.use(limiter)
app.use(cors())

console.log(process.env.DARK_SKY)

const forecast = new DarkSky(process.env.DARK_SKY)

app.get('/', (req, res) => {
  res.send('There be nothing here')
})

app.get('/health-check', (req, res) => res.sendStatus(200))

app.get('/weather/json', (req, res) => {
  const lat = req.query.lat
  const lon = req.query.lon
  const units = 'uk2'

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
    process.env.IMAGES
  }`

  axios
    .get(placeDataQuery)
    .then(response => {
      const placeData = response.data.results
      const location = response.data.results[0].vicinity

      const locationFromPlaceArray = placeData[0]
      const imageIDFromArray = locationFromPlaceArray.photos[0].photo_reference

      const imageQuery = `${url}photo?maxwidth=2000&photoreference=${imageIDFromArray}&key=${
        process.env.IMAGES
      }`

      const responseData = { location, imageQuery }

      res.send(responseData)
    })
    .catch(error => {
      res.send(error)
    })
})

app.listen(3000, () => {
  console.log('Listening on port 3000')
})
