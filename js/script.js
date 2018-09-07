////SpaceSim////////

/*Physics note:
The simulation uses the same laws of physics as the real universe except 
that constants have been changed for ease of viewing on screen. The gravitational 
constant has been changed to 1/7287597656250 and the torque is multiplied by 10. 
The moment of inertia of the rocket has been approximated as that of a solid cylinder. 
Also, when considering the speeds and accelerations involved in the simulation, 
keep in mind that 1 second in the simulation is one frame, which is much less than 
one second in real life.
*/

/////////MAIN GLOBAL INSTANTIATIONS AND DECLARATIONS
///////////////////////////
//main default variable values:
var rocketMassGlobal = 1000;
var planetMassGlobal = 5.97*Math.pow(10,24);
var planetRadiusGlobal = 6.4*Math.pow(10,6);
var thrustSettingGlobal = 20;
var rocketHeightGlobal = 120;
var planetAngleGlobal = 0;

var game = new Game();//create a new game object
var isPaused = false;//this variable says whether or not the game is paused
var loopTime;//this variable will be used to store the time in the simulation that occurs during one frame
var previousNearGround = true;
////////OVERALL CONTROL METHODS
///////////////////////////////
/**
 * prepare to start game when document is ready
*/
$(document).ready(function () {
    $('#dialogFormMenu').hide();//hide menu dialog box
    $('#dialogFormCrash').hide();
    loopTime = 1;//set the loop time variable to one second
    initializePlayGame();//start the simulation
});

/**
 * Initialize and start the simulation, using the methods in the game object
*/
function initializePlayGame() {
    previousNearGround = false;
    game.init(rocketMassGlobal, planetMassGlobal, planetRadiusGlobal, thrustSettingGlobal, rocketHeightGlobal, planetAngleGlobal);
    game.start();
}

/*
*activate the right version of the prompt dialog box help and options menu with input text
*Allow for Ok and cancel buttons to work, and set what is done when each is pressed
*/
function customTextAlert(promptVersion){
  if (promptVersion == "#dialogFormMenu"){//if the main options menu is required
    //fill the dialog box paragraphs with text
    document.getElementById("dialogFormMenuHelpText").innerHTML = "<p>SpaceSim is a simulation of a rocket flying in a low air resistance atmosphere. Use the up and down arrow keys to increase or decrease the magnitude of the thrust, and use the left and right arrow keys to change the angle of the rocket booster. If you land with a horizontal or vertical speed faster than 2m/s or an angle of greater than 15 degrees you will crash. Orbits can be achieved around the planet, and note that at an altitude of over 100000m the rocket reaches space.</p>";
    document.getElementById("dialogFormMenuRocketMassText").innerHTML = "<p>You can enter a new rocket mass from 10 to 10000(kg):</p>";
    document.getElementById("dialogFormMenuAngleText").innerHTML = "<p>You can enter a new starting angle on the planet within the range -180&lt;angle\<=180(degrees):</p>";
    document.getElementById("dialogFormMenuPlanetMassText").innerHTML = "<p>You can enter a new planet mass from 0.1 to 15 (10^24 kg):</p>";
    document.getElementById("dialogFormMenuPlanetRadiusText").innerHTML = "<p>You can enter a new planet radius from 0.1 to 15 (10^6 m):</p>";
    document.getElementById("dialogFormMenuThrustSettingText").innerHTML = "<p>You can enter a new magnitude of thrust per thrust setting from 5 to 50 (N):</p>";
    document.getElementById("dialogFormMenuPhysics").innerHTML = "<p>Physics note: The simulation uses the same laws of physics as the real universe except that constants have been changed for ease of viewing on screen. The gravitational constant has been changed to 1/7287597656250 and the torque is multiplied by 10. The moment of inertia of the rocket has been approximated as that of a solid cylinder. Also, when considering the speeds and accelerations involved in the simulation, keep in mind that 1 second in the simulation is one frame, which is much less than one second in real life.</p>";
    document.getElementById("dialogFormMenuRocketLengthText").innerHTML = "<p>You can enter a new rocket length from 70 to 220(m):</p>";
    //fill the dialog box input fields with current variable values
    $('input[name="rocketMassInput"]').val(game.rocket.mass);
    $('input[name="planetMassInput"]').val(game.planet.mass/Math.pow(10,24));
    $('input[name="planetRadiusInput"]').val(game.planet.radius/Math.pow(10,6));
    $('input[name="thrustSettingInput"]').val(game.rocket.thrustSetting);
    $('input[name="rocketLengthInput"]').val(game.rocket.imageHeight);
    $('input[name="angleInput"]').val(planetAngleGlobal);
  } else if (promptVersion == "#dialogFormCrash"){
    document.getElementById("dialogFormCrashText").innerHTML = "<p>You crashed. Please become a better pilot. Try again by pressing OK:</p>";
  }
    $(promptVersion).dialog({// set up the dialog box
      height: 400,
      width: 100 + "vh",
      modal: true,
      closeOnEscape: false,
      //what to do when each dialog box button is pressed:
      buttons: {
      'OK': function () {//if ok is pressed then get the inputted values and write them to corresponding the simulation variables
          if (promptVersion == "#dialogFormMenu"){
            var isValid = true;
            //Check if all the inputs are valid
            mass = $('input[name="rocketMassInput"]').val();
            if (isNaN(mass) || mass == "" || parseFloat(mass) > 10000 || parseFloat(mass) < 10  ){
              $(this).dialog('close'); 
              isValid = false;  
            }
            thrustSetting = $('input[name="thrustSettingInput"]').val();
            if (isNaN(thrustSetting) || thrustSetting == "" || parseFloat(thrustSetting) > 50 || parseFloat(thrustSetting) < 5  ){
              $(this).dialog('close');   
              isValid = false;
            }
            planetMass = $('input[name="planetMassInput"]').val();
            if (isNaN(planetMass) || planetMass == "" || parseFloat(planetMass) > 15 || parseFloat(planetMass) < 0.1  ){
              $(this).dialog('close');  
              isValid = false; 
            }
            planetRadius = $('input[name="planetRadiusInput"]').val();
            if (isNaN(planetRadius) || planetRadius== "" || parseFloat(planetRadius) > 15 || parseFloat(planetRadius) < 0.1  ){
              $(this).dialog('close');  
              isValid = false; 
            }
            height = $('input[name="rocketLengthInput"]').val();
            if (isNaN(height) || height== "" || parseFloat(height) > 220 || parseFloat(height) < 70  ){
              $(this).dialog('close');   
              isValid = false;
            }
            angle = $('input[name="angleInput"]').val();
            if (isNaN(angle) || angle== "" || parseFloat(angle) <=-180 || parseFloat(height) > 180 ){
              $(this).dialog('close');   
              isValid = false;
            }
            if (isValid){//if the inputs are valid then change the simulation parameters
            rocketMassGlobal = mass;
            thrustSettingGlobal = thrustSetting;
            planetMassGlobal = planetMass*Math.pow(10,24);
            planetRadiusGlobal = planetRadius*Math.pow(10,6);
            rocketHeightGlobal = height;
            planetAngleGlobal = angle;
            //unpause the game
            isPaused = false;
            initializePlayGame();//restart game with the new parameters
            $(this).dialog('close');//close dialog box
            } else {//if inputs are invalid then show dialog box again
              alert("Please try again and ensure all values are valid.");
              customTextAlert("#dialogFormMenu"); 
            }
          }  
      },'Cancel': function () {//if cancel is pressed then unpause game and close dialog box
            isPaused = false;
            $(this).dialog('close');
      },'Reset Simulation': function () {//if reset is pressed then reset the simulation by refreshing the page
            location.reload();
      }
     }
    });
}

