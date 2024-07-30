# Dental Health Application 🦷

Esta es una aplicación para la gestión de citas y comunicación entre dentistas y pacientes.

## Requisitos

- Node.js (versión 18 o superior)
- npm (versión 10 o superior)
- MySQL (versión 5.2 o superior)

## Configuración

### Variables de entorno

Para inicializar el servidor, necesitas crear un archivo `.env` en la raíz del proyecto con las siguientes variables de entorno:

```env
PORT=your_port
JWT_SECRET=your_jwt_secret
DATABASE_NAME=YOUR_DATABASE_NAME
DATABASE_USER=YOUR_DATABASE_USER
DATABASE_PASSWORD=YOUR_DATABASE_PASSWORD
DATABASE_HOST=localhost
DATABASE_DIALECT=mysql
```

Asegúrate de reemplazar PORT=**your_port** y otros valores según tus necesidades de configuración.

## Instalación de dependencias
Antes de ejecutar el servidor, debes instalar las dependencias necesarias con el siguiente comando:

```
npm install
```

## Ejecución del servidor
Para iniciar el servidor en modo de desarrollo, utiliza el siguiente comando:

```
npm run dev
```

El servidor se iniciará en el puerto especificado en el archivo `.env`.


## Estructura del proyecto
- `models/`: Contiene los modelos Sequelize.
- `controllers/`: Contiene los controladores de la aplicación.
- `routes/`: Contiene las definiciones de rutas.
- `config/`: Contiene la configuración de la base de datos y otros archivos de configuración.
- `middlewares/`: Contiene los middlewares de la aplicación.

## Documentación en Swagger UI `(En construcción)`
Ejecuta el servidor e ingresar a la siguiente ruta para ingresar a la documentación de la API 
```
http://localhost:5000/api-docs/
```