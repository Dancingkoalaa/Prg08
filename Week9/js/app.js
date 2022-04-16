let nn
document.getElementById('Predict').onclick = function (){
    loadModel()
}

function loadModel() {
   const options = {task: "regession", debug: true}
   nn = ml5.neuralNetwork(options)

   const modelInfo = {
      model: 'model/model.json',
      metadata: 'model/model_meta.json',
      weights: 'model/model.weights.bin',
   };

   nn.load(modelInfo, classify)
   console.log('model loaded')
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
