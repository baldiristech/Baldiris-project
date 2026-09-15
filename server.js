const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const root = __dirname;
const dataDir = path.join(root, 'data');
const clientsFile = path.join(dataDir, 'clients.json');
const teamFile = path.join(dataDir, 'team.json');
const movementsFile = path.join(dataDir, 'movements.json');
const businessesFile = path.join(dataDir, 'businessData.json');
const usersFile = path.join(dataDir, 'users.json');
const baldirisAdminEmail = (process.env.BALDIRIS_ADMIN_EMAIL || '').trim();
const baldirisAdminPassword = (process.env.BALDIRIS_ADMIN_PASSWORD || '').trim();

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(clientsFile)) fs.writeFileSync(clientsFile, JSON.stringify([{ id: 'c-1', name: 'K.E. Chicharrón', contact: 'contacto@kechicharron.co', type: 'Cliente', projects: '1 activo', income: 0, status: 'Activo' }], null, 2));
if (!fs.existsSync(teamFile)) fs.writeFileSync(teamFile, JSON.stringify([
  { id: 't-1', name: 'Laura Méndez', email: 'laura@baldiris.com', role: 'Desarrollo', project: 'Sistema POS', payment: 'Mensual', status: 'Activo' },
  { id: 't-2', name: 'Mateo Rojas', email: 'mateo@baldiris.com', role: 'Diseño UX', project: 'Portal corporativo', payment: 'Por proyecto', status: 'Activo' },
  { id: 't-3', name: 'Camila Torres', email: 'camila@baldiris.com', role: 'Soporte', project: 'General', payment: 'Mensual', status: 'Pendiente' }
], null, 2));
if (!fs.existsSync(movementsFile)) fs.writeFileSync(movementsFile, JSON.stringify([
  { id: 'MOV-1', concept: 'Pago mensual inicial', type: 'income', category: 'Ingresos', method: 'transferencia', amount: 2500000, date: '2026-09-14', status: 'Pagado', project: 'Sistema POS', business: 'K.E. Chicharrón', responsible: 'Andrés García' }
], null, 2));
if (!fs.existsSync(businessesFile)) fs.writeFileSync(businessesFile, JSON.stringify({
  1: { name: 'K.E. Chicharrón', city: 'Bogotá', client: 'K.E. Chicharrón', project: 'Sistema POS', active: true, products: [] }
}, null, 2));

function sendJson(res, payload, code = 200) {
  res.writeHead(code, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(payload));
}

function sendStatic(res, fullPath, reqUrl) {
  const safePath = path.normalize(fullPath).replace(/\\/g, '/');
  const indexPath = path.join(root, 'index.html');
  if (safePath.endsWith('/') || reqUrl.pathname === '/') {
    const file = indexPath;
    fs.createReadStream(file).pipe(res);
    return;
  }
  if (!fs.existsSync(fullPath)) {
    sendJson(res, { error: 'No encontrado' }, 404);
    return;
  }
  const ext = path.extname(fullPath);
  const mime = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml'
  }[ext] || 'application/octet-stream';
  res.writeHead(200, {
    'Content-Type': mime,
    'Access-Control-Allow-Origin': '*'
  });
  fs.createReadStream(fullPath).pipe(res);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
      if (data.length > 1e6) reject(new Error('Body demasiado grande'));
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        return resolve(JSON.parse(data));
      } catch (error) {
        return reject(new Error('JSON inválido en el cuerpo del request'));
      }
    });
    req.on('error', reject);
  });
}

function readFileJson(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return []; }
}

