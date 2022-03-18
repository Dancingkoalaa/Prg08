const data = document.querySelector('data')
const video = document.querySelector('video')
const canvas = document.querySelector('#mosaic')
const result = document.querySelector("#result");
const context = canvas.getContext('2d')
const learnBtn = document.getElementById('learnCamera');
learnBtn.addEventListener('click', learn)
const Predict = document.getElementById('MakePrediction');
Predict.addEventListener('click', startClassify)
const k = 3;
const machine = new kNear(k);

// how many pixels in rows and columns - 10 means 100 values.
const numpixels = 10

let width
let height
let intervalid
let dataArray // remember the pixel values. use this as training data

function learn(){
    let labelValue = document.getElementById('label');
    let pixelValue = generatePixelValues()
    machine.learn(pixelValue, labelValue.value)
}

function startClassify(){
    setInterval(() => {
    let pixelValue = generatePixelValues()
    let a = machine.classify(pixelValue)
    console.log(`Predictions ${a}`);
    }, 1000);
}

function initSettings() {
    width = video.offsetWidth
    height = video.offsetHeight

    canvas.width = width
    canvas.height = height

    // we need pixelization
    context.mozImageSmoothingEnabled = false
    context.webkitImageSmoothingEnabled = false
    context.imageSmoothingEnabled = false

    // draw the webcam 60 times per second
    webcamSnapshot()

    // create array of pixel values every second
    intervalid = setInterval(() => generatePixelValues(), 1000)
    setInterval(() => {
        let pixelValue = generatePixelValues();
        let prediction = machine.classify(pixelValue)
    }, 10000);
}

//
// drawing the video very small causes pixelation. we need this to keep the array small.
// draw 60 times / second
//
function webcamSnapshot() {
    context.drawImage(video, 0, 0, numpixels, numpixels)
    context.drawImage(canvas, 0, 0, numpixels, numpixels, 0, 0, width, height)
    requestAnimationFrame(webcamSnapshot)
}


//
// generate an array with a color value for each pixel in the webcam feed
//
function generatePixelValues() {

    data.innerText = ""
    dataArray = []

    for (let pos = 0; pos < numpixels * numpixels; pos++) {
        let col = pos % numpixels
        let row = Math.floor(pos / numpixels)

        let x = col * (width / numpixels)
        let y = row * (height / numpixels)

        // sample locatie niet linksboven rect maar in het midden
        let p = context.getImageData(x + width / 20, y + height / 20, 1, 1).data

        // rgb waarde bij voorkeur als 1 decimal doorgeven, anders krijgt kNear drie losse waarden binnen of hexwaarde
        // console.log("rgb is " + p[0] + "," + p[1] + "," + p[2]);
        let decimalColor = rgbToDecimal(p[0], p[1], p[2])
        dataArray.push(decimalColor)

        // show values
        data.innerText += decimalColor + ", "
    }
    return dataArray;

}



//
// INITIALIZE THE WEBCAM
//
function initializeWebcam() {
    // docs: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    if (navigator.mediaDevices) {
        navigator.mediaDevices.getUserMedia({ video: true })
            // permission granted:
            .then(function (stream) {
                video.srcObject = stream;
                video.addEventListener("playing", () => initSettings())
            })
            // permission denied:
            .catch(function (error) {
                document.body.textContent = 'Could not access the camera. Error: ' + error.name
            })
    }
}

initializeWebcam()