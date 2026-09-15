# Guía de BALDIRIS

## Producto

BALDIRIS es una plataforma tecnológica empresarial para administrar la empresa central y múltiples negocios aislados. K.E. Chicharrón es el primer negocio integrado y BALDIRIS POS es el primer producto.

## Arquitectura actual

El prototipo inicial es una aplicación estática formada por `index.html`, `styles.css` y `app.js`. La interfaz separa la capa administrativa, los negocios y el POS. La siguiente evolución debe incorporar backend, autenticación real y una base de datos compartida con `business_id` en las entidades de negocio.

## Reglas

- Mantener la marca escrita exactamente como `BALDIRIS`.
- No mezclar registros entre negocios; cada entidad de negocio debe tener contexto de tenant.
- No guardar secretos, contraseñas reales ni credenciales de producción en el código.
- Validar entradas y proteger rutas en backend antes de publicar.
- Probar cada módulo antes de integrarlo.
- Mantener la separación futura entre frontend, backend, autenticación, servicios y base de datos.

## Flujo local

Abrir `index.html` directamente o usar un servidor estático. Las credenciales del prototipo están documentadas en `README.md` y no deben reutilizarse en producción.