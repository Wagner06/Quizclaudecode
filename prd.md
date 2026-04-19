# PRD — Marvel Champions Quiz

**Versão:** 1.0  
**Data:** 2026-04-19  
**Status:** Em especificação

---

## 1. Visão do Produto

Um quiz web interativo sobre o jogo de cartas **Marvel Champions: The Card Game**, com perguntas no formato **Verdadeiro ou Falso**, cobrindo todos os níveis de habilidade — do iniciante ao avançado. O produto visa engajar a comunidade brasileira de jogadores, testar e aprofundar o conhecimento sobre regras, heróis, vilões e expansões.

---

## 2. Objetivos de Negócio

- Criar uma ferramenta educativa e divertida para jogadores de Marvel Champions.
- Cobrir regras básicas, heróis, vilões, mecânicas avançadas e expansões de campanha.
- Proporcionar replayability com modo infinito e ranking persistente entre sessões.
- Ser visualmente fiel à identidade visual do jogo original (Marvel Champions Card Game).

---

## 3. Público-Alvo

| Perfil | Descrição |
|---|---|
| Iniciante | Novo no jogo, aprendendo regras básicas |
| Intermediário | Conhece as regras, explorando heróis e expansões |
| Avançado | Jogador experiente, domina mecânicas complexas e edge cases |

---

## 4. Funcionalidades (Escopo)

### 4.1 Core — Quiz

- **Formato de pergunta:** Verdadeiro ou Falso (V/F)
- **Modo de jogo:** Infinito — perguntas aleatórias sem fim, até o jogador encerrar a sessão
- **Seleção de dificuldade:** O jogador escolhe ao iniciar: `Iniciante`, `Intermediário`, `Avançado` ou `Aleatório (todos os níveis)`
- **Feedback imediato por pergunta:**
  - Se **correto**: confirmação visual positiva e próxima pergunta
  - Se **incorreto**: destaque na resposta correta + explicação didática sobre a regra/fato
- **Pontuação (Score):**
  - Exibida durante o jogo (acertos/perguntas respondidas)
  - Resumo completo ao encerrar a sessão: total de acertos, sequência máxima (streak), percentual de acertos

### 4.2 Ranking

- **Ranking global** armazenado no backend (persistido entre sessões e usuários diferentes)
- **Ranking local** (localStorage) como fallback e histórico pessoal
- Ao encerrar a partida, o jogador pode **salvar sua pontuação com um nickname**
- Exibição do top 10 ranking por dificuldade selecionada

### 4.3 Categorias de Perguntas

| Categoria | Descrição |
|---|---|
| Regras Básicas | Fases do turno (heróis e vilão), setup, conceitos fundamentais |
| Heróis & Alter Egos | Habilidades únicas, forma herói vs. alter ego, cartas de assinatura |
| Vilões & Cenários | Esquemas, encontros, ameaça, poderes de vilão, missões |
| Mecânicas Avançadas | Keywords (toughness, overkill, quickstrike etc.), status, edge cases de regras |
| Expansões de Campanha | Regras específicas de cada campanha/expansão (The Rise of Red Skull, Galaxy's Most Wanted, Mad Titan's Shadow etc.) |

### 4.4 Gerenciamento de Perguntas (Admin — MVP simplificado)

- Perguntas armazenadas no backend em banco de dados
- Seed inicial: mínimo 100 perguntas distribuídas por categoria e dificuldade
- Estrutura extensível para adicionar novas perguntas facilmente via JSON seed

---

## 5. Design & Identidade Visual

### 5.1 Tema

Fiel à identidade visual do **Marvel Champions Card Game**:

