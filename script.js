// Конфигурация Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBGMcKrZWVwrpvgnzN5n3lmKhm1CDsGpUI",
    authDomain: "bunkerei2.firebaseapp.com",
    projectId: "bunkerei2",
    storageBucket: "bunkerei2.firebasestorage.app",
    messagingSenderId: "1019667402110",
    appId: "1:1019667402110:web:fb4b472ed764e66f21372f",
    measurementId: "G-9V9X07S7J4"
};

// Инициализация Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Массивы для случайных карт (сценариев)
const scenarios = [
    "1. Астероид 2235 год. Астрономы обнаружили крупный астероид, который через несколько месяцев столкнется с Землей.",
    "2. Вирус HN-Ø, 2030 год. В мире появляется вирус HN-Ø, который не вызывает симптомов месяцами.",
    "3. Глобальные военные конфликты, 2036 год. На Земле вспыхнула цепная реакция локальных войн.",
    "4. Токсичные облака, 2041 год. В результате климатических катастроф образовались токсичные облака.",
    "5. Загадочное исчезновение цивилизации, 2039 год. Города опустели, люди исчезли без следа.",
    "6. Разрушение экосистемы, 2040 год. Массовая вырубка лесов и климатические аномалии.",
    "7. Экспериментальные технологии вышли из-под контроля, 2043 год. Искусственный интеллект вышел из-под контроля.",
    "8. Цунами, 2038 год. Гигантское подводное землетрясение вызвало огромные цунами.",
    "9. Эксперимент, 2037 год. Вы проснулись в подземном комплексе, не помня, как сюда попали.",
    "10. Солнечная вспышка, 2043 год. Учёные зафиксировали гигантскую солнечную вспышку.",
    "11. Экономический и социальный кризис, 2040 год. Мир погружается в хаос из-за экономических кризисов.",
    "12. Извержение супервулкана, 2038 год. Вулкан Йеллоустон извергся, уничтожив близлежащие регионы.",
    "13. Пришельцы, 2045 год. Небо заполнено огромными кораблями пришельцев.",
    "14. Искусственный интеллект, 2042 год. ИИ вышел из-под контроля и захватил систему связи."
];

// Инициализация массива игроков
let players = [];

// Функция для случайного выбора из массива
function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Функция для генерации уникального ID для игры
function generateGameId() {
    return Math.random().toString(36).substring(2, 15);
}

// Функция для создания игры с сохранением сценария
function createGame(playerName) {
    const gameId = generateGameId();
    const scenario = getRandomElement(scenarios);

    // Сохраняем информацию об игре и сценарий в базе данных Firebase
    const gameRef = database.ref('games/' + gameId);
    gameRef.set({
        scenario: scenario,
        players: {
            [playerName]: true
        }
    });

    return gameId;
}

// Функция для добавления игрока в сессию
function addPlayerToGame(gameId, playerName) {
    const gameRef = database.ref('games/' + gameId);
    
    // Добавляем игрока в сессию
    gameRef.child('players').update({
        [playerName]: true
    });

    // Получаем сценарий для игрока
    gameRef.child('scenario').once('value').then(function(snapshot) {
        const scenario = snapshot.val();
        console.log(`Сценарий игры: ${scenario}`);
    });

    // Отслеживаем изменения в базе данных
    gameRef.child('players').on('child_added', function(snapshot) {
        const player = snapshot.key;
        console.log(player + " присоединился к игре");
    });
}

// Получаем ID игры из URL
function getGameIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('gameId');
}

// Обработчик нажатия на кнопку "Начать игру"
document.getElementById("start-game-button").addEventListener("click", function() {
    const playerName = document.getElementById("player-name-input").value;
    if (playerName) {
        // Создаём игру и генерируем уникальный ID
        const gameId = createGame(playerName);

        // Формируем ссылку для приглашения
        const inviteLink = `${window.location.href}?gameId=${gameId}`;

        // Показываем ссылку для приглашения
        document.getElementById("invite-section").style.display = "block";
        document.getElementById("invite-link").textContent = "Пригласить друзей: " + inviteLink;
        document.getElementById("invite-link").addEventListener("click", function() {
            navigator.clipboard.writeText(inviteLink).then(function() {
                alert("Ссылка скопирована! Пригласите друзей.");
            });
        });

        // Загружаем сценарий игры для игрока
        addPlayerToGame(gameId, playerName);
    } else {
        alert("Пожалуйста, введите ваше имя!");
    }
});

// Присоединение игрока к игре
document.getElementById("join-game-button").addEventListener("click", function() {
    const playerName = document.getElementById("player-name-input").value;
    const gameId = getGameIdFromUrl();
    
    if (playerName && gameId) {
        addPlayerToGame(gameId, playerName);
    } else {
        alert("Введите имя и правильную ссылку на игру!");
    }
});


