-- Registra o preço efetivamente pago em compras futuras.
ALTER TABLE user_skins
ADD COLUMN IF NOT EXISTS paid_price INTEGER;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_skins_paid_price_valid'
  ) THEN
    ALTER TABLE user_skins
    ADD CONSTRAINT user_skins_paid_price_valid
    CHECK (paid_price IS NULL OR paid_price BETWEEN 1 AND 10000);
  END IF;
END $$;

-- Auditoria permanente e idempotente. A chave composta impede que qualquer
-- reinício ou novo deploy devolva Core duas vezes para a mesma aquisição.
CREATE TABLE IF NOT EXISTS skin_refunds (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skin_id VARCHAR(100) NOT NULL,
  refund_amount INTEGER NOT NULL CHECK (refund_amount > 0),
  reason VARCHAR(80) NOT NULL DEFAULT 'skin_removed_from_catalog',
  refunded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, skin_id)
);

-- Como as compras antigas não armazenavam paid_price, o reembolso utiliza o
-- preço integral que a skin possuía antes da remoção. Isso nunca prejudica quem
-- adquiriu a skin em uma oferta diária com desconto.
WITH retired_skins(skin_id, full_price) AS (
  VALUES
    ('carbine:convex', 86),
    ('pistol:cryostasis', 180),
    ('shotgun:chronovoid', 230),
    ('shotgun:holo-meridian', 131),
    ('revolver:doombringer', 180),
    ('revolver:protocol-781-a', 239)
),
new_refunds AS (
  INSERT INTO skin_refunds (user_id, skin_id, refund_amount)
  SELECT
    owned.user_id,
    owned.skin_id,
    COALESCE(owned.paid_price, retired.full_price)
  FROM user_skins AS owned
  INNER JOIN retired_skins AS retired ON retired.skin_id = owned.skin_id
  ON CONFLICT (user_id, skin_id) DO NOTHING
  RETURNING user_id, refund_amount
),
refund_totals AS (
  SELECT user_id, SUM(refund_amount)::INTEGER AS amount
  FROM new_refunds
  GROUP BY user_id
)
UPDATE users
SET core_balance = users.core_balance + refund_totals.amount
FROM refund_totals
WHERE users.id = refund_totals.user_id;

-- A FK de equipped_skins usa ON DELETE CASCADE, removendo também qualquer
-- visual aposentado que estivesse equipado.
DELETE FROM user_skins
WHERE skin_id IN (
  'carbine:convex',
  'pistol:cryostasis',
  'shotgun:chronovoid',
  'shotgun:holo-meridian',
  'revolver:doombringer',
  'revolver:protocol-781-a'
);

SELECT
  TRUE AS migration_applied,
  COUNT(*)::INTEGER AS refunded_purchases,
  COALESCE(SUM(refund_amount), 0)::INTEGER AS refunded_core
FROM skin_refunds
WHERE reason = 'skin_removed_from_catalog';