- **Paleta de cores:** Vermelho (#D0021B), dourado/amarelo (#F5A623), azul escuro (#1A237E), preto (#0A0A0A), branco (#FFFFFF)
- **Tipografia:** Fontes bold e de impacto similares às do jogo — sugestão: `Bebas Neue` + `Nunito` para corpo
- **Backgrounds:** Textura escura com efeito cósmico/nebulosa, similar ao artwork das cartas
- **Ícones e tokens:** Botões de resposta (Verdadeiro / Falso) estilizados como os **tokens físicos da caixa base** do jogo (formato circular com símbolo de herói e vilão respectivamente)
- **Animações:** Transições suaves, efeito de "virar carta" ao revelar resposta

### 5.2 Responsividade

- Mobile-first
- Compatível com desktop, tablet e mobile
- Breakpoints: 320px, 768px, 1024px+

---

## 6. Fluxo do Usuário

```
[Tela Inicial]
  → Escolher dificuldade (Iniciante / Intermediário / Avançado / Aleatório)
  → [Opcional] Escolher categoria específica ou "Todas"
  → Iniciar Quiz

[Loop de Perguntas — Modo Infinito]
  → Exibe pergunta + botões V/F (estilo tokens)
  → Usuário responde
    → CORRETO: feedback verde + próxima pergunta + score++
    → ERRADO: feedback vermelho + resposta correta destacada + explicação + próxima pergunta
  → Botão "Encerrar sessão" disponível a qualquer momento

[Tela de Resultado]
  → Total de perguntas respondidas
  → Total de acertos e percentual
  → Sequência máxima (streak)
  → Campo para inserir nickname + botão "Salvar no Ranking"
  → Ver Ranking
  → Jogar novamente

[Tela de Ranking]
  → Top 10 por dificuldade (abas ou filtro)
  → Posição do jogador atual destacada
  → Botão voltar ao início
```

---

## 7. Arquitetura Técnica

### 7.1 Frontend

| Item | Tecnologia |
|---|---|
| Framework | React 18+ |
| Build tool | Vite |
| Linguagem | TypeScript |
| Estilização | Tailwind CSS + CSS Modules para componentes específicos |
| Gerenciamento de estado | React Context + useReducer (sem biblioteca externa) |
| Roteamento | React Router v6 |
| HTTP Client | fetch nativo / Axios |
| Armazenamento local | localStorage (ranking pessoal + cache) |

### 7.2 Backend

| Item | Tecnologia |
|---|---|
| Runtime | Node.js 20+ |
| Framework | Express.js |
| Banco de dados | SQLite (via `better-sqlite3`) |
| ORM/Query builder | Drizzle ORM |
| Validação | Zod |
| CORS | cors middleware |

> **Justificativa:** SQLite elimina a necessidade de um servidor de banco de dados separado, tornando o deploy simples (arquivo único). Ideal para o volume de dados esperado.

### 7.3 Estrutura de Dados

#### Tabela `questions`

```sql
CREATE TABLE questions (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  statement   TEXT NOT NULL,           -- A afirmação (ex: "O herói pode atacar duas vezes no mesmo turno")
  answer      BOOLEAN NOT NULL,        -- true = VERDADEIRO, false = FALSO
  explanation TEXT NOT NULL,           -- Explicação didática da resposta
  category    TEXT NOT NULL,           -- 'basic' | 'heroes' | 'villains' | 'advanced' | 'campaign'
  difficulty  TEXT NOT NULL,           -- 'beginner' | 'intermediate' | 'advanced'
  expansion   TEXT,                    -- Nome da expansão (nullable, para perguntas de campanha)
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Tabela `scores`

```sql
CREATE TABLE scores (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  nickname     TEXT NOT NULL,
  score        INTEGER NOT NULL,       -- Total de acertos
  total        INTEGER NOT NULL,       -- Total de perguntas respondidas
  streak       INTEGER NOT NULL,       -- Maior sequência de acertos
  difficulty   TEXT NOT NULL,          -- Dificuldade selecionada
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 7.4 API Endpoints

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/questions` | Retorna perguntas com filtros opcionais |
| `GET` | `/api/questions?difficulty=beginner&category=basic&limit=1` | Retorna 1 pergunta aleatória com filtros |
| `GET` | `/api/ranking?difficulty=all` | Retorna top 10 ranking (por dificuldade) |
| `POST` | `/api/scores` | Salva pontuação de uma sessão |
| `GET` | `/api/health` | Health check |

**Query params para `/api/questions`:**

| Param | Valores | Default |
|---|---|---|
| `difficulty` | `beginner`, `intermediate`, `advanced`, `all` | `all` |
| `category` | `basic`, `heroes`, `villains`, `advanced`, `campaign`, `all` | `all` |
| `limit` | número | `1` |
| `exclude` | IDs separados por vírgula | — |

### 7.5 Estrutura de Diretórios

```
quiz-marvel-champions/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TokenButton/        # Botão estilo token do jogo
│   │   │   ├── QuestionCard/       # Card da pergunta
│   │   │   ├── FeedbackOverlay/    # Overlay de correto/errado
│   │   │   ├── ScoreBar/           # Barra de pontuação
│   │   │   └── RankingTable/       # Tabela de ranking
│   │   ├── pages/
│   │   │   ├── Home/               # Seleção de dificuldade
│   │   │   ├── Quiz/               # Tela principal do quiz
│   │   │   ├── Result/             # Resultado da sessão
│   │   │   └── Ranking/            # Ranking global
│   │   ├── context/
│   │   │   └── QuizContext.tsx
│   │   ├── hooks/
│   │   │   ├── useQuiz.ts
│   │   │   └── useLocalRanking.ts
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── assets/
│   │       └── fonts/, images/
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── questions.ts
│   │   │   └── scores.ts
│   │   ├── db/
│   │   │   ├── schema.ts           # Drizzle schema
│   │   │   ├── migrations/
│   │   │   └── seed.ts             # Seed com perguntas iniciais
│   │   ├── middleware/
│   │   │   └── validate.ts
│   │   └── index.ts                # Entry point Express
│   ├── data/
│   │   └── quiz.db                 # SQLite file
│   └── package.json
│
└── README.md
```

---

## 8. Banco de Perguntas — Seed Mínimo

O seed inicial deve conter **no mínimo 100 perguntas**, distribuídas conforme:

| Dificuldade | Qtd mínima |
|---|---|
| Iniciante | 40 |
| Intermediário | 35 |
| Avançado | 25 |

| Categoria | Qtd mínima |
|---|---|
| Regras Básicas | 25 |
| Heróis & Alter Egos | 25 |
| Vilões & Cenários | 20 |
| Mecânicas Avançadas | 15 |
| Expansões de Campanha | 15 |

**Exemplos de perguntas:**

```json
[
  {
    "statement": "Durante a fase do vilão, o vilão sempre ataca o herói antes de avançar o esquema.",
    "answer": false,
    "explanation": "Na fase do vilão, primeiro o esquema avança (ameaça é adicionada ao esquema principal), e somente depois ocorre o ataque do vilão ao herói — e apenas se o herói estiver em forma Herói, não Alter Ego.",
    "category": "basic",
    "difficulty": "beginner"
  },
  {
    "statement": "O keyword 'Toughness' faz com que a carta receba um status 'Tough' ao entrar em jogo, absorvendo o próximo dano recebido.",
    "answer": true,
    "explanation": "Cartas com Toughness entram em jogo com um token Tough. O primeiro dano ou efeito prejudicial que a carta sofreria é cancelado e o token Tough é removido.",
    "category": "advanced",
    "difficulty": "advanced"
  }
]
```

---

## 9. Critérios de Aceitação (MVP)

- [ ] Usuário consegue iniciar um quiz selecionando dificuldade
- [ ] Perguntas são exibidas aleatoriamente sem repetição dentro da sessão
- [ ] Feedback imediato: correto (verde) ou errado (vermelho + resposta + explicação)
- [ ] Pontuação é atualizada em tempo real durante o jogo
- [ ] Ao encerrar, tela de resultado exibe score, total e streak máximo
- [ ] Usuário pode salvar score com nickname no ranking global
- [ ] Ranking exibe top 10 com filtro por dificuldade
- [ ] Interface visualmente fiel ao tema Marvel Champions (cores, fontes, tokens)
- [ ] Totalmente responsivo (mobile e desktop)
- [ ] Backend salva e retorna scores corretamente
- [ ] Mínimo de 100 perguntas no seed

---

## 10. Fora de Escopo (MVP)

- Autenticação de usuários / contas
- Upload de imagens de cartas
- Modo multiplayer
- Integração com APIs externas de Marvel Champions
- Sistema de conquistas/badges
- Editor de perguntas via interface admin
- Internacionalização (i18n)

---

## 11. Considerações de Deploy

- **Frontend:** Vercel ou Netlify (build estático do Vite)
- **Backend:** Railway, Render ou VPS simples (Node.js + arquivo SQLite)
- **Variáveis de ambiente:**
  - `FRONTEND_URL` — URL do frontend (para CORS)
  - `PORT` — porta do servidor backend
  - `DATABASE_PATH` — caminho do arquivo SQLite

---

## 12. Referências Visuais

- Jogo base: **Marvel Champions: The Card Game** (Fantasy Flight Games)
- Tokens de referência: tokens circulares de ameaça, aceleração, herói e vilão da caixa base
- Paleta oficial do jogo e fontes das cartas como guia de design
