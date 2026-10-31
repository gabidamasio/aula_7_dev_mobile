# Relatório de uso de Inteligência Artificial

## 1. Identificação da atividade

**Projeto:** Habit Tracker Expo  
**Atividade:** Aula 7 — Navegação com Expo Router e notificações locais  
**Ferramenta de IA utilizada:** ChatGPT (OpenAI).  
**Finalidade:** apoiar a implementação, integração, revisão e depuração dos recursos de navegação e notificações do aplicativo.

A IA foi utilizada durante o desenvolvimento para interpretar os requisitos da atividade, sugerir alterações no código, revisar arquivos existentes, investigar erros e orientar os testes realizados no ambiente local.

## 2. Como a IA foi utilizada

A IA foi utilizada como apoio ao longo de um processo iterativo de implementação. O trabalho foi dividido em cinco frentes principais:

### 2.1. Organização da navegação

A IA auxiliou na organização das rotas do aplicativo utilizando Expo Router, considerando a estrutura de diretórios baseada em arquivos.

Foram trabalhados os seguintes recursos:

- Configuração do Drawer Navigator no arquivo `src/app/_layout.tsx`.
- Criação das opções Home, Sobre e Configurações no menu lateral.
- Configuração das abas Home e Estatísticas em `src/app/(tabs)/_layout.tsx`.
- Criação da tela de Estatísticas em `src/app/(tabs)/stats.tsx`.
- Reutilização da tela de hábitos existente na aba Home, por meio de `src/app/(tabs)/index.tsx`.
- Criação da rota dinâmica `src/app/habit/[id].tsx`.

A IA também orientou a utilização dos ícones do Feather para as abas e MaterialIcons para o Drawer.

### 2.2. Implementação da rota dinâmica

Foi implementada a rota dinâmica `/habit/[id]`, utilizando `useLocalSearchParams` para recuperar o identificador recebido pela URL.

A tela apresenta o identificador do hábito e possui um botão para retornar à tela anterior utilizando `router.back()`.

Também foi orientada a alteração do comportamento dos cartões de hábitos para permitir a navegação até a tela de detalhes ao tocar em um hábito.

### 2.3. Implementação das notificações locais

A IA auxiliou na implementação do agendamento de notificações locais com o pacote `expo-notifications`.

O comportamento planejado foi:

- Consultar a permissão para enviar notificações.
- Solicitar permissão quando necessário.
- Agendar uma notificação para cinco segundos depois.
- Exibir a notificação com o aplicativo em primeiro plano.
- Registrar no console quando uma notificação for recebida.
- Registrar quando o usuário tocar na notificação.
- Recuperar o identificador do hábito armazenado nos dados da notificação.
- Abrir a rota de detalhes do hábito correspondente.

A configuração do comportamento em primeiro plano e dos listeners foi organizada no layout raiz do aplicativo.

### 2.4. Integração das funcionalidades

A IA também foi utilizada para integrar os recursos sem substituir desnecessariamente as funcionalidades que já existiam.

Foram consideradas as seguintes funcionalidades preexistentes:

- Listagem e agrupamento dos hábitos.
- Pesquisa por título.
- Alteração do status dos hábitos.
- Remoção de hábitos.
- Cadastro de novos hábitos.
- Registro de fotos.
- Acesso à galeria.
- Tela Sobre.

O objetivo foi acrescentar a navegação e as notificações mantendo o funcionamento dessas funcionalidades.

### 2.5. Revisão e depuração

Durante a execução, a IA foi utilizada para analisar mensagens de erro, revisar trechos de código e propor correções.

O processo de depuração é detalhado na seção 3.

## 3. Dificuldades encontradas e correções realizadas

### 3.1. Organização das rotas e conflito de navegação

**Dificuldade:** durante a organização das rotas, foi identificado um possível conflito entre a rota inicial `src/app/index.tsx` e a rota `index.tsx` existente dentro do grupo `(tabs)`.

**Correção:** o arquivo `src/app/index.tsx` foi removido para evitar a duplicidade da rota inicial, mantendo a tela Home dentro do grupo de abas.

Também foi necessário ajustar os nomes das telas registrados no Drawer para corresponderem aos arquivos existentes.

**Participação da IA:** a IA explicou a relação entre a estrutura de diretórios e as rotas geradas automaticamente pelo Expo Router, orientando a organização dos arquivos.

### 3.2. Configuração dos navegadores

**Dificuldade:** a integração do Drawer com as abas exigiu atenção à separação das responsabilidades dos layouts.

**Correção:** a configuração foi dividida entre:

- `src/app/_layout.tsx`: responsável pelo Drawer e pelos listeners de notificações.
- `src/app/(tabs)/_layout.tsx`: responsável pelas abas Home e Estatísticas.

