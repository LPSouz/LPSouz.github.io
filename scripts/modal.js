// Função para exibir o modal
function mostrarModal() {
    const modal = document.getElementById('welcomeModal');
    modal.style.display = 'block';
}

// Função para ocultar o modal
function esconderModal() {
    const modal = document.getElementById('welcomeModal');
    modal.style.display = 'none';
}

// Adiciona evento ao botão de fechar do modal
document.getElementById('closeModal').addEventListener('click', esconderModal);

// Chama a função para mostrar o modal quando a página carregar
document.addEventListener('DOMContentLoaded', mostrarModal);
