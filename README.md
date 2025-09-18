# 🚀 Node.js v23 + Fastify + Zod + Prisma — Do Zero ao Avançado

Trilha completa em Node.js v23 com Fastify, Zod e Prisma. Do zero ao avançado: fundamentos, APIs, validações, ORM, autenticação, Docker, Redis, Swagger, WebSockets e métricas. Todo código comentado para aprendizado prático.

## Modulos

- **Modulo 01**: Fundamentos Node.js (HTTP, fs, path, events, rotas e JSON)
- **Modulo 02**: Fastify (rotas, params, query, validação nativa)
- **Modulo 03**: Zod (validação, objetos complexos, errors, integração Fastify)
- **Modulo 04**: Prisma ORM (schema, migrations, seed, CRUD, integração)
- **Modulo 05**: Integração Completa (arquitetura pro, JWT, segurança, paginação)
- **Modulo 06**: Avançado (Docker, Postgres, Redis, Swagger, logs, WS, testes)
- **Modulo 07**: Extras Senior: Swagger a partir do Zod, fila de jobs, ETag/Cache-Control, SSE, métricas Prometheus

Todo código possui comentários explicativos — não há documentação paralela além deste README.

---

## 📁 Estrutura sugerida do repo

```
/fase-1-nodejs
  hello-world.js
  server-basic.js
  fs-example.js
  path-example.js
  events-example.js
  http-json.js
  http-query.js
  http-rotas.js

/fase-2-fastify
  server-basic.js
  routes-example.js
  query-params.js
  schema-basic.js
  schema-query.js
  schema-params.js

/fase-3-zod
  zod-basics.js
  zod-objects-arrays.js
  error-formatting.js
  fastify-zod.js

/fase-4-prisma
  .env
  prisma/
    schema.prisma
  seed/seed.js
  prisma-client-test.js
  api-fastify-prisma.js

/fase-5-api-avancada
  .env
  package.json
  prisma/schema.prisma
  src/
    app.js
    plugins/{env,prisma,security,jwt}.js
    utils/{validators,reply}.js
    routes/{auth,users,posts}.js

/fase-6-avancado
  .env
  Dockerfile
  docker-compose.yml
  package.json
  prisma/schema.prisma
  src/
    app.js
    plugins/{env,prisma,security,jwt,logger,swagger,redis}.js
    utils/{validators,cache}.js
    routes/{auth,users,posts,ws}.js
  tests/app.test.js

/fase-6-avancado-extras
  (pode estar junto à pasta acima)
  src/plugins/swagger-zod.js
  src/plugins/metrics.js
  src/routes/{ping,jobs,sse}.js
  src/utils/httpCache.js
  src/queue/queue.js
  worker.js
```

---

## 🧰 Pré-requisitos

- Node.js v20+ (ideal v23)
- npm (ou pnpm/yarn, ajuste comandos)
- Docker e Docker Compose (para fase 6 com Postgres/Redis)

---

## 🧪 Como rodar CADA FASE rapidamente

### Fase 1 — Node.js puro
```sh
cd fase-1-nodejs
node hello-world.js
node server-basic.js         # http://localhost:3000
node http-json.js            # / e /api
node http-query.js           # /saudacao?nome=Nathan
node http-rotas.js           # /, /sobre, /contato
```

### Fase 2 — Fastify básico
```sh
cd fase-2-fastify
npm init -y && npm i fastify
node server-basic.js
node routes-example.js
node query-params.js
node schema-basic.js
node schema-query.js
node schema-params.js
```

### Fase 3 — Zod
```sh
cd fase-3-zod
npm init -y && npm i fastify zod
node zod-basics.js
node zod-objects-arrays.js
node error-formatting.js
node fastify-zod.js          # Fastify + Zod
```

### Fase 4 — Prisma
```sh
cd fase-4-prisma
npm init -y && npm i prisma @prisma/client fastify zod
npx prisma init
# ajuste .env (SQLite: DATABASE_URL="file:./dev.db")
npx prisma migrate dev --name init

node seed/seed.js
node prisma-client-test.js
node api-fastify-prisma.js
```

### Fase 5 — Integração Completa
```sh
cd fase-5-api-avancada
npm i
npm run prisma:migrate -- --name init_fase5
npm run dev
# Base URL: http://localhost:3000
```

### Fase 6 — Avançado (local ou Docker)

**Local:**
```sh
cd fase-6-avancado
npm i
# Se for usar Postgres local, ajuste DATABASE_URL no .env para host=localhost
npm run prisma:migrate -- --name init_fase6
npm run dev
```

**Docker Compose (recomendado):**
```sh
cd fase-6-avancado
docker compose up --build
# API: http://localhost:3000
# Docs Swagger: http://localhost:3000/docs
# WS: ws://localhost:3000/ws
```

