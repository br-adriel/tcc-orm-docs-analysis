# Scripts auxiliares de análise

Abaixo estão descritos os scripts incluídos nesta pasta, suas funcionalidades e
os argumentos necessários para sua execução.

## `atualizacao.py`

Este script analisa a relação entre métodos do código e sua documentação,
verificando a correspondência de nomes e assinaturas, além de gerar arquivos
auxiliares para revisão manual.

- Variáveis e configurações:

  - `CONTAR_ASSINATURAS` (boolean): Determina o modo de operação:

    - `True`: Contabiliza métodos com assinaturas idênticas entre código e
      documentação.

    - `False`: Contabiliza métodos com nomes idênticos entre código e
      documentação.

  - `caminho_csv_codigo` (string): Caminho para o arquivo csv com as assinaturas
    extraídas do código.

  - `caminho_csv_metodos_na_documentacao` (string): Caminho para o arquivo csv com o
    nome dos métodos encontrados na documentação.

  - `caminho_csv_ocorrencia_assinaturas` (string): Arquivo gerado pelo script quando
    `CONTAR_ASSINATURAS` é `False`. Após o preenchimento manual de sua coluna
    `Match`, ele é passado no script novamente com `CONTAR_ASSINATURAS` igual a
    `True` para contabilizar os métodos e funções que tem assinatura
    correspondente na documentação.

## `completrude.py`

Este script calcula e compara o número de métodos presentes no código e na
documentação, destacando discrepâncias.

- Variáveis e configurações:

  - `caminho_csv_codigo` (string): Caminho para o arquivo csv com as assinaturas
    dos métodos detectados na ast da biblioteca.

  - `caminho_csv_metodos_na_documentacao` (string): Caminho para o arquivo csv
    com o nome dos métodos observados na documentação.

## `example.py`

Analisa e relaciona nomes de métodos encontrados na documentação com ocorrências
em exemplos de código.

- Variáveis e configurações:

  - `CRIAR_RELACAO_NOMES` (boolean): Determina o modo de operação:

    - `True`: Cria a relação de nomes dos métodos presentes na documentação sem
      a presença de duplicatas.

    - `False`: Contabiliza métodos listados no csv que carrega os nomes
      dos métodos identificados em blocos de código da documentação.

  - `caminho_csv_metodos_na_documentacao` (string): Caminho para o arquivo
    criado manualmente com os métodos encontrados na documentação.

  - `caminho_csv_ocorrencia_exemplos` (string): Caminho para o arquivo com a
    ocorrencia dos nomes dos métodos em blocos de codigo.

## `correlação.py`

Calcula a correlação entre as diferentes métricas avaliadas e o número de
downloads das bilbiotecas para avaliar se há uma relação entre esses fatores.
Os dados se encontram diretamente no código e foram retirados dos resultados
obtidos com a análise das bibliotecas.
