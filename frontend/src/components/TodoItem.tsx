import { CheckIcon, Trash2Icon, XIcon } from "lucide-react";
import useTodoStore from "../stores/useTodoStore";
import { useState } from "react";
import clsx from "clsx";
import useClickOutside from "../hooks/useClickOutside";

const TodoItem = ({
  todo,
  index,
}: {
  todo: { id: string; user_id: number; text: string; completed: number };
  index: number;
}) => {
  const { deleteTodo, updateTodo } = useTodoStore();

  const [editText, setEditText] = useState(todo.text);
  const { show, showRef, toggleShow } = useClickOutside();

  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleDeleteTodo = async () => {
    try {
      setDeleting(true);
      await deleteTodo(todo.id);
    } catch (error: any) {
      console.log("Error in handleDeleteTodo: " + error);
    } finally {
      setDeleting(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      await updateTodo(todo.id, { text: editText });
    } catch (error: any) {
    } finally {
      setUpdating(false);
      toggleShow();
    }
  };

  const toggleMarkAsCompleted = async () => {
    try {
      setUpdating(true);
      await updateTodo(todo.id, {
        completed: todo.completed ? Boolean(0) : Boolean(1),
      });
    } catch (error: any) {
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div
      key={todo.id}
      className="flex items-center gap-2 justify-between p-2 border-b border-b-slate-200 pb-4"
    >
      <div
        onDoubleClick={toggleShow}
        ref={showRef}
        className="flex items-center gap-2 flex-1"
      >
        <span className="p-2 bg-secondary size-10 flex items-center justify-center rounded-full ">
          {index + 1}
        </span>
        {show ? (
          <input
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                console.log("Enter");
                handleUpdate();
              }
            }}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="border w-full flex-1 outline-base-300"
          />
        ) : (
          <p className={clsx(todo.completed ? "line-through" : "")}>
            {todo.text}
          </p>
        )}
      </div>
      <div className="flex gap-1">
        <button
          onClick={handleDeleteTodo}
          disabled={deleting}
          data-tip="Delete"
          className={clsx(
            "btn btn-circle text-error tooltip",
            deleting ? "opacity-60" : ""
          )}
        >
          <Trash2Icon size={20} />
        </button>
        <button
          disabled={updating}
          onClick={toggleMarkAsCompleted}
          data-tip={
            todo.completed ? "Mark as Not Completed" : "Mark as Completed"
          }
          className="btn btn-circle text-success tooltip tooltip-left"
        >
          {todo.completed ? <XIcon size={20} /> : <CheckIcon size={20} />}
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
