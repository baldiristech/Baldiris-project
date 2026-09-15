const state = {
  view: 'dashboard',
  authenticated: localStorage.getItem('baldiris-auth') === 'true',
  selectedBusinessId: 1,
  selectedMonth: new Date().toISOString().slice(0, 7),
  cart: [],
  orders: [],
  movements: [],
  clients: [],
  team: [],
  users: []
};
const STORAGE_KEYS = {
  clients: 'baldiris.clients',
  team: 'baldiris.team',
  movements: 'baldiris.movements',
  businesses: 'baldiris.businessData'
};
const kechicharronUrl = 'https://baldiris-project.onrender.com';
const businessData = {
  1: { name: 'K.E. Chicharrón', city: 'Bogotá', client: 'K.E. Chicharrón', project: 'Sistema POS', active: true, products: [{ name: 'Patacón relleno', category: 'Favoritos', price: 20000, description: 'Pollo, cerdo, butifarra, mozzarella, maíz y salsas.', image: 'patacon relleno .jpg', available: true }, { name: 'Chicharrón personal', category: 'Chicharrones', price: 17000, description: 'Con yuca o patacones y suero.', image: 'chicharron de 17mil.jpg', available: true }, { name: 'Chicharrón doble', category: 'Chicharrones', price: 30000, description: 'Una porción generosa para compartir.', image: 'chicharron doble.jpg', available: true }, { name: 'Chuletazo', category: 'Asados', price: 20000, description: 'Acompañado con patacones y ensalada.', image: 'chuletazo.jpg', available: true }, { name: 'Pechuga gratinada', category: 'Asados', price: 25000, description: 'Pechuga gratinada con papas o patacones y ensalada.', image: 'pechuga gratinada.jpg', available: true }, { name: 'Sopa del día', category: 'Platos fuertes', price: 12000, description: 'Producto temporal no disponible.', image: '', available: false }] }
};
const views = {
  dashboard: { title: 'Dashboard', subtitle: 'Una vista clara de la operación de BALDIRIS.', render: dashboardView },
  finanzas: { title: 'Finanzas', subtitle: 'Ingresos, gastos, reservas y utilidad de la empresa.', render: financeView },
  ingresos: { title: 'Ingresos', subtitle: 'Todo el dinero recibido por BALDIRIS.', render: incomeView },
  gastos: { title: 'Gastos', subtitle: 'Control de costos y egresos de la empresa.', render: expensesView },
  reservas: { title: 'Reservas', subtitle: 'Dinero separado para proteger el crecimiento.', render: reservesView },
  utilidades: { title: 'Utilidades', subtitle: 'Resultado financiero disponible por dimensión.', render: profitsView },
  pagos: { title: 'Pagos', subtitle: 'Pagos recibidos, realizados y pendientes.', render: paymentsView },
  clientes: { title: 'Clientes', subtitle: 'Relaciones activas y oportunidades de BALDIRIS.', render: clientsView },
  proyectos: { title: 'Proyectos', subtitle: 'Control de entregas, estados y rentabilidad.', render: projectsView },
  equipo: { title: 'Colaboradores', subtitle: 'El equipo que hace posible cada solución.', render: teamView },
  usuarios: { title: 'Usuarios y roles', subtitle: 'Control de acceso para BALDIRIS y sus negocios.', render: usersView },
  reportes: { title: 'Reportes', subtitle: 'Información lista para tomar decisiones.', render: reportsView },
  negocios: { title: 'Mis negocios', subtitle: 'Todos los negocios, aislados y administrados desde BALDIRIS.', render: businessesView },
  pos: { title: 'BALDIRIS POS', subtitle: 'Operación del primer producto de BALDIRIS.', render: posView },
  menu: { title: 'Menú POS', subtitle: 'Carta digital del negocio seleccionado.', render: menuView },
  productos: { title: 'Productos', subtitle: 'Productos y categorías aislados por negocio.', render: productsView },
  pedidos: { title: 'Pedidos', subtitle: 'Historial y seguimiento de pedidos del negocio.', render: ordersView },
  cocina: { title: 'Cocina', subtitle: 'Flujo operativo de pedidos en preparación.', render: kitchenView },
  configuracion: { title: 'Configuración', subtitle: 'Preferencias y seguridad del espacio central.', render: settingsView }
};
const root = document.getElementById('view-container');
function money(value) { return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value); }
function userInitials(user) {
  const source = String(user?.name || user?.email || 'Usuario').trim();
  const parts = source.includes('@') ? source.split('@')[0].split(/[._-]+/).filter(Boolean) : source.split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map(part => part[0].toUpperCase()).join('') || 'U';
}
function updateUserIdentity() {
  const user = JSON.parse(localStorage.getItem('baldiris-user') || '{}');
  const initials = userInitials(user);
  const name = user.name || user.email || 'Usuario';
  document.querySelectorAll('#user-avatar, #user-avatar-top').forEach(element => { element.textContent = initials; });
  const nameElement = document.getElementById('user-name');
  const roleElement = document.getElementById('user-role');
  if (nameElement) nameElement.textContent = name;
  if (roleElement) roleElement.textContent = user.role || 'Super Admin';
}
function layout(title, subtitle, body) {
  return `<div class="view-heading"><div><p class="eyebrow">BALDIRIS / ADMINISTRACIÓN</p><h1>${title}</h1><p>${subtitle}</p></div><input type="month" id="date-calendar" class="date-pill" value="${state.selectedMonth}" aria-label="Seleccionar fecha"></div>${body}`;
}
function dashboardView() { return layout('Dashboard', 'Una vista clara de la operación de BALDIRIS.', `<div class="kpi-grid"><div class="kpi"><div class="kpi-head">Ingresos del mes <span class="kpi-icon green">↗</span></div><h3>${money(0)}</h3><span class="trend">Sin registros</span></div><div class="kpi"><div class="kpi-head">Gastos del mes <span class="kpi-icon orange">↘</span></div><h3>${money(0)}</h3><span class="trend down">Sin registros</span></div><div class="kpi"><div class="kpi-head">Utilidad neta <span class="kpi-icon blue">✦</span></div><h3>${money(0)}</h3><span class="trend">Sin registros</span></div><div class="kpi"><div class="kpi-head">Dinero reservado <span class="kpi-icon pink">◇</span></div><h3>${money(0)}</h3><span class="trend">Sin configuración</span></div></div><div class="dashboard-grid"><section class="panel"><div class="panel-head"><h2>Flujo financiero</h2><button class="panel-link" data-view="reportes">Ver reporte →</button></div><div class="chart"><div class="bar" style="height:0%"><span></span></div><div class="bar" style="height:0%"><span></span></div><div class="bar" style="height:0%"><span></span></div><div class="bar" style="height:0%"><span></span></div><div class="bar" style="height:0%"><span></span></div><div class="bar active" style="height:0%"><span></span></div></div></section><section class="panel"><div class="panel-head"><h2>Actividad reciente</h2><button class="panel-link" data-view="reportes">Ver todo →</button></div><div class="activity-row"><span class="activity-icon">↗</span><div><strong>Sin movimiento</strong><small>Sin ingresos registrados</small></div><span class="amount">$0</span></div><div class="activity-row"><span class="activity-icon">▣</span><div><strong>Sin proyectos</strong><small>No hay proyectos de negocio</small></div><span class="amount">Cero</span></div><div class="activity-row"><span class="activity-icon">♙</span><div><strong>Sin colaboradores</strong><small>Sin asignación activa</small></div><span class="amount">Sin datos</span></div></section></div>`); }
function businessRow(initials, name, detail, status) { return `<div class="activity-row business-card"><span class="business-logo">${initials}</span><div><h3>${name}</h3><p>${detail}</p></div><span class="status">${status}</span></div>`; }
function getMovementType(type) {
  return {
    income: 'Ingreso',
    expense: 'Gasto',
    reserve: 'Reserva',
    utility: 'Utilidad',
    payment: 'Pago'
  }[type] || 'Movimiento';
}
function financeTotals() {
  const totals = { income: 0, expense: 0, reserve: 0, utility: 0, payment: 0, count: 0 };
  for (const item of state.movements) {
    totals[item.type] = Number(item.amount || 0) + Number(totals[item.type] || 0);
    totals.count += 1;
  }
  return totals;
}
function financeView() {
  const totals = financeTotals();
  const rows = state.movements.slice(0, 8).map(row => `<tr><td><strong>${row.concept}</strong></td><td>${getMovementType(row.type)}</td><td>${row.date || '-'} </td><td>${row.method || 'Efectivo'}</td><td class="amount-column">${money(row.amount || 0)}</td></tr>`).join('');
  const body = rows || `<tr><td colspan="5" class="muted">Sin movimientos contables registrados en BALDIRIS.</td></tr>`;
  return layout('Finanzas', 'Control financiero central de BALDIRIS.', `<div class="kpi-grid"><div class="kpi"><div class="kpi-head">Ingresos acumulados <span class="kpi-icon green">↗</span></div><h3>${money(totals.income)}</h3><span class="trend">${state.movements.filter(item => item.type === 'income').length} transacciones</span></div><div class="kpi"><div class="kpi-head">Gastos acumulados <span class="kpi-icon orange">↘</span></div><h3>${money(totals.expense)}</h3><span class="trend down">${state.movements.filter(item => item.type === 'expense').length} transacciones</span></div><div class="kpi"><div class="kpi-head">Utilidad bruta <span class="kpi-icon blue">✦</span></div><h3>${money(Math.max(totals.income - totals.expense - totals.reserve, 0))}</h3><span class="trend">${totals.count ? Math.round(((totals.income - totals.expense - totals.reserve) / Math.max(totals.income, 1)) * 100) : 0}% margen</span></div><div class="kpi"><div class="kpi-head">Pendiente de pago <span class="kpi-icon pink">◇</span></div><h3>${money(totals.payment)}</h3><span class="trend down">${state.movements.filter(item => item.type === 'payment').length} pagos</span></div></div><section class="panel" style="margin-top:14px"><div class="panel-head"><h2>Movimientos recientes</h2><button class="primary-button" data-action="open-movement-modal" data-movement-type="income">+ Registrar movimiento</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Concepto</th><th>Tipo</th><th>Fecha</th><th>Método</th><th>Valor</th></tr></thead><tbody>${body}</tbody></table></div></section>`); }