Também foram adicionadas rotas auxiliares ocultas no menu lateral, como a rota dinâmica de hábitos e as rotas de galeria e registro de fotos.

**Participação da IA:** a IA forneceu exemplos de configuração e orientou a correção da importação de `useRouter`, que deveria vir de `expo-router`, e não de `expo-router/drawer`.

### 3.3. Dependências do Drawer

**Dificuldade:** a implementação do menu lateral exigiu a instalação de dependências relacionadas à navegação e aos gestos.

**Correção:** foram instalados os pacotes:

- `@react-navigation/drawer`
- `react-native-gesture-handler`
- `react-native-reanimated`
- `react-native-worklets`

Também foram realizadas verificações de compatibilidade das dependências utilizando ferramentas do Expo.

Durante esse processo, foi executado `npm install --legacy-peer-deps` para prosseguir com a instalação das dependências, o que alterou a árvore de pacotes instalada. Por esse motivo, a compatibilidade final ainda precisava ser verificada.

**Participação da IA:** a IA orientou os comandos de instalação e as verificações de compatibilidade.

### 3.4. Problema ao iniciar o aplicativo com túnel

**Dificuldade:** ao executar o projeto com `npx expo start --tunnel`, ocorreu uma mensagem informando que não havia uma sessão autenticada no Expo para criar o túnel.

**Correção tentada:** foi sugerida a utilização do túnel com ngrok diretamente ou a autenticação na conta Expo antes de iniciar o servidor.

**Participação da IA:** a IA explicou as alternativas e forneceu os comandos para tentar iniciar o projeto.

### 3.5. Erro no agendamento das notificações

**Dificuldade:** ao pressionar o botão de agendamento, o aplicativo apresentou o seguinte erro:

`ExpoNotificationChannelManager.setNotificationChannelAsync`

A exceção apresentada foi:

`java.lang.NullPointerException: Attempt to invoke virtual method 'java.lang.Class java.lang.Object.getClass()' on a null object reference`

A mensagem indicava uma falha na criação do canal de notificações no Android.

**Primeira correção tentada:** a IA orientou simplificar os parâmetros enviados para `setNotificationChannelAsync`, removendo configurações adicionais do canal, como padrão de vibração e cor da luz.

**Resultado:** o erro continuou acontecendo.

**Segunda correção tentada:** a chamada explícita a `setNotificationChannelAsync` foi removida da função `agendarLembrete`. O código passou a consultar a permissão e agendar a notificação diretamente com `scheduleNotificationAsync`, sem informar um canal manualmente.

**Resultado:** mesmo após a alteração, o erro continuou sendo relatado.

A versão atual do arquivo `src/screens/tela-habitos.tsx` compartilhada durante a depuração não contém a chamada explícita a `setNotificationChannelAsync`. Isso levantou a possibilidade de o aplicativo estar executando uma versão anterior do código, de existir outra chamada em outro arquivo ou de haver incompatibilidade no ambiente de execução.

**Ações de investigação propostas:**

- Reiniciar o servidor Expo limpando o cache com `npx.cmd expo start --clear`.
- Fechar e abrir novamente o Expo Go no celular.
- Procurar outras ocorrências de `setNotificationChannelAsync` no projeto.
- Conferir as versões instaladas de `expo` e `expo-notifications`.
- Executar `expo-doctor` para verificar possíveis incompatibilidades.

Essas verificações ainda precisam ser concluídas para identificar a causa definitiva.

**Participação da IA:** a IA analisou o stack trace, identificou o método associado à falha, sugeriu alterações progressivas e orientou a coleta de informações para investigar a origem do problema.

### 3.6. Dificuldade com os comandos no terminal

**Dificuldade:** durante a investigação, alguns comandos foram fornecidos em sintaxe do PowerShell, mas estavam sendo executados no Prompt de Comando (CMD). Isso ocasionou mensagens como:

`'Select-String' não é reconhecido como um comando interno ou externo`

**Correção:** a IA adaptou as instruções para comandos compatíveis com o CMD, utilizando `findstr` para pesquisar ocorrências nos arquivos.

Também foi necessário separar os comandos, pois uma tentativa anterior acabou juntando instruções de terminais diferentes.

**Participação da IA:** a IA ajustou as instruções ao ambiente Windows utilizado no desenvolvimento.

## 4. Análise crítica das sugestões da IA

### Acertos

