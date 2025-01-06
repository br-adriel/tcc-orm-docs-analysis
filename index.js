import chalk from 'chalk';
import { exec } from 'child_process';
import inquirer from 'inquirer';

/**
 * Extrai assinaturas do código.
 *
 * @param {string} inputDir Caminho até a pasta do código fonte
 * @param {string} outputFile Nome do arquivo de saída
 */
function runAnalysisScript(inputDir, outputFile) {
  const command = `node ./src/extract-methods-signature-from-code.js ${inputDir} ${outputFile}`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(chalk.red(`Erro ao executar o script: ${stderr}`));
      return;
    }
    console.log(chalk.green('Assinaturas extraídas com sucesso'));
  });
}

/**
 * Executa análise do índice de flesch na documentação.
 *
 * @param {string} inputDir Caminho até a pasta com a documentação.
 */
function runFleschScript(inputDir) {
  const command = `python3 ./src/flesch-index.py ${inputDir}`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(chalk.red(`Erro ao executar o script: ${stderr}`));
      return;
    }
    console.log(chalk.green(stdout));
  });
}

/**
 * Executa a busca por ocorrências dos métodos na documentação.
 *
 * @param {string} markdownDir Caminho até a pasta com os arquivos de
 * documentação.
 * @param {string} csvInput Caminho até o arquivo csv com os nomes dos métodos.
 * @param {string} csvOutput Nome do arquivo csv de saída.
 * @param {string} onlyCodeBlocks True ou False, define se apenas blocos de
 * código devem ser considerados na análise.
 */
function runMethodsOccurrenceOnDocs(
  markdownDir,
  csvInput,
  csvOutput,
  onlyCodeBlocks
) {
  const command = `python3 ./src/markdown-occurrence.py ${markdownDir} ${csvInput} ${csvOutput} ${
    onlyCodeBlocks ? 'True' : 'False'
  }`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(chalk.red(`Erro ao executar o script: ${stderr}`));
      return;
    }
    console.log(chalk.green(stdout));
  });
}

/**
 * Menu de opções
 */
function showMenu() {
  const menuOptions = [
    {
      type: 'list',
      name: 'action',
      message: chalk.cyan('Escolha uma opção:'),
      choices: [
        {
          name: chalk.cyan('Extrair assinatura de métodos e funções'),
          value: 'signatures',
        },
        {
          name: chalk.cyan('Executar análise de Flesch em arquivos Markdown'),
          value: 'flesch',
        },
        {
          name: chalk.cyan(
            'Buscar ocorrências dos nomes dos métodos na documentação'
          ),
          value: 'methodOccurrence',
        },
        {
          name: chalk.red('Sair'),
          value: 'exit',
        },
      ],
    },
  ];

  inquirer.prompt(menuOptions).then((answers) => {
    switch (answers.action) {
      case 'signatures':
        inquirer
          .prompt([
            {
              type: 'input',
              name: 'inputDir',
              message: chalk.blue(
                'Digite o caminho para o diretório do código fonte:'
              ),
            },
            {
              type: 'input',
              name: 'outputFile',
              message: chalk.blue('Digite o nome do arquivo CSV de saída:'),
            },
          ])
          .then((answers) => {
            const { inputDir, outputFile } = answers;
            runAnalysisScript(inputDir, outputFile);
          });
        break;

      case 'flesch':
        inquirer
          .prompt([
            {
              type: 'input',
              name: 'inputDir',
              message: chalk.blue(
                'Digite o caminho para o diretório da documentação:'
              ),
            },
          ])
          .then((answers) => {
            const { inputDir } = answers;
            runFleschScript(inputDir);
          });
        break;

      case 'methodOccurrence':
        inquirer
          .prompt([
            {
              type: 'input',
              name: 'markdownDir',
              message: chalk.blue(
                'Digite o caminho para o diretório da documentação:'
              ),
            },
            {
              type: 'input',
              name: 'csvInput',
              message: chalk.blue(
                'Digite o caminho para arquivo CSV com o nome dos métodos:'
              ),
            },
            {
              type: 'input',
              name: 'csvOutput',
              message: chalk.blue('Digite o caminho do arquivo CSV de saída:'),
            },
            {
              type: 'confirm',
              name: 'onlyCodeBlocks',
              message: chalk.blue('Deseja considerar apenas blocos de código?'),
              default: false,
            },
          ])
          .then((answers) => {
            const { markdownDir, csvInput, csvOutput, onlyCodeBlocks } =
              answers;
            runMethodsOccurrenceOnDocs(
              markdownDir,
              csvInput,
              csvOutput,
              onlyCodeBlocks
            );
          });
        break;

      case 'exit':
        console.log(chalk.red('Saindo...'));
        process.exit(0);

      default:
        console.log(chalk.red('Opção inválida!'));
        break;
    }
  });
}

// Exibir o menu
showMenu();
