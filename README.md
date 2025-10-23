# Grão Jardim - Cardápio

Cardápio estático para a cafeteria "Grão Jardim". Projeto simples em HTML e CSS para exibir categorias e itens com preços.

## Conteúdo do repositório
- [index.html](index.html) — marcação do cardápio e estrutura das seções (header, categorias e itens).
- [stylelist.css](stylelist.css) — estilos principais, incluindo os seletores [`header`](index.html), [`.menu-container`](stylelist.css), [`.category`](stylelist.css), [`.menu-item`](stylelist.css), [`.item-name`](stylelist.css) e [`.item-price`](stylelist.css).

## Como visualizar
Basta abrir o arquivo [index.html](index.html) em um navegador (duplo clique ou arrastar para o navegador). O layout usa a fonte do Google Fonts definida no próprio HTML.

## Personalização
- Para editar itens ou preços, modifique [index.html](index.html) dentro das divs com a classe `menu-item`.
- Para alterar estilos (cores, espaçamentos, tipografia), edite [stylelist.css](stylelist.css) — por exemplo, a caixa principal é controlada por `.menu-container` e cada categoria por `.category`.

## Estrutura principal
- Header com nome e subtítulo.
- Seções por categoria (ex.: "Lanches e Salgados", "Tapiocas", "Doces", "Cafés", "Sucos", "Refrigerantes").
- Cada item tem `item-name` e `item-price` para facilitar estilos.

## Contribuição
1. Faça um fork.
2. Crie uma branch com a alteração.
3. Abra um pull request descrevendo as mudanças.

## Licença
Sinta-se à vontade para usar e adaptar este cardápio. Incluir uma licença explícita caso deseje compartilhar publicamente (ex.: MIT).