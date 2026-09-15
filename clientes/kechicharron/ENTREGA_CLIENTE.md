# Entrega de K.E. Chicharrón

K.E. Chicharrón recibe tres accesos del mismo aplicativo, cada uno con una función distinta:

## En desarrollo local

Inicia el servidor desde esta carpeta:

```powershell
node server.js
```

Los enlaces son:

| Usuario | Enlace | Uso |
| --- | --- | --- |
| Cliente del restaurante | `http://localhost:3000/` | Menú público y pedidos por QR |
| Cocina | `http://localhost:3000/cocina.html` | Ver pedidos y avanzar estados |
| Administrador | `http://localhost:3000/reportes.html` | Ventas, menú, pedidos, PQRS y reportes |

## En producción

Después de publicar el servidor con un dominio HTTPS, los enlaces mantienen la misma estructura:

```text
https://kechicharron.baldiris.com/
https://kechicharron.baldiris.com/cocina.html
https://kechicharron.baldiris.com/reportes.html
```

El dominio es un ejemplo. Debe reemplazarse por el dominio real configurado en el proveedor de hosting.

## Qué se entrega a cada persona

- El enlace `/` se convierte en un código QR y se coloca en las mesas o se comparte con clientes.
- El enlace `/cocina.html` se instala como acceso directo en la tablet de cocina.
- El enlace `/reportes.html` se entrega únicamente al dueño o administrador.

El panel de reportes está protegido obligatoriamente con usuario y contraseña mediante `REPORT_USER` y `REPORT_PASSWORD`. Si no se configuran, el panel queda bloqueado. Antes de publicar, configura ambas variables de entorno con valores seguros. Nunca compartas las credenciales del panel administrativo con clientes finales. El acceso de cocina no permite entrar a reportes ni a las APIs administrativas.

## Arquitectura

Los tres enlaces usan el mismo servidor y los mismos datos del restaurante: `menu.json`, `orders.json`, `kitchen.json` y, si se configura, Supabase. El menú público crea pedidos, cocina cambia sus estados y administración consulta ventas y configura el menú.

BALDIRIS central administra el negocio desde otra aplicación y no se entrega como parte del acceso diario del restaurante:

```text
BALDIRIS central -> http://localhost:8080
Aplicativo K.E. Chicharrón -> http://localhost:3000
```