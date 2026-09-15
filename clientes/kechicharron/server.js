const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = __dirname;
const publicDir = fs.existsSync(path.join(root, 'index.html')) ? root : path.join(root, 'public');
const ordersFile = path.join(root, 'orders.json');
const menuFile = path.join(root, 'menu.json');
const pqrsFile = path.join(root, 'pqrs.json');
const kitchenFile = path.join(root, 'kitchen.json');
const inventoryFile = path.join(root, 'inventory.json');
const expensesFile = path.join(root, 'expenses.json');
const businessFile = path.join(root, 'business.json');
const usersFile = path.join(root, 'users.json');
const port = process.env.PORT || 3000;
const reportUser = process.env.REPORT_USER || '';
const reportPassword = process.env.REPORT_PASSWORD || '';
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseOrdersUrl = supabaseUrl ? `${supabaseUrl.replace(/\/$/, '')}/rest/v1/orders` : '';

if (!fs.existsSync(businessFile)) fs.writeFileSync(businessFile, JSON.stringify({ active: true, name: 'K.E. Chicharrón', project: 'Sistema POS', client: 'K.E. Chicharrón' }, null, 2));
if (!fs.existsSync(ordersFile)) fs.writeFileSync(ordersFile, '[]');
if (!fs.existsSync(menuFile)) fs.writeFileSync(menuFile, '[]');
if (!fs.existsSync(pqrsFile)) fs.writeFileSync(pqrsFile, '[]');
if (!fs.existsSync(kitchenFile)) fs.writeFileSync(kitchenFile, JSON.stringify({ open: true }, null, 2));
if (!fs.existsSync(inventoryFile)) fs.writeFileSync(inventoryFile, '[]');
if (!fs.existsSync(expensesFile)) fs.writeFileSync(expensesFile, '[]');
if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, '[]');

function readOrders() {
  try { return JSON.parse(fs.readFileSync(ordersFile, 'utf8')); }
  catch { return []; }
}

function saveOrders(orders) {
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
}

function readJsonFile(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch { return []; }
}

function readBusinessState() {
  try { return JSON.parse(fs.readFileSync(businessFile, 'utf8')); }
  catch { return { active: true, name: 'K.E. Chicharrón', project: 'Sistema POS', client: 'K.E. Chicharrón' }; }
}

function saveJsonFile(file, rows) {
  fs.writeFileSync(file, JSON.stringify(rows, null, 2));
}

function saveBusinessState(state) {
  fs.writeFileSync(businessFile, JSON.stringify(state, null, 2));
}

function getKitchenState() {
  const state = readJsonFile(kitchenFile);
  return { open: (Array.isArray(state) ? state[0] : state)?.open !== false };
}

function saveKitchenState(state) {
  fs.writeFileSync(kitchenFile, JSON.stringify({ open: state.open !== false }, null, 2));
}

function fromDatabase(row) {
  return {
    id: row.id,
    table: row.table_number,
    note: row.note || '',
    items: row.items,
    total: Number(row.total) || 0,
    status: row.status,
    createdAt: row.created_at,
    readyAt: row.ready_at,
    deliveryType: row.delivery_type || 'mesa',
    paymentMethod: row.payment_method || 'efectivo',
    address: row.address || '',
    phone: row.phone || ''
  };
}

function toDatabase(order) {
  return {
    id: order.id,
    table_number: order.table,
    note: order.note,
    items: order.items,
    total: order.total,
    status: order.status,
    created_at: order.createdAt,
    ready_at: order.readyAt || null,
    delivery_type: order.deliveryType || 'mesa',
    payment_method: order.paymentMethod || 'efectivo',
    address: order.address || '',
    phone: order.phone || ''
  };
}

function fromMenuDatabase(row) {
  return { id: row.id, category: row.category, name: row.name, description: row.description || '', price: Number(row.price) || 0, image: row.image || '', visual: row.visual || '' };
}

function toMenuDatabase(item) {
  return { id: item.id, category: item.category, name: item.name, description: item.description || '', price: Number(item.price) || 0, image: item.image || '', visual: item.visual || '' };
}

