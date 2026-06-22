# 🚂 РЖД Помощник — AI-ассистент для пассажиров

> **Виртуальный голосовой помощник для пассажиров РЖД на основе локальной LLM (Ollama) с поддержкой регистрации, авторизации и хранения истории диалогов.**

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.0-brightgreen)
![Java](https://img.shields.io/badge/Java-21-red)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![Ollama](https://img.shields.io/badge/Ollama-latest-orange)
![Docker](https://img.shields.io/badge/Docker-ready-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📋 О проекте

**РЖД Помощник** — это полнофункциональный веб-сервис, который предоставляет пользователям интеллектуального ассистента для получения информации о:

- Расписании поездов
- Покупке и возврате билетов
- Статусе поездов в реальном времени
- Программе лояльности «РЖД Бонус»

Проект построен на современном стеке технологий и полностью готов к запуску в production-среде.

### 🎯 Ключевые возможности

| Возможность | Описание |
|-------------|----------|
| 🤖 **Умный чат** | Общение с AI-ассистентом на основе локальной LLM (Ollama) |
| 🎤 **Голосовой ввод** | Поддержка голосового ввода через Web Speech API |
| 🔐 **Регистрация и авторизация** | Полноценная система аутентификации с Spring Security |
| 💾 **История диалогов** | Сохранение всех сообщений в PostgreSQL |
| 📱 **Адаптивный интерфейс** | Работает на ПК, планшетах и мобильных устройствах |
| 🐳 **Docker Ready** | Запуск в один клик через Docker Compose |

---

## 🧠 Технологический стек

### Бэкенд

| Технология | Версия | Назначение |
|------------|--------|------------|
| **Spring Boot** | 4.0.0 | Основной фреймворк |
| **Spring Security** | 7.0.0 | Аутентификация и авторизация |
| **Spring Data JPA** | — | ORM для работы с БД |
| **PostgreSQL** | 16 | Хранение данных |
| **Lombok** | — | Упрощение кода |

### Фронтенд

| Технология | Описание |
|------------|----------|
| **HTML5** | Структура страниц |
| **CSS3** | Адаптивный дизайн в стиле РЖД |
| **JavaScript (ES6+)** | Логика интерфейса |
| **Tabler Icons** | Иконки |
| **Web Speech API** | Голосовой ввод |

### Инфраструктура

| Технология | Назначение |
|------------|------------|
| **Ollama** | Локальная LLM (llama3.2:3b) |
| **Docker / Docker Compose** | Контейнеризация |
| **Maven** | Сборка проекта |
| **Git** | Контроль версий |

---

## 🏗️ Архитектура проекта
┌──────────────────────────────────────────────────────────────────────┐
│ Браузер (Frontend) │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────────────────┐ │
│ │ index.html │ │ style.css │ │ app.js + chat.js + │ │
│ │ (чат) │ │ (РЖД стиль) │ │ voice.js │ │
│ └──────────────┘ └──────────────┘ └──────────────────────────┘ │
└─────────────────────────────────┬────────────────────────────────────┘
│ HTTP/HTTPS
▼
┌──────────────────────────────────────────────────────────────────────┐
│ Spring Boot (Backend) │
│ ┌────────────────┐ ┌─────────────────┐ ┌──────────────────────┐ │
│ │ ChatController │ │ OllamaService │ │ ChatHistoryService │ │
│ │ (/api/chat) │ │ (WebClient) │ │ (JPA) │ │
│ └────────────────┘ └─────────────────┘ └──────────────────────┘ │
│ ┌────────────────┐ ┌─────────────────┐ │
│ │ AuthController│ │ SecurityConfig │ │
│ │(/api/auth/*) │ │ (JWT + BCrypt) │ │
│ └────────────────┘ └─────────────────┘ │
└───────────┬─────────────────────────┬──────────────────────────────┘
│ │
▼ ▼
┌───────────────────────┐ ┌──────────────────────────────────────┐
│ Ollama (LLM) │ │ PostgreSQL (База данных) │
│ llama3.2:3b │ │ ┌──────────────────────────────────┐│
│ Port: 11434 │ │ │ messages ││
│ │ │ │ id, user_id, message, reply ││
│ ⚠️ ~3.2 GB RAM │ │ │ created_at, session_id ││
└───────────────────────┘ │ ├──────────────────────────────────┤│
│ │ users ││
│ │ id, username, email, password ││
│ ├──────────────────────────────────┤│
│ │ roles ││
│ │ id, name ││
│ ├──────────────────────────────────┤│
│ │ user_roles ││
│ │ user_id, role_id ││
│ └──────────────────────────────────┘│
└──────────────────────────────────────┘

text

---

## 📁 Структура проекта
AI-assistant/
├── 📁 .github/ # CI/CD workflows
│ └── workflows/ci.yml
├── 📁 init-db.sql # Инициализация базы данных
├── 📁 src/
│ └── main/
│ ├── java/ru/superchack/
│ │ ├── ApplicationRunner.java # Точка входа
│ │ ├── 📁 config/ # Конфигурации
│ │ │ ├── AppConfig.java # WebClient
│ │ │ └── SecurityConfig.java # Spring Security
│ │ ├── 📁 controller/ # REST контроллеры
│ │ │ ├── AuthController.java # /api/auth/*
│ │ │ ├── ChatController.java # /api/chat
│ │ │ └── HistoryController.java # /api/history
│ │ ├── 📁 dto/ # Data Transfer Objects
│ │ ├── 📁 exception/ # Обработка ошибок
│ │ ├── 📁 model/ # JPA сущности
│ │ ├── 📁 repository/ # JPA репозитории
│ │ ├── 📁 security/ # Spring Security
│ │ │ ├── dto/ # Auth DTO
│ │ │ ├── model/ # User, Role
│ │ │ ├── repository/ # UserRepository, RoleRepository
│ │ │ └── service/ # UserDetailsServiceImpl
│ │ └── 📁 service/ # Бизнес-логика
│ └── resources/
│ ├── application.yml # Конфигурация Spring Boot
│ └── 📁 static/ # Фронтенд
│ ├── index.html
│ ├── 📁 css/
│ ├── 📁 js/
│ └── 📁 partials/
├── 📁 target/ # Скомпилированные файлы
├── 📄 docker-compose.yml # Docker Compose
├── 📄 pom.xml # Maven зависимости
└── 📄 README.md # Документация

text

---

## 🔧 API Эндпоинты

### Аутентификация

| Метод | URL | Тело | Ответ | Описание |
|-------|-----|------|-------|----------|
| POST | `/api/auth/register` | `{"username": "string", "email": "string", "password": "string"}` | `{"username": "...", "email": "...", "message": "..."}` | Регистрация нового пользователя |
| POST | `/api/auth/login` | `{"username": "string", "password": "string"}` | `{"username": "...", "email": "...", "message": "..."}` | Вход в систему (по email или username) |

### Чат

| Метод | URL | Тело | Ответ | Описание |
|-------|-----|------|-------|----------|
| POST | `/api/chat` | `{"message": "string"}` | `{"reply": "string"}` | Отправить сообщение AI-ассистенту |
| GET | `/api/history/{userId}` | — | `[{"id": 1, "message": "...", "reply": "...", "createdAt": "..."}]` | Получить историю сообщений |

---

## 🚀 Быстрый старт

### Требования

| Компонент | Версия | Скачать |
|-----------|--------|---------|
| Java | 21+ | [Eclipse Temurin](https://adoptium.net/) |
| Docker | 24+ | [Docker Desktop](https://www.docker.com/) |
| Maven | 3.9+ | Встроен в IDEA |
| Git | 2.40+ | [Git](https://git-scm.com/) |

### 1. Клонирование репозитория

```bash
git clone https://github.com/xxGonzalesxx/AI-assistant.git
cd AI-assistant
2. Запуск с Docker Compose
bash
# Запустить Ollama + PostgreSQL
docker-compose up -d

# Проверить статус
docker-compose ps
3. Сборка и запуск Spring Boot
bash
# Собрать проект
mvn clean package

# Запустить приложение
mvn spring-boot:run
4. Открыть в браузере
text
http://localhost:8080
5. Остановка
bash
docker-compose down          # Остановить контейнеры
Ctrl+C                       # Остановить Spring Boot
📸 Скриншоты
Главная страница
https://screenshots/home.png

Чат с AI-ассистентом
https://screenshots/chat.png

Голосовой ввод
https://screenshots/voice.png

Вход и регистрация
https://screenshots/login.png
https://screenshots/register.png

История сообщений в БД
https://screenshots/database.png

🗄️ База данных
Схема таблиц
sql
-- Сообщения чата
CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    message TEXT NOT NULL,
    reply TEXT,
    session_id VARCHAR(36),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE,
    model_used VARCHAR(50),
    tokens_used INTEGER
);

-- Пользователи
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Роли
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Связь пользователей и ролей
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);
🐳 Docker Compose
yaml
services:
  ollama:
    image: ollama/ollama:latest
    container_name: rzd-ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    command: ollama serve

  postgres:
    image: postgres:16
    container_name: rzd-postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: rzd_assistant
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-db.sql:/docker-entrypoint-initdb.d/init-db.sql
⚙️ Конфигурация
application.yml
yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/rzd_assistant
    username: postgres
    password: postgres
    
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

ollama:
  url: http://localhost:11434
  model: llama3.2:3b
  system-prompt: >
    Ты вежливый ИИ-ассистент РЖД...
🔐 Spring Security
Проект использует Spring Security 7.0.0 для аутентификации и авторизации:

BCrypt — хеширование паролей

JWT — stateless аутентификация

Роли — ROLE_USER и ROLE_ADMIN

Вход по email или username — гибкая система аутентификации

Настройка безопасности
java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    // Конфигурация фильтров и правил доступа
}
🧪 Тестирование
Регистрация пользователя
bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@mail.ru", "password": "123456"}'
Вход в систему
bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "123456"}'
Отправка сообщения
bash
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Привет, как дела?"}'
Получение истории
bash
curl http://localhost:8080/api/history/anonymous
🎯 Планы по развитию
Краткосрочные (Q3 2026)
Базовая аутентификация

Сохранение истории чата

Интеграция с Ollama

Голосовой ввод

Docker Compose

Среднесрочные (Q4 2026)
JWT токены — полноценная stateless авторизация

Админ-панель — просмотр статистики и управления пользователями

Пагинация — для истории сообщений

WebSocket — стриминг ответов в реальном времени

Долгосрочные (2027+)
RAG (Retrieval-Augmented Generation) — добавление знаний о РЖД

Интеграция с системами РЖД — реальное расписание и билеты

Мобильное приложение — на Flutter или React Native

Мультиагентная система — несколько специализированных AI-агентов

Сертификация — для промышленного использования

⚠️ Частые проблемы и решения
Проблема	Решение
Ollama не запускается	docker logs rzd-ollama — проверить логи
Порт 8080 занят	Сменить порт в application.yml
Подключение к БД	Проверить docker ps и docker logs rzd-postgres
Модель не скачалась	docker exec -it rzd-ollama ollama pull llama3.2:3b
CSS не подгружается	Очистить кэш браузера (Ctrl+F5)
Ошибка входа по email	Проверить, что email совпадает с зарегистрированным
🙏 Благодарности
Spring Boot — за отличный фреймворк

Ollama — за локальный запуск LLM

PostgreSQL — за надёжную базу данных

JetBrains — за IntelliJ IDEA

📄 Лицензия
Проект разработан в рамках учебно-исследовательской работы.
Для промышленного использования в РЖД требуется дополнительная сертификация.

👤 Автор
@xxGonzalesxx

GitHub: github.com/xxGonzalesxx

Email: stef.kir1999@gmail.com

⭐ Если проект вам понравился, поставьте звезду!
https://img.shields.io/github/stars/xxGonzalesxx/AI-assistant.svg?style=social

📞 Контакты
По всем вопросам: stef.kir1999@gmail.com

Сделано с ❤️ для пассажиров РЖД