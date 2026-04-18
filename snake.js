//570 px;
let headPosition = [[0 , 0]];
let snakeLength = 1;
let snakeHead = document.querySelector(".snake-head");
let apple = document.querySelector(".apple");
let direction = "right";
let lastProcessedDirection = "right";
const score = document.querySelector("#score").querySelector("#score-value");
const container = document.querySelector("#container");
const rightEye = document.querySelectorAll(".right");
const leftEye = document.querySelectorAll(".left");
const upEye = document.querySelectorAll(".up");
const downEye = document.querySelectorAll(".down");
const eyes = document.querySelectorAll(".eye");
const gameOverAppearDiv = document.querySelector("#response-div");
const continueBtn = document.querySelector("#continue");
const replayBtn = document.querySelector("#replay");
let gameRunning = false;

handleEye(direction);
const gameStartButton = document.querySelector("#play");
gameStartButton.addEventListener('click' , ()=>{
    if(gameRunning){
        return;
    }else{
        handleEye(direction);
        gameRunning=true;
        moveSnake();
    }
})
continueBtn.addEventListener('click' ,()=>{
    gameStartButton.click();
    gameOverAppearDiv.style.display = "none";
})
replayBtn.addEventListener('click' , ()=>{
    gameOverAppearDiv.style.display = "none";
    headPosition=[[0 , 0]];
    snakeLength=1;
    direction="right";
    lastProcessedDirection="right";
    container.querySelectorAll(".snake-part").forEach((val)=>{
        val.remove();
    });
    apple.style.left = "30px";
    apple.style.top = "0px";
    snakeHead.style.left = "0px";
    snakeHead.style.top = "0px";
    handleEye();
    setTimeout(()=>{
        gameStartButton.click();
    },200);
})

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case "ArrowUp":    if (lastProcessedDirection !== "down") direction = "up"; break;
        case "w":    if (lastProcessedDirection !== "down") direction = "up"; break;
        case "ArrowDown":  if (lastProcessedDirection !== "up") direction = "down"; break;
        case "s":  if (lastProcessedDirection !== "up") direction = "down"; break;
        case "ArrowLeft":  if (lastProcessedDirection !== "right") direction = "left"; break;
        case "a":  if (lastProcessedDirection !== "right") direction = "left"; break;
        case "ArrowRight": if (lastProcessedDirection !== "left") direction = "right"; break;
        case "d": if (lastProcessedDirection !== "left") direction = "right"; break;
    }
});




// function offsetAppleCords(val){
//     let offset;
//     do{
//         offset = Math.floor((val + 30 + Math.floor((Math.random()*570))))%570;
//         offset = offset-offset%30;
//     }while(offset === val);

//     return offset;
// }

function handleEye(direction){
    eyes.forEach((val)=>{
        val.style.display = "none";
    })
    if(direction === "right"){
        rightEye.forEach((val)=>{
            val.style.display ="flex";
        })
    }else if(direction === "left"){
        leftEye.forEach((val)=>{
            val.style.display = "flex";
        })
    }else if(direction === "up"){
        upEye.forEach((val)=>{
            val.style.display = "flex";
        })
    }else if(direction === "down"){
        downEye.forEach((val)=>{
            val.style.display = "flex";
        })
    }
}


function changeAppleCords(){
    const coordinates = [];
    for (let i=0;i<570;i+=30){
        for(let j=0;j<570;j+=30){
            let isOccupied = headPosition.some(pos => pos[0] === i && pos[1] === j);

            if (!isOccupied) {
                coordinates.push([i , j]);
            }
        }
    }
    let index = Math.floor(Math.random()*coordinates.length);
    return coordinates[index];   
}

function handleSnakeBody(){
    const allBodyParts = document.querySelectorAll(".snake-part");
    allBodyParts.forEach((val , index)=>{
        let number = val.getAttribute("data-number");
        val.style.left = `${headPosition[number][0]}px`;
        val.style.top = `${headPosition[number][1]}px`;
        let lightness = `${Math.max(24 , 36-index)}`
        val.style.backgroundColor = `hsl(129, 37%, ${lightness}%)`;
    })
}

function checkEatApple(change){
    let style = window.getComputedStyle(apple);
    let leftValue = parseInt(style.left); 
    let topValue = parseInt(style.top);   
    if(change[0] === leftValue && change[1] === topValue){
        let body = document.createElement('div');
        body.setAttribute("data-number" , `${snakeLength}`);
        body.classList.add("snake-part");
        body.style.left = `${headPosition[snakeLength][0]}px`;
        body.style.top = `${headPosition[snakeLength][1]}px`;
        container.append(body);
        snakeLength+=1;
        return true;
    }
    return false;
}


function newApple(change){
    // apple.remove();
    // apple = document.createElement('div');
    // apple.classList.add("apple");
    // let offsetLeft = offsetAppleCords(change[0]);
    // let offsetTop = offsetAppleCords(change[1]);
    // let offsetLeft = Math.floor((change[0] + Math.floor((Math.random()*570))))%570;
    // offsetLeft = offsetLeft - offsetLeft % 30;
    // let offsetTop = Math.floor((change[1] + Math.floor((Math.random()*570))))%570;
    // offsetTop = offsetTop - offsetTop % 30;
    let newCords = changeAppleCords(); 
    apple.style.left = `${newCords[0]}px`;
    apple.style.top = `${newCords[1]}px`;
    // container.append(apple);
}


function checkGameOver(change){
    handleEye(direction);
    if(direction === "left"){
        if(headPosition[0][0] > 0){
            change[0]-=30;
        }else{
            return true;
        }
    }else if(direction === "up"){
        if(headPosition[0][1] > 0){
            change[1] -= 30;
        }else{
            return true;
        }
    }else if(direction === "down"){
        if(headPosition[0][1] < 570){
            change[1]+=30;
        }else{
            return true;
        }
    }
    else{
    if(headPosition[0][0] < 570){
        change[0]+=30;
    }else{
        return true;
    }}

    return change;
}
async function moveSnake(){
    let change= [headPosition[0][0] , headPosition[0][1]];
    lastProcessedDirection = direction;
    let eatenApple = checkEatApple(change);
    if(eatenApple){
        newApple(change);
    }

    let gameOver = checkGameOver(change);
    if(gameOver === true){
        gameOverAppearDiv.style.display = "flex";
        gameRunning=false;
        return;
    }else{
        change[0] = gameOver[0] ;
        change[1] = gameOver[1] ;
    }    

    snakeHead.style.left = `${change[0]}px`;
    snakeHead.style.top = `${change[1]}px`;
    
    headPosition.unshift([change[0] , change[1]]);
    if(headPosition.length > snakeLength+1){
        headPosition.pop();
    }
    handleSnakeBody();
    for(let i=1;i<headPosition.length;i++){
        if(headPosition[0][0] === headPosition[i][0] && headPosition[0][1] === headPosition[i][1]){
            gameRunning=false;
            gameOverAppearDiv.style.display = "flex";
            return;
        }
    }
    // console.log(headPosition);
    score.innerText = `${snakeLength-1}`;
     setTimeout(()=>{
        moveSnake();
    } , 150)
}


// moveSnake();