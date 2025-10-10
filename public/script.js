document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("start_btn").onclick = () => startGame();
});

const Player = {
    move_direction: "right",
    positionX: 0,
    positionY: 0, 
    fruit_picked_up: 0,
};
const Fruit = {
    item: undefined,
    positionX: 0,
    positionY: 0,
    amount_generated: 0,
};
const GameBoard = {
    tile_x_amount: 12,
    tile_y_amount: 12,
    grid: [],
    isGenerated: false,
};

function startGame(){
    new Audio("Assets/Audio/button-click-sound.wav").play();
    const pointsForVictory = GameBoard.tile_x_amount * GameBoard.tile_y_amount - 1;
    const game_tick = 400;
    const tile_size = 40;
    const start_button = document.getElementById("start_btn");
    start_button.style.display = "none";
    let interval = null
    Player.fruit_picked_up = 0;

    const avatar = createAvatar(tile_size);
    setupBoard(avatar, tile_size);
    playerDirection();

    game(avatar, start_button, tile_size, interval, pointsForVictory);
    interval = setInterval(() => game(avatar, start_button, tile_size, interval, pointsForVictory), game_tick);
}

function createAvatar(tile_size){
    const avatar_block = document.createElement("div");
    avatar_block.classList.add("player_avatar");
    avatar_block.style.height = `${tile_size}px`;
    avatar_block.style.width = `${tile_size}px`;
    return avatar_block;
}

function setupBoard(avatar, tile_size){
    if(!GameBoard.isGenerated){
        GameBoard.isGenerated = true;
        const game_screen = document.getElementById("game_screen");
        game_screen.style.border = "2px solid black";
        game_screen.style.width = `${tile_size * GameBoard.tile_x_amount + 18}px`;
        game_screen.style.height = `${tile_size * GameBoard.tile_y_amount + 18}px`;

        // Loop to create the game 2.5D grid array
        for(let i = 0; i < GameBoard.tile_y_amount; i++){
            const x_array = [];
            for(let j = 0; j < GameBoard.tile_x_amount; j++){
                const grid_tile = document.createElement("div");
                grid_tile.style.height = `${tile_size}px`;
                grid_tile.style.width = `${tile_size}px`;
                grid_tile.classList.add("grid_tile");
                game_screen.appendChild(grid_tile);
                x_array.push(grid_tile);
            }  
            GameBoard.grid.push(x_array);
        }
    }
    Player.positionX = 6;
    Player.positionY = 6;
    GameBoard.grid[Player.positionY][Player.positionX].appendChild(avatar);
}

function playerDirection(){
    Player.move_direction = "right";
    document.addEventListener("keydown", event => {
        switch(event.key){
            case "ArrowRight":
                Player.move_direction = "right";
                break;
            case "ArrowDown":
                Player.move_direction = "down";
                break;
            case "ArrowLeft":
                Player.move_direction = "left";
                break;
            case "ArrowUp":
                Player.move_direction = "up";
                break;
        }
    });
}

function game(avatar, start_button, tile_size, interval, pointsForVictory){
    document.getElementById("score").textContent = `SCORE: ${Player.fruit_picked_up * 100}`;
    if(Fruit.amount_generated < 1){
        fruit(tile_size);
    }
    GameBoard.grid[Player.positionY][Player.positionX].removeChild(avatar);
    switch(Player.move_direction){
        case "right":
            Player.positionX += 1;
            break;
        case "down":
            Player.positionY += 1;
            break;
        case "left":
            Player.positionX -= 1;
            break;
        case "up":
            Player.positionY -= 1;
            break;
    }
    if(Player.positionX >= GameBoard.tile_x_amount || Player.positionY >= GameBoard.tile_y_amount || Player.positionX < 0 || Player.positionY < 0){
        return gameOver(start_button, interval);
    }
    GameBoard.grid[Player.positionY][Player.positionX].appendChild(avatar);
    if(Player.positionX === Fruit.positionX && Player.positionY === Fruit.positionY){
        new Audio("Assets/Audio/fruit-pickup-sound.wav").play();
        removeFruit();
    }
    if(Player.fruit_picked_up >= pointsForVictory){
        victory(start_button, interval, avatar);
    }
    document.getElementById("score").textContent = `SCORE: ${Player.fruit_picked_up * 100}`;
}

// Place a fruit on a random tile, but not the tile the player is located
function fruit(tile_size){
    Fruit.item = document.createElement("div");
    Fruit.item.classList.add("fruit");
    Fruit.item.style.height = `${tile_size}px`;
    Fruit.item.style.width = `${tile_size}px`; 
    do{
        Fruit.positionY = Math.floor(Math.random() * GameBoard.tile_y_amount);
        Fruit.positionX = Math.floor(Math.random() * GameBoard.tile_x_amount);
    }while(Fruit.positionY === Player.positionY && Fruit.positionX === Player.positionX);
    GameBoard.grid[Fruit.positionY][Fruit.positionX].appendChild(Fruit.item);
    Fruit.amount_generated++;  
}

function removeFruit(){
    GameBoard.grid[Fruit.positionY][Fruit.positionX].removeChild(Fruit.item);
    Player.fruit_picked_up++;
    Fruit.amount_generated--;
}

function gameOver(start_button, interval){
    clearInterval(interval);
    new Audio("Assets/Audio/player-death-sound.mp3").play();
    setTimeout(() => {
        removeFruit();

        const game_screen = document.getElementById("game_screen");
        const lose_message = document.createElement("p");
        lose_message.classList.add("lose_message");
        lose_message.textContent = "YOU LOSE!";
        game_screen.appendChild(lose_message);

        start_button.textContent = "RESTART";
        start_button.style.display = "block";
        start_button.onclick = () => {
            game_screen.removeChild(lose_message);
            startGame();
        }
    }, 1000);
}

function victory(start_button, interval, avatar){
    clearInterval(interval);
    new Audio("Assets/Audio/victory-sound.wav").play();
    const game_screen = document.getElementById("game_screen");
    const win_message = document.createElement("p");
    win_message.classList.add("win_message");
    win_message.textContent = "YOU WIN!";
    game_screen.appendChild(win_message);

    start_button.textContent = "PLAY AGAIN!";
    start_button.style.display = "block";
    start_button.onclick = () => {
        GameBoard.grid[Player.positionY][Player.positionX].removeChild(avatar);
        game_screen.removeChild(win_message);
        startGame();
    }
}