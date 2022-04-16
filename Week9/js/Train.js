//unused code, use this when you want to train more data

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
    nn.save("weather-info")
 }