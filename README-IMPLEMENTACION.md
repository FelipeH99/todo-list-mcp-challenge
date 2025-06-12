# TodoList API con Servidor MCP

## 📋 Descripción

Esta es una implementación completa de una API REST para gestión de listas de tareas (TodoList) con integración de **Model Context Protocol (MCP)**. El proyecto permite interactuar con listas y elementos de tareas tanto a través de endpoints REST tradicionales como mediante un servidor MCP que habilita el uso de lenguaje natural.

## 🚀 Características Implementadas

### API REST
- ✅ **TodoLists CRUD** - Gestión completa de listas de tareas
- ✅ **TodoItems CRUD** - Gestión completa de elementos dentro de las listas  
- ✅ **Operaciones avanzadas** - Marcar como completado, filtrar por lista, etc.

### Servidor MCP
- ✅ **7 Tools disponibles** para interacción en lenguaje natural
- ✅ **Integración completa** con la API REST existente
- ✅ **Compatible con Claude Desktop** y otros clientes MCP

## 🛠️ Tecnologías Utilizadas

- **NestJS** - Framework backend moderno
- **TypeScript** - Lenguaje tipado
- **Model Context Protocol SDK** - Para integración MCP
- **Node.js** - Runtime de JavaScript

## 📁 Estructura del Proyecto

```
nestjs-todolist/
├── src/
│   ├── interfaces/           # Interfaces TypeScript
│   │   ├── todo_list.interface.ts
│   │   └── todo_item.interface.ts
│   ├── todo_lists/          # Módulo TodoLists (base)
│   │   ├── dtos/
│   │   ├── todo_lists.controller.ts
│   │   ├── todo_lists.service.ts
│   │   └── todo_lists.module.ts
│   ├── todo_items/          # Módulo TodoItems (nuevo)
│   │   ├── dtos/
│   │   │   ├── create-todo_item.dto.ts
│   │   │   └── update-todo_item.dto.ts
│   │   ├── todo_items.controller.ts
│   │   ├── todo_items.service.ts
│   │   └── todo_items.module.ts
│   ├── mcp/                 # Servidor MCP
│   │   └── mcp-server.ts
│   ├── app.module.ts
│   └── main.ts
├── claude_desktop_config.json  # Configuración para Claude Desktop
└── README-IMPLEMENTACION.md    # Esta documentación
```

## 🔧 Instalación y Configuración

### 1. Clonar e instalar dependencias

```bash
# Si no tienes el proyecto clonado
git clone https://github.com/crunchloop/nestjs-interview.git nestjs-todolist
cd nestjs-todolist

# Instalar dependencias del proyecto base
npm install

# Instalar SDK de MCP
npm install @modelcontextprotocol/sdk zod
```

### 2. Ejecutar la API REST

```bash
# Modo desarrollo
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

La API estará disponible en: `http://localhost:3000`

### 3. Ejecutar el Servidor MCP

```bash
# Modo desarrollo (con ts-node)
npm run mcp

# Modo producción
npm run mcp:build
```

## 📡 Endpoints REST Disponibles

### TodoLists (Listas de Tareas)
- `GET /api/todolists` - Listar todas las listas
- `GET /api/todolists/:id` - Obtener una lista específica
- `POST /api/todolists` - Crear nueva lista
- `PUT /api/todolists/:id` - Actualizar lista
- `DELETE /api/todolists/:id` - Eliminar lista

### TodoItems (Elementos de Tareas)
- `GET /api/todolists/:listId/items` - Listar items de una lista
- `GET /api/items/:id` - Obtener item específico
- `POST /api/todolists/:listId/items` - Crear item en lista
- `PUT /api/items/:id` - Actualizar item
- `PATCH /api/items/:id/complete` - Marcar como completado
- `DELETE /api/items/:id` - Eliminar item

## 🤖 Tools MCP Disponibles

El servidor MCP expone 7 herramientas que permiten interactuar con la API usando lenguaje natural:

