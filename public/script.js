document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("keydown", event => chooseDirection(event));
    const start_game = new GameSetup();
    document.getElementById("start_btn").onclick = () => start_game.setGame();
});

// To do:
// Do something with the classless objects and functions
// Make a tail for the avatar
// Give collision to the tail
// Figure out what is going on with the +18 pixel thing


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

function chooseDirection(event){
    switch(event.key){
        case "ArrowRight":
            forbidDirection("left", "right");
            break;
        case "ArrowDown":
            forbidDirection("up", "down");
            break;
        case "ArrowLeft":
            forbidDirection("right", "left");
            break;
        case "ArrowUp":
            forbidDirection("down", "up");
            break;
    }
}

function forbidDirection(oppositeDirection, selectedDirection){
    if(Player.move_direction === oppositeDirection) return;
    Player.move_direction = selectedDirection;
}


class GameSetup{
    GameAudio = {
        btn_click: "Assets/Audio/button-click-sound.wav", 
        player_death: "Assets/Audio/player-death-sound.mp3",
        fruit_pickup: "Assets/Audio/fruit-pickup-sound.wav",
        player_victory: "Assets/Audio/victory-sound.wav",
    };
    GameRules = {
        game_tick: 150,
        tile_size: 40,
        tile_x_amount: 12,
        tile_y_amount: 12,
    };

    start_button = document.getElementById("start_btn");
    pointsForVictory = this.GameRules.tile_x_amount * this.GameRules.tile_y_amount - 1;

    setGame(){
        const avatar = this.setAvatar();
        const {grid, game_board} = this.setBoard(avatar);
        Player.move_direction = "right"; 
        Player.fruit_picked_up = 0;

        new Audio(this.GameAudio.btn_click).play();
        this.start_button.style.display = "none";

        let interval = setInterval(() => {
            const gameConn = new Game();
            gameConn.game(avatar, grid, game_board, interval);
        }, this.GameRules.game_tick);
    }

    setAvatar(){
        const avatar = document.createElement("div");
        avatar.classList.add("player_avatar");
        avatar.style.height = `${this.GameRules.tile_size}px`;
        avatar.style.width = `${this.GameRules.tile_size}px`;
        return avatar;
    }

    setBoard(avatar){
        const grid = [];
        const game_board = document.createElement("div");
        game_board.classList.add("game_board");
        game_board.style.width = `${this.GameRules.tile_size * this.GameRules.tile_x_amount + 18}px`;
        game_board.style.height = `${this.GameRules.tile_size * this.GameRules.tile_y_amount + 18}px`;

        // Loop to create the game 2D grid array
        for(let i = 0; i < this.GameRules.tile_y_amount; i++){
            const x_array = [];
            for(let j = 0; j < this.GameRules.tile_x_amount; j++){
                const grid_tile = document.createElement("div");
                grid_tile.classList.add("grid_tile");
                grid_tile.style.width = `${this.GameRules.tile_size}px`;
                grid_tile.style.height = `${this.GameRules.tile_size}px`;
                game_board.appendChild(grid_tile);
                x_array.push(grid_tile);
            }  
            grid.push(x_array);
        }
        document.getElementById("game_screen").appendChild(game_board);

        Player.positionX = 6;
        Player.positionY = 6;
        grid[Player.positionY][Player.positionX].appendChild(avatar);
        return {grid, game_board};
    }
}

class Game extends GameSetup{
    game(avatar, grid, game_board, interval){
        if(Fruit.amount_generated < 1){
            this.generateFruit(grid);
        }
        this.moveAvatar(avatar, grid, game_board, interval);
        if(Player.positionX === Fruit.positionX && Player.positionY === Fruit.positionY){
            new Audio(this.GameAudio.fruit_pickup).play();
            this.removeFruit(grid);
        }
        if(Player.fruit_picked_up >= this.pointsForVictory){
            this.victory(interval, avatar, grid, game_board);
        } 
        document.getElementById("score").textContent = `SCORE: ${Player.fruit_picked_up * 100}`;
    }

    // Place a fruit on a random tile, but not the tile the player is located
    generateFruit(grid){
        Fruit.item = document.createElement("div");
        Fruit.item.classList.add("fruit");
        Fruit.item.style.height = `${this.GameRules.tile_size}px`;
        Fruit.item.style.width = `${this.GameRules.tile_size}px`; 
        do{
            Fruit.positionY = Math.floor(Math.random() * this.GameRules.tile_y_amount);
            Fruit.positionX = Math.floor(Math.random() * this.GameRules.tile_x_amount);
        }while(Fruit.positionY === Player.positionY && Fruit.positionX === Player.positionX);
        grid[Fruit.positionY][Fruit.positionX].appendChild(Fruit.item);
        Fruit.amount_generated++;  
    }

    moveAvatar(avatar, grid, game_board, interval){
        grid[Player.positionY][Player.positionX].removeChild(avatar);
        this.checkDirection();

        if(Player.positionX >= this.GameRules.tile_x_amount || Player.positionY >= this.GameRules.tile_y_amount || Player.positionX < 0 || Player.positionY < 0){
            return this.gameOver(grid, game_board, interval);
        }

        grid[Player.positionY][Player.positionX].appendChild(avatar);
    }

    checkDirection(){
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
    }

    gameOver(grid, game_board, interval){
        clearInterval(interval);
        new Audio(this.GameAudio.player_death).play();
        setTimeout(() => {
            this.removeFruit(grid);

            const lose_message = document.createElement("p");
            lose_message.classList.add("lose_message");
            lose_message.textContent = "YOU LOSE!";
            game_board.appendChild(lose_message);

            this.start_button.textContent = "RESTART";
            this.start_button.style.display = "block";
            this.start_button.onclick = () => {
                game_board.removeChild(lose_message);
                document.getElementById("game_screen").removeChild(game_board);
                this.setGame();
            }
        }, 1000);
    }

    removeFruit(grid){
        grid[Fruit.positionY][Fruit.positionX].removeChild(Fruit.item);
        Player.fruit_picked_up++;
        Fruit.amount_generated--;
    }

    victory(interval, avatar, grid, game_board){
        clearInterval(interval);
        new Audio(this.GameAudio.player_victory).play();

        const win_message = document.createElement("p");
        win_message.classList.add("win_message");
        win_message.textContent = "YOU WIN!";
        game_board.appendChild(win_message);

        this.start_button.textContent = "PLAY AGAIN!";
        this.start_button.style.display = "block";
        this.start_button.onclick = () => {
            grid[Player.positionY][Player.positionX].removeChild(avatar);
            game_board.removeChild(win_message);
            document.getElementById("game_screen").removeChild(game_board);
            this.setGame();
        }
    }
}