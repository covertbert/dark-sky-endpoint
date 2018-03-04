const express = require('express')
const RateLimit = require('express-rate-limit')
const CircularJSON = require('circular-json')
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
  const lat = req.param('lat')
  const lon = req.param('lon')
  const units = req.param('units')

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
  const lat = req.param('lat')
  const lon = req.param('lon')
  const url = 'https://maps.googleapis.com/maps/api/place/'
  const placeDataQuery = `${url}nearbysearch/json?location=${lat},${lon}&radius=1000&key=${keys.images}`

  axios.get(placeDataQuery).then((response) => {
    const placeData = response.data.results
    // const randomNumberInArrayRange = Math.floor(Math.random() * (placeData.length - 0 + 1)) + 0
    const randomLocationFromPlaceArray = placeData[1].place_id
    const imageQuery = `${url}photo?maxwidth=400&photoreference=${randomLocationFromPlaceArray}&key=${keys.images}`
    // const test = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=CnRtAAAATLZNl354RwP_9UKbQ_5Psy40texXePv4oAlgP4qNEkdIrkyse7rPXYGd9D_Uj1rVsQdWT4oRz4QrYAJNpFX7rzqqMlZw2h2E2y5IKMUZ7ouD_SlcHxYq1yL4KbKUv3qtWgTK0A6QbGh87GB3sscrHRIQiG2RrmU_jF4tENr9wGS_YxoUSSDrYjWmrNfeEHSGSc3FyhNLlBU&key=${keys.images}`

    axios.get(imageQuery).then((response) => {
      console.log(response)
      // res.send(CircularJSON.stringify(response))
    }).catch(error => {
      // res.send(error)
      console.log('error')
    })
  }).catch(error => {
    res.send(error)
  })
})

app.listen(3000, () => {
  console.log('Listening on port 3000')
})
