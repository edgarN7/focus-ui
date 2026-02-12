# Focus UI | Inventory Management System

> **Fromtheos Digital Studio** — *Digital Soul Tailoring*
> **Janderson Angelo** - *Back-end Developer*
>
> Um sistema de gestão de estoque focado em **Alta Fidelidade de Interface**, **Segurança (RBAC)** e **Performance Extrema (INP Otimizado)**.

---

## 🏗️ A Arquitetura (The Stack 2026)

Este projeto utiliza o que há de mais moderno no ecossistema React para garantir escalabilidade e zero-runtime overhead.

-   **Core:** React v19.2+ (Prepared for Server Components & Actions).
-   **Build Tool:** Vite v7.3+ (ESM First).
-   **UI Engine:** Material UI v7 (MUI Core).
-   **Styling:** **Pigment CSS** (Zero-Runtime CSS-in-JS). Extrai estilos no build time para performance máxima.
-   **Forms:** React Hook Form + Zod (Validação robusta e tipada).
-   **Language:** TypeScript 5.x (Strict Mode).

---

## 📂 Estrutura de Diretórios (Domain-Driven)

Adotamos uma separação clara entre componentes genéricos ("Lego") e componentes de negócio ("Alma").

```text
src/
├── components/
│   ├── common/        # UI Kit agnóstico (Button, Input, Modal)
│   └── domain/        # Componentes de Negócio (ProductCard, UserBadge)
├── context/           # Estado Global e Lógica de RBAC (AuthContext)
├── layouts/           # Estruturas de Página (AuthLayout vs MainLayout)
├── lib/               # Configurações de Infra (Axios, QueryClient)
├── pages/             # As Views da aplicação (Login, Dashboard)
├── theme/             # Design System (MUI v7 + Pigment Variables)
└── utils/             # Utilitários e Mocks de Infraestrutura
```

## 🚀 Como Rodar o Projeto
**Pré-requisitos**
* Node.js v20+ (Recomendado v22 LTS).
* Gerenciador de pacotes NPM.

**Instalação**
1. Clone o repositório.
2. Instale as dependências (o projeto usa um .npmrc para gerenciar peer dependencies legadas):

```text
Bash
npm install
```

3. Inicie o servidor de desenvolvimento:

```text
Bash
npm run dev
```

*Nota: Se houver problemas de cache, use npm run dev -- --force.*

---

## ⚠️ Notas Críticas de Engenharia (Architecture Decision Records)

Devido à adoção antecipada do **Vite v7** em conjunto com o **Pigment CSS** no ambiente Windows, implementamos soluções de contorno para garantir a estabilidade do Hot Module Replacement (HMR).

### 1. O Mock `noop.js` (`src/utils/noop.js`)

O plugin *Zero-Runtime* do Pigment CSS pode entrar em conflito com o injetor de HMR do React no Windows.

**Solução:** Criamos um arquivo `noop.js` que simula a API do React Refresh.

* **Função:** Intercepta chamadas para módulos virtuais (`/@react-refresh`) que falhariam no sistema de arquivos.
* **Importante:** Não remova este arquivo ou a configuração de `alias` no `vite.config.ts`, ou o build quebrará.

### 2. Otimização de Dependências (`vite.config.ts`)

Forçamos a pré-otimização de bibliotecas legadas (CommonJS) para ESM:

* `@mui/material` e `icons`: Para evitar leituras de exportações `undefined`.
* `prop-types`: Para corrigir erros de sintaxe em dependências internas do MUI.

---

## 🗺️ Roadmap & Status

### Fase 1: Infraestrutura & UI Base
- [x] Configuração Vite v7 + Pigment CSS.
- [x] Definição do Tema "Boutique" (Dark/Gold).
- [x] Tela de Login Minimalista (Zod + Hook Form).

### Fase 2: O Coração (Auth & RBAC)
- [ ] Contexto de Autenticação.
- [ ] Proteção de Rotas (Admin vs Operador).

### Fase 3: Dashboard & Operação
- [ ] Layout Principal (Sidebar Inteligente).
- [ ] Gestão de Produtos (MUI Grid v2).

---

*Code crafted with precision.*