document.addEventListener("DOMContentLoaded", () => {
    const direction_control = new DirectionControl();
    document.addEventListener("keydown", event => direction_control.chooseDirection(event));
    const start_game = new GameSetup();
    document.getElementById("start_btn").onclick = () => start_game.setGame();
    document.getElementById("defaultValues").onclick = () => start_game.selectDefaultValues();
});

//These cannot be incorporated into any classes. If I try, nothing works
const Player = {
    positionX: 0,
    positionY: 0, 
    fruit_picked_up: 0,
    move_direction: "right",
};
const Fruit = {
    item: undefined,
    positionX: 0,
    positionY: 0,
    amount_generated: 0,
};

class DirectionControl{

    chooseDirection(event){
        switch(event.key){
            case "ArrowRight":
                this.forbidDirection("left", "right");
                break;
            case "ArrowDown":
                this.forbidDirection("up", "down");
                break;
            case "ArrowLeft":
                this.forbidDirection("right", "left");
                break;
            case "ArrowUp":
                this.forbidDirection("down", "up");
                break;
        }
    }

    forbidDirection(oppositeDirection, selectedDirection){
        if(Player.move_direction === oppositeDirection) return;
        Player.move_direction = selectedDirection;
    }
}

class GameSetup{

    GameAudio = {
        btn_click: "Assets/Audio/button-click-sound.wav", 
        player_death: "Assets/Audio/player-death-sound.mp3",
        fruit_pickup: "Assets/Audio/fruit-pickup-sound.wav",
        player_victory: "Assets/Audio/victory-sound.wav",
    };

    start_button = document.getElementById("start_btn");
    input_control = document.getElementById("input-window");

    selectDefaultValues(){
        new Audio(this.GameAudio.btn_click).play();
        document.getElementById("tick_speed").value = 150;
        document.getElementById("tile_number_x").value = 12;
        document.getElementById("tile_number_y").value = 12;
        document.getElementById("tile_size").value = 35;
    }

    setGame(){
        const {game_tick, tile_size, tile_x_amount, tile_y_amount} = this.setGameRules();
        const avatar = this.setAvatar(tile_size);
        const {grid, game_board} = this.setBoard(avatar, tile_x_amount, tile_y_amount, tile_size);
        const pointsForVictory = tile_x_amount * tile_y_amount - 1;
        Player.move_direction = "right"; 
        Player.fruit_picked_up = 0;

        new Audio(this.GameAudio.btn_click).play();
        this.start_button.style.display = "none";

        let interval = setInterval(() => {
            const gameConn = new Game();
            gameConn.game(avatar, grid, game_board, tile_x_amount, tile_y_amount, tile_size, pointsForVictory, interval);
        }, game_tick);
    }

    setGameRules(){
        const game_tick = document.getElementById("tick_speed").value;
        const tile_x_amount = document.getElementById("tile_number_x").value;
        const tile_y_amount = document.getElementById("tile_number_y").value;
        const tile_size = document.getElementById("tile_size").value;
        this.input_control.style.visibility = "hidden";
        return {game_tick, tile_size, tile_x_amount, tile_y_amount};
    }

    setAvatar(tile_size){
        const avatar = document.createElement("div");
        avatar.classList.add("player_avatar");
        avatar.style.height = `${tile_size}px`;
        avatar.style.width = `${tile_size}px`;
        return avatar;
    }

    setBoard(avatar, tile_x_amount, tile_y_amount, tile_size){
        const grid = [];
        const game_board = document.createElement("div");
        game_board.classList.add("game_board");

        // Loop to create the game 2D grid array
        for(let i = 0; i < tile_y_amount; i++){
            const x_array = [];
            const game_board_row = document.createElement("div");
            game_board_row.classList.add("game_board_row");
            for(let j = 0; j < tile_x_amount; j++){
                const grid_tile = document.createElement("div");
                grid_tile.classList.add("grid_tile");
                grid_tile.style.width = `${tile_size}px`;
                grid_tile.style.height = `${tile_size}px`;
                x_array.push(grid_tile);
                game_board_row.appendChild(grid_tile);
            } 
            grid.push(x_array);
            game_board.appendChild(game_board_row);
        }

        document.getElementById("game_screen").appendChild(game_board);
        Player.positionX = tile_x_amount / 2;
        Player.positionY = tile_y_amount / 2;
        grid[Player.positionY][Player.positionX].appendChild(avatar);
        return {grid, game_board};
    }
}

class Game extends GameSetup{

    game(avatar, grid, game_board, tile_x_amount, tile_y_amount, tile_size, pointsForVictory, interval){
        if(Fruit.amount_generated < 1){
            this.generateFruit(grid, tile_x_amount, tile_y_amount, tile_size);
        }
        this.moveAvatar(avatar, grid, game_board, tile_x_amount, tile_y_amount, interval);
        if(Player.positionX === Fruit.positionX && Player.positionY === Fruit.positionY){
            new Audio(this.GameAudio.fruit_pickup).play();
            this.removeFruit(grid);
        }
        if(Player.fruit_picked_up >= pointsForVictory){
            this.victory(interval, avatar, grid, game_board);
        } 
        document.getElementById("score").textContent = `SCORE: ${Player.fruit_picked_up * 100}`;
    }

    // Place a fruit on a random tile, but not the tile the player is located
    generateFruit(grid, tile_x_amount, tile_y_amount, tile_size){
        Fruit.item = document.createElement("div");
        Fruit.item.classList.add("fruit");
        Fruit.item.style.height = `${tile_size}px`;
        Fruit.item.style.width = `${tile_size}px`; 
        do{
            Fruit.positionY = Math.floor(Math.random() * tile_y_amount);
            Fruit.positionX = Math.floor(Math.random() * tile_x_amount);
        }while(Fruit.positionY === Player.positionY && Fruit.positionX === Player.positionX);
        grid[Fruit.positionY][Fruit.positionX].appendChild(Fruit.item);
        Fruit.amount_generated++;  
    }

    moveAvatar(avatar, grid, game_board, tile_x_amount, tile_y_amount, interval){
        grid[Player.positionY][Player.positionX].removeChild(avatar);
        this.checkDirection();

        if(Player.positionX >= tile_x_amount || Player.positionY >= tile_y_amount || Player.positionX < 0 || Player.positionY < 0){
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
            lose_message.classList.add("end_message");
            lose_message.classList.add("lose_message");
            lose_message.textContent = "YOU LOSE!";
            game_board.appendChild(lose_message);

            this.start_button.textContent = "RESTART";
            this.start_button.style.display = "block";
            this.input_control.style.display = "block";
            this.input_control.style.visibility = "visible";
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
        win_message.classList.add("end_message");
        win_message.classList.add("win_message");
        win_message.textContent = "YOU WIN!";
        game_board.appendChild(win_message);

        this.start_button.textContent = "PLAY AGAIN!";
        this.start_button.style.display = "block";
        this.input_control.style.visibility = "visible";
        this.start_button.onclick = () => {
            grid[Player.positionY][Player.positionX].removeChild(avatar);
            game_board.removeChild(win_message);
            document.getElementById("game_screen").removeChild(game_board);
            this.setGame();
        }
    }
}