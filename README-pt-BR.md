# DevTools Hub 🛠️

> **Coleção Essencial de Ferramentas para Desenvolvedores** - Um conjunto abrangente de utilitários baseados na web para desenvolvedores modernos

## 🌐 **Idioma / Language**

- 🇧🇷 [Português (Brasil)](README-pt-BR.md) - Versão atual
- 🇺🇸 [English](README.md) - English version

---

## 📋 **Situação (Contexto)**

### O Problema
Como desenvolvedor, frequentemente me via alternando entre múltiplas ferramentas online e abas do navegador para realizar tarefas comuns de desenvolvimento:

- **Ferramentas Espalhadas**: Ter que visitar diferentes sites para formatação JSON, geração de UUID, codificação Base64, geração de senhas e operações criptográficas
- **UX Inconsistente**: Cada ferramenta tinha interfaces diferentes, algumas com anúncios, outras com funcionalidade limitada
- **Preocupações de Segurança**: Usar ferramentas de terceiros para operações sensíveis como geração de senhas e criptografia
- **Desperdício de Tempo**: Constantemente procurando por utilitários de desenvolvedor confiáveis, rápidos e seguros
- **Limitações Offline**: A maioria das ferramentas exigia conectividade com a internet, limitando a produtividade em cenários offline

### A Visão
Eu imaginei uma **plataforma única e unificada** que:
- Consolidaria todas as ferramentas essenciais de desenvolvedor em um só lugar
- Forneceria uma experiência de usuário consistente e moderna
- Garantiria segurança e privacidade (processamento do lado do cliente)
- Funcionasse offline sem dependências externas
- Fosse rápida, confiável e sem anúncios

---

## 🚀 **Ação (Implementação)**

### Stack Tecnológico
Construí uma aplicação web moderna e performática usando:

- **Frontend**: React 18 com TypeScript para segurança de tipos
- **Ferramenta de Build**: Vite para desenvolvimento e builds ultrarrápidos
- **Framework de UI**: Componentes shadcn/ui com Tailwind CSS para design moderno
- **Ícones**: Lucide React para iconografia consistente
- **Gerenciamento de Estado**: React hooks para gerenciamento de estado local
- **Geração de QR Code**: Biblioteca react-qr-code para geração autêntica de QR codes
- **Criptografia**: Web Crypto API para operações seguras
- **Validação**: Validação de entrada em tempo real e tratamento de erros

---

## 🎯 **Resultado (Resultados)**

### Benefícios Imediatos
✅ **Experiência Unificada**: Todas as ferramentas essenciais de dev em uma aplicação  
✅ **Produtividade Melhorada**: Sem mais alternância de abas ou caça a ferramentas  
✅ **Segurança Aprimorada**: Processamento do lado do cliente sem vazamento de dados  
✅ **Capacidade Offline**: Funciona sem conexão com a internet  
✅ **Interface Consistente**: Padrões de UX familiares em todas as ferramentas  

### Excelência Técnica
✅ **Performance**: Ultrarrápido com builds otimizados do Vite  
✅ **Segurança de Tipos**: Implementação completa em TypeScript previne erros de runtime  
✅ **Acessibilidade**: Componentes compatíveis com WCAG do shadcn/ui  
✅ **Manutenibilidade**: Arquitetura de código limpa e modular  
✅ **Escalabilidade**: Fácil adicionar novas ferramentas e funcionalidades  

### Impacto do Usuário
- **Economia de Tempo**: Redução na alternância de contexto economiza 2-3 minutos por sessão de desenvolvimento
- **Confiabilidade**: Sem dependência de serviços externos ou conectividade com a internet
- **Segurança**: Operações sensíveis como geração de senhas e criptografia acontecem localmente
- **Aprendizado**: Feedback claro ajuda desenvolvedores a entender conceitos de segurança (entropia, força, codificação QR)
- **Cobertura Abrangente**: 54 ferramentas essenciais cobrindo todas as principais necessidades de desenvolvimento
- **Produtividade Aprimorada**: Solução única para processamento de texto, conversão de dados, desenvolvimento web e criptografia
- **Qualidade Profissional**: QR codes reais, processamento de texto avançado e recursos de segurança de nível empresarial
- **Experiência do Desenvolvedor**: Exemplos interativos, validação em tempo real e interfaces intuitivas

