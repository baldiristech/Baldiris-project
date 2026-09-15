# K.E. Chicharrón QR

Aplicación web para pedidos por QR, cocina y reportes de ventas.

## Accesos

- `/` es el menú público para los clientes y se puede convertir en QR.
- `/cocina.html` es el panel que se abre en la tablet de cocina.
- `/reportes.html` es el reporte privado para el dueño.

La entrega al cliente se realiza con tres enlaces del mismo servidor. Consulta [ENTREGA_CLIENTE.md](ENTREGA_CLIENTE.md) para las URLs, usuarios y pasos de publicación.

## Ejecutar en un computador

1. Instala Node.js LTS desde https://nodejs.org.
2. Abre PowerShell en esta carpeta.
3. Ejecuta `npm start`.
4. Abre `http://localhost:3000`.

Para que un celular o tablet conectados al mismo Wi-Fi puedan entrar, usa la dirección IP del computador, por ejemplo `http://192.168.1.20:3000`.

## Reportes privados

El panel de reportes siempre exige usuario y contraseña. Configura las credenciales antes de iniciar la aplicación:

```powershell
$env:REPORT_USER = "usuario_privado"
$env:REPORT_PASSWORD = "una_contrasena_larga_y_unica"
npm start
```

El navegador solicitará esos datos únicamente al entrar a `/reportes.html`. El menú y la cocina no los solicitan, pero cocina tampoco puede consultar reportes, editar el menú ni acceder a las APIs administrativas. Si las variables no existen, el panel de reportes queda bloqueado.

## Publicarlo para usar QR desde cualquier lugar

El servidor debe quedar publicado con una URL HTTPS permanente, por ejemplo en Render, Railway o un VPS. Esa URL será la que se convierta en QR. La tablet usará `https://tu-dominio/cocina.html` y tu teléfono `https://tu-dominio/reportes.html`.

En producción, los pedidos se guardan en Supabase. El archivo `orders.json` solo se usa como respaldo cuando no están configuradas las variables de Supabase.

## Publicar en Render

1. Crea una cuenta en https://render.com.
2. Sube este proyecto a un repositorio privado de GitHub.
3. En Render elige **New > Web Service** y conecta ese repositorio.
4. Configura `Environment: Node`, `Build Command: npm install` y `Start Command: npm start`.
5. Agrega estas variables de entorno:

```text
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu_clave_secreta_de_supabase
REPORT_USER=usuario_privado
REPORT_PASSWORD=una_contrasena_larga_y_unica
```

6. Presiona **Save, rebuild, and deploy**.
7. Render entregará una dirección como `https://kechicharron-qr.onrender.com`.

## Instalar en tablet y teléfono

Abre la URL pública en Chrome. Para cocina entra en `/cocina.html`, abre el menú de Chrome y elige **Instalar aplicación** o **Agregar a pantalla de inicio**. En el teléfono haz lo mismo con `/reportes.html`; el navegador pedirá el usuario y contraseña una sola vez. El menú `/` se comparte como QR y los clientes no ven cocina ni reportes.