/*
*This is the alert dedicated to dealing with a rocket crash
*/
function crashAlert(promptVersion){
    document.getElementById("dialogFormCrashText").innerHTML = "<p>You crashed. Please become a better pilot. Try again by pressing OK:</p>";
    $(promptVersion).dialog({// set up the dialog box
      height: 400,
      width: 100 + "vh",
      modal: true,
      closeOnEscape: false,
      //what to do when each dialog box button is pressed:
      buttons: {
      'OK': function () {//if ok is pressed then reset game by refreshing
          location.reload();
      }
     }
    });
}

////////IMAGE RELATED METHODS AND OBJECTS
//////////////////////////////////////////

/**
 * Define an object to hold all simulation images
 */
var imageRepository = new function() {
  //sky background
  this.sky = new Image();
  this.sky.src = "images/1 (1).jpg";
  
  //ground background
  this.ground = new Image();
  this.ground.src = "images/1.jpg";

  //rocket
  this.rocket = new Image();
  this.rocket.src = "images/rocketForEditingDone.png";

  //fire
  this.fire = new Image();
  this.fire.src = "images/FireDoneEditing.png";

  //space
  this.space = new Image();
  this.space.src = "images/space.jpg";
}

/**
 * This class is used as the parent of all objects that will be drawn to the screen
 */
class Drawable {
    constructor(x, y, canvasWidth, canvasHeight, context, imageWidth, imageHeight) {
    this.x = x;//x location on the canvas
    this.y = y;//y location on the canvas
    this.canvasWidth = canvasWidth; //width of the canvas
    this.canvasHeight = canvasHeight; //height of the canvas
    this.context = context; //drawing context of the canvas
    this.imageWidth = imageWidth; // width of image
    this.imageHeight = imageHeight; //height of image
    }
}

/**
 * The background child of drawable
 */
class Background extends Drawable {
  constructor(x, y, canvasWidth, canvasHeight, context, imageWidth, imageHeight){
    super(x, y, canvasWidth, canvasHeight, context, imageWidth, imageHeight);
  }

