Orquestrador BMAD

O Orquestrador BMAD é uma plataforma de multiagentes desenvolvida em NestJS com TypeScript, projetada para auxiliar Gerentes de Projetos a produzir backlogs de melhor qualidade.
O sistema funciona como um orquestrador central, enviando tarefas para agentes microserviços especializados.

                   ┌─────────────────┐
                   │  Gerente de     │
                   │  Projetos       │
                   └────────┬────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │ Orquestrador    │
                   │ (NestJS/TS)     │
                   └────────┬────────┘
                            │
       ┌────────────────────┼─────────────────────┐
       ▼                    ▼                     ▼
┌─────────────┐      ┌─────────────┐       ┌─────────────┐
│ Agent_Front │      │ Agent_UX    │       │ Agent_DB    │
└─────────────┘      └─────────────┘       └─────────────┘
       │                    │                     │
       ▼                    ▼                     ▼
┌─────────────┐      ┌─────────────┐       ┌─────────────┐
│ Agent_Tests │      │ Agent_Back  │       │ Agent_DevOps│
└─────────────┘      └─────────────┘       └─────────────┘


Gerente de Projetos envia tarefas para o Orquestrador.

Orquestrador distribui tarefas para os agentes microserviços.

Cada agente processa suas responsabilidades e retorna dados de insights para o Orquestrador.

O Orquestrador consolida os resultados e gera recomendações para o backlog.

Tecnologias Utilizadas

NestJS – Backend modular e escalável.

TypeScript – Tipagem forte e desenvolvimento seguro.

MongoDB – Armazenamento de dados e resultados dos agentes.

JWT – Autenticação e segurança.

Microserviços – Cada agente roda como serviço independente.

Estrutura do Projeto

bmad-orchestrator/
├─ agents/ # Microserviços de cada agente
├─ auth/ # Autenticação e autorização
├─ config/ # Configurações gerais e leitura de envs
├─ constants/ # Constantes globais
├─ conversation/ # Fluxo de conversa entre orquestrador e agentes
├─ interface/ # Tipos e interfaces compartilhadas
├─ jwt/ # Serviços de JWT
├─ orquestrador/ # Lógica central de orquestração
├─ user/ # Gestão de usuários e perfis
├─ .env
├─ package.json
└─ README.md

Variáveis de Ambiente

# Segurança

JWT_SECRET=seu_secret_aqui
SECURE=true

# Conexão com o banco de dados

MONGO_URI=mongodb://usuario:senha@host:porta/banco

# Ativação de agentes (url)

AGENT_FRONTEND=http://localhost:
AGENT_UX=http://localhost:
AGENT_DATABASE=http://localhost:
AGENT_TESTES=http://localhost:
AGENT_BACKEND=http://localhost:
AGENT_DEVOPS=http://localhost:

Instalação

# Clonar o repositório

git clone https://github.com/seuusuario/bmad-orchestrator.git
cd bmad-orchestrator

# Instalar dependências

npm install

# Rodar o orquestrador em modo desenvolvimento

npm run start:dev

Uso

Configure o arquivo .env com suas variáveis de ambiente.

Inicie o servidor do orquestrador.

Inicie cada microserviço de agente.

O orquestrador enviará tarefas aos agentes e consolidará os resultados para gerar insights de backlog.
