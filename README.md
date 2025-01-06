# Scripts auxiliares

Esse repositório contém os script auxiliares utilizados para a extração e
processamento de dados das bibliotecas de software analisadas no trabalho de
conclusão do curso intitulado "Documentação de software para usuários
desenvolvedores: uma avaliação de bibliotecas de software populares".

## Instalação

Para executar esses scripts é preciso que você tenha instalação em sua máquina o
[NodeJS](https://nodejs.org/en) e o [Python](https://www.python.org/).

Os scripts foram testados nas versões 22.12.0 do NodeJS e 3.12.3 do Python,
versões posteriores dessas ferramentas devem ser compatíveis sem a necessidade
de alteração dos scripts, mas caso você encontre problemas utilize as versões
mencionadas.

1. Faça download do repositório e, caso em formato compactado, extraia o
   conteúdo para uma pasta em seu computador.

2. Navegue até a pasta que contém os arquivos `package.json` e
   `requirements.txt` e a abra em um terminal.

3. Execute o comando a seguir para instalar as dependências do NodeJS:

   ```bash
   npm i
   ```

4. Crie um ambiente virtual python com o comando a seguir:

   - Linux

     - Talvez seja necessário executar o comando a seguir antes:

       ```bash
       sudo apt install python3-virtualenv
       ```

     - Em seguida, crie o ambiente virtual:

       ```bash
       python3 -m venv .venv
       ```

   - Windows

   ```powershell
   py -m venv .venv
   ```

5. Ative o ambiente virtual Python

   - Linux

     ```bash
     source .venv/bin/activate
     ```

   - Windows

     ```powershell
     .venv\Scripts\activate
     ```

6. Execute o comando a seguir para instalar as dependências do Python:

   ```bash
   pip install -r requirements.txt
   ```

## Execução dos scripts

Os scripts da pasta `src` podem ser executados diretamente ou através do menu de
linha de comando desenvolvido com NodeJS. Entretanto esse segundo modo de
execução foi implementado apenas no Linux, para o Windows o ideal é executá-los
diretamente com o comando `python` ou `node` a depender da linguagem do script.
A seguir são mostradas instruções de como executar eles de cada uma dessas
formas.

Já os scripts da pasta `helpers` não possuem um menu de linha de comando, sua
utilização deve ser feita a partir da alteração dos argumentos presentes neles e
executados diretamente no terminal.

### Execução via menu

Esse modo de execução se aplica apenas aos scripts da pasta `src` e foram
testados apenas no linux. Em sistemas Windows, prefira a execução direta no
terminal, descrita na próxima seção.

1. Acesse a pasta na qual se encontra o arquivo `index.js` via terminal e
   execute o comando a seguir para inicializar o menu interativo. Siga as
   instruções na tela de acordo com a operação que deseja realizar.

   ```bash
   node .
   ```

### Execução direta no terminal

1. Acesse via terminal a pasta na qual o script que você deseja executar se
   encontra.

2. Para scripts com extensão `.js`, utilize o seguinte formato:

   ```bash
   node nome-do-arquivo.js parametro1 parametro2
   ```

3. Para scripts com extensão `.py`, utilize o seguinte formato:

   - Linux

     ```bash
     python3 nome-do-arquivo.py argumento1 argumento2
     ```

   - Windows

     ```powershell
     py nome-do-arquivo.py argumento1 argumento2
     ```

Os argumentos para cada script podem ser encontrados nos arquivos `README.md`
localizados dentro das pastas em que eles se encontram.