function incomeView() {
  const rows = state.movements.filter(item => item.type === 'income');
  const tbody = rows.length ? rows.map(row => `<tr><td><strong>${row.concept}</strong></td><td>${row.business || businessData[state.selectedBusinessId]?.name || 'BALDIRIS'}</td><td>${row.project || 'Sistema POS'}</td><td>${row.date || '-'}</td><td>${money(row.amount || 0)}</td><td><span class="table-status success">${row.status || 'Pagado'}</span></td></tr>`).join('') : `<tr><td colspan="6" class="muted">Sin ingresos registrados.</td></tr>`;
  return layout('Ingresos', 'Todo el dinero recibido por BALDIRIS.', `<section class="panel"><div class="panel-head"><h2>Registro de ingresos</h2><button class="primary-button" data-action="open-movement-modal" data-movement-type="income">+ Registrar ingreso</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Concepto</th><th>Cliente / negocio</th><th>Proyecto</th><th>Fecha</th><th>Valor</th><th>Estado</th></tr></thead><tbody>${tbody}</tbody></table></div></section>`); }
function expensesView() {
  const rows = state.movements.filter(item => item.type === 'expense');
  const tbody = rows.length ? rows.map(row => `<tr><td><strong>${row.concept}</strong></td><td>${row.category || 'General'}</td><td>${row.responsible || 'BALDIRIS'}</td><td>${row.date || '-'}</td><td>${money(row.amount || 0)}</td></tr>`).join('') : `<tr><td colspan="5" class="muted">Sin gastos registrados.</td></tr>`;
  return layout('Gastos', 'Control de costos y egresos de la empresa.', `<section class="panel"><div class="panel-head"><h2>Registro de gastos</h2><button class="primary-button" data-action="open-movement-modal" data-movement-type="expense">+ Registrar gasto</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Descripción</th><th>Categoría</th><th>Responsable</th><th>Fecha</th><th>Valor</th></tr></thead><tbody>${tbody}</tbody></table></div></section>`); }
