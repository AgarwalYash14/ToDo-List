import { MdEdit } from "react-icons/md";

export default function EditTask({ task, onEdit }) {
    const handleEdit = () => {
        onEdit(task);
    };

    return (
        <>
            <button
                onClick={handleEdit}
                className="bg-gray-100 p-2 hover:bg-gray-200 rounded"
            >
                <MdEdit />
            </button>
        </>
    );
}
