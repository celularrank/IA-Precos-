export async function buscarMercadoLivre(produto) {
  const consulta = encodeURIComponent(
    `${produto.marca} ${produto.modelo} ${produto.versao || ""}`
  );

  const url =
    `https://api.mercadolibre.com/sites/MLB/search` +
    `?q=${consulta}&limit=20&sort=price_asc`;

  const resposta = await fetch(url);

  if (!resposta.ok) {
    throw new Error(
      `Mercado Livre respondeu com HTTP ${resposta.status}`
    );
  }

  const dados = await resposta.json();

  if (!Array.isArray(dados.results)) {
    return [];
  }

  return dados.results
    .map((item) => ({
      fonte: "Mercado Livre",
      titulo: item.title,
      preco: Number(item.price),
      url: item.permalink
    }))
    .filter((item) => {
      if (!item.titulo) return false;
      if (!Number.isFinite(item.preco)) return false;
      if (item.preco <= 0) return false;
      if (!item.url) return false;

      return correspondeAoProduto(item.titulo, produto);
    });
}

function normalizar(texto) {
  return String(texto)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function palavrasImportantes(texto) {
  return normalizar(texto)
    .split(/\s+/)
    .filter((palavra) => palavra.length >= 3);
}

function correspondeAoProduto(titulo, produto) {
  const palavrasProduto = palavrasImportantes(
    `${produto.marca} ${produto.modelo} ${produto.versao || ""}`
  );

  const palavrasTitulo = new Set(
    palavrasImportantes(titulo)
  );

  if (palavrasProduto.length === 0) {
    return false;
  }

  const encontradas = palavrasProduto.filter((palavra) =>
    palavrasTitulo.has(palavra)
  );

  const similaridade =
    encontradas.length / palavrasProduto.length;

  return similaridade >= 0.6;
}
