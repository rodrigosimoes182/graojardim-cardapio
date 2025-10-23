
/**
 * menu-render.js
 * Renderiza o menu a partir de um arquivo JSON (base.json) no mesmo diretório.
 * Uso:
 *   <div id="app"></div>
 *   <script src="menu-render.js" defer></script>
 */

(function () {
  const MENU_JSON_PATH = "base.json";

  const emojiByCategory = {
    "Lanches e Salgados": "🥐",
    "Tapiocas": "🌮",
    "Doces, Bolos e Sobremesas": "🍰",
    "Cafés e Bebidas Quentes": "☕",
    "Sucos, Vitaminas e Bebidas Frias": "🧃",
    "Refrigerantes e Energéticos": "🥤",
  };

  // Ordem preferida de exibição (se alguma categoria não estiver na lista, será mostrada ao final)
  const preferredOrder = [
    "Lanches e Salgados",
    "Tapiocas",
    "Doces, Bolos e Sobremesas",
    "Cafés e Bebidas Quentes",
    "Sucos, Vitaminas e Bebidas Frias",
    "Refrigerantes e Energéticos"
  ];

  function formatBRL(value) {
    try {
      return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
    } catch (_) {
      // Fallback simples
      const fixed = Number(value).toFixed(2).replace(".", ",");
      return `R$ ${fixed}`;
    }
  }

  function createItemRow(itemObj) {
    const row = document.createElement("div");
    row.className = "menu-item";

    const nameEl = document.createElement("span");
    nameEl.className = "item-name";
    nameEl.textContent = itemObj.item;

    const priceEl = document.createElement("span");
    priceEl.className = "item-price";
    priceEl.textContent = formatBRL(itemObj.preco);

    row.appendChild(nameEl);
    row.appendChild(priceEl);
    return row;
  }

  function createCategorySection(category, items) {
    const frag = document.createDocumentFragment();

    const title = document.createElement("h2");
    const emoji = emojiByCategory[category] || "";
    title.textContent = `${emoji ? emoji + " " : ""}${category}`;

    frag.appendChild(title);

    const listWrapper = document.createElement("div");
    listWrapper.className = "menu-category";

    items.forEach((it) => listWrapper.appendChild(createItemRow(it)));

    frag.appendChild(listWrapper);
    return frag;
  }

  async function loadAndRender() {
    const app = document.getElementById("app");
    if (!app) {
      console.error('Elemento com id="app" não encontrado.');
      return;
    }

    let data;
    try {
      const res = await fetch(MENU_JSON_PATH, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      data = await res.json();
    } catch (err) {
      app.innerHTML = `<p style="color:#b00020">Não foi possível carregar o arquivo ${MENU_JSON_PATH}. Erro: ${err.message}</p>`;
      return;
    }

    // Ordena categorias pela ordem preferida e mantém as demais ao final
    const categories = Object.keys(data);
    categories.sort((a, b) => {
      const ia = preferredOrder.indexOf(a);
      const ib = preferredOrder.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });

    const container = document.createElement("div");
    container.className = "menu-container";

    categories.forEach((cat) => {
      const items = Array.isArray(data[cat]) ? data[cat] : [];
      container.appendChild(createCategorySection(cat, items));
    });

    app.innerHTML = "";
    app.appendChild(container);
  }

  // Estilos mínimos opcionais para layout (podem ser movidos para um CSS dedicado)
  const baseStyle = document.createElement("style");
  baseStyle.textContent = `
    .menu-container { max-width: 900px; margin: 0 auto; padding: 16px; }
    h2 { font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, 'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans', sans-serif; 
         margin: 24px 0 12px; font-size: 1.3rem; }
    .menu-category { display: grid; grid-template-columns: 1fr; gap: 8px; }
    .menu-item { display: flex; align-items: baseline; justify-content: space-between; border-bottom: 1px dashed #ddd; padding: 6px 0; }
    .item-name { font-size: 0.98rem; }
    .item-price { font-weight: 600; }
    @media (min-width: 640px) {
      .menu-category { grid-template-columns: 1fr; }
    }
  `;
  document.head.appendChild(baseStyle);

  // Render
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadAndRender);
  } else {
    loadAndRender();
  }
})();
