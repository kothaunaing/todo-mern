import { create } from "zustand";
import api from "../api/axios";
import { getBearerToken } from "../utils/utils";

interface Todo {
  id: string;
  text: string;
  user_id: number;
  completed: number;
}

interface TodosRes {
  success: boolean;
  total_todos: number;
  totalPages: number;
  page: number;
  todos: Todo[];
}

interface TodoState {
  todoRes: TodosRes | null;
  todos: Todo[];
  loadingTodos: boolean;
  addingTodo: boolean;

  getTodos: () => Promise<void>;
  addTodo: (text: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  updateTodo: (
    id: string,
    data: { text?: string; completed?: boolean }
  ) => Promise<void>;
}

const useTodoStore = create<TodoState>((set, get) => ({
  todoRes: null,
  todos: [],
  loadingTodos: false,
  addingTodo: false,
  updatingTodo: false,

  getTodos: async () => {
    try {
      set({ loadingTodos: true });
      const res = await api.get<TodosRes>("/todo/all-todos", {
        headers: {
          ...getBearerToken(),
        },
      });
      // console.log(res.data);

      set({ todos: res.data.todos, todoRes: res.data });
    } catch (error: any) {
      console.log("Error in getTodos: " + error);
    } finally {
      set({ loadingTodos: false });
    }
  },
  addTodo: async (text) => {
    try {
      set({ addingTodo: true });
      const res = await api.post(
        "/todo/add",
        { text },
        { headers: { ...getBearerToken() } }
      );
      const { todos } = get();

      todos.push(res.data.todo);

      set({ todos: todos });
    } catch (error: any) {
      console.log("Error in addTodo: " + error);
    } finally {
      set({ addingTodo: false });
    }
  },
  deleteTodo: async (id) => {
    await api.delete(`/todo/${id}`, { headers: { ...getBearerToken() } });
    const newTodos = get().todos.filter((todo) => todo.id !== id);
    set({ todos: newTodos });
  },
  updateTodo: async (id, data) => {
    const res = await api.put(`/todo/${id}`, data, {
      headers: { ...getBearerToken() },
    });

    set({
      todos: get().todos.map((todo) => {
        if (id === todo.id) {
          return res.data.todo;
        }

        return todo;
      }),
    });
  },
}));

export default useTodoStore;
