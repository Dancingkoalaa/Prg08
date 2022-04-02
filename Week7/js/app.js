let nn
document.getElementById('Predict').onclick = function (){
    classify()
}


function loadData() {
   Papa.parse("./data/weather.csv", {
       download: true,
       header: true, 
       dynamicTyping: true,
       complete: (results) => cleanData(results.data)
   })
}
// TODO data kiezen en opschonen
function cleanData(data) {
   // const cleanedData = data.map(day => ({
   // }))
   //     .filter(day => ()
   //     .filter(day => ()
   console.log(data)
   createNeuralNetwork(data)
}
// create neural network
function createNeuralNetwork(data) {
   nn = ml5.neuralNetwork({ task: 'classification'})
   for (let day of data) {
       const inputs = { Precipitation: day.precipitation, MinTemp: day.temp_min, MaxTemp: day.temp_max, Wind: day.wind } // TODO moet kloppen met je cleaned data
       const output = { Weather: day.weather } 
       console.log(inputs)
       console.log(output)
       nn.addData(inputs, output)
   }
   nn.normalizeData()
   nn.train({ epochs: 100 }, () => done())}
function done(){
   document.getElementById('answer').innerHTML = "";
   console.log("done training!")
   document.getElementById('Predict').disabled = false;
}

// make a classification
function classify() {
   let precipitationInput = document.getElementById('precipitation').value
   let currentPrecipitation = parseFloat(precipitationInput)
   let MinTempInput = document.getElementById('MinTemp').value
   let currentMinTemp = parseFloat(MinTempInput)
   let MaxTempInput = document.getElementById('MaxTemp').value
   let currentMaxTemp = parseFloat(MaxTempInput)
   let WindInput = document.getElementById('Wind').value
   let currentWind = parseFloat(WindInput)

   const input = { Precipitation: currentPrecipitation, MinTemp: currentMinTemp, MaxTemp: currentMaxTemp, Wind: currentWind } // TODO moet kloppen met je cleaned data
   console.log(input)
   nn.classify(input, (error, result) => {
       console.log(result)
       console.log(`Weather Tomorrow: ${result[0].label}`)
       let weather = result[0].label
       document.getElementById("Prediction").innerHTML = weather
       let confidence = Math.round(result[0].confidence * 100)
       document.getElementById("confidence").innerHTML = confidence
       if (weather == "rain" || weather == "snow" || weather == "drizzle") {
         document.getElementById("transport").innerHTML = "Bus, Tram, Metro, Auto"
       } else {
          document.getElementById("transport").innerHTML = "Lopen, Fiets, Scooter"
       }
   })
}
loadData()