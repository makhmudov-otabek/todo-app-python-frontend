import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/api";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

type TodoResponse = {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: Todo[];
};

function Todos() {
  const navigate = useNavigate();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchTodos = async () => {
      try {
        const response = await api.get<Todo[] | TodoResponse>("/todo/");

        if (ignore) return;

        if (Array.isArray(response.data)) {
          setTodos(response.data);
        } else {
          setTodos(response.data.results ?? []);
        }
      } catch {
        if (!ignore) {
          setError("Todo’larni olishda xatolik");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void fetchTodos();

    return () => {
      ignore = true;
    };
  }, []);

  const createTodo = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    try {
      const response = await api.post<Todo>("/todo/", {
        title,
        completed: false,
      });

      setTodos((currentTodos) => [response.data, ...currentTodos]);
      setTitle("");
    } catch {
      setError("Todo yaratishda xatolik");
    }
  };

  const toggleTodo = async (todo: Todo) => {
    try {
      const response = await api.put<Todo>(`/todo/${todo.id}/`, {
        title: todo.title,
        completed: !todo.completed,
      });

      setTodos((currentTodos) =>
        currentTodos.map((item) =>
          item.id === todo.id ? response.data : item,
        ),
      );
    } catch {
      setError("Todo yangilashda xatolik");
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await api.delete(`/todo/${id}/`);

      setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
    } catch {
      setError("Todo o‘chirishda xatolik");
    }
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    navigate("/login");
  };

  return (
    <main className="todos-page">
      <section className="todos-container">
        <header className="todos-header">
          <h1>My Todos</h1>

          <button type="button" onClick={logout}>
            Logout
          </button>
        </header>

        <form className="todo-form" onSubmit={createTodo}>
          <input
            type="text"
            placeholder="Yangi todo..."
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <button type="submit">Add</button>
        </form>

        {error && <p className="error-message">{error}</p>}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="todo-list">
            {todos.map((todo) => (
              <article
                className="todo-item"
                style={{
                  borderColor: todo.completed
                    ? "oklch(62.7% 0.194 149.214)"
                    : "oklch(70.7% 0.022 261.325)",
                }}
                key={todo.id}
              >
                <button
                  className="todo-title"
                  type="button"
                  onClick={() => toggleTodo(todo)}
                >
                  <span className={todo.completed ? "completed" : ""}>
                    {todo.title}
                  </span>
                </button>

                <button
                  className={`button ${todo.completed ? "completed-button" : "not-completed-button"}`}
                  type="button"
                  onClick={() => toggleTodo(todo)}
                >
                  Done
                </button>

                <button
                  className="button button-danger"
                  type="button"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Todos;
