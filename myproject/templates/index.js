const classifier = knnClassifier.create();
const webcamElement = document.getElementById('webcam');

let net;
let pred = false;

document.getElementById('webOn').addEventListener('click', async() =>{
	await setupWebcam();
  while (true) {
    const result = await net.classify(webcamElement);

    document.getElementById('console').innerText = `
      prediction: ${result[0].className}\n
      probability: ${result[0].probability}
    `;

    await tf.nextFrame();
  }
});

/*PREDECIT BUTTON ACTIVE???
document.getElementById('predictor').addEventListener('click', async() =>{
	console.log('they predicted it');
	pred = true;
});
*/

async function app() {
  console.log('Loading mobilenet..');

  // Load the model.
  net = await mobilenet.load();
  console.log('Sucessfully loaded model');


/*
var imgUploaded = function(event){
	var imgPrev = document.getElementById('imgPreview');
	imgPreview.src = URL.createObjectURL(event.target.files[0]);
};
*/

const imageUpload = document.getElementById('imageUpload');
imageUpload.addEventListener('change', (event) => {
	console.log('Uploaded and stuff');
	var imgPrev = document.getElementById('imgPreview');
	imgPreview.src = URL.createObjectURL(event.target.files[0]);
	
	imgPreview.onload = async() =>{
		document.getElementById('predictor').addEventListener('click', async() =>{
	console.log('they predicted it');
	
		const result = await net.classify(imgPreview);
		document.getElementById('result').innerHTML = '<p>' + 
          JSON.stringify(result.reduce((prev, current) => {
            return (prev.probability > current.probability) ? prev : current;
          })) + '</p>'
      });

      };

/*
	const file = event.target.files[0];
	const fileType = file['type'];
	if(fileType.search('image') >= 0)
	{
		const imageReader = new FileReader();
	}
	document.getElementById('displayResult').innerText = `
      prediction: ${result[0].className}\n
      probability: ${result[0].probability}
    `;
    */
	//var imgPreview = document.getElementById('imgPreview');
	//imgPreview.load(imageUpload);
});


/*
  await setupWebcam();

  // Reads an image from the webcam and associates it with a specific class
  // index.
  const addExample = classId => {
    // Get the intermediate activation of MobileNet 'conv_preds' and pass that
    // to the KNN classifier.
    const activation = net.infer(webcamElement, 'conv_preds');

    // Pass the intermediate activation to the classifier.
    classifier.addExample(activation, classId);
  };

  // When clicking a button, add an example for that class.
  document.getElementById('class-a').addEventListener('click', () => addExample(0));
  document.getElementById('class-b').addEventListener('click', () => addExample(1));
  document.getElementById('class-c').addEventListener('click', () => addExample(2));

  while (true) {
    if (classifier.getNumClasses() > 0) {
      // Get the activation from mobilenet from the webcam.
      const activation = net.infer(webcamElement, 'conv_preds');
      // Get the most likely class and confidences from the classifier module.
      const result = await classifier.predictClass(activation);

      const classes = ['A', 'B', 'C'];
      document.getElementById('console').innerText = `
        prediction: ${classes[result.classIndex]}\n
        probability: ${result.confidences[result.classIndex]}
      `;
    }

    await tf.nextFrame();
  }

*/
}

async function setupWebcam() {
  return new Promise((resolve, reject) => {
    const navigatorAny = navigator;
    navigator.getUserMedia = navigator.getUserMedia ||
        navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
        navigatorAny.msGetUserMedia;
    if (navigator.getUserMedia) {
      navigator.getUserMedia({video: true},
        stream => {
          webcamElement.srcObject = stream;
          webcamElement.addEventListener('loadeddata',  () => resolve(), false);
        },
        error => reject());
    } else {
      reject();
    }
  });
}

app();