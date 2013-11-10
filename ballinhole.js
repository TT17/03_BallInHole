window.onload = init;

var winW, winH;
var ball;
var mouseDownInsideball;
var touchDownInsideball;
var movementTimer;
var lastMouse, lastOrientation, lastTouch;
var xRandom = Math.floor((Math.random()* window.innerWidth));
var yRandom = Math.floor((Math.random()* window.innerHeight));

                            
// Initialisation on opening of the window
function init()
{
        lastOrientation = {};
        window.addEventListener('resize', doLayout, false);
        document.body.addEventListener('mousemove', onMouseMove, false);
        document.body.addEventListener('mousedown', onMouseDown, false);
        document.body.addEventListener('mouseup', onMouseUp, false);
        document.body.addEventListener('touchmove', onTouchMove, false);
        document.body.addEventListener('touchstart', onTouchDown, false);
        document.body.addEventListener('touchend', onTouchUp, false);
        window.addEventListener('deviceorientation', deviceOrientationTest, false);
        lastMouse = {x:0, y:0};
        lastTouch = {x:0, y:0};
        mouseDownInsideball = false;
        touchDownInsideball = false;    
        doLayout(document);        
}

function drawHole()
{
	var context = surface.getContext('2d');   
	var radius = surface.width/45;
    context.beginPath();
    context.arc(xRandom, yRandom, radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'white';
    context.fill();
    context.lineWidth = 6;
    context.strokeStyle = 'green';
    context.stroke();
          
}

var zecsec = 0;
var seconds = 0;
var mints = 0;

var start = false;
var pauze = false;
var reset = false;

var startchron = 0;

function chronometer() 
{
  if(startchron == 1) 
  {
    zecsec += 1;       // set tenths of a second

    // set seconds
    if(zecsec > 9) 
	{
      zecsec = 0;
      seconds += 1;
    }

    // set minutes
    if(seconds > 59) 
	{
      seconds = 0;
      mints += 1;
    }

    // adds data in #showtm
    document.getElementById('showtm').innerHTML = mints + ' : '+ seconds + '.' + zecsec;

    // if the chronometer reaches to the values for stop, calls whenChrStop(), else, auto-calls chronometer()
    if(zecsec == stzecsec && seconds == stseconds && mints == stmints) toAutoStop();
    else setTimeout("chronometer()", 100);
  }
}

function doStart() { start = true; startchron = 1; chronometer(); }        // starts the chronometer
function doPauze() { pauze = true; startchron = 0; }                      // pauzes the chronometer
function doReset() 
{
	zecsec = 0;  seconds = 0; mints = 0; startchron = 0; 
	document.getElementById('showtm').innerHTML = mints + ' : '+ seconds + '.' + zecsec;
}

// Does the gyroscope or accelerometer actually work?
function deviceOrientationTest(event) 
{
        window.removeEventListener('deviceorientation', deviceOrientationTest);
        if (event.beta != null && event.gamma != null) 
		{
            window.addEventListener('deviceorientation', onDeviceOrientationChange, false);
            movementTimer = setInterval(onRenderUpdate, 10); 
        }
}

function doLayout(event) 
{
        winW = window.innerWidth;
        winH = window.innerHeight;
        var surface = document.getElementById('surface');
        surface.width = winW;
        surface.height = winH;
        var radius = surface.width/50;
        ball = {  	radius:radius,
					x:Math.round(winW/2),
                    y:Math.round(winH/2),
                    color:'rgba(255, 0, 0, 255)'};    
                                
        renderBall();      
        drawHole();
}
        
function renderBall() 
{
        var surface = document.getElementById('surface');
        var context = surface.getContext('2d');
        context.clearRect(0, 0, surface.width, surface.height);
        
        drawHole();
        
        context.beginPath();
        context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
        context.fillStyle = ball.color;
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = ball.color;
        context.stroke();      
} 

function onRenderUpdate(event) 
{
        var xDelta, yDelta;
        switch (window.orientation) 
		{
                case 0: // portrait - normal
                        xDelta = lastOrientation.gamma;
                        yDelta = lastOrientation.beta;
                        break;
                case 180: // portrait - upside down
                        xDelta = lastOrientation.gamma * -1;
                        yDelta = lastOrientation.beta * -1;
                        break;
                case 90: // landscape - bottom right
                        xDelta = lastOrientation.beta;
                        yDelta = lastOrientation.gamma * -1;
                        break;
                case -90: // landscape - bottom left
                        xDelta = lastOrientation.beta * -1;
                        yDelta = lastOrientation.gamma;
                        break;
                default:
                        xDelta = lastOrientation.gamma;
                        yDelta = lastOrientation.beta;
        }
        moveBall(xDelta, yDelta);
        
}

function inHole(xDelta, yDelta)
{
        if (ball.x > xRandom-1 && ball.x < xRandom+1 && ball.y > yRandom-1 && ball.y < yRandom+1)
		{                         
                alert("Je hebt het spelletje uitgespeeld op " + document.getElementById('showtm').innerHTML + " seconden !");
				xRandom = Math.floor((Math.random()* window.innerWidth));
				yRandom = Math.floor((Math.random()* window.innerHeight));
				drawHole();
				init(); 
                doReset();                                
        }
}

function moveBall(xDelta, yDelta) 
{        
	if (startchron == 1)
	{
		ball.x += xDelta;
		ball.y += yDelta;
		renderBall();
		if (ball.x > xRandom-1 && ball.x < xRandom+1 && ball.y > yRandom-1 && ball.y < yRandom+1)
		{                			                
			alert("Je hebt het spelletje uitgespeeld op " + document.getElementById('showtm').innerHTML + " seconden !");
			xRandom = Math.floor((Math.random()* window.innerWidth));
			yRandom = Math.floor((Math.random()* window.innerHeight));
			drawHole();
			init();
			doReset();                                
		}
	}		        
}

function onMouseMove(event) 
{
        
	if(mouseDownInsideball)
	{
        var xDelta, yDelta;
        xDelta = event.clientX - lastMouse.x;
        yDelta = event.clientY - lastMouse.y;
        moveBall(xDelta, yDelta);
        lastMouse.x = event.clientX;
        lastMouse.y = event.clientY;
    }
}

function onMouseDown(event) 
{
        var x = event.clientX;
        var y = event.clientY;
        if(     x > ball.x - ball.radius &&
                x < ball.x + ball.radius &&
                y > ball.y - ball.radius &&
                y < ball.y + ball.radius){
                mouseDownInsideball = true;
                lastMouse.x = x;
                lastMouse.y = y;
        } 
		else 
		{
                mouseDownInsideball = false;
        }
} 

function onMouseUp(event) 
{
        mouseDownInsideball = false;
}

function onTouchMove(event) 
{
        event.preventDefault();        
        if(touchDownInsideball)
		{
            var touches = event.changedTouches;
            var xav = 0;
            var yav = 0;
            for (var i=0; i < touches.length; i++) 
			{
                var x = touches[i].pageX;
                var y = touches[i].pageY;
                xav += x;
                 yav += y;
            }
            xav /= touches.length;
            yav /= touches.length;
            var xDelta, yDelta;

            xDelta = xav - lastTouch.x;
            yDelta = yav - lastTouch.y;
            moveBall(xDelta, yDelta);
            lastTouch.x = xav;
            lastTouch.y = yav;
        }
}

function onTouchDown(event) 
{
        event.preventDefault();
        touchDownInsideball = false;
        var touches = event.changedTouches;
        for (var i=0; i < touches.length && !touchDownInsideball; i++) 
		{
                var x = touches[i].pageX;
                var y = touches[i].pageY;
                if(        x > ball.x - ball.radius &&
                        x < ball.x + ball.radius &&
                        y > ball.y - ball.radius &&
                        y < ball.y + ball.radius){
                        touchDownInsideball = true;                
                        lastTouch.x = x;
                        lastTouch.y = y;                        
                }
        }
} 

function onTouchUp(event)
{
        touchDownInsideball = false;
}

function onDeviceOrientationChange(event) 
{
        lastOrientation.gamma = event.gamma;
        lastOrientation.beta = event.beta;
}


