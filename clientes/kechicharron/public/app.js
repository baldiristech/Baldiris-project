const paymentConfig = {
  nequi: { label: 'Nequi', help: 'Paga con Nequi y confirma el pago en WhatsApp.', appLink: 'nequi://', fallback: 'https://www.nequi.com.co/' },
  daviplata: { label: 'Daviplata', help: 'Paga con Daviplata y confirma el pago en WhatsApp.' },
  breb: { label: 'BRE-B / transferencia', help: 'Haz la transferencia y confirma el comprobante en WhatsApp.' },
  efectivo: { label: 'Efectivo', help: 'Paga en efectivo al recibir el pedido.' }
};
const brebNumber = '0087273238';

let menu = [
  { category: 'Favoritos', name: 'Patacón relleno', description: 'Pollo, cerdo, butifarra, mozzarella, maíz y salsas.', price: 20000, image: 'patacon relleno .jpg' },
  { category: 'Chicharrones', name: 'Chicharrón personal', description: 'Con yuca o patacones y suero.', price: 17000, image: 'chicharron de 17mil.jpg' },
  { category: 'Chicharrones', name: 'Chicharrón doble', description: 'Una porción generosa para compartir.', price: 30000, image: 'chicharron doble.jpg' },
  { category: 'Asados', name: 'Chuletazo', description: 'Acompañado con patacones y ensalada.', price: 20000, image: 'chuletazo.jpg' },
  { category: 'Asados', name: 'Carne asada', description: 'Carne a la parrilla con el sabor de la casa.', price: 22000, image: 'carne asada.jpg' },
  { category: 'Asados', name: 'Pechuga asada', description: 'Acompañada con patacones, yuca o papitas y ensalada.', price: 20000, image: 'pechuga gratinada.jpg' },
  { category: 'Asados', name: 'Pechuga gratinada', description: 'Pechuga gratinada con papas o patacones y ensalada.', price: 25000, image: 'pechuga gratinada.jpg' },
  { category: 'Asados', name: 'Asado mixto', description: 'Pechuga, chuleta y carne, acompañado con patacones o papas a la francesa.', price: 30000, image: 'asado mixto.jpg' },
  { category: 'BBQ', name: 'Alitas BBQ (6 unidades)', description: 'Alitas bañadas en salsa BBQ.', price: 15000, image: 'picada alitas 50.000.jpg' },
  { category: 'BBQ', name: 'Alitas BBQ (9 unidades)', description: 'Alitas bañadas en salsa BBQ.', price: 25000, image: 'picada alitas 50.000.jpg' },
  { category: 'BBQ', name: 'Picada de alitas BBQ', description: '18 alitas BBQ para compartir.', price: 50000, image: 'picada alitas 50.000.jpg' },
  { category: 'BBQ', name: 'Chicharrón BBQ', description: 'Chicharrón bañado en salsa BBQ.', price: 20000, image: 'chicharron doble.jpg' },
  { category: 'BBQ', name: 'Costillas BBQ personal', description: 'Porción individual acompañada con papitas o patacones.', price: 20000, image: 'costillas bbq normal y doble.jpg' },
  { category: 'BBQ', name: 'Costillas BBQ doble', description: 'Porción doble acompañada con papitas o patacones.', price: 30000, image: 'costillas bbq normal y doble.jpg' },
  { category: 'Arroces', name: 'Arroz paisa personal', description: 'Con cerdo, pollo, chorizo, jamón, chicharrón, plátano y maíz.', price: 15000, image: 'arroz paisa normal .jpg' },
  { category: 'Arroces', name: 'Arroz paisa dúo', description: 'Con cerdo, pollo, chorizo, jamón, chicharrón, plátano y maíz.', price: 30000, image: 'arroz paisa normal .jpg' },
  { category: 'Arroces', name: 'Arroz paisa trío', description: 'Con cerdo, pollo, chorizo, jamón, chicharrón, plátano y maíz.', price: 40000, image: 'arroz paisa normal .jpg' },
  { category: 'Arroces', name: 'Arroz paisa familiar', description: 'Con cerdo, pollo, chorizo, jamón, chicharrón, plátano y maíz.', price: 50000, image: 'arroz paisa normal .jpg' },
  { category: 'Especiales', name: 'Plato especial para picar', description: 'Chicharrón, arroz paisa, patacones, ensalada y suero.', price: 30000, image: 'especial para picar.jpg' },
  { category: 'Picadas', name: 'Picada de chicharrón', description: 'Chicharrón, alitas BBQ o fritas, yuca, patacones y ensalada.', price: 50000, image: 'picada de chicharron.jpg' },
  { category: 'Picadas', name: 'Picada de salchipapa mediana', description: 'Pollo, cerdo, queso, mozzarella, papa, salchicha, ripio, salsas y butifarra.', price: 40000, image: 'picada de salchipapa mediana y grande.jpg' },
  { category: 'Picadas', name: 'Picada de salchipapa grande', description: 'Pollo, cerdo, queso, mozzarella, papa, salchicha, ripio, salsas y butifarra.', price: 55000, image: 'picada de salchipapa mediana y grande.jpg' },
  { category: 'Picadas', name: 'Picada mixta para 2', description: 'Chicharrón, alitas BBQ o fritas, yuca y patacones.', price: 35000, image: 'picada mixta.jpg' },
  { category: 'Picadas', name: 'Picada mixta para 2 BBQ', description: 'Costillas BBQ, alitas BBQ, patacón, papitas, ensalada y suero.', price: 40000, image: 'picada mixta.jpg' },
  { category: 'Picadas', name: 'Picada familiar', description: 'Chicharrón, alitas BBQ o fritas, yuca, patacones, suero y arroz paisa.', price: 70000, image: 'picada familiar de chicharron.jpg' },
  { category: 'Picadas', name: 'Picada mega familiar', description: 'Chicharrón, alitas BBQ, salchipapas, costilla BBQ, yuca, patacones, suero y arroz paisa.', price: 100000, image: 'picada familiar de chicharron.jpg' },
  { category: 'Perros calientes', name: 'Perro súper', description: 'Perro caliente de la casa.', price: 12000, image: 'incono.jpg' },
  { category: 'Perros calientes', name: 'Choriperro', description: 'Perro caliente con chorizo.', price: 15000, image: 'incono.jpg' },
  { category: 'Hamburguesas', name: 'Hamburguesa de carne', description: 'Acompañada con papas a la francesa.', price: 17000, image: 'hambuerguesa.jpg' },
  { category: 'Hamburguesas', name: 'Hamburguesa de pollo', description: 'Acompañada con papas a la francesa.', price: 20000, image: 'hambuerguesa.jpg' },
  { category: 'Hamburguesas', name: 'Hamburguesa mixta', description: 'Acompañada con papas a la francesa.', price: 25000, image: 'hambuerguesa.jpg' },
  { category: 'Hamburguesas', name: 'Hamburguesa la quesuda', description: 'Bañada en queso mozzarella y acompañada con papas a la francesa.', price: 23000, image: 'hambuerguesa.jpg' },
  { category: 'Salchipapas', name: 'Salchichorizo', description: 'Papas, chorizo y salsas de la casa.', price: 15000, image: 'salchichuleta.jpg' },
  { category: 'Salchipapas', name: 'Salchichuleta', description: 'Papas, chorizo, chuleta y salsas de la casa.', price: 20000, image: 'salchichuleta.jpg' },
  { category: 'Salchipapas', name: 'Salchipollo', description: 'Papas, pollo y salsas de la casa.', price: 20000, image: 'salchipollo.jpg' },
  { category: 'Salchipapas', name: 'Picada de salchipapas para dos', description: 'Pollo, cerdo, queso, mozzarella, papa, salchicha, ripio, salsas y butifarra.', price: 40000, image: 'picada de salchipapa mediana y grande.jpg' },
  { category: 'Adicionales', name: 'Papas fritas', description: 'Porción adicional.', price: 6000, image: 'incono.jpg' },
  { category: 'Adicionales', name: 'Patacones', description: 'Porción adicional.', price: 5000, image: 'incono.jpg' },
  { category: 'Adicionales', name: 'Porción de yuca', description: 'Porción adicional.', price: 4000, image: 'incono.jpg' },
  { category: 'Adicionales', name: 'Chicharrón', description: 'Porción adicional.', price: 12000, image: 'chicharron de 17mil.jpg' },
  { category: 'Bebidas', name: 'Gaseosa 400 ml', description: 'Colombiana, Coca-Cola o Sprite.', price: 4000, visual: 'drink' },
  { category: 'Bebidas', name: 'Gaseosa litro', description: 'Colombiana, Coca-Cola o Sprite.', price: 6000, visual: 'drink' },
  { category: 'Bebidas', name: 'Gaseosa 1.5 L', description: 'Colombiana, Coca-Cola o Sprite.', price: 8000, visual: 'drink' },
  { category: 'Bebidas', name: 'Agua 600 ml', description: 'Agua fría.', price: 3000, visual: 'water' },
  { category: 'Bebidas', name: 'Jugo natural', description: 'Frío y preparado al momento.', price: 4000, visual: 'juice' },
  { category: 'Granizados', name: 'Granizado pequeño', description: 'Frío, delicioso y con toppings.', price: 10000, image: 'WhatsApp Image 2026-09-11 at 23.58.44.jpeg' },
  { category: 'Granizados', name: 'Granizado mediano', description: 'El tamaño perfecto para refrescarte.', price: 15000, image: 'WhatsApp Image 2026-09-11 at 23.58.44.jpeg' },
  { category: 'Granizados', name: 'Granizado grande', description: 'Más sabor, más toppings, más disfrute.', price: 20000, image: 'WhatsApp Image 2026-09-11 at 23.58.44.jpeg' }
];
const money = value => '$' + Number(value).toLocaleString('es-CO');
const getCart = () => JSON.parse(localStorage.getItem('ke-cart') || '[]');
const saveCart = cart => localStorage.setItem('ke-cart', JSON.stringify(cart));
const toast = message => { const el = document.getElementById('toast'); if (!el) return; el.textContent = message; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 2800); };

