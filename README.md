# 🚀 API Testing Automatizado con Newman (Postman CLI) & CI/CD en GitHub Actions

> **Proyecto:** Evaluación y Automatización de Calidad de Software (CS)  
> **Integrantes:** Halanocca Rojas y Equipo  
> **Tecnologías:** Node.js, Express, Postman, Newman, k6, GitHub Actions, Render Cloud

---

## 📌 1. Descripción del Proyecto

Este repositorio contiene una **API RESTful de Gestión de Tareas (Task Management API)** desarrollada con Node.js y Express, diseñada específicamente para implementar y demostrar prácticas profesionales de **Aseguramiento de Calidad (QA) y Testing de APIs**.

El flujo de trabajo incluye:
1. **Pruebas Funcionales Automatizadas:** Cobertura de endpoints CRUD mediante colecciones de Postman ejecutadas vía **Newman**.
2. **Pruebas de Rendimiento y Carga:** Script en **k6** para evaluar latencia (P95 < 300ms) y resistencia bajo usuarios concurrentes.
3. **Pipeline de Integración y Despliegue Continuo (CI/CD):** Automatización completa con **GitHub Actions** que ejecuta las pruebas antes de permitir cualquier despliegue.
4. **Despliegue en la Nube Pública (SaaS/PaaS):** Publicación en **Render** con verificación automática de disponibilidad (*Health Checks*).

---

## 🏗️ 2. Arquitectura de la Solución

```
+-------------------------------------------------------------+
|                     Desarrollador / QA                     |
+-------------------------------------------------------------+
                              | git push
                              v
+-------------------------------------------------------------+
|                   GitHub Repository (main)                  |
+-------------------------------------------------------------+
                              | triggers
                              v
+-------------------------------------------------------------+
|              GitHub Actions CI/CD Pipeline                  |
|  1. Setup Node.js                                           |
|  2. npm install                                             |
|  3. Start API Server (Background)                           |
|  4. Run Newman Test Suite (8 assertions pass)               |
|  5. Upload Test Artifacts (JSON / HTML Reports)             |
+-------------------------------------------------------------+
                              | Success
                              v
+-------------------------------------------------------------+
|            Cloud Deployment (Render SaaS / PaaS)            |
|  - Web Service activo con HTTPS público                     |
|  - Auto-deploy habilitado tras pasar tests                  |
+-------------------------------------------------------------+
```

---

## 📂 3. Estructura del Repositorio

```
AG02_CS_HALANOCCA_ROJAS/
├── .github/
│   └── workflows/
│       └── ci-cd.yml             # Pipeline automatizado de GitHub Actions
├── src/
│   ├── app.js                    # Configuración de Express y middlewares
│   ├── server.js                 # Inicialización del servidor HTTP
│   └── routes/
│       └── taskRoutes.js         # Endpoints CRUD con validación de datos
├── tests/
│   ├── postman/
│   │   ├── task_api_collection.json    # Suite de pruebas Postman (CRUD + Casos de error)
│   │   └── postman_environment.json   # Variables de entorno dinámicas
│   └── k6/
│       └── load_test.js          # Pruebas de carga y estrés
├── render.yaml                   # Infraestructura como código (IaC) para Render
├── package.json                  # Dependencias y scripts
├── ARTICULO_MEDIUM.md            # Artículo técnico completo para Medium
├── GUIA_VIDEO_5MIN.md            # Guion detallado para video de YouTube (< 5 min)
├── MENSAJE_TELEGRAM.md           # Plantilla para envío de enlaces al grupo de Telegram
└── ENLACES_ENTREGA.txt           # Consolidado de enlaces
```

---

## ⚙️ 4. Instalación y Ejecución Local

### Prerrequisitos
- Node.js >= 18.x
- Git

### Pasos
```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPOSITORIO_PUBLICO>
cd AG02_CS_HALANOCCA_ROJAS

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor
npm start
```
La API estará disponible en `http://localhost:3000`.

---

## 🧪 5. Ejecución de Pruebas Automatizadas

### A. Pruebas Funcionales con Newman (Postman CLI)
Con el servidor en ejecución en otra terminal:
```bash
npm run test:api
```
**Aserciones cubiertas:**
- Verificación del código de estado HTTP (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`).
- Tiempo de respuesta (`responseTime < 500ms`).
- Validación de esquemas JSON y estructura de propiedades.
- Encadenamiento dinámico: Se captura el `id` de una tarea creada y se usa para consultarla, actualizarla y eliminarla.

### B. Pruebas de Carga con k6
```bash
npm run test:k6
```
- Evalúa 20 usuarios virtuales concurrentes durante 40 segundos.
- Valida que el 95% de las solicitudes tarden menos de 300ms y la tasa de error sea menor a 1%.

---

## 🌐 6. Endpoints de la API

| Método | Endpoint | Descripción | Código Éxito | Código Error |
|--------|----------|-------------|--------------|--------------|
| `GET` | `/health` | Health Check y tiempo de actividad | `200 OK` | - |
| `GET` | `/api/tasks` | Listar todas las tareas (soporta `?status=`) | `200 OK` | - |
| `GET` | `/api/tasks/:id` | Obtener tarea específica | `200 OK` | `404 Not Found`, `400 Bad Request` |
| `POST` | `/api/tasks` | Crear una nueva tarea | `201 Created` | `400 Bad Request` |
| `PUT` | `/api/tasks/:id` | Actualizar estado o título | `200 OK` | `404 Not Found`, `400 Bad Request` |
| `DELETE`| `/api/tasks/:id` | Eliminar tarea | `200 OK` | `404 Not Found`, `400 Bad Request` |

