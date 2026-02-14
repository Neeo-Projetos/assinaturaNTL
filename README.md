# ✒️ Gerador de Assinaturas NTL

> **Crie assinaturas de e-mail profissionais em segundos.**

![Project Banner](https://via.placeholder.com/1200x400?text=Gerador+de+Assinaturas+NTL) <!-- Substituir por um banner real se disponível -->

Bem-vindo ao **Gerador de Assinaturas NTL**, uma aplicação moderna e intuitiva desenvolvida para padronizar e facilitar a criação de assinaturas de e-mail para a equipe NTL.

## ✨ Funcionalidades

- **🎨 Design Profissional**: Gera assinaturas com layout limpo e moderno.
- **🌗 Modo Escuro/Claro**: Interface adaptável para melhor experiência de uso.
- **⚡ Preenchimento Fácil**: Campos para Nome, Cargo, E-mail e Telefone.
- **👀 Visualização em Tempo Real**: Veja como sua assinatura ficará enquanto digita.
- **📥 Exportação HTML**: Gera o código HTML pronto para copiar e colar no seu cliente de e-mail.
- **GIF Animado (Beta)**: Suporte para geração de assinaturas animadas (GIF).

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com as melhores tecnologias do ecossistema Vue/Nuxt:

- [Nuxt 3](https://nuxt.com/) - O Framework Vue híbrido.
- [Vue 3](https://vuejs.org/) - O Framework progressivo de JavaScript.
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitário para estilização rápida.
- [Puppeteer](https://pptr.dev/) - Para geração de imagens e GIFs no servidor.

## 🚀 Como Executar

Siga os passos abaixo para rodar o projeto localmente:

### Pré-requisitos

- Node.js (v18+ recomendado)
- pnpm (ou npm/yarn)

### Instalação

Clones o repositório e instale as dependências:

```bash
git clone https://github.com/tiagomdss/assinaturaNTL.git
cd assinaturaNTL/dashboard
pnpm install
```

### Desenvolvimento

Inicie o servidor de desenvolvimento:

```bash
pnpm dev
```

Acesse `http://localhost:3000` no seu navegador.

### Build para Produção

Para gerar a versão de produção:

```bash
pnpm build
```

## 📂 Estrutura do Projeto

- `app/`: Contém a lógica principal da aplicação (Vue/Nuxt).
- `server/`: APIs server-side (geração de GIF/HTML).
- `public/`: Arquivos estáticos.
- `template.html`: Template base para a assinatura.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

---

Feito com 💜 pela equipe NTL.