function fromPqrDatabase(row) {
  return { id: row.id, name: row.name || '', phone: row.phone || '', type: row.type || 'sugerencia', message: row.message || '', status: row.status || 'new', createdAt: row.created_at };
}

function toPqrDatabase(item) {
  return { id: item.id, name: item.name, phone: item.phone, type: item.type, message: item.message, status: item.status, created_at: item.createdAt };
}

async function databaseRequest(options = {}) {
  const requestUrl = options.requestUrl || supabaseOrdersUrl;
  const response = await fetch(requestUrl, {
    ...options,
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  if (!response.ok) throw new Error(`Supabase respondió ${response.status}: ${await response.text()}`);
  return response.status === 204 ? null : response.json();
}

async function getOrders() {
  if (!supabaseOrdersUrl || !supabaseKey) return readOrders();
  const rows = await databaseRequest({ method: 'GET', requestUrl: `${supabaseOrdersUrl}?select=*&order=created_at.desc` });
  return rows.map(fromDatabase);
}

async function getMenu() {
  if (!supabaseOrdersUrl || !supabaseKey) return readJsonFile(menuFile);
  const rows = await databaseRequest({ method: 'GET', requestUrl: `${supabaseUrl.replace(/\/$/, '')}/rest/v1/menu_items?select=*&order=created_at.asc` });
  return rows.map(fromMenuDatabase);
}

async function createMenuItem(item) {
  if (!supabaseOrdersUrl || !supabaseKey) {
    const items = readJsonFile(menuFile);
    items.push(item);
    saveJsonFile(menuFile, items);
    return item;
  }
  const rows = await databaseRequest({ method: 'POST', requestUrl: `${supabaseUrl.replace(/\/$/, '')}/rest/v1/menu_items`, headers: { Prefer: 'return=representation' }, body: JSON.stringify(toMenuDatabase(item)) });
  return fromMenuDatabase(rows[0]);
}

async function updateMenuItem(id, item) {
  if (!supabaseOrdersUrl || !supabaseKey) {
    const items = readJsonFile(menuFile);
    const index = items.findIndex(row => row.id === id);
    if (index < 0) return null;
    items[index] = { ...items[index], ...item, id };
    saveJsonFile(menuFile, items);
    return items[index];
  }
  const rows = await databaseRequest({ method: 'PATCH', requestUrl: `${supabaseUrl.replace(/\/$/, '')}/rest/v1/menu_items?id=eq.${encodeURIComponent(id)}`, headers: { Prefer: 'return=representation' }, body: JSON.stringify(toMenuDatabase({ ...item, id })) });
  return rows[0] ? fromMenuDatabase(rows[0]) : null;
}

async function deleteMenuItem(id) {
  if (!supabaseOrdersUrl || !supabaseKey) {
    const items = readJsonFile(menuFile);
    const remaining = items.filter(row => row.id !== id);
    if (remaining.length === items.length) return false;
    saveJsonFile(menuFile, remaining);
    return true;
  }
  await databaseRequest({ method: 'DELETE', requestUrl: `${supabaseUrl.replace(/\/$/, '')}/rest/v1/menu_items?id=eq.${encodeURIComponent(id)}` });
  return true;
}

async function getPqrs() {
  if (!supabaseOrdersUrl || !supabaseKey) return readJsonFile(pqrsFile);
  const rows = await databaseRequest({ method: 'GET', requestUrl: `${supabaseUrl.replace(/\/$/, '')}/rest/v1/pqrs?select=*&order=created_at.desc` });
  return rows.map(fromPqrDatabase);
}

async function createPqr(item) {
  if (!supabaseOrdersUrl || !supabaseKey) {
    const rows = readJsonFile(pqrsFile);
    rows.unshift(item);
    saveJsonFile(pqrsFile, rows);
    return item;
  }
  const rows = await databaseRequest({ method: 'POST', requestUrl: `${supabaseUrl.replace(/\/$/, '')}/rest/v1/pqrs`, headers: { Prefer: 'return=representation' }, body: JSON.stringify(toPqrDatabase(item)) });
  return fromPqrDatabase(rows[0]);
}

async function updatePqr(id, status) {
  if (!supabaseOrdersUrl || !supabaseKey) {
    const rows = readJsonFile(pqrsFile);
    const pqr = rows.find(row => row.id === id);
    if (!pqr) return null;
    pqr.status = status;
    saveJsonFile(pqrsFile, rows);
    return pqr;
  }
  const rows = await databaseRequest({ method: 'PATCH', requestUrl: `${supabaseUrl.replace(/\/$/, '')}/rest/v1/pqrs?id=eq.${encodeURIComponent(id)}`, headers: { Prefer: 'return=representation' }, body: JSON.stringify({ status }) });
  return rows[0] ? fromPqrDatabase(rows[0]) : null;
}

async function createOrder(order) {
  if (!supabaseOrdersUrl || !supabaseKey) {
    const orders = readOrders();
    orders.unshift(order);
    saveOrders(orders);
    return order;
  }
  const rows = await databaseRequest({ method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify(toDatabase(order)) });
  return fromDatabase(rows[0]);
}

async function updateOrderStatus(id, status, readyAt) {
  if (!supabaseOrdersUrl || !supabaseKey) {
    const orders = readOrders();
    const order = orders.find(item => item.id === id);
    if (!order) return null;
    order.status = status;
    order.readyAt = readyAt;
    saveOrders(orders);
    return order;
  }
  const rows = await databaseRequest({
    method: 'PATCH',
    requestUrl: `${supabaseOrdersUrl}?id=eq.${encodeURIComponent(id)}`,
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ status, ready_at: readyAt })
  });
  return rows[0] ? fromDatabase(rows[0]) : null;
}

