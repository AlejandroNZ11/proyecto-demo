const themeToggleBtn = document.getElementById('theme-toggle');
const backBtn = document.getElementById('back-btn');
const countryDetailsContainer = document.getElementById('country-details');

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

backBtn.addEventListener('click', () => {
    window.location.href = '../index.html';
});

const urlParams = new URLSearchParams(window.location.search);
const countryCode = urlParams.get('code');

// 4. Buscar la información del país
async function getCountryDetails() {
    try {
        const response = await fetch('../data.json');
        const data = await response.json();

        const country = data.find(c => c.alpha3Code === countryCode);

        if (!country) {
            countryDetailsContainer.innerHTML = '<p>País no encontrado.</p>';
            return;
        }

        renderDetails(country, data);
    } catch (error) {
        console.error('Error:', error);
        countryDetailsContainer.innerHTML = '<p>Error al cargar los detalles.</p>';
    }
}

function renderDetails(country, allData) {

    const nativeName = country.nativeName || country.name;
    const topLevelDomain = country.topLevelDomain ? country.topLevelDomain.join(', ') : 'N/A';
    const currencies = country.currencies ? country.currencies.map(c => c.name).join(', ') : 'N/A';
    const languages = country.languages ? country.languages.map(l => l.name).join(', ') : 'N/A';
    const capital = country.capital ? country.capital : 'N/A';

    // Generar botones de países fronterizos
    let bordersHTML = '';
    if (country.borders && country.borders.length > 0) {
        const borderButtons = country.borders.map(borderCode => {
            const borderCountry = allData.find(c => c.alpha3Code === borderCode);
            return `<button class="border-btn" onclick="window.location.href='detalle.html?code=${borderCode}'">${borderCountry.name}</button>`;
        }).join('');
        
        bordersHTML = `<strong>Border Countries:</strong> ${borderButtons}`;
    } else {
        bordersHTML = '<strong>Border Countries:</strong> None';
    }

    countryDetailsContainer.innerHTML = `
        <img src="${country.flags.svg || country.flags.png}" alt="Bandera de ${country.name}">
        
        <div class="details-text">
            <h2>${country.name}</h2>
            
            <div class="info-columns">
                <div>
                    <p><strong>Native Name:</strong> ${nativeName}</p>
                    <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                    <p><strong>Region:</strong> ${country.region}</p>
                    <p><strong>Sub Region:</strong> ${country.subregion || 'N/A'}</p>
                    <p><strong>Capital:</strong> ${capital}</p>
                </div>
                <div>
                    <p><strong>Top Level Domain:</strong> ${topLevelDomain}</p>
                    <p><strong>Currencies:</strong> ${currencies}</p>
                    <p><strong>Languages:</strong> ${languages}</p>
                </div>
            </div>
            
            <div class="border-countries">
                ${bordersHTML}
            </div>
        </div>
    `;
}


getCountryDetails();
