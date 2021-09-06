# coin-gecko

API donde se pueden crear usuarios, agregar criptomonedas favoritas y consultar un top de las mismas.
Para la informacion de criptomonedas consume la API: https://www.coingecko.com/en.
Para la informacion de los usuarios tiene una base de datos en MongoDB.

## Levantar el proyecto

Primero hay que completar los datos sensibles en la carpeta config como el nombre de la DB, la conexion con la misma, el puerto y la key para JSON Web Token y luego renombrar ambos archivos sacando el .example.
IMPORTANTE: Hay un archivo para testing y otro para desarrollo, la base de datos para testing no debe ser la misma que para desarrollo porque para que los tests puedan correr en un ambiente aislado al finalizar el test se elimina la base de testing.

Y luego por terminal en la carpeta raiz correr estos comandos

```bash
yarn install

yarn tsc

yarn start
```

## Tests

Para correr los tests hay dos comandos, uno general y otro especifico para correr un solo test.
Al correr los tests automaticamente toma el entorno de testing que debe estar completo en la carpeta config.

```bash
yarn test

yarn test register
```

## Endpoints

### Usuarios

-   [POST] /auth/register:
    Espera firstname, lastname, username, password, currency (puede ser 0 para euros, 1 para dolares o 2 para pesos argentinos).

-   [POST] /auth/login:
    Espera username y password y devuelve un token de JSON Web Token.

-   [POST] /auth/logout:
    Solo con el token desloguea al usuario y elimina el token de la DB.

### Monedas

-   [GET] /coins/:page:
    Solo necesita el token de un usuario logueado porque muestra el precio de las monedas en la divisa favorita del usuario. El parametro page es opcional y fija el numero de pagina que se muestra, el endpoint envia de a 100 monedas.

-   [GET] /coins/top/:number:
    Solo necesita el token del usuario logueado. El parametro de number es opcional y fija el maximo de monedas que se muestran, puede ir del 1 al 25, si no se envia el defecto es 25.

-   [POST] /coins/favorites/:id:
    Espera el token del usuario logueado y el id de la moneda que se quiere agregar a favoritos. Ej /coins/favorites/bitcoin.
