# coin-gecko

API donde se pueden crear usuarios, agregar criptomonedas favoritas y consultar un top de las mismas.
Para la informacion de criptomonedas consume la API: https://www.coingecko.com/en.
Para la informacion de los usuarios tiene una base de datos en MongoDB.

## Levantar el proyecto

Primero hay que completar los datos sensibles en la carpeta config como el nombre de la DB, la conexion con la misma, el puerto y la key para JSON Web Token y luego renombrar ambos archivos sacando el .example.

Y luego por terminal en la carpeta raiz correr estos comandos

```bash
yarn install

yarn tsc

yarn start
```

## Endpoints

### Usuarios

-   [POST] /auth/register:
    Espera firstname, lastname, username, password, currency (puede ser uno de estos valores: ars, usd, eur)

-   [POST] /auth/login:
    Espera username y password y devuelve un token de JSON Web Token

-   [POST] /auth/logout:
    Solo con el token desloguea al usuario y elimina el token de la DB

### Monedas

-   [GET] /coins:
    Solo necesita el token de un usuario logueado porque muestra el precio de las monedas en la divisa favorita del usuario

-   [GET] /coins/top:
    Solo necesita el token del usuario logueado

-   [POST] /coins/favorites/:id:
    Espera el token del usuario logueado y el id de la moneda que se quiere agregar a favoritos. Ej /coins/favorites/bitcoin
