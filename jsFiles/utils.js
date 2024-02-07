
// initialize jsPsych
const jsPsych = initJsPsych({
    on_finish: (data) => {
        data.boot = boot;
        if(!boot) {
            document.body.innerHTML = 
                `<div align='center' style="margin: 10%">
                    <p>Thank you for participating!<p>
                    <b>You will be automatically re-directed to Prolific in a few moments.</b>
                </div>`;
            setTimeout(() => { 
                location.href = `https://app.prolific.co/submissions/complete?cc=${completionCode}`
            }, 1000);
        }
    },
});

// set and save subject ID
let subject_id = jsPsych.data.getURLVariable("PROLIFIC_PID");
if (!subject_id) { subject_id = jsPsych.randomization.randomID(10) };
jsPsych.data.addProperties({ subject: subject_id });

// define file name
const filename = `${subject_id}.csv`;

// define completion code for Prolific
const completionCode = "C1ACNNE6";

// when true, boot participant from study without redirecting to Prolific
let boot = false;

// function for saving survey data in wide format
const saveSurveyData = (data) => {
    const names = Object.keys(data.response);
    const values = Object.values(data.response);
    for(let i = 0; i < names.length; i++) {
        data[names[i]] = values[i];
    };      
};

const getTotalErrors = (data, correctAnswers) => {
    const answers = Object.values(data.response);
    const errors = answers.map((val, index) => val === correctAnswers[index] ? 0 : 1)
    const totalErrors = errors.reduce((partialSum, a) => partialSum + a, 0);
    return totalErrors;
};

