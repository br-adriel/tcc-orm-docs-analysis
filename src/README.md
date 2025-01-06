# Scripts de extração de dados

A seguir são descritos os scripts presentes nessa pasta e os argumentos
necessários para a execução de cada um deles.

## `extract-methods-signature-from-code.js`

Extrai assinaturas de métodos e funções públicas de arquivos JavaScript,
TypeScript e TSX, gerando um arquivo CSV com essas informações.

- Argumentos

  - `inputDir` (opcional): Caminho para o diretório contendo os arquivos de
    código a serem analisados. O valor padrão é `./analyze`.

  - `outputFile` (opcional): Caminho para o arquivo CSV de saída. O valor padrão
    é `./method-signatures.csv`.

## `flesch-index.py`

Calcula o índice de Flesch para arquivos Markdown em um diretório, indicando a
facilidade de leitura dos textos.

- Argumentos

  - `markdown_dir`: Caminho para o diretório contendo os arquivos Markdown.

## `markdown-occurrence.py`

Procura por funções específicas em arquivos Markdown e gera um CSV listando as
ocorrências.

- Argumentos

  - `markdown_dir`: Diretório onde estão localizados os arquivos Markdown.

  - `csv_entrada`: Caminho para o arquivo CSV contendo a lista de funções a
    serem procuradas.

  - `csv_saida`: Caminho para o arquivo CSV onde os resultados serão salvos.

  - `apenas_blocos_codigo` (opcional): Booleano indicando se a busca deve ser
    feita apenas em blocos de código. Valores interpretados como `True`:
    `true`, `1`, `t`, `y`, `yes`. O valor padrão é `False`.
