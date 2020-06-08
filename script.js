var record_animation = false;
var name = "image_"
var total_frames = 300;
var frame = 0;
var loop = 0;
var total_time = 4*Math.PI;
var rate = total_time/total_frames;

var time = 0;
//var rate = 0.03;

var hold = false;
var hold_time = 0;
var hold_change_rate = 0.2;
var max_hold_time = 500;

const color_palette = ['#00FBFF', '#1884FF', '#E87BFE']
                    //['#6b5b95', '#feb236', '#d64162']
                    //['#f0efef', '#ddeedd', "#c2d4dd", "#b0aac0"];

scales = 100;

var N_gon = 5;

var random_colors = random_array(scales,color_palette.length);

var stop_animation = false;
var fps, fpsInterval, startTime, now, then, elapsed;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

startAnimating(30);

function draw() {
  canvas.width = 300; //window.innerWidth;
  canvas.height = 300; //window.innerHeight;
  
  ctx.fillStyle = 'rgba(0,0,0,1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  x_origin = canvas.width/2;
  y_origin = canvas.height/2;
  
  max = Math.max(x_origin, y_origin);
  
  range = [0, 2*Math.PI];
  scales = 100; 
  growth = 0.2*max; 
  stretch = 0.8*max;
  arc = .3;
  fold = 2*Math.PI/5;
  max_hold_time = 100;
  t = hold_time/max_hold_time;
  s = easeinout(t,2);
  r_vary = (0.005*max)*(40 + 60*s);
  wiggle = 0.02*2*Math.PI + 0.5*2*Math.PI*s
  
  if (true) {
    if (true) {
      u = t**4;
      amount = Math.floor(scales*u) + 1;
      random_update(random_colors, amount, 3);
    }
  }
  
  for (let j = 0; j < 5; j++) {
    polyarm(N_gon, x_origin, y_origin,
            range, scales,
            growth, stretch,
            arc, j*fold, r_vary, wiggle,
            time);
  }
  
  //time += rate;
  
  
  if (hold === true && hold_time < max_hold_time) {
      hold_time += hold_change_rate;
  }
  
   
  if (hold === false && hold_time > 0 ) {
      hold_time -= hold_change_rate;
  }
  
 
  
  canvas.addEventListener('mousedown', e => {
    hold = true;
    N_gon = 3 + Math.floor(Math.random()*4);
    });
      
    canvas.addEventListener('mouseup', e => {
      hold = false;
    });
    
    canvas.addEventListener('touchstart', function(e) {
        event.preventDefault();      
        hold = true;
        N_gon = 3 + Math.floor(Math.random()*4)
    }, false);
      
    canvas.addEventListener('touchend', function(e) {     
        hold = false; 
    }, false);
      
 
  
  //window.requestAnimationFrame(draw);
}


function polyarm(N, x_origin, y_origin, range, scales, growth, stretch, arc, rotate, r_vary, wiggle, time) {
  
  let start_angle = range[0] + rotate;
  let end_angle = range[1] + rotate;
  let angle_range = Math.abs(start_angle - end_angle);
  let a_step = angle_range/scales;
  
  
  for (let i = 1; i <= scales; i++) {
      r = stretch*i*arc*a_step + (i/scales)*r_vary*(0.5 + 0.5*Math.sin(1*time + i*wiggle));
      a = start_angle + i*a_step
      x_pos = x_origin + r*Math.cos(a);
      y_pos = y_origin + r*Math.sin(a);
      size = i*growth/scales;
      shift = 0;
      color = color_palette[random_colors[i-1]];
      polygon(N, color, x_pos, y_pos, size, shift) 
  }
}

function polygon(N, color, x_pos, y_pos, size, shift) {
  
  ctx.beginPath();
  ctx.moveTo(x_pos + size*Math.cos(shift*2*Math.PI),
             y_pos + size*Math.sin(shift*2*Math.PI));
  for (let i = 1; i < N; i++) {
    ctx.lineTo(x_pos + size*Math.cos((i/N + shift)*2*Math.PI),
               y_pos + size*Math.sin((i/N + shift)*2*Math.PI));
  }
  ctx.closePath();
  ctx.stroke();
  ctx.fillStyle = color; 
  ctx.fill();
  
}


function random_array(length, max_val) {
  
  array = Array.apply(null, Array(length)).map(function (x, i) { return parseInt(Math.floor(Math.random()*max_val)); })
  return array;
}

function random_update(array, amount, values) {
  let length = array.length;
  let selection = random_array(amount, length);
  for (let i = 0; i < amount; i++) {
    index = selection[i];
    array[index] = parseInt(Math.floor(Math.random()*values));
  }
}

function easeinout(t, p) {
     let u = t**p;
     return u/(u + (1 - t)**p);
}

function startAnimating(fps) {
    
  fpsInterval = 1000/fps;
  then = window.performance.now();
  startTime = then;
  
  animate();
}

function animate(newtime) {

  if (stop_animation) {
      return;
  }

  requestAnimationFrame(animate);

  now = newtime;
  elapsed = now - then;

  if (elapsed > fpsInterval) {
      then = now - (elapsed % fpsInterval);
  
      draw();
      console.log(hold, frame, time);
      frame = (frame+1)%total_frames;
      time = rate*frame;
      if (time < total_time/2) {
        hold = true;
      }
      else {
        hold = false;
      }

      if(record_animation) {

          if (loop === 1) { 
          let frame_number = frame.toString().padStart(total_frames.toString().length, '0');
          let filename = name+frame_number+'.png'
              
          dataURL = canvas.toDataURL();
          var element = document.createElement('a');
          element.setAttribute('href', dataURL);
          element.setAttribute('download', filename);
          element.style.display = 'none';
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
          }

          if (frame + 1 === total_frames) {
              loop += 1;
          }

          if (loop === 2) { stop_animation = true }
      }
  }
}