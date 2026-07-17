/*
  README inicial para FotoEduc
*/

# FotoEduc Enterprise

Projeto inicial gerado e configurado com Next.js + TypeScript + Tailwind + Prisma.

Como rodar (desenvolvimento):

1. Copie .env.example para .env e ajuste DATABASE_URL e outras variáveis.
2. Rode docker-compose up -d para iniciar Postgres e Redis (opcional).
3. Instale dependências: npm install
4. Gere client Prisma: npm run db:generate
5. Rode migrações: npm run db:migrate
6. Inicie em dev: npm run dev

API de health: GET /api/health

Próximos passos:
- adicionar Dockerfile para a app
- configurar ESLint/Prettier
- implementar auth (signup/login)
- criar seed do banco
