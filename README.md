# 🐭 Ratón Pérez - Visualización de Dientes

Una visualización interactiva y tierna sobre el Ratón Pérez que muestra:
- 📊 Contador de dientes recogidos este año
- 🗺️ Mapa mundial con el huso horario que está visitando
- 📈 Gráfico de barras con niños por huso horario
- 🦷 Contador de dientes cariados

## 🚀 Despliegue en GitHub Pages

Este proyecto está configurado para desplegarse automáticamente en GitHub Pages.

### Configuración inicial

1. **Habilita GitHub Pages en tu repositorio:**
   - Ve a Settings → Pages
   - En "Source", selecciona "GitHub Actions"

2. **El workflow se ejecutará automáticamente:**
   - Cada vez que hagas push a `main` o `master`
   - O manualmente desde la pestaña "Actions"

3. **Tu sitio estará disponible en:**
   - `https://[tu-usuario].github.io/[nombre-del-repo]/`

### Desarrollo local

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

### Notas importantes

- El proyecto usa export estático de Next.js
- Las imágenes están desoptimizadas para compatibilidad con GitHub Pages
- El `basePath` se configura automáticamente según el nombre del repositorio

## 🛠️ Tecnologías

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- MapLibre GL
- Recharts
- PapaParse

## 📝 Licencia

Hecho con ❤️ para todos los niños que esperan al Ratón Pérez