async function initMenu() {
  try {
    const response = await fetch('/api/menu', { cache: 'no-store' });
    if (response.ok) {
      const serverMenu = await response.json();
      if (serverMenu.length) menu = serverMenu;
    }
  } catch {}
  const grid = document.getElementById('menu-grid');
  const tabs = document.getElementById('category-tabs');
  const categories = ['Todos', ...new Set(menu.map(item => item.category))];
  let active = 'Todos';
  function draw() {
    grid.innerHTML = menu.filter(item => active === 'Todos' || item.category === active).map(item => `<article class="menu-card"><div class="product-visual ${item.visual || ''}">${item.image ? `<img src="/${encodeURI(item.image)}" alt="${item.name}">` : `<span>${item.visual === 'juice' ? '🍹' : '🥤'}</span>`}</div><div class="product-info"><p class="eyebrow">${item.category}</p><h3>${item.name}</h3><p>${item.description}</p><div><span class="price">${money(item.price)}</span><button class="add-button" data-index="${menu.indexOf(item)}" aria-label="Agregar ${item.name}">+</button></div></div></article>`).join('');
  }
  tabs.innerHTML = categories.map(category => `<button class="${category === active ? 'active' : ''}" data-category="${category}">${category}</button>`).join('');
  tabs.addEventListener('click', event => { const button = event.target.closest('button'); if (!button) return; active = button.dataset.category; tabs.querySelectorAll('button').forEach(item => item.classList.toggle('active', item === button)); draw(); });
  grid.addEventListener('click', event => { const button = event.target.closest('.add-button'); if (!button) return; const item = menu[button.dataset.index]; const cart = getCart(); const found = cart.find(row => row.name === item.name); found ? found.quantity++ : cart.push({ ...item, quantity: 1 }); saveCart(cart); updateCart(); toast(`${item.name} agregado al pedido`); });
  draw(); updateCart();
  document.getElementById('open-cart').addEventListener('click', () => document.getElementById('cart-drawer').classList.add('open'));
  document.getElementById('close-cart').addEventListener('click', () => document.getElementById('cart-drawer').classList.remove('open'));
  document.getElementById('checkout-button').addEventListener('click', () => { if (!getCart().length) return toast('Agrega al menos un producto'); document.getElementById('checkout-modal').hidden = false; });
  document.getElementById('close-checkout').addEventListener('click', () => document.getElementById('checkout-modal').hidden = true);
  document.querySelectorAll('input[name="delivery-type"]').forEach(radio => radio.addEventListener('change', toggleDeliveryFields));
  document.getElementById('payment-method').addEventListener('change', updatePaymentInfo);
  document.getElementById('copy-breb').addEventListener('click', copyBrebNumber);
  const nequiLink = document.querySelector('[data-payment="nequi"]');
  if (nequiLink) {
    nequiLink.addEventListener('click', event => {
      event.preventDefault();
      const nequiApp = 'nequi://';
      window.location.href = nequiApp;
      window.setTimeout(() => { window.location.href = 'https://www.nequi.com.co/'; }, 1200);
    });
  }
  document.getElementById('order-form').addEventListener('submit', submitOrder);
  loadMenuKitchenState();
  setInterval(loadMenuKitchenState, 10000);
  document.getElementById('open-pqr').addEventListener('click', () => document.getElementById('pqr-modal').hidden = false);
  document.getElementById('close-pqr').addEventListener('click', () => document.getElementById('pqr-modal').hidden = true);
  document.getElementById('pqr-form').addEventListener('submit', submitPqr);
  updatePaymentInfo();
  toggleDeliveryFields();
}
async function loadMenuKitchenState() {
  const response = await fetch('/api/kitchen', { cache: 'no-store' });
  if (!response.ok) return;
  const open = (await response.json()).open !== false;
  const notice = document.getElementById('menu-kitchen-notice');
  const submit = document.getElementById('submit-order');
  notice.className = `kitchen-notice ${open ? 'is-open' : 'is-closed'}`;
  notice.querySelector('strong').textContent = open ? 'Cocina abierta' : 'Cocina cerrada';
  notice.querySelector('span:last-child').textContent = open ? 'Puedes hacer tu pedido.' : 'No estamos recibiendo pedidos en este momento.';
  submit.disabled = !open;
  submit.textContent = open ? 'Enviar pedido a cocina' : 'Cocina cerrada';
}
async function submitPqr(event) {
  event.preventDefault();
  const response = await fetch('/api/pqrs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: document.getElementById('pqr-name').value, phone: document.getElementById('pqr-phone').value, type: document.getElementById('pqr-type').value, message: document.getElementById('pqr-message').value }) });
  if (!response.ok) return toast('No se pudo enviar el mensaje');
  event.target.reset(); document.getElementById('pqr-modal').hidden = true; toast('Mensaje enviado. Gracias por escribirnos');
}
function updatePaymentInfo() {
  const method = document.getElementById('payment-method').value;
  const info = document.getElementById('payment-info');
  const number = document.getElementById('breb-number');
  if (method === 'breb') {
    info.hidden = false;
    number.textContent = brebNumber;
    info.querySelector('p').textContent = 'Transfiere a la llave BRE-B de la empresa:';
  } else if (method === 'nequi') {
    info.hidden = false;
    number.textContent = brebNumber;
    info.querySelector('p').textContent = 'Paga por Nequi a la llave BRE-B de la empresa:';
  } else if (method === 'daviplata') {
    info.hidden = false;
    number.textContent = brebNumber;
    info.querySelector('p').textContent = 'Paga por Daviplata a la llave BRE-B de la empresa:';
  } else {
    info.hidden = true;
  }
}
function copyBrebNumber() {
  navigator.clipboard?.writeText(brebNumber.replace(/\s+/g, '')).then(() => toast('Número BRE-B copiado')).catch(() => toast('No se pudo copiar el número'));
}
function toggleDeliveryFields() {
  const deliveryType = document.querySelector('input[name="delivery-type"]:checked')?.value || 'mesa';
  document.getElementById('table-container').hidden = deliveryType === 'domicilio';
  document.getElementById('delivery-container').hidden = deliveryType !== 'domicilio';
  if (deliveryType === 'domicilio') {
    document.getElementById('table-number').removeAttribute('required');
    document.getElementById('delivery-address').setAttribute('required', 'required');
    document.getElementById('customer-phone').setAttribute('required', 'required');
  } else {
    document.getElementById('table-number').setAttribute('required', 'required');
    document.getElementById('delivery-address').removeAttribute('required');
    document.getElementById('customer-phone').removeAttribute('required');
  }
}
function updateCart() {
  const cart = getCart(); const list = document.getElementById('cart-items'); if (!list) return;
  document.getElementById('cart-count').textContent = cart.reduce((sum, row) => sum + row.quantity, 0);
  document.getElementById('cart-total').textContent = money(cart.reduce((sum, row) => sum + row.price * row.quantity, 0));
  list.innerHTML = cart.length ? cart.map((item, index) => `<div class="cart-row"><div><h3>${item.name}</h3><small>${money(item.price)} c/u</small><div class="qty-controls"><button data-action="minus" data-index="${index}">-</button><strong>${item.quantity}</strong><button data-action="plus" data-index="${index}">+</button></div></div><strong>${money(item.price * item.quantity)}</strong></div>`).join('') : '<div class="empty-state">Tu pedido está vacío.<br>Elige algo delicioso para comenzar.</div>';
  list.onclick = event => { const button = event.target.closest('button'); if (!button) return; const current = getCart(); const row = current[button.dataset.index]; button.dataset.action === 'plus' ? row.quantity++ : row.quantity--; saveCart(current.filter(item => item.quantity > 0)); updateCart(); };
}
async function submitOrder(event) {
  event.preventDefault();
  const cart = getCart();
  const total = cart.reduce((sum, row) => sum + row.price * row.quantity, 0);
  const deliveryType = document.querySelector('input[name="delivery-type"]:checked')?.value || 'mesa';
  const table = document.getElementById('table-number').value.trim();
  const address = document.getElementById('delivery-address').value.trim();
  const phone = document.getElementById('customer-phone').value.trim();
  const paymentMethod = document.getElementById('payment-method').value;
  const payload = {
    table: deliveryType === 'domicilio' ? 'Domicilio' : table,
    note: document.getElementById('order-note').value,
    items: cart,
    total,
    deliveryType,
    paymentMethod,
    address,
    phone
  };
  if (deliveryType === 'domicilio') {
    if (!address || !phone) return toast('Completa dirección y celular para el domicilio');
  } else if (!table) {
    return toast('Escribe el número de la mesa');
  }
  try {
    const response = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return toast(error.error || 'No se pudo enviar el pedido');
    }
  } catch {
    return toast('No hay conexión con el servidor. Intenta de nuevo.');
  }
  saveCart([]); updateCart(); document.getElementById('checkout-modal').hidden = true; document.getElementById('cart-drawer').classList.remove('open'); event.target.reset(); updatePaymentInfo(); toggleDeliveryFields(); toast(`Pedido enviado a cocina · ${paymentConfig[paymentMethod].label}`);
}

