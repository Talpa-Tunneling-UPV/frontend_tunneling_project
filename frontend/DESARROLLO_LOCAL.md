# Desarrollo Local - Frontend

## Configuración para desarrollo sin Docker

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o yarn
- Backend ejecutándose en `localhost:8000`

### Configuración de Variables de Entorno

Crea un archivo `.env.local` en la carpeta `frontend/app/` con el siguiente contenido:

```env
VITE_BACKEND_URL=http://localhost:3000
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000/ws
```

### Instalación de Dependencias

```bash
cd frontend/app
npm install
```

### Ejecutar en Modo Desarrollo

```bash
# Opción 1: Desarrollo normal
npm run dev

# Opción 2: Desarrollo con configuración específica para local
npm run dev:local
```

El frontend estará disponible en: `http://localhost:3000`

### Configuración Automática

El proyecto ya está configurado con:

1. **Proxy en Vite**: Las peticiones a `/api` y `/ws` se redirigen automáticamente al backend local
2. **Variables de entorno**: Configuradas para apuntar al servidor local
3. **Hot reload**: Los cambios se reflejan inmediatamente sin necesidad de reiniciar

### Notas Importantes

- Asegúrate de que el backend esté ejecutándose en el puerto 8000
- El frontend se ejecutará en el puerto 3000
- Los cambios en el código se reflejarán automáticamente
- No necesitas Docker para el desarrollo del frontend

### Solución de Problemas

Si tienes problemas de conexión con el backend:
1. Verifica que el backend esté ejecutándose en `localhost:8000`
2. Revisa que no haya conflictos de puertos
3. Asegúrate de que las variables de entorno estén correctamente configuradas

### Volver a Docker

Si quieres volver a usar Docker, simplemente ejecuta:
```bash
docker-compose up
```
