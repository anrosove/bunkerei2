// Генерация уникального ID для игры
function generateGameId() {
    return Math.random().toString(36).substring(2, 15);  // Генерирует случайный ID
}

// Функция для добавления игрока в сессию
function addPlayerToGame(gameId, playerName) {
    const gameRef = database.ref('games/' + gameId);
    
    // Добавляем игрока в сессию
    gameRef.child('players').push().set({
        name: playerName
    });

    // Отслеживаем изменения в базе данных (чтобы другие игроки увидели новых участников)
    gameRef.child('players').on('child_added', function(snapshot) {
        const player = snapshot.val();
        console.log(player.name + " присоединился к игре");
    });
}