    /**
    * This method draws the right background to the screen (background image depends on rocket height)
    */
    draw() {
    this.context.clearRect(-this.canvasWidth, -this.canvasHeight, this.canvasWidth*3, this.canvasHeight*3);
    this.context.save();// save the unrotated context of the canvas so we can restore it later
    // move 0,0 point of context to the centre of the rocket
    this.context.translate(this.canvasWidth/2,this.canvasHeight/2 );
    // rotate the canvas around if not in space
    var rocketMag = game.rocket.pos.magnitude();
    var angle = makeUsableAngle(-1*game.rocket.pos.getAngle()*Math.PI/180);
    if (!(rocketMag - game.planet.radius > 100000)){
      this.context.rotate(angle);
    }
    //draw the rocket image so that it has its centre in the pivot point of the cavnas
    //this.context.drawImage( imageRepository.rocket, -this.imageWidth/2, -this.imageHeight/2, this.imageWidth, this.imageHeight);

    //change the location of the x and y coordinates of the background based on the speed of the rocket
    this.y += game.rocket.verticalSpeed*loopTime;
    this.x += game.rocket.groundSpeed*loopTime;
    if (rocketMag == game.planet.radius){//recalibrate screen if rocket is on the ground
      this.y=0;
    }
    //these are the coordinates to place the canvas on the rotated screen so that the pivot point is in the centre of the image
    var backgroundx = this.x-this.canvasWidth/2;    
    var backgroundy = this.y-this.canvasHeight/2;

    if (rocketMag - game.planet.radius > 100000){//draw a space canvas is the rocket is high enough
      this.context.drawImage(imageRepository.space, -1*this.canvasWidth/2,-1*this.canvasHeight/2, this.canvasWidth, this.canvasHeight);
    } else if (rocketMag- game.planet.radius >= this.canvasHeight){//if the rocket is higher than the height of the canvas then draw sky image
    this.context.drawImage(imageRepository.sky, backgroundx, backgroundy, this.canvasWidth, this.canvasHeight);
    // Draw another image that ends at the top edge of the first image
    this.context.drawImage(imageRepository.sky, backgroundx, backgroundy - this.canvasHeight, this.canvasWidth, this.canvasHeight);
    // Draw another image that ends at the bottom edge of the first image
    this.context.drawImage(imageRepository.sky, backgroundx, backgroundy + this.canvasHeight, this.canvasWidth, this.canvasHeight);
    //draw another background at the left edge of the main image
    this.context.drawImage(imageRepository.sky, backgroundx - this.canvasWidth, backgroundy, this.canvasWidth, this.canvasHeight);
    //draw another background at the right edge of the main image
    this.context.drawImage(imageRepository.sky, backgroundx + this.canvasWidth, backgroundy, this.canvasWidth, this.canvasHeight);
    //draw another background at the top left corner of the main image
    this.context.drawImage(imageRepository.sky, backgroundx - this.canvasWidth, backgroundy - this.canvasHeight, this.canvasWidth, this.canvasHeight);
    //draw another background at the top right corner of the main image
    this.context.drawImage(imageRepository.sky, backgroundx + this.canvasWidth, backgroundy + this.canvasHeight, this.canvasWidth, this.canvasHeight);
    //draw another background at the bottom right corner of the main image
    this.context.drawImage(imageRepository.sky, backgroundx + this.canvasWidth, backgroundy - this.canvasHeight, this.canvasWidth, this.canvasHeight);
    //draw another background at the bottom left corner of the main image
    this.context.drawImage(imageRepository.sky, backgroundx - this.canvasWidth, backgroundy - this.canvasHeight, this.canvasWidth, this.canvasHeight);

    previousNearGround = false;
    } else {//if rocket is less than height of canvas then draw a ground image
      if (previousNearGround == false){//if the rocket is approaching the ground and previously was not within canvas range of the ground then recalibrate the canvas
        this.y=this.canvasHeight-1;//this ensures the rocket lands on the ground image
        backgroundy = this.y-this.canvasHeight/2;
      }
    this.context.drawImage(imageRepository.ground, backgroundx, backgroundy, this.canvasWidth, this.canvasHeight);
    // Draw a sky image that ends at the top edge of the first image
    this.context.drawImage(imageRepository.sky, backgroundx, backgroundy - this.canvasHeight, this.canvasWidth, this.canvasHeight);
    //draw another ground background at the left edge of the main image
    this.context.drawImage(imageRepository.ground, backgroundx - this.canvasWidth, backgroundy, this.canvasWidth, this.canvasHeight);
    //draw a sky background at the top left corner of the main image
    this.context.drawImage(imageRepository.sky, backgroundx - this.canvasWidth, backgroundy - this.canvasHeight, this.canvasWidth, this.canvasHeight);
    previousNearGround = true;
    }

    // If the y value is bigger than the screen or less than 0 then reset adjust it to the other side of the canvas
    if (this.y >= this.canvasHeight){
      this.y = 0;
    } else if (Math.round(rocketMag- game.planet.radius) <=0){//make sure the ground doesn't become sky

    } else if (this.y < 0){
      this.y = this.canvasHeight-1;
    }
    //If the x value is bugger than the screen or less than 0 then adjust
    if (this.x >= this.canvasWidth){
      this.x = 0;
    } else if (this.x < 0){
      this.x = this.canvasWidth-1;
    }

    this.context.restore();// we’re done with the rotating so restore the unrotated context
  }
}

