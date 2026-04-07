# PS INOX - App de Calculadoras e Gerenciamento

Este projeto é uma aplicação Next.js desenvolvida no Firebase Studio.

## Web (Vercel) + Android (Capacitor) no Mesmo Repositorio

Voce pode manter um unico repositorio sem perder o deploy atual na Vercel.
Os arquivos do Capacitor convivem com o projeto web e nao interrompem o pipeline da Vercel.

### Estrategia recomendada

1. Continue usando o mesmo repositorio no GitHub.
2. Mantenha `android/` e `capacitor.config.ts` versionados no Git.
3. Use dois modos de execucao mobile:

- Modo live (espelho da Vercel): app carrega pela URL publicada.
- Modo local (embutido): app usa arquivos locais no Android.

### Modo live (espelho da Vercel)

No PowerShell, execute:

```powershell
$env:CAP_SERVER_URL="https://seu-app.vercel.app"
npm run mobile:sync:live
npm run cap:open:android
```

### Modo local (embutido)

No PowerShell, execute:

```powershell
Remove-Item Env:CAP_SERVER_URL -ErrorAction SilentlyContinue
npm run mobile:sync:local
npm run cap:open:android
```

Observacao: hoje o modo local pode falhar se houver recursos do Next.js que nao suportam export estatico.
Nesse caso, use o modo live para nao bloquear o app Android e manter a Vercel como fonte principal.

## Como Executar o Script da Balança (`balanca.js`)

Este script é projetado para ser executado em um computador separado que está fisicamente conectado à balança via porta serial. Ele captura os dados da balança e os envia para o Firestore.

### Pré-requisitos na Máquina da Balança

*   **Node.js:** Certifique-se de que o Node.js está instalado. Você pode baixá-lo em [nodejs.org](https://nodejs.org/).
*   **Acesso à Internet:** Para enviar os dados para o Firebase.

### Passo a Passo

1.  **Copie os Arquivos Essenciais:**
    Copie os seguintes arquivos deste projeto para uma pasta no computador da balança:
    *   `balanca.js`
    *   `package.json`

2.  **Crie o Arquivo de Ambiente (`.env`):**
    Na mesma pasta, crie um arquivo chamado `.env` e preencha com as mesmas credenciais do seu projeto principal. Ele deve ter o seguinte formato:

    ```
    NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
    NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
    ```

3.  **Instale as Dependências:**
    Abra um terminal ou prompt de comando na pasta onde você copiou os arquivos e execute o seguinte comando. Isso instalará `serialport`, `firebase` e `dotenv`.

    ```bash
    npm install
    ```

4.  **Configure a Porta Serial no App:**
    Antes de iniciar o script, vá para a página **"Balança Live"** no seu aplicativo principal e, nas configurações, salve a porta serial correta que a balança está usando no computador (ex: `COM3` no Windows ou `/dev/ttyUSB0` no Linux).

5.  **Execute o Script:**
    Com tudo configurado, inicie o script com o seguinte comando:

    ```bash
    node balanca.js
    ```

    O terminal deverá exibir mensagens indicando que o Firebase foi inicializado e que a conexão com a porta serial foi bem-sucedida. Agora, qualquer peso enviado pela balança será capturado e enviado para o Firestore.
