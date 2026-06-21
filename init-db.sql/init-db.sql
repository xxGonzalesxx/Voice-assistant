-- ============================================================
-- 1. ТАБЛИЦА messages (оптимизированная)
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,          -- UUID вместо VARCHAR(255)
    message TEXT NOT NULL,
    reply TEXT,
    session_id VARCHAR(36),                -- UUID вместо VARCHAR(255)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),  -- с часовым поясом
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),  -- для аудита
    is_deleted BOOLEAN DEFAULT FALSE,      -- мягкое удаление
    model_used VARCHAR(50),                -- какая модель ответила
    tokens_used INTEGER                    -- сколько токенов потрачено
);

-- ============================================================
-- 2. ИНДЕКСЫ (оптимизированные)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_user_created ON messages(user_id, created_at DESC);  -- составной индекс
CREATE INDEX IF NOT EXISTS idx_messages_is_deleted ON messages(is_deleted) WHERE is_deleted = FALSE;  -- частичный индекс

-- ============================================================
-- 3. АВТОМАТИЧЕСКОЕ ОБНОВЛЕНИЕ updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_messages_updated_at ON messages;
CREATE TRIGGER update_messages_updated_at
    BEFORE UPDATE ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 4. КОММЕНТАРИИ (документация)
-- ============================================================
COMMENT ON TABLE messages IS 'История сообщений чата';
COMMENT ON COLUMN messages.user_id IS 'ID пользователя (UUID)';
COMMENT ON COLUMN messages.message IS 'Сообщение пользователя';
COMMENT ON COLUMN messages.reply IS 'Ответ ассистента';
COMMENT ON COLUMN messages.session_id IS 'ID сессии (для группировки диалога)';
COMMENT ON COLUMN messages.model_used IS 'Модель Ollama, которая ответила';
COMMENT ON COLUMN messages.tokens_used IS 'Количество токенов в ответе';