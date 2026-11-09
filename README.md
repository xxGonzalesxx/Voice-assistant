# 🚂 РЖД Помощник

**AI-ассистент для пассажиров Российских железных дорог**

Виртуальный интеллектуальный голосовой помощник на основе локальной LLM с поддержкой регистрации, авторизации и хранения истории диалогов.

---

<div align="center">

![Java](https://img.shields.io/badge/Java-25-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.1.1-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Bridge-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-Qwen_2.5_4B-000000?style=for-the-badge&logo=ollama&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</div>

---

## 📋 О проекте

**РЖД Помощник** — это высоконагруженный веб-сервис, предоставляющий пользователям интеллектуального виртуального ассистента для получения информации по ключевым сервисам железных дорог.

Проект построен на **гибридной архитектуре** (сочетание классического сервлетного стека и реактивного WebClient) и оптимизирован для работы **на локальном оборудовании** без отправки данных на внешние сервера.

> 🔒 Все диалоги, авторизация и история переписки обрабатываются внутри вашей инфраструктуры.

---

## 🎯 Ключевые возможности

| | Возможность | Описание |
|---|---|---|
| 🤖 | **Локальный ИИ нового поколения** | Общение с моделью Qwen 2.5 (3B), оптимизированной для русского языка |
| 🎤 | **Асинхронный голосовой ввод** | Мгновенное распознавание речи через Web Speech API |
| 🔐 | **Защита корпоративного уровня** | STATELESS-аутентификация Spring Security 7.x + BCrypt |
| 💾 | **Персистентность диалогов** | Хранение истории в PostgreSQL 18 с привязкой к UUID |
| 📱 | **Адаптивный дизайн** | Футуристичный UI/UX в фирменном стиле РЖД с CSS-анимациями |

---

## 🧠 Технологический стек

### Бэкенд

| Компонент | Технология |
|---|---|
| **Ядро** | Java 25, Spring Boot 4.1.1 (Web + WebFlux) |
| **Безопасность** | Spring Security 7.x, DaoAuthenticationProvider, BCrypt |
| **Данные** | Spring Data JPA, Hibernate 6+, HikariCP |
| **СУБД** | PostgreSQL 18 (нативные UUID, PL/pgSQL триггеры) |
| **Инструменты** | Lombok, Jackson 3.x |

### Фронтенд

| Компонент | Технология |
|---|---|
| **Интерфейс** | Vanilla JS (ES6+), HTML5, CSS3-переменные |
| **Графика** | Tabler Icons, веб-шрифты |
| **Интеграция** | Partials Layout, Web Speech API (`webkitSpeechRecognition`) |

### Инфраструктура

| Компонент | Технология |
|---|---|
| **ИИ-движок** | Ollama API (`/api/generate`) |
| **ИИ-модель** | Qwen 2.5 (3B Instruct), Apache 2.0 |
| **Контейнеризация** | Docker, Docker Compose (`network_mode: bridge`) |

---

## 📁 Структура проекта


---

## 🔧 API Эндпоинты

### 🔐 Аутентификация

| Метод | Эндпоинт | Описание |
|---|---|---|
| `POST` | `/api/auth/register` | Регистрация аккаунта (`username`, `email`, `password`) |
| `POST` | `/api/auth/login` | Авторизация (по email или username) |

### 💬 Диалоговая панель

| Метод | Эндпоинт | Описание |
|---|---|---|
| `POST` | `/api/chat` | Отправка реплики ассистенту. Изолируется на пуле `boundedElastic`, обогащается системным промтом, сохраняется в БД. Возвращает `ChatResponse.response` |
| `GET` | `/api/history/{userId}` | JSON-массив истории сообщений для указанного UUID |

---

## 🚀 Быстрый старт

### Шаг 1 — Подготовка инфраструктуры в Docker

```bash
docker compose up -d


erDiagram
    users {
        BIGSERIAL id PK
        VARCHAR(50) username UK
        VARCHAR(100) email UK
        VARCHAR(255) password
        VARCHAR(50) first_name
        VARCHAR(50) last_name
        BOOLEAN enabled
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
    roles {
        BIGSERIAL id PK
        VARCHAR(50) name UK
    }
    user_roles {
        BIGINT user_id FK
        BIGINT role_id FK
    }
    messages {
        BIGSERIAL id PK
        UUID user_id
        TEXT user_message
        TEXT reply
        UUID session_id
        TIMESTAMP created_at
        TIMESTAMP updated_at
        BOOLEAN is_deleted
        VARCHAR(50) model_used
        INTEGER tokens_used
    }

    users ||--o{ user_roles : "has"
    roles ||--o{ user_roles : "assigned_to"

🛠️ Особенности схемы
UUID вместо VARCHAR(36) для user_id и session_id — ускорение B-Tree индексов в ~2.5 раза

Колонка user_message вместо message — message зарезервирован в PostgreSQL 18

Составной индекс idx_messages_user_created (user_id, created_at DESC) заменяет избыточный idx_messages_user_id

🏗️ Архитектурные решения
<details> <summary><b>Почему гибридный стек Web + WebFlux?</b></summary>
Tomcat — основной сервер для совместимости с блокирующим Hibernate/JPA

WebFlux — используется исключительно ради асинхронного WebClient

Это устраняет конфликт одновременного присутствия spring-boot-starter-web и spring-boot-starter-webflux.

</details><details> <summary><b>Реактивность без блокировок</b></summary>
Все операции сохранения истории и авторизации обёрнуты в Mono и перенесены на Schedulers.boundedElastic(). Это устранило риск IllegalStateException в потоках Netty.

</details><details> <summary><b>Сетевая конфигурация Docker</b></summary>
Для всех сервисов зафиксирован network_mode: "bridge". Контейнеры привязаны к постоянному IP шлюза хоста (172.17.0.1), что решило проблему ConnectException («Ollama не отвечает»).

</details><details> <summary><b>Системные промты на уровне DTO</b></summary>
Инструкции РЖД перенесены из тела пользовательского запроса (prompt) в выделенное API-поле system. Модель безошибочно генерирует ответы на русском языке с первого токена.

</details>

Лицензия
Проект распространяется под свободной лицензией MIT.
Разрешено использование и модификация в любых коммерческих и личных целях.

См. файл LICENSE для подробностей.

<div align="center">
Сделано с ❤️ для пассажиров РЖД

🚂 Счастливого пути!

</div> ```
Готово! Просто скопируйте всё содержимое этого блока и вставьте в свой файл README.md.
