# 📝 TodoList API + MCP Server

Una API REST completa para gestión de listas de tareas con servidor MCP que permite interacción mediante **lenguaje natural** con Claude Desktop.

## 🚀 Inicio Rápido

### 1. Instalación

```bash
# Clonar el repositorio
git clone https://github.com/FelipeH99/todo-list-mcp-challenge.git
cd todo-list-mcp-challenge

# Instalar dependencias
npm install
npm install @modelcontextprotocol/sdk zod
```

### 2. Ejecutar la API REST

```bash
# Iniciar en modo desarrollo
npm run start:dev
```

✅ **API disponible en:** `http://localhost:3000`

### 3. Ejecutar el Servidor MCP

Con el siguiente comando compila el proyecto (esto genera los archivos necesarios en la carpeta dist/) y luego lo ejecuta:

```bash
npm run mcp:build
```

✅ **Servidor MCP listo para Claude Desktop**

## 🤖 Configurar Claude Desktop

### 1. Encontrar el archivo de configuración

**Windows:**

```
%APPDATA%\Claude\claude_desktop_config.json
```

**macOS:**

```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Linux:**

```
~/.config/claude/claude_desktop_config.json
```

### 2. Agregar esta configuración:

```json
    "todo-mcp-server": {
      "command": "node",
      "args": ["Tu-ruta/todo-list-mcp-challenge/dist/mcp/mcp-server.js"]
    }
```

⚠️ **Importante:** Cambiar `C:\\ruta\\completa\\a\\tu\\proyecto\\tdist/mcp/mcp-server.js` por la ruta real de tu proyecto.

### 3. Reiniciar Claude Desktop

## 💬 Ejemplos de Uso

### Con Claude Desktop (Lenguaje Natural)

Una vez configurado, puedes usar estos comandos:

```
🗣️ "Crea una lista llamada 'Trabajo'"

🗣️ "Agrega un ítem 'Terminar informe' a la lista 'Trabajo'"

🗣️ "Muestra todos los ítems de la lista 'Trabajo'"

🗣️ "Marca como completado el ítem con ID 1"

🗣️ "Actualiza la descripción del ítem 2 a 'Revisar documentación'"

🗣️ "Elimina el ítem con ID 1"
```

### Con API REST (HTTP)

```bash
# 1. Crear una lista
curl -X POST http://localhost:3000/api/todolists \
  -H "Content-Type: application/json" \
  -d '{"name": "Mi Lista Personal"}'

# Respuesta: {"id": 1, "name": "Mi Lista Personal"}

# 2. Crear un ítem en la lista
curl -X POST http://localhost:3000/api/todolists/1/items \
  -H "Content-Type: application/json" \
  -d '{"description": "Comprar comida", "completed": false}'

# 3. Ver ítems de la lista
curl http://localhost:3000/api/todolists/1/items

# 4. Marcar ítem como completado
curl -X PATCH http://localhost:3000/api/items/1/complete

# 5. Ver todas las listas
curl http://localhost:3000/api/todolists
```

## 📡 Endpoints Disponibles

### 📋 Listas de Tareas

| Método   | URL                  | Descripción              |
| -------- | -------------------- | ------------------------ |
| `GET`    | `/api/todolists`     | Listar todas las listas  |
| `GET`    | `/api/todolists/:id` | Obtener lista específica |
| `POST`   | `/api/todolists`     | Crear nueva lista        |
| `PUT`    | `/api/todolists/:id` | Actualizar lista         |
| `DELETE` | `/api/todolists/:id` | Eliminar lista           |

### ✅ Elementos de Tareas

| Método   | URL                            | Descripción             |
| -------- | ------------------------------ | ----------------------- |
| `GET`    | `/api/todolists/:listId/items` | Ítems de una lista      |
| `GET`    | `/api/items/:id`               | Obtener ítem específico |
| `POST`   | `/api/todolists/:listId/items` | Crear ítem en lista     |
| `PUT`    | `/api/items/:id`               | Actualizar ítem         |
| `PATCH`  | `/api/items/:id/complete`      | Marcar como completado  |
| `DELETE` | `/api/items/:id`               | Eliminar ítem           |

## 🛠️ Herramientas MCP

El servidor MCP expone 7 herramientas:

1. **`list_todo_lists`** - Lista todas las listas disponibles
2. **`create_todo_list`** - Crea una nueva lista de tareas
3. **`create_todo_item`** - Crea un ítem en una lista específica
4. **`list_todo_items`** - Lista todos los ítems de una lista
5. **`update_todo_item`** - Actualiza la descripción de un ítem
6. **`complete_todo_item`** - Marca un ítem como completado
7. **`delete_todo_item`** - Elimina un ítem

## 🧪 Probar con el Inspector MCP

Para probar las herramientas MCP sin Claude Desktop:

```bash
# Instalar el inspector
npm install -g @modelcontextprotocol/inspector

# Ejecutar
npx @modelcontextprotocol/inspector npm run mcp
```

Esto abre una interfaz web donde puedes probar todas las herramientas.

## 📝 Estructura de Datos

### TodoList

```json
{
  "id": 1,
  "name": "Mi Lista"
}
```

### TodoItem

```json
{
  "id": 1,
  "listId": 1,
  "description": "Mi tarea",
  "completed": false,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

## 🔍 Verificar que Todo Funcione

### 1. API REST

```bash
curl http://localhost:3000/api/todolists
# Debería devolver: []
```

### 2. Servidor MCP

En Claude Desktop, deberías ver un ícono de herramientas (🔧) en la esquina superior derecha.

### 3. Prueba completa

```bash
# Terminal 1: API REST
npm run start:dev

# Terminal 2: Servidor MCP
npm run mcp

# Claude Desktop: "Lista todas mis listas de tareas"
```

## ❓ Solución de Problemas

### No se encuentra archivo claude_desktop.json

- En una terminal ejecutar el siguiente comando: curl -fsSL https://raw.githubusercontent.com/wonderwhy-er/DesktopCommanderMCP/refs/heads/main/install.sh | bash
- Luego de instalado esto, reinicia Claude y en settings/Integrstions deberia aparecer la integracion con Desktop comander y se deberia haber creado el archivo claude_desktop_config.json en "/Library/Application Support/Claude/claude_desktop_config.json
- Edita este archivo agregandole lo siguiente en el grupo mcp_servers:
  ",
  "todo-mcp-server": {
  "command": "node",
  "args": ["Tu-ruta/todo-list-mcp-challenge/dist/mcp/mcp-server.js"]
  } "

### Error: "Tool not found"

- Verifica que el servidor MCP esté ejecutándose
- Reinicia Claude Desktop completamente

### Error: "Cannot connect to server"

- Verifica la ruta en `claude_desktop_config.json`
- Asegúrate de que `npm run mcp` funcione en esa ruta

### Error: "Port 3000 already in use"

```bash
# Cambiar puerto en src/main.ts
await app.listen(3001);
```

### Claude Desktop no muestra herramientas

- Verifica que el archivo de configuración esté en la ubicación correcta
- Revisa que la sintaxis JSON sea válida
- Reinicia Claude Desktop después de cada cambio

## 📚 Más Información

- **Documentación técnica:** `README-IMPLEMENTACION.md`
- **Entregable completo:** `ENTREGABLE.md`
- **Model Context Protocol:** https://modelcontextprotocol.io
- **Ejemplo MCP de Crunchloop:** https://github.com/crunchloop/mcp-teamtailor
- **Front-end disponible para Usar la Api Restfull en https://github.com/FelipeH99/Todo-list-FE.git**
