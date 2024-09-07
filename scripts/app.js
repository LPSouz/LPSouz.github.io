// Função para preencher o datalist com opções do JSON
function preencherDatalist() {
    fetch('http://localhost:3000/games.json') 
        .then(response => response.json())
        .then(jogos => {
            const datalist = document.getElementById('jogo-list');
            datalist.innerHTML = ''; // Limpa o datalist antes de adicionar novas opções
            for (const nomeJogo in jogos) {
                const option = document.createElement('option');
                option.value = nomeJogo;
                datalist.appendChild(option);
            }
        })
        .catch(error => {
            console.error('Erro ao carregar o JSON:', error);
        });
}

document.addEventListener('DOMContentLoaded', preencherDatalist);

function mostrarPopup() {
    const popup = document.getElementById('popup');
    popup.classList.add('show');
}

function esconderPopup() {
    const popup = document.getElementById('popup')
    popup.classList.remove('show')
}

document.getElementById('closePopup').addEventListener('click', esconderPopup)

function buscarJogo() {
    const pesquisa = document.getElementById('searchInput').value.trim();
    const popup = document.getElementById('popup');
    const resultado = document.getElementById('resultado');

    // Verifica se o campo de pesquisa está vazio
    if (!pesquisa) {
        resultado.textContent = "Por favor, insira um nome válido de jogo.";
        return;
    }

    //Aponta para o servidor local
    const url = `http://localhost:3000/api/game?nome=${encodeURIComponent(pesquisa)}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar o jogo.');
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                resultado.innerHTML = `
                    <h2>${data.name}</h2>
                    <img src="${data.header_image}" alt="${data.name}">
                    <p>${data.short_description}</p>
                    <a href="https://store.steampowered.com/app/${data.steam_appid}/" target="_blank">Ver na Steam</a>
                `;
                mostrarPopup();
            } else {
                resultado.textContent = "Jogo não encontrado.";
                mostrarPopup();
            }
        })
        .catch(error => {
            console.error('Erro ao buscar o jogo:', error);
            resultado.textContent = "Ocorreu um erro ao buscar o jogo.";
            mostrarPopup()
        });
}