/**
 * The Rocket child of drawable
 */
class Rocket extends Drawable {
  constructor(x, y, canvasWidth, canvasHeight, context, imageWidth, imageHeight, thrustSetting, mass, planetAngle){
    super(x, y, canvasWidth, canvasHeight, context, imageWidth, imageHeight);
    //set rocket variables to default values
    this.angularSpeed = 0;//angular speed of rocket
    
    this.angleRelativePlanet = 0;// angle of rocket relative to planet ground
    this.thrustAngle = 0;//angle of the thrust relative to the rocket
    this.thrustRelativeVerticalAngle = 0; //angle of the thrust relative to the vertical y axis
    this.torque = 0;//torque on rocket
    this.angularAccel = 0;//angular acceleration of rocket
    this.mass = mass;//mass of rocket, default at 1000
    this.pos = new vector(0,1*game.planet.radius);//vector for position of rocket
    this.pos.changeAngle(planetAngle);
    this.angle = makeUsableAngle(-1*this.pos.getAngle()); //angle of rocket relative to vertical y axis
    this.vel = new vector(0,0);//vector for velocity of rocket
    this.acc = new vector(0,0);//vector for acceleration of rocket
    this.netForce = new vector(0,0);//vector for the net force on the rocket
    this.gravityForce = new vector(0,0);//vector for the force of gravity on the rocket
    this.thrust = new vector(0,0);//vector for the force of thrust on the rocket
    this.thrustSetting = thrustSetting; //The magnitude of force produced by 1 thrust setting
    this.groundSpeed = 0;//the ground speed of the rocket relative to the planet
    this.verticalSpeed = 0; //the vertical speed of the rocket relative to the planet
    //below is the moment of inertia of the rocket, using the solid cylinder moment of inertia formula
    this.momentOfInertia = this.mass/12*(3*this.imageWidth*this.imageWidth+this.imageHeight*this.imageHeight);
  }
  
  /**
    * This method draws the rocket to the screen at the correct angle
  */
  draw() {
    //clear the old rocket from view
    this.context.clearRect(-game.rocketCanvas[0].width, -game.rocketCanvas[0].height, game.rocketCanvas[0].width*3, game.rocketCanvas[0].height*3);
    this.context.save();// save the unrotated context of the canvas so we can restore it later
    // move 0,0 point of context to the centre of the rocket
    this.context.translate( this.x+this.imageWidth/2, this.y+this.imageHeight/2 );
    // rotate the canvas around the centre of the rocket to the current angle of the rocket
    this.context.rotate(this.angle*Math.PI/180);
    //draw the rocket image so that it has its centre in the pivot point of the cavnas
    this.context.drawImage( imageRepository.rocket, -this.imageWidth/2, -this.imageHeight/2, this.imageWidth, this.imageHeight);
    this.context.restore();// we’re done with the rotating so restore the unrotated context
  }
}

/**
 * The Fire child of drawable
 */
class Fire extends Drawable {  
  constructor(x, y, canvasWidth, canvasHeight, context, imageWidth, imageHeight){
    super(x, y, canvasWidth, canvasHeight, context, imageWidth, imageHeight);
  }
  
  /**
    * This method draws the fire to the screen at the correct angle and at the end of the rocket
  */
  draw() {
    //clear the previous fire
    this.context.clearRect(-game.rocketCanvas[0].width, -game.rocketCanvas[0].height, game.rocketCanvas[0].width*3, game.rocketCanvas[0].height*3);
    this.context.save();// save the unrotated context of the canvas so we can restore it later
    // move the 0,0 point of the fire canvas to the end of the rocket, based on the length and current angle of the rocket
    this.context.translate( game.rocket.x+game.rocket.imageWidth/2 - game.rocket.imageHeight/2.4 * Math.sin(game.rocket.angle*Math.PI/180), game.rocket.y+game.rocket.imageHeight/2+game.rocket.imageHeight/2.4 * Math.cos(game.rocket.angle*Math.PI/180));
    // rotate the fire canvas to the specified degrees based off a variable in the rocket object, multiply by negative 1 to make it the right direction
    //This angle takes into account the angle of the rocket and the angle of the thrust relative to the rocket
    var flameAngle = -1 * game.rocket.thrustRelativeVerticalAngle;
    this.context.rotate(flameAngle*Math.PI/180);
    //draw the fire image so that it is based at the bottom of the rocket, make the fire proportional to the current thrust magnitude
    //also divide by force per thrust setting so that the fire is the same lenght no matter how many Newtons the user wants per thrust setting
    this.context.drawImage(imageRepository.fire, -game.rocket.imageWidth/4, 0, game.rocket.imageWidth/2, game.rocket.thrust.magnitude()/game.rocket.thrustSetting*4);
    this.context.restore(); // we’re done with the rotating so restore the unrotated context
  }
}

