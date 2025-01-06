import pandas as pd


# Arquivo criado manualmente com os métodos encontrados na documentação
caminho_csv_metodos_na_documentacao = "data/sequelize/metodos-na-documentacao.csv"
# Arquivo com a ocorrencia dos nomes em blocos de codigo
caminho_csv_ocorrencia_exemplos = "data/sequelize/metodos-com-exemplo.csv"

# Se True, encontra M_name_code
# Se False, encontra M_name_example
CRIAR_RELACAO_NOMES = False


if CRIAR_RELACAO_NOMES:
    # Acha o M_name_code =======================================================
    csv_docs = pd.read_csv(caminho_csv_metodos_na_documentacao)
    arquivo_relacao = csv_docs.drop_duplicates()

    print(
        'Métodos encontrados na documentação:',
        arquivo_relacao['Name'].count()
    )

    arquivo_relacao.to_csv('metodos-encontrados-nos-docs.csv', index=False)
else:
    # Acha o M_name_example ====================================================
    print(pd.read_csv(caminho_csv_ocorrencia_exemplos)['Name'].count())
