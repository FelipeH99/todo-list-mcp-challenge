#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { TodoListsService } from '../todo_lists/todo_lists.service.js';
import { TodoItemsService } from '../todo_items/todo_items.service.js';

/**
 * Servidor MCP para gestión de TodoLists y TodoItems
 * Expone herramientas para interactuar con listas de tareas mediante lenguaje natural
 */

class TodoMCPServer {
  private server: Server;
  private todoListsService: TodoListsService;
  private todoItemsService: TodoItemsService;

  constructor() {
    this.server = new Server(
      {
        name: 'todo-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Inicializar servicios
    this.todoListsService = new TodoListsService();
    this.todoItemsService = new TodoItemsService();

    this.setupTools();
    this.setupHandlers();
  }

  private setupTools() {
    // Herramienta para listar todas las listas de tareas
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'list_todo_lists',
            description: 'Lista todas las listas de tareas disponibles',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'create_todo_list',
            description: 'Crear una nueva lista de tareas',
            inputSchema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Nombre de la nueva lista de tareas',
                },
              },
              required: ['name'],
            },
          },
          {
            name: 'create_todo_item',
            description: 'Crear un nuevo ítem en una lista específica',
            inputSchema: {
              type: 'object',
              properties: {
                listName: {
                  type: 'string',
                  description: 'Nombre de la lista donde crear el ítem',
                },
                description: {
                  type: 'string',
                  description: 'Descripción del ítem a crear',
                },
                completed: {
                  type: 'boolean',
                  description: 'Si el ítem está completado (opcional, por defecto false)',
                  default: false,
                },
              },
              required: ['listName', 'description'],
            },
          },
          {
            name: 'list_todo_items',
            description: 'Listar todos los ítems de una lista específica',
            inputSchema: {
              type: 'object',
              properties: {
                listName: {
                  type: 'string',
                  description: 'Nombre de la lista de la cual obtener los ítems',
                },
              },
              required: ['listName'],
            },
          },
          {
            name: 'update_todo_item',
            description: 'Actualizar la descripción de un ítem existente',
            inputSchema: {
              type: 'object',
              properties: {
                itemId: {
                  type: 'number',
                  description: 'ID del ítem a actualizar',
                },
                description: {
                  type: 'string',
                  description: 'Nueva descripción del ítem',
                },
              },
              required: ['itemId', 'description'],
            },
          },
          {
            name: 'complete_todo_item',
            description: 'Marcar un ítem como completado',
            inputSchema: {
              type: 'object',
              properties: {
                itemId: {
                  type: 'number',
                  description: 'ID del ítem a marcar como completado',
                },
              },
              required: ['itemId'],
            },
          },
          {
            name: 'delete_todo_item',
            description: 'Eliminar un ítem de una lista',
            inputSchema: {
              type: 'object',
              properties: {
                itemId: {
                  type: 'number',
                  description: 'ID del ítem a eliminar',
                },
              },
              required: ['itemId'],
            },
          },
        ],
      };
    });
  }

  private setupHandlers() {
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'list_todo_lists':
            return this.handleListTodoLists();

          case 'create_todo_list':
            return this.handleCreateTodoList(args);

          case 'create_todo_item':
            return this.handleCreateTodoItem(args);

          case 'list_todo_items':
            return this.handleListTodoItems(args);

          case 'update_todo_item':
            return this.handleUpdateTodoItem(args);

          case 'complete_todo_item':
            return this.handleCompleteTodoItem(args);

          case 'delete_todo_item':
            return this.handleDeleteTodoItem(args);

          default:
            throw new Error(`Tool ${name} no encontrado`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
        };
      }
    });
  }

  private async handleListTodoLists() {
    const lists = this.todoListsService.all();
    return {
      content: [
        {
          type: 'text',
          text: `Listas de tareas disponibles:\n${lists.map(list => `- ${list.name} (ID: ${list.id})`).join('\n') || 'No hay listas disponibles'}`,
        },
      ],
    };
  }

  private async handleCreateTodoList(args: any) {
    const { name } = args;
    const newList = this.todoListsService.create({ name });
    return {
      content: [
        {
          type: 'text',
          text: `Lista de tareas "${newList.name}" creada exitosamente con ID: ${newList.id}`,
        },
      ],
    };
  }

  private async handleCreateTodoItem(args: any) {
    const { listName, description, completed = false } = args;
    
    // Buscar la lista por nombre
    const lists = this.todoListsService.all();
    const list = lists.find(l => l.name.toLowerCase() === listName.toLowerCase());
    
    if (!list) {
      throw new Error(`Lista "${listName}" no encontrada`);
    }

    const newItem = this.todoItemsService.create({
      listId: list.id,
      description,
      completed,
    });

    return {
      content: [
        {
          type: 'text',
          text: `Ítem "${newItem.description}" creado exitosamente en la lista "${listName}" con ID: ${newItem.id}`,
        },
      ],
    };
  }

  private async handleListTodoItems(args: any) {
    const { listName } = args;
    
    // Buscar la lista por nombre
    const lists = this.todoListsService.all();
    const list = lists.find(l => l.name.toLowerCase() === listName.toLowerCase());
    
    if (!list) {
      throw new Error(`Lista "${listName}" no encontrada`);
    }

    const items = this.todoItemsService.getItemsByListId(list.id);
    
    if (items.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: `La lista "${listName}" no tiene ítems.`,
          },
        ],
      };
    }

    const itemsText = items.map(item => 
      `- [${item.completed ? 'x' : ' '}] ${item.description} (ID: ${item.id})`
    ).join('\n');

    return {
      content: [
        {
          type: 'text',
          text: `Ítems en la lista "${listName}":\n${itemsText}`,
        },
      ],
    };
  }

  private async handleUpdateTodoItem(args: any) {
    const { itemId, description } = args;
    
    const updatedItem = this.todoItemsService.update(itemId, { description });
    
    return {
      content: [
        {
          type: 'text',
          text: `Ítem con ID ${itemId} actualizado exitosamente. Nueva descripción: "${updatedItem.description}"`,
        },
      ],
    };
  }

  private async handleCompleteTodoItem(args: any) {
    const { itemId } = args;
    
    const completedItem = this.todoItemsService.markAsCompleted(itemId);
    
    return {
      content: [
        {
          type: 'text',
          text: `Ítem "${completedItem.description}" marcado como completado exitosamente.`,
        },
      ],
    };
  }

  private async handleDeleteTodoItem(args: any) {
    const { itemId } = args;
    
    const item = this.todoItemsService.getById(itemId);
    const description = item.description;
    
    this.todoItemsService.delete(itemId);
    
    return {
      content: [
        {
          type: 'text',
          text: `Ítem "${description}" eliminado exitosamente.`,
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Servidor MCP para TodoList iniciado');
  }
}

// Ejecutar el servidor si este archivo se ejecuta directamente
if (require.main === module) {
  const server = new TodoMCPServer();
  server.run().catch(console.error);
} 