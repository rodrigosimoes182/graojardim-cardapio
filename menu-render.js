/**
 * menu-render.js
 * Lê menu.json e renderiza categorias e itens com opção de expandir/colapsar.
 * Requer um elemento <div id="app"></div> na página.
 * Não injeta CSS; estilos devem estar em stylelist.css.
 */
(function () {
  const MENU_JSON_PATH = "base.json";

  // Emojis por categoria (opcional)
  const emojiByCategory = {
    "Lanches e Salgados": "🥐",
    "Tapiocas": "🌮",
    "Doces, Bolos e Sobremesas": "🍰",
    "Cafés e Bebidas Quentes": "☕",
    "Sucos, Vitaminas e Bebidas Frias": "🧃",
    "Refrigerantes e Energéticos": "🥤",
  };

  // Ordem preferida das categorias (as demais ficam ao final, em ordem alfabética)
  const preferredOrder = [
    "Lanches e Salgados",
    "Tapiocas",
    "Doces, Bolos e Sobremesas",
    "Cafés e Bebidas Quentes",
    "Sucos, Vitaminas e Bebidas Frias",
    "Refrigerantes e Energéticos",
  ];

  // -------- Utilidades --------
  function formatBRL(value) {
    const n = typeof value === "number" ? value : Number(value);
    try {
      return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
    } catch {
      const fixed = isFinite(n) ? n.toFixed(2).replace(".", ",") : "0,00";
      return `R$ ${fixed}`;
    }
  }

  function slugify(str) {
    return String(str || "")
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  function collapsedKey(category) {
    return `menuCollapsed:${category}`;
  }

  function safeGetItem(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  }
  function safeSetItem(key, val) {
    try { localStorage.setItem(key, val); } catch {}
  }

  function setToggleVisual(btn, collapsed) {
    btn.setAttribute("aria-expanded", String(!collapsed));
    btn.textContent = collapsed ? "▶ Mostrar" : "▼ Ocultar";
  }

  // -------- Construção de elementos --------
  function createItemRow(itemObj) {
    const row = document.createElement("div");
    row.className = "menu-item";

    const nameEl = document.createElement("span");
    nameEl.className = "item-name";
    nameEl.textContent = String(itemObj?.item ?? "").trim();

    const priceEl = document.createElement("span");
    priceEl.className = "item-price";
    priceEl.textContent = formatBRL(itemObj?.preco);

    row.appendChild(nameEl);
    row.appendChild(priceEl);
    return row;
  }

  function createCategorySection(category, items) {
    const safeCategory = typeof category === "string" ? category : "Categoria";
    const safeItems = Array.isArray(items) ? items : [];

    const section = document.createElement("section");
    section.className = "menu-section";

    // Header
    const header = document.createElement("div");
    header.className = "menu-section-header";

    const title = document.createElement("h2");
    title.className = "menu-section-title";
    const emoji = (emojiByCategory && emojiByCategory[safeCategory]) ? emojiByCategory[safeCategory] : "";
    title.textContent = `${emoji ? emoji + " " : ""}${safeCategory}`;

    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "menu-section-toggle";

    // Painel controlado
    const panelId = `panel-${slugify(safeCategory) || Math.random().toString(36).slice(2)}`;
    const listWrapper = document.createElement("div");
    listWrapper.className = "menu-category";
    listWrapper.id = panelId;

    toggleBtn.setAttribute("aria-controls", panelId);

    // Estado inicial do painel (default agora é: COLAPSADO)
    const stored = safeGetItem(collapsedKey(safeCategory));
    const isCollapsed = stored === null ? true : stored === "true";
    listWrapper.hidden = isCollapsed;
    setToggleVisual(toggleBtn, isCollapsed)

    // Itens
    for (const it of safeItems) {
      if (!it || typeof it !== "object") continue;
      listWrapper.appendChild(createItemRow(it));
    }

    // Toggle
    toggleBtn.addEventListener("click", () => {
      const newCollapsed = !listWrapper.hidden ? true : false;
      listWrapper.hidden = newCollapsed;
      setToggleVisual(toggleBtn, newCollapsed);
      safeSetItem(collapsedKey(safeCategory), String(newCollapsed));
    });

    header.appendChild(title);
    header.appendChild(toggleBtn);

    section.appendChild(header);
    section.appendChild(listWrapper);

    return section;
  }

  // -------- Carregamento e render --------
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

    const categories = Object.keys(data || {});
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

    for (const cat of categories) {
      const items = Array.isArray(data[cat]) ? data[cat] : [];
      container.appendChild(createCategorySection(cat, items));
    }

    app.innerHTML = "";
    app.appendChild(container);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadAndRender);
  } else {
    loadAndRender();
  }
})();