1. **Interpretação dos requisitos:** a IA conseguiu transformar os requisitos da atividade em uma estrutura de arquivos e componentes coerente com o Expo Router.
2. **Separação dos navegadores:** a divisão entre o layout raiz e o layout das abas facilitou a organização da navegação.
3. **Preservação do código existente:** as alterações propostas procuraram manter as funcionalidades da tela de hábitos, em vez de substituir toda a implementação.
4. **Orientação sobre rotas dinâmicas:** a utilização de `useLocalSearchParams` e `router.back()` foi adequada ao comportamento solicitado.
5. **Depuração iterativa:** a IA analisou os erros apresentados e propôs alterações específicas, além de solicitar informações adicionais para investigar a causa.
6. **Adaptação ao ambiente:** as instruções de terminal foram ajustadas depois que foi identificado o uso do CMD em vez do PowerShell.

### Limitações e pontos que exigem revisão humana

1. **As sugestões não garantem funcionamento:** a IA não executou o projeto no ambiente local. A correção precisa ser confirmada por meio de testes reais.
2. **A primeira correção da notificação não resolveu o problema:** a simplificação da configuração do canal não eliminou a exceção.
3. **A segunda correção ainda não foi validada:** mesmo após remover a chamada explícita de criação do canal, o erro continuou sendo relatado.
4. **Possível divergência entre código e execução:** a mensagem de erro continua apontando para um método que não aparece na versão do arquivo compartilhada. É necessário confirmar se o aplicativo está carregando o código atualizado.
5. **Compatibilidade das dependências:** a instalação de pacotes e o uso de `--legacy-peer-deps` exigem uma conferência das versões instaladas.
6. **Validação incompleta:** ainda não foi possível comprovar o funcionamento completo do fluxo de notificações, principalmente o recebimento em primeiro plano e a navegação ao tocar na notificação.

## 5. Grau de acerto da IA

A avaliação qualitativa é de **acerto parcial a alto como apoio à implementação e à organização do código**, mas ainda não como validação final da atividade.

A IA contribuiu para estruturar a navegação, implementar a rota dinâmica, organizar as abas e o Drawer e orientar a integração das notificações.

Entretanto, a depuração das notificações demonstrou uma limitação importante: as primeiras alterações sugeridas não resolveram o erro no ambiente de execução.

Esse caso reforçou a necessidade de analisar as mensagens do console, conferir o código efetivamente executado, verificar as dependências e realizar testes no dispositivo.

Portanto, as sugestões foram úteis para orientar o desenvolvimento, mas precisaram de revisão e validação humana. Não seria correto considerar a funcionalidade de notificações concluída apenas com base no código gerado.

## 6. Verificações antes da entrega

### Navegação

- [ ] Abrir o aplicativo e visualizar a tela Home.
- [ ] Abrir o Drawer e confirmar que ele desliza corretamente.
- [ ] Conferir as três opções: Home, Sobre e Configurações.
- [ ] Conferir os ícones do menu lateral.
- [ ] Alternar entre as abas Home e Estatísticas.
- [ ] Tocar em um hábito e confirmar a abertura da rota `/habit/5`.
- [ ] Conferir se o identificador aparece corretamente na tela de detalhes.
- [ ] Utilizar o botão Voltar e confirmar o retorno à tela anterior.

### Notificações

- [ ] Confirmar que a permissão é solicitada corretamente.
- [ ] Agendar uma notificação para cinco segundos depois.
- [ ] Confirmar que a notificação aparece com o aplicativo em primeiro plano.
- [ ] Conferir a mensagem `Notificação recebida` no console.
- [ ] Tocar na notificação.
- [ ] Conferir a mensagem `Notificação tocada` no console.
- [ ] Confirmar que o aplicativo abre o detalhe do hábito com o identificador recebido.

### Validação técnica

- [ ] Executar `npx.cmd tsc --noEmit`.
- [ ] Executar `npx.cmd expo-doctor`.
- [ ] Conferir a compatibilidade das dependências.
- [ ] Confirmar que o aplicativo está executando a versão atualizada dos arquivos.
- [ ] Resolver a exceção relacionada a `setNotificationChannelAsync`.
- [ ] Repetir os testes no dispositivo após a correção.

## 7. Declaração de uso de IA

Declaro que utilizei a ferramenta de Inteligência Artificial **ChatGPT (OpenAI)** durante a atividade de desenvolvimento do aplicativo Habit Tracker, com a finalidade de apoiar a interpretação dos requisitos, a implementação da navegação com Expo Router, a configuração das abas e do menu lateral, a criação de uma rota dinâmica e a implementação e depuração de notificações locais.

As respostas geradas foram utilizadas como sugestões de implementação e orientação técnica. Realizei a revisão do código e acompanhei os testes no ambiente local, identificando problemas e solicitando ajustes quando necessário.

A IA não foi utilizada como substituta da análise crítica ou da validação do aplicativo. As limitações encontradas, especialmente o erro ainda não solucionado no agendamento das notificações, foram registradas no relatório. Assumo a responsabilidade pela revisão e pela versão final do trabalho apresentado.