let kitchenKnownNewIds = null;
let kitchenAudioContext = null;

function initKitchen() {
  const clock = document.getElementById('kitchen-clock');
  const tick = () => clock.textContent = new Date().toLocaleString('es-CO', { weekday: 'long', hour: '2-digit', minute: '2-digit' });
  tick(); setInterval(tick, 30000); document.getElementById('toggle-kitchen').addEventListener('click', toggleKitchen); document.getElementById('activate-alarm').addEventListener('click', activateKitchenAlarm); loadKitchenState(); loadOrders(); setInterval(loadOrders, 3000);
}
async function loadOrders() { const response = await fetch('/api/orders', { cache: 'no-store' }); if (!response.ok) return; const orders = await response.json(); renderOrders(orders); }
function renderOrders(orders) {
  const grouped = {
    new: orders.filter(order => order.status === 'new' || order.status === 'pending'),
    preparing: orders.filter(order => order.status === 'preparing'),
    ready: orders.filter(order => order.status === 'ready')
  };
  Object.entries(grouped).forEach(([status, rows]) => { document.getElementById(`${status}-count`).textContent = rows.length; });
  const currentNewIds = new Set(grouped.new.map(order => order.id));
  if (kitchenKnownNewIds && [...currentNewIds].some(id => !kitchenKnownNewIds.has(id))) playKitchenAlarm();
  kitchenKnownNewIds = currentNewIds;
  const today = new Date().toISOString().slice(0, 10);
  const ordered = orders.filter(order => order.createdAt.startsWith(today)).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const card = order => {
    const locationLabel = order.deliveryType === 'domicilio' ? `Domicilio: ${order.address || 'sin dirección'}` : `Mesa ${order.table}`;
    const paymentLabel = paymentConfig[order.paymentMethod]?.label || 'Efectivo';
      const number = ordered.findIndex(item => item.id === order.id) + 1;
    const actions = order.status === 'new' || order.status === 'pending'
      ? `<div class="order-actions"><button class="ready-button" data-id="${order.id}" data-status="preparing">Iniciar preparación</button><button class="cancel-button" data-id="${order.id}" data-status="cancelled">✕ Cancelar</button></div>`
      : order.status === 'preparing'
        ? `<button class="ready-button" data-id="${order.id}" data-status="ready">Marcar listo</button>`
        : order.status === 'ready'
          ? `<button class="ready-button delivered-button" data-id="${order.id}" data-status="delivered">Entregar</button>`
          : '';
    return `<article class="order-card status-${order.status}"><div class="order-meta"><span class="order-table">${locationLabel} · <b>#${number}</b></span><span class="order-time">${new Date(order.createdAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}</span></div><div class="order-summary"><span>${paymentLabel}</span><span>${order.phone ? order.phone : 'Sin teléfono'}</span></div><ul>${order.items.map(item => `<li><span>${item.quantity} × ${item.name}</span><span>${money(item.price * item.quantity)}</span></li>`).join('')}</ul>${order.note ? `<div class="order-note">Nota: ${order.note}</div>` : ''}<div class="order-total"><span>Total</span><strong>${money(order.total)}</strong></div>${actions}</article>`;
  };
  Object.entries(grouped).forEach(([status, rows]) => { document.getElementById(`${status}-orders`).innerHTML = rows.length ? rows.map(card).join('') : `<div class="empty-state">No hay pedidos ${status === 'new' ? 'nuevos' : status === 'preparing' ? 'en preparación' : 'listos'}.</div>`; });
  document.querySelectorAll('.ready-button, .cancel-button').forEach(button => button.onclick = () => updateStatus(button.dataset.id, button.dataset.status));
}
async function updateStatus(id, status) {
  const messageMap = {
    preparing: 'Pedido en preparación',
    ready: 'Pedido marcado como listo',
    delivered: 'Pedido entregado',
    cancelled: 'Pedido cancelado',
    pending: 'Pedido devuelto a pendientes'
  };
  const response = await fetch(`/api/orders/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
  if (response.ok) {
    toast(messageMap[status] || 'Estado actualizado');
    loadOrders();
  } else {
    const error = await response.json().catch(() => ({}));
    toast(error.error || 'No se pudo actualizar el pedido');
  }
}
async function loadKitchenState() {
  const response = await fetch('/api/kitchen', { cache: 'no-store' });
  if (!response.ok) return;
  const state = await response.json();
  updateKitchenControls(state.open);
}
function updateKitchenControls(open) {
  const status = document.getElementById('kitchen-open-status');
  const button = document.getElementById('toggle-kitchen');
  if (status) { status.textContent = open ? 'Cocina abierta' : 'Cocina cerrada'; status.className = `kitchen-state ${open ? 'is-open' : 'is-closed'}`; }
  if (button) button.textContent = open ? 'Cerrar cocina' : 'Abrir cocina';
}
async function toggleKitchen() {
  const current = document.getElementById('kitchen-open-status')?.classList.contains('is-open');
  const response = await fetch('/api/kitchen', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ open: !current }) });
  if (response.ok) { const state = await response.json(); updateKitchenControls(state.open); toast(state.open ? 'Cocina abierta' : 'Cocina cerrada'); }
}
function activateKitchenAlarm() {
  kitchenAudioContext = kitchenAudioContext || new (window.AudioContext || window.webkitAudioContext)();
  if (kitchenAudioContext.state === 'suspended') kitchenAudioContext.resume();
  document.getElementById('activate-alarm').textContent = 'Alarma activada';
  document.getElementById('activate-alarm').classList.add('alarm-active');
  playKitchenAlarm();
}
function playKitchenAlarm() {
  if (!kitchenAudioContext || kitchenAudioContext.state !== 'running') return;
  const start = kitchenAudioContext.currentTime;
  [0, 0.28, 0.56].forEach(offset => {
    const oscillator = kitchenAudioContext.createOscillator();
    const gain = kitchenAudioContext.createGain();
    oscillator.type = 'sine'; oscillator.frequency.value = 880;
    gain.gain.setValueAtTime(0.0001, start + offset);
    gain.gain.exponentialRampToValueAtTime(0.18, start + offset + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + offset + 0.18);
    oscillator.connect(gain); gain.connect(kitchenAudioContext.destination);
    oscillator.start(start + offset); oscillator.stop(start + offset + 0.2);
  });
}
async function deleteOrder(id) {
  const response = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
  if (response.ok) {
    document.querySelector(`[data-id="${id}"]`)?.closest('.order-card')?.remove();
    toast('Pedido cancelado y eliminado');
    loadOrders();
  } else {
    toast('No se pudo eliminar el pedido');
  }
}

function initReports() {
  const monthInput = document.getElementById('report-month');
  const now = new Date();
  monthInput.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  monthInput.addEventListener('change', loadReport);
  document.querySelectorAll('.admin-tab').forEach(tab => tab.addEventListener('click', () => {
    document.querySelectorAll('.admin-tab').forEach(item => item.classList.toggle('active', item === tab));
    document.querySelectorAll('.admin-view').forEach(view => view.classList.toggle('active', view.id === `view-${tab.dataset.view}`));
    if (tab.dataset.view === 'dishes') loadDishes();
    if (tab.dataset.view === 'pqrs') loadPqrs();
  }));
  if (document.getElementById('new-dish')) document.getElementById('new-dish').addEventListener('click', () => showDishForm());
  if (document.getElementById('cancel-dish')) document.getElementById('cancel-dish').addEventListener('click', () => hideDishForm());
  if (document.getElementById('dish-form')) document.getElementById('dish-form').addEventListener('submit', saveDish);
  ensureDashboardOperationalUI();
  ensureDashboardOperationalEvents();
  seedMenuIfEmpty();
  loadReport();
  setInterval(loadReport, 10000);
  loadPqrs();
  setInterval(loadPqrs, 10000);
}

function ensureDashboardOperationalUI() {
  const dashboard = document.getElementById('view-dashboard');
  if (!dashboard || dashboard.querySelector('#report-ops-panel')) return;
  dashboard.insertAdjacentHTML('beforeend', `
    <section class="report-section" id="report-ops-panel">
      <div class="section-heading">
        <div><p class="eyebrow">Finanzas</p><h2>Registrar movimiento</h2></div>
        <button class="export-button" id="export-report-button">Exportar reporte →</button>
      </div>
      <div class="operations-grid">
        <section class="movement-panel">
          <div class="movement-title">Gasto</div>
          <form class="report-form" id="expense-form">
            <input type="hidden" id="expense-id">
            <label>Concepto<input id="expense-concept" required></label>
            <label>Categoría<input id="expense-category" required></label>
            <label>Mes<input id="expense-month" type="month" required></label>
            <label>Monto<input id="expense-amount" type="number" min="0" required></label>
            <div class="form-actions">
              <button class="primary-button compact-button" type="submit">Guardar gasto</button>
              <button class="cancel-button compact-button" type="button" id="cancel-expense">Cancelar</button>
            </div>
          </form>
        </section>
        <section class="movement-panel">
          <div class="movement-title">Inventario</div>
          <form class="report-form" id="inventory-form">
            <input type="hidden" id="inventory-id">
            <label>Nombre<input id="inventory-name" required></label>
            <label>Unidad<input id="inventory-unit" required></label>
            <label>Stock<input id="inventory-stock" type="number" min="0" required></label>
            <label>Costo unitario<input id="inventory-unit-cost" type="number" min="0" required></label>
            <div class="form-actions">
              <button class="primary-button compact-button" type="submit">Guardar inventario</button>
              <button class="cancel-button compact-button" type="button" id="cancel-inventory">Cancelar</button>
            </div>
          </form>
        </section>
      </div>
    </section>
  `);
  const monthInput = document.getElementById('report-month');
  const month = monthInput && monthInput.value ? monthInput.value : `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  if (document.getElementById('expense-month')) document.getElementById('expense-month').value = month;
}

function ensureDashboardOperationalEvents() {
  if (document.getElementById('expense-form')) document.getElementById('expense-form').addEventListener('submit', saveExpense);
  if (document.getElementById('inventory-form')) document.getElementById('inventory-form').addEventListener('submit', saveInventory);
  if (document.getElementById('cancel-expense')) document.getElementById('cancel-expense').addEventListener('click', () => {
    document.getElementById('expense-form').reset();
    document.getElementById('expense-id').value = '';
  });
  if (document.getElementById('cancel-inventory')) document.getElementById('cancel-inventory').addEventListener('click', () => {
    document.getElementById('inventory-form').reset();
    document.getElementById('inventory-id').value = '';
  });
  if (document.getElementById('export-report-button')) document.getElementById('export-report-button').addEventListener('click', downloadReportCsv);
}

async function downloadReportCsv() {
  const month = document.getElementById('report-month').value || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
  const response = await fetch(`/api/report-export?month=${encodeURIComponent(month)}`, { cache: 'no-store' });
  if (!response.ok) return toast('No se pudo exportar el reporte');
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `reporte_${month}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
async function seedMenuIfEmpty() {
  const response = await fetch('/api/menu', { cache: 'no-store' });
  if (!response.ok || (await response.json()).length) return;
  await Promise.all(menu.map(item => fetch('/api/menu', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) })));
}
async function loadReport() {
  const selectedMonth = document.getElementById('report-month').value;
  const response = await fetch('/api/report-orders', { cache: 'no-store' });
  if (!response.ok) return;
  const orders = (await response.json()).filter(order => (order.status === 'ready' || order.status === 'delivered') && order.createdAt && order.createdAt.startsWith(selectedMonth));
  const products = {};
  orders.forEach(order => order.items.forEach(item => {
    if (!products[item.name]) products[item.name] = { quantity: 0, price: Number(item.price) || 0, total: 0 };
    products[item.name].quantity += Number(item.quantity) || 0;
    products[item.name].total += (Number(item.price) || 0) * (Number(item.quantity) || 0);
  }));
  const rows = Object.entries(products).sort((a, b) => b[1].total - a[1].total);
  const units = rows.reduce((sum, [, item]) => sum + item.quantity, 0);
  const total = rows.reduce((sum, [, item]) => sum + item.total, 0);

  const expenses = await fetch('/api/expenses', { cache: 'no-store' }).then(r => r.ok ? r.json() : []).catch(() => []);
  const expensesMonth = expenses.filter(item => String(item.month || '').startsWith(selectedMonth));
  const expenseTotal = expensesMonth.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const inventory = await fetch('/api/inventory', { cache: 'no-store' }).then(r => r.ok ? r.json() : []).catch(() => []);
  const inventoryTotal = inventory.length;
  const inventoryCost = inventory.reduce((sum, item) => sum + Number(item.stock || 0) * Number(item.unitCost || 0), 0);

  const payrollCost = expensesMonth.filter(item => ['nomina', 'nómina', 'personal', 'payroll', 'salario'].includes(String(item.category || '').toLowerCase())).reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const monthlyProfit = Math.max(total - expenseTotal - payrollCost - inventoryCost, 0);

  try {
    const summaryResponse = await fetch(`/api/report-summary?month=${encodeURIComponent(selectedMonth)}`, { cache: 'no-store' });
    if (summaryResponse.ok) {
      const summary = await summaryResponse.json();
      document.getElementById('report-expenses').textContent = money(summary.expenseTotal || 0);
      document.getElementById('report-profit').textContent = money(summary.monthlyProfit || 0);
      document.getElementById('inventory-cost').textContent = money(summary.inventoryCost || 0);
      document.getElementById('report-total').textContent = money(summary.total || total);
      document.getElementById('report-orders').textContent = summary.ordersCount || orders.length;
      document.getElementById('report-units').textContent = units;
      document.getElementById('inventory-total').textContent = summary.inventoryCount || inventoryTotal;
    }
  } catch {}

  document.getElementById('top-product').textContent = rows[0]?.[0] || '-';
  document.getElementById('top-product-units').textContent = rows[0] ? `${rows[0][1].quantity} unidades` : '0 unidades';
  const least = rows.length ? [...rows].sort((a, b) => a[1].quantity - b[1].quantity)[0] : null;
  document.getElementById('low-product').textContent = least?.[0] || '-';
  document.getElementById('low-product-units').textContent = least ? `${least[1].quantity} unidades` : '0 unidades';
  document.getElementById('report-orders').textContent = orders.length;
  document.getElementById('report-units').textContent = units;
  document.getElementById('report-total').textContent = money(total);
  document.getElementById('report-expenses').textContent = money(expenseTotal);
  document.getElementById('report-profit').textContent = money(monthlyProfit);
  document.getElementById('inventory-total').textContent = inventoryTotal;
  document.getElementById('inventory-cost').textContent = money(inventoryCost);
  document.getElementById('report-label').textContent = new Date(`${selectedMonth}-02T12:00:00`).toLocaleDateString('es-CO', { month: 'long', year: 'numeric' });
  document.getElementById('sales-rows').innerHTML = rows.length ? rows.map(([name, item]) => `<tr><td><strong>${name}</strong></td><td>${item.quantity}</td><td>${money(item.price)}</td><td class="table-total">${money(item.total)}</td></tr>`).join('') : '<tr><td colspan="4" class="table-empty">No hay ventas confirmadas en este mes.</td></tr>';

  document.getElementById('expenses-rows').innerHTML = expensesMonth.length ? expensesMonth.map(item => `<tr data-expense-id="${item.id}"><td><strong>${item.concept}</strong></td><td>${item.category}</td><td class="table-total">${money(item.amount)}</td><td><button class="table-action" data-action="edit-expense" data-id="${item.id}">Editar</button><button class="table-action danger-action" data-action="delete-expense" data-id="${item.id}">Eliminar</button></td></tr>`).join('') : '<tr><td colspan="4" class="table-empty">No hay gastos para este mes.</td></tr>';

  document.getElementById('inventory-rows').innerHTML = inventory.length ? inventory.map(item => `<tr data-inventory-id="${item.id}"><td><strong>${item.name}</strong></td><td>${item.stock} ${item.unit || ''}</td><td class="table-total">${money(item.stock * item.unitCost)}</td><td><button class="table-action" data-action="edit-inventory" data-id="${item.id}">Editar</button><button class="table-action danger-action" data-action="delete-inventory" data-id="${item.id}">Eliminar</button></td></tr>`).join('') : '<tr><td colspan="4" class="table-empty">No hay inventario registrado.</td></tr>';

  if (document.getElementById('expenses-rows')) {
    document.getElementById('expenses-rows').onclick = event => {
      const button = event.target.closest('button[data-action]');
      if (!button) return;
      if (button.dataset.action === 'delete-expense') deleteExpense(button.dataset.id);
      if (button.dataset.action === 'edit-expense') editExpense(button.dataset.id);
    };
  }
  if (document.getElementById('inventory-rows')) {
    document.getElementById('inventory-rows').onclick = event => {
      const button = event.target.closest('button[data-action]');
      if (!button) return;
      if (button.dataset.action === 'delete-inventory') deleteInventory(button.dataset.id);
      if (button.dataset.action === 'edit-inventory') editInventory(button.dataset.id);
    };
  }
}

async function loadDishes() {
  const response = await fetch('/api/menu', { cache: 'no-store' });
  if (!response.ok) return;
  const dishes = await response.json();
  document.getElementById('dish-rows').innerHTML = dishes.length ? dishes.map(item => `<tr><td><strong>${item.name}</strong></td><td>${item.category}</td><td>${money(item.price)}</td><td><button class="table-action" data-action="edit" data-id="${item.id}">Editar</button><button class="table-action danger-action" data-action="delete" data-id="${item.id}">Eliminar</button></td></tr>`).join('') : '<tr><td colspan="4" class="table-empty">Aún no hay platos administrables.</td></tr>';
  document.querySelectorAll('[data-action="edit"]').forEach(button => button.onclick = () => showDishForm(dishes.find(item => item.id === button.dataset.id)));
  document.querySelectorAll('[data-action="delete"]').forEach(button => button.onclick = () => removeDish(button.dataset.id));
}
function showDishForm(item = {}) {
  document.getElementById('dish-form').hidden = false;
  document.getElementById('dish-id').value = item.id || '';
  document.getElementById('dish-name').value = item.name || '';
  document.getElementById('dish-category').value = item.category || '';
  document.getElementById('dish-price').value = item.price || '';
  document.getElementById('dish-description').value = item.description || '';
  document.getElementById('dish-image').value = item.image || '';
}
function hideDishForm() { document.getElementById('dish-form').hidden = true; document.getElementById('dish-form').reset(); }
async function saveDish(event) {
  event.preventDefault();
  const id = document.getElementById('dish-id').value;
  const payload = { name: document.getElementById('dish-name').value, category: document.getElementById('dish-category').value, price: document.getElementById('dish-price').value, description: document.getElementById('dish-description').value, image: document.getElementById('dish-image').value };
  const response = await fetch(id ? `/api/menu/${id}` : '/api/menu', { method: id ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!response.ok) return toast('No se pudo guardar el plato');
  hideDishForm(); loadDishes(); toast('Plato guardado');
}
async function removeDish(id) {
  if (!confirm('¿Eliminar este plato del administrador?')) return;
  const response = await fetch(`/api/menu/${id}`, { method: 'DELETE' });
  if (response.ok) { loadDishes(); toast('Plato eliminado'); }
}
async function saveInventory(event) {
  event.preventDefault();
  const inventoryId = document.getElementById('inventory-id').value || '';
  const payload = {
    name: document.getElementById('inventory-name').value.trim(),
    unit: document.getElementById('inventory-unit').value.trim(),
    stock: Number(document.getElementById('inventory-stock').value || 0),
    unitCost: Number(document.getElementById('inventory-unit-cost').value || 0)
  };
  if (!payload.name || !payload.unit || payload.stock < 0 || payload.unitCost < 0) return toast('Completa nombre, unidad, stock y costo unitario');
  const response = await fetch(inventoryId ? `/api/inventory/${inventoryId}` : '/api/inventory', { method: inventoryId ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!response.ok) return toast('No se pudo guardar el inventario');
  document.getElementById('inventory-form').reset();
  document.getElementById('inventory-id').value = '';
  loadReport();
  toast(inventoryId ? 'Inventario actualizado' : 'Inventario registrado');
}
async function saveExpense(event) {
  event.preventDefault();
  const expenseId = document.getElementById('expense-id').value || '';
  const payload = {
    concept: document.getElementById('expense-concept').value.trim(),
    category: document.getElementById('expense-category').value.trim(),
    month: document.getElementById('expense-month').value,
    amount: Number(document.getElementById('expense-amount').value || 0)
  };
  if (!payload.concept || !payload.category || !payload.month || payload.amount < 0) return toast('Completa concepto, categoría, mes y monto');
  const response = await fetch(expenseId ? `/api/expenses/${expenseId}` : '/api/expenses', { method: expenseId ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!response.ok) return toast('No se pudo guardar el gasto');
  document.getElementById('expense-form').reset();
  document.getElementById('expense-id').value = '';
  loadReport();
  toast(expenseId ? 'Gasto actualizado' : 'Gasto registrado');
}

async function deleteExpense(id) {
  const response = await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
  if (!response.ok) return toast('No se pudo eliminar el gasto');
  loadReport();
  toast('Gasto eliminado');
}

async function deleteInventory(id) {
  const response = await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
  if (!response.ok) return toast('No se pudo eliminar el inventario');
  loadReport();
  toast('Inventario eliminado');
}

async function editExpense(id) {
  const response = await fetch('/api/expenses', { cache: 'no-store' });
  if (!response.ok) return toast('No se pudo cargar el gasto');
  const expenses = await response.json();
  const item = expenses.find(row => row.id === id);
  if (!item) return;
  document.getElementById('expense-id').value = item.id;
  document.getElementById('expense-concept').value = item.concept || '';
  document.getElementById('expense-category').value = item.category || '';
  document.getElementById('expense-month').value = item.month || '';
  document.getElementById('expense-amount').value = item.amount || 0;
}

async function editInventory(id) {
  const response = await fetch('/api/inventory', { cache: 'no-store' });
  if (!response.ok) return toast('No se pudo cargar el inventario');
  const inventory = await response.json();
  const item = inventory.find(row => row.id === id);
  if (!item) return;
  document.getElementById('inventory-id').value = item.id;
  document.getElementById('inventory-name').value = item.name || '';
  document.getElementById('inventory-unit').value = item.unit || '';
  document.getElementById('inventory-stock').value = item.stock || 0;
  document.getElementById('inventory-unit-cost').value = item.unitCost || 0;
}
async function loadPqrs() {
  const response = await fetch('/api/pqrs', { cache: 'no-store' });
  if (!response.ok) return;
  const rows = await response.json();
  const unread = rows.filter(item => item.status === 'new').length;
  const count = document.getElementById('pqr-count');
  count.textContent = unread;
  count.hidden = unread === 0;
  document.getElementById('pqr-list').innerHTML = rows.length ? rows.map(item => `<article class="pqr-card pqr-${item.status}"><div><strong>${item.type}</strong><span>${new Date(item.createdAt).toLocaleString('es-CO')}</span></div><h3>${item.name || 'Cliente sin nombre'}</h3><p>${item.message}</p><small>${item.phone || 'Sin celular'} · ${item.status}</small><button class="table-action" data-pqr-id="${item.id}" data-pqr-status="${item.status === 'new' ? 'reviewed' : 'resolved'}">${item.status === 'new' ? 'Marcar revisada' : item.status === 'reviewed' ? 'Marcar resuelta' : 'Resuelta'}</button></article>`).join('') : '<div class="empty-state">No hay PQR recibidas.</div>';
  document.querySelectorAll('[data-pqr-id]').forEach(button => button.onclick = async () => { const result = await fetch(`/api/pqrs/${button.dataset.pqrId}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: button.dataset.pqrStatus }) }); if (result.ok) loadPqrs(); });
}

if (document.body.dataset.page === 'menu') initMenu();
if (document.body.dataset.page === 'kitchen') initKitchen();
if (document.body.dataset.page === 'reports') initReports();
