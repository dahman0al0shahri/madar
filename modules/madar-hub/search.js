// Hosted network command-reference adapter. General hub search lives in
// public/hub/search.mjs; this function receives every DOM/normalization input.
function filterCommandCards({ query, cards, emptyMessage, normalize }) {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  let shown = 0;
  for (const card of cards) {
    card.hidden = !words.every(word => card.dataset.commandSearch.includes(word));
    if (!card.hidden) shown++;
  }
  emptyMessage.hidden = Boolean(shown);
  return shown;
}
