const USER_KEY = 'rzd_assistant_user';

function registerAndEnter() {
    const tabnum = document.getElementById('tabnum').value.trim();
    const fullname = document.getElementById('fullname').value.trim();
    const station = document.getElementById('station').value.trim();
    const position = document.getElementById('position').value;
    const messageDiv = document.getElementById('auth-message');

    if (!tabnum || !fullname) {
        messageDiv.className = 'message error';
        messageDiv.innerHTML = '❌ Заполните табельный номер и ФИО';
        return;
    }

    const user = {
        tabnum, fullname,
        station: station || 'Не указано',
        position,
        registeredAt: new Date().toLocaleString()
    };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    showChat(user);
}

function showChat(user) {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('chat-container').style.display = 'block';
    document.getElementById('user-info').innerHTML = `${user.fullname} • ${user.position} • ${user.station}`;
    document.getElementById('question').value = '';
    document.getElementById('answer').innerHTML = 'Добро пожаловать! Задайте вопрос по инструкциям РЖД.';
}

function logout() {
    localStorage.removeItem(USER_KEY);
    document.getElementById('auth-container').style.display = 'block';
    document.getElementById('chat-container').style.display = 'none';
    document.getElementById('tabnum').value = '';
    document.getElementById('fullname').value = '';
    document.getElementById('station').value = '';
    document.getElementById('position').value = 'Монтёр пути 3 разряда';
    document.getElementById('auth-message').className = 'message';
}

async function askQuestion() {
    const question = document.getElementById('question').value.trim();
    const answerDiv = document.getElementById('answer');
    if (!question) {
        answerDiv.innerHTML = '⚠️ Введите вопрос';
        return;
    }
    answerDiv.innerHTML = '<div class="loading"></div> AI анализирует запрос...';
    try {
        const response = await fetch('/api/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: question
        });
        const answer = await response.text();
        answerDiv.innerHTML = answer || 'Ответ не получен';
    } catch (error) {
        answerDiv.innerHTML = '❌ Ошибка: сервер не отвечает. Убедитесь, что приложение запущено.';
    }
}

function startVoice() {
    if (!('webkitSpeechRecognition' in window)) {
        alert('Голосовой ввод доступен в Chrome, Edge или Safari');
        return;
    }
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.interimResults = false;
    const answerDiv = document.getElementById('answer');
    answerDiv.innerHTML = '🎙️ Слушаю, задайте вопрос...';
    recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        document.getElementById('question').value = text;
        askQuestion();
    };
    recognition.onerror = () => {
        answerDiv.innerHTML = '❌ Не удалось распознать голос. Попробуйте ещё раз.';
    };
    recognition.start();
}

window.onload = function() {
    const savedUser = localStorage.getItem(USER_KEY);
    if (savedUser) {
        try {
            showChat(JSON.parse(savedUser));
        } catch(e) {}
    }
}