# 🎬 Guion y Estructura de Video Demostrativo (< 5 Minutos)

**Título sugerido:** *Automatización de API Testing con Newman y CI/CD en GitHub Actions y Render*  
**Plataforma sugerida:** YouTube / TikTok / Facebook  
**Duración máxima:** 4 minutos y 45 segundos  
**Resolución:** 1080p (16:9 para YouTube/FB o 9:16 vertical para TikTok)

---

## ⏱️ Cronograma Minuto a Minuto

| Tiempo | Escena / Pantalla | Acción & Locución (Voz en off) |
|---|---|---|
| **0:00 - 0:40** | **1. Portada e Introducción**<br>Mostrar diapositiva o README con los integrantes del equipo y arquitectura. | *"Hola a todos. En este video mostraremos cómo construir una API REST profesional en Node.js, automatizar sus pruebas de integración con Newman y desplegarla en la nube pública mediante un pipeline de CI/CD en GitHub Actions."* |
| **0:40 - 1:30** | **2. Arquitectura de la API y Endpoints**<br>Mostrar código en VS Code: `src/app.js` y `src/routes/taskRoutes.js`. | *"Nuestra API gestiona tareas con validaciones estrictas y endpoints CRUD completos: health check, creación con validación de campos obligatorios, consulta por ID, actualización y eliminación."* |
| **1:30 - 2:30** | **3. Pruebas Automatizadas con Postman & Newman**<br>Mostrar Postman o la terminal ejecutando `npm run test:api`. | *"Para garantizar la calidad sin intervención manual, diseñamos una suite en Postman con aserciones de código de estado, tiempo de respuesta menor a 500ms y persistencia dinámica de IDs. Al ejecutar Newman por consola, vemos cómo pasa el 100% de los tests."* |
| **2:30 - 3:45** | **4. Pipeline de CI/CD en GitHub Actions**<br>Mostrar la pestaña 'Actions' de GitHub con el workflow ejecutándose en tiempo real. | *"Cada vez que hacemos un `git push` a la rama main, GitHub Actions toma el código, levanta el servidor, ejecuta Newman de manera autónoma y genera los reportes de calidad. Si una prueba falla, el despliegue se bloquea de inmediato."* |
| **3:45 - 4:25** | **5. Despliegue en la Nube Pública (Render)**<br>Mostrar la API corriendo en el dominio público de Render y probando `/health`. | *"Una vez superadas las pruebas, el pipeline activa el despliegue automático en la nube pública de Render. Probamos la URL en vivo y comprobamos que responde con estado 'healthy' y tiempo de actividad óptimo."* |
| **4:25 - 4:45** | **6. Conclusiones y Despedida**<br>Mostrar el artículo publicado en Medium y enlace al repositorio de GitHub. | *"Integrar pruebas en el ciclo de vida del software reduce errores en producción y acelera las entregas. Todos los enlaces al repositorio, artículo en Medium y reportes están en la descripción. ¡Gracias por ver el video!"* |

---

## 💡 Consejos de Grabación
1. **Herramienta de grabación:** OBS Studio o Loom (permite grabar pantalla + cámara simultáneamente).
2. **Audio:** Usar micrófono con cancelación de ruido.
3. **Miniatura / Portada:** Título claro: *"API Testing con Newman + CI/CD en GitHub Actions"*.