/**
 * The Planet class to store the mass and radius of the planet
 */
class Planet {
    constructor(mass, radius){
    this.mass  = mass;
    this.radius = radius;
    }
}

/////////////////////GAME RELATED FUNCTIONS
///////////////////////////////////////////
/**
 * Creates the Game object which will hold all objects and data for
 * the game.
 */
function Game() {
  /*
   * Gets canvas information and context and sets up all game
   * objects.
   */
  this.init = function(rocketMass, planetMass, planetRadius, thrustSetting, rocketHeight, planetAngle) {
    //Instantiate a planet and give it the default mass and radius of Earth
    this.planet = new Planet(planetMass, planetRadius);
    
    //SET UP GPS CANVAS//////////////////////
    this.GPScanvas = $('#GPScanvas');
    this.GPScontext = this.GPScanvas[0].getContext('2d');
    this.GPScontext.font="10px Cambria";//set font of text on this canvas
    this.GPScontext.canvas.width  = 480;//give the GPS canvas a decent height and width for clear text
    this.GPScontext.canvas.height = 720;

    //SET UP BACKGROUND CANVAS///////////////////
      this.bgCanvas = $('#backgroundCanvas');
      this.bgContext = this.bgCanvas[0].getContext('2d');
      // Initialize the background object
      this.background = new Background(0,0, this.bgCanvas[0].width, this.bgCanvas[0].height, this.bgContext);//javascript doesn't require all parameters to be filled
    
    //SET UP ROCKET CANVAS /////////////////////////
      this.rocketCanvas = $('#rocketCanvas');
      this.rocketContext = this.rocketCanvas[0].getContext('2d');
      //set up the dimensions of the drawing canvas for the rocket; this is required to prevent the image from getting squished when rotating
      this.rocketContext.canvas.width  = 400;
      this.rocketContext.canvas.height = 300;
      rocketWidth = 50;//the default rocket width in the simulation
      //create rocket object and put it in the middle of the screen horizontally and at a default y position of 110
      //the default height and mass are fed to the constructor
      this.rocket = new Rocket(this.rocketCanvas[0].width/2-rocketWidth/2,110, this.rocketCanvas[0].width, this.rocketCanvas[0].height, this.rocketContext, rocketWidth, rocketHeight, thrustSetting, rocketMass, planetAngle);
      //if rocket height is changed it is best to change the position on the screen for optimal viewing:
      this.rocket.y-= (rocketHeight - 120)

      //SET UP FIRE CAMPUS ///////
      this.fireCanvas = $('#fireCanvas');
      this.fireContext = this.fireCanvas[0].getContext('2d');
      //set up the dimensions of the drawing canvas for the rocket; this is required to prevent the image from getting squished when rotating
      this.fireContext.canvas.width  = 400;
      this.fireContext.canvas.height = 300;
      //create fire object and put it at the 0,0 point of its own canvas
      this.fire = new Fire(0,0, this.fireCanvas[0].width, this.fireCanvas[0].height, this.fireContext);//javascript doesn't require all parameters to be filled
  };
  
  //This function starts the animation loop
  this.start = function() {
      gameLoop();
  };
}


/**
 * The animation loop, calls requestAnimationFrame shim to
 * optimize game loop
 */
function gameLoop() {
  //the looping program that connects to the browser for repainting
  requestAnimFrame(gameLoop);
  
  if (!isPaused){ //if the simulation is not paused then continue animation
    recalculatePositions();//recalculate all positions and angles in the simulation
    game.background.draw();//redraw the background object
    game.rocket.draw();//redraw the rocket object
    game.fire.draw();//redraw the fire object
    GPSTextDraw();//redraw text on the GPS canvas
  } else {
    //do nothing if game is paused
  }
}

/**
 * This function recalculates the positions of all the objects
 */