### Arquitetura Preparada para o Futuro
- **Design Modular**: Fácil de estender com novas ferramentas
- **Biblioteca de Componentes**: Componentes de UI reutilizáveis para desenvolvimento rápido
- **Stack Moderno**: Construído com melhores práticas atuais e tecnologias mais recentes
- **Pronto para Deploy**: Otimizado para produção com plataforma Vercel
- **Extensível**: Arquitetura limpa permite fácil adição de novas funcionalidades e ferramentas

---

## 🚀 **Começando**

### Pré-requisitos
- Node.js 18+ e npm
- Navegador web moderno com suporte à Web Crypto API

### Instalação e Desenvolvimento

```bash
# Clone o repositório
git clone https://github.com/hemelo/dev-tools.git
cd dev-tools

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

### Scripts Disponíveis
- `npm run dev` - Inicia servidor de desenvolvimento com hot reload
- `npm run build` - Build otimizado para produção
- `npm run preview` - Visualiza build de produção localmente
- `npm run lint` - Executa ESLint para qualidade do código

---

## 🛠️ **Ferramentas Disponíveis**

| Ferramenta | Categoria | Descrição |
|------------|-----------|-----------|
| **Formatador JSON** | Texto | Formatar, validar e minificar dados JSON com estatísticas |
| **Conversor CSV ↔ JSON** | Texto | Converter entre formatos CSV e JSON |
| **Conversor YAML ↔ JSON** | Texto | Converter entre formatos YAML e JSON |
| **Formatador XML** | Texto | Formatar, validar e minificar documentos XML com estatísticas |
| **Conversor de Caso de Texto** | Texto | Converter texto entre diferentes formatos de caso |
| **Ferramenta de Diff de Texto** | Texto | Comparar dois documentos de texto e ver diferenças |
| **Testador de Regex** | Texto | Testar expressões regulares com preview ao vivo |
| **Formatador SQL** | Texto | Formatar, validar e minificar consultas SQL com estatísticas |
| **Gerador de Slug** | Texto | Gerar slugs amigáveis para URL a partir de qualquer texto |
| **Inspetor EXIF** | Segurança | Analisar metadados de imagem e dados EXIF para privacidade, detalhes técnicos e informações de localização |
| **Analisador APK** | Segurança | Analisar arquivos APK Android para informações de segurança, permissões e estrutura |
| **Ferramenta de Checksum** | Segurança | Verificação profissional de integridade de arquivos com múltiplos algoritmos de hash e processamento em lote |
| **Conversor de Unidades** | Utilitários | Conversão profissional de unidades com categorias abrangentes e controle de precisão |
| **Gerador de Números Aleatórios** | Gerador | Geração profissional de números aleatórios com análise estatística |
| **Gerador de Código de Barras** | Gerador | Gerar códigos de barras profissionais em múltiplos formatos com opções personalizáveis |
| **Gerador de UUID** | Gerador | Gerar identificadores únicos compatíveis com RFC 4122 |
| **Gerador de QR Code** | Gerador | Gerar QR codes a partir de texto ou URLs |
| **Gerador de Dados Mock** | Gerador | Gerar nomes falsos, emails, endereços, telefones e muito mais |
| **Ferramenta Base64** | Codificação | Codificar/decodificar strings Base64 |
| **Ferramenta de URL** | Codificação | Codificar/decodificar componentes de URL |
| **Conversor de Fuso Horário** | Desenvolvimento Web | Conversão profissional de fuso horário com suporte a DST e cobertura global |
| **Redimensionador e Compressor de Imagem** | Desenvolvimento Web | Processamento profissional de imagem com operações em lote e conversão de formato |
| **Diagramas de Sequência** | Desenvolvimento Web | Criar diagramas de sequência estilo PlantUML com preview ao vivo e renderização profissional |
| **Criador de Flexbox** | Desenvolvimento Web | Criar e experimentar com layouts flexbox com feedback visual em tempo real |
| **Gerador de Favicon** | Desenvolvimento Web | Criar favicons a partir de emojis, texto ou imagens com múltiplos formatos |
| **Seletor e Conversor de Cores** | Desenvolvimento Web | Selecionar cores e converter entre formatos |
| **Conversor de Base Numérica** | Dados | Converter entre binário, octal, decimal, hex |
| **Conversor de Timestamp** | Dados | Converter entre timestamps Unix e datas |
| **Calculadora de Matriz** | Matemática | Realizar operações de matriz incluindo determinante, inversa, transposta e muito mais |
| **Explorador ASCII/Unicode** | Texto e Dados | Explorar caracteres ASCII e Unicode com informações detalhadas e detalhes de codificação |
| **Gerador de Manifest PWA** | Desenvolvimento Web | Criar e personalizar manifestos de Progressive Web App com opções de configuração abrangentes |
| **Calculadora de Estatísticas** | Matemática | Calcular estatísticas descritivas, gerar distribuições de probabilidade e analisar dados com ferramentas estatísticas abrangentes |
| **Gerador NanoID / ULID** | Geradores | Gerar identificadores únicos usando algoritmos NanoID e ULID com opções de personalização abrangentes |
| **Calculadora de Dias Úteis** | Negócios | Calcular dias úteis, horas de trabalho e cronogramas de projeto com gerenciamento abrangente de feriados e fins de semana |
| **Testador de Força de Senha** | Criptografia e Segurança | Analisar força da senha, calcular entropia e obter recomendações de segurança |
| **Gerador de Hash** | Criptografia | Gerar hashes MD5, SHA-1, SHA-256, SHA-384, SHA-512 |
| **Gerador de Senhas** | Criptografia | Gerar senhas seguras com análise de força |
| **Decodificador JWT** | Criptografia | Decodificar e validar JSON Web Tokens |
| **Gerador HMAC** | Criptografia | Gerar assinaturas HMAC para autenticação |
| **Criptografia AES** | Criptografia | Criptografar/descriptografar dados com algoritmo AES |
| **Visualizador de Dados** | Análise de Dados | Criar gráficos a partir de dados CSV e JSON |
| **Geolocalização IP** | Rede | Obter informações de localização e rede a partir de endereços IP |
| **Editor Markdown** | Conteúdo | Escrever e visualizar markdown com renderização ao vivo |
| **Gerador de Gradiente CSS** | Desenvolvimento Web | Criar belos gradientes CSS com preview visual |
| **Testador de API** | Rede | Testar APIs REST com análise detalhada de resposta |
| **Gerador de Schema JSON** | Análise de Dados | Gerar JSON Schema automaticamente a partir de dados JSON |
| **Consulta DNS** | Rede | Consultar registros DNS para qualquer domínio |
| **Gerador Lorem Ipsum** | Conteúdo | Gerar texto placeholder em múltiplos idiomas |
| **Gerador de Paleta de Cores** | Desenvolvimento Web | Criar paletas de cores com regras de harmonia e extração de imagem |
| **Gerador de Commit Git** | Desenvolvimento | Gerar mensagens de commit convencionais |
| **Gerador de Comando cURL** | Rede | Gerar comandos cURL para teste e debug de API |
| **Calculadora de Sub-rede** | Rede | Calcular informações de rede e máscaras de sub-rede |
| **Verificador SSL/TLS** | Rede | Verificar validade do certificado SSL e nota de segurança |
| **Gerador de Expressão Cron** | Desenvolvimento | Gerar e validar expressões cron com interface visual |
| **Construtor de Consulta SQL** | Banco de Dados | Construir consultas SQL visualmente com interface drag-and-drop, relacionamentos de tabela e geração de consulta em tempo real |

---

## 🌐 **Deploy**

Este projeto está implantado na plataforma Vercel:

**URL ao Vivo**: [https://devtools.hemelo.fyi](https://devtools.hemelo.fyi)

---

## 🤝 **Contribuindo**

Este projeto aceita contribuições! Seja você quer:
- Adicionar novas ferramentas de desenvolvedor
- Melhorar funcionalidades existentes
- Aprimorar a UI/UX
- Corrigir bugs ou melhorar performance

Sinta-se à vontade para enviar issues e pull requests.

---

## 📄 **Licença**

Este projeto é open source e está disponível sob a [Licença MIT](LICENSE).

---

## 🙏 **Agradecimentos**

- Construído com a plataforma [Lovable](https://lovable.dev)
- Vibecoding com a IDE [Cursor](https://cursor.com)
- Componentes de UI do [shadcn/ui](https://ui.shadcn.com)
- Ícones do [Lucide](https://lucide.dev)
- Construído por [Vite](https://vitejs.dev) e [React](https://react.dev)

---

*Feito com ❤️ para a comunidade de desenvolvedores*
