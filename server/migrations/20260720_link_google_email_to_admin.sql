-- Migração de dados solicitada para consolidar a identidade Google na
-- conta administrativa existente. A remoção só ocorre quando o Admin existe,
-- evitando apagar a conta Google em uma instalação ainda não configurada.
DELETE FROM users
WHERE LOWER(email) = LOWER('arthurdealmeida124@gmail.com')
  AND LOWER(username) <> 'admin'
  AND EXISTS (SELECT 1 FROM users WHERE LOWER(username) = 'admin');

UPDATE users
SET email = LOWER('arthurdealmeida124@gmail.com')
WHERE LOWER(username) = 'admin'
  AND (email IS NULL OR LOWER(email) = LOWER('arthurdealmeida124@gmail.com'));

SELECT EXISTS (
  SELECT 1
  FROM users
  WHERE LOWER(username) = 'admin'
    AND LOWER(email) = LOWER('arthurdealmeida124@gmail.com')
) AS migration_applied;
