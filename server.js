
require('dotenv').config('./.env')
const express = require('express')
const cors = require('cors')
const fs = require('fs')

const app = express()
const port = process.env.PORT

app.set('view engine', 'ejs')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.get('/', (req, res) => {
  res.send('Forecast Weather')
})

app.get('/weather/:nameCity', async (req,res)=>{
    let result=await  readWeatherFile(req)
        res.react(result)

})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})




const readWeatherFile = (req) =>{
    return new Promise((resolve,reject)=>{

        let lat = req.params.lat
        let lon = req.params.lon
        let searchQuery = req.params.nameCity

        let result = []

        fs.readFile('data/weather.json', (err, data) => {
            let records = JSON.parse(data)
            if (err) reject(err)
            else {
                for (let i = 0; i < records.length; i++) {
                    if(searchQuery === records[i].city_name){
                        let city = records[i].data
                        let city_name = records[i].city_name
                        for (let c in city){
                            result.push({
                                // description:`Low of ${city[c].low_temp} , high of ${city[c].high_temp} with ${city[c].weather.description} `,
                                // date:`${city[c].datetime}`
                                city_name: `${city_name}`,
                                date:`${city[c].datetime}`,
                                low_temp:`${city[c].low_temp}`,
                                high_temp: `${city[c].high_temp}`,
                                description: `${city[c].weather.description}`
                            })
                        }
                        resolve(result)
                        break;
                    }
                  }
                resolve("error") 
            } 
        })
    })
}