function recalculatePositions(){
  //CALCULATE GRAVITATIONAL FORCE///////
  //Use Newton's Law of Universal Gravitation to calculate the force of gravity on the rocket
  //the gravitational constant of the simulation has been changed to allow for a convenient viewing experience 
  gravityMagnitude = (1/7287597656250)*game.rocket.mass * game.planet.mass/Math.pow(game.rocket.pos.magnitude(), 2);
  if (game.rocket.gravityForce.magnitude() == 0){//one must not directly change magnitude of a 0 vector
    game.rocket.gravityForce = new vector(0, -gravityMagnitude);
  } else {//change the magnitude and direction of the gravity force vector based on the position of the rocket around the planet
    game.rocket.gravityForce.changeMagnitude(gravityMagnitude);
    game.rocket.gravityForce.changeAngle(makeUsableAngle(game.rocket.pos.getAngle()+180));
  }

  //CALCULATE THRUST ANGLE//////
  /*Give the thrust its new angle relative to the vertical
  using both the angle of the rocket and the angle of the thrust relative to the rocket*/
  r = game.rocket.angle;//angle of rocket relative to vertical
  t = game.rocket.thrustAngle;//angle of thrust relative to rocket
  //set the thrust angle relative to the vertical to be equal to t-r, and then make that between -179.9 repeated and 180 using the make usable function
  game.rocket.thrustRelativeVerticalAngle = makeUsableAngle(t-r);
  game.rocket.thrust.changeAngle(makeUsableAngle(game.rocket.thrustRelativeVerticalAngle));//using the newly created thrust angle change the thrust vector
  
  //CALCULATE ROCKET ANGLE/////////
  /*Calculate the torque on the rocket using the equation torque=Fdcos(theta) where force is the thrust, d is the distance
  to the centre of mass of the rocket (assumed to be the middle), and theta is the angle of the thrust relative to the rocket.
  Note that the centre of mass has been chosen as the pivot point.*/
  game.rocket.torque = Math.sin(game.rocket.thrustAngle*Math.PI/180)*game.rocket.thrust.magnitude()*game.rocket.imageHeight/2; // calculate torque on rocket
  //calculate the angular acceleration of the rocket using alpha*moment of Inertia = torque
  game.rocket.angularAccel = game.rocket.torque * 10  / game.rocket.momentOfInertia;//The torque is multiplied by 10 for faster response
  //add the angular acceleration times the loopTime to the current angular speed to get a new angular speed (this is a form of crude integration)
  game.rocket.angularSpeed += game.rocket.angularAccel * loopTime;
  //add the angular speed times the loopTime to the current rocket angle to get a new rocket angle (this is a form of crude integration)
  game.rocket.angle += game.rocket.angularSpeed*loopTime;
  game.rocket.angle = makeUsableAngle(game.rocket.angle);//make rocket angle to be between -179.9 repeated and 180 using the make usable function
  //also it's important to know the angle of the rocket relative to the planet ground, calculated below:
  game.rocket.angleRelativePlanet = makeUsableAngle(-1*game.rocket.angle - game.rocket.pos.getAngle());
  //CALCULATE ROCKET POSITION////////////
 
  //Calculate a new net force vector for the rocket based off of the gravitational force and thrust force
  game.rocket.netForce = vector.netVector(game.rocket.gravityForce, game.rocket.thrust);
  game.rocket.acc = game.rocket.netForce.times(1/game.rocket.mass);//get new acceleration vector of rocket with F=ma, but with vector math and constant multiples
  //add the acceleration vector times the loopTime to the current velocity vector to get a new velocity vector (this is a form of crude integration)
  if (game.rocket.pos.magnitude() > game.planet.radius || vector.netVector(game.rocket.acc, game.rocket.pos).magnitude()>=game.planet.radius){
    //only change velocity if rocket is not on ground or it is accelerating away from planet. This prevents the program from thiking that high gravity caused a crash on the ground
    game.rocket.vel.add(game.rocket.acc.times(loopTime));
  }

  //Find the current ground speed and vertical speed of the rocket relative to the planet
  //First get a ground speed angle, the angle between the position and velocity vectors. This is used to find the ground speed
  //and vertical speed relative to the planet from any side of the planet
  if(!(game.rocket.vel.gety() == 0 && game.rocket.vel.getx()==0)){//make sure it is not a 0 vector
    groundSpeedAngle = makeUsableAngle(game.rocket.vel.getAngle()-game.rocket.pos.getAngle());
    game.rocket.groundSpeed = Math.round(Math.sin(groundSpeedAngle*Math.PI/180)*game.rocket.vel.magnitude()*10)/10;//Calculate the ground speed
    game.rocket.verticalSpeed = Math.round(Math.cos(groundSpeedAngle*Math.PI/180)*game.rocket.vel.magnitude()*10)/10;//Calculate the vertical speed 
  } else {
    game.rocket.groundSpeed = 0;
    game.rocket.verticalSpeed = 0;
  }

  //what to do if rocket is approaching the ground:
  if (vector.netVector(game.rocket.pos, game.rocket.vel.times(loopTime)).magnitude() <= game.planet.radius){
    if (game.rocket.verticalSpeed > -2 && game.rocket.verticalSpeed <= 2 && game.rocket.groundSpeed > -2 && game.rocket.groundSpeed < 2 && game.rocket.angleRelativePlanet > -15 && game.rocket.angleRelativePlanet < 15){
      //This if statement is reached if the rocket is travelling at a reasonable landing speed and angle
    } else {
      //The rocket has crashed, open crash dialog box
      crashAlert("#dialogFormCrash");
      isPaused = true;
    }
    //make sure rocket can't go underground, if it's destined to reach the ground in the next iteration then set its vertical speed and position to 0
    game.rocket.vel.sety(0);
    game.rocket.pos.changeMagnitude(game.planet.radius);
    game.rocket.vel.setx(0);//prevent the angle and x coordinate from changing on the ground 
    game.rocket.angle = -1*game.rocket.pos.getAngle();//make the rocket perpendicular to the Earth if it is on the ground
  } 
  
  //add the velocity vector times the loopTime to the current position vector to get a new position vector (this is a form of crude integration)
  game.rocket.pos.add(game.rocket.vel.times(loopTime)); 
}

