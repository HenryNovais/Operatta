document.addEventListener('DOMContentLoaded', () => {
  const logoImage = document.getElementById('logo-image');
  const loginBox = document.getElementById('login-box');
  const errorMessage = document.getElementById('error-message');

  // Animação inicial da logomarca (apenas para index.html)
  if (logoImage && loginBox) {
    setTimeout(() => {
      logoImage.classList.add('active');
    }, 500);

    setTimeout(() => {
      logoImage.classList.add('moved');
      loginBox.classList.add('active');
    }, 2500);

    // Validação e redirecionamento de login
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

  // Lógica de navegação no sidebar
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

    // Submenu hover logic
    const submenu = link.querySelector('.submenu');
    if (submenu) {
      link.addEventListener('mouseenter', () => {
        submenu.style.display = 'block';
      });
      link.addEventListener('mouseleave', () => {
        submenu.style.display = 'none';
      });
      submenu.querySelectorAll('li').forEach(subLink => {
        subLink.addEventListener('click', (e) => {
          e.stopPropagation();
          const reportType = subLink.dataset.report;
          const reportSelect = document.getElementById('report-type');
          if (reportType === 'sales') reportSelect.value = 'sales-period';
          else if (reportType === 'finance') reportSelect.value = 'finance-revenue';
          else if (reportType === 'stock') reportSelect.value = 'stock-current';
          else if (reportType === 'clients') reportSelect.value = 'clients-list';
          else if (reportType === 'marketing') reportSelect.value = 'marketing-campaigns';
          generateReport();
        });
      });
    }
  });

  // Lógica para Administração
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

    cancelUserFormBtn.addEventListener('click', () => {
      userForm.style.display = 'none';
    });

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

    function loadUserTable() {
      const table = document.getElementById('user-table');
      if (table) {
        table.querySelector('tbody').innerHTML = users.map(user => `
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
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', 'backup.xlsm');
    link.click();
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
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', 'relatorio.xlsm');
    link.click();
  });

  // Lógica para Relatórios
  function generateReport() {
    const reportType = document.getElementById('report-type').value;
    let content = '';
    if (reportType === 'sales-period') content = 'Relatório de Vendas por Período: Em desenvolvimento';
    else if (reportType === 'finance-revenue') content = 'Relatório de Receita Financeira: Em desenvolvimento';
    else if (reportType === 'stock-current') content = 'Relatório de Estoque Atual: Em desenvolvimento';
    else if (reportType === 'clients-list') content = 'Lista de Clientes: Em desenvolvimento';
    else if (reportType === 'marketing-campaigns') content = 'Campanhas de Marketing: Em desenvolvimento';
    document.getElementById('report-output').innerHTML = content;
    document.getElementById('report-output').style.display = 'block';
  }

  // Lógica para tela de Pedidos
  const newOrderBtn = document.getElementById('new-order-btn');
  const orderSection = document.getElementById('new-order-section');
  const orderCommands = document.createElement('div');
  const realTimeBtn = document.getElementById('real-time-btn');
  let orderIdCounter = parseInt(localStorage.getItem('orderIdCounter') || '0');
  let total = 0;
  const orderItems = [];

  if (newOrderBtn && orderSection) {
    // Inicializa a comanda
    if (!document.getElementById('order-commands')) {
      orderCommands.id = 'order-commands';
      orderCommands.className = 'order-commands';
      orderCommands.innerHTML = '<h3>Comanda</h3><p>Total: R$ 0.00</p><div id="order-items"></div>';
      orderSection.parentNode.insertBefore(orderCommands, orderSection.nextSibling);
    }

    // Gerencia quantidade nos cards
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
          orderItems.push({ name, quantity, itemTotal });
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
          <option value="credit">Crédito</option>
          <option value="debit">Débito</option>
          <option value="cash">Dinheiro</option>
          <option value="pix">Pix</option>
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
        if (paymentMethod.value && (paymentMethod.value !== 'credit' && paymentMethod.value !== 'debit' || cardBrands.style.display === 'block' && document.getElementById('card-brand').value)) {
          createOrderCard();
          paymentForm.remove();
          orderItems.length = 0;
          total = 0;
          updateOrderCommands();
        } else {
          alert('Selecione a forma de pagamento e, se aplicável, a bandeira.');
        }
      });
    });
  }

  // Atalho F9 para Tempo Real
  document.addEventListener('keydown', (e) => {
    if (e.key === 'F9') {
      window.location.href = '../html/real-time.html';
      e.preventDefault();
    }
  });

  // Redirecionamento do botão Tempo Real
  if (realTimeBtn) {
    realTimeBtn.addEventListener('click', () => {
      window.location.href = '../html/real-time.html';
    });
  }

  // Lógica para tela Tempo Real
  const awaitingCards = document.getElementById('awaiting-cards');
  const preparingCards = document.getElementById('preparing-cards');
  const deliveringCards = document.getElementById('delivering-cards');
  const completedCards = document.getElementById('completed-cards');

  if (awaitingCards) {
    // Carrega cards salvos no localStorage
    let cards = JSON.parse(localStorage.getItem('kanbanCards') || '[]');
    cards.forEach(cardData => {
      const card = document.createElement('div');
      card.className = 'kanban-card';
      card.innerHTML = cardData.html;
      card.dataset.startTime = cardData.startTime;
      card.dataset.column = cardData.column;
      document.getElementById(`${cardData.column}-cards`).appendChild(card);

      const okBtn = card.querySelector('.ok-btn');
      if (okBtn) {
        okBtn.addEventListener('click', () => moveCard(card));
      }
    });

    // Atualiza o tempo dinamicamente
    updateKanbanTimes();
  }

  // Lógica para tela de Estoque
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

  // Função auxiliar para gerar ID único
  function generateUniqueId() {
    return 'item-' + Math.random().toString(36).substr(2, 9);
  }

  // Função para validar dados do item
  function validateItem(item, isEdit = false, currentIndex = -1) {
    const errors = [];
    if (!item.name) errors.push('Nome do item é obrigatório.');
    if (!item.sku) errors.push('SKU é obrigatório.');
    if (!isEdit && stockData.some((existingItem, idx) => existingItem.sku === item.sku && idx !== currentIndex)) {
      errors.push('SKU já existe no estoque.');
    }
    if (isNaN(item.quantity) || item.quantity < 0) errors.push('Quantidade deve ser um número não negativo.');
    if (isNaN(item.minStock) || item.minStock < 0) errors.push('Estoque mínimo deve ser um número não negativo.');
    if (isNaN(item.maxStock) || item.maxStock < item.minStock) errors.push('Estoque máximo deve ser maior ou igual ao estoque mínimo.');
    if (isNaN(item.orderPoint) || item.orderPoint < 0 || item.orderPoint > item.maxStock) {
      errors.push('Ponto de pedido deve estar entre 0 e o estoque máximo.');
    }
    if (isNaN(item.cost) || item.cost < 0) errors.push('Custo deve ser um número não negativo.');
    if (!item.unit) errors.push('Unidade é obrigatória.');
    if (!item.category) errors.push('Categoria é obrigatória.');
    if (!item.supplier) errors.push('Fornecedor é obrigatório.');
    if (!item.location) errors.push('Localização é obrigatória.');
    return errors;
  }

  if (stockItems) {
    // Inicializa estoque com IDs únicos, se necessário
    stockData = stockData.map(item => ({
      ...item,
      id: item.id || generateUniqueId()
    }));
    localStorage.setItem('stockData', JSON.stringify(stockData));

    // Adiciona botão de fechar à tabela de estoque
    if (stockTableContainer) {
      const closeButton = document.createElement('button');
      closeButton.id = 'close-stock-table';
      closeButton.textContent = 'x';
      closeButton.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background-color: #8B2E3C;
        color: #F5F0E6;
        border: none;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        font-size: 18px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 0.2s;
      `;
      closeButton.addEventListener('mouseover', () => {
        closeButton.style.opacity = '0.8';
      });
      closeButton.addEventListener('mouseout', () => {
        closeButton.style.opacity = '1';
      });
      closeButton.addEventListener('click', () => {
        stockTableContainer.style.display = 'none';
      });
      stockTableContainer.appendChild(closeButton);
    }

    // Inicializa gráficos
    updateDashboard();

    // Abrir formulário ao clicar em Adicionar Item
    addItemBtn?.addEventListener('click', () => {
      document.getElementById('form-title').textContent = 'Adicionar Item';
      itemForm.style.display = 'block';
      itemFormData.reset();
      itemFormData.dataset.action = 'add';
    });

    // Salvar item no formulário
    itemFormData?.addEventListener('submit', (e) => {
      e.preventDefault();
      const action = itemFormData.dataset.action || 'add';
      const index = parseInt(itemFormData.dataset.index || -1);
      const newItem = {
        id: action === 'add' ? generateUniqueId() : stockData[index]?.id || generateUniqueId(),
        name: document.getElementById('item-name').value.trim(),
        sku: document.getElementById('item-sku').value.trim(),
        unit: document.getElementById('item-unit').value,
        category: document.getElementById('item-category').value,
        supplier: document.getElementById('item-supplier').value,
        quantity: parseInt(document.getElementById('item-quantity').value),
        minStock: parseInt(document.getElementById('item-min-stock').value),
        maxStock: parseInt(document.getElementById('item-max-stock').value),
        orderPoint: parseInt(document.getElementById('item-order-point').value),
        cost: parseFloat(document.getElementById('item-cost').value),
        validity: document.getElementById('item-validity').value,
        location: document.getElementById('item-location').value
      };
      newItem.totalCost = newItem.quantity * newItem.cost;

      const errors = validateItem(newItem, action !== 'add', index);
      if (errors.length > 0) {
        alert('Erro ao salvar item:\n' + errors.join('\n'));
        return;
      }

      if (action === 'add') {
        stockData.push(newItem);
      } else if (action === 'edit') {
        stockData[index] = newItem;
      } else if (action === 'entry' || action === 'exit') {
        const quantityChange = parseInt(document.getElementById('item-quantity').value);
        if (isNaN(quantityChange) || quantityChange <= 0) {
          alert('Quantidade deve ser um número positivo.');
          return;
        }
        stockData[index].quantity += action === 'entry' ? quantityChange : -quantityChange;
        if (stockData[index].quantity < 0) {
          alert('Quantidade não pode ser negativa.');
          return;
        }
        stockData[index].totalCost = stockData[index].quantity * stockData[index].cost;
      }

      localStorage.setItem('stockData', JSON.stringify(stockData));
      loadStockTable();
      itemForm.style.display = 'none';
      updateDashboard();
      checkOrderPoints();
      itemFormData.dataset.action = '';
      itemFormData.dataset.index = '';
    });

    // Cancelar formulário
    cancelFormBtn?.addEventListener('click', () => {
      itemForm.style.display = 'none';
      itemFormData.dataset.action = '';
      itemFormData.dataset.index = '';
    });

    // Importar/Exportar Dados
    importExportBtn?.addEventListener('click', () => {
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

    // Mostrar/Esconder tabela ao clicar em Visão do Estoque
    stockViewBtn?.addEventListener('click', () => {
      const isVisible = stockTableContainer.style.display === 'block';
      stockTableContainer.style.display = isVisible ? 'none' : 'block';
      if (!isVisible) {
        loadStockTable();
      }
    });

    // Ações por item (Editar, Remover, Entrada, Saída)
    stockItems?.addEventListener('change', (e) => {
      const select = e.target.closest('.btn-select');
      if (select) {
        const row = select.closest('tr');
        const index = Array.from(stockItems.children).indexOf(row);
        const action = select.value;
        if (action) {
          document.getElementById('form-title').textContent = `${action.charAt(0).toUpperCase() + action.slice(1)} Item`;
          itemForm.style.display = 'block';
          const item = stockData[index];
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

          itemFormData.dataset.action = action;
          itemFormData.dataset.index = index;

          if (action === 'remove') {
            if (confirm('Tem certeza que deseja remover este item?')) {
              stockData.splice(index, 1);
              localStorage.setItem('stockData', JSON.stringify(stockData));
              loadStockTable();
              itemForm.style.display = 'none';
              select.value = '';
              updateDashboard();
              checkOrderPoints();
            } else {
              itemForm.style.display = 'none';
              select.value = '';
            }
          }
        }
        select.value = '';
      }
    });

    // Filtros e Busca
    searchInput?.addEventListener('input', filterTable);
    categoryFilter?.addEventListener('change', filterTable);
    sortSelect?.addEventListener('change', filterTable);

    function filterTable() {
      const searchTerm = searchInput?.value.toLowerCase() || '';
      const category = categoryFilter?.value || '';
      const sort = sortSelect?.value || 'name-asc';

      let filteredData = stockData.filter(item => {
        return (item.name.toLowerCase().includes(searchTerm) || item.sku.toLowerCase().includes(searchTerm)) &&
          (category === '' || item.category === category);
      });

      filteredData.sort((a, b) => {
        if (sort === 'name-asc') return a.name.localeCompare(b.name);
        if (sort === 'name-desc') return b.name.localeCompare(a.name);
        if (sort === 'quantity-asc') return a.quantity - b.quantity;
        if (sort === 'quantity-desc') return b.quantity - a.quantity;
        if (sort === 'validity-asc') return new Date(a.validity) - new Date(b.validity);
        return 0;
      });

      stockItems.innerHTML = '';
      filteredData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${item.name}</td>
          <td>${item.sku}</td>
          <td>${item.unit}</td>
          <td>${item.category}</td>
          <td>${item.supplier}</td>
          <td>${item.quantity}${item.quantity <= item.minStock ? '<span class="stock-alert low"></span>' : ''}</td>
          <td>${item.minStock}</td>
          <td>${item.maxStock}</td>
          <td>${item.orderPoint}</td>
          <td>R$ ${item.cost.toFixed(2)}</td>
          <td>R$ ${item.totalCost.toFixed(2)}</td>
          <td>${item.validity}</td>
          <td>${item.location}</td>
          <td>
            <select class="btn-select">
              <option value="">Ações</option>
              <option value="edit">Editar</option>
              <option value="remove">Remover</option>
              <option value="entry">Registrar Entrada</option>
              <option value="exit">Registrar Saída</option>
            </select>
          </td>
        `;
        stockItems.appendChild(row);
      });
    }

    function loadStockTable() {
      filterTable();
    }

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
      if (locationChartCanvas) {
        locationChart = new Chart(locationChartCanvas, {
          type: 'bar',
          data: {
            labels: locations,
            datasets: locationDatasets
          },
          options: {
            scales: { y: { beginAtZero: true } },
            plugins: { legend: { position: 'top' } }
          }
        });
      }

      const categoryTotals = stockData.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.quantity;
        return acc;
      }, {});
      if (categoryChartCanvas) {
        categoryChart = new Chart(categoryChartCanvas, {
          type: 'pie',
          data: {
            labels: Object.keys(categoryTotals),
            datasets: [{
              data: Object.values(categoryTotals),
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
            }]
          },
          options: { plugins: { legend: { position: 'top' } } }
        });
      }

      const minVsRealData = stockData.map(item => ({ name: item.name, min: item.minStock, real: item.quantity }));
      if (minVsRealChartCanvas) {
        minVsRealChart = new Chart(minVsRealChartCanvas, {
          type: 'line',
          data: {
            labels: minVsRealData.map(item => item.name),
            datasets: [{
              label: 'Estoque Mínimo',
              data: minVsRealData.map(item => item.min),
              borderColor: '#FF6384',
              fill: false
            }, {
              label: 'Estoque Real',
              data: minVsRealData.map(item => item.real),
              borderColor: '#36A2EB',
              fill: false
            }]
          },
          options: {
            scales: { y: { beginAtZero: true } },
            plugins: { legend: { position: 'top' } }
          }
        });
      }
    }

    function checkOrderPoints() {
      const alerts = stockData.filter(item => item.quantity <= item.orderPoint)
        .map(item => `${item.name} está no ponto de pedido (${item.quantity}/${item.orderPoint}).`);
      if (alerts.length > 0) {
        localStorage.setItem('dashboardAlerts', JSON.stringify(alerts));
        alert(`Atenção: Os seguintes itens atingiram o ponto de pedido:\n${alerts.join(', ')}`);
      } else {
        localStorage.removeItem('dashboardAlerts');
      }
    }

    loadStockTable();
  }

  // Lógica para tela de Financeiro
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

    dateFilter?.addEventListener('change', (e) => {
      customStartDate.style.display = e.target.value === 'custom' ? 'inline-block' : 'none';
      customEndDate.style.display = e.target.value === 'custom' ? 'inline-block' : 'none';
      updateFinanceDashboard();
    });

    customStartDate?.addEventListener('change', updateFinanceDashboard);
    customEndDate?.addEventListener('change', updateFinanceDashboard);

    addIncomeBtn?.addEventListener('click', () => {
      document.getElementById('form-title').textContent = 'Lançar Receita';
      financeForm.style.display = 'block';
      financeFormData.reset();
    });

    addExpenseBtn?.addEventListener('click', () => {
      document.getElementById('form-title').textContent = 'Lançar Despesa';
      financeForm.style.display = 'block';
      financeFormData.reset();
    });

    financeFormData?.addEventListener('submit', (e) => {
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

    cancelFinanceFormBtn?.addEventListener('click', () => {
      financeForm.style.display = 'none';
    });

    exportBtn?.addEventListener('click', () => {
      const dataStr = 'data:text/xlsm;charset=utf-8,' + encodeURIComponent(JSON.stringify(financeData));
      const xlsmLink = document.createElement('a');
      xlsmLink.setAttribute('href', dataStr);
      xlsmLink.setAttribute('download', 'financeiro.xlsm');
      xlsmLink.click();
    });

    reportBtn?.addEventListener('click', () => {
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
          endDate = new Date(startDate);
          endDate.setHours(23, 59, 59, 999);
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
      const payableTotal = financeData.payables.reduce((sum, p) => sum + p.value, 0);
      const receivableTotal = financeData.receivables.reduce((sum, r) => sum + r.value, 0);

      currentBalance.textContent = `R$ ${financeData.balance.toFixed(2)}`;
      periodIncome.textContent = `R$ ${incomeTotal.toFixed(2)}`;
      periodExpenses.textContent = `R$ ${expenseTotal.toFixed(2)}`;
      profitLoss.textContent = `R$ ${profit.toFixed(2)}`;
      profitLoss.style.color = profit >= 0 ? '#28A745' : '#DC3545';
      totalPayable.textContent = `R$ ${payableTotal.toFixed(2)}`;
      totalReceivable.textContent = `R$ ${receivableTotal.toFixed(2)}`;

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

      payableList.innerHTML = financeData.payables.map(p => {
        const isOverdue = new Date(p.dueDate) < new Date() && p.status !== 'paid';
        return `
          <tr>
            <td>${p.dueDate}</td>
            <td>R$ ${p.value.toFixed(2)}</td>
            <td>${p.supplier}</td>
            <td class="status${p.status}">${isOverdue ? 'Atrasado' : p.status === 'paid' ? 'Pago' : 'Pendente'}</td>
            <td><select class="btn-select"><option value="">Ações</option><option value="pay">Pagar</option><option value="edit">Editar</option><option value="delete">Excluir</option></select></td>
          </tr>
        `;
      }).join('');
      receivableList.innerHTML = financeData.receivables.map(r => `
        <tr>
          <td>${r.dueDate}</td>
          <td>R$ ${r.value.toFixed(2)}</td>
          <td>${r.client}</td>
          <td class="status${r.status}">${r.status === 'pending' ? 'Pendente' : 'Recebido'}</td>
          <td><select class="btn-select"><option value="">Ações</option><option value="receive">Receber</option><option value="edit">Editar</option><option value="delete">Excluir</option></select></td>
        </tr>
      `).join('');

      if (cashFlowChart) cashFlowChart.destroy();
      if (expenseCategoryChart) expenseCategoryChart.destroy();

      const cashFlowData = filteredIncomes.map(i => ({ date: new Date(i.date), value: i.value }))
        .concat(filteredExpenses.map(e => ({ date: new Date(e.date), value: -e.value })))
        .sort((a, b) => a.date - b.date);
      const cumulativeValues = [];
      let runningTotal = 0;
      cashFlowData.forEach(item => {
        runningTotal += item.value;
        cumulativeValues.push(runningTotal);
      });

      if (cashFlowChartCanvas) {
        cashFlowChart = new Chart(cashFlowChartCanvas, {
          type: 'line',
          data: {
            labels: cashFlowData.map(item => item.date.toLocaleDateString()),
            datasets: [{
              label: 'Fluxo de Caixa',
              data: cumulativeValues,
              borderColor: '#36A2EB',
              fill: false
            }]
          },
          options: {
            scales: { y: { beginAtZero: true } },
            plugins: { legend: { position: 'top' } }
          }
        });
      }

      const expenseCategories = [...new Set(filteredExpenses.map(e => e.category))];
      if (expenseCategoryChartCanvas) {
        expenseCategoryChart = new Chart(expenseCategoryChartCanvas, {
          type: 'pie',
          data: {
            labels: expenseCategories,
            datasets: [{
              data: expenseCategories.map(cat => filteredExpenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.value, 0)),
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
            }]
          },
          options: { plugins: { legend: { position: 'top' } } }
        });
      }
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
            const prevValue = entry.value;
            entry.date = document.getElementById('finance-date').value;
            entry.value = parseFloat(document.getElementById('finance-value').value);
            entry.category = document.getElementById('finance-category').value;
            entry.supplierClient = document.getElementById('finance-supplier-client').value;
            entry.paymentMethod = document.getElementById('finance-payment-method').value;
            entry.orderLink = document.getElementById('finance-order-link').value || null;
            if (type === 'incomes' || type === 'expenses') {
              financeData.balance += (type === 'incomes' ? 1 : -1) * (entry.value - prevValue);
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
        e.target.value = '';
      });
    });
  }

  // Funções de apoio para Pedidos
  function updateOrderCommands() {
    const orderItemsDiv = document.getElementById('order-items');
    orderItemsDiv.innerHTML = '';
    orderItems.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'order-item';
      itemDiv.innerHTML = `${item.name} (x${item.quantity}) - R$ ${item.itemTotal.toFixed(2)}`;
      orderItemsDiv.appendChild(itemDiv);
    });
    document.querySelector('.order-commands p').textContent = `Total: R$ ${total.toFixed(2)}`;
  }

  // Funções de apoio para Tempo Real
  function createOrderCard() {
    orderIdCounter++;
    localStorage.setItem('orderIdCounter', orderIdCounter);
    const orderNumber = `#${orderIdCounter.toString().padStart(5, '0')}`;
    const card = document.createElement('div');
    card.className = 'kanban-card';
    card.innerHTML = `
      <div>Pedido: ${orderNumber}</div>
      <div>[Nome do cliente]</div>
      <div>[Endereço completo do cliente]</div>
      <div>[Observações]</div>
      <div>R$ ${total.toFixed(2)}</div>
      <div class="time">0 min</div>
      <button class="ok-btn">OK</button>
    `;
    card.dataset.startTime = new Date().getTime();
    card.dataset.column = 'awaiting';
    awaitingCards?.appendChild(card);

    const okBtn = card.querySelector('.ok-btn');
    okBtn.addEventListener('click', () => moveCard(card));

    saveKanbanCard(card);
    updateKanbanTimes();
  }

  function moveCard(card) {
    const currentColumn = card.dataset.column;
    const nextColumn = {
      'awaiting': 'preparing',
      'preparing': 'delivering',
      'delivering': 'completed'
    }[currentColumn];

    if (nextColumn) {
      card.dataset.column = nextColumn;
      document.getElementById(`${nextColumn}-cards`)?.appendChild(card);
      if (nextColumn === 'completed') {
        card.querySelector('.ok-btn').remove();
      }
      playNotificationSound();
      saveKanbanCard(card);
      updateKanbanTimes();
    }
  }

  function saveKanbanCard(card) {
    const cards = JSON.parse(localStorage.getItem('kanbanCards') || '[]');
    const existingIndex = cards.findIndex(c => c.html === card.innerHTML);
    const cardData = { html: card.innerHTML, startTime: card.dataset.startTime, column: card.dataset.column };
    if (existingIndex >= 0) cards[existingIndex] = cardData;
    else cards.push(cardData);
    localStorage.setItem('kanbanCards', JSON.stringify(cards));
  }

  function updateKanbanTimes() {
    const cards = document.querySelectorAll('.kanban-card');
    cards.forEach(card => {
      const startTime = parseInt(card.dataset.startTime);
      const now = new Date().getTime();
      const timeDiff = Math.floor((now - startTime) / 60000);
      const timeElement = card.querySelector('.time');
      let colorClass;

      if (card.dataset.column === 'delivering') {
        if (timeDiff <= 10) colorClass = 'green';
        else if (timeDiff <= 25) colorClass = 'orange';
        else colorClass = 'red';
      } else {
        if (timeDiff <= 5) colorClass = 'green';
        else if (timeDiff <= 10) colorClass = 'orange';
        else colorClass = 'red';
      }

      timeElement.textContent = `${timeDiff} min`;
      timeElement.className = `time ${colorClass}`;
    });
    setTimeout(updateKanbanTimes, 60000);
  }

  function playNotificationSound() {
    const audio = new Audio('audio/audio-finalizado.mp3');
    audio.play().catch(error => console.log('Erro ao reproduzir áudio:', error));
  }

  // Lógica para tela de Produtos
  const productTable = document.getElementById('product-table');
  let productsData = JSON.parse(localStorage.getItem('productsData') || '[]');
  let categoriesData = JSON.parse(localStorage.getItem('categoriesData') || ['Bebidas', 'Lanches', 'Sobremesas']);
  const addProductBtn = document.getElementById('add-product-btn');
  const manageCategoriesBtn = document.getElementById('manage-categories-btn');
  const importExportBtnProducts = document.getElementById('import-export-btn');
  const productForm = document.getElementById('product-form');
  const productFormData = document.getElementById('product-form-data');
  const cancelProductFormBtn = document.getElementById('cancel-product-form');
  const categoryForm = document.getElementById('category-form');
  const categoryFormData = document.getElementById('category-form-data');
  const closeCategoryFormBtn = document.getElementById('close-category-form');
  const addIngredientBtn = document.getElementById('add-ingredient-btn');
  const addOptionBtn = document.getElementById('add-option-btn');
  const productDetails = document.getElementById('product-details');
  const productCategoryFilter = document.getElementById('category-filter');
  const availabilityFilter = document.getElementById('availability-filter');
  const sortSelectProducts = document.getElementById('sort-select');

  // Função para validar produto
  function validateProduct(product, isEdit = false, currentIndex = -1) {
    const errors = [];
    if (!product.name) errors.push('Nome do produto é obrigatório.');
    if (!product.sku) errors.push('SKU é obrigatório.');
    if (!isEdit && productsData.some((existingProduct, idx) => existingProduct.sku === product.sku && idx !== currentIndex)) {
      errors.push('SKU já existe.');
    }
    if (isNaN(product.salePrice) || product.salePrice <= 0) errors.push('Preço de venda deve ser um número positivo.');
    if (isNaN(product.productionCost) || product.productionCost < 0) errors.push('Custo de produção deve ser um número não negativo.');
    if (!product.category) errors.push('Categoria é obrigatória.');
    if (product.ingredients && product.ingredients.length > 0) {
      product.ingredients.forEach((ing, i) => {
        const stockItem = stockData.find(item => item.id === ing.id);
        if (!stockItem) errors.push(`Ingrediente ${ing.name} não encontrado no estoque.`);
        else if (ing.quantity > stockItem.quantity) errors.push(`Quantidade de ${ing.name} (${ing.quantity} ${ing.unit}) excede o estoque (${stockItem.quantity} ${stockItem.unit}).`);
      });
    }
    return errors;
  }

  if (productTable) {
    // Inicializa produtos com IDs únicos
    productsData = productsData.map(product => ({
      ...product,
      id: product.id || generateUniqueId()
    }));
    localStorage.setItem('productsData', JSON.stringify(productsData));

    // Carrega categorias no filtro e formulário
    function updateCategoryOptions() {
      if (productCategoryFilter) {
        productCategoryFilter.innerHTML = '<option value="">Todas as Categorias</option>' +
          categoriesData.map(cat => `<option value="${cat}">${cat}</option>`).join('');
      }
      const productCategorySelect = document.getElementById('product-category');
      if (productCategorySelect) {
        productCategorySelect.innerHTML = '<option value="">Selecione uma categoria</option>' +
          categoriesData.map(cat => `<option value="${cat}">${cat}</option>`).join('');
      }
    }
    updateCategoryOptions();

    // Adiciona produto
    addProductBtn?.addEventListener('click', () => {
      document.getElementById('form-title').textContent = 'Adicionar Produto';
      productForm.style.display = 'block';
      productFormData.reset();
      productFormData.dataset.action = 'add';
      document.getElementById('ingredients-list').innerHTML = '';
      document.getElementById('options-list').innerHTML = '';
      addIngredientRow();
      addOptionRow();
    });

    // Gerenciar categorias
    manageCategoriesBtn?.addEventListener('click', () => {
      categoryForm.style.display = 'block';
      categoryFormData.reset();
      loadCategoryTable();
    });

    // Importar/Exportar produtos
    importExportBtnProducts?.addEventListener('click', () => {
      const dataStr = 'data:text/xlsm;charset=utf-8,' + encodeURIComponent(JSON.stringify(productsData));
      const xlsmLink = document.createElement('a');
      xlsmLink.setAttribute('href', dataStr);
      xlsmLink.setAttribute('download', 'produtos.xlsm');
      xlsmLink.click();
    });

    // Salvar produto
    productFormData?.addEventListener('submit', (e) => {
      e.preventDefault();
      const action = productFormData.dataset.action || 'add';
      const index = parseInt(productFormData.dataset.index || -1);
      const imageFile = document.getElementById('product-image').files[0];
      let imageUrl = '';

      // Processar imagem
      const reader = new FileReader();
      reader.onload = () => {
        imageUrl = reader.result;
        saveProduct(imageUrl);
      };
      if (imageFile) {
        reader.readAsDataURL(imageFile);
      } else {
        saveProduct(imageUrl);
      }

      function saveProduct(imageUrl) {
        const newProduct = {
          id: action === 'add' ? generateUniqueId() : productsData[index]?.id || generateUniqueId(),
          name: document.getElementById('product-name').value.trim(),
          description: document.getElementById('product-description').value.trim(),
          salePrice: parseFloat(document.getElementById('sale-price').value),
          productionCost: parseFloat(document.getElementById('production-cost').value),
          category: document.getElementById('product-category').value,
          sku: document.getElementById('product-sku').value.trim(),
          availability: document.querySelector('input[name="availability"]:checked').value,
          ingredients: Array.from(document.querySelectorAll('.ingredient-row')).map(row => ({
            id: row.querySelector('.ingredient-name').value,
            name: stockData.find(item => item.id === row.querySelector('.ingredient-name').value)?.name || '',
            quantity: parseFloat(row.querySelector('.ingredient-quantity').value) || 0,
            unit: row.querySelector('.ingredient-unit').value
          })).filter(ing => ing.id && ing.quantity > 0),
          options: Array.from(document.querySelectorAll('.option-row')).map(row => ({
            name: row.querySelector('.option-name').value.trim(),
            additionalPrice: parseFloat(row.querySelector('.option-price').value) || 0
          })).filter(opt => opt.name),
          image: imageUrl || (action === 'edit' && index >= 0 ? productsData[index].image : '')
        };

        const errors = validateProduct(newProduct, action !== 'add', index);
        if (errors.length > 0) {
          alert('Erro ao salvar produto:\n' + errors.join('\n'));
          return;
        }

        if (action === 'add') {
          productsData.push(newProduct);
        } else if (action === 'edit') {
          productsData[index] = newProduct;
        }

        localStorage.setItem('productsData', JSON.stringify(productsData));
        productForm.style.display = 'none';
        loadProductTable();
        productDetails.innerHTML = '<h3>Detalhes do Produto</h3><p>Selecione um produto para visualizar os detalhes.</p>';
        alert('Produto salvo com sucesso!');
        productFormData.dataset.action = '';
        productFormData.dataset.index = '';
      }
    });

    // Cancelar formulário de produto
    cancelProductFormBtn?.addEventListener('click', () => {
      productForm.style.display = 'none';
      productFormData.dataset.action = '';
      productFormData.dataset.index = '';
    });

    // Adicionar ingrediente
    addIngredientBtn?.addEventListener('click', addIngredientRow);

    function addIngredientRow(ingredient = { id: '', quantity: '', unit: 'g' }) {
      const ingredientsList = document.getElementById('ingredients-list');
      const row = document.createElement('div');
      row.className = 'ingredient-row';
      row.innerHTML = `
        <select class="ingredient-name">
          <option value="">Selecione um ingrediente</option>
          ${stockData.map(item => `<option value="${item.id}" ${item.id === ingredient.id ? 'selected' : ''}>${item.name} (${item.quantity} ${item.unit})</option>`).join('')}
        </select>
        <input type="number" class="ingredient-quantity" value="${ingredient.quantity || ''}" placeholder="Quantidade" min="0" step="0.01">
        <select class="ingredient-unit">
          <option value="g" ${ingredient.unit === 'g' ? 'selected' : ''}>Gramas (g)</option>
          <option value="ml" ${ingredient.unit === 'ml' ? 'selected' : ''}>Mililitros (ml)</option>
          <option value="un" ${ingredient.unit === 'un' ? 'selected' : ''}>Unidades (un)</option>
        </select>
        <button type="button" class="remove-ingredient-btn">x</button>
      `;
      ingredientsList.appendChild(row);
      row.querySelector('.remove-ingredient-btn').addEventListener('click', () => {
        row.remove();
      });
    }

    // Adicionar opção de personalização
    addOptionBtn?.addEventListener('click', addOptionRow);

    function addOptionRow(option = { name: '', additionalPrice: '' }) {
      const optionsList = document.getElementById('options-list');
      const row = document.createElement('div');
      row.className = 'option-row';
      row.innerHTML = `
        <input type="text" class="option-name" value="${option.name || ''}" placeholder="Nome da Opção">
        <input type="number" class="option-price" value="${option.additionalPrice || ''}" placeholder="Preço Adicional (R$)" min="0" step="0.01">
        <button type="button" class="remove-option-btn">x</button>
      `;
      optionsList.appendChild(row);
      row.querySelector('.remove-option-btn').addEventListener('click', () => {
        row.remove();
      });
    }

    // Salvar categoria
    categoryFormData?.addEventListener('submit', (e) => {
      e.preventDefault();
      const categoryName = document.getElementById('category-name').value.trim();
      if (!categoryName) {
        alert('Nome da categoria é obrigatório.');
        return;
      }
      if (categoriesData.includes(categoryName)) {
        alert('Categoria já existe.');
        return;
      }
      categoriesData.push(categoryName);
      localStorage.setItem('categoriesData', JSON.stringify(categoriesData));
      updateCategoryOptions();
      loadCategoryTable();
      categoryFormData.reset();
      alert('Categoria adicionada com sucesso!');
    });

    // Fechar formulário de categoria
    closeCategoryFormBtn?.addEventListener('click', () => {
      categoryForm.style.display = 'none';
    });

    // Carregar tabela de categorias
    function loadCategoryTable() {
      const categoryTable = document.getElementById('category-table');
      if (categoryTable) {
        categoryTable.innerHTML = `
          <table>
            <thead>
              <tr>
                <th>Categoria</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              ${categoriesData.map((cat, index) => `
                <tr>
                  <td>${cat}</td>
                  <td><button class="remove-category-btn" data-index="${index}">Excluir</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
        document.querySelectorAll('.remove-category-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            if (productsData.some(product => product.category === categoriesData[index])) {
              alert('Não é possível excluir uma categoria associada a produtos.');
              return;
            }
            if (confirm('Tem certeza que deseja excluir esta categoria?')) {
              categoriesData.splice(index, 1);
              localStorage.setItem('categoriesData', JSON.stringify(categoriesData));
              updateCategoryOptions();
              loadCategoryTable();
            }
          });
        });
      }
    }

    // Filtros e tabela de produtos
    productCategoryFilter?.addEventListener('change', loadProductTable);
    availabilityFilter?.addEventListener('change', loadProductTable);
    sortSelectProducts?.addEventListener('change', loadProductTable);

    function loadProductTable() {
      const category = productCategoryFilter?.value || '';
      const availability = availabilityFilter?.value || 'all';
      const sort = sortSelectProducts?.value || 'name-asc';

      let filteredProducts = productsData.filter(product => {
        return (
          (category === '' || product.category === category) &&
          (availability === 'all' || product.availability === (availability === 'available' ? 'Disponível' : 'Indisponível'))
        );
      });

      filteredProducts.sort((a, b) => {
        if (sort === 'name-asc') return a.name.localeCompare(b.name);
        if (sort === 'name-desc') return b.name.localeCompare(a.name);
        if (sort === 'price-asc') return a.salePrice - b.salePrice;
        if (sort === 'price-desc') return b.salePrice - a.salePrice;
        if (sort === 'category-asc') return a.category.localeCompare(b.category);
        return 0;
      });

        productTable.innerHTML = `
    <table>
        <thead>
        <tr>
            <th>Nome</th>
            <th>Categoria</th>
            <th>Preço</th>
            <th>SKU</th>
            <th>Disponibilidade</th>
            <th>Ações</th>
        </tr>
        </thead>
        <tbody>
        ${filteredProducts
            .map((product, index) => `
            <tr>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>R$ ${product.salePrice.toFixed(2)}</td>
                <td>${product.sku}</td>
                <td>${product.availability}</td>
                <td>
                <select class="btn-select">
                    <option value="">Ações</option>
                    <option value="edit" data-index="${index}">Editar</option>
                    <option value="delete" data-index="${index}">Excluir</option>
                    <option value="details" data-index="${index}">Selecionar</option>
                </select>
                </td>
            </tr>
            `)
            .join('')}
        </tbody>
    </table>
    `;

      // Ações na tabela
      document.querySelectorAll('.btn-select').forEach(select => {
        select.addEventListener('change', (e) => {
          const action = e.target.value;
          const index = parseInt(e.target.querySelector(`option[value="${action}"]`)?.dataset.index || -1);
          if (index < 0) return;
          const product = productsData[index];

          if (action === 'edit') {
            document.getElementById('form-title').textContent = 'Editar Produto';
            productForm.style.display = 'block';
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-description').value = product.description;
            document.getElementById('sale-price').value = product.salePrice;
            document.getElementById('production-cost').value = product.productionCost;
            document.getElementById('product-sku').value = product.sku;
            document.getElementById(`input[name="availability"][value="${product.availability}"]`).checked = true;
            document.getElementById('ingredients-list').innerHTML = '';
            product.ingredients.forEach(ing => addIngredientRow());
            document.getElementById('options-list').innerHTML = '';
            product.options.forEach(opt => addOptionRow(opt));
            productFormData.dataset.action = 'edit';
            productFormData.dataset.index = index;
          } else if (action === 'delete') {
            if (confirm('Tem certeza que deseja excluir este produto?')) {
              productsData.splice(index, 1);
              localStorage.setItem('productsData', JSON.stringify(productsData));
              loadProductTable();
              productDetails.innerHTML = '<h3>Detalhes do Produto</h3><p>Selecione um produto para visualizar os detalhes.</p>';
              alert('Produto excluído com sucesso!');
            }
          } else if (action === 'details') {
            productDetails.innerHTML = `
              <h3>Detalhes do Produto</h3>
              ${product.image ? `<img src="${product.image}" alt="${product.name}" style="max-width: 200px; margin-bottom: 10px;">` : ''}
              <p><strong>Nome:</strong> ${product.name}</p>
              <p><strong>Descrição:</strong> ${product.description || 'Sem descrição'}</p>
              <p><strong>Categoria:</strong> ${product.category}</p>
              <p><strong>Preço de Venda:</strong> R$ ${product.salePrice.toFixed(2)}</p>
              <p><strong>Custo de Produção:</strong> R$ ${product.productionCost.toFixed(2)}</p>
              <p><strong>SKU:</strong> ${product.sku}</p>
              <p><strong>Disponibilidade:</strong> ${product.availability}</p>
              <p><strong>Ingredientes:</strong> ${
                product.ingredients.length > 0
                  ? `<ul>${product.ingredients.map(ing => `<li>${ing.name}: ${ing.quantity} ${ing.unit}</li>`).join('')}</ul>`
                  : 'Nenhum ingrediente'
              }</p>
              <p><strong>Opções de Personalização:</strong> ${
                product.options.length > 0
                  ? `<ul>${product.options.map(opt => `<li>${opt.name}: R$ ${opt.additionalPrice.toFixed(2)}</li>`).join('')}</ul>`
                  : 'Nenhuma opção'
              }</p>
            `;
          }
          e.target.value = '';
        });
      });
    }

    // Inicializa a tabela de produtos
    loadProductTable();
  }
});