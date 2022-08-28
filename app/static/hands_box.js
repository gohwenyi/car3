const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('output_canvas');
const canvasCtx = canvasElement.getContext('2d');
videoElement.setAttribute('autoplay', '');
videoElement.setAttribute('muted', '');
videoElement.setAttribute('playsinline', '');

const canvasElement2 = document.getElementById("output_canvas2");
const canvasCtx2 = canvasElement2.getContext('2d');

var age = 0;
var agestr = "";
var salary = 0;
var salarystr = "";
var counter = 0;
var clickcounter1 = 0;
var clickcounter2 = 0;

var video = document.querySelector("#input_video");

function onResults(results) {
  
  var cx,cy;	
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height);
  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
	  var myJSON = JSON.stringify(landmarks[8]);
	  var myJSON2 = JSON.parse(myJSON);
	  cx = parseInt(myJSON2.x*canvasElement.width);
	  cy = parseInt(myJSON2.y*canvasElement.height);	
	  
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                     {color: '#00FF00', lineWidth: 5});
      drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});
    }
  }
  canvasCtx.font = "20px Arial";
  canvasCtx.fillText("Enter Your Age :" + agestr, 10, 20);
  canvasCtx.fillText("Enter your salary : " , 10, 160);
  canvasCtx.fillText(salarystr, 10, 100);
  canvasCtx.fillText("Press the button:", 10, 360);
  canvasCtx.fillText("Submit ", 200, 400);

  if (clickcounter1 == 1)
  {
    canvasCtx.font = "15px Arial";
    canvasCtx.fillText("1.Below 20", 230, 30);
    canvasCtx.fillText("2.20-30", 230, 80);
    canvasCtx.fillText("3.30-40", 230, 130);
    canvasCtx.fillText("4.40 above", 230, 180);

  }

  if (clickcounter2 == 1)
  {
    canvasCtx.font = "15px Arial";
    canvasCtx.fillText("1.Below 2000", 230, 30);
    canvasCtx.fillText("2.2001-4000", 230, 80);
    canvasCtx.fillText("3.4001-6000", 230, 130);
    canvasCtx.fillText("4.6001-8000", 230, 180);
    canvasCtx.fillText("5.8001 above", 230, 230);

canvasCtx.restore();
  
  let src = cv.imread('output_canvas');

  cv.rectangle(src, new cv.Point(0, 10), new cv.Point(220, 60), [255, 0, 0, 255], 4);
  cv.rectangle(src, new cv.Point(0, 60), new cv.Point(220, 110), [255, 0, 0, 255], 4);

  if (cx > 0 && cx < 220 && cy > 10 && cy<60 && counter ==0 && clickcounter1==0) 
  {
    clickcounter1 = 1;
    clickcounter2 = 0;
  }else if (cx > 0 && cx < 220 && cy > 10 && cy<60 && counter ==0 && clickcounter1==1) 
  {
    clickcounter1 = 0;
  }

  if (cx > 0 && cx < 220 && cy > 60 && cy<110 && counter ==0 && clickcounter2==0) 
  {
    clickcounter1 = 0;
    clickcounter2 = 1;
  }else if (cx > 2 && cx < 220 && cy > 60 && cy<110 && counter ==0 && clickcounter2==1) 
  {
    clickcounter2 = 0;
  }

  if (clickcounter1 == 1)
  {
    cv.rectangle(src, new cv.Point(220, 10), new cv.Point(340, 60), [255, 0, 0, 255], 4);
    cv.rectangle(src, new cv.Point(220, 60), new cv.Point(340, 110), [255, 0, 0, 255], 4);
    cv.rectangle(src, new cv.Point(220, 110), new cv.Point(340, 160), [255, 0, 0, 255], 4);
    cv.rectangle(src, new cv.Point(220, 160), new cv.Point(340, 210), [255, 0, 0, 255], 4);
    if (cx > 220 && cx < 340 && cy > 10 && cy<60 && counter ==0) 
    {
      age = 18;
      agestr = "Below 20";
    }else if (cx > 220 && cx < 340 && cy > 60 && cy<110 && counter ==0) 
    {
      age = 28;
      agestr = "20-30";
    }else if (cx > 220 && cx < 340 && cy > 110 && cy<160 && counter ==0) 
    {
      age = 38;
      agestr = "30-40";
    }else if (cx > 220 && cx < 340 && cy > 160 && cy<210 && counter ==0) 
    {
      age = 48;
      agestr = "Above 40";
    }
  }
}
}
function onResults2(results) {
  canvasCtx2.save();
  canvasCtx2.translate(canvasElement2.width, 0);
  canvasCtx2.scale(-1, 1);
  canvasCtx2.clearRect(0, 0, canvasElement2.width, canvasElement2.height);
  canvasCtx2.drawImage(
      results.image, 0, 0, canvasElement2.width, canvasElement2.height);
  canvasCtx2.restore();
}

const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});
hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.8,
  minTrackingConfidence: 0.8
});
hands.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    //flip the video content and load into output_canvas2 before process to detect finger
    onResults2({image: videoElement});
    //use the flipped image in output_canvas2 to detect finger
    await hands.send({image: canvasElement2});
  },
  width: 480,
  height: 480
});
camera.start();

