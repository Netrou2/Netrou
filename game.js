const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

// Variables de jeu
let player = { x: 50, y: 300, width: 40, height: 40, gravity: 0.5, lift: -10, velocity: 0 };
let obstacles = [];
let score = 0;
let gameOver = false;
let countdown = 3;
let gameStarted = false;

// Fonction pour démarrer le jeu
function startGame() {
    document.getElementById("menu").style.display = "none"; // Cacher le menu
    canvas.style.display = "block"; // Afficher le canvas
    countdown = 3; // Réinitialiser le compte à rebours
    updateCountdown();
}

// Mettre à jour le compte à rebours
function updateCountdown() {
    if (countdown > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.font = "48px Arial";
        ctx.fillText(countdown, canvas.width / 2 - 20, canvas.height / 2);
        countdown--;
        setTimeout(updateCountdown, 1000); // Appeler la fonction toutes les secondes
    } else {
        gameStarted = true; // Commencer le jeu
        update(); // Lancer le jeu
    }
}

// Générer des obstacles
function spawnObstacle() {
    const gap = 150; // Espace entre les obstacles
    const height = Math.random() * (canvas.height - gap - 40) + 20; // Hauteur des obstacles
    obstacles.push({ x: canvas.width, y: 0, width: 50, height: height, gap: gap });
}

// Met à jour le jeu
function update() {
    if (gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.font = "48px Arial";
        ctx.fillText("Jeu terminé!", canvas.width / 2 - 100, canvas.height / 2);
        ctx.font = "24px Arial";
        ctx.fillText("Score: " + score, canvas.width / 2 - 50, canvas.height / 2 + 50);
        ctx.fillText("Appuyez sur 'Entrée' pour recommencer", canvas.width / 2 - 150, canvas.height / 2 + 90);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Effacer le canvas

    // Appliquer la gravité
    player.velocity += player.gravity;
    player.y += player.velocity;

    // Dessiner le joueur
    ctx.fillStyle = "orange";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Mettre à jour et dessiner les obstacles
    obstacles.forEach((obstacle, index) => {
        obstacle.x -= 3; // Vitesse de déplacement des obstacles
        ctx.fillStyle = "green";
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height); // Dessiner le haut de l'obstacle
        ctx.fillRect(obstacle.x, obstacle.y + obstacle.height + obstacle.gap, obstacle.width, canvas.height - obstacle.height - obstacle.gap); // Dessiner le bas de l'obstacle

        // Vérifier la collision avec le joueur
        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            (player.y < obstacle.height || player.y + player.height > obstacle.height + obstacle.gap)
        ) {
            gameOver = true; // Fin du jeu
        }

        // Retirer l'obstacle s'il sort de l'écran
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
            score++; // Augmenter le score
        }
    });

    // Afficher le score
    ctx.fillStyle = "black";
    ctx.font = "24px Arial";
    ctx.fillText("Score: " + score, 10, 30); // Afficher le score

    // Générer des obstacles à intervalles réguliers
    if (frame % 100 === 0) {
        spawnObstacle();
    }

    requestAnimationFrame(update);
}

// Gérer les touches de mouvement
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" || event.key === " ") {
        player.velocity = player.lift; // Faire sauter le joueur
    }
    if (event.key === "Enter" && gameOver) {
        resetGame(); // Recommencer le jeu
    }
});

// Réinitialiser le jeu
function resetGame() {
    score = 0;
    gameOver = false;
    player.y = canvas.height / 2;
    player.velocity = 0;
    obstacles = [];
    update(); // Relancer le jeu
}

// Déclaration de frame pour le contrôle des obstacles
let frame = 0;

// Démarrer le jeu
function main() {
    document.getElementById("startButton").addEventListener("click", startGame); // Ajouter l'écouteur d'événement
    setInterval(() => {
        frame++;
    }, 1000 / 60); // Environ 60 FPS
}

main();
