// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/NotePopup.tsx
import { useTranslations } from "@/hooks/useTranslations";
import { useEffect } from "react";

interface NotePopupProps {
  activePopup: {
    type: string;
    id: string;
    note: string;
  };
  setActivePopup: (popup: null) => void;
}

export function NotePopup({ activePopup, setActivePopup }: NotePopupProps) {
  const t = useTranslations("popups");

  // Close on ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActivePopup(null);
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [setActivePopup]);

  // Prevent scrolling of the background
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 dark:bg-opacity-50 flex items-center justify-center z-50 p-4 transition-all duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) setActivePopup(null);
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 max-w-lg w-full mx-auto shadow-xl transform transition-all duration-300 dark:shadow-gray-900/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {activePopup.type === "judgeNote"
              ? t("judgeNote")
              : activePopup.type === "criterionNote"
                ? t("criterionDescription")
                : t("evaluationNote")}
          </h3>
          <button
            onClick={() => setActivePopup(null)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 rounded"
            aria-label={t("close")}
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
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
          <p className="text-gray-800 dark:text-gray-200">
            {activePopup.note || t("noAdditionalNotes")}
          </p>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setActivePopup(null)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
}
// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/NotePopup.tsx
// import { Dialog, Transition } from "@headlessui/react";
// import { Fragment } from "react";
// import { XCircleIcon } from "lucide-react";

// interface NotePopupProps {
//   activePopup: {
//     type: string;
//     id: string;
//     note: string;
//   } | null;
//   setActivePopup: (popup: {
//     type: string;
//     id: string;
//     note: string;
//   } | null) => void;
// }

// export function NotePopup({ activePopup, setActivePopup }: NotePopupProps) {
//   const closePopup = () => {
//     setActivePopup(null);
//   };

//   if (!activePopup) return null;

//   const getTitle = () => {
//     switch (activePopup.type) {
//       case "submission":
//         return "Submission Note";
//       case "team":
//         return "Team Note";
//       case "judge":
//         return "Judge Note";
//       default:
//         return "Note";
//     }
//   };

//   return (
//     <Transition.Root show={!!activePopup} as={Fragment}>
//       <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={closePopup}>
//         <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
//           <Transition.Child
//             as={Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0"
//             enterTo="opacity-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
//           </Transition.Child>

//           {/* This element is to trick the browser into centering the modal contents. */}
//           <span
//             className="hidden sm:inline-block sm:h-screen sm:align-middle"
//             aria-hidden="true"
//           >
//             &#8203;
//           </span>
//           <Transition.Child
//             as={Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
//             enterTo="opacity-100 translate-y-0 sm:scale-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100 translate-y-0 sm:scale-100"
//             leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
//           >
//             <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
//               <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//                 <div className="sm:flex sm:items-start">
//                   <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
//                     <svg
//                       className="h-6 w-6 text-blue-600"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
//                       />
//                     </svg>
//                   </div>
//                   <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
//                     <Dialog.Title
//                       as="h3"
//                       className="text-lg font-medium leading-6 text-gray-900"
//                     >
//                       {getTitle()}
//                     </Dialog.Title>
//                     <div className="mt-2">
//                       <p className="text-sm text-gray-500 whitespace-pre-wrap">
//                         {activePopup.note || "No notes available."}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
//                 <button
//                   type="button"
//                   className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
//                   onClick={closePopup}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </Transition.Child>
//         </div>
//       </Dialog>
//     </Transition.Root>
//   );
// }
