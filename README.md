# Focus UI | Carvalho Engenharia

> **FROMTHEOS** — *Digital Soul Tailoring*
>
> Sistema de Gestão de Estoque de Alta Fidelidade, desenvolvido com foco em **Integridade de Dados**, **Segurança (RBAC)** e **Performance Industrial**.

![Project Status](https://img.shields.io/badge/status-MVP%20Complete-0F4C3A?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/stack-React%2019%20%7C%20Tailwind%204%20%7C%20MUI%207-0F4C3A?style=for-the-badge)

---

## 🏗️ A Arquitetura (The Stack 2026)

Este projeto utiliza o estado da arte do ecossistema React, priorizando performance e DX (Developer Experience).

-   **Core:** React v19.2+ (Hooks & Context API).
-   **Build Tool:** Vite v7.3+ (Instant Server Start).
-   **Styling:** **Tailwind CSS v4.0** (Utility-First, Zero-Runtime).
-   **Components:** Material UI v7 (Inputs complexos e Data Display).
-   **Forms:** React Hook Form + Zod (Validação de esquema rigorosa).
-   **Language:** TypeScript 5.x (Strict Mode).

---

## 🛡️ Segurança & RBAC (Role-Based Access Control)

O sistema implementa uma camada de segurança no Front-End que adapta a interface e protege rotas baseada no nível do usuário.

| Módulo | 🛡️ Admin | 👷 Operador | Comportamento Técnico |
| :--- | :---: | :---: | :--- |
| **Dashboard** | ✅ | ⛔ | `RoleGuard` redireciona para 403. |
| **Produtos** | Full Access | Leitura | Botões de ação (Criar/Editar) são removidos da DOM. |
| **Movimentações** | ✅ | ✅ | Validação de estoque em tempo real (impede saldo negativo). |
| **Equipe** | ✅ | ⛔ | Acesso exclusivo para gestão de usuários. |

---

## 🚀 Funcionalidades Chave

### 1. Gestão de Estoque Inteligente
-   **Rastreabilidade:** Criação de produto gera automaticamente o registro de entrada inicial.
-   **Integridade:** Bloqueio de movimentações de saída se o estoque for insuficiente.
-   **Feedback:** Alertas visuais para estoque baixo (`LOW_STOCK`) ou zerado (`OUT_OF_STOCK`).

### 2. UX Industrial ("Carvalho Identity")
-   **Design System:** Paleta de cores personalizada (`#0F4C3A` Forest Green) e tipografia técnica (*Manrope* + *JetBrains Mono*).
-   **Split Screen Login:** Layout imersivo com identidade da marca.
-   **Feedback Imediato:** Toasts (Snackbars) para todas as ações de sucesso ou erro.

### 3. Gestão de Equipe
-   **CRUD Completo:** Criação, Edição e Exclusão de usuários.
-   **Safety Gates:** Dialogs de confirmação antes de ações destrutivas.
-   **Validação:** Impede cadastro de e-mails ou nomes duplicados.

---

## 📂 Estrutura de Diretórios (Domain-Driven)

```text
src/
├── components/
│   ├── common/        # UI Kit (Sidebar, Cards)
│   └── domain/        # Componentes de Negócio
├── context/           # AuthContext (Estado Global de Sessão)
├── hooks/             # useAuth (Abstração do Contexto)
├── layouts/           # MainLayout (Sidebar) vs AuthLayout (Full)
├── pages/             # Views (Dashboard, Products, Users, 403)
├── routes/            # RoleGuard e Definição de Rotas
├── services/          # Camada de Dados (Mock com persistência em memória)
├── theme/             # Configuração do MUI v7 (Theme Override)
└── types/             # Contratos TypeScript (Interfaces)
```

## 🚀 Como Rodar o Projeto

**Pré-requisitos**
* Node.js v20+ (Recomendado v22 LTS).

**Instalação**
1. Clone o repositório.
2. Instale as dependências:

```Bash
npm install
```

3. Inicie o servidor:

```Bash
npm run dev
```

---

### Credenciais de Acesso (Mock)

| Role | E-mail | Senha |
| :--- | :--- | :--- |
| **Admin** | `admin@focus.ui` | `123456` |
| **Operador** | `operador@focus.ui` | `123456` |

---

## 🎨 Design System (Tailwind Config)
As cores principais estão mapeadas no tailwind.config.js:

* **Brand Dark:** `#023020` (Sidebar)
* **Brand Main:** `#0F4C3A` (Primary Buttons)
* **Concrete:** `#F3F4F6` (Backgrounds)
* **Accent:** `#D4AF37` (Detalhes sutis)

---

*Code crafted with precision by FROMTHEOS.*