function reservesView() {
  const rows = state.movements.filter(item => item.type === 'reserve');
  const total = rows.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const reserveRows = rows.length ? rows.map(row => `<div class="activity-row"><span class="activity-icon">◇</span><div><strong>${row.concept}</strong><small>${row.business || 'BALDIRIS'} · ${row.date || '-'}</small></div><span class="amount">${money(row.amount)}</span></div>`).join('') : `<p class="muted">BALDIRIS espera el primer movimiento contable del negocio para calcular la reserva.</p>`;
  return layout('Reservas', 'Dinero separado para proteger el crecimiento.', `<div class="kpi-grid"><div class="kpi"><div class="kpi-head">Utilidad del periodo <span class="kpi-icon blue">✦</span></div><h3>${money(Math.max(financeTotals().income - financeTotals().expense, 0))}</h3><span class="trend">Sin ingresos - gastos</span></div><div class="kpi"><div class="kpi-head">Porcentaje configurado <span class="kpi-icon orange">%</span></div><h3>0%</h3><span class="trend">Sin configuración</span></div><div class="kpi"><div class="kpi-head">Reserva acumulada <span class="kpi-icon green">◇</span></div><h3>${money(total)}</h3><span class="trend">${rows.length} periodo(s)</span></div><div class="kpi"><div class="kpi-head">Utilidad distribuible <span class="kpi-icon pink">$</span></div><h3>${money(Math.max(financeTotals().income - financeTotals().expense - total, 0))}</h3><span class="trend">Sin datos</span></div></div><section class="panel" style="margin-top:14px"><div class="panel-head"><h2>Configuración de reserva</h2><button class="primary-button" data-action="open-movement-modal" data-movement-type="reserve">Editar porcentaje</button></div>${reserveRows}</section>`); }
