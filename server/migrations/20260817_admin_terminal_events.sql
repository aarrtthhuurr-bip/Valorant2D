-- Eventos efêmeros usados pelo terminal administrativo para comunicados e
-- expulsões. A inicialização do servidor executa o mesmo esquema de forma
-- idempotente; este arquivo permite aplicar/auditar a mudança manualmente.
CREATE TABLE IF NOT EXISTS admin_events (
  id BIGSERIAL PRIMARY KEY,
  event_type VARCHAR(24) NOT NULL CHECK (event_type IN ('broadcast', 'kick')),
  target_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  message VARCHAR(240) NOT NULL,
  created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_events_delivery
  ON admin_events (target_user_id, id);
