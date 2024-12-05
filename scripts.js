const sectionForm = document.querySelector(".section-form");
let postFormCreated = false;
let putFormCreated = false;

// Banco de dados simulado
let banco_De_Dados = [];

// POST - Adicionar novo produto
document.querySelector('.post-btn').addEventListener("click", () => {
    if (!postFormCreated) {
        createFormPut("Adicionar produto", "Preço do produto:", "Descrição do produto:", "Nome do produto", 'post');
        postFormCreated = true;
    } 
});

// PUT - Editar produto existente
document.querySelector('.put-btn').addEventListener("click", () => {
    if (!putFormCreated) {
        createFormPut(`Editar produto:`, "Editar Preço", "Editar Descrição", "Editar Nome", 'put');
        putFormCreated = true;
    }
});


function createFormPut(title, priceLabel, descLabel, nameLabel, formType) {
    const existingForms = sectionForm.querySelectorAll(".form-crud");

    const existingPostForm = sectionForm.querySelector(".form-crud[data-type='post']");
    const existingPutForm = sectionForm.querySelector(".form-crud[data-type='put']");


    // Criar o formulário
    const form = document.createElement('form');
    form.classList.add("form-crud");
    form.setAttribute('data-type', formType);
    sectionForm.appendChild(form);

    const formHeader = document.createElement('div');
    formHeader.classList.add('form-header');

    const h2 = document.createElement("h2");
    h2.textContent = title;

    // Criar o ícone de remoção
    const removeIcon = document.createElement('i');
    removeIcon.classList.add('bi', 'bi-x-lg');
    removeIcon.style.cursor = 'pointer';
    removeIcon.addEventListener('click', () => {
        sectionForm.removeChild(form);
        if (formType === 'post') postFormCreated = false;
        if (formType === 'put') putFormCreated = false;
    });

    formHeader.appendChild(h2);
    formHeader.appendChild(removeIcon);
    form.appendChild(formHeader);

    const controls = [
        { label: nameLabel, type: 'text', placeholder: 'Digite o nome...', required: true },
        { label: 'ID do produto:', type: 'number', placeholder: 'Digite o ID do produto...', required: true },
        { label: priceLabel, type: 'number', placeholder: 'Digite o preço...', required: true },
        { label: 'Quantidade:', type: 'number', placeholder: 'Digite a quantidade...', required: true },
        { label: descLabel, type: 'textarea', placeholder: 'Escreva sua mensagem aqui...', required: false },
    ];

    controls.forEach((control) => {
        const divControl = document.createElement('div');
        divControl.className = 'div-control';

        const label = document.createElement('label');
        label.textContent = control.label;

        if (control.type === 'textarea') {
            const textarea = document.createElement('textarea');
            textarea.name = 'mensage-text';
            textarea.id = 'mensage-text';
            textarea.placeholder = control.placeholder;
            divControl.appendChild(label);
            divControl.appendChild(textarea);
        } else {
            const input = document.createElement('input');
            input.type = control.type;
            input.placeholder = control.placeholder;
            if (control.required) input.required = true;
            divControl.appendChild(label);
            divControl.appendChild(input);
        }

        form.appendChild(divControl);
    });

    const containerBtn = document.createElement('div');
    containerBtn.className = 'container-btn';

    const button = document.createElement('button');
    button.className = 'btn-envia';
    button.textContent = 'Enviar';

    button.addEventListener('click', (e) => {
        e.preventDefault();

        const idProduto = form.querySelector('input[placeholder="Digite o ID do produto..."]').value;
        const produtoExistente = banco_De_Dados.find(prod => prod.IdProduto == idProduto);

        if (formType === 'post') {
            // Adicionar novo produto
            const nome = form.querySelector('input[placeholder="Digite o nome..."]').value;
            const precoProduto = form.querySelector('input[placeholder="Digite o preço..."]').value;
            const quantidade = form.querySelector('input[placeholder="Digite a quantidade..."]').value;
            const descricaoProduto = form.querySelector('textarea').value;

            if (nome && precoProduto && quantidade) {
                adicionarProduto(nome, idProduto, precoProduto, descricaoProduto, quantidade);
                alert("Produto adicionado com sucesso!");
                
            } else {
                alert("Por favor, preencha todos os campos obrigatórios.");
            }
        } else if (formType === 'put' && produtoExistente) {
            // Atualizar produto existente
            const nome = form.querySelector('input[placeholder="Digite o nome..."]').value || produtoExistente.nome;
            const precoProduto = form.querySelector('input[placeholder="Digite o preço..."]').value || produtoExistente.precoProduto;
            const quantidade = form.querySelector('input[placeholder="Digite a quantidade..."]').value || produtoExistente.quantidade;
            const descricaoProduto = form.querySelector('textarea').value || produtoExistente.descricaoProduto;

            atualizarProduto(idProduto, nome, precoProduto, descricaoProduto, quantidade);
            alert("Produto editado com sucesso!");
        } else {
            alert("Produto não encontrado para edição.");
        }
    });

    containerBtn.appendChild(button);
    form.appendChild(containerBtn);
}

