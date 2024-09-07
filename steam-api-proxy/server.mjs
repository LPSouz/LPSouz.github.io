import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import _ from 'lodash'; // Importa o lodash como um pacote

// Obter o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json()); // Para processar JSON no corpo das requisições

// Verifique se o arquivo existe no caminho especificado
const jogosPath = path.join(__dirname, 'games.json');

// Tente ler o arquivo e capture erros
let jogos;
try {
    jogos = JSON.parse(fs.readFileSync(jogosPath, 'utf8'));
} catch (error) {
    console.error('Erro ao ler o arquivo JSON:', error);
    process.exit(1); // Saia do processo com erro se o arquivo não puder ser lido
}

// Serve o arquivo JSON
app.get('/games.json', (req, res) => {
    res.sendFile(jogosPath);
});

// Função para normalizar o nome do jogo
const normalizarNome = (nome) => {
    return _.deburr(nome.toLowerCase().trim()); // Usa lodash para remover acentos e transformar em minúsculas
};

// Obter ID por nome normalizado
const obterIdPorNome = (nome) => {
    const nomeNormalizado = normalizarNome(nome);
    for (const [nomeArmazenado, id] of Object.entries(jogos)) {
        if (normalizarNome(nomeArmazenado) === nomeNormalizado) {
            return id;
        }
    }
    return null;
};

app.get('/api/game', async (req, res) => {
    const nomeJogo = req.query.nome;

    if (!nomeJogo) {
        return res.status(400).json({ error: 'Nome do jogo é necessário.' });
    }

    const idJogo = obterIdPorNome(nomeJogo);

    if (!idJogo) {
        return res.status(404).json({ error: 'Jogo não encontrado.' });
    }

    const apiUrl = `https://store.steampowered.com/api/appdetails?appids=${idJogo}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data[idJogo] && data[idJogo].success) {
            res.json(data[idJogo].data);
        } else {
            res.status(404).json({ error: 'Jogo não encontrado na API da Steam.' });
        }
    } catch (error) {
        console.error('Erro ao buscar os detalhes do jogo:', error);
        res.status(500).json({ error: 'Erro ao buscar os detalhes do jogo.' });
    }
});

// Configuração da porta e chave da API usando variáveis de ambiente
const port = process.env.PORT || 3001;
const apiKey = process.env.API_KEY;

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
    console.log(`Usando chave de API: ${apiKey}`);
});