// code for spinner task
const createSpinner = function(canvas, spinnerData, score, sectors) {

  /* get context */
  const ctx = canvas.getContext("2d"); 

  /* get pointer */
  const pointer = document.querySelector("#spin");

  /* get score message */
  const scoreMsg = document.getElementById("score");

  /* get spin number message */
  const spinNumMsg = document.getElementById("spin-num");

  /* get wheel properties */
  let wheelWidth = canvas.getBoundingClientRect()['width'];
  let wheelHeight = canvas.getBoundingClientRect()['height'];
  let wheelX = canvas.getBoundingClientRect()['x'] + wheelWidth / 2;
  let wheelY = canvas.getBoundingClientRect()['y'] + wheelHeight / 2;
  const tot = sectors.length; // total number of sectors
  const rad = wheelWidth / 2; // radius of wheel
  const PI = Math.PI;
  const arc = (2 * PI) / tot; // arc sizes in radians

  /* spin dynamics */
  const friction = 0.978;  // 0.995=soft, 0.99=mid, 0.98=hard
  const angVelMin = 5; // Below that number will be treated as a stop
  let angVelMax = 0; // Random ang.vel. to acceletare to 
  let angVel = 0;    // Current angular velocity

  /* state variables */
  let isGrabbed = false;       // true when wheel is grabbed, false otherwise
  let isDragging = false;      // true when wheel is being dragged, false otherwise
  let isSpinning = false;      // true when wheel is spinning, false otherwise
  let isAccelerating = false;  // true when wheel is accelerating, false otherwise
  let lastAngles = [0,0,0];    // store the last three angles
  let correctSpeed = [0]       // speed corrected for 360-degree limit
  let startAngle = null;       // angle of grab
  let oldAngle = 0;            // wheel angle prior to last perturbation
  let currentAngle = null;     // wheel angle after last perturbation
  let onWheel = false;         // true when cursor is on wheel, false otherwise
  let spin_num = 5             // number of spins


  /* define spinning functions */

  const onGrab = (x, y) => {
    if (!isSpinning) {
      canvas.style.cursor = "grabbing";
      isGrabbed = true;
      startAngle = calculateAngle(x, y);
    };
  };

  const calculateAngle =  (currentX, currentY) => {
    let xLength = currentX - wheelX;
    let yLength = currentY - wheelY;
    let angle = Math.atan2(xLength, yLength) * (180/Math.PI);
    return 360 - angle;
  };

  const onMove = (x, y) => {
    if(isGrabbed) {
      canvas.style.cursor = "grabbing";
      isDragging = true;
    };
    if(!isDragging)
      return
    lastAngles.shift();
    let deltaAngle = calculateAngle(x, y) - startAngle;
    currentAngle = deltaAngle + oldAngle;
    lastAngles.push(currentAngle);
    let speed = lastAngles[2] - lastAngles[0];
    if (Math.abs(speed) < 200) {
      correctSpeed.shift();
      correctSpeed.push(speed);
    };
    render(currentAngle);
  };

  const render = (deg) => {
    canvas.style.transform = `rotate(${deg}deg)`;
  };

  const onRelease = function() {
    isGrabbed = false;
    if(isDragging){
      isDragging = false;
      oldAngle = currentAngle;
      let speed = correctSpeed[0];
      if (Math.abs(speed) > angVelMin) {
        isAccelerating = true;
        isSpinning = true;
        angVelMax = rand(25, 50);
        giveMoment(speed)
      };
    };   
  };

  const giveMoment = function(speed) {

    // stop accelerating when max speed is reached
    if (Math.abs(speed) >= angVelMax) isAccelerating = false;

    // accelerate
    if (isAccelerating) {
      speed *= 1.06; // Accelerate
      const req = window.requestAnimationFrame(giveMoment.bind(this, speed));
      oldAngle += speed;
      lastAngles.shift();
      lastAngles.push(oldAngle);
      render(oldAngle);
    }
    
    // decelerate and stop
    else {
      isAccelerating = false;
      speed *= friction; // Decelerate by friction  
      const req = window.requestAnimationFrame(giveMoment.bind(this, speed));
      if (Math.abs(speed) > angVelMin * .15) {
        // decelerate
        oldAngle += speed;
        lastAngles.shift();
        lastAngles.push(oldAngle);
        render(oldAngle);       
      } else {
        // stop spinner
        speed = 0;
        currentAngle = oldAngle;
        let sector = sectors[getIndex()];
        spinnerData.outcomes.push(parseFloat(sector.label));
        spinnerData.colors.push(sector.color);
        drawSector(sectors, getIndex());
        updateScore(parseFloat(sector.label), sector.color);
        window.cancelAnimationFrame(req);
      };
    };
  };

  /* generate random float in range min-max */
  const rand = (m, M) => Math.random() * (M - m) + m;

  const updateScore = (points, color) => {
    score += points;
    spinnerData.score = score;
    spin_num--;
    let s = 's';
    spin_num == 1 ? s == '' : s == 's';
    //scoreMsg.innerHTML = `<span style="color:${color}; font-weight: bolder">${score}</span>`;
    //scoreMsg.innerHTML = `<span style="font-weight: bold">${score}</span>`;
    //spinNumMsg.innerHTML = `(${spin_num} spin${s} remaining)`;
    setTimeout(() => {
      //scoreMsg.innerHTML = `${score}`
      isSpinning = false;
      drawSector(sectors, null);
      onWheel ? canvas.style.cursor = "grab" : canvas.style.cursor = "";
    }, 1000);
  };

  const getIndex = () => {
    let normAngle = 0;
    let modAngle = currentAngle % 360;
    if (modAngle > 270) {
      normAngle = 360 - modAngle + 270;
    } else if (modAngle < -90) { 
      normAngle =  -modAngle - 90;
    } else {
      normAngle = 270 - modAngle;
    }
    let sector = Math.floor(normAngle / (360 / tot))
    return sector
  }

  const textUnderline = function(ctx, text, x, y, color, textSize, align){

    //Get the width of the text
    var textWidth = ctx.measureText(text).width;

    //var to store the starting position of text (X-axis)
    var startX;

    //var to store the starting position of text (Y-axis)
    // I have tried to set the position of the underline according 
    // to size of text. You can change as per your need
    var startY = y+(parseInt(textSize)/10);

    //var to store the end position of text (X-axis)
    var endX;

    //var to store the end position of text (Y-axis)
    //It should be the same as start position vertically. 
    var endY = startY;

    //To set the size line which is to be drawn as underline.
    //Its set as per the size of the text. Feel free to change as per need.
    var underlineHeight = parseInt(textSize)/15;

    //Because of the above calculation we might get the value less 
    //than 1 and then the underline will not be rendered. this is to make sure 
    //there is some value for line width.
    if(underlineHeight < 1){
      underlineHeight = 1;
    }

    ctx.beginPath();
    if(align == "center"){
      startX = x - (textWidth/2);
      endX = x + (textWidth/2);
    }else if(align == "right"){
      startX = x-textWidth;
      endX = x;
    }else{
      startX = x;
      endX = x + textWidth;
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = underlineHeight;
    ctx.moveTo(startX,startY);
    ctx.lineTo(endX,endY);
    ctx.stroke();
  }

  //* Draw sectors and prizes texts to canvas */
  const drawSector = (sectors, sector) => {
    for (let i = 0; i < sectors.length; i++) {
      const ang = arc * i;
      ctx.save();
      // COLOR
      ctx.beginPath();
      ctx.fillStyle = sectors[i].color;
      ctx.moveTo(rad, rad);
      ctx.arc(rad, rad, rad, ang, ang + arc);
      ctx.lineTo(rad, rad);
      ctx.fill();
      // TEXT
      ctx.translate(rad, rad);
      ctx.rotate( (ang + arc / 2) + arc );
      ctx.textAlign = "center";
      ctx.fillStyle = "#fff";
      if (isSpinning && i == sector) {
        ctx.font = "bolder 65px sans-serif"
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.strokeText(sectors[i].label, 0, -140);
        ctx.fillText(sectors[i].label, 0, -140);
      } else {
        ctx.font = "bold 50px sans-serif"
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.strokeText(sectors[i].label, 0, -140);
        ctx.fillText(sectors[i].label, 0, -140);
      }
     // ctx.fillText(sector.label, rad - 80, 10);
     // textUnderline(ctx,sectors[i].label, 0, -135, "#fff", "50px", "center");
      // RESTORE
      ctx.restore();
    }
  };

  drawSector(sectors, null);

  /* add event listners */
  canvas.addEventListener('mousedown', function(e) {
      if (onWheel) { onGrab(e.clientX, e.clientY) };
  });

  canvas.addEventListener('mousemove', function(e) {
      let dist = Math.sqrt( (wheelX - e.clientX)**2 + (wheelY - e.clientY)**2 );
      dist < rad ? onWheel = true : onWheel = false;
      onWheel && !isGrabbed && !isSpinning ? canvas.style.cursor = "grab" : canvas.style.cursor = "";
      if(isGrabbed && onWheel) { onMove(e.clientX, e.clientY) };
  });

  window.addEventListener('mouseup', onRelease);

  window.addEventListener('resize', function(event) {
    wheelWidth = canvas.getBoundingClientRect()['width'];
    wheelHeight = canvas.getBoundingClientRect()['height'];
    wheelX = canvas.getBoundingClientRect()['x'] + wheelWidth / 2;
    wheelY = canvas.getBoundingClientRect()['y'] + wheelHeight / 2;
  }, true);

};





    




