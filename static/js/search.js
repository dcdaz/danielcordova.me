let fuse;
let position = 0;

async function initIndex() {
  const response = await fetch(window.location.origin  + '/search_index.en.json');
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  const searchIndex = await response.json();
  const options = {
    includeScore: false,
    includeMatches: true,
    ignoreLocation: true,
    threshold: 0.15,
    keys: [
      { name: "title", weight: 1 },
      { name: "body", weight: 2 },
      { name: "description", weight: 3 },
    ]
  };

  fuse = new Fuse(searchIndex, options);
  searchSetup = true;
}

function toggleShowResults(searchValue, searchResults) {
  if (searchValue === '') {
    searchResults.classList.add('is-hidden');
    position = 0;
  } else {
    searchResults.classList.remove('is-hidden');
  }
}

function buildResults(results) {
  let resultHtml = '';
  let resultLength = 0;
  for (const result of results) {
    resultHtml += `<a class="dropdown-item" href=${result.item.url}>${result.item.title}</a>`;
    resultLength += 1;
    if (resultLength < results.length) {
      resultHtml += `<hr class="dropdown-divider" />`;
    }
  }
  return resultHtml;
}

function initSearch() {
  initIndex();
  const MAX_RESULTS = 5;
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");

  searchInput.addEventListener('keyup', () => {
    const searchValue = searchInput.value.trim();
    const results = fuse.search(searchValue, { limit: MAX_RESULTS });
    toggleShowResults(searchValue, searchResults);
    searchResults.innerHTML = buildResults(results);
  });
}

document.addEventListener("keydown", (event) => {
  const searchInput = document.getElementById("search-input");
  if (event.key === "/") { 
    event.preventDefault(); 
    searchInput.focus();
  }

  if (event.key === "Escape" && document.activeElement === searchInput) {
    searchInput.blur();
    position = 0;
  }
});

if (
  document.readyState === "complete" ||
  (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
  initSearch();
} else {
  document.addEventListener("DOMContentLoaded", initSearch);
}
