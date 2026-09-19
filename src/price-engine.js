export function validarCandidato(candidato) {
  if (!candidato) return false;

  if (!Number.isFinite(candidato.preco)) {
    return false;
  }

  if (candidato.preco <= 0) {
    return false;
  }

  if (!candidato.url) {
    return false;
  }

  return true;
}

function mediana(numeros) {
  if (numeros.length === 0) {
    return null;
  }

  const ordenados = [...numeros].sort((a, b) => a - b);
  const meio = Math.floor(ordenados.length / 2);

  if (ordenados.length % 2 === 0) {
    return (
      (ordenados[meio - 1] + ordenados[meio]) / 2
    );
  }

  return ordenados[meio];
}

export function escolherPreco(candidatos) {
  const validos = candidatos.filter(validarCandidato);

  if (validos.length === 0) {
    return null;
  }

  const precos = validos.map((item) => item.preco);
  const centro = mediana(precos);

  const filtrados = validos.filter((item) => {
    return (
      item.preco >= centro * 0.65 &&
      item.preco <= centro * 1.35
    );
  });

  if (filtrados.length === 0) {
    return null;
  }

  const precoFinal = mediana(
    filtrados.map((item) => item.preco)
  );

  const maisProximo = filtrados.reduce((melhor, atual) => {
    if (!melhor) return atual;

    const distanciaAtual =
      Math.abs(atual.preco - precoFinal);

    const distanciaMelhor =
      Math.abs(melhor.preco - precoFinal);

    return distanciaAtual < distanciaMelhor
      ? atual
      : melhor;
  }, null);

  return {
    preco: Number(precoFinal.toFixed(2)),
    fonte: maisProximo.fonte,
    url: maisProximo.url,
    titulo: maisProximo.titulo,
    quantidadeEncontrada: filtrados.length
  };
}
