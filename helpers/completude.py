import pandas as pd


# Arquivo criado a partir do percorrimento da AST
caminho_csv_codigo = "data/sequelize/assinaturas.csv"
# Arquivo criado manualmente com os métodos encontrados na documentação
caminho_csv_metodos_na_documentacao = "data/sequelize/metodos-na-documentacao.csv"


# Acha o número de métodos com nomes diferentes na documentação e no código
contagem_codigo = pd.read_csv(caminho_csv_codigo)[
    'Name'
].drop_duplicates().count()
contagem_docs = pd.read_csv(caminho_csv_metodos_na_documentacao)[
    'Name'
].drop_duplicates().count()

print('Documentação:', contagem_docs)
print('Código:', contagem_codigo)
