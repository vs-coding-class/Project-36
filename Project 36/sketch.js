var database;
var dog,dogHappy,dogRegular;
var foodObject,feedDog,addFood;

var lastFed,timeReader,currentTime;

var readState,readState,gameState;
var bedroomImg,gardenImg,washroomImg;

function preload(){
  dogRegular=loadImage("images/Dog.png");
  dogHappy=loadImage("images/Happy.png");

  bedroomImg=loadImage("images/BedRoom.png");
  gardenImg=loadImage("images/Garden.png");
  washroomImg=loadImage("images/WashRoom.png");
}

function setup() {
	createCanvas(1450,750);
  database=firebase.database();

  currentTime=hour();

  foodObject=new Food();
  foodObject.getFoodStock();

  dog = createSprite(300,300,100,50);
  dog.addImage(dogRegular);

  readState=database.ref("gameState");
  readState.on("value",function(data){
    gameState=data.val();
  });

  feedDog=createButton("Feed the Dog");
  feedDog.position(700,95);
  feedDog.mousePressed(feedTheDog);

  addFood=createButton("Add Food")
  addFood.position(800,95);
  addFood.mousePressed(addMoreFood);
}

function draw(){
  background(46,139,87)

  foodObject.display();

  var timeReader = database.ref("feedTime");
  timeReader.on("value",function(data){
    lastFed = data.val();
  });

  if(gameState!="hungry"){
    feedDog.hide();
    addFood.hide();
    dog.remove();
  }
  else{
    feedDog.show();
    addFood.show();
    dog.addImage(dogRegular);
  }

  var gameStateReader = database.ref("gameState");
  gameStateReader.on("value",function(data){
    gameState=data.val();
  });

  if(currentTime===lastFed+1){
    update("playing");
    foodObject.garden();
  }
  else if(currentTime===lastFed+2){
    update("sleeping");
    foodObject.bedroom();
  }
  else if(currentTime===lastFed+3){
    update("bathing");
    foodObject.washroom();
  }
  else{
    update("hungry");
    foodObject.display();
  }

  drawSprites();
  
  textSize(15);
  fill(255,255,254);

  if(lastFed>12){
    text("Last Fed: "+lastFed%12+" PM",350,30);
  }
  else if(lastFed===0){
    text("Last Fed: "+12+" AM");
  }
  else if(lastFed===12){
    text("Last Fed: "+12+" PM");
  }
  else{
    text("Last Fed: "+lastFed+" AM",350,30);
  }
}

function feedTheDog(){
  foodObject.deductFood();
  foodObject.updateFoodStock();
  database.ref().update({
    feedTime:hour()
  });
  dog.addImage(dogHappy);
}

function addMoreFood(){
  foodObject.addFood();
  foodObject.updateFoodStock();
  dog.addImage(dogRegular);
}

function update(state){
  database.ref().update({
    gameState:state
  });
}