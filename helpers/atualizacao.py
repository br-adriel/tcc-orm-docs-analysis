import pandas as pd


# Arquivo criado a partir do percorrimento da AST
caminho_csv_codigo = "data/sequelize/assinaturas.csv"
# Arquivo criado manualmente com os métodos encontrados na documentação
caminho_csv_metodos_na_documentacao = "data/sequelize/metodos-na-documentacao.csv"
# Arquivo preenchido manualmente com a ocorrencia das assinaturas na documetação
caminho_csv_ocorrencia_assinaturas = "data/sequelize/assinaturas-na-documentacao.csv"

# Se True, encontra M_signature_equal_code
# Se False, encontra M_name_equal_code
CONTAR_ASSINATURAS = False


if not CONTAR_ASSINATURAS:
    # Acha o M_name_equal_code =================================================
    csv_codigo = pd.read_csv(caminho_csv_codigo)
    csv_docs = pd.read_csv(caminho_csv_metodos_na_documentacao)

    nomes_dos_metodos_na_documentacao = csv_docs['Name'].drop_duplicates()

    # Remove os métodos do codigo que nao tem como estar na documentacao por seu
    # nome nao ter siso visualizado lá. Métodos com nomes iguais mas assinaturas
    # diferentes são contados mais de uma vez.
    juncao_arquivos = csv_codigo.merge(
        nomes_dos_metodos_na_documentacao,
        on='Name',
        how='inner'
    )

    print(
        'Métodos com nome na documentação igual no código:',
        juncao_arquivos['Signature'].drop_duplicates().count()
    )

    # Adiciona uma coluna para ser preenchida manualmente de acordo com a
    # ocorrencia de cada assinatura na documentação
    arquivo_preenchimento = juncao_arquivos[
        ['Name', 'Signature']
    ].drop_duplicates()
    arquivo_preenchimento['Match'] = pd.Series()
    arquivo_preenchimento.sort_values('Name').to_csv(
        "assinaturas-na-documentacao.csv",
        index=False
    )
else:
    # Acha o M_signature_equal_code ============================================
    csv_assinaturas = pd.read_csv(caminho_csv_ocorrencia_assinaturas)
    print(csv_assinaturas['Match'].value_counts())
