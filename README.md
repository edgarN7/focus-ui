# Focus UI | Inventory Management System

> **Fromtheos Digital Studio** — *Digital Soul Tailoring*
  **Janderson Angelo** - *Back-end Developer*
>
> Um sistema de gestão de estoque focado em **Alta Fidelidade de Interface**, **Segurança (RBAC)** e **Performance (Vite + Tailwind)**.

---

## 🏗️ A Arquitetura (The Stack 2026)

Este projeto utiliza uma abordagem pragmática e de alta performance.

-   **Core:** React v19.2+ (Hooks & Context API).
-   **Build Tool:** Vite v7.3+ (Instant Server Start).
-   **Styling:** **Tailwind CSS v3.4+** (Utility-First, Dark Mode nativo).
-   **Components:** Material UI v7 (Apenas para Inputs/Widgets complexos).
-   **Forms:** React Hook Form + Zod.
-   **Language:** TypeScript 5.x (Strict Mode).

---

## 📂 Estrutura de Diretórios

```text
src/
├── components/
│   ├── common/        # UI Kit (Botões e Inputs customizados)
│   └── domain/        # Componentes de Negócio
├── context/           # AuthContext (RBAC)
├── hooks/             # Lógica encapsulada (useAuth)
├── layouts/           # AppShell e AuthLayout
├── pages/             # Telas (Login, Dashboard)
├── services/          # Mocks e Integrações
├── theme/             # (Depreciado em favor do tailwind.config.js)
└── utils/             # Helpers
```

## 🚀 Como Rodar o Projeto

**Instalação**
1. Clone o repositório.
2. Instale as dependências (o projeto usa um .npmrc para gerenciar peer dependencies legadas):

```Bash
npm install
```

3. Inicie o servidor:

```Bash
npm run dev
```

---

## 🎨 Design System (Tailwind Config)
As cores da marca estão mapeadas no tailwind.config.js:

* **Primary (Gold):** bg-primary (#D4AF37)

* **Background (Deep Covenant):** bg-background-default (#0A0A0A)

* **Paper:** bg-background-paper (#161616)

---

*Code crafted with precision.*