function selectedBusiness() { return businessData[state.selectedBusinessId]; }
function businessContext() { const business = selectedBusiness(); return `<div class="pos-header"><div><p class="eyebrow">NEGOCIO ACTIVO · BUSINESS_ID ${state.selectedBusinessId}</p><h2>${business.name}</h2><p>${business.city} · Datos aislados del resto de negocios.</p></div><span class="status">Tenant protegido</span></div>`; }
async function syncBusinessesFromKechicharron() {
  try {
    const response = await fetch(`${kechicharronUrl}/api/business`, { cache: 'no-store' });
    if (!response.ok) return;
    const remote = await response.json();
    if (!remote || typeof remote.active !== 'boolean') return;
    const business = businessData[1] || businessData[state.selectedBusinessId];
    if (business) business.active = remote.active;
  } catch (error) {
    console.warn('K.E. business state unavailable', error);
  }
}
async function syncUsersFromKechicharron() {
  try {
    const response = await fetch(`${kechicharronUrl}/api/users`, { cache: 'no-store' });
    if (!response.ok) return;
    const remote = await response.json();
    if (!Array.isArray(remote)) return;
    state.users = remote;
  } catch (error) {
    console.warn('K.E. users unavailable', error);
  }
}
function cartTotal() { return state.cart.reduce((total, item) => total + item.price * item.quantity, 0); }
function cartView() { return `<section class="panel cart-panel"><div class="panel-head"><h2>Pedido actual</h2><span class="status">${state.cart.reduce((total, item) => total + item.quantity, 0)} productos</span></div>${state.cart.length ? `${state.cart.map((item, index) => `<div class="cart-row"><div><strong>${item.name}</strong><small>${money(item.price)} · ${item.quantity} unidad(es)</small></div><div class="cart-controls"><button data-action="cart-decrease" data-cart-index="${index}" aria-label="Disminuir cantidad">−</button><b>${item.quantity}</b><button data-action="cart-increase" data-cart-index="${index}" aria-label="Aumentar cantidad">+</button><button data-action="cart-remove" data-cart-index="${index}" aria-label="Eliminar producto">×</button></div></div>`).join('')}<div class="cart-total"><span>Total</span><strong>${money(cartTotal())}</strong></div><button class="primary-button full" data-action="confirm-order">Confirmar pedido →</button>` : '<p class="muted empty-cart">Agrega productos desde el menú para comenzar un pedido.</p>'}</section>`; }
function menuView() { const business = selectedBusiness(); const products = business.products.filter(product => product.available); return layout('Menú POS', 'Carta disponible para el negocio seleccionado.', `${businessContext()}<div class="pos-layout"><div class="section-list">${products.map((product, index) => `<div class="module-card"><span class="kpi-icon green">✦</span><span class="eyebrow">${product.category}</span><h3>${product.name}</h3><p>${product.description}</p><strong>${money(product.price)}</strong><button class="primary-button full" data-action="add-order" data-product-index="${index}">Agregar al pedido</button></div>`).join('')}</div>${cartView()}</div>`); }
function productsView() { const business = selectedBusiness(); return layout('Productos', 'Productos y categorías aislados por negocio.', `${businessContext()}<section class="panel"><div class="panel-head"><h2>Catálogo de ${business.name}</h2><button class="primary-button" data-view="menu">Gestionar productos →</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Producto</th><th>Categoría</th><th>Precio</th><th>Disponibilidad</th><th>Business ID</th></tr></thead><tbody>${business.products.map(product => `<tr><td><strong>${product.name}</strong></td><td>${product.category}</td><td>${money(product.price)}</td><td><span class="table-status ${product.available ? 'success' : 'warn'}">${product.available ? 'Disponible' : 'Agotado'}</span></td><td>${state.selectedBusinessId}</td></tr>`).join('')}</tbody></table></div></section>`); }
const orderStatuses = ['Entrante', 'Por preparar', 'En preparación', 'Listo', 'Entregado'];
function statusClass(status) { return status === 'Entregado' ? 'success' : status === 'En preparación' || status === 'Por preparar' ? 'warn' : ''; }
function ordersView() { const orders = state.orders.filter(order => order.businessId === state.selectedBusinessId); return layout('Pedidos', 'Historial y seguimiento de pedidos del negocio.', `${businessContext()}<section class="panel"><div class="panel-head"><h2>Pedidos recientes</h2><button class="primary-button" data-view="menu">+ Nuevo pedido</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Pedido</th><th>Cliente</th><th>Proyecto / negocio</th><th>Total</th><th>Estado</th><th>Acción</th></tr></thead><tbody>${orders.map(order => `<tr><td><strong>#${order.id}</strong></td><td>${order.customer}</td><td>Sistema POS<br><small>business_id: ${order.businessId}</small></td><td>${money(order.total)}</td><td><span class="table-status ${statusClass(order.status)}">${order.status}</span></td><td><button class="secondary-button" data-action="advance-order" data-order-id="${order.id}">${order.status === 'Entregado' ? 'Completado' : 'Avanzar estado'}</button></td></tr>`).join('')}</tbody></table></div></section>`); }
function kitchenView() { const orders = state.orders.filter(order => order.businessId === state.selectedBusinessId && order.status !== 'Entregado'); return layout('Cocina', 'Flujo operativo de pedidos en preparación.', `${businessContext()}<div class="section-list"><div class="module-card"><span class="eyebrow">ENTRANTES</span><h3>${orders.filter(order => order.status === 'Entrante').length} pedidos</h3><p>Esperando confirmación de cocina.</p></div><div class="module-card"><span class="eyebrow">POR PREPARAR</span><h3>${orders.filter(order => order.status === 'Por preparar').length} pedidos</h3><p>Listos para entrar a producción.</p></div><div class="module-card"><span class="eyebrow">EN PREPARACIÓN</span><h3>${orders.filter(order => order.status === 'En preparación').length} pedidos</h3><p>Pedidos actualmente en preparación.</p></div><div class="module-card"><span class="eyebrow">LISTOS</span><h3>${orders.filter(order => order.status === 'Listo').length} pedidos</h3><p>Listos para entregar al cliente.</p></div></div><section class="panel" style="margin-top:14px"><div class="panel-head"><h2>Cola de cocina</h2><span class="status">${selectedBusiness().name}</span></div>${orders.map(order => `<div class="activity-row"><span class="activity-icon">♨</span><div><strong>#${order.id} · ${order.customer}</strong><small>business_id ${order.businessId} · ${order.status}</small></div><button class="secondary-button" data-action="advance-order" data-order-id="${order.id}">Avanzar →</button></div>`).join('')}</section>`); }
function profitsView() {
  const rows = state.movements.filter(item => item.type === 'utility');
  const utilityRows = rows.length ? rows.map(row => `<tr><td><strong>${row.project || 'Proyecto'}</strong></td><td>${money(row.income || 0)}</td><td>${money(row.expense || 0)}</td><td>${money(Number(row.amount) || 0)}</td><td>${Math.round(Number(row.margin || 0))}%</td></tr>`).join('') : `<tr><td colspan="5" class="muted">Sin proyectos registrados.</td></tr>`;
  return layout('Utilidades', 'Resultado financiero disponible por dimensión.', `<div class="kpi-grid"><div class="kpi"><div class="kpi-head">Utilidad bruta <span class="kpi-icon green">✦</span></div><h3>${money(Math.max(financeTotals().income - financeTotals().expense - financeTotals().reserve, 0))}</h3><span class="trend">${financesMargin()}% de margen</span></div><div class="kpi"><div class="kpi-head">Reserva del periodo <span class="kpi-icon orange">◇</span></div><h3>${money(financeTotals().reserve)}</h3><span class="trend">Sin reserva</span></div><div class="kpi"><div class="kpi-head">Disponible para distribuir <span class="kpi-icon blue">$</span></div><h3>${money(Math.max(financeTotals().income - financeTotals().expense - financeTotals().reserve, 0))}</h3><span class="trend">Sin datos</span></div><div class="kpi"><div class="kpi-head">Margen promedio <span class="kpi-icon pink">%</span></div><h3>${financesMargin()}%</h3><span class="trend">Sin cálculo</span></div></div><section class="panel" style="margin-top:14px"><div class="panel-head"><h2>Rentabilidad por proyecto</h2><button class="panel-link" data-action="export-finance-view">Exportar reporte →</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Proyecto</th><th>Ingresos</th><th>Gastos</th><th>Utilidad</th><th>Margen</th></tr></thead><tbody>${utilityRows}</tbody></table></div></section>`); }
function paymentsView() {
  const rows = state.movements.filter(item => item.type === 'payment');
  const tbody = rows.length ? rows.map(row => `<tr><td><strong>${row.reference || 'PAGO-' + row.id}</strong></td><td>${getMovementType(row.type)}</td><td>${row.business || 'BALDIRIS'}</td><td>${row.date || '-'}</td><td>${money(row.amount || 0)}</td><td><span class="table-status ${row.status === 'Pagado' ? 'success' : 'warn'}">${row.status || 'Pendiente'}</span></td></tr>`).join('') : `<tr><td colspan="6" class="muted">Sin pagos registrados.</td></tr>`;
  return layout('Pagos', 'Pagos recibidos, realizados y pendientes.', `<section class="panel"><div class="panel-head"><h2>Control de pagos</h2><button class="primary-button" data-action="open-movement-modal" data-movement-type="payment">+ Registrar pago</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Referencia</th><th>Tipo</th><th>Relacionado con</th><th>Fecha</th><th>Valor</th><th>Estado</th></tr></thead><tbody>${tbody}</tbody></table></div></section>`); }
function businessesView() {
  const businessCards = Object.entries(businessData).map(([id, item]) => {
    const name = item.name || 'Nuevo negocio';
    const city = item.city || 'Sin ciudad';
    const logo = String(name).slice(0, 2).toUpperCase();
    const active = Number(id) === state.selectedBusinessId;
    const isActive = item.active !== false;
    return `<div class="module-card"><div class="business-card">${businessRow(logo, name, `Restaurante · ${city}`, isActive ? 'Activo' : 'Inactivo')}</div><p>POS, menú, pedidos y reportes operativos.</p><div class="button-row"><button class="${active ? 'secondary-button' : 'primary-button'} full" data-action="select-business" data-business-id="${id}">${active ? 'Negocio activo' : 'Abrir negocio →'}</button><button class="${isActive ? 'secondary-button' : 'primary-button'} full" data-action="toggle-business" data-business-id="${id}">${isActive ? 'Desactivar negocio' : 'Activar negocio'}</button></div></div>`;
  }).join('');
  return layout('Mis negocios', 'Cada negocio vive dentro del mismo núcleo, con sus datos separados.', `<div class="section-list">${businessCards}</div>`);
}
function posView() { return layout('BALDIRIS POS', 'K.E. Chicharrón · operación del negocio seleccionado.', `<div class="pos-header"><div><p class="eyebrow">NEGOCIO ACTIVO</p><h2>K.E. Chicharrón</h2><p>Menú, pedidos, cocina, ventas y reportes.</p></div><a class="primary-button" href="${kechicharronUrl}/" target="_blank" rel="noopener">Abrir aplicativo original ↗</a></div><div class="kpi-grid"><div class="kpi"><div class="kpi-head">Ventas de hoy <span class="kpi-icon green">↗</span></div><h3>${money(0)}</h3><span class="trend">Sin pedidos</span></div><div class="kpi"><div class="kpi-head">Pedidos activos <span class="kpi-icon orange">◇</span></div><h3>0</h3><span class="trend">Sin cocina</span></div><div class="kpi"><div class="kpi-head">Ticket promedio <span class="kpi-icon blue">$</span></div><h3>${money(0)}</h3><span class="trend">Sin ventas</span></div><div class="kpi"><div class="kpi-head">Productos activos <span class="kpi-icon pink">▦</span></div><h3>0</h3><span class="trend">Sin catálogo</span></div></div><section class="panel" style="margin-top:14px"><div class="panel-head"><h2>Flujo de cocina</h2><span class="status">Sin cronograma</span></div><div class="section-list"><div class="module-card"><span class="eyebrow">ENTRANTES</span><h3>0 pedidos</h3><p>Esperando confirmación.</p></div><div class="module-card"><span class="eyebrow">EN PREPARACIÓN</span><h3>0 pedidos</h3><p>En manos de cocina.</p></div><div class="module-card"><span class="eyebrow">LISTOS</span><h3>0 pedidos</h3><p>Listos para entregar.</p></div></div></section>`); }
function simpleModule(title, subtitle, cards) { return layout(title, subtitle, `<div class="section-list">${cards.map(card => `<div class="module-card"><span class="kpi-icon ${card.color}">${card.icon}</span><h3>${card.title}</h3><p>${card.text}</p></div>`).join('')}</div>`); }
function clientsView() {
  const rows = state.clients.map(client => `<tr><td><strong>${client.name}</strong><br><small>${client.type || 'Cliente'}</small></td><td>${client.contact || 'Sin contacto'}</td><td>${client.projects || 'Sin proyectos'}</td><td>${money(Number(client.income) || 0)}</td><td><span class="table-status ${client.status === 'Activo' ? 'success' : 'warn'}">${client.status || 'Activo'}</span></td></tr>`).join('');
  const body = rows || `<tr><td colspan="5" class="muted">Sin clientes registrados.</td></tr>`;
  return layout('Clientes', 'Relaciones activas y oportunidades de BALDIRIS.', `<section class="panel"><div class="panel-head"><h2>Directorio de clientes</h2><button class="primary-button" data-action="new-client">+ Nuevo cliente</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Cliente</th><th>Contacto</th><th>Proyectos</th><th>Ingresos generados</th><th>Estado</th></tr></thead><tbody>${body}</tbody></table></div></section>`); }
function projectsView() { return layout('Proyectos', 'Control de entregas, estados y rentabilidad.', `<section class="panel"><div class="panel-head"><h2>Proyectos en seguimiento</h2><button class="primary-button" data-view="negocios">Gestionar negocios y proyectos →</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Proyecto</th><th>Cliente</th><th>Fechas</th><th>Valor</th><th>Estado</th></tr></thead><tbody><tr><td colspan="5" class="muted">Sin proyectos registrados.</td></tr></tbody></table></div></section>`); }
function teamView() {
  const rows = state.team.map(member => `<tr><td><strong>${member.name}</strong><br><small>${member.email}</small></td><td>${member.role}</td><td>${member.project}</td><td>${member.payment}</td><td><span class="table-status ${member.status === 'Activo' ? 'success' : 'warn'}">${member.status}</span></td></tr>`).join('');
  const body = rows || `<tr><td colspan="5" class="muted">Sin colaboradores registrados.</td></tr>`;
  return layout('Colaboradores', 'El equipo que hace posible cada solución.', `<section class="panel"><div class="panel-head"><h2>Equipo BALDIRIS</h2><button class="primary-button" data-action="new-collaborator">+ Invitar colaborador</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Colaborador</th><th>Rol</th><th>Proyecto</th><th>Forma de pago</th><th>Estado</th></tr></thead><tbody>${body}</tbody></table></div></section>`); }
function usersView() {
  const rows = state.users.map(user => {
    const assigned = user.businessIds.includes('*') ? 'Todos los negocios' : user.businessIds.map(id => businessData[id]?.name || '').filter(Boolean).join(', ') || 'Sin negocio';
    const roleClass = user.role === 'Super Admin' ? 'success' : user.role === 'Cocina' ? 'warn' : '';
    return `<tr><td><strong>${user.name}</strong><br><small>${user.email}</small></td><td><span class="table-status ${roleClass}">${user.role}</span></td><td>${assigned}</td><td>${user.status === 'Activo' ? 'Ahora' : 'Sin acceso'}</td><td><span class="table-status ${user.status === 'Activo' ? 'success' : 'warn'}">${user.status}</span></td></tr>`;
  }).join('');
  const body = rows || `<tr><td colspan="5" class="muted">Sin usuarios registrados.</td></tr>`;
  return layout('Usuarios y roles', 'Control de acceso para BALDIRIS y sus negocios.', `<section class="panel"><div class="panel-head"><h2>Usuarios de la plataforma</h2><button class="primary-button" data-action="new-user">+ Invitar usuario</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Usuario</th><th>Rol</th><th>Negocio asignado</th><th>Último acceso</th><th>Estado</th></tr></thead><tbody>${body}</tbody></table></div></section><section class="panel" style="margin-top:14px"><div class="panel-head"><h2>Roles definidos</h2><span class="status">Permisos por negocio</span></div><div class="section-list"><div class="module-card"><span class="kpi-icon green">★</span><h3>Super Admin</h3><p>Control total de BALDIRIS, usuarios, negocios y configuración.</p></div><div class="module-card"><span class="kpi-icon blue">⌂</span><h3>Administrador de negocio</h3><p>Administra únicamente el negocio que tiene asignado.</p></div><div class="module-card"><span class="kpi-icon orange">▦</span><h3>Cocina</h3><p>Gestiona pedidos, preparación y estados de cocina.</p></div><div class="module-card"><span class="kpi-icon pink">◆</span><h3>Empleado</h3><p>Acceso mínimo definido por el negocio y el rol.</p></div></div></section><section class="panel" id="new-user-panel" hidden><div class="panel-head"><h2>Invitar usuario</h2></div><form id="user-form"><label>Nombre<input id="user-name" required></label><label>Correo<input id="user-email" type="email" required></label><label>Rol<select id="user-role"><option>Super Admin</option><option>Administrador de negocio</option><option>Cocina</option><option>Empleado</option></select></label><label>Negocio<select id="user-business"><option value="*">Todos los negocios</option>${Object.entries(businessData).map(([id, business]) => `<option value="${id}">${business.name}</option>`).join('')}</select></label><div class="modal-actions"><button class="primary-button" type="submit">Guardar usuario</button><button class="secondary-button" type="button" id="cancel-user">Cancelar</button></div></form></section>`); }
function reportsView() { return layout('Reportes', 'Información lista para tomar decisiones.', `<div class="section-list"><div class="module-card"><span class="kpi-icon green">↗</span><h3>Reporte financiero</h3><p>Ingresos, gastos, reservas y utilidad por periodo.</p><button class="primary-button full" data-action="generate-report" data-report-type="finance">Generar reporte →</button></div><div class="module-card"><span class="kpi-icon blue">▦</span><h3>Reporte POS</h3><p>Ventas, pedidos y productos por negocio.</p><button class="primary-button full" data-action="generate-report" data-report-type="pos">Abrir reporte →</button></div><div class="module-card"><span class="kpi-icon orange">▤</span><h3>Actividad de proyectos</h3><p>Avance, tiempos y rentabilidad por cliente.</p><button class="primary-button full" data-action="generate-report" data-report-type="projects">Generar reporte →</button></div></div>`); }
function financeCsvRow(item) { return `${item.concept || 'Sin concepto'},${getMovementType(item.type || 'income')},${item.date || new Date().toISOString().slice(0,10)},${money(item.amount || 0)}`; }
function financesMargin() {
  const totals = financeTotals();
  const income = totals.income || 0;
  const expense = totals.expense || 0;
  if (!income && !expense) return 0;
  return Math.round(((income - expense) / Math.max(income, 1)) * 100);
}
function settingsView() { return layout('Configuración', 'Preferencias y seguridad del espacio central.', `<div class="section-list"><button class="module-card settings-action" data-view="clientes"><span class="kpi-icon green">⚙</span><h3>Datos de empresa</h3><p>Identidad, contacto y preferencias de BALDIRIS.</p></button><button class="module-card settings-action" data-view="usuarios"><span class="kpi-icon blue">♙</span><h3>Usuarios y roles</h3><p>Administra permisos y acceso por negocio.</p></button><button class="module-card settings-action" data-action="security-help"><span class="kpi-icon orange">◇</span><h3>Seguridad</h3><p>Sesiones, autenticación y variables de entorno.</p></button></div>`); }
function readJsonFile(filePath) {
  try {
    return JSON.parse(localStorage.getItem(filePath)) || [];
  } catch (error) {
    return [];
  }
}
function loadCentralStorage() {
  try {
    const savedClients = readJsonFile('baldiris.clients') || [];
    const savedTeam = readJsonFile('baldiris.team') || [];
    const savedMovements = readJsonFile('baldiris.movements') || [];
    const savedUsers = readJsonFile('baldiris.users') || [];
    const savedBusinesses = readJsonFile('baldiris.businessData') || {};
    if (Array.isArray(savedClients)) state.clients = savedClients;
    if (Array.isArray(savedTeam)) state.team = savedTeam;
    if (Array.isArray(savedMovements)) state.movements = savedMovements;
    if (Array.isArray(savedUsers)) state.users = savedUsers;
    if (savedBusinesses && typeof savedBusinesses === 'object') {
      Object.assign(businessData, savedBusinesses);
    }
  } catch (error) {
    console.warn('No hay datos de persistencia en localStorage.', error);
  }
}
function saveCentralStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.clients, JSON.stringify(state.clients));
    localStorage.setItem(STORAGE_KEYS.team, JSON.stringify(state.team));
    localStorage.setItem(STORAGE_KEYS.movements, JSON.stringify(state.movements));
    localStorage.setItem('baldiris.users', JSON.stringify(state.users));
  } catch (error) {
    console.warn('No se pudo guardar la persistencia local.', error);
  }
}
function saveBusinessesToStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.businesses, JSON.stringify(businessData));
  } catch (error) {
    console.warn('No se pudo guardar la persistencia de negocios.', error);
  }
}
function enhanceBusinesses() { if (state.view !== 'negocios') return; const heading = document.querySelector('.view-heading'); const createButton = document.createElement('button'); createButton.className = 'primary-button'; createButton.dataset.action = 'new-business'; createButton.textContent = '+ Nuevo negocio'; heading.appendChild(createButton); document.querySelectorAll('.module-card .primary-button').forEach(button => { if (button.textContent.includes('Configurar')) button.dataset.action = 'toggle-business'; }); }
function render() { const current = views[state.view]; root.innerHTML = current.render(); document.getElementById('breadcrumb-current').textContent = current.title; document.querySelectorAll('.nav-item[data-view]').forEach(item => item.classList.toggle('active', item.dataset.view === state.view)); enhanceBusinesses(); }
async function showApp() {
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app-shell').classList.remove('hidden');
  await syncBusinessesFromKechicharron();
  await syncUsersFromKechicharron();
  updateUserIdentity();
  render();
}
document.getElementById('login-form').addEventListener('submit', async event => { event.preventDefault(); const email = document.getElementById('email').value.trim(); const password = document.getElementById('password').value; const errorNode = document.getElementById('login-error'); try { const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) }); const payload = await response.json().catch(() => ({})); if (!response.ok) throw new Error(payload.error || 'Credenciales no válidas.'); localStorage.setItem('baldiris-auth', 'true'); localStorage.setItem('baldiris-user', JSON.stringify(payload.user || { email, role: 'Super Admin' })); state.authenticated = true; showApp(); } catch (error) { errorNode.textContent = error.message || 'No se pudo validar el acceso.'; } });
function openBusinessModal() { document.getElementById('business-modal').classList.remove('hidden'); document.getElementById('business-name').focus(); }
function closeBusinessModal() { document.getElementById('business-modal').classList.add('hidden'); document.getElementById('business-form').reset(); }
function openClientModal() { const modal = document.getElementById('client-modal'); if (modal) { modal.classList.remove('hidden'); document.getElementById('client-name').focus(); } }
function closeClientModal() { const modal = document.getElementById('client-modal'); if (modal) modal.classList.add('hidden'); const form = document.getElementById('client-form'); if (form) form.reset(); }
function openCollaboratorModal() { const modal = document.getElementById('collaborator-modal'); if (modal) { modal.classList.remove('hidden'); document.getElementById('collaborator-name').focus(); } }
function closeCollaboratorModal() { const modal = document.getElementById('collaborator-modal'); if (modal) modal.classList.add('hidden'); const form = document.getElementById('collaborator-form'); if (form) form.reset(); }
document.addEventListener('change', event => {
  if (event.target && event.target.id === 'date-calendar') {
    state.selectedMonth = event.target.value || new Date().toISOString().slice(0, 7);
    render();
  }
});
document.addEventListener('click', event => { const navigation = event.target.closest('[data-view]'); if (navigation) { state.view = navigation.dataset.view; render(); document.querySelector('.sidebar').classList.remove('open'); return; } const target = event.target.closest('[data-action]'); const action = target?.dataset.action; if (action === 'generate-report') { const type = target.dataset.reportType || 'finance'; fetch(`http://localhost:8080/api/reports/${type}`).then(response => response.json()).then(data => { const rows = data.rows || []; const csv = buildReportCsv(type, rows); downloadCsv(csv, `baldiris-${type}-report.csv`); window.alert(`Reporte ${type} generado correctamente.`); }).catch(() => { const rows = buildReportRows(type); const csv = buildReportCsv(type, rows); downloadCsv(csv, `baldiris-${type}-report.csv`); window.alert(`Reporte ${type} generado correctamente.`); }); return; } if (action === 'open-movement-modal') { openMovementModal(target.dataset.movementType || 'income'); return; } if (action === 'export-finance-view') { const rows = state.movements; const csv = ['Concepto,Tipo,Fecha,Método,Valor']; rows.forEach(item => csv.push(`${item.concept},${getMovementType(item.type)},${item.date},${item.method},${item.amount}`)); const blob = new Blob([csv.join('\n')], { type: 'text/csv;charset=utf-8;' }); const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'baldiris-finanzas.csv'; document.body.appendChild(anchor); anchor.click(); anchor.remove(); URL.revokeObjectURL(url); return; } if (action === 'new-business') openBusinessModal(); if (action === 'new-user') { const panel = document.getElementById('new-user-panel'); if (panel) panel.hidden = false; return; } if (action === 'new-client') { openClientModal(); return; } if (action === 'new-collaborator') { openCollaboratorModal(); return; } if (action === 'select-business') { state.selectedBusinessId = Number(target.dataset.businessId); state.view = 'pos'; render(); return; } if (action === 'toggle-business') {
  const id = Number(target.dataset.businessId);
  if (!businessData[id]) return;
  const nextActive = businessData[id].active === false ? true : false;
  businessData[id].active = nextActive;
  try {
    fetch(`${kechicharronUrl}/api/business`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: nextActive })
    }).catch(() => {});
  } catch {}
  render();
  return;
} if (action === 'add-order') { const product = selectedBusiness().products.filter(item => item.available)[Number(target.dataset.productIndex)]; const existing = state.cart.find(item => item.name === product.name); if (existing) existing.quantity += 1; else state.cart.push({ ...product, quantity: 1 }); render(); } if (action === 'cart-increase' || action === 'cart-decrease' || action === 'cart-remove') { const index = Number(target.dataset.cartIndex); if (action === 'cart-increase') state.cart[index].quantity += 1; if (action === 'cart-decrease') state.cart[index].quantity -= 1; if (action === 'cart-remove' || state.cart[index].quantity <= 0) state.cart.splice(index, 1); render(); } if (action === 'advance-order') { const order = state.orders.find(item => item.id === target.dataset.orderId); const next = orderStatuses.indexOf(order.status) + 1; if (next < orderStatuses.length) order.status = orderStatuses[next]; render(); } if (action === 'confirm-order' && state.cart.length) { const orderId = `POS-${Math.floor(1000 + Math.random() * 9000)}`; state.orders.unshift({ id: orderId, businessId: state.selectedBusinessId, customer: 'Pedido de mostrador', total: cartTotal(), status: 'Entrante' }); state.cart = []; render(); window.alert(`Pedido #${orderId} confirmado para ${selectedBusiness().name}.`); } });
function openMovementModal(type = 'income') {
  const modal = document.getElementById('movement-modal');
  if (!modal) return;
  const typeSelect = document.getElementById('movement-type');
  const typeTitle = document.getElementById('movement-modal-title');
  if (typeSelect) typeSelect.value = type;
  if (typeTitle) typeTitle.textContent = getMovementType(type) === 'Movimiento' ? 'Registrar movimiento' : `Registrar ${getMovementType(type).toLowerCase()}`;
  modal.classList.remove('hidden');
}
function closeMovementModal() {
  const modal = document.getElementById('movement-modal');
  if (modal) modal.classList.add('hidden');
}
function buildReportRows(type = 'finance') {
  if (type === 'pos') {
    const business = selectedBusiness();
    return [
      { title: 'Pedidos', value: String(state.orders.length || 0) },
      { title: 'Productos', value: String(business.products?.length || 0) },
      { title: 'Negocio', value: business.name || 'BALDIRIS' }
    ];
  }
  if (type === 'projects') {
    return [
      { title: 'Proyecto', value: 'K.E. Chicharrón' },
      { title: 'Cliente', value: 'K.E. Chicharrón' },
      { title: 'Estado', value: 'Activo' }
    ];
  }
  return state.movements.length ? state.movements.map(item => ({ title: item.concept, value: `${getMovementType(item.type)} ${money(item.amount || 0)}`, date: item.date, type: item.type })) : [{ title: 'Sin movimientos', value: '0', date: new Date().toISOString().slice(0,10), type: 'empty' }];
}
function buildReportCsv(type, rows) {
  if (type === 'pos') {
    const header = 'Sección,Valor';
    return [header, ...rows.map(row => `${row.title},${row.value}`)].join('\n');
  }
  if (type === 'projects') {
    const header = 'Proyecto,Cliente,Estado';
    return [header, `${rows[0].value},${rows[1].value},${rows[2].value}`].join('\n');
  }
  const header = 'Concepto,Tipo,Fecha,Valor';
  return [header, ...rows.map(row => `${row.title},${row.type || 'Sin tipo'},${row.date || '-'},${row.value || '0'}`)].join('\n');
}
function downloadCsv(csv, filename) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
function createMovementFromForm(type = 'income') {
  const concept = document.getElementById('movement-concept').value.trim();
  const category = document.getElementById('movement-category').value.trim();
  const method = document.getElementById('movement-method').value;
  const amount = Number(document.getElementById('movement-amount').value || 0);
  const date = document.getElementById('movement-date').value;
  const status = document.getElementById('movement-status').value;
  const project = document.getElementById('movement-project').value.trim();
  const business = document.getElementById('movement-business').value;
  const responsible = document.getElementById('movement-responsible').value.trim();
  if (!concept || !method || amount <= 0 || !date) {
    const error = document.getElementById('movement-error');
    if (error) error.textContent = 'Concepto, método, fecha y valor son obligatorios.';
    return null;
  }
  return {
    id: `MOV-${Date.now()}`,
    concept,
    type,
    category,
    method,
    amount,
    date,
    status,
    project,
    business,
    responsible
  };
}