//DO STUFF WHEN KEYBOARD BUTTONS ARE PRESSED
$(document).keydown(function(e) {
        if (e.which === 38) {//Add to the magnitude of the thrust vector if up arrow pressed
            if (Math.round(game.rocket.thrust.magnitude()) == 0){
              //if thrust was a 0 vector then create a new vector with magnitude of the thrust of one thrust setting
              game.rocket.thrust = new vector(0,game.rocket.thrustSetting);//create a new vector of the magnitude of the amount of force per thrust setting 
              game.rocket.thrust.changeAngle(game.rocket.thrustRelativeVerticalAngle);//change the direction of the new thrust vector using the changeAngle
            } else {
              //Add the magnitude of one thrust setting to the magnitude of the thrust vector
              game.rocket.thrust.changeMagnitude(parseInt(game.rocket.thrust.magnitude()) + parseInt(game.rocket.thrustSetting));
            }
        } else if (e.which === 40) {//Subtract from the magnitude of the thrust vector if down arrow pressed
          if (Math.round(game.rocket.thrust.magnitude()) == game.rocket.thrustSetting){ //recalibrate thrust vector if it is going to a 0 vector
            //recalibrate thrust vector to 0,0 if it is going to a 0 vector
            game.rocket.thrust = new vector(0,0);
          } else if (Math.round(game.rocket.thrust.magnitude()) > game.rocket.thrustSetting/2){
            //Add the magnitude of one thrust setting from the magnitude of the thrust vector
            game.rocket.thrust.changeMagnitude(game.rocket.thrust.magnitude() - game.rocket.thrustSetting);
          }
        } else if (e.which === 37) {//if left arrow is pressed turn the thruster
          //subtract from the thrust angle if it is >-40
          if (game.rocket.thrustAngle > -40){
              game.rocket.thrustAngle = game.rocket.thrustAngle -5; 
          }
        } else if (e.which === 39) {//if right arrow is pressed turn the thruster
          //add to the thrust angle if it is less than 40
          if (game.rocket.thrustAngle < 40){
              game.rocket.thrustAngle = game.rocket.thrustAngle + 5; 
          }
        } else if (e.which === 32) {//open menu options if the space bar is pressed
          isPaused = true;//pause game before opening menu
           customTextAlert("#dialogFormMenu");
        }
});

/**
 * This function draws text to the GPS screen canvas
 */
function GPSTextDraw(){
  game.GPScontext.clearRect(0, 0, game.GPScanvas[0].width, game.GPScanvas[0].height);//clear previous text
  game.GPScontext.font="30px Cambria";
  //write the new altitude relative to Earth
  game.GPScontext.fillText("EARTH ALTITUDE:", 10, 40);
  screenAltitude = Math.round((game.rocket.pos.magnitude()-game.planet.radius)*10)/10;
  game.GPScontext.fillText(screenAltitude, 350, 40);
  //write the new ground speed
  game.GPScontext.fillText("GROUND SPEED:", 10, 80);
  screenGroundSpeed = Math.round(game.rocket.groundSpeed*10)/10;
  game.GPScontext.fillText(screenGroundSpeed, 350, 80);
  //write the new vertical speed
  game.GPScontext.fillText("VERTICAL SPEED:", 10, 120);
  screenVerticalSpeed = Math.round(game.rocket.verticalSpeed*10)/10; 
  game.GPScontext.fillText(screenVerticalSpeed, 350, 120);
  //write the new thrust setting
  game.GPScontext.fillText("THRUST SETTING:", 10, 160);
  screenThrust = Math.round(game.rocket.thrust.magnitude()/game.rocket.thrustSetting);
  game.GPScontext.fillText(screenThrust, 350, 160);
  //write the new thrust angle
  game.GPScontext.fillText("THRUST ANGLE:", 10, 200);
  screenThrustAngle = Math.round(game.rocket.thrustAngle);
  game.GPScontext.fillText(screenThrustAngle, 350, 200);
  //write the new rocket ground angle
  game.GPScontext.fillText("ANGLE WITH GROUND:", 10, 240);
  screenAngle = Math.round(game.rocket.angleRelativePlanet*10)/10;
  game.GPScontext.fillText(screenAngle, 350, 240);
  game.GPScontext.fillText(screenAngle, 350, 240);
  //write user friendly instructions to the canvas 
  game.GPScontext.fillText("Press \"SPACEBAR\" for MENU.", 10, 280); 
  game.GPScontext.arc(240,500,150,0*Math.PI,2*Math.PI); 
  //game.planet.radius/Math.pow(10, 5)
  radiusRatio = 150/game.planet.radius;
  game.GPScontext.stroke();
  game.GPScontext.fillText("planet", 200, 510);
  game.GPScontext.fillText("+", 230-radiusRatio*game.rocket.pos.getx(),510-radiusRatio*game.rocket.pos.gety());
  game.GPScontext.fillText("GPS:", 10,320);
}


