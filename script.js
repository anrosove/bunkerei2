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

// Массивы для случайных карт
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
let players = JSON.parse(localStorage.getItem("players")) || [];

// Функция для случайного выбора из массива
function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Функция для загрузки сценария
function loadScenario() {
    const scenario = getRandomElement(scenarios);
    document.getElementById("scenario-text").textContent = "Загрузка сценария...";
    
    // Задержка перед загрузкой сценария (1 секунда)
    setTimeout(function() {
        document.getElementById("scenario-text").textContent = scenario;
        // Скрываем ввод имени и показываем сценарий
        document.getElementById("name-section").style.display = "none";
        document.getElementById("scenario-section").style.display = "block";
        document.getElementById("player-info-section").style.display = "block";
    }, 1000);
}

// Функция для обновления игроков в localStorage
function updatePlayers() {
    localStorage.setItem("players", JSON.stringify(players));
}

// Функция для создания ссылки для приглашения
function createInviteLink() {
    const gameId = Math.random().toString(36).substring(2, 15);
    return `${window.location.href}?game=${gameId}`;
}

// Функция для добавления игрока в сессию
function addPlayerToGame(gameId, playerName) {
    const gameRef = database.ref('games/' + gameId);
    
    // Добавляем игрока в сессию
    gameRef.child('players').push().set({
        name: playerName
    });

    gameRef.child('players').on('child_added', function(snapshot) {
        const player = snapshot.val();
        console.log(player.name + " присоединился к игре");
    });
}

// Функция для получения ID игры из URL
function getGameIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('game');
}

// Обработчик нажатия на кнопку "Начать игру"
document.getElementById("start-game-button").addEventListener("click", function() {
    const playerName = document.getElementById("player-name-input").value;
    if (playerName) {
        // Генерация уникального ID для игры
        const gameId = Math.random().toString(36).substring(2, 15);
        
        // Добавление игрока в Firebase
        addPlayerToGame(gameId, playerName);

        // Формируем ссылку для приглашения
        const inviteLink = `${window.location.href}?game=${gameId}`;

        // Показываем ссылку для приглашения
        document.getElementById("invite-section").style.display = "block";
        document.getElementById("invite-link").textContent = "Пригласить друзей: " + inviteLink;
        document.getElementById("invite-link").addEventListener("click", function() {
            navigator.clipboard.writeText(inviteLink).then(function() {
                alert("Ссылка скопирована! Пригласите друзей.");
            });
        });
    } else {
        alert("Пожалуйста, введите ваше имя!");
    }
});

// Присоединение игрока к игре через ссылку
document.getElementById("start-game-button").addEventListener("click", function() {
    const playerName = document.getElementById("player-name-input").value;
    const gameId = getGameIdFromUrl();
    if (playerName && gameId) {
        // Добавляем игрока в Firebase
        addPlayerToGame(gameId, playerName);
        alert("Вы присоединились к игре!");
    } else {
        alert("Неверная ссылка на игру или имя не введено.");
    }
});


