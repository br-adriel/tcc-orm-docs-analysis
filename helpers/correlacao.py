from scipy.stats import pearsonr

# Dados
downloads = [11675998, 8800060, 8102336, 2630616, 752540]
atualizacao = [72.72, 61.47, 70.45, 82.89, 81.56]
completude = [4.29, 28.14, 20.72, 78.90, 32.94]
exemplos_de_codigo = [100.00, 96.54, 98.24, 98.90, 78.65]
facilidade_de_uso = [100.00, 100.00, 100.00, 100.00, 100.00]
legibilidade = [49.46, 45.10, 49.33, 42.93, 48.27]


# Função para calcular correlação e p-valor
def calcular_correlacao(x, y):
    return pearsonr(x, y)


# Cálculo das correlações
correlacoes = {
    "Atualizacao": calcular_correlacao(downloads, atualizacao),
    "Completude": calcular_correlacao(downloads, completude),
    "Exemplos de Código": calcular_correlacao(downloads, exemplos_de_codigo),
    "Facilidade de Uso": calcular_correlacao(downloads, facilidade_de_uso),
    "Legibilidade": calcular_correlacao(downloads, legibilidade),
}

# Exibição dos resultados
for aspecto, (r, p) in correlacoes.items():
    print(f"{aspecto}: r = {r:.4f}, p = {p:.4f}")
