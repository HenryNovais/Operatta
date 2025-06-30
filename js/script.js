document.addEventListener('DOMContentLoaded', () => {
    const logoImage = document.getElementById('logo-image');
    const loginBox = document.getElementById('login-box');
    const errorMessage = document.getElementById('error-message');

    // ANIMAÇÃO INICIAL DA LOGOMARCA (apenas para index.html)

    if (logoImage && loginBox) {
        setTimeout(() => {
            logoImage.classList.add('active');
        }, 500);

        setTimeout(() => {
            logoImage.classList.add('moved');
            loginBox.classList.add('active');
        }, 2500);

        // VALIDAÇÃO E REDIRECIONAMENTO DO LOGIN

        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const matricula = document.getElementById('login-matricula').value.trim();
            const password = document.getElementById('login-password').value.trim();

            const matriculaRegex = /^\d{6}$/;
            if (!matriculaRegex.test(matricula)) {
                errorMessage.textContent = 'A matrícula deve conter exatamente 6 dígitos numéricos.';
                errorMessage.classList.add('active');
                return;
            }

            const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{1,8}$/;
            if (!passwordRegex.test(password)) {
                errorMessage.textContent = 'A senha deve ter até 8 caracteres, incluindo pelo menos uma letra maiúscula, um caractere especial (!@#$%^&*) e números.';
                errorMessage.classList.add('active');
                return;
            }

            const defaultUser = {
                email: 'adm@empresa.com',
                matricula: '246810',
                password: 'Adm@2468'
            };

            if (email === defaultUser.email && matricula === defaultUser.matricula && password === defaultUser.password) {
                errorMessage.classList.remove('active');
                window.location.href = '../html/dashboard.html';
            } else {
                errorMessage.textContent = 'Email, matrícula ou senha inválidos.';
                errorMessage.classList.add('active');
            }
        });
    }

    // LÓGICA DE NAVEGAÇÃO DA BARRA LATERAL

    const navLinks = document.querySelectorAll('.nav-links li');
    const sections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            link.classList.add('active');
            const sectionId = link.dataset.section;
            const section = document.getElementById(sectionId);
            if (section) section.classList.add('active');

            if (sectionId === 'logout') {
                window.location.href = '../index.html';
            } else if (sectionId === 'dashboard') {
                window.location.href = '../html/dashboard.html';
            } else if (sectionId === 'orders') {
                window.location.href = '../html/orders.html';
            } else if (sectionId === 'products') {
                window.location.href = '../html/products.html';
            } else if (sectionId === 'stock') {
                window.location.href = '../html/stock.html';
            } else if (sectionId === 'finance') {
                window.location.href = '../html/finance.html';
            } else if (sectionId === 'reports') {
                window.location.href = '../html/reports.html';
            } else if (sectionId === 'admin') {
                window.location.href = '../html/adm.html';
            } else if (sectionId === 'system') {
                window.location.href = '../html/system.html';
            } else if (sectionId === 'real-time') {
                window.location.href = '../html/real-time.html';
            }
        });
    });

    // TELA DE PEDIDOS

    const newOrderBtn = document.getElementById('new-order-btn');
    const orderSection = document.getElementById('new-order-section');
    const orderCommands = document.getElementById('order-commands');
    const realTimeBtn = document.getElementById('real-time-btn');
    let orderIdCounter = parseInt(localStorage.getItem('orderIdCounter') || '0');
    let total = 0;
    let orderItems = [];
    let clientInfo = { name: '', address: '', observations: '' };

    if (newOrderBtn && orderSection) {
        if (!orderCommands) {
            const commandsDiv = document.createElement('div');
            commandsDiv.id = 'order-commands';
            commandsDiv.className = 'order-commands';
            commandsDiv.innerHTML = `
                <h3>Comanda</h3>
                <div id="client-info">
                    <div>Nome: <span id="client-name">[Nome do cliente]</span></div>
                    <div>Endereço: <span id="client-address">[Endereço completo]</span></div>
                    <div>Observações: <span id="client-observations">[Observações]</span></div>
                </div>
                <p>Total: R$ 0.00</p>
                <div id="order-items"></div>
            `;
            orderSection.parentNode.insertBefore(commandsDiv, orderSection.nextSibling);
        }

        document.querySelectorAll('.quantity-controls').forEach(control => {
            const minusBtn = control.querySelector('.btn-quantity:first-child');
            const plusBtn = control.querySelector('.btn-quantity:last-child');
            const quantityInput = control.querySelector('.quantity-input');
            const addBtn = control.parentNode.querySelector('.btn-add');
            let quantity = 0;

            minusBtn.addEventListener('click', () => {
                if (quantity > 0) quantity--;
                quantityInput.value = quantity;
            });

            plusBtn.addEventListener('click', () => {
                quantity++;
                quantityInput.value = quantity;
            });

            addBtn.addEventListener('click', () => {
                if (quantity > 0) {
                    const card = addBtn.closest('.product-card');
                    const name = card.querySelector('h3').textContent;
                    const price = parseFloat(card.querySelector('p').textContent.replace('R$ ', ''));
                    const itemTotal = price * quantity;
                    orderItems.push({ name, quantity, price, itemTotal });
                    total += itemTotal;
                    updateOrderCommands();
                    quantity = 0;
                    quantityInput.value = quantity;
                }
            });
        });

        newOrderBtn.addEventListener('click', () => {
            const paymentForm = document.createElement('div');
            paymentForm.id = 'payment-form';
            paymentForm.className = 'payment-form';
            paymentForm.innerHTML = `
                <h4>Forma de Pagamento</h4>
                <select id="payment-method">
                    <option value="">Selecione a forma de pagamento</option>
                    <option value="credit">💳 Crédito</option>
                    <option value="debit">💳 Débito</option>
                    <option value="cash">💶 Dinheiro</option>
                    <option value="pix">💠 Pix</option>
                </select>
                <div id="card-brands" style="display: none;">
                    <select id="card-brand">
                        <option value="">Selecione a bandeira</option>
                        <option value="visa">Visa</option>
                        <option value="master">Mastercard</option>
                        <option value="hiper">Hipercard</option>
                        <option value="elo">Elo</option>
                        <option value="amex">Amex</option>
                        <option value="others">Outros</option>
                    </select>
                </div>
                <div id="client-inputs">
                    <div class="form-group">
                        <label for="client-name-input">Nome do Cliente</label>
                        <input type="text" id="client-name-input" placeholder="Digite o nome do cliente">
                    </div>
                    <div class="form-group">
                        <label for="client-address-input">Endereço</label>
                        <input type="text" id="client-address-input" placeholder="Digite o endereço completo">
                    </div>
                    <div class="form-group">
                        <label for="client-observations-input">Observações</label>
                        <input type="text" id="client-observations-input" placeholder="Digite observações">
                    </div>
                </div>
                <div id="qr-code" class="qr-code">QR-Code Placeholder</div>
                <button class="btn btn-primary" id="finalize-payment">Finalizar</button>
            `;
            orderCommands.appendChild(paymentForm);
            paymentForm.classList.add('active');

            const paymentMethod = document.getElementById('payment-method');
            const cardBrands = document.getElementById('card-brands');
            const qrCode = document.getElementById('qr-code');

            paymentMethod.addEventListener('change', () => {
                cardBrands.style.display = paymentMethod.value === 'credit' || paymentMethod.value === 'debit' ? 'block' : 'none';
                qrCode.classList.toggle('active', paymentMethod.value === 'pix');
            });

            document.getElementById('finalize-payment').addEventListener('click', () => {
                const paymentMethodValue = paymentMethod.value;
                const cardBrandValue = document.getElementById('card-brand').value;
                clientInfo = {
                    name: document.getElementById('client-name-input')?.value || '[Nome do cliente]',
                    address: document.getElementById('client-address-input')?.value || '[Endereço completo]',
                    observations: document.getElementById('client-observations-input')?.value || '[Observações]'
                };

                if (paymentMethodValue && (paymentMethodValue !== 'credit' && paymentMethodValue !== 'debit' || cardBrands.style.display === 'block' && cardBrandValue)) {
                    if (orderItems.length === 0) {
                        alert('Adicione pelo menos um item ao pedido antes de finalizar.');
                        return;
                    }
                    createOrderCard();
                    paymentForm.remove();
                    orderItems = [];
                    total = 0;
                    clientInfo = { name: '', address: '', observations: '' };
                    updateOrderCommands();
                } else {
                    alert('Selecione a forma de pagamento e, se aplicável, a bandeira.');
                }
            });
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'F9') {
            window.location.href = '../html/real-time.html';
            e.preventDefault();
        }
    });

    if (realTimeBtn) {
        realTimeBtn.addEventListener('click', () => {
            window.location.href = '../html/real-time.html';
        });
    }

    const awaitingCards = document.getElementById('awaiting-cards');
    const preparingCards = document.getElementById('preparing-cards');
    const deliveringCards = document.getElementById('delivering-cards');
    const completedCards = document.getElementById('completed-cards');

    if (awaitingCards) {
        let cards = JSON.parse(localStorage.getItem('kanbanCards') || '[]');
        cards.forEach(cardData => {
            const card = document.createElement('div');
            card.className = 'kanban-card';
            card.innerHTML = cardData.html;
            card.dataset.orderId = cardData.orderId;
            card.dataset.startTime = cardData.startTime || new Date().getTime();
            card.dataset.column = cardData.column;
            card.dataset.columnTimes = cardData.columnTimes || {};
            document.getElementById(`${cardData.column}-cards`).appendChild(card);

            const okBtn = card.querySelector('.ok-btn');
            const concludeBtn = card.querySelector('.conclude-btn');
            if (okBtn) okBtn.addEventListener('click', () => moveCard(card));
            if (concludeBtn) concludeBtn.addEventListener('click', () => concludeOrder(card));
        });

        document.querySelectorAll('.kanban-card').forEach(card => {
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Excluir';
            deleteBtn.addEventListener('click', () => {
                if (confirm('Tem certeza que deseja excluir este card?')) {
                    card.remove();
                    let cards = JSON.parse(localStorage.getItem('kanbanCards') || '[]');
                    cards = cards.filter(c => c.orderId !== card.dataset.orderId);
                    localStorage.setItem('kanbanCards', JSON.stringify(cards));
                }
            });
            card.appendChild(deleteBtn);
        });

        updateKanbanTimes();
    }

    // TELA DE ADMINISTRAÇÃO
    
    const addUserBtn = document.getElementById('add-user-btn');
    const userForm = document.getElementById('user-form');
    const userFormData = document.getElementById('user-form-data');
    const cancelUserFormBtn = document.getElementById('cancel-user-form');
    const saveBtn = document.getElementById('save-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    let users = JSON.parse(localStorage.getItem('users') || '[]');

    if (addUserBtn && userForm) {
        addUserBtn.addEventListener('click', () => {
            document.getElementById('form-title').textContent = 'Adicionar Usuário';
            userForm.style.display = 'block';
            userFormData.reset();
        });

        userFormData.addEventListener('submit', (e) => {
            e.preventDefault();
            const newUser = {
                name: document.getElementById('user-name').value,
                login: document.getElementById('user-login').value,
                password: document.getElementById('user-password').value,
                role: document.getElementById('user-role').value,
                status: 'active'
            };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            userForm.style.display = 'none';
            loadUserTable();
        });

        cancelUserFormBtn.addEventListener('click', () => { userForm.style.display = 'none'; });

        document.getElementById('user-table')?.addEventListener('change', (e) => {
            const select = e.target.closest('.btn-select');
            if (select) {
                const row = select.closest('tr');
                const index = Array.from(row.parentElement.children).indexOf(row);
                const action = select.value;
                if (action === 'edit') {
                    document.getElementById('form-title').textContent = 'Editar Usuário';
                    userForm.style.display = 'block';
                    const user = users[index];
                    document.getElementById('user-name').value = user.name;
                    document.getElementById('user-login').value = user.login;
                    document.getElementById('user-password').value = user.password;
                    document.getElementById('user-role').value = user.role;
                    userFormData.onsubmit = (e) => {
                        e.preventDefault();
                        users[index] = {
                            name: document.getElementById('user-name').value,
                            login: document.getElementById('user-login').value,
                            password: document.getElementById('user-password').value,
                            role: document.getElementById('user-role').value,
                            status: user.status
                        };
                        localStorage.setItem('users', JSON.stringify(users));
                        userForm.style.display = 'none';
                        loadUserTable();
                    };
                } else if (action === 'disable' || action === 'activate') {
                    users[index].status = action === 'disable' ? 'inactive' : 'active';
                    localStorage.setItem('users', JSON.stringify(users));
                    loadUserTable();
                }
                select.value = '';
            }
        });

        function loadUserTable(filter = 'all') {
            const table = document.getElementById('user-table');
            if (table) {
                let filteredUsers = users;
                if (filter === 'active') {
                    filteredUsers = users.filter(user => user.status === 'active');
                } else if (filter === 'inactive') {
                    filteredUsers = users.filter(user => user.status === 'inactive');
                } else if (filter === 'admin') {
                    filteredUsers = users.filter(user => user.role === 'Administrador');
                }
                table.querySelector('tbody').innerHTML = filteredUsers.map(user => `
                    <tr>
                        <td>${user.name}</td>
                        <td>${user.login}</td>
                        <td>${user.role}</td>
                        <td>${user.status}</td>
                        <td><select class="btn-select"><option value="">Ações</option><option value="edit">Editar</option><option value="${user.status === 'active' ? 'disable' : 'activate'}">${user.status === 'active' ? 'Desativar' : 'Ativar'}</option></select></td>
                    </tr>
                `).join('');
            }
        }

        const filterUsers = document.getElementById('filter-users');
        if (filterUsers) {
            filterUsers.addEventListener('change', (e) => {
                loadUserTable(e.target.value);
            });
        }
        loadUserTable();
    }

    saveBtn?.addEventListener('click', () => {
        alert('Alterações salvas!');
    });

    cancelBtn?.addEventListener('click', () => {
        alert('Alterações descartadas!');
    });

    document.getElementById('backup-btn')?.addEventListener('click', () => {
        const dataStr = 'data:text/xlsm;charset=utf-8,' + encodeURIComponent(JSON.stringify({ users, stock: JSON.parse(localStorage.getItem('stockData') || '[]'), finance: JSON.parse(localStorage.getItem('financeData') || '{}') }));
        const link = document.createElement('a'); link.setAttribute('href', dataStr); link.setAttribute('download', 'backup.xlsm'); link.click();
    });

    document.getElementById('generate-report')?.addEventListener('click', () => {
        const reportType = document.getElementById('report-type')?.value;
        let content = 'Relatório Vazio';
        if (reportType === 'sales') content = 'Relatório de Vendas: Em desenvolvimento';
        else if (reportType === 'stock') content = 'Relatório de Estoque: Em desenvolvimento';
        else if (reportType === 'finance') content = 'Relatório Financeiro: Em desenvolvimento';
        else if (reportType === 'performance') content = 'Relatório de Desempenho: Em desenvolvimento';
        document.getElementById('report-output').textContent = content;
        document.getElementById('report-output').style.display = 'block';
    });

    document.getElementById('export-report')?.addEventListener('click', () => {
        const content = document.getElementById('report-output').textContent;
        const dataStr = 'data:text/xlsm;charset=utf-8,' + encodeURIComponent(content);
        const link = document.createElement('a'); link.setAttribute('href', dataStr); link.setAttribute('download', 'relatorio.xlsm'); link.click();
    });

   // TELA DE ESTOQUE

   const stockItems = document.getElementById('stock-items');
    let stockData = JSON.parse(localStorage.getItem('stockData') || '[]');
    const addItemBtn = document.getElementById('add-item-btn');
    const itemForm = document.getElementById('item-form');
    const itemFormData = document.getElementById('item-form-data');
    const cancelFormBtn = document.getElementById('cancel-form');
    const importExportBtn = document.getElementById('import-export-btn');
    const stockViewBtn = document.getElementById('stock-view-btn');
    const stockTableContainer = document.getElementById('stock-table-container');
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const sortSelect = document.getElementById('sort-select');
    const locationChartCanvas = document.getElementById('location-chart')?.getContext('2d');
    const categoryChartCanvas = document.getElementById('category-chart')?.getContext('2d');
    const minVsRealChartCanvas = document.getElementById('min-vs-real-chart')?.getContext('2d');
    let locationChart, categoryChart, minVsRealChart;

    if (stockItems) {
        updateDashboard();

        addItemBtn.addEventListener('click', () => {
            document.getElementById('form-title').textContent = 'Adicionar Item';
            itemForm.style.display = 'block';
            itemFormData.reset();
        });

        itemFormData.addEventListener('submit', (e) => {
            e.preventDefault();
            const newItem = {
                name: document.getElementById('item-name').value,
                sku: document.getElementById('item-sku').value,
                unit: document.getElementById('item-unit').value,
                category: document.getElementById('item-category').value,
                supplier: document.getElementById('item-supplier').value,
                quantity: parseInt(document.getElementById('item-quantity').value) || 0,
                minStock: parseInt(document.getElementById('item-min-stock').value) || 0,
                maxStock: parseInt(document.getElementById('item-max-stock').value) || 0,
                orderPoint: parseInt(document.getElementById('item-order-point').value) || 0,
                cost: parseFloat(document.getElementById('item-cost').value) || 0,
                validity: document.getElementById('item-validity').value,
                location: document.getElementById('item-location').value
            };
            newItem.totalCost = newItem.quantity * newItem.cost;
            stockData.push(newItem);
            localStorage.setItem('stockData', JSON.stringify(stockData));
            loadStockTable();
            itemForm.style.display = 'none';
            updateDashboard();
            checkOrderPoints();
        });

        cancelFormBtn.addEventListener('click', () => {
            itemForm.style.display = 'none';
        });

        // CALCULADORA DE PONTO DE PEDIDO

        const orderPointCalculatorBtn = document.getElementById('order-point-calculator-btn');
        const orderPointModal = document.getElementById('order-point-modal');
        const calculateOrderPointBtn = document.getElementById('calculate-order-point');
        const cancelOrderPointBtn = document.getElementById('cancel-order-point');

        if (orderPointCalculatorBtn) {
            orderPointCalculatorBtn.addEventListener('click', () => {
                orderPointModal.style.display = 'flex';
                document.getElementById('daily-demand').value = '';
                document.getElementById('lead-time').value = '';
                document.getElementById('safety-stock').value = '0';
            });

            calculateOrderPointBtn.addEventListener('click', () => {
                const dailyDemand = parseFloat(document.getElementById('daily-demand').value);
                const leadTime = parseInt(document.getElementById('lead-time').value);
                const safetyStock = parseInt(document.getElementById('safety-stock').value) || 0;

                if (isNaN(dailyDemand) || dailyDemand <= 0 || isNaN(leadTime) || leadTime <= 0) {
                    alert('Por favor, insira uma demanda média diária e lead time válidos (maiores que zero).');
                    return;
                }

                const orderPoint = Math.ceil((dailyDemand * leadTime) + safetyStock);
                document.getElementById('item-order-point').value = orderPoint;
                orderPointModal.style.display = 'none';
            });

            cancelOrderPointBtn.addEventListener('click', () => {
                orderPointModal.style.display = 'none';
            });
        }

        importExportBtn.addEventListener('click', () => {
            const dataStr = 'data:text/xlsm;charset=utf-8,' + encodeURIComponent(JSON.stringify(stockData));
            const pdfStr = 'data:application/pdf;charset=utf-8,' + encodeURIComponent('Relatório de Estoque\n' + JSON.stringify(stockData, null, 2));
            const xlsmLink = document.createElement('a');
            xlsmLink.setAttribute('href', dataStr);
            xlsmLink.setAttribute('download', 'estoque.xlsm');
            xlsmLink.click();
            const pdfLink = document.createElement('a');
            pdfLink.setAttribute('href', pdfStr);
            pdfLink.setAttribute('download', 'estoque.pdf');
            pdfLink.click();
        });

        stockViewBtn.addEventListener('click', () => {
            stockTableContainer.style.display = stockTableContainer.style.display === 'none' ? 'block' : 'none';
            if (stockTableContainer.style.display === 'block') {
                loadStockTable();
            }
        });

        searchInput.addEventListener('input', filterTable);
        categoryFilter.addEventListener('change', filterTable);
        sortSelect.addEventListener('change', filterTable);

        function filterTable() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            const category = categoryFilter.value.toLowerCase();
            const sort = sortSelect.value;

            let filteredData = [...stockData];

            if (searchTerm) {
                filteredData = filteredData.filter(item =>
                    item.name.toLowerCase().includes(searchTerm) ||
                    item.sku.toLowerCase().includes(searchTerm)
                );
            }

            if (category) {
                filteredData = filteredData.filter(item => item.category.toLowerCase() === category);
            }

            if (sort) {
                filteredData.sort((a, b) => {
                    switch (sort) {
                        case 'name-asc':
                            return a.name.localeCompare(b.name);
                        case 'name-desc':
                            return b.name.localeCompare(a.name);
                        case 'quantity-asc':
                            return a.quantity - b.quantity;
                        case 'quantity-desc':
                            return b.quantity - a.quantity;
                        case 'validity-asc':
                            return new Date(a.validity) - new Date(b.validity);
                        default:
                            return 0;
                    }
                });
            }

            stockItems.innerHTML = '';
            filteredData.forEach((item, index) => {
                const row = document.createElement('tr');
                row.dataset.index = stockData.indexOf(item);
                row.innerHTML = `
                    <td>${item.name}</td>
                    <td>${item.sku}</td>
                    <td>${item.unit}</td>
                    <td>${item.category}</td>
                    <td>${item.supplier}</td>
                    <td>${item.quantity}</td>
                    <td>${item.minStock} <span class="stock-alert ${item.quantity < item.minStock ? 'low' : ''}"></span></td>
                    <td>${item.maxStock}</td>
                    <td>${item.orderPoint}</td>
                    <td>R$ ${item.cost.toFixed(2)}</td>
                    <td>R$ ${item.totalCost.toFixed(2)}</td>
                    <td>${item.validity}</td>
                    <td>${item.location}</td>
                    <td><select class="btn-select"><option value="">Ações</option><option value="edit">Editar</option><option value="remove">Remover</option><option value="entry">Registrar Entrada</option><option value="exit">Registrar Saída</option></select></td>
                `;
                stockItems.appendChild(row);
            });
        }

        function loadStockTable() {
            stockItems.innerHTML = '';
            stockData.forEach((item, index) => {
                const row = document.createElement('tr');
                row.dataset.index = index;
                row.innerHTML = `
                    <td>${item.name}</td>
                    <td>${item.sku}</td>
                    <td>${item.unit}</td>
                    <td>${item.category}</td>
                    <td>${item.supplier}</td>
                    <td>${item.quantity}</td>
                    <td>${item.minStock} <span class="stock-alert ${item.quantity < item.minStock ? 'low' : ''}"></span></td>
                    <td>${item.maxStock}</td>
                    <td>${item.orderPoint}</td>
                    <td>R$ ${item.cost.toFixed(2)}</td>
                    <td>R$ ${item.totalCost.toFixed(2)}</td>
                    <td>${item.validity}</td>
                    <td>${item.location}</td>
                    <td><select class="btn-select"><option value="">Ações</option><option value="edit">Editar</option><option value="remove">Remover</option><option value="entry">Registrar Entrada</option><option value="exit">Registrar Saída</option></select></td>
                `;
                stockItems.appendChild(row);
            });

            if (!stockTableContainer.querySelector('.close-stock-table-btn')) {
                const closeBtn = document.createElement('button');
                closeBtn.className = 'btn btn-secondary close-stock-table-btn';
                closeBtn.textContent = 'Fechar';
                closeBtn.style.position = 'absolute';
                closeBtn.style.top = '10px';
                closeBtn.style.right = '10px';
                closeBtn.addEventListener('click', () => {
                    stockTableContainer.style.display = 'none';
                });
                stockTableContainer.prepend(closeBtn);
            }
        }

        stockItems.addEventListener('change', (e) => {
            const select = e.target.closest('.btn-select');
            if (select) {
                const row = select.closest('tr');
                const index = parseInt(row.dataset.index);
                const action = select.value;
                if (action) {
                    if (action === 'remove') {
                        if (confirm('Tem certeza que deseja remover este item?')) {
                            stockData.splice(index, 1);
                            localStorage.setItem('stockData', JSON.stringify(stockData));
                            loadStockTable();
                            select.value = '';
                            updateDashboard();
                            checkOrderPoints();
                        }
                        select.value = '';
                    } else {
                        const item = stockData[index];
                        document.getElementById('form-title').textContent = `${action.charAt(0).toUpperCase() + action.slice(1)} Item`;
                        itemForm.style.display = 'block';
                        document.getElementById('item-name').value = item.name;
                        document.getElementById('item-sku').value = item.sku;
                        document.getElementById('item-unit').value = item.unit;
                        document.getElementById('item-category').value = item.category;
                        document.getElementById('item-supplier').value = item.supplier;
                        document.getElementById('item-quantity').value = action === 'entry' || action === 'exit' ? '' : item.quantity;
                        document.getElementById('item-min-stock').value = item.minStock;
                        document.getElementById('item-max-stock').value = item.maxStock;
                        document.getElementById('item-order-point').value = item.orderPoint;
                        document.getElementById('item-cost').value = item.cost;
                        document.getElementById('item-validity').value = item.validity;
                        document.getElementById('item-location').value = item.location;

                        const inputs = itemFormData.querySelectorAll('input, select');
                        inputs.forEach(input => {
                            input.disabled = (action === 'entry' || action === 'exit') && input.id !== 'item-quantity';
                        });

                        itemFormData.onsubmit = (e) => {
                            e.preventDefault();
                            if (action === 'edit') {
                                const updatedItem = {
                                    name: document.getElementById('item-name').value,
                                    sku: document.getElementById('item-sku').value,
                                    unit: document.getElementById('item-unit').value,
                                    category: document.getElementById('item-category').value,
                                    supplier: document.getElementById('item-supplier').value,
                                    quantity: parseInt(document.getElementById('item-quantity').value) || 0,
                                    minStock: parseInt(document.getElementById('item-min-stock').value) || 0,
                                    maxStock: parseInt(document.getElementById('item-max-stock').value) || 0,
                                    orderPoint: parseInt(document.getElementById('item-order-point').value) || 0,
                                    cost: parseFloat(document.getElementById('item-cost').value) || 0,
                                    validity: document.getElementById('item-validity').value,
                                    location: document.getElementById('item-location').value
                                };
                                updatedItem.totalCost = updatedItem.quantity * updatedItem.cost;
                                stockData[index] = updatedItem;
                                localStorage.setItem('stockData', JSON.stringify(stockData));
                                loadStockTable();
                                itemForm.style.display = 'none';
                                select.value = '';
                                updateDashboard();
                                checkOrderPoints();
                            } else if (action === 'entry' || action === 'exit') {
                                const quantityChange = parseInt(document.getElementById('item-quantity').value) || 0;
                                if (quantityChange <= 0) {
                                    alert('Por favor, insira uma quantidade válida maior que zero.');
                                    return;
                                }
                                const newQuantity = action === 'entry' ? item.quantity + quantityChange : item.quantity - quantityChange;
                                if (newQuantity < 0) {
                                    alert('Quantidade em estoque não pode ser negativa.');
                                    return;
                                }
                                item.quantity = newQuantity;
                                item.totalCost = item.quantity * item.cost;
                                stockData[index] = item;
                                localStorage.setItem('stockData', JSON.stringify(stockData));
                                loadStockTable();
                                itemForm.style.display = 'none';
                                select.value = '';
                                updateDashboard();
                                checkOrderPoints();
                            }
                        };
                    }
                }
            }
        });

        function updateDashboard() {
            if (locationChart) locationChart.destroy();
            if (categoryChart) categoryChart.destroy();
            if (minVsRealChart) minVsRealChart.destroy();

            const locationData = {};
            stockData.forEach(item => {
                const [store] = item.location.split(' - ');
                if (!locationData[store]) locationData[store] = {};
                locationData[store][item.category] = (locationData[store][item.category] || 0) + item.quantity;
            });
            const locations = Object.keys(locationData);
            const categories = [...new Set(stockData.map(item => item.category))];
            const locationDatasets = categories.map(category => ({
                label: category,
                data: locations.map(loc => locationData[loc][category] || 0),
                backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`
            }));
            locationChart = new Chart(locationChartCanvas, {
                type: 'bar',
                data: { labels: locations, datasets: locationDatasets },
                options: { scales: { y: { beginAtZero: true } }, plugins: { legend: { position: 'top' } } }
            });

            const categoryTotals = stockData.reduce((acc, item) => {
                acc[item.category] = (acc[item.category] || 0) + item.quantity;
                return acc;
            }, {});
            categoryChart = new Chart(categoryChartCanvas, {
                type: 'pie',
                data: { labels: Object.keys(categoryTotals), datasets: [{ data: Object.values(categoryTotals), backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'] }] },
                options: { plugins: { legend: { position: 'top' } } }
            });

            const minVsRealData = stockData.map(item => ({ name: item.name, min: item.minStock, real: item.quantity }));
            minVsRealChart = new Chart(minVsRealChartCanvas, {
                type: 'line',
                data: { labels: minVsRealData.map(item => item.name), datasets: [{ label: 'Estoque Mínimo', data: minVsRealData.map(item => item.min), borderColor: '#FF6384', fill: false }, { label: 'Estoque Real', data: minVsRealData.map(item => item.real), borderColor: '#36A2EB', fill: false }] },
                options: { scales: { y: { beginAtZero: true } }, plugins: { legend: { position: 'top' } } }
            });
        }

        function checkOrderPoints() {
            const alerts = stockData.filter(item => item.quantity <= item.orderPoint)
                                   .map(item => `${item.name} está no ponto de pedido (${item.quantity}/${item.orderPoint}).`);
            if (alerts.length > 0) {
                localStorage.setItem('dashboardAlerts', JSON.stringify(alerts));
            } else {
                localStorage.removeItem('dashboardAlerts');
            }
        }

        loadStockTable();
    }

    // TELA DE FINANCEIRO

    const currentBalance = document.getElementById('current-balance');
    const periodIncome = document.getElementById('period-income');
    const periodExpenses = document.getElementById('period-expenses');
    const profitLoss = document.getElementById('profit-loss');
    const totalPayable = document.getElementById('total-payable');
    const totalReceivable = document.getElementById('total-receivable');
    const incomeList = document.getElementById('income-list');
    const expenseList = document.getElementById('expense-list');
    const payableList = document.getElementById('payable-list');
    const receivableList = document.getElementById('receivable-list');
    const cashFlowChartCanvas = document.getElementById('cash-flow-chart')?.getContext('2d');
    const expenseCategoryChartCanvas = document.getElementById('expense-category-chart')?.getContext('2d');
    let cashFlowChart, expenseCategoryChart;
    let financeData = JSON.parse(localStorage.getItem('financeData') || '{"incomes": [], "expenses": [], "payables": [], "receivables": [], "balance": 0}');
    const addIncomeBtn = document.getElementById('add-income-btn');
    const addExpenseBtn = document.getElementById('add-expense-btn');
    const financeForm = document.getElementById('finance-form');
    const financeFormData = document.getElementById('finance-form-data');
    const cancelFinanceFormBtn = document.getElementById('cancel-finance-form');
    const dateFilter = document.getElementById('date-filter');
    const customStartDate = document.getElementById('custom-start-date');
    const customEndDate = document.getElementById('custom-end-date');
    const exportBtn = document.getElementById('export-btn');
    const reportBtn = document.getElementById('report-btn');

    if (currentBalance) {
        updateFinanceDashboard();

        dateFilter.addEventListener('change', (e) => {
            customStartDate.style.display = e.target.value === 'custom' ? 'inline-block' : 'none';
            customEndDate.style.display = e.target.value === 'custom' ? 'inline-block' : 'none';
            updateFinanceDashboard();
        });

        customStartDate.addEventListener('change', updateFinanceDashboard);
        customEndDate.addEventListener('change', updateFinanceDashboard);

        addIncomeBtn.addEventListener('click', () => {
            document.getElementById('form-title').textContent = 'Lançar Receita';
            financeForm.style.display = 'block';
            financeFormData.reset();
        });

        addExpenseBtn.addEventListener('click', () => {
            document.getElementById('form-title').textContent = 'Lançar Despesa';
            financeForm.style.display = 'block';
            financeFormData.reset();
        });

        financeFormData.addEventListener('submit', (e) => {
            e.preventDefault();
            const type = document.getElementById('form-title').textContent.includes('Receita') ? 'incomes' : 'expenses';
            const newEntry = {
                date: document.getElementById('finance-date').value,
                value: parseFloat(document.getElementById('finance-value').value),
                category: document.getElementById('finance-category').value,
                supplierClient: document.getElementById('finance-supplier-client').value,
                paymentMethod: document.getElementById('finance-payment-method').value,
                orderLink: document.getElementById('finance-order-link').value || null
            };
            if (type === 'incomes') {
                financeData.incomes.push(newEntry);
                financeData.balance += newEntry.value;
            } else {
                financeData.expenses.push(newEntry);
                financeData.balance -= newEntry.value;
            }
            localStorage.setItem('financeData', JSON.stringify(financeData));
            financeForm.style.display = 'none';
            updateFinanceDashboard();
        });

        cancelFinanceFormBtn.addEventListener('click', () => {
            financeForm.style.display = 'none';
        });

        exportBtn.addEventListener('click', () => {
            const dataStr = 'data:text/xlsm;charset=utf-8,' + encodeURIComponent(JSON.stringify(financeData));
            const xlsmLink = document.createElement('a');
            xlsmLink.setAttribute('href', dataStr);
            xlsmLink.setAttribute('download', 'financeiro.xlsm');
            xlsmLink.click();
        });

        reportBtn.addEventListener('click', () => {
            const dataStr = 'data:application/pdf;charset=utf-8,' + encodeURIComponent('Relatório Financeiro\n' + JSON.stringify(financeData, null, 2));
            const pdfLink = document.createElement('a');
            pdfLink.setAttribute('href', dataStr);
            pdfLink.setAttribute('download', 'relatorio_financeiro.pdf');
            pdfLink.click();
        });

        function updateFinanceDashboard() {
            const now = new Date();
            let startDate, endDate;

            switch (dateFilter.value) {
                case 'today':
                    startDate = new Date(now.setHours(0, 0, 0, 0));
                    endDate = new Date(now.setHours(23, 59, 59, 999));
                    break;
                case 'yesterday':
                    startDate = new Date(now.setDate(now.getDate() - 1));
                    startDate.setHours(0, 0, 0, 0);
                    endDate = new Date(startDate.setHours(23, 59, 59, 999));
                    break;
                case 'week':
                    startDate = new Date(now.setDate(now.getDate() - now.getDay()));
                    startDate.setHours(0, 0, 0, 0);
                    endDate = new Date(now.setDate(now.getDate() + (6 - now.getDay())));
                    endDate.setHours(23, 59, 59, 999);
                    break;
                case 'month':
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
                    break;
                case 'custom':
                    startDate = new Date(customStartDate.value);
                    endDate = new Date(customEndDate.value);
                    endDate.setHours(23, 59, 59, 999);
                    break;
                default:
                    startDate = new Date(now.setHours(0, 0, 0, 0));
                    endDate = new Date(now.setHours(23, 59, 59, 999));
            }

            const filteredIncomes = financeData.incomes.filter(i => new Date(i.date) >= startDate && new Date(i.date) <= endDate);
            const filteredExpenses = financeData.expenses.filter(e => new Date(e.date) >= startDate && new Date(e.date) <= endDate);
            const incomeTotal = filteredIncomes.reduce((sum, i) => sum + i.value, 0);
            const expenseTotal = filteredExpenses.reduce((sum, e) => sum + e.value, 0);
            const profit = incomeTotal - expenseTotal;

            currentBalance.textContent = `R$ ${financeData.balance.toFixed(2)}`;
            periodIncome.textContent = `R$ ${incomeTotal.toFixed(2)}`;
            periodExpenses.textContent = `R$ ${expenseTotal.toFixed(2)}`;
            profitLoss.textContent = `R$ ${profit.toFixed(2)}`;
            profitLoss.style.color = profit >= 0 ? '#28A745' : '#DC3545';

            incomeList.innerHTML = filteredIncomes.map(i => `
                <tr>
                    <td>${i.date}</td>
                    <td>R$ ${i.value.toFixed(2)}</td>
                    <td>${i.paymentMethod}</td>
                    <td>${i.orderLink || '-'}</td>
                    <td><select class="btn-select"><option value="">Ações</option><option value="edit">Editar</option><option value="delete">Excluir</option></select></td>
                </tr>
            `).join('');
            expenseList.innerHTML = filteredExpenses.map(e => `
                <tr>
                    <td>${e.date}</td>
                    <td>R$ ${e.value.toFixed(2)}</td>
                    <td>${e.category}</td>
                    <td>${e.supplierClient}</td>
                    <td>${e.paymentMethod}</td>
                    <td><select class="btn-select"><option value="">Ações</option><option value="edit">Editar</option><option value="delete">Excluir</option></select></td>
                </tr>
            `).join('');

            const payableTotal = financeData.payables.reduce((sum, p) => sum + p.value, 0);
            const receivableTotal = financeData.receivables.reduce((sum, r) => sum + r.value, 0);
            totalPayable.textContent = `R$ ${payableTotal.toFixed(2)}`;
            totalReceivable.textContent = `R$ ${receivableTotal.toFixed(2)}`;

            payableList.innerHTML = financeData.payables.map(p => {
                const isOverdue = new Date(p.dueDate) < now && p.status !== 'paid';
                return `
                    <tr>
                        <td>${p.dueDate}</td>
                        <td>R$ ${p.value.toFixed(2)}</td>
                        <td>${p.supplier}</td>
                        <td class="status-${p.status}">${p.status === 'overdue' ? 'Atrasado' : p.status === 'pending' ? 'Pendente' : 'Pago'}</td>
                        <td><select class="btn-select"><option value="">Ações</option><option value="pay">Pagar</option><option value="edit">Editar</option><option value="delete">Excluir</option></select></td>
                    </tr>
                `;
            }).join('');
            receivableList.innerHTML = financeData.receivables.map(r => `
                <tr>
                    <td>${r.dueDate}</td>
                    <td>R$ ${r.value.toFixed(2)}</td>
                    <td>${r.client}</td>
                    <td class="status-${r.status}">${r.status === 'pending' ? 'Pendente' : 'Recebido'}</td>
                    <td><select class="btn-select"><option value="">Ações</option><option value="receive">Receber</option><option value="edit">Editar</option><option value="delete">Excluir</option></select></td>
                </tr>
            `).join('');

            if (cashFlowChart) cashFlowChart.destroy();
            if (expenseCategoryChart) expenseCategoryChart.destroy();

            const cashFlowData = filteredIncomes.map(i => ({ date: new Date(i.date), value: i.value }))
                .concat(filteredExpenses.map(e => ({ date: new Date(e.date), value: -e.value })))
                .sort((a, b) => a.date - b.date);
            cashFlowChart = new Chart(cashFlowChartCanvas, {
                type: 'line',
                data: {
                    labels: cashFlowData.map(d => d.date.toLocaleDateString()),
                    datasets: [{ label: 'Fluxo de Caixa', data: cashFlowData.map((d, i) => cashFlowData.slice(0, i + 1).reduce((sum, curr) => sum + curr.value, 0)), borderColor: '#36A2EB', fill: false }]
                },
                options: { scales: { y: { beginAtZero: true } }, plugins: { legend: { position: 'top' } } }
            });

            const expenseCategories = [...new Set(filteredExpenses.map(e => e.category))];
            expenseCategoryChart = new Chart(expenseCategoryChartCanvas, {
                type: 'pie',
                data: {
                    labels: expenseCategories,
                    datasets: [{ data: expenseCategories.map(cat => filteredExpenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.value, 0)), backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'] }]
                },
                options: { plugins: { legend: { position: 'top' } } }
            });
        }

        document.querySelectorAll('.finance-table .btn-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const row = e.target.closest('tr');
                const index = Array.from(e.target.closest('tbody').children).indexOf(row);
                const action = e.target.value;
                const type = e.target.closest('table').id.includes('income') ? 'incomes' :
                            e.target.closest('table').id.includes('expense') ? 'expenses' :
                            e.target.closest('table').id.includes('payable') ? 'payables' : 'receivables';
                const entry = financeData[type][index];

                if (action === 'edit') {
                    document.getElementById('form-title').textContent = `Editar ${type.replace(/s$/, '')}`;
                    financeForm.style.display = 'block';
                    document.getElementById('finance-date').value = entry.date;
                    document.getElementById('finance-value').value = entry.value;
                    document.getElementById('finance-category').value = entry.category || '';
                    document.getElementById('finance-supplier-client').value = entry.supplierClient || entry.supplier || entry.client || '';
                    document.getElementById('finance-payment-method').value = entry.paymentMethod || '';
                    document.getElementById('finance-order-link').value = entry.orderLink || '';

                    financeFormData.onsubmit = (e) => {
                        e.preventDefault();
                        entry.date = document.getElementById('finance-date').value;
                        entry.value = parseFloat(document.getElementById('finance-value').value);
                        entry.category = document.getElementById('finance-category').value;
                        entry.supplierClient = document.getElementById('finance-supplier-client').value;
                        entry.paymentMethod = document.getElementById('finance-payment-method').value;
                        entry.orderLink = document.getElementById('finance-order-link').value || null;
                        if (type === 'incomes' || type === 'expenses') {
                            financeData.balance += (type === 'incomes' ? 1 : -1) * (entry.value - financeData[type][index].value);
                        }
                        localStorage.setItem('financeData', JSON.stringify(financeData));
                        financeForm.style.display = 'none';
                        e.target.value = '';
                        updateFinanceDashboard();
                    };
                } else if (action === 'delete') {
                    if (confirm('Tem certeza que deseja excluir este lançamento?')) {
                        if (type === 'incomes' || type === 'expenses') {
                            financeData.balance += (type === 'incomes' ? -1 : 1) * entry.value;
                        }
                        financeData[type].splice(index, 1);
                        localStorage.setItem('financeData', JSON.stringify(financeData));
                        e.target.value = '';
                        updateFinanceDashboard();
                    }
                } else if (action === 'pay' && type === 'payables') {
                    if (entry.status !== 'paid') {
                        entry.status = 'paid';
                        financeData.balance -= entry.value;
                        localStorage.setItem('financeData', JSON.stringify(financeData));
                        e.target.value = '';
                        updateFinanceDashboard();
                    }
                } else if (action === 'receive' && type === 'receivables') {
                    if (entry.status !== 'received') {
                        entry.status = 'received';
                        financeData.balance += entry.value;
                        localStorage.setItem('financeData', JSON.stringify(financeData));
                        e.target.value = '';
                        updateFinanceDashboard();
                    }
                }
            });
        });
    }

    if (document.querySelector('.dashboard-card')) {
        function updateDashboardCharts() {
            const stockData = JSON.parse(localStorage.getItem('stockData') || '[]');
            const products = JSON.parse(localStorage.getItem('products') || '[]');
            const kanbanCards = JSON.parse(localStorage.getItem('kanbanCards') || '[]');
            const financeData = JSON.parse(localStorage.getItem('financeData') || '{"incomes": [], "expenses": [], "payables": [], "receivables": [], "balance": 0}');

            const faturamentoCanvas = document.getElementById('faturamento-chart')?.getContext('2d');
            if (faturamentoCanvas) {
                const faturamentoData = financeData.incomes.reduce((acc, income) => {
                    const date = new Date(income.date);
                    const month = date.toLocaleString('default', { month: 'long' });
                    acc[month] = (acc[month] || 0) + income.value;
                    return acc;
                }, {});
                new Chart(faturamentoCanvas, {
                    type: 'line',
                    data: {
                        labels: Object.keys(faturamentoData),
                        datasets: [{
                            label: 'Faturamento (R$)',
                            data: Object.values(faturamentoData),
                            borderColor: '#264653',
                            fill: false
                        }]
                    },
                    options: { scales: { y: { beginAtZero: true } }, plugins: { legend: { position: 'top' } } }
                });
            }

            const maisVendidosCanvas = document.getElementById('mais-vendidos-chart')?.getContext('2d');
            if (maisVendidosCanvas) {
                const salesData = {};
                kanbanCards.forEach(card => {
                    card.items.forEach(item => {
                        salesData[item.name] = (salesData[item.name] || 0) + item.quantity;
                    });
                });
                const topProducts = Object.entries(salesData)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
                new Chart(maisVendidosCanvas, {
                    type: 'bar',
                    data: {
                        labels: Object.keys(topProducts),
                        datasets: [{
                            label: 'Quantidade Vendida',
                            data: Object.values(topProducts),
                            backgroundColor: '#264653'
                        }]
                    },
                    options: { scales: { y: { beginAtZero: true } }, plugins: { legend: { position: 'top' } } }
                });
            }

            const pedidosDiariosCanvas = document.getElementById('pedidos-diarios-chart')?.getContext('2d');
            if (pedidosDiariosCanvas) {
                const dailyOrders = {};
                kanbanCards.forEach(card => {
                    const date = new Date(parseInt(card.startTime)).toLocaleDateString();
                    dailyOrders[date] = (dailyOrders[date] || 0) + 1;
                });
                new Chart(pedidosDiariosCanvas, {
                    type: 'bar',
                    data: {
                        labels: Object.keys(dailyOrders),
                        datasets: [{
                            label: 'Pedidos',
                            data: Object.values(dailyOrders),
                            backgroundColor: '#8B2E3C'
                        }]
                    },
                    options: { scales: { y: { beginAtZero: true } }, plugins: { legend: { position: 'top' } } }
                });
            }

            const menosVendidosCanvas = document.getElementById('menos-vendidos-chart')?.getContext('2d');
            if (menosVendidosCanvas) {
                const salesData = {};
                kanbanCards.forEach(card => {
                    card.items.forEach(item => {
                        salesData[item.name] = (salesData[item.name] || 0) + item.quantity;
                    });
                });
                const bottomProducts = Object.entries(salesData)
                    .sort((a, b) => a[1] - b[1])
                    .slice(0, 5)
                    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
                new Chart(menosVendidosCanvas, {
                    type: 'bar',
                    data: {
                        labels: Object.keys(bottomProducts),
                        datasets: [{
                            label: 'Quantidade Vendida',
                            data: Object.values(bottomProducts),
                            backgroundColor: '#4E342E'
                        }]
                    },
                    options: { scales: { y: { beginAtZero: true } }, plugins: { legend: { position: 'top' } } }
                });
            }

            const itensCriticosCanvas = document.getElementById('itens-criticos-chart')?.getContext('2d');
            if (itensCriticosCanvas) {
                const criticalItems = stockData
                    .filter(item => item.quantity <= item.orderPoint)
                    .sort((a, b) => a.quantity - b.quantity)
                    .slice(0, 5)
                    .reduce((obj, item) => ({ ...obj, [item.name]: item.quantity }), {});
                new Chart(itensCriticosCanvas, {
                    type: 'bar',
                    data: {
                        labels: Object.keys(criticalItems),
                        datasets: [{
                            label: 'Quantidade em Estoque',
                            data: Object.values(criticalItems),
                            backgroundColor: '#8B2E3C'
                        }]
                    },
                    options: { scales: { y: { beginAtZero: true } }, plugins: { legend: { position: 'top' } } }
                });
            }

            const formasPagamentoCanvas = document.getElementById('formas-pagamento-chart')?.getContext('2d');
            if (formasPagamentoCanvas) {
                const paymentMethods = {};
                financeData.incomes.forEach(income => {
                    paymentMethods[income.paymentMethod || 'unknown'] = (paymentMethods[income.paymentMethod || 'unknown'] || 0) + income.value;
                });
                const cardBrands = {};
                financeData.incomes.forEach(income => {
                    if (income.paymentMethod === 'credit' || income.paymentMethod === 'debit') {
                        cardBrands[income.cardBrand || 'unknown'] = (cardBrands[income.cardBrand || 'unknown'] || 0) + income.value;
                    }
                });
                new Chart(formasPagamentoCanvas, {
                    type: 'pie',
                    data: {
                        labels: Object.keys(paymentMethods),
                        datasets: [{
                            label: 'Valor por Forma de Pagamento (R$)',
                            data: Object.values(paymentMethods),
                            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
                        }]
                    },
                    options: {
                        scales: { y: { beginAtZero: true } },
                        plugins: {
                            legend: { position: 'top' },
                            tooltip: {
                                callbacks: {
                                    label: (tooltipItem) => {
                                        const method = tooltipItem.label;
                                        if (method === 'credit' || method === 'debit') {
                                            const brandTotal = cardBrands[tooltipItem.label] || 0;
                                            return `${method}: R$ ${tooltipItem.raw.toFixed(2)} (Bandeiras: R$ ${brandTotal.toFixed(2)})`;
                                        }
                                        return `${method}: R$ ${tooltipItem.raw.toFixed(2)}`;
                                    }
                                }
                            }
                        }
                    }
                });
            }

            const formasVendasCanvas = document.getElementById('formas-vendas-chart')?.getContext('2d');
            if (formasVendasCanvas) {
                new Chart(formasVendasCanvas, {
                    type: 'bar',
                    data: {
                        labels: ['App', 'Balcão', 'Delivery', 'Caixa'],
                        datasets: [{
                            label: 'Vendas (Placeholder)',
                            data: [0, 0, 0, 0],
                            backgroundColor: '#6C757D'
                        }]
                    },
                    options: {
                        scales: { y: { beginAtZero: true } },
                        plugins: {
                            legend: { position: 'top' },
                            title: { display: true, text: 'Formas de Vendas (Em Desenvolvimento)' }
                        }
                    }
                });
            }
        }

        updateDashboardCharts();
        window.addEventListener('storage', updateDashboardCharts);
    }

    function createOrderCard() {
        orderIdCounter++;
        localStorage.setItem('orderIdCounter', orderIdCounter);
        const orderNumber = `#${orderIdCounter.toString().padStart(5, '0')}`;
        const paymentMethod = document.getElementById('payment-method').value;
        const cardBrand = document.getElementById('card-brand')?.value || '';
        const itemsList = orderItems.map(item => `${item.name} (x${item.quantity}) - R$ ${item.itemTotal.toFixed(2)}`).join('<br>');
        const card = document.createElement('div');
        card.className = 'kanban-card';
        card.dataset.orderId = orderNumber;
        card.innerHTML = `
            <div>Pedido: ${orderNumber}</div>
            <div>Nome: ${clientInfo.name}</div>
            <div>Endereço: ${clientInfo.address}</div>
            <div>Observações: ${clientInfo.observations}</div>
            <div>Itens:<br>${itemsList}</div>
            <div>Pagamento: ${paymentMethod}${cardBrand ? ` (${cardBrand})` : ''}</div>
            <div>R$ ${total.toFixed(2)}</div>
            <div class="time">0 min</div>
            <button class="ok-btn">OK</button>
        `;
        card.dataset.startTime = new Date().getTime();
        card.dataset.column = 'awaiting';
        card.dataset.columnTimes = { awaiting: 0, preparing: 0, delivering: 0, completed: 0 };
        if (awaitingCards) {
            awaitingCards.appendChild(card);
        }

        const okBtn = card.querySelector('.ok-btn');
        okBtn.addEventListener('click', () => moveCard(card));

        let cards = JSON.parse(localStorage.getItem('kanbanCards') || '[]');
        cards.push({
            orderId: orderNumber,
            html: card.innerHTML,
            startTime: card.dataset.startTime,
            column: card.dataset.column,
            columnTimes: card.dataset.columnTimes,
            items: orderItems,
            total: total,
            clientInfo: clientInfo,
            paymentMethod: paymentMethod,
            cardBrand: cardBrand
        });
        localStorage.setItem('kanbanCards', JSON.stringify(cards));
        playNotificationSound();
    }

    function moveCard(card) {
        const currentColumn = card.dataset.column;
        const nextColumn = {
            'awaiting': 'preparing',
            'preparing': 'delivering',
            'delivering': 'completed'
        }[currentColumn];

        if (nextColumn) {
            const timeElement = card.querySelector('.time');
            timeElement.textContent = '0 min';
            card.dataset.startTime = new Date().getTime();
            card.dataset.columnTimes[currentColumn] = parseInt(timeElement.textContent) || 0;
            card.dataset.column = nextColumn;

            let buttonHtml = nextColumn === 'completed' ? '<button class="conclude-btn">Concluir</button>' : '<button class="ok-btn">OK</button>';
            card.innerHTML = card.innerHTML.replace(/<button class="ok-btn">OK<\/button>|<button class="conclude-btn">Concluir<\/button>/, buttonHtml);

            const targetColumn = document.getElementById(`${nextColumn}-cards`);
            if (targetColumn) {
                targetColumn.appendChild(card);
            }

            const okBtn = card.querySelector('.ok-btn');
            const concludeBtn = card.querySelector('.conclude-btn');
            if (okBtn) okBtn.addEventListener('click', () => moveCard(card));
            if (concludeBtn) concludeBtn.addEventListener('click', () => concludeOrder(card));

            playNotificationSound();

            let cards = JSON.parse(localStorage.getItem('kanbanCards') || '[]');
            cards = cards.map(c => c.orderId === card.dataset.orderId ? { ...c, column: nextColumn, html: card.innerHTML, columnTimes: card.dataset.columnTimes, startTime: card.dataset.startTime } : c);
            localStorage.setItem('kanbanCards', JSON.stringify(cards));
        }
    }

    function concludeOrder(card) {
        const timeElement = card.querySelector('.time');
        timeElement.textContent = '0 min';
        card.dataset.startTime = null;
        card.dataset.columnTimes.completed = 0;

        const concludeBtn = card.querySelector('.conclude-btn');
        concludeBtn.removeEventListener('click', concludeOrder);
        concludeBtn.textContent = 'Concluído';
        concludeBtn.className = 'conclude-btn completed';
        concludeBtn.disabled = true;

        let cards = JSON.parse(localStorage.getItem('kanbanCards') || '[]');
        cards = cards.map(c => c.orderId === card.dataset.orderId ? { ...c, html: card.innerHTML, columnTimes: card.dataset.columnTimes, startTime: null } : c);
        localStorage.setItem('kanbanCards', JSON.stringify(cards));
    }

    function updateKanbanTimes() {
        const cards = document.querySelectorAll('.kanban-card');
        cards.forEach(card => {
            const startTime = parseInt(card.dataset.startTime) || 0;
            if (!startTime) return;
            const now = new Date().getTime();
            const timeDiff = Math.floor((now - startTime) / 60000);
            const timeElement = card.querySelector('.time');
            if (!timeElement) return;

            let colorClass;
            const column = card.dataset.column;
            if (column === 'delivering') {
                if (timeDiff <= 10) colorClass = 'green';
                else if (timeDiff <= 25) colorClass = 'orange';
                else colorClass = 'red';
            } else if (column === 'awaiting' || column === 'preparing') {
                if (timeDiff <= 5) colorClass = 'green';
                else if (timeDiff <= 10) colorClass = 'orange';
                else colorClass = 'red';
            } else {
                colorClass = 'green';
            }

            timeElement.textContent = `${timeDiff} min`;
            timeElement.className = `time ${colorClass}`;
        });
        setTimeout(updateKanbanTimes, 60000);
    }

    function updateOrderCommands() {
        const orderItemsDiv = document.getElementById('order-items');
        if (orderItemsDiv) {
            orderItemsDiv.innerHTML = orderItems.map(item => `
                <div class="order-item">${item.name} (x${item.quantity}) - R$ ${item.itemTotal.toFixed(2)}</div>
            `).join('');
            document.querySelector('.order-commands p').textContent = `Total: R$ ${total.toFixed(2)}`;
            document.getElementById('client-name').textContent = clientInfo.name || '[Nome do cliente]';
            document.getElementById('client-address').textContent = clientInfo.address || '[Endereço completo]';
            document.getElementById('client-observations').textContent = clientInfo.observations || '[Observações]';
        }
    }

    function playNotificationSound() {
        const audio = new Audio('../audio/audio-finalizado.mp3');
        audio.play().catch(error => console.log('Erro ao reproduzir áudio:', error));
    }

    const addProductBtn = document.getElementById('add-product-btn');
    const productForm = document.getElementById('product-form');
    let productIdCounter = parseInt(localStorage.getItem('productIdCounter') || '0');
    let products = JSON.parse(localStorage.getItem('products') || '[]');

    if (addProductBtn && productForm) {
        addProductBtn.addEventListener('click', () => {
            productForm.style.display = 'block';
            const formData = productForm.querySelector('#product-form-data');
            if (formData) {
                formData.reset();
                document.getElementById('product-sku').value = '';
                document.getElementById('product-cost').value = '0.00';
                document.getElementById('availability-status').textContent = 'Verificando...';
            }
        });

        const productFormData = document.getElementById('product-form-data');
        if (productFormData) {
            productFormData.addEventListener('submit', (e) => {
                e.preventDefault();
                const category = document.getElementById('product-category').value;
                if (!category) {
                    alert('Selecione uma categoria!');
                    return;
                }
                productIdCounter++;
                localStorage.setItem('productIdCounter', productIdCounter);
                const skuBase = category.charAt(0).toUpperCase() + productIdCounter.toString().padStart(4, '0');
                const sku = `${skuBase}-${new Date().getFullYear()}`;
                const name = document.getElementById('product-name').value;
                const description = document.getElementById('product-description').value;
                const salePrice = parseFloat(document.getElementById('product-sale-price').value) || 0.00;
                let cost = parseFloat(document.getElementById('product-cost').value) || 0.00;

                const ingredients = [];
                document.querySelectorAll('#ingredients-list .ingredient-row').forEach(row => {
                    const name = row.querySelector('.ingredient-name').value;
                    const quantity = parseFloat(row.querySelector('.ingredient-quantity').value) || 0;
                    const unit = row.querySelector('.ingredient-unit').value;
                    if (name && quantity > 0) ingredients.push({ name, quantity, unit });
                });

                let totalCost = 0;
                const stockData = JSON.parse(localStorage.getItem('stockData') || '[]');
                ingredients.forEach(ingredient => {
                    const stockItem = stockData.find(item => item.name.toLowerCase() === ingredient.name.toLowerCase());
                    if (stockItem) {
                        totalCost += (stockItem.cost * ingredient.quantity) / (stockItem.unit === 'un' ? 1 : stockItem.unit === 'g' ? 1000 : 1000);
                    }
                });
                document.getElementById('product-cost').value = totalCost.toFixed(2);

                let isAvailable = true;
                ingredients.forEach(ingredient => {
                    const stockItem = stockData.find(item => item.name.toLowerCase() === ingredient.name.toLowerCase());
                    if (stockItem && stockItem.quantity < ingredient.quantity) {
                        isAvailable = false;
                    }
                });
                document.getElementById('availability-status').textContent = isAvailable ? 'Disponível' : 'Indisponível';

                const newProduct = {
                    id: productIdCounter,
                    sku: sku,
                    name: name,
                    description: description,
                    salePrice: salePrice,
                    cost: totalCost,
                    category: category,
                    ingredients: ingredients,
                    availability: isAvailable
                };

                products.push(newProduct);
                localStorage.setItem('products', JSON.stringify(products));
                productForm.style.display = 'none';
                loadProductTable();
            });
        }

        document.getElementById('add-ingredient-btn')?.addEventListener('click', () => {
            const ingredientsList = document.getElementById('ingredients-list');
            if (ingredientsList) {
                const row = document.createElement('div');
                row.className = 'ingredient-row';
                row.innerHTML = `
                    <input type="text" class="ingredient-name" placeholder="Nome do insumo">
                    <input type="number" class="ingredient-quantity" placeholder="Quantidade" min="0" step="0.01">
                    <select class="ingredient-unit">
                        <option value="g">Gramas (g)</option>
                        <option value="ml">Mililitros (ml)</option>
                        <option value="un">Unidades (un)</option>
                    </select>
                    <button type="button" class="remove-ingredient-btn">Remover</button>
                `;
                ingredientsList.appendChild(row);
                row.querySelector('.remove-ingredient-btn').addEventListener('click', () => {
                    row.remove();
                    updateProductCost();
                });
            }
        });

        document.getElementById('add-option-btn')?.addEventListener('click', () => {
            const optionsList = document.getElementById('options-list');
            if (optionsList) {
                const row = document.createElement('div');
                row.className = 'option-row';
                row.innerHTML = `
                    <input type="text" class="option-name" placeholder="Nome da opção">
                    <input type="text" class="option-value" placeholder="Valor da opção">
                    <button type="button" class="remove-option-btn">Remover</button>
                `;
                optionsList.appendChild(row);
                row.querySelector('.remove-option-btn').addEventListener('click', () => {
                    row.remove();
                });
            }
        });

        document.getElementById('cancel-product-btn')?.addEventListener('click', () => {
            const productForm = document.getElementById('product-form');
            if (productForm) productForm.style.display = 'none';
        });

        function updateProductCost() {
            const ingredients = document.querySelectorAll('#ingredients-list .ingredient-row');
            let totalCost = 0;
            const stockData = JSON.parse(localStorage.getItem('stockData') || '[]');
            ingredients.forEach(row => {
                const name = row.querySelector('.ingredient-name').value;
                const quantity = parseFloat(row.querySelector('.ingredient-quantity').value) || 0;
                const unit = row.querySelector('.ingredient-unit').value;
                const stockItem = stockData.find(item => item.name.toLowerCase() === name.toLowerCase());
                if (stockItem) {
                    totalCost += (stockItem.cost * quantity) / (stockItem.unit === 'un' ? 1 : stockItem.unit === 'g' ? 1000 : 1000);
                }
            });
            document.getElementById('product-cost').value = totalCost.toFixed(2);
            checkAvailability();
        }

        function checkAvailability() {
            const ingredients = document.querySelectorAll('#ingredients-list .ingredient-row');
            let isAvailable = true;
            const stockData = JSON.parse(localStorage.getItem('stockData') || '[]');
            ingredients.forEach(row => {
                const name = row.querySelector('.ingredient-name').value;
                const quantity = parseFloat(row.querySelector('.ingredient-quantity').value) || 0;
                const stockItem = stockData.find(item => item.name.toLowerCase() === name.toLowerCase());
                if (stockItem && stockItem.quantity < quantity) {
                    isAvailable = false;
                }
            });
            document.getElementById('availability-status').textContent = isAvailable ? 'Disponível' : 'Indisponível';
        }

        document.querySelectorAll('#ingredients-list .ingredient-row input')?.forEach(input => {
            input.addEventListener('input', updateProductCost);
        });

        function loadProductTable() {
            const productTable = document.getElementById('product-table');
            if (productTable) {
                productTable.innerHTML = '';
                products.forEach(product => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${product.name}</td>
                        <td>${product.sku}</td>
                        <td>R$ ${product.salePrice.toFixed(2)}</td>
                        <td>R$ ${product.cost.toFixed(2)}</td>
                        <td>${product.category}</td>
                        <td>${product.availability ? 'Disponível' : 'Indisponível'}</td>
                        <td><select class="btn-select"><option value="">Ações</option><option value="edit">Editar</option><option value="remove">Remover</option></select></td>
                    `;
                    productTable.appendChild(row);

                    row.querySelector('.btn-select').addEventListener('change', (e) => {
                        const action = e.target.value;
                        const index = Array.from(productTable.children).indexOf(row);
                        if (action === 'edit') {
                            productForm.style.display = 'block';
                            const product = products[index];
                            document.getElementById('product-name').value = product.name;
                            document.getElementById('product-description').value = product.description;
                            document.getElementById('product-sale-price').value = product.salePrice;
                            document.getElementById('product-cost').value = product.cost;
                            document.getElementById('product-category').value = product.category;
                            document.getElementById('product-sku').value = product.sku;
                            document.getElementById('availability-status').textContent = product.availability ? 'Disponível' : 'Indisponível';
                            document.getElementById('ingredients-list').innerHTML = '';
                            product.ingredients.forEach(ingredient => {
                                const row = document.createElement('div');
                                row.className = 'ingredient-row';
                                row.innerHTML = `
                                    <input type="text" class="ingredient-name" value="${ingredient.name}" placeholder="Nome do insumo">
                                    <input type="number" class="ingredient-quantity" value="${ingredient.quantity}" placeholder="Quantidade" min="0" step="0.01">
                                    <select class="ingredient-unit">
                                        <option value="g" ${ingredient.unit === 'g' ? 'selected' : ''}>Gramas (g)</option>
                                        <option value="ml" ${ingredient.unit === 'ml' ? 'selected' : ''}>Mililitros (ml)</option>
                                        <option value="un" ${ingredient.unit === 'un' ? 'selected' : ''}>Unidades (un)</option>
                                    </select>
                                    <button type="button" class="remove-ingredient-btn">Remover</button>
                                `;
                                document.getElementById('ingredients-list').appendChild(row);
                                row.querySelector('.remove-ingredient-btn').addEventListener('click', () => {
                                    row.remove();
                                    updateProductCost();
                                });
                            });
                            document.getElementById('product-form-data').onsubmit = (e) => {
                                e.preventDefault();
                                products[index] = {
                                    id: product.id,
                                    sku: document.getElementById('product-sku').value,
                                    name: document.getElementById('product-name').value,
                                    description: document.getElementById('product-description').value,
                                    salePrice: parseFloat(document.getElementById('product-sale-price').value) || 0.00,
                                    cost: parseFloat(document.getElementById('product-cost').value) || 0.00,
                                    category: document.getElementById('product-category').value,
                                    ingredients: Array.from(document.querySelectorAll('#ingredients-list .ingredient-row')).map(row => ({
                                        name: row.querySelector('.ingredient-name').value,
                                        quantity: parseFloat(row.querySelector('.ingredient-quantity').value) || 0,
                                        unit: row.querySelector('.ingredient-unit').value
                                    })),
                                    availability: document.getElementById('availability-status').textContent === 'Disponível'
                                };
                                localStorage.setItem('products', JSON.stringify(products));
                                productForm.style.display = 'none';
                                loadProductTable();
                            };
                        } else if (action === 'remove') {
                            if (confirm('Tem certeza que deseja remover este produto?')) {
                                products.splice(index, 1);
                                localStorage.setItem('products', JSON.stringify(products));
                                loadProductTable();
                            }
                        }
                        e.target.value = '';
                    });
                });
            }
        }
        loadProductTable();
    }
});