function getApi(req, res, pathname) {
  if (pathname.startsWith('/api/reports/') && req.method === 'GET') {
    const type = pathname.split('/').pop();
    const rows = {
      finance: [{ concept: 'Pago mensual inicial', type: 'income', amount: 2500000, date: '2026-09-14' }],
      pos: [{ title: 'Pedidos', value: '0' }, { title: 'Productos', value: '6' }, { title: 'Negocio', value: 'K.E. Chicharrón' }],
      projects: [{ title: 'Proyecto', value: 'K.E. Chicharrón' }, { title: 'Cliente', value: 'K.E. Chicharrón' }, { title: 'Estado', value: 'Activo' }]
    }[type] || [];
    sendJson(res, { type, rows, generatedAt: new Date().toISOString() });
    return true;
  }
  if (pathname === '/api/auth/login' && req.method === 'POST') {
    readBody(req).then(body => {
      const email = String(body.email || '').trim();
      const password = String(body.password || '').trim();
      if (!baldirisAdminEmail || !baldirisAdminPassword) {
        return sendJson(res, { error: 'Configura BALDIRIS_ADMIN_EMAIL y BALDIRIS_ADMIN_PASSWORD en Render.' }, 401);
      }
      if (email !== baldirisAdminEmail || password !== baldirisAdminPassword) {
        return sendJson(res, { error: 'Credenciales no válidas.' }, 401);
      }
      return sendJson(res, { ok: true, user: { email, role: 'Super Admin' } });
    }).catch(() => sendJson(res, { error: 'Body inválido.' }, 400));
    return true;
  }
  if (pathname === '/api/users' && req.method === 'GET') {
    sendJson(res, readFileJson(usersFile));
    return true;
  }
  if (pathname === '/api/users' && req.method === 'POST') {
    readBody(req).then(body => {
      const name = String(body.name || '').trim();
      const email = String(body.email || '').trim();
      const role = String(body.role || 'Empleado').trim();
      const businessIds = Array.isArray(body.businessIds) ? body.businessIds.map(id => Number(id)) : (body.businessId ? [Number(body.businessId)] : []);
      const validRoles = ['Super Admin', 'Administrador de negocio', 'Cocina', 'Empleado'];
      if (!name || !email || !validRoles.includes(role) || !businessIds.length) {
        return sendJson(res, { error: 'Nombre, correo, rol y negocio son obligatorios' }, 400);
      }
      const rows = readFileJson(usersFile);
      const user = { id: `u-${Date.now()}`, name, email, role, businessIds, status: body.status || 'Activo' };
      rows.push(user);
      fs.writeFileSync(usersFile, JSON.stringify(rows, null, 2));
      sendJson(res, user, 201);
      return true;
    }).catch(err => sendJson(res, { error: err.message }, 400));
    return true;
  }
  const usersMatch = pathname.match(/^\/api\/users\/([^/]+)$/);
  if (usersMatch && req.method === 'PATCH') {
    readBody(req).then(body => {
      const rows = readFileJson(usersFile);
      const index = rows.findIndex(item => item.id === usersMatch[1]);
      if (index < 0) {
        sendJson(res, { error: 'Usuario no encontrado' }, 404);
        return true;
      }
      rows[index] = { ...rows[index], ...body, id: usersMatch[1] };
      fs.writeFileSync(usersFile, JSON.stringify(rows, null, 2));
      sendJson(res, rows[index]);
      return true;
    }).catch(err => sendJson(res, { error: err.message }, 400));
    return true;
  }
  if (usersMatch && req.method === 'DELETE') {
    const rows = readFileJson(usersFile);
    const remaining = rows.filter(item => item.id !== usersMatch[1]);
    if (remaining.length === rows.length) {
      sendJson(res, { error: 'Usuario no encontrado' }, 404);
      return true;
    }
    fs.writeFileSync(usersFile, JSON.stringify(remaining, null, 2));
    sendJson(res, { ok: true });
    return true;
  }
  if (pathname === '/api/clients' && req.method === 'GET') {
    sendJson(res, readFileJson(clientsFile));
    return true;
  }
  if (pathname === '/api/clients' && req.method === 'POST') {
    readBody(req).then(body => {
      const rows = readFileJson(clientsFile);
      const newClient = { id: `c-${Date.now()}`, ...body, type: body.type || 'Cliente', status: body.status || 'Activo' };
      rows.push(newClient);
      fs.writeFileSync(clientsFile, JSON.stringify(rows, null, 2));
      sendJson(res, newClient, 201);
    }).catch(err => sendJson(res, { error: err.message }, 400));
    return true;
  }
  if (pathname === '/api/team' && req.method === 'GET') {
    sendJson(res, readFileJson(teamFile));
    return true;
  }
  if (pathname === '/api/team' && req.method === 'POST') {
    readBody(req).then(body => {
      const rows = readFileJson(teamFile);
      const newMember = { id: `t-${Date.now()}`, ...body, status: body.status || 'Activo' };
      rows.push(newMember);
      fs.writeFileSync(teamFile, JSON.stringify(rows, null, 2));
      sendJson(res, newMember, 201);
    }).catch(err => sendJson(res, { error: err.message }, 400));
    return true;
  }
  if (pathname === '/api/movements' && req.method === 'GET') {
    sendJson(res, readFileJson(movementsFile));
    return true;
  }
  if (pathname === '/api/movements' && req.method === 'POST') {
    readBody(req).then(body => {
      const rows = readFileJson(movementsFile);
      const newMovement = { id: body.id || `MOV-${Date.now()}`, ...body };
      rows.unshift(newMovement);
      fs.writeFileSync(movementsFile, JSON.stringify(rows, null, 2));
      sendJson(res, newMovement, 201);
    }).catch(err => sendJson(res, { error: err.message }, 400));
    return true;
  }
  if (pathname === '/api/businesses' && req.method === 'GET') {
    sendJson(res, readFileJson(businessesFile));
    return true;
  }
  if (pathname === '/api/businesses' && req.method === 'POST') {
    readBody(req).then(body => {
      const businesses = readFileJson(businessesFile);
      const nextId = String(Math.max(...Object.keys(businesses || {}).map(Number)) + 1 || 1);
      businesses[nextId] = {
        name: body.name,
        city: body.city || 'Bogotá',
        client: body.name,
        project: body.project || 'Sistema POS',
        active: true,
        products: []
      };
      fs.writeFileSync(businessesFile, JSON.stringify(businesses, null, 2));
      sendJson(res, businesses[nextId], 201);
    }).catch(err => sendJson(res, { error: err.message }, 400));
    return true;
  }
  if (pathname === '/api/businesses' && req.method === 'PATCH') {
    readBody(req).then(body => {
      const businesses = readFileJson(businessesFile);
      const selected = businesses[1] || businesses[Object.keys(businesses)[0]];
      if (!selected) {
        sendJson(res, { error: 'No existe negocio' }, 404);
        return true;
      }
      if (typeof body.active === 'boolean') selected.active = body.active;
      fs.writeFileSync(businessesFile, JSON.stringify(businesses, null, 2));
      sendJson(res, selected);
      return true;
    }).catch(err => sendJson(res, { error: err.message }, 400));
    return true;
  }
  return false;
}

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);
  const pathname = reqUrl.pathname;
  if (req.method === 'OPTIONS') {
    sendJson(res, { ok: true });
    return;
  }
  if (pathname.startsWith('/api/')) {
    if (getApi(req, res, pathname)) return;
    sendJson(res, { error: 'Ruta API no encontrada' }, 404);
    return;
  }
  const targetPath = pathname === '/' ? path.join(root, 'index.html') : path.join(root, decodeURIComponent(pathname));
  sendStatic(res, targetPath, reqUrl);
});

server.listen(8080, () => {
  console.log('BALDIRIS static server listening on http://localhost:8080');
});
