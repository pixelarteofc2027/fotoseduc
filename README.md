# FOTOEDUC ENTERPRISE

PACOTE 01 — FUNDAÇÃO DO SISTEMA 🚀

Este é o início do projeto.

Crie uma pasta:

fotoeduc-enterprise

Dentro dela ficará:

fotoeduc-enterprise
│
├── frontend
├── backend
├── database
├── storage
├── docker
├── docs
├── package.json
├── docker-compose.yml
├── .env.example
└── README.md

1) package.json

Arquivo:

package.json

Código:

```json
{
  "name": "fotoeduc-enterprise",
  "version": "1.0.0",
  "description": "Plataforma SaaS de venda e entrega de fotos",
  "private": true,

  "scripts": {
    "dev": "npm run dev --workspace frontend",
    "api": "npm run dev --workspace backend",
    "build": "npm run build --workspaces",
    "database": "npm run prisma --workspace database"
  },

  "workspaces": [
    "frontend",
    "backend",
    "database"
  ],

  "author": "FotoEduc",
  "license": "MIT"
}
```

2) Docker do sistema

Arquivo:

docker-compose.yml

Código:

```yaml
version: "3.9"

services:


 postgres:

  image: postgres:16

  container_name: fotoeduc-postgres

  restart: always

  environment:

   POSTGRES_USER: fotoeduc

   POSTGRES_PASSWORD: fotoeducsenha

   POSTGRES_DB: fotoeduc


  ports:

   - "5432:5432"


  volumes:

   - postgres_data:/var/lib/postgresql/data



 redis:

  image: redis:7

  container_name: fotoeduc-redis

  restart: always


  ports:

   - "6379:6379"



 minio:

  image: minio/minio


  container_name: fotoeduc-storage


  command: server /data --console-address ":9001"


  environment:

   MINIO_ROOT_USER: fotoeduc

   MINIO_ROOT_PASSWORD: fotoeducsenha


  ports:

   - "9000:9000"

   - "9001:9001"


  volumes:

   - minio_data:/data




volumes:


 postgres_data:


 minio_data:
```

3) Variáveis do sistema

Arquivo:

.env.example

Código:

```
# DATABASE

DATABASE_URL=
 
 
# REDIS

REDIS_URL=redis://localhost:6379



# JWT

JWT_SECRET=FOTOEDUC_SECRET_2026


JWT_EXPIRE=7d



# STORAGE

STORAGE_ENDPOINT=http://localhost:9000

STORAGE_ACCESS=fotoeduc

STORAGE_SECRET=fotoeducsenha


# EMAIL

SMTP_HOST=

SMTP_PORT=

SMTP_USER=

SMTP_PASSWORD=



# PAGAMENTO

MERCADO_PAGO_TOKEN=

ASAAS_TOKEN=

STRIPE_KEY=



# IA

AWS_ACCESS_KEY=

AWS_SECRET_KEY=

GOOGLE_AI_KEY=



# APP

APP_NAME=FotoEduc

APP_URL=http://localhost:3000
```

4) README.md

Arquivo:

README.md

Código:

```markdown
# FOTOEDUC ENTERPRISE


Plataforma profissional para fotógrafos venderem fotos online.


## Recursos


- Multiempresa
- White Label
- Galerias
- Venda de fotos
- Reconhecimento facial
- IA
- Pagamentos
- Marca d'água
- Área do cliente
- Painel fotógrafo
- Painel administrador



## Tecnologias


Frontend:

- Next.js
- React
- TypeScript
- Tailwind


Backend:

- Node.js
- NestJS


Banco:

- PostgreSQL
- Prisma


Storage:

- MinIO
- AWS S3


Cache:

- Redis



## Instalação


Clonar:


git clone projeto


Instalar:


npm install


Subir servidores:


docker compose up -d


Executar:


npm run dev
```

5) Criar pastas

Execute:

mkdir frontend backend database storage docker docs

6) Iniciar serviços

Execute:

docker compose up -d

Verificar:

docker ps

Deve aparecer:

fotoeduc-postgres
fotoeduc-redis
fotoeduc-storage
PACOTE 01 FINALIZADO ✅

Agora o projeto já possui:

✅ Banco PostgreSQL
✅ Redis para velocidade
✅ Storage próprio para fotos
✅ Estrutura SaaS
✅ Base para milhares de fotógrafos
✅ Ambiente pronto para desenvolvimento

Próximo:
PACOTE 02 — SISTEMA DE USUÁRIOS 🔐

Será criado:

Cadastro
Login
JWT
Refresh Token
Senha criptografada
Recuperação de senha
Níveis:
SUPER ADMIN

ADMIN

FOTÓGRAFO

CLIENTE

FUNCIONÁRIO
Controle de permissões
Segurança inicial do sistema.
```
