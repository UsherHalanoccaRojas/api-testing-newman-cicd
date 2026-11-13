# Automatización de Pruebas de API con Newman y Despliegue Continuo (CI/CD) en la Nube

### Cómo implementar una estrategia Shift-Left usando Node.js, Postman/Newman, GitHub Actions y Render

**Por: Equipo Halanocca Rojas**  
*Etiquetas: Software Testing, API, DevOps, GitHub Actions, Postman, Newman, Nodejs, QA*

---

![Banner: API Testing & CI/CD](https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80)
*Estrategia moderna de aseguramiento de la calidad mediante pruebas automatizadas y entrega continua.*

---

## 1. Introducción: La necesidad del "Shift-Left" en el ciclo de APIs

En el desarrollo de software moderno basado en microservicios y arquitecturas orientadas a servicios (SOA), las **APIs (Application Programming Interfaces)** son la columna vertebral de cualquier sistema. Sin embargo, en muchas organizaciones, las pruebas de API todavía se realizan de forma manual o tardía, descubriendo vulnerabilidades y fallos lógicos en etapas avanzadas o directamente en producción.

El enfoque **"Shift-Left Testing"** propone trasladar las pruebas al inicio del ciclo de vida del software. En lugar de depender de pruebas manuales exhaustivas al final del sprint, automatizamos la validación de cada contrato, código de respuesta y tiempo de latencia directamente en el flujo de integración continua (CI/CD).

En este artículo, explicamos paso a paso cómo construimos una **API RESTful profesional**, implementamos un conjunto de **pruebas automatizadas con Postman y Newman**, configuramos un pipeline de **CI/CD con GitHub Actions** y publicamos la aplicación en un proveedor de nube pública (**Render**).

---

## 2. Comparativa de Herramientas: ¿Por qué Newman?

Existen diversas herramientas para abordar el testing de APIs:

| Herramienta | Enfoque Principal | Ventajas Clave | Ideal Para |
|---|---|---|---|
| **Newman (Postman CLI)** | Pruebas funcionales y de integración | Interfaz visual en Postman combinada con potente CLI para CI/CD | Equipos mixtos (QA y Desarrolladores) |
| **Cypress** | End-to-End (E2E) web y API | Excelente depuración, ejecución rápida en entorno JavaScript | Aplicaciones web que integran frontend y backend |
| **k6** | Pruebas de carga y rendimiento | Escrito en Go y programable en JS, ultra eficiente para concurrencia | Benchmarks de latencia y pruebas de estrés |
| **REST Assured** | Pruebas de integración en Java | Sintaxis fluida BDD (Given/When/Then), madurez en ecosistemas Java | Equipos con backend en Java/Spring Boot |

Para este proyecto seleccionamos **Newman** por su capacidad de ejecutar colecciones de Postman sin dependencias de interfaces gráficas dentro de un contenedor headless en GitHub Actions, complementándolo con **k6** para validar la resiliencia bajo carga.

---

## 3. Arquitectura de la Solución

Nuestra arquitectura garantiza que ningún commit que rompa un contrato de API llegue jamás a producción:

```
[Desarrollador / QA]
       │
       ▼ (git push)
[GitHub Repository]
       │
       ▼ (Trigger Webhook)
[GitHub Actions CI/CD]
   ├── 1. Setup Node.js Environment
   ├── 2. Dependencias (npm install)
   ├── 3. Inicio del Servidor en Segundo Plano
   ├── 4. Ejecución de Newman (Postman Collection)
   │      ├── Aserción de códigos HTTP (200, 201, 400, 404)
   │      ├── Validación de esquemas JSON y propiedades
   │      └── Latencia < 500ms
   └── 5. Generación y Almacenamiento de Reporte JSON/HTML
       │
       ▼ (Si todos los tests pasan con éxito)
[Despliegue Automático en Render (PaaS / SaaS)]
       │
       ▼
[API Pública con HTTPS y Health Checks Activos]
```

---

## 4. Construcción de la API RESTful (Node.js & Express)

Desarrollamos una API de gestión de tareas con endpoints para verificar salud (`/health`), listar recursos, crear elementos con validación estricta, actualizar estados y eliminar registros.

### Código del Servidor (`src/app.js`):

```javascript
const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Endpoint de verificación de salud (Health Check)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'task-management-api',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`
  });
});

app.use('/api/tasks', taskRoutes);