async function deleteOrder(id) {
  if (!supabaseOrdersUrl || !supabaseKey) {
    const orders = readOrders();
    const remaining = orders.filter(item => item.id !== id);
    if (remaining.length === orders.length) return false;
    saveOrders(remaining);
    return true;
  }
  await databaseRequest({
    method: 'DELETE',
    requestUrl: `${supabaseOrdersUrl}?id=eq.${encodeURIComponent(id)}`
  });
  return true;
}

function getMonthFromQuery(reqUrl) {
  const query = new URL(reqUrl, 'http://localhost').searchParams.get('month') || '';
  return String(query).trim();
}

function calculateReportSummary(month) {
  const orders = readOrders();
  const monthlyOrders = orders.filter(order => (order.status === 'ready' || order.status === 'delivered') && order.createdAt && String(order.createdAt).startsWith(month));
  const total = monthlyOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);

  const expenses = readJsonFile(expensesFile);
  const expensesMonth = expenses.filter(item => String(item.month || '').startsWith(month));
  const expenseTotal = expensesMonth.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const payrollCost = expensesMonth.filter(item => ['nomina', 'nómina', 'personal', 'payroll', 'salario'].includes(String(item.category || '').toLowerCase())).reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const inventory = readJsonFile(inventoryFile);
  const inventoryCost = inventory.reduce((sum, item) => sum + Number(item.stock || 0) * Number(item.unitCost || 0), 0);

  const monthlyProfit = Math.max(total - expenseTotal - payrollCost - inventoryCost, 0);
  return {
    month,
    total,
    expenseTotal,
    payrollCost,
    inventoryCost,
    monthlyProfit,
    ordersCount: monthlyOrders.length,
    inventoryCount: inventory.length,
    expensesCount: expensesMonth.length
  };
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(payload));
}

