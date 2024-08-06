export default function SetNotes({ notes, onNotesChange }) {
    return (
        <>
            <div>
                <textarea
                    className="bg-gray-100 w-full p-3 rounded-lg text-sm outline-none resize-none"
                    placeholder="Add notes"
                    rows={5}
                    value={notes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    id="taskNotes"
                />
            </div>
        </>
    );
}