// GET - Visualizar produtos
document.querySelector('.get-btn').addEventListener("click", () => {
    visualizarProdutos();
});

function visualizarProdutos() {
    const productListSection = document.querySelector(".Vizualizar-produtos");

    // Limpar a seção de produtos antes de adicionar novos
    productListSection.innerHTML = "<h2>Produtos</h2><div class='container-card'></div>";

    if (banco_De_Dados.length === 0) {
        productListSection.innerHTML = "<h2>Produtos</h2><p>Nenhum produto encontrado.</p>";
        return;
    }

    const containerCard = productListSection.querySelector(".container-card");

    banco_De_Dados.forEach(produto => {
        const card = document.createElement('article');
        card.classList.add('card-produtos');

        card.innerHTML = `
            <h3 class="title-produto">Nome: ${produto.nome}</h3>
            <p class="descrição"><span>Descrição: </span>${produto.descricaoProduto || 'Sem descrição'}</p>
            <span>Quantidade de produtos: ${produto.quantidade}</span>
            <span class="idproduto">${produto.IdProduto}</span>
            <p class="price">Valor: R$ ${produto.precoProduto.toFixed(2)}</p>
            <i class="bi bi-trash3" style="cursor: pointer; color: red;"></i>
        `;

        // Adicionar o evento de click para remover o produto
        const trashIcon = card.querySelector('.bi-trash3');
        trashIcon.addEventListener('click', () => {
            removerProduto(produto.IdProduto);
            containerCard.removeChild(card); // Remover o card da interface
        });

        containerCard.appendChild(card);
    });
}

// DELETE - Remover produto
function removerProduto(idProduto) {
    const index = banco_De_Dados.findIndex(prod => prod.IdProduto == idProduto);
    if (index !== -1) {
        banco_De_Dados.splice(index, 1); // Remover o produto do banco de dados
    }
}

// Função para adicionar um novo produto
function adicionarProduto(nome, idProduto, precoProduto, descricaoProduto, quantidade) {
    banco_De_Dados.push({
        nome: nome,
        IdProduto: idProduto,
        precoProduto: parseFloat(precoProduto),
        descricaoProduto: descricaoProduto,
        quantidade: parseInt(quantidade, 10)
    });
}

// Função para atualizar um produto existente
function atualizarProduto(idProduto, nome, precoProduto, descricaoProduto, quantidade) {
    const produto = banco_De_Dados.find(prod => prod.IdProduto == idProduto);
    if (produto) {
        produto.nome = nome;
        produto.precoProduto = parseFloat(precoProduto);
        produto.descricaoProduto = descricaoProduto;
        produto.quantidade = parseInt(quantidade, 10);
    }
}
