const URL = "https://teachablemachine.withgoogle.com/models/JpyjHNMC-/"; // Replace with your model URL

let model, webcamStream, isPredicting = false;

async function loadModel() {
    document.getElementById("loading").style.display = "block";
    model = await tmImage.load(URL + "model.json", URL + "metadata.json");
    document.getElementById("loading").style.display = "none";
    console.log("Model Loaded");
}

async function startWebcam() {
    const webcam = document.getElementById("webcam");
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    webcam.srcObject = stream;
    webcamStream = stream;
    isPredicting = true;
    predictLoop();
}

function stopWebcam() {
    isPredicting = false;
    if (webcamStream) {
        webcamStream.getTracks().forEach(track => track.stop());
        document.getElementById("webcam").srcObject = null;
    }
}

async function predictLoop() {
    while (isPredicting) {
        await predict();
        await new Promise(resolve => setTimeout(resolve, 500)); // Delay to avoid overloading the browser
    }
}

async function predict() {
    const webcam = document.getElementById("webcam");
    const prediction = await model.predict(webcam);

    let resultHTML = "<h3>Predictions:</h3>";
    prediction.forEach(pred => {
        resultHTML += `<div class="prediction-item"><strong>${pred.className}:</strong> ${Math.round(pred.probability * 100)}%</div>`;
    });

    document.getElementById("predictions").innerHTML = resultHTML;
}

loadModel();
