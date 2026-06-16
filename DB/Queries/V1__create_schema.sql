-- =============================================================
--  FiadoApp V2 — PostgreSQL Schema
--  Flyway Migration: V1__create_schema.sql
--  Disciplina: Banco de Dados Relacional (IBD015)
--  FATEC Cotia – DSM 2º Semestre 2026
-- =============================================================

-- ── Tabela: usuarios ──────────────────────────────────────────
CREATE TABLE usuarios (
    id                        BIGSERIAL       PRIMARY KEY,
    nome                      VARCHAR(100)    NOT NULL,
    email                     VARCHAR(150)    NOT NULL UNIQUE,
    senha                     VARCHAR(255)    NOT NULL,           -- BCrypt hash
    tipo                      VARCHAR(10)     NOT NULL DEFAULT 'USER'
                                              CHECK (tipo IN ('USER','ADMIN')),
    limite_credito_padrao     DECIMAL(10,2)   DEFAULT NULL,
    criado_em                 TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- ── Tabela: clientes ──────────────────────────────────────────
CREATE TABLE clientes (
    id              BIGSERIAL       PRIMARY KEY,
    usuario_id      BIGINT          NOT NULL
                    REFERENCES usuarios(id) ON DELETE CASCADE,
    nome            VARCHAR(100)    NOT NULL,
    sobrenome       VARCHAR(100),
    referencia      VARCHAR(100),
    telefone        VARCHAR(20),
    limite_credito  DECIMAL(10,2)   DEFAULT NULL,
    criado_em       TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_clientes_usuario ON clientes(usuario_id);
CREATE INDEX idx_clientes_nome    ON clientes(usuario_id, nome);

-- ── Enum: status_venda ────────────────────────────────────────
CREATE TYPE status_venda AS ENUM ('ATIVA', 'PAGA');

-- ── Tabela: vendas ────────────────────────────────────────────
CREATE TABLE vendas (
    id               BIGSERIAL       PRIMARY KEY,
    usuario_id       BIGINT          NOT NULL
                     REFERENCES usuarios(id) ON DELETE CASCADE,
    cliente_id       BIGINT          NOT NULL
                     REFERENCES clientes(id) ON DELETE CASCADE,
    data_compra      DATE            NOT NULL DEFAULT CURRENT_DATE,
    data_vencimento  DATE,
    valor_total      DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    status           status_venda    NOT NULL DEFAULT 'ATIVA',
    observacao       TEXT,
    quitado_em       TIMESTAMP,
    criado_em        TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vendas_usuario ON vendas(usuario_id);
CREATE INDEX idx_vendas_cliente ON vendas(cliente_id);
CREATE INDEX idx_vendas_status  ON vendas(usuario_id, status);

-- ── Tabela: itens_venda ───────────────────────────────────────
CREATE TABLE itens_venda (
    id              BIGSERIAL       PRIMARY KEY,
    venda_id        BIGINT          NOT NULL
                    REFERENCES vendas(id) ON DELETE CASCADE,
    descricao       VARCHAR(200)    NOT NULL,
    quantidade      INTEGER         NOT NULL DEFAULT 1 CHECK (quantidade > 0),
    valor_unitario  DECIMAL(10,2)   NOT NULL CHECK (valor_unitario >= 0),
    valor_total     DECIMAL(10,2)   NOT NULL CHECK (valor_total >= 0)
);

CREATE INDEX idx_itens_venda ON itens_venda(venda_id);

CREATE TABLE IF NOT EXISTS pagamentos (
    id               SERIAL PRIMARY KEY,
    venda_id         INTEGER NOT NULL REFERENCES vendas(id) ON DELETE CASCADE,
    usuario_id       INTEGER NOT NULL REFERENCES usuarios(id),
    valor_pago       NUMERIC(10, 2) NOT NULL,
    data_pagamento   TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pagamentos_venda  ON pagamentos(venda_id);
