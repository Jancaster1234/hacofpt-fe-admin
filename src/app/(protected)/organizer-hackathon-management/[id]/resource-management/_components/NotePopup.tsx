// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/NotePopup.tsx
interface NotePopupProps {
  activePopup: {
    type: string;
    id: string;
    note: string;
  };
  setActivePopup: (popup: null) => void;
}

export function NotePopup({ activePopup, setActivePopup }: NotePopupProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">
            {activePopup.type === "judgeNote"
              ? "Judge Note"
              : activePopup.type === "criterionNote"
              ? "Criterion Description"
              : "Evaluation Note"}
          </h3>
          <button
            onClick={() => setActivePopup(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-gray-800">
            {activePopup.note || "No additional notes provided."}
          </p>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setActivePopup(null)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
