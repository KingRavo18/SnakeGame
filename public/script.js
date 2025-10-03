document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("start_btn").onclick = () => startGame();
});

function startGame() {
    document.getElementById("start_btn").style.display = "none";
    const game_screen_width = document.getElementById("game_screen").clientWidth; 
    const game_screen_height = document.getElementById("game_screen").clientHeight; 
    
    document.getElementById("game_screen").style.width = `${game_screen_width}px`;
    document.getElementById("game_screen").style.height = `${game_screen_height}px`;
}