document.getElementById('business-form').addEventListener('submit', event => { event.preventDefault(); const name = document.getElementById('business-name').value.trim(); const city = document.getElementById('business-city').value.trim(); const admin = document.getElementById('business-admin').value; if (!name || !city) return; const nextId = Math.max(...Object.keys(businessData).map(Number)) + 1; businessData[nextId] = { name, city, client: name, project: 'Sistema POS', active: true, products: [] }; saveBusinessesToStorage(); state.selectedBusinessId = nextId; state.view = 'negocios'; closeBusinessModal(); render(); });

document.getElementById('client-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const clientName = document.getElementById('client-name').value.trim();
  const contact = document.getElementById('client-contact').value.trim();
  const project = document.getElementById('client-project').value.trim();
  const income = Number(document.getElementById('client-income').value || 0);
  const status = document.getElementById('client-status').value;
  if (!clientName || !contact) return;
  state.clients.push({ id: `c-${Date.now()}`, name: clientName, contact, type: 'Cliente', projects: project || 'Sin proyectos', income, status: status || 'Activo' });
  saveCentralStorage();
  closeClientModal();
  render();
});

document.getElementById('collaborator-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('collaborator-name').value.trim();
  const email = document.getElementById('collaborator-email').value.trim();
  const role = document.getElementById('collaborator-role').value.trim();
  const project = document.getElementById('collaborator-project').value.trim();
  const payment = document.getElementById('collaborator-payment').value.trim();
  const status = document.getElementById('collaborator-status').value;
  if (!name || !email) return;
  state.team.push({ id: `t-${Date.now()}`, name, email, role, project, payment, status: status || 'Activo' });
  saveCentralStorage();
  closeCollaboratorModal();
  render();
});

