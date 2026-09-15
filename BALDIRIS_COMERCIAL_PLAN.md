# BALDIRIS — Plan comercial y de entrega

## 1. Entrega mínima del paquete

La entrega mínima debe tener seis componentes funcionales y visibles para el cliente:

1. Sitio público del menú: página web para mostrar el menú y permitir pedir.
2. Panel de cocina: vista interna para cocina con órdenes y preparación.
3. Panel administrativo: vista del negocio para gestionar pedidos, inventario, gastos y reportes.
4. Panel de reportes: acceso privado por usuario y contraseña, separado del acceso de cocina.
5. Activación y desactivación del negocio sin borrar datos: el negocio queda bloqueado por ruta si no está activo.
6. Modelo de datos por proyecto y cliente: cada proyecto mantiene su cliente, permisos y su negocio aislado.

## 2. Ciclo de venta y operación de BALDIRIS

Para vender BALDIRIS y sus proyectos, debemos seguir esta secuencia:

1. Definir el nombre del producto: BALDIRIS.
2. Definir la oferta del servicio: plataforma central para administrar empresas y negocios aislados.
3. Crear el producto base: BALDIRIS POS para el primer negocio K.E. Chicharrón.
4. Crear el paquete de entrega: menú público, cocina, administración y reportes.
5. Crear la operación comercial: precio de instalación, mantenimiento mensual y soporte.
6. Crear la política de acceso por proyecto: activa/desactiva el proyecto del cliente sin perder información.

## 3. Modelo de producto

### Nombre del producto

BALDIRIS es la plataforma central.

K.E. Chicharrón es el primer negocio integrado.

BALDIRIS POS es el primer producto de negocio del sistema.

## 4. Estructura del proyecto

### Proyecto central

- BALDIRIS
- archivo principal: app.js
- estructura web: index.html, styles.css
- administración global

### Proyecto del negocio

- clientes/kechicharron
- public/menu, public/cocina, public/reportes
- server.js
- business.json
- users.json

## 5. Modelo de permisos

Se recomienda separar roles para cada negocio y cliente:

- Super Admin
- Negociación y cierre
- Administrador de negocio
- Cocina
- Empleado

El rol de Negociación y cierre debe estar separado del acceso administrativo central.

## 6. Seguridad

- El panel de reportes debe abrirse sólo con usuario y contraseña.
- El acceso de cocina debe quedarse fuera del panel de reportes.
- El negocio se activa o desactiva sin borrar información.
- Cuando el negocio está inactivo, la ruta del negocio se devuelve como no encontrada o queda bloqueada visualmente.

## 7. Fórmula financiera

El reporte base debe combinar:

- ventas por pedido
- inventario del negocio
- gastos del negocio
- nómina del negocio
- ganancia del mes

Fórmula base:

ganancia = ingresos - gastos - nómina - costo de inventario

## 8. Flujo de activación y desactivación por cliente

Para cada cliente nuevo:

1. Crear su proyecto en BALDIRIS.
2. Crear su cliente y negocio.
3. Guardar el negocio en la base del proyecto, con datos persistidos.
4. Activar el proyecto cuando pague la mensualidad.
5. Desactivar el proyecto cuando no pague, sin borrar los datos.
6. Reactivar el proyecto cuando el cliente vuelva a pagar y continuar con la información intacta.

## 9. Oferta comercial

El modelo de venta debe apoyarse en tres niveles:

1. Implementación del primer negocio.
2. Servicio mensual de soporte y mantenimiento.
3. Creación de nuevos negocios por proyecto.

## 10. Cierre del ciclo de venta

La lógica comercial queda así:

1. Nombre del producto.
2. Organización del proyecto.
3. Separación de roles y negocio.
4. Consolidación de menú, cocina y reportes.
5. Integración de inventario, gastos y utilidad.
6. Activación y desactivación del proyecto por cliente.
