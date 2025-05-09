import { Loader2Icon, PlusIcon } from "lucide-react";
import useTodoStore from "../stores/useTodoStore";
import { useEffect, useState } from "react";
import TodoItem from "../components/TodoItem";

export default function HomeComponent() {
  const { todos, getTodos, addTodo, addingTodo } = useTodoStore();
  const [text, setText] = useState("");

  const handleAddTodo = async () => {
    if (!text.trim()) return;
    await addTodo(text);
    setText("");
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto h-full flex-1">
      <div className="m-2">
        <div className="flex gap-2 items-center mt-4">
          <input
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddTodo();
              }
            }}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="input w-full"
            placeholder="What do you want to do?"
          />
          <button
            onClick={handleAddTodo}
            disabled={addingTodo}
            className="btn btn-primary"
          >
            {addingTodo ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <PlusIcon />
            )}
            <span>Add</span>
          </button>
        </div>
        <div className="h-full">
          <p className="font-semibold text-lg mt-2 text-primary">My ToDos</p>
          {todos.length ? (
            <div className="space-y-2 mt-4">
              {todos.map((todo, index) => {
                return <TodoItem index={index} key={todo.id} todo={todo} />;
              })}
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center">
              <p className="text-accent font-semibold">No todos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