document.getElementById('movement-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const type = document.getElementById('movement-type').value || 'income';
  const movement = createMovementFromForm(type);
  if (!movement) return;
  state.movements.unshift(movement);
  saveCentralStorage();
  closeMovementModal();
  event.target.reset();
  render();
});

document.getElementById('close-movement-modal')?.addEventListener('click', closeMovementModal);
document.getElementById('cancel-movement')?.addEventListener('click', closeMovementModal);

document.getElementById('movement-form')?.addEventListener('reset', () => {
  const error = document.getElementById('movement-error');
  if (error) error.textContent = '';
});

document.getElementById('user-form')?.addEventListener('submit', async event => {
  event.preventDefault();
  const name = document.getElementById('user-name').value.trim();
  const email = document.getElementById('user-email').value.trim();
  const role = document.getElementById('user-role').value;
  const business = document.getElementById('user-business').value;
  if (!name || !email) return;
  const newUser = { id: `u-${Date.now()}`, name, email, role, businessIds: business === '*' ? ['*'] : [Number(business)], status: 'Activo' };
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, role, businessIds: newUser.businessIds })
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({ error: 'No se pudo crear el usuario' }));
      window.alert(payload.error || 'No se pudo crear el usuario');
      return;
    }
    const saved = await response.json();
    state.users.push(saved);
    saveCentralStorage();
  } catch (error) {
    state.users.push(newUser);
    saveCentralStorage();
  }
  const panel = document.getElementById('new-user-panel');
  if (panel) panel.hidden = true;
  render();
});