1. **`list_todo_lists`** - Lista todas las listas disponibles
2. **`create_todo_list`** - Crea una nueva lista
3. **`create_todo_item`** - Crea un ítem en una lista específica
4. **`list_todo_items`** - Lista ítems de una lista
5. **`update_todo_item`** - Actualiza la descripción de un ítem
6. **`complete_todo_item`** - Marca un ítem como completado
7. **`delete_todo_item`** - Elimina un ítem

## 🖥️ Configuración en Claude Desktop

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

### 2. Agregar la configuración

```json
{
  "mcpServers": {
    "todo-mcp-server": {
      "command": "npm",
      "args": ["run", "mcp"],
      "cwd": "/ruta/completa/a/nestjs-todolist"
    }
  }
}
```

**Importante:** Reemplaza `/ruta/completa/a/nestjs-todolist` con la ruta absoluta a tu proyecto.

### 3. Reiniciar Claude Desktop

Después de agregar la configuración, reinicia Claude Desktop completamente.

## 💬 Ejemplos de Uso con Claude

Una vez configurado, puedes usar comandos en lenguaje natural como:

```
"Crea una lista llamada 'Trabajo'"

"Agrega un ítem 'Terminar informe' a la lista 'Trabajo'"

"Muestra todos los ítems de la lista 'Trabajo'"

"Marca como completado el ítem con ID 1"

"Actualiza la descripción del ítem 2 a 'Revisar documentación'"
```

## 🧪 Ejemplo de Testing Manual

### Usando la API REST

```bash
# Crear una lista
curl -X POST http://localhost:3000/api/todolists \
  -H "Content-Type: application/json" \
  -d '{"name": "Mi Lista de Trabajo"}'

# Crear un ítem en la lista (asumiendo que el ID de la lista es 1)
curl -X POST http://localhost:3000/api/todolists/1/items \
  -H "Content-Type: application/json" \
  -d '{"description": "Completar documentación", "completed": false}'

# Listar ítems de la lista
curl http://localhost:3000/api/todolists/1/items

# Marcar ítem como completado (asumiendo que el ID del ítem es 1)
curl -X PATCH http://localhost:3000/api/items/1/complete
```

### Usando el Servidor MCP con Inspector

```bash
# Instalar el inspector de MCP
npm install -g @modelcontextprotocol/inspector

# Ejecutar el inspector
npx @modelcontextprotocol/inspector npm run mcp
```

Esto abrirá una interfaz web donde puedes probar las tools interactivamente.

## 🔍 Verificación de Funcionamiento

### 1. Verificar API REST
```bash
curl http://localhost:3000/api/todolists
# Debería devolver: []
```

### 2. Verificar Servidor MCP
En Claude Desktop, debería aparecer un ícono de herramientas y las tools disponibles.

## 📝 Estructura de Datos

### TodoList
```typescript
{
  id: number;
  name: string;
}
```

### TodoItem
```typescript
{
  id: number;
  listId: number;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🚧 Próximos Pasos

- [ ] Agregar persistencia en base de datos
- [ ] Implementar autenticación y autorización
- [ ] Agregar validaciones más robustas
- [ ] Implementar tests unitarios y de integración
- [ ] Dockerizar la aplicación

## 📞 Soporte

Si tienes problemas:

1. Verifica que todas las dependencias estén instaladas
2. Asegúrate de que la ruta en la configuración de Claude Desktop sea correcta
3. Revisa los logs del servidor MCP en la consola
4. Verifica que el puerto 3000 esté disponible para la API REST

## 📄 Licencia

Este proyecto está basado en el template de [crunchloop/nestjs-interview](https://github.com/crunchloop/nestjs-interview) y se usa para propósitos de entrevista técnica.

---

**Implementado por:** [Tu nombre]  
**Fecha:** [Fecha actual]  
**Tecnologías:** NestJS + TypeScript + Model Context Protocol 