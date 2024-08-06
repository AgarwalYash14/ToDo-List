import { MdDelete } from "react-icons/md";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

export default function DeleteTask({ taskId }) {
    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            socket.emit("deleteTask", taskId);
        }
    };

    return (
        <>
            <button
                onClick={handleDelete}
                className="bg-gray-100 p-2 hover:bg-gray-200 rounded"
            >
                <MdDelete />
            </button>
        </>
    );
}
