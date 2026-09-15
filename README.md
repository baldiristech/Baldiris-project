# BALDIRIS

Núcleo inicial de la plataforma empresarial multi-negocio descrita en el Manual Maestro de Construcción. Esta primera entrega implementa el objetivo técnico inicial: `Login -> Dashboard -> Administración -> Negocios -> K.E. Chicharrón -> BALDIRIS POS`.

## Ejecutar

La aplicación no requiere dependencias. Abre `index.html` en un navegador o sirve esta carpeta con cualquier servidor estático.

No se incluyen credenciales predeterminadas en el repositorio. Las credenciales reales se definen con variables de entorno en Render.

## Alcance de esta fase

- Login de demostración y cierre de sesión.
- Dashboard con ingresos, gastos, utilidad, reservas, actividad y proyectos.
- Navegación del núcleo administrativo.
- Vista multi-negocio con K.E. Chicharrón como primer negocio.
- Vista inicial de BALDIRIS POS con flujo de cocina.
- Diseño responsive para computador, tablet y celular.
- Integración conceptual con el proyecto existente `NetBeansProjects/kechicharron`: su menú real alimenta el primer negocio de BALDIRIS y su operación de pedidos se modela por estados.

## Relación empresarial

BALDIRIS es la empresa central. Cada proyecto tiene un cliente y puede habilitar un negocio o producto asociado. El primer caso es: BALDIRIS -> cliente K.E. Chicharrón -> proyecto Sistema POS -> negocio K.E. Chicharrón -> BALDIRIS POS. Los pedidos, productos y reportes del negocio deben permanecer aislados mediante `business_id`.

La entrega al cliente es una aplicación separada. El proyecto original completo fue incorporado en `clientes/kechicharron/`, conservando `public/`, `server.js`, `menu.json`, `orders.json`, `kitchen.json`, las imágenes y los reportes. No expone el panel administrativo de BALDIRIS, finanzas, usuarios ni configuración interna. En producción deberá publicarse como una aplicación o subdominio propio del negocio conectado a la API central.

Para ejecutarlo localmente desde la carpeta `BALDIRIS/clientes/kechicharron`, usa `node server.js` y abre `http://localhost:3000`. El botón de BALDIRIS POS apunta a ese aplicativo independiente.

La entrega al restaurante se organiza en tres enlaces: `/` para clientes y QR, `/cocina.html` para la tablet de cocina y `/reportes.html` para el administrador. Los pasos y credenciales de producción están documentados en [clientes/kechicharron/ENTREGA_CLIENTE.md](clientes/kechicharron/ENTREGA_CLIENTE.md).

La autenticación y los datos incluidos son únicamente de prototipo local. Antes de producción deben sustituirse por backend, base de datos multi-tenant, sesiones seguras, contraseñas hasheadas y autorización por roles.