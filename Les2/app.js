console.log("Ml5 version", ml5.version);
let synth = window.speechSynthesis
const image = document.getElementById('output')
const fileButton = document.querySelector("#file")


fileButton.addEventListener("change", (event)=>loadFile(event))
image.addEventListener('load', () => userImageUploaded())


// Initialize the Image Classifier method with MobileNet
const classifier = ml5.imageClassifier('MobileNet', modelLoaded);

// When the model is loaded
function modelLoaded() {
  console.log('Model Loaded!');
}

function classifyImage(){
  // Make a prediction with a selected image
    classifier.classify(document.getElementById('output'), (err, results) => {
    console.log(results);
    console.log(results[0].label);
    let resultone = document.getElementById("resultone");
    let resulttwo = document.getElementById("resulttwo");

    let confidenceFirst = results[0].confidence.toFixed(2)*100;
    let confidenceSecond = results[1].confidence.toFixed(2)*100;
    resultone.innerHTML = `Ik ben voor ${confidenceFirst}% zeker, dat dit een ${results[0].label} is`;    
    resulttwo.innerHTML = `Ik ben voor ${confidenceSecond}% zeker, dat dit een ${results[1].label} is`;

    speak(`Ik ben voor ${confidenceFirst}% zeker, dat dit een ${results[0].label} is`);
  });
}

function speak(text) {
    if (synth.speaking) {
        console.log('still speaking...')
        return
    }
    if (text !== '') {
        let utterThis = new SpeechSynthesisUtterance(text)
        let voices = window.speechSynthesis.getVoices()
        let name = "Alex"
        utterThis.voice = voices.filter(function(voice) { return voice.name == name; })[0]
        synth.speak(utterThis)
    }
}




function loadFile(event) {
	image.src = URL.createObjectURL(event.target.files[0])
}

function userImageUploaded(){
    console.log("The image is now visible in the DOM")
    classifyImage()
}


