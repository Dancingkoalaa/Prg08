import { DecisionTree } from "./libraries/decisiontree.js"
import { VegaTree } from "./libraries/vegatree.js"

//
// DATA
//
const csvFile = "./data/mushrooms.csv"
const trainingLabel = "class"  
const ignored = []  
let amountGood = 0;
let KillerMushy = 0;
let HappyMushy = 0;
let AssassinMushy = 0;
let SadMushy = 0;


//
// laad csv data als json
//
function loadData() {
    Papa.parse(csvFile, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: results => trainModel(results.data)   // gebruik deze data om te trainen
    })
}

//
// MACHINE LEARNING - Decision Tree
//
function trainModel(data) {
    let trainData = data.slice(0, Math.floor(data.length * 0.8));
    let testData = data.slice(Math.floor(data.length * 0.8) + 1);
    let decisionTree = new DecisionTree({
        ignoredAttributes: ignored,
        trainingSet: trainData,
        categoryAttr: trainingLabel
    })
    // Teken de boomstructuur - DOM element, breedte, hoogte, decision tree
    let visual = new VegaTree('#view', 800, 400, decisionTree.toJSON());
    for (let mushroom of testData) {
        testMushroom(mushroom, decisionTree);
    }
    console.log(`Good and deadly ${KillerMushy}, Good and okay ${HappyMushy}, Wrong but deadly ${AssassinMushy}, Wrong but okay ${SadMushy}`)
    let accuracy = Math.floor(amountGood / testData.length * 100);
    let e = document.getElementById("accuracy");
    e.innerHTML = `Accuracy: ${accuracy}%`;
    let a = document.getElementById('good-and-okay');
    a.innerHTML = HappyMushy;
    let b = document.getElementById('wrong-but-okay');
    b.innerHTML = SadMushy;
    let c = document.getElementById('good-and-deadly');
    c.innerHTML = KillerMushy;
    let d = document.getElementById('wrong-but-deadly');
    d.innerHTML = AssassinMushy;
    }

function testMushroom(mushroom, decisionTree) {
    const mushroomWithoutLabel = Object.assign({}, mushroom);
    delete mushroomWithoutLabel.class;
    let prediction = decisionTree.predict(mushroomWithoutLabel);
    if (prediction == mushroom.class) {
        amountGood++;
    }
    if (prediction == 'p' && mushroom.class == 'p') {
        KillerMushy++;
    } else if (prediction == 'e' && mushroom.class == 'e') {
        HappyMushy++;
    } else if (prediction == 'e' && mushroom.class == 'p') {
        AssassinMushy++;
    } else if (prediction = 'p' && mushroom.class == 'e') {
        SadMushy++;
    }
    return amountGood, KillerMushy, HappyMushy, AssassinMushy, SadMushy;
}



loadData()