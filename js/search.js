// search.js

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

function redirectToSearchResults() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm) {
        window.location.href = `search-results.html?query=${encodeURIComponent(searchTerm)}`;
    }
}

searchButton.addEventListener("click", redirectToSearchResults);

// busca al tocar el enter
searchInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        redirectToSearchResults()
    }
});