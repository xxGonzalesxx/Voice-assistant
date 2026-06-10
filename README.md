# 🚂 Voice Assistant — РЖД AI Помощник

> **«Разработка голосового технологического помощника для линейного персонала РЖД (монтёры пути, электромеханики СЦБ) на основе Spring AI и локальных LLM»**

---

## 📋 О проекте

Локальный голосовой AI-помощник для монтёра пути и технического персонала РЖД.  
Работает **полностью без интернета**, использует локальную модель `llama3.2:3b` через Ollama.

### Ключевые возможности

| Возможность | Описание |
|-------------|----------|
| 🎤 **Голосовой ввод** | Web Speech API, работает в Chrome/Edge/Safari |
| 🔐 **Локальная регистрация** | Данные хранятся в браузере (localStorage) |
| 💬 **Чат с AI** | На русском языке, ответы за 1-2 секунды |
| 📱 **Адаптивный интерфейс** | Работает на ПК, планшетах и телефонах |
| 🔒 **Офлайн-режим** | После первого запуска интернет не нужен |

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

## 📁 Структура проекта
Файл/Папка	Назначение

pom.xml	Maven зависимости (Spring Boot, Web)
docker-compose.yml	Запуск Ollama + авто-загрузка модели
application.yml	Настройки Spring Boot (порт, статика)
src/main/java/ru/superchack/ApplicationRunner.java	Точка входа Spring Boot
controller/	REST API (/api/ask, /api/ping)
service/	Бизнес-логика (пока пусто)
dto/	Data Transfer Objects
config/	Конфигурации (RestTemplate и т.д.)
exception/	Глобальный обработчик ошибок
src/main/resources/static/index.html	Главная страница (вход + чат)
style/style.css	Стили (корпоративные цвета РЖД)
animation/app.js	JS логика (голос, регистрация)
application.yml	Настройки Spring Boot



## 👥 Роли в команде

| Роль | Обязанности | Основные файлы |
|------|-------------|----------------|
| **Backend** | Java, Spring Boot, REST API, Ollama | `controller/`, `service/`, `pom.xml` |
| **Frontend** | HTML, CSS, JS, голос, адаптив | `index.html`, `style.css`, `app.js` |
| **DevOps** | Docker, docker-compose, деплой | `docker-compose.yml`, `application.yml` |

---

## 🚀 Быстрый старт

### 1. Установите зависимости

| Требование | Проверка | Скачать |
|------------|----------|---------|
| Java 17 | `java -version` | [Eclipse Temurin](https://adoptium.net/) |
| Docker Desktop | `docker --version` | [Docker](https://www.docker.com/products/docker-desktop/) |
| Maven | `mvn --version` | Встроен в IDEA |

### 2. Клонируйте и запустите

```bash
git clone https://github.com/xxGonzalesxx/Voice-assistant.git
cd Voice-assistant

# Запустить Ollama (автоматически скачает модель 2 GB)
docker-compose up -d

# Запустить Spring Boot
mvn spring-boot:run
3. Откройте в браузере
text
http://localhost:8080
4. Остановка
bash
docker-compose down          # Остановить Ollama
Ctrl+C                       # Остановить Spring Boot
🔧 API эндпоинты
Метод	URL	Тело	Ответ	Описание
POST	/api/ask	"текст вопроса"	"текст ответа"	Отправить вопрос AI
GET	/api/ping	—	"OK"	Проверка состояния
🎨 Фронтендеру
Файл	Роль	Важные ID/классы
index.html	Разметка	#auth-container, #chat-container, #answer
style.css	Стили	Цвета РЖД: #d32f2f, градиент #0a2b3e → #1a4a6f
app.js	Логика	askQuestion(), startVoice(), registerAndEnter()
Голос: использует webkitSpeechRecognition (Chrome/Edge/Safari)

⚠️ Частые проблемы и решения
Проблема	Решение
Модель не скачалась	docker logs rzd-ollama — проверить логи
Порт 8080 занят	Сменить порт в application.yml
CSS не подгружается	Проверить путь: /style/style.css
Ollama не отвечает	docker-compose restart
📞 Контакты
Автор: @xxGonzalesxx

Репозиторий: github.com/xxGonzalesxx/Voice-assistant

📄 Лицензия
Проект разработан в рамках учебно-исследовательской работы.
Для промышленного использования в РЖД требуется сертификация.
