# BugHunter AI

SaaS para análise de segurança de URLs com inventário automático de ativos e superfície de ataque, alimentado por IA.

## Stack Tecnológico

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend**: Firebase (Firestore + Authentication + Storage)
- **IA**: OpenAI API (Claude 3.5 Sonnet)
- **Hospedagem**: GitHub Pages

## Funcionalidades

1. **Dashboard** - Visualização de análises e estatísticas
2. **Scanner de URL** - Análise automatizada de domínios
3. **Detecção de Tecnologias** - Identificação de tecnologias utilizadas
4. **Análise SSL/TLS** - Validação e monitoramento de certificados
5. **Enumeração de Endpoints** - Descoberta de endpoints públicos
6. **Análise de Assets JavaScript** - Detecção de vulnerabilidades em JS
7. **Identificação de Riscos** - Priorização automática de vulnerabilidades
8. **IA Insights** - Análise inteligente com Claude
9. **Workspace de Vulnerabilidades** - Gerenciamento de achados
10. **Geração de Relatórios** - Export em PDF/HTML
11. **Base de Conhecimento** - Notas tipo Notion
12. **Busca Global** - Busca across all resources

## Instalação

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta Firebase
- Chave API OpenAI

### Setup

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais Firebase e OpenAI

# Desenvolver
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## Variáveis de Ambiente

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_OPENAI_API_KEY=
```

## Estrutura do Projeto

```
src/
├── components/     # Componentes React
├── lib/           # Funções utilitárias e APIs
├── hooks/         # React Hooks customizados
├── pages/         # Páginas principais
├── store/         # Zustand stores (state management)
├── types/         # Tipos TypeScript
├── App.tsx        # Componente raiz
├── main.tsx       # Entry point
└── index.css      # Estilos globais
```

## Firebase Setup

Coleções necessárias:

- `users` - Dados dos usuários
- `targets` - URLs analisadas
- `assets` - Ativos descobertos
- `findings` - Vulnerabilidades encontradas
- `evidence` - Evidências/provas
- `notes` - Notas da base de conhecimento
- `reports` - Relatórios gerados
- `settings` - Configurações do usuário

## Desenvolvimento

### Adicionar nova página

1. Criar arquivo em `src/pages/NomePagina.tsx`
2. Adicionar rota em `App.tsx`
3. Adicionar link no menu da Sidebar

### Adicionar novo componente

1. Criar pasta em `src/components/NomeComponente/`
2. Implementar componente React
3. Exportar do arquivo principal

### Adicionar nova collection Firestore

1. Definir tipos em `src/types/index.ts`
2. Criar store em `src/store/` se necessário
3. Usar `useFirestore()` hook para operações CRUD

## Deploy

### GitHub Pages

```bash
npm run build
# Commit e push para main
```

O projeto está configurado com `base: '/bughunter-ai/'` para deploy em GitHub Pages.

## Documentação

- [Firebase Console](https://console.firebase.google.com)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [React Router v6](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Zustand](https://github.com/pmndrs/zustand)

## Licença

Todos os direitos reservados.