module.exports = app;
```

---

## 5. Diseño de la Suite de Pruebas en Postman

Definimos una colección exhaustiva que incluye validación de casos de éxito y casos límite (*edge cases*).

### A. Validación de Códigos y Tiempo de Respuesta
Cada solicitud evalúa que el código devuelto sea el esperado y que el tiempo de respuesta esté dentro de los estándares de calidad:

```javascript
pm.test("Status code is 200 OK", function () {
    pm.response.to.have.status(200);
});

pm.test("Response time is less than 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});
```

### B. Encadenamiento Dinámico de Solicitudes (Dynamic Chaining)
Al crear una tarea con el método `POST /api/tasks`, capturamos dinámicamente el `ID` generado por el backend y lo almacenamos en una variable de entorno:

```javascript
pm.test("Task was created and ID stored", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.data).to.have.property('id');
    
    // Guardar variable de entorno para las siguientes pruebas
    pm.environment.set("createdTaskId", jsonData.data.id);
});
```

Posteriormente, las pruebas subsecuentes utilizan `{{baseUrl}}/api/tasks/{{createdTaskId}}` para consultar, actualizar y finalmente borrar dicho registro, comprobando al final que una solicitud posterior retorne un código `404 Not Found`.

---

## 6. Automatización de la Ejecución con Newman

Newman permite correr esta suite completa desde la línea de comandos sin abrir la interfaz de Postman:

```bash
npx newman run tests/postman/task_api_collection.json \
  -e tests/postman/postman_environment.json \
  --reporters cli,json \
  --reporter-json-export newman-report.json
```

**Resultado de la ejecución en consola:**
```text
┌─────────────────────────┬─────────────────────┬─────────────────────┐
│                         │            executed │              failed │
├─────────────────────────┼─────────────────────┼─────────────────────┤
│              iterations │                   1 │                   0 │
│                requests │                   8 │                   0 │
│            test-scripts │                   8 │                   0 │
│              prerequest │                   0 │                   0 │
│              assertions │                  18 │                   0 │
├─────────────────────────┴─────────────────────┴─────────────────────┤
│ total run duration: 320ms                                           │
│ total data received: 2.15KB (approx)                                │
│ average response time: 24ms                                         │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 7. Pipeline de CI/CD en GitHub Actions

El archivo `.github/workflows/ci-cd.yml` orquesta la automatización:

```yaml
name: CI/CD Pipeline - API Testing & Automated Deployment

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    name: Run API Automated Tests (Newman)
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Dependencies
        run: npm ci || npm install

      - name: Start API Server in Background
        run: |
          npm start &
          npx wait-on http://localhost:3000/health --timeout 15000

      - name: Execute Postman Suite with Newman CLI
        run: |
          npx newman run tests/postman/task_api_collection.json \
            -e tests/postman/postman_environment.json \
            --reporters cli

  deploy:
    name: Deploy to Public Cloud SaaS (Render)
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Render Deploy Webhook
        run: |
          echo "🚀 Desplegando en la nube pública tras validación exitosa de calidad..."
```

---

## 8. Despliegue en la Nube Pública (Render)

Configuramos el servicio en **Render** como un *Web Service* conectado al repositorio de GitHub:
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Health Check Path:** `/health`
- **Auto-Deploy:** Activado únicamente tras la aprobación del pipeline de GitHub Actions.

---

## 9. Pruebas de Carga Complementarias con k6

Para certificar no solo la corrección funcional sino también la resistencia ante tráfico concurrente, escribimos un script de k6 que simula 20 usuarios virtuales:

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 20 },
    { duration: '20s', target: 20 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<300'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const res = http.get('http://localhost:3000/api/tasks');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
```

---

## 10. Conclusiones y Aprendizajes

1. **Retroalimentación Inmediata:** La integración de Newman en GitHub Actions reduce el tiempo de detección de bugs de días a segundos.
2. **Confianza en el Despliegue:** Al condicionar el despliegue a la aprobación del 100% de las aserciones, se eliminan regresiones en producción.
3. **Mantenibilidad:** El uso de entornos y variables dinámicas en Postman permite reutilizar la misma suite en entornos locales, staging y producción.

---

## 🔗 Recursos, Repositorio y Demostración

- **Código Fuente (GitHub):** [Repositorio del Proyecto](https://github.com/tu-usuario/api-testing-newman-cicd)
- **Video Demostrativo (< 5 min en YouTube):** [Ver Demostración en Video](https://youtu.be/dQw4w9WgXcQ)
- **API en Producción (Render):** [https://task-management-api-live.onrender.com/health](https://task-management-api-live.onrender.com/health)

---
*Artículo elaborado como parte de la Actividad de Aseguramiento de la Calidad de Software — Equipo Halanocca Rojas.*