//////////////////OTHER HELPER METHODS
//////////////////////////////////////
/**
 * requestAnim shim layer by Paul Irish
 * Finds the first API that works to optimize the animation loop,
 * otherwise defaults to setTimeout()
 */
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame   ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      window.oRequestAnimationFrame      ||
      window.msRequestAnimationFrame     ||
      function(/* function */ callback, /* DOMElement */ element){
        window.setTimeout(callback, 1000 / 60);
      };
})();

//Make an angle usable in the context of the game (convert any number of degrees to between 180 and -179.9 repeated)
function makeUsableAngle(angle){
 if (angle > 180){
    mod = angle%180;
    dividedMod = Math.trunc(angle/180)%2;
      if (dividedMod == 0){
        angle = mod;
      } else {
        angle = -180 + mod;
      }
  } else if (angle <= -180){
    angle = -1*angle;
    mod = angle%180;
    dividedMod = Math.trunc(angle/180)%2;
      if (dividedMod == 0){
        angle = -1 * mod;
      } else {
        angle = 180 - mod;
      }
  }
  return angle;
}


/**
 * A vector class to simplify position calculations
 */
class vector {
  constructor(x, y){
    this.x = x;//the x value of the vector
    this.y = y;//the y value of the vector
  }
  
  add(vectory){//add the coordinates vector vectory to this vector's coordinates
    this.x += vectory.getx();
    this.y += vectory.gety();
  }

  static netVector(vector1, vector2){//static method to sum 2 vectors and return the net vector
    var vectorSum = new vector(0,0);
    vectorSum.add(vector1);
    vectorSum.add(vector2);
    return vectorSum;
  }

  getx (){//getter method for x value
    return this.x;
  }

  gety (){//getter method for y value
    return this.y
  }

  set (x,y){//setter method for both x and y values
    this.x = x;
    this.y = y;
  }

  sety (y){//setter method for y value
    this.y =y;
  }

  setx (x){//setter method for x value
    this.x =x;
  }

  times(constant){//return a new vector that is this vector multiplied by a constant parameter
    return new vector(this.x*constant, this.y*constant);
  }

  multiplyVector(constant){//multiply the vector by a constant parameter
    this.x*=constant;
    this.y*=constant;
  }

  magnitude(){//return the magnitude of the vector using Pythagorean Theorem
    return Math.pow(this.x*this.x+this.y*this.y , 0.5);
  }
  
  //This method changes the angle of the vector
  changeAngle(newAngle){
    var magnitude = this.magnitude();
    this.x = magnitude*Math.sin(newAngle*Math.PI/180);
    this.y = magnitude*Math.cos(newAngle*Math.PI/180);
    /*
    Notice that sin here is used for the x value and cos is used for the y value
    This is done in this function because the function is used in a way that requires
    the 0 degree reference point to be on the positive y axis and 90 to be on the positive x axis
    The angles are measured from -179.9 repeated to positive 180
    */
  }

  //change the magnitude of a vector given a new magnitude, keep the current direction
  changeMagnitude(newMagnitude){ // vector cannot be a 0 vector for this function !!!!!
    var oldMagnitude = this.magnitude();
    this.x = newMagnitude/oldMagnitude * this.x;
    this.y = newMagnitude/oldMagnitude * this.y;
    
  }

  //return the angle of the vector between -179.9 repeated and 180 degrees
  getAngle(){//shouldn't be a 0 vector
    if (this.y == 0 && this.x>=0){
      return 90;
    } else if (this.y == 0 && this.x<=0){
      return -90;
    }
    if (this.x >= 0 && this.y >= 0){
      return makeUsableAngle(180/Math.PI*Math.atan(Math.abs(this.x)/Math.abs(this.y)));
    } else if (this.x >= 0 && this.y <= 0){
      return makeUsableAngle(180 - 180/Math.PI*Math.atan(Math.abs(this.x)/Math.abs(this.y)));
    } else if (this.x <= 0 && this.y <= 0){
      return makeUsableAngle(-180 + 180/Math.PI*Math.atan(Math.abs(this.x)/Math.abs(this.y)));
    } else {
      return makeUsableAngle(-1*180/Math.PI*Math.atan(Math.abs(this.x)/Math.abs(this.y)));
    }
  }
}