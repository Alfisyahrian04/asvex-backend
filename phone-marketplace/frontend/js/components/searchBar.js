function renderSearchBar(){

return `

<div class="search-wrapper">

<input
type="text"
id="search-input"
placeholder="Cari produk..."
/>

<select id="sort-select">

<option value="">
Urutkan
</option>

<option value="latest">
Terbaru
</option>

<option value="low">
Harga Termurah
</option>

<option value="high">
Harga Termahal
</option>

</select>

</div>

`;

}

window.renderSearchBar =
renderSearchBar;
