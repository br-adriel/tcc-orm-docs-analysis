import os
import textstat
import pandas as pd
import re
from bs4 import BeautifulSoup
from markdown import markdown
import argparse
from mistletoe import Document
from mistletoe.html_renderer import HTMLRenderer


# Configuração do argparse para pegar o diretório via linha de comando
parser = argparse.ArgumentParser(
    description='Processa arquivos Markdown para calcular o Índice de Flesch.'
)
parser.add_argument(
    'markdown_dir',
    type=str,
    help='Diretório contendo os arquivos Markdown'
)
args = parser.parse_args()

# Pasta onde estão os arquivos Markdown
markdown_dir = args.markdown_dir

# Lista para armazenar os resultados
resultados = []


def limpar_conteudo(conteudo, mdx=False):
    """
    Limpa o conteúdo de um arquivo Markdown removendo blocos de código, links,
    imagens e tags HTML, deixando apenas o texto puro.

    Args:
        conteudo (str): O conteúdo do arquivo Markdown a ser limpo.
        mdx (bool): Se o arquivo usa mdx ao invés de md.

    Returns:
        str: O conteúdo limpo, contendo apenas texto sem links, imagens ou tags
        HTML.
    """

    # Remove conteúdo de blocos de código no formato Markdown
    conteudo = re.sub(r'```[\s\S]*?```', '', conteudo)

    # Converte o conteúdo Markdown para HTML
    html = ''
    if mdx:
        doc = Document(conteudo)
        html = HTMLRenderer().render(doc)
    else:
        html = markdown(conteudo)

    # Usa BeautifulSoup para processar o HTML e extrair texto puro
    soup = BeautifulSoup(html, "html.parser")

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


# Percorre todos os arquivos na pasta
for root, dirs, files in os.walk(markdown_dir):
    for file in files:
        if file.endswith(".md") or file.endswith('.mdx'):
            file_path = os.path.join(root, file)
            with open(file_path, "r", encoding="utf-8") as f:
                conteudo = f.read()

                # Limpa o conteúdo para remover links, imagens, e blocos de
                # código
                conteudo_limpo = limpar_conteudo(
                    conteudo, file.endswith('.mdx')
                )

                # Calcula o índice de Flesch apenas se o conteúdo limpo não
                # estiver vazio
                if conteudo_limpo.strip():
                    indice_flesch = textstat.flesch_reading_ease(
                        conteudo_limpo
                    )

                    # Impede índice negativo
                    if indice_flesch < 0:
                        indice_flesch = None
                else:
                    # Define como None se o texto limpo estiver vazio
                    indice_flesch = None

                # Adiciona os resultados
                if indice_flesch is not None:
                    resultados.append(
                        {
                            "Arquivo": file,
                            "Índice de Flesch": indice_flesch
                        }
                    )

                # Escreve o conteúdo limpo em um arquivo de texto separado
                # with open(f"{file}.txt", "w", encoding="utf-8") as output_file:
                #     output_file.write(conteudo_limpo)

# Cria um DataFrame com os resultados e os ordena de forma crescente
df = pd.DataFrame(resultados)
df = df.sort_values('Índice de Flesch')

# Calcula a média geral
media_flesch = df["Índice de Flesch"].mean()
mediana_flesch = df["Índice de Flesch"].median()

range = pd.cut(
    df['Índice de Flesch'],
    [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
)
counts = range.value_counts().sort_index()
print(counts)

# Adiciona a média ao DataFrame
df.loc[len(df.index)] = {
    "Arquivo": "Média",
    "Índice de Flesch": media_flesch
}

# Adiciona a mediana ao DataFrame
df.loc[len(df.index)] = {
    "Arquivo": "Mediana",
    "Índice de Flesch": mediana_flesch
}

# Salva a tabela em um arquivo CSV
df.to_csv("flesch.csv", index=False)

# Exibe a tabela
# print(df)