function csvEscape(value) {
  return String(value ?? '').replace(/"/g, '""');
}

function exportCsvReport(month, orders, expenses, inventory) {
  const salesTable = [];
  const products = {};
  orders.filter(order => (order.status === 'ready' || order.status === 'delivered') && order.createdAt && String(order.createdAt).startsWith(month))
    .forEach(order => order.items.forEach(item => {
      const name = item.name || '';
      if (!products[name]) products[name] = { quantity: 0, price: Number(item.price) || 0, total: 0 };
      products[name].quantity += Number(item.quantity) || 0;
      products[name].total += (Number(item.price) || 0) * (Number(item.quantity) || 0);
    }));
  for (const [name, item] of Object.entries(products)) {
    salesTable.push([name, String(item.quantity), String(item.price), String(item.total)]);
  }

  const expensesMonth = expenses.filter(item => String(item.month || '').startsWith(month));
  const csvLines = [];
  csvLines.push('BALDIRIS,REPORTE_KECHICHARRON');
  csvLines.push('Mes,' + month);
  csvLines.push('');
  csvLines.push('Ventas,Producto,Unidades,Precio,Total');
  salesTable.forEach(row => csvLines.push('Venta,' + row.map(csvEscape).map(value => '"' + value + '"').join(',')));
  csvLines.push('');
  csvLines.push('Gastos,Concepto,Categoria,Mes,Monto');
  expensesMonth.forEach(item => csvLines.push('Gasto,"' + csvEscape(item.concept) + '","' + csvEscape(item.category) + '","' + csvEscape(item.month) + '","' + csvEscape(item.amount) + '"'));
  csvLines.push('');
  csvLines.push('Inventario,Nombre,Unidad,Stock,CostoUnidad,ValorTotal');
  inventory.forEach(item => csvLines.push('Inventario,"' + csvEscape(item.name) + '","' + csvEscape(item.unit) + '","' + csvEscape(item.stock) + '","' + csvEscape(item.unitCost) + '","' + csvEscape(Number(item.stock) * Number(item.unitCost)) + '"'));
  return csvLines.join('\n');
}

function reportAuthorized(req, res) {
  const header = req.headers.authorization || '';
  const encoded = header.startsWith('Basic ') ? header.slice(6) : '';
  let credentials = '';
  try { credentials = Buffer.from(encoded, 'base64').toString('utf8'); }
  catch { credentials = ''; }
  if (reportUser && reportPassword && credentials === `${reportUser}:${reportPassword}`) return true;
  res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="Reportes K.E. Chicharrón", charset="UTF-8"' });
  res.end('Acceso privado');
  return false;
}

function bodyFrom(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch { reject(new Error('JSON inválido')); }
    });
  });
}

