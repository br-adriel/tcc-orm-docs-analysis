import os
import pandas as pd
from markdown import markdown
from bs4 import BeautifulSoup
import argparse
from mistletoe import Document
from mistletoe.html_renderer import HTMLRenderer


def limpar_conteudo(conteudo, apenas_blocos_codigo=False, mdx=False):
    """
    Limpa o conteúdo de um arquivo Markdown removendo blocos de código, links,
    imagens e tags HTML, deixando apenas o texto puro e blocos de código.

    Args:
        conteudo (str): O conteúdo do arquivo Markdown a ser limpo.
        apenas_blocos_codigo (bool): Se apenas blocos de codigo devem ser
        mantidos.
        mdx (bool): Se o arquivo usa mdx ao invés de md.

    Returns:
        str: O conteúdo limpo, contendo apenas texto sem links, imagens ou tags
        HTML.
    """

    # Converte o conteúdo Markdown para HTML
    html = ''
    if mdx:
        doc = Document(conteudo)
        html = HTMLRenderer().render(doc)
    else:
        html = markdown(conteudo)

    # Usa BeautifulSoup para processar o HTML e extrair texto puro
    soup = BeautifulSoup(html, "html.parser")

    if apenas_blocos_codigo:
        # Extração de blocos de código apenas
        blocos_codigo = []
        for tag in soup.find_all('code'):
            blocos_codigo.append(tag.get_text())
        return "\n".join(blocos_codigo)

    # Remove links (preserva o texto do link)
    for a in soup.find_all('a'):
        a.unwrap()

    # Remove imagens
    for img in soup.find_all('img'):
        img.unwrap()

    # Remove qualquer tag HTML restante
    for tag in soup.find_all(True):
        tag.unwrap()

    # Remove linhas em branco
    conteudo_limpo = "\n".join(
        [linha.strip() for linha in str(soup).splitlines() if linha.strip()])

    # Retorna o texto limpo
    return conteudo_limpo


def ler_funcoes_csv(caminho_csv):
    """
    Lê um arquivo CSV contendo os nomes das funções e retorna uma lista com
    esses nomes.

    Args:
        caminho_csv (str): Caminho para o arquivo CSV com os nomes das funções.

    Returns:
        list: Lista de nomes das funções encontradas no arquivo CSV.
    """

    # Carrega o CSV em um DataFrame do pandas
    df = pd.read_csv(caminho_csv)

    # Assume que o nome das funções está na coluna 'Name'
    return df['Name'].tolist()


def buscar_funcoes_em_conteudo(conteudo, funcoes, nome_arquivo):
    """
    Busca por funções definidas em um conteúdo de texto e retorna as linhas onde
    essas funções são encontradas.

    Args:
        conteudo (str): O conteúdo de texto onde as funções serão procuradas.
        funcoes (list): Lista de funções a serem procuradas no conteúdo.
        nome_arquivo (str): O nome do arquivo onde a função foi encontrada.

    Returns:
        list: Lista de dicionários contendo o nome da função e o arquivo
    """
    resultados = []

    for funcao in funcoes:
        if (funcao) in conteudo:
            resultados.append({
                'Name': funcao,
                'File': nome_arquivo
            })
    return resultados


def procurar_funcoes_em_markdowns(
        diretorio_markdown,
        caminho_csv_entrada,
        caminho_csv_saida,
        apenas_blocos_codigo=False
):
    """
    Procura por funções definidas em arquivos Markdown dentro de um diretório,
    ignorando blocos de código, links e imagens. O resultado é salvo em um
    arquivo CSV com os nomes das funções e suas localizações.

    Args:
        diretorio_markdown (str): O diretório onde os arquivos Markdown estão
        localizados.
        caminho_csv_entrada (str): O caminho do arquivo CSV contendo os nomes
        das funções a serem procuradas.
        caminho_csv_saida (str): O caminho onde o arquivo CSV com os resultados
        será salvo.
        apenas_blocos_codigo (bool): Se a busca deve ser feita apenas em
        blocos de código.
    """

    funcoes = ler_funcoes_csv(caminho_csv_entrada)
    todos_resultados = []

    # Percorre os arquivos markdown no diretório
    for root, dirs, files in os.walk(diretorio_markdown):
        for file in files:
            if file.endswith('.md') or file.endswith('.mdx'):
                file_path = os.path.join(root, file)
                with open(file_path, "r", encoding="utf-8") as f:
                    conteudo = f.read()
                    conteudo_limpo = limpar_conteudo(
                        conteudo,
                        apenas_blocos_codigo,
                        file.endswith('.mdx')
                    )
                    funcoes_encontradas = buscar_funcoes_em_conteudo(
                        conteudo_limpo, funcoes, file
                    )

                    todos_resultados.extend(funcoes_encontradas)

    # Cria um DataFrame com os resultados
    df_resultados = pd.DataFrame(todos_resultados)

    if apenas_blocos_codigo:
        df_resultados = df_resultados.drop_duplicates()

    # Salva o DataFrame em um arquivo CSV de saída
    df_resultados['Name'].drop_duplicates().to_csv(
        caminho_csv_saida, index=False, encoding='utf-8'
    )


def str_to_bool(value):
    """
    Converte uma string para um valor booleano.

    Args:
        value (str): A string a ser convertida para um valor booleano.
    """
    return value.lower() in ('true', '1', 't', 'y', 'yes')


# Exemplo de uso com argparse para pegar o diretório via linha de comando
if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description='Procura funções em arquivos Markdown, ignorando blocos de código.'
    )
    parser.add_argument(
        'markdown_dir',
        type=str,
        help='Diretório contendo os arquivos Markdown'
    )
    parser.add_argument(
        'csv_entrada',
        type=str,
        help='Caminho para o arquivo CSV com os nomes das funções'
    )
    parser.add_argument(
        'csv_saida',
        type=str,
        help='Caminho para salvar o arquivo CSV de resultados'
    )
    parser.add_argument(
        'apenas_blocos_codigo',
        type=str_to_bool,
        help='Se apenas blocos de código devem ser considerados',
        default=False
    )

    args = parser.parse_args()

    # Chama a função principal
    procurar_funcoes_em_markdowns(
        args.markdown_dir,
        args.csv_entrada,
        args.csv_saida,
        args.apenas_blocos_codigo
    )
