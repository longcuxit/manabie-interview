import { IAPI } from "./types";
import { TodoModel, TodoStatus } from "../models/Todo";
import axios from "../utils/axios";
import { AxiosResponse } from "axios";
import { AuthModel } from "models/User";

class ApiFullstack extends IAPI {
  connect(): Promise<boolean> {
    return Promise.resolve(true);
  }
  async createTodo(content: string): Promise<TodoModel> {
    const resp = await axios.post<AxiosResponse<TodoModel>>(`/tasks`, {
      content,
    });

    return resp.data.data;
  }

  async getTodos(): Promise<Array<TodoModel>> {
    const resp = await axios.get<AxiosResponse<Array<TodoModel>>>(`/tasks`);

    return resp.data.data;
  }

  async updateTodoStatus(id: string, status: TodoStatus): Promise<boolean> {
    const resp = await axios.put<AxiosResponse<boolean>>(`/tasks/${id}`, {
      status,
    });

    return resp.data.data;
  }

  async updateTodoContent(id: string, content: string): Promise<boolean> {
    const resp = await axios.put<AxiosResponse<boolean>>(`/tasks/${id}`, {
      content,
    });

    return resp.data.data;
  }

  async removeTodo(id: string): Promise<boolean> {
    const resp = await axios.delete<AxiosResponse<boolean>>(`/tasks/${id}`);

    return resp.data.data;
  }

  async clearTodos(ids?: string[]): Promise<boolean> {
    const resp = await axios.delete<AxiosResponse<boolean>>(`/tasks`, {
      params: { ids },
    });

    return resp.data.data;
  }

  async updateAllTodoStatus(status: TodoStatus): Promise<boolean> {
    const resp = await axios.put<AxiosResponse<boolean>>(`/tasks`, {
      status,
    });

    return resp.data.data;
  }

  async login(username: string, password: string): Promise<AuthModel> {
    const resp = await axios.post<AxiosResponse<AuthModel>>(`/login`, {
      username,
      password,
    });

    return resp.data.data;
  }
}

export default new ApiFullstack();