document.getElementById('close-business-modal').addEventListener('click', closeBusinessModal); document.getElementById('cancel-business').addEventListener('click', closeBusinessModal); document.getElementById('business-modal').addEventListener('click', event => { if (event.target.id === 'business-modal') closeBusinessModal(); });

document.getElementById('close-client-modal')?.addEventListener('click', closeClientModal);
document.getElementById('cancel-client')?.addEventListener('click', closeClientModal);
document.getElementById('client-modal')?.addEventListener('click', event => { if (event.target.id === 'client-modal') closeClientModal(); });

document.getElementById('close-collaborator-modal')?.addEventListener('click', closeCollaboratorModal);
document.getElementById('cancel-collaborator')?.addEventListener('click', closeCollaboratorModal);
document.getElementById('collaborator-modal')?.addEventListener('click', event => { if (event.target.id === 'collaborator-modal') closeCollaboratorModal(); });
document.getElementById('notifications-button')?.addEventListener('click', () => { state.view = 'reportes'; render(); });
document.getElementById('help-button')?.addEventListener('click', () => window.alert('Usa el menú lateral para abrir módulos. Desde Mis negocios puedes seleccionar K.E. Chicharrón y desde Usuarios y roles gestionar accesos.'));
document.addEventListener('click', event => { if (event.target.closest('[data-action="security-help"]')) window.alert('La seguridad del panel se configura con las variables de entorno de Render y las credenciales del servicio.'); });
document.getElementById('logout').addEventListener('click', () => { localStorage.removeItem('baldiris-auth'); localStorage.removeItem('baldiris-user'); state.authenticated = false; document.getElementById('app-shell').classList.add('hidden'); document.getElementById('login-screen').classList.remove('hidden'); });
document.getElementById('open-sidebar').addEventListener('click', () => document.querySelector('.sidebar').classList.add('open')); document.getElementById('close-sidebar').addEventListener('click', () => document.querySelector('.sidebar').classList.remove('open'));
if (state.authenticated) showApp();