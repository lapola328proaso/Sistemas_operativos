# Taller Entorno Controlado con Docker

**Estudiante:** Juan Manuel Polania Navarro  
**Código:** 2477452  
**Materia:** Sistemas Operativos

---

## Descripción del Proyecto

Entorno controlado basado en contenedores Docker que integra cinco servicios:

1. **Servidor Web Nginx** - Proxy inverso que redirige peticiones al backend
2. **Servidor Node.js** - API REST con Express conectada a PostgreSQL
3. **PostgreSQL** - Base de datos relacional
4. **pgAdmin 4** - Administrador gráfico de la base de datos
5. **Jupyter Lab** - Entorno interactivo para ciencia de datos

Todos los servicios se orquestan con Docker Compose, utilizando redes internas para la comunicacion entre contenedores y volumenes para persistencia de datos.

---

## Requisitos Previos

- Windows 10 u 11 con WSL2 habilitado
- Ubuntu 22.04 LTS instalado en WSL2
- Docker Desktop for Windows con integracion WSL2
- Git

### Verificar instalaciones

```bash
wsl --version
docker --version
docker compose version
git --version
```

---

## Estructura del Proyecto

```
Tarea_SO/
├── .env                  # Variables de entorno
├── .env.example          # Plantilla de variables de entorno
├── docker-compose.yml    # Orquestacion de servicios
├── node-api/
│   ├── Dockerfile        # Imagen personalizada Node.js
│   ├── package.json      # Dependencias de la API
│   └── index.js          # Codigo fuente de la API
├── nginx/
│   ├── nginx.conf        # Configuracion del proxy inverso
│   └── index.html        # Pagina de prueba estatica
├── jupyter/              # Directorio para notebooks
└── README.md             # Documentacion del proyecto
```

---

## Arquitectura del Entorno

```
Navegador Web
      |
      +---> http://localhost:8081  (Pagina HTML estatica)
      |
      +---> http://localhost:8081/api/  (Proxy a Node.js)
      |
      v
  Nginx (puerto 8081)
      |
      v (proxy_pass)
 Node.js API (puerto 3000)
      |
      v (consulta SQL)
 PostgreSQL (puerto 5432)
```

- Los contenedores se comunican a traves de la red `red_servicios` (tipo bridge)
- Los datos de PostgreSQL persisten en el volumen `postgres_data`
- pgAdmin accede via navegador en el puerto 5051
- Jupyter Lab accede via navegador en el puerto 8889

---

## Configuracion de Variables de Entorno

Crear archivo `.env` en la raiz del proyecto:

```env
POSTGRES_USER=juan_user
POSTGRES_PASSWORD=juan_pass_2024
POSTGRES_DB=taller_so_db
NODE_PORT=3000
JUPYTER_TOKEN=juan_taller_2024
```

---

## Pasos de Instalacion y Ejecucion

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd Tarea_SO
```

### 2. Crear archivo .env

Copiar `.env.example` a `.env` y ajustar las variables si es necesario.

### 3. Construir y levantar los servicios

```bash
docker compose up -d
```

### 4. Verificar que todos los contenedores esten activos

```bash
docker compose ps
```

---

## Acceso a los Servicios

| Servicio    | URL                              | Credenciales                     |
|-------------|----------------------------------|----------------------------------|
| Nginx       | http://localhost:8081            | -                                |
| API Node.js | http://localhost:8081/api/       | -                                |
| Node.js     | http://localhost:3000            | -                                |
| pgAdmin     | http://localhost:5051            | juan.polania@correo.com / juanpass2024 |
| Jupyter     | http://localhost:8889            | Token: juan_taller_2024          |
| PostgreSQL  | localhost:5433                   | juan_user / juan_pass_2024       |

---

## Comandos Utiles

### Administracion de contenedores

```bash
# Ver contenedores en ejecucion
docker ps

# Ver logs de un servicio
docker logs node_juan

# Ejecutar comando dentro de un contenedor
docker exec -it postgres_juan psql -U juan_user -d taller_so_db

# Listar redes
docker network ls

# Listar volumenes
docker volume ls

# Detener servicios
docker compose down

# Reiniciar un servicio especifico
docker compose restart node_app
```

### Verificar conectividad

```bash
# Desde el contenedor node_app hacia postgres (requiere iputils instalado)
docker exec node_juan ping -c 3 database

# Probar conexion HTTP a la API localmente
curl http://localhost:8081/api/

# Ver logs de un servicio especifico
docker logs node_juan

# Consultar la base de datos directamente
docker exec -it postgres_juan psql -U juan_user -d taller_so_db -c "SELECT NOW();"
```

---

## Endpoints de la API

### GET /api/
Redirigido por Nginx al servidor Node.js. Responde con el estado de la conexion a PostgreSQL y la hora del servidor.

### GET /api/health
Responde con el estado de salud de la aplicacion.

### GET / (directo)
Accediendo directamente al puerto 3000 de Node.js sin pasar por Nginx.

---

## Evidencias de Funcionamiento

*(Agregar capturas de pantalla segun se ejecuten las pruebas)*

- `docker compose up -d` en terminal
- `docker compose ps` mostrando los 5 contenedores
- Navegador accediendo a http://localhost:8081 (pagina estatica HTML)
- Navegador accediendo a http://localhost:8081/api/ (respuesta JSON de la API)
- pgAdmin conectado a PostgreSQL
- Jupyter Lab con un notebook abierto
- Resultado de `docker logs node_juan`
- Resultado de consulta SQL via `docker exec`
- Resultado de `docker ps`
- Resultado de `docker network ls` y `docker volume ls`

---

## Notas

- Los puertos se han configurado para evitar conflictos con otros servicios locales
- Las credenciales en .env son de prueba; en produccion usar valores seguros
- El archivo .env esta incluido en .gitignore para no exponer credenciales