function serveStatic(req, res) {
  const requested = decodeURIComponent((req.url || '').split('?')[0]);
  const relative = requested === '/' ? '/index.html' : requested;
  const target = path.normalize(path.join(publicDir, relative));
  const rootPrefix = publicDir.endsWith(path.sep) ? publicDir : publicDir + path.sep;
  const rootImage = path.normalize(path.join(root, relative));
  const file = target.startsWith(rootPrefix) && fs.existsSync(target) ? target : rootImage;
  const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.png': 'image/png', '.json': 'application/json' };
  if (!file.startsWith(root) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({ error: 'No encontrado' }));
  }
  res.writeHead(200, { 'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Length': '0'
      });
      return res.end();
    }
    const requested = decodeURIComponent((req.url || '').split('?')[0]);
    const normalizedRequested = requested === '/api/orders/' ? '/api/orders' : requested;
    const businessApi = normalizedRequested === '/api/business' && (req.method === 'GET' || req.method === 'PATCH');
    const business = readBusinessState();
    if (business.active === false && !businessApi) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('No encontrado');
    }
    const usersWrite = requested === '/api/users' && req.method !== 'GET' || /^\/api\/users\/[^/]+$/.test(requested);
    const adminApi = req.url === '/api/report-orders'
      || req.url === '/api/report-summary'
      || req.url.startsWith('/api/report-summary?')
      || req.url === '/api/inventory'
      || req.url === '/api/expenses'
      || (req.url === '/api/users' && req.method !== 'GET')
      || (req.url === '/api/menu' && req.method !== 'GET')
      || (req.url === '/api/pqrs' && req.method === 'GET')
      || /^\/api\/(menu|pqrs|inventory|expenses)\/[^/]+/.test(req.url)
      || usersWrite;
    if ((requested === '/reportes.html' || adminApi) && !reportAuthorized(req, res)) return;
    if (normalizedRequested === '/api/business' && req.method === 'GET') {
      return sendJson(res, 200, readBusinessState());
    }
    if (normalizedRequested === '/api/business' && req.method === 'PATCH') {
      const data = await bodyFrom(req);
      const active = typeof data.active === 'boolean' ? data.active : Boolean(data.active);
      const business = readBusinessState();
      business.active = active;
      saveBusinessState(business);
      return sendJson(res, 200, business);
    }
    if (normalizedRequested === '/api/users' && req.method === 'GET') {
      return sendJson(res, 200, readJsonFile(usersFile));
    }
    if (normalizedRequested === '/api/users' && req.method === 'POST') {
      const data = await bodyFrom(req);
      const name = String(data.name || '').trim();
      const email = String(data.email || '').trim();
      const role = String(data.role || 'Empleado').trim();
      const businessIds = Array.isArray(data.businessIds) ? data.businessIds.map(id => Number(id)) : (data.businessId ? [Number(data.businessId)] : []);
      const validRoles = ['Super Admin', 'Administrador de negocio', 'Cocina', 'Empleado'];
      if (!name || !email || !validRoles.includes(role) || !businessIds.length) {
        return sendJson(res, 400, { error: 'Nombre, correo, rol y negocio son obligatorios' });
      }
      const users = readJsonFile(usersFile);
      const user = { id: crypto.randomUUID(), name, email, role, businessIds, status: 'Activo' };
      users.push(user);
      saveJsonFile(usersFile, users);
      return sendJson(res, 201, user);
    }
    const usersMatch = normalizedRequested.match(/^\/api\/users\/([^/]+)$/);
    if (usersMatch && req.method === 'PATCH') {
      const data = await bodyFrom(req);
      const users = readJsonFile(usersFile);
      const index = users.findIndex(item => item.id === usersMatch[1]);
      if (index < 0) return sendJson(res, 404, { error: 'Usuario no encontrado' });
      users[index] = { ...users[index], ...data, id: usersMatch[1] };
      saveJsonFile(usersFile, users);
      return sendJson(res, 200, users[index]);
    }
    if (usersMatch && req.method === 'DELETE') {
      const users = readJsonFile(usersFile);
      const remaining = users.filter(item => item.id !== usersMatch[1]);
      if (remaining.length === users.length) return sendJson(res, 404, { error: 'Usuario no encontrado' });
      saveJsonFile(usersFile, remaining);
      return sendJson(res, 200, { ok: true });
    }
    if (requested === '/api/report-export' && req.method === 'GET') {
      const month = getMonthFromQuery(req.url);
      const orders = await getOrders();
      const expenses = readJsonFile(expensesFile);
      const inventory = readJsonFile(inventoryFile);
      const csv = exportCsvReport(month || new Date().toISOString().slice(0, 7), orders, expenses, inventory);
      res.writeHead(200, {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="reporte_${month || new Date().toISOString().slice(0, 7)}.csv"`,
        'Access-Control-Allow-Origin': '*'
      });
      return res.end(csv);
    }
    if (normalizedRequested === '/api/report-orders' && req.method === 'GET') {
      return sendJson(res, 200, await getOrders());
    }
    if (normalizedRequested === '/api/report-summary' && req.method === 'GET') {
      const month = getMonthFromQuery(req.url);
      return sendJson(res, 200, calculateReportSummary(month || new Date().toISOString().slice(0, 7)));
    }
    if (normalizedRequested === '/api/orders' && req.method === 'GET') {
      return sendJson(res, 200, await getOrders());
    }
    if (normalizedRequested === '/api/kitchen' && req.method === 'GET') {
      return sendJson(res, 200, getKitchenState());
    }
    if (normalizedRequested === '/api/kitchen' && req.method === 'PATCH') {
      const data = await bodyFrom(req);
      const state = { open: data.open !== false };
      saveKitchenState(state);
      return sendJson(res, 200, state);
    }
    if (normalizedRequested === '/api/inventory' && req.method === 'GET') {
      return sendJson(res, 200, readJsonFile(inventoryFile));
    }
    if (normalizedRequested === '/api/inventory' && req.method === 'POST') {
      const data = await bodyFrom(req);
      const name = String(data.name || '').trim();
      const unit = String(data.unit || '').trim();
      const stock = Number(data.stock || 0);
      const unitCost = Number(data.unitCost || 0);
      if (!name || !unit || stock < 0 || unitCost < 0) {
        return sendJson(res, 400, { error: 'Nombre, unidad, stock y costo unitario son obligatorios' });
      }
      const inventory = readJsonFile(inventoryFile);
      const item = { id: crypto.randomUUID(), name, unit, stock, unitCost };
      inventory.push(item);
      saveJsonFile(inventoryFile, inventory);
      return sendJson(res, 201, item);
    }
    const inventoryMatch = normalizedRequested.match(/^\/api\/inventory\/([^/]+)$/);
    if (inventoryMatch && req.method === 'PATCH') {
      const data = await bodyFrom(req);
      const inventory = readJsonFile(inventoryFile);
      const index = inventory.findIndex(item => item.id === inventoryMatch[1]);
      if (index < 0) return sendJson(res, 404, { error: 'Inventario no encontrado' });
      inventory[index] = { ...inventory[index], ...data, id: inventoryMatch[1] };
      saveJsonFile(inventoryFile, inventory);
      return sendJson(res, 200, inventory[index]);
    }
    if (inventoryMatch && req.method === 'DELETE') {
      const inventory = readJsonFile(inventoryFile);
      const remaining = inventory.filter(item => item.id !== inventoryMatch[1]);
      if (remaining.length === inventory.length) return sendJson(res, 404, { error: 'Inventario no encontrado' });
      saveJsonFile(inventoryFile, remaining);
      return sendJson(res, 200, { ok: true });
    }
    if (normalizedRequested === '/api/expenses' && req.method === 'GET') {
      return sendJson(res, 200, readJsonFile(expensesFile));
    }
    if (normalizedRequested === '/api/expenses' && req.method === 'POST') {
      const data = await bodyFrom(req);
      const concept = String(data.concept || '').trim();
      const category = String(data.category || '').trim();
      const month = String(data.month || '').trim();
      const amount = Number(data.amount || 0);
      if (!concept || !category || !month || amount < 0) {
        return sendJson(res, 400, { error: 'Concepto, categoría, mes y monto son obligatorios' });
      }
      const expenses = readJsonFile(expensesFile);
      const item = { id: crypto.randomUUID(), concept, category, month, amount };
      expenses.push(item);
      saveJsonFile(expensesFile, expenses);
      return sendJson(res, 201, item);
    }
    const expenseMatch = normalizedRequested.match(/^\/api\/expenses\/([^/]+)$/);
    if (expenseMatch && req.method === 'PATCH') {
      const data = await bodyFrom(req);
      const expenses = readJsonFile(expensesFile);
      const index = expenses.findIndex(item => item.id === expenseMatch[1]);
      if (index < 0) return sendJson(res, 404, { error: 'Gasto no encontrado' });
      expenses[index] = { ...expenses[index], ...data, id: expenseMatch[1] };
      saveJsonFile(expensesFile, expenses);
      return sendJson(res, 200, expenses[index]);
    }
    if (expenseMatch && req.method === 'DELETE') {
      const expenses = readJsonFile(expensesFile);
      const remaining = expenses.filter(item => item.id !== expenseMatch[1]);
      if (remaining.length === expenses.length) return sendJson(res, 404, { error: 'Gasto no encontrado' });
      saveJsonFile(expensesFile, remaining);
      return sendJson(res, 200, { ok: true });
    }
    if (normalizedRequested === '/api/menu' && req.method === 'GET') {
      return sendJson(res, 200, await getMenu());
    }
    if (normalizedRequested === '/api/menu' && req.method === 'POST') {
      const data = await bodyFrom(req);
      if (!data.name || !data.category || Number(data.price) < 0) return sendJson(res, 400, { error: 'Nombre, categoría y precio son obligatorios' });
      const item = { id: crypto.randomUUID(), category: String(data.category).trim(), name: String(data.name).trim(), description: String(data.description || '').trim(), price: Number(data.price), image: String(data.image || '').trim(), visual: String(data.visual || '').trim() };
      return sendJson(res, 201, await createMenuItem(item));
    }
    const menuMatch = normalizedRequested.match(/^\/api\/menu\/([^/]+)$/);
    if (menuMatch && req.method === 'PATCH') {
      const data = await bodyFrom(req);
      const item = await updateMenuItem(menuMatch[1], { category: String(data.category || '').trim(), name: String(data.name || '').trim(), description: String(data.description || '').trim(), price: Number(data.price) || 0, image: String(data.image || '').trim(), visual: String(data.visual || '').trim() });
      if (!item) return sendJson(res, 404, { error: 'Plato no encontrado' });
      return sendJson(res, 200, item);
    }
    if (menuMatch && req.method === 'DELETE') {
      if (!await deleteMenuItem(menuMatch[1])) return sendJson(res, 404, { error: 'Plato no encontrado' });
      return sendJson(res, 200, { ok: true });
    }
    if (normalizedRequested === '/api/pqrs' && req.method === 'GET') {
      return sendJson(res, 200, await getPqrs());
    }
    if (normalizedRequested === '/api/pqrs' && req.method === 'POST') {
      const data = await bodyFrom(req);
      if (!data.message) return sendJson(res, 400, { error: 'El mensaje es obligatorio' });
      const pqr = { id: crypto.randomUUID(), name: String(data.name || '').trim(), phone: String(data.phone || '').trim(), type: ['queja', 'reclamo', 'sugerencia', 'felicitacion'].includes(data.type) ? data.type : 'sugerencia', message: String(data.message).trim(), status: 'new', createdAt: new Date().toISOString() };
      return sendJson(res, 201, await createPqr(pqr));
    }
    const pqrMatch = normalizedRequested.match(/^\/api\/pqrs\/([^/]+)\/status$/);
    if (pqrMatch && req.method === 'PATCH') {
      const data = await bodyFrom(req);
      const pqr = await updatePqr(pqrMatch[1], ['new', 'reviewed', 'resolved'].includes(data.status) ? data.status : 'reviewed');
      if (!pqr) return sendJson(res, 404, { error: 'PQR no encontrada' });
      return sendJson(res, 200, pqr);
    }
    if (normalizedRequested === '/api/orders' && req.method === 'POST') {
      const data = await bodyFrom(req);
      if (!getKitchenState().open) return sendJson(res, 409, { error: 'La cocina está cerrada y no recibe pedidos en este momento' });
      const deliveryType = data.deliveryType === 'domicilio' ? 'domicilio' : 'mesa';
      const hasItems = Array.isArray(data.items) && data.items.length > 0;
      if (!hasItems) return sendJson(res, 400, { error: 'Los productos son obligatorios' });
      if (deliveryType === 'domicilio') {
        if (!data.address || !data.phone) return sendJson(res, 400, { error: 'La dirección y el celular del domicilio son obligatorios' });
      } else if (!data.table || !String(data.table).trim()) {
        return sendJson(res, 400, { error: 'La mesa es obligatoria' });
      }
      const order = {
        id: crypto.randomUUID(),
        table: String(data.table || 'Domicilio').trim() || 'Domicilio',
        note: String(data.note || '').trim(),
        items: data.items,
        total: Number(data.total) || 0,
        status: 'new',
        createdAt: new Date().toISOString(),
        deliveryType,
        paymentMethod: data.paymentMethod || 'efectivo',
        address: String(data.address || '').trim(),
        phone: String(data.phone || '').trim()
      };
      return sendJson(res, 201, await createOrder(order));
    }
    const statusMatch = normalizedRequested.match(/^\/api\/orders\/([^/]+)\/status$/);
    if (statusMatch && req.method === 'PATCH') {
      const data = await bodyFrom(req);
      const validStatuses = ['new', 'pending', 'preparing', 'ready', 'delivered', 'cancelled'];
      const status = validStatuses.includes(data.status) ? data.status : 'new';
      const order = await updateOrderStatus(statusMatch[1], status, status === 'ready' ? new Date().toISOString() : null);
      if (!order) return sendJson(res, 404, { error: 'Pedido no encontrado' });
      return sendJson(res, 200, order);
    }
    const deleteMatch = normalizedRequested.match(/^\/api\/orders\/([^/]+)$/);
    if (deleteMatch && req.method === 'DELETE') {
      const deleted = await deleteOrder(deleteMatch[1]);
      if (!deleted) return sendJson(res, 404, { error: 'Pedido no encontrado' });
      return sendJson(res, 200, { ok: true });
    }
    serveStatic(req, res);
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
});

server.listen(port, () => console.log(`Kechicharrón QR disponible en http://localhost:${port}`));
