# 🚂 Voice Assistant — РЖД AI Помощник

> **«Разработка голосового технологического помощника для линейного персонала РЖД (монтёры пути, электромеханики СЦБ) на основе Spring AI и локальных LLM»**

---

## 📋 О проекте

Локальный голосовой AI-помощник для монтёра пути и технического персонала РЖД.  
Работает **полностью без интернета**, использует локальную модель `llama3.2:3b` через Ollama.

**Ключевые возможности:**
- 🎤 Голосовой ввод вопросов (браузерный Web Speech API)
- 🔐 Локальная регистрация/вход (хранится в браузере)
- 💬 Чат с AI на русском языке
- 📱 Адаптивный интерфейс (работает на планшетах и телефонах)

---

## 🧠 Технологический стек

| Компонент | Технология | Версия |
|-----------|------------|--------|
| **Бэкенд** | Java + Spring Boot | 17 / 3.3.4 |
| **AI** | Ollama + llama3.2:3b | latest |
| **Сборка** | Maven | 3.9+ |
| **Контейнеризация** | Docker / Docker Compose | latest |
| **Фронтенд** | HTML5 + CSS3 + JavaScript | ES6 |
| **Стили** | Кастомный CSS (корпоративные цвета РЖД) | — |

---

## 📁 Структура проекта (для разработчиков)

Voice-assistant/
│
├── 📄 pom.xml # Maven зависимости (Spring Boot, Web)
├── 📄 docker-compose.yml # Запуск Ollama + авто-загрузка модели
├── 📄 application.yml # Настройки Spring Boot и статики
│
├── 🧩 src/main/java/ru/superchack/
│ ├── ApplicationRunner.java # Точка входа Spring Boot
│ ├── controller/ # REST контроллеры (AI API)
│ ├── service/ # Бизнес-логика (пока пусто)
│ ├── dto/ # Data Transfer Objects
│ ├── config/ # Конфигурации (RestTemplate и т.д.)
│ └── exception/ # Глобальный обработчик ошибок
│
└── 🎨 src/main/resources/
├── static/index.html # Главная страница (вход + чат)
├── style/style.css # Стили (цвета РЖД, адаптив)
├── animation/app.js # JS логика (голос, отправка, регистрация)
└── application.yml # Настройки Spring Boot

---

## 👥 Роли в проекте (для команды)

| Роль | Обязанности | Основные файлы |
|------|-------------|----------------|
| **Backend-разработчик** | Java + Spring Boot, REST API, интеграция с Ollama | `ApplicationRunner.java`, `controller/*`, `service/*`, `pom.xml` |
| **Frontend-разработчик** | HTML, CSS, JS, голосовой ввод, адаптив | `index.html`, `style.css`, `app.js` |
| **DevOps (опционально)** | Docker, docker-compose, развёртывание | `docker-compose.yml`, `application.yml` |

---

## 🚀 Быстрый старт (для нового разработчика)

### Требования
- Java 17 (Eclipse Temurin или Amazon Corretto)
- Docker Desktop (с поддержкой Linux-контейнеров)
- Maven (можно через IDEA или отдельно)

### Команды для запуска

```bash
# 1. Клонировать проект
git clone https://github.com/xxGonzalesxx/Voice-assistant.git
cd Voice-assistant

# 2. Запустить Ollama + автоматическую загрузку модели (2 GB)
docker-compose up -d

# 3. Запустить Spring Boot
mvn spring-boot:run

# 4. Открыть в браузере
http://localhost:8080


Остановка
bash
# Остановить Ollama
docker-compose down

# Остановить Spring Boot (Ctrl+C в терминале)
🔧 API эндпоинты (для бэкендера)
Метод	URL	Тело запроса	Ответ	Описание
POST	/api/ask	"текст вопроса"	"текст ответа"	Отправить вопрос AI
GET	/api/ping	—	"OK"	Проверка состояния
🎨 Фронтендеру: структура страницы
Файл	Роль	Важные моменты
index.html	Разметка (HTML)	Контейнеры: #auth-container, #chat-container, #answer
style.css	Стили (РЖД красный + синий градиент)	Адаптив под телефон, анимация загрузки
app.js	Логика	askQuestion(), startVoice(), registerAndEnter()
Голосовой ввод — использует webkitSpeechRecognition, работает в Chrome/Edge/Safar