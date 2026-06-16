-- =============================================================
--  FiadoApp V2 — Dados de Teste (Seed)
--  Flyway Migration: V2__seed_test_data.sql
--  FATEC Cotia – DSM 2º Semestre 2026
-- =============================================================
-- Senha de todos os usuários de teste: "senha123"
-- Hash BCrypt correspondente:
-- $2a$12$K8Y0zFpLmVq0RGnY6qMx6.mFw7n9A0.VN3mG7dI.lHzJ4kT5bXrO6

-- ── Usuários ──────────────────────────────────────────────────
INSERT INTO usuarios (nome, email, senha, tipo, limite_credito_padrao) VALUES
    ('Admin Teste',   'admin@fiadoapp.com',    '$2a$12$K8Y0zFpLmVq0RGnY6qMx6.mFw7n9A0.VN3mG7dI.lHzJ4kT5bXrO6', 'ADMIN', 500.00),
    ('Rações Cardoso','racoes@cardoso.com',    '$2a$12$K8Y0zFpLmVq0RGnY6qMx6.mFw7n9A0.VN3mG7dI.lHzJ4kT5bXrO6', 'USER',  300.00),
    ('Mercearia Silva','silva@merceria.com',   '$2a$12$K8Y0zFpLmVq0RGnY6qMx6.mFw7n9A0.VN3mG7dI.lHzJ4kT5bXrO6', 'USER',  200.00);

-- ── Clientes do usuário 2 (Rações Cardoso) ───────────────────
INSERT INTO clientes (usuario_id, nome, sobrenome, referencia, telefone, limite_credito) VALUES
    (2, 'João',    'Silva',     'Vizinho da esquina', '(11) 99999-1111', 150.00),
    (2, 'Maria',   'Souza',     'Filha da padaria',   '(11) 98888-2222', 200.00),
    (2, 'Carlos',  'Oliveira',  NULL,                 '(11) 97777-3333', 100.00),
    (2, 'Ana',     'Lima',      'Funcionária',        NULL,              300.00),
    (2, 'Pedro',   'Costa',     'Bar do Pedro',       '(11) 96666-4444', 500.00);

-- ── Clientes do usuário 3 (Mercearia Silva) ──────────────────
INSERT INTO clientes (usuario_id, nome, sobrenome, referencia, telefone) VALUES
    (3, 'Lucas',   'Pereira',   'Apartamento 12',     '(11) 95555-5555'),
    (3, 'Fernanda','Santos',    NULL,                 '(11) 94444-6666');

-- ── Vendas ativas do usuário 2 ────────────────────────────────
INSERT INTO vendas (usuario_id, cliente_id, data_compra, data_vencimento, valor_total, status, observacao) VALUES
    (2, 1, '2026-03-10', '2026-04-10', 87.50,  'ATIVA', 'Entregue em casa'),
    (2, 2, '2026-03-15', '2026-04-15', 45.00,  'ATIVA', NULL),
    (2, 3, '2026-03-20', '2026-04-20', 120.00, 'ATIVA', 'Combinou pagar na sexta'),
    (2, 4, '2026-04-01', '2026-05-01', 33.60,  'ATIVA', NULL),
    (2, 5, '2026-04-05', '2026-05-05', 210.00, 'ATIVA', 'Cliente preferencial');

-- ── Vendas pagas do usuário 2 ─────────────────────────────────
INSERT INTO vendas (usuario_id, cliente_id, data_compra, data_vencimento, valor_total, status, quitado_em) VALUES
    (2, 1, '2026-01-15', '2026-02-15', 55.00, 'PAGA', '2026-02-10 14:30:00'),
    (2, 2, '2026-02-01', '2026-03-01', 98.00, 'PAGA', '2026-02-28 10:00:00');

-- ── Itens das vendas ativas ───────────────────────────────────
INSERT INTO itens_venda (venda_id, descricao, quantidade, valor_unitario, valor_total) VALUES
    -- Venda 1 (João - R$ 87,50)
    (1, 'Ração Premium 15kg',  1, 75.00, 75.00),
    (1, 'Petisco Ossinho',     5,  2.50, 12.50),
    -- Venda 2 (Maria - R$ 45,00)
    (2, 'Ração Filhote 3kg',   3, 15.00, 45.00),
    -- Venda 3 (Carlos - R$ 120,00)
    (3, 'Ração Premium 15kg',  1, 75.00,  75.00),
    (3, 'Antipulgas Coleira',  1, 32.00,  32.00),
    (3, 'Shampoo Pet',         1, 13.00,  13.00),
    -- Venda 4 (Ana - R$ 33,60)
    (4, 'Ração Gato 1kg',      4,  8.40,  33.60),
    -- Venda 5 (Pedro - R$ 210,00)
    (5, 'Ração Super Premium 15kg', 2, 95.00, 190.00),
    (5, 'Vitamina Canis Plus',      2, 10.00,  20.00),
    -- Venda 6 (João paga - R$ 55,00)
    (6, 'Ração Premium 15kg',  1, 55.00, 55.00),
    -- Venda 7 (Maria paga - R$ 98,00)
    (7, 'Ração Filhote 3kg',   2, 15.00, 30.00),
    (7, 'Brinquedo Mordedor',  2, 18.00, 36.00),
    (7, 'Ração Gato 1kg',      4,  8.00, 32.00);
