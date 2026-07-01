
const themeToggleBtn = document.getElementById('theme-toggle');
const countriesGrid = document.getElementById('countries-grid');
const searchInput = document.getElementById('search-input');
const regionFilter = document.getElementById('region-filter');

let allCountries = [];

if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
}

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }
});

async function fetchCountries() {
    try {
        countriesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Loading countries...</p>';
        
        const response = await fetch('./data.json');
        // const response = await fetch('https://restcountries.com/v3.1/all');
        
        if (!response.ok) throw new Error('No se pudo conectar con la API');
        const data = await response.json();
        allCountries = data;
        
        renderCountries(allCountries);
    } catch (error) {
        console.error('Error:', error);
        countriesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: red;">Something went wrong while fetching data.</p>';
    }
}

function renderCountries(countries) {
    countriesGrid.innerHTML = ''; 

    if (countries.length === 0) {
        countriesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No se encontraron países.</p>';
        return;
    }

    countries.forEach(country => {
        const countryCard = document.createElement('div');
        countryCard.classList.add('country-card');

        countryCard.addEventListener('click', () => {
            window.location.href = `./paginas/detalle.html?code=${country.alpha3Code}`;
        });

        const countryName = country.name;
        const capital = country.capital ? country.capital : 'N/A';

        countryCard.innerHTML = `
            <img src="${country.flags.png}" alt="Bandera de ${countryName}" loading="lazy">
            <div style="padding: 24px 24px 32px 24px;">
                <h3 style="margin-bottom: 16px; font-size: 18px; font-weight: 800;">${countryName}</h3>
                <p style="margin-bottom: 4px; font-size: 14px;"><strong style="font-weight: 600;">Population:</strong> ${country.population.toLocaleString()}</p>
                <p style="margin-bottom: 4px; font-size: 14px;"><strong style="font-weight: 600;">Region:</strong> ${country.region}</p>
                <p style="font-size: 14px;"><strong style="font-weight: 600;">Capital:</strong> ${capital}</p>
            </div>
        `;
        
        countriesGrid.appendChild(countryCard);
    });
}

function filterCountries() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedRegion = regionFilter.value;

    const filteredList = allCountries.filter(country => {
        const matchesSearch = country.name.toLowerCase().includes(searchTerm);
        const matchesRegion = selectedRegion === 'all' || country.region === selectedRegion;
        
        return matchesSearch && matchesRegion;
    });

    renderCountries(filteredList);
}

searchInput.addEventListener('input', filterCountries);
regionFilter.addEventListener('change', filterCountries);

fetchCountries();
