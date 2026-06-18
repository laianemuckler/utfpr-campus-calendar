# Agenda Acadêmica UTFPR

Aplicativo mobile em React Native para centralizar eventos, prazos acadêmicos e editais da universidade.  
  

---

## Telas
1. Login
2. Cadastro
3. Tela inicial  
4. Calendário
5. Detalhes do evento
6. Busca de eventos
7. Perfil

---

## Tutarial de uso do aplicativo
Acesso ao Sistema
1. Caso não possua uma conta, selecione Criar uma.

<img src="./docs/tutorial/login.png" alt="login" width="200">


2. Após finalizar o preenchimento de dados na tela de cadastro, você terá acesso a tela inicial.

<img src="./docs/tutorial/register.png" alt="register" width="200">

3. Para Login informe e-mail e senha já cadastrados anteriormente.

Tela inicial
A tela inicial apresenta um resumo dos próximos eventos.
<img src="./docs/tutorial/home.png" alt="home" width="250">

Calendário
Na tela de calendário é possível ver todos os eventos do mês, navegar para s próximos meses e filtrar por dia.
<img src="./docs/tutorial/calendar.png" alt="calendar" width="200">
<img src="./docs/tutorial/calendar_by_day.png" alt="calendar by day" width="200">

Busca de eventos
Na tela de busca é possível filtrar por categorias fixas como por palavras.

<img src="./docs/tutorial/search.png" alt="search" width="200">
<img src="./docs/tutorial/search_subject.png" alt="search subject" width="200">

Detalhe de eventos
É possível visualizar os detalhes de cada evento clicando neles.

<img src="./docs/tutorial/event_details.png" alt="details" width="200">

Perfil do usuário
É possível visualizar os dados cadastrais em perfil.

<img src="./docs/tutorial/profile.png" alt="profile" width="200">


## Protótipos das telas da aplicação

### Visualização rápida
![Protótipo](./docs/prototype.png)

### Arquivo vetorial original
<a href="./docs/prototype.svg" target="_blank">Ver versão vetorial (SVG)</a>

---

## Estrutura JSON BD
O arquico JSON está dentro de docs.
![estrutura](./docs/db_json.png)

---

## Como rodar o projeto

### 1. **Clonar o repositório**
```bash
git clone https://github.com/laianemuckler/utfpr-campus-calendar.git
cd utfpr-campus-calendar
```

### 2. **Instalar dependências**
```bash
npm install
```

### 3. **Configurar variáveis de ambiente**
Criar um arquivo `.env.local` na raiz do projeto com as credenciais do Firebase:
```
EXPO_PUBLIC_FIREBASE_API_KEY=xxx
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
EXPO_PUBLIC_FIREBASE_DATABASE_URL=xxx
EXPO_PUBLIC_FIREBASE_PROJECT_ID=xxx
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
EXPO_PUBLIC_FIREBASE_APP_ID=xxx
```

### 4. **Rodar o projeto**
```bash
npx expo start
```

### 5. **Abrir no emulador/dispositivo**
- Pressionar `i` (iOS) ou `a` (Android)
- Ou escanear o QR code com Expo Go