**Testes (Vitest):**
```sh
cd fase-6-avancado
npm run test
```

---

## 🔐 Autenticação (Fase 5/6)
Registrar:
```sh
curl -X POST http://localhost:3000/auth/register   -H "Content-Type: application/json"   -d '{"name":"Nathan","email":"nathan@ex.com","password":"Super1234"}'
```

Login:
```sh
curl -X POST http://localhost:3000/auth/login   -H "Content-Type: application/json"   -d '{"email":"nathan@ex.com","password":"Super1234"}'
# ⇒ { "token": "..." }
```

Perfil (protegido):
```sh
TOKEN="coloque_o_token_aqui"
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/auth/me
```

---

## 📰 Posts (CRUD + paginação + cache + ETag)
Criar (protegido):
```sh
curl -X POST http://localhost:3000/posts   -H "Content-Type: application/json"   -H "Authorization: Bearer $TOKEN"   -d '{"title":"Meu Post","content":"Hello"}'
```

Listar (público) com paginação/filtro:
```sh
curl "http://localhost:3000/posts?published=true&page=1&perPage=5&sortBy=createdAt&sortDir=desc"
```

ETag/Cache-Control (Fase 6 extras):
```sh
curl -i "http://localhost:3000/posts?published=true&page=1&perPage=5"   -H 'If-None-Match: W/"<seu-hash>"'
# ⇒ 304 Not Modified
```

Publicar (protegido) — dispara WS/SSE:
```sh
curl -X PATCH http://localhost:3000/posts/<ID>/publish   -H "Authorization: Bearer $TOKEN"
```

---

## 🔊 WebSocket & 🔁 SSE

**WebSocket (Fase 6)**
```js
const sock = new WebSocket("ws://localhost:3000/ws");
sock.onmessage = (ev) => console.log("WS:", ev.data);
```

**SSE (Fase 6 extras)**
```js
const es = new EventSource("http://localhost:3000/sse");
es.addEventListener("post_published", (ev) => console.log("SSE:", ev.data));
```

---

## 📘 Swagger / OpenAPI

- **Fase 6 (padrão):** `/docs` (schemas por JSON Schema)
- **Extras (Zod-first):** registre `swagger-zod.js` e use schema com `z.object()` nas rotas — a UI continuará em `/docs`.

---

## 📦 Fila de Jobs (Redis) — Envio de e-mail fake

Enfileirar um job:
```sh
curl -X POST http://localhost:3000/jobs/email   -H "Content-Type: application/json"   -d '{"to":"cliente@ex.com","subject":"Bem-vindo!","body":"Olá!"}'
# ⇒ { "enqueued": true }
```

Iniciar o worker:
```sh
cd fase-6-avancado
node worker.js
```

---

## 📈 Métricas Prometheus

- Endpoint: `GET /metrics`
- Métricas default + histograma de latência HTTP (`http_request_duration_ms`).

---

## 🛡️ Segurança (Fase 5/6)

- Helmet
- CORS (ajuste `CORS_ORIGIN` no .env)
- Rate-limit
- JWT (guard `preHandler: [fastify.auth]`)

---

## 🧱 Banco de Dados

- **Fase 4/5:** SQLite (simples para estudo)
- **Fase 6:** Postgres via Docker Compose (padrão)

Abrir o Prisma Studio:
```sh
npx prisma studio
```

---

## 🪵 Logs (Pino)

- Log estruturado com requestId e métricas de duração por requisição.
- Em dev, habilita pino-pretty (se desejar).

---

## 🧯 Troubleshooting rápido

- **ECONNREFUSED** no Postgres: suba com Docker (`docker compose up`) ou ajuste `DATABASE_URL`.
- **PrismaClientInitializationError**: cheque `DATABASE_URL` e rode `npx prisma migrate dev`.
- **Unauthorized**: verifique header `Authorization: Bearer <token>`.
- **Swagger vazio**: confirme registro do plugin `/docs` e schema nas rotas.
- **ETag 304 não retorna**: envie `If-None-Match` exatamente igual ao header `ETag` anterior.
- **Redis indisponível**: verifique `REDIS_URL` e container `cache` no Compose.

---

## ✅ Roadmap entregue

- Node.js base + HTTP
- Fastify básico + validação nativa
- Zod (validações, erros, integração)
- Prisma (schema/migrate/seed/CRUD)
- Integração pro: arquitetura, JWT, segurança, paginação
- Avançado: Docker, Postgres, Redis, Swagger, logs, WS, testes
- Extras sênior: Zod-first → OpenAPI, fila Redis, ETag/Cache-Control, SSE, métricas
