// src/app/(protected)/organizer-hackathon-management/_components/CreateHackathonModal.tsx
import { useState } from "react";

interface CreateHackathonModalProps {
  onClose: () => void;
}

const TABS = [
  "Banner",
  "Information",
  "Description",
  "Participant",
  "Documentation",
  "Contact",
];

export default function CreateHackathonModal({
  onClose,
}: CreateHackathonModalProps) {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  // Controlled form states
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [enrollmentDate, setEnrollmentDate] = useState("");
  const [information, setInformation] = useState("");
  const [description, setDescription] = useState("");
  const [showParticipants, setShowParticipants] = useState(true);
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const [contact, setContact] = useState({ phone: "", facebook: "" });

  const handleCreate = () => {
    console.log({
      title,
      subtitle,
      enrollmentDate,
      information,
      description,
      showParticipants,
      uploadedDocs,
      contact,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-lg font-bold mb-4">Create a Hackathon</h2>

        {/* Tabs */}
        <div className="flex flex-wrap border-b mb-4">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 ${
                activeTab === tab
                  ? "border-b-2 border-blue-500 font-semibold"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[200px]">
          {activeTab === "Banner" && (
            <div>
              <label className="block font-medium">Title</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md mt-1"
                placeholder="Hackathon Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <label className="block mt-3 font-medium">Banner image:</label>
              <button className="text-blue-500 underline">Upload</button>

              <label className="block mt-3 font-medium">Subtitle</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="Enter a short description..."
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
              />

              <label className="block mt-3 font-medium">Enrollment Date</label>
              <input
                type="date"
                className="w-full p-2 border rounded-md mt-1"
                value={enrollmentDate}
                onChange={(e) => setEnrollmentDate(e.target.value)}
              />

              <div className="flex items-center mt-3">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={showParticipants}
                  onChange={() => setShowParticipants(!showParticipants)}
                />
                <label>Show the number of registered participants</label>
              </div>
            </div>
          )}

          {activeTab === "Information" && (
            <textarea
              className="w-full p-2 border rounded-md"
              rows={5}
              placeholder="Enter information here..."
              value={information}
              onChange={(e) => setInformation(e.target.value)}
            />
          )}

          {activeTab === "Description" && (
            <textarea
              className="w-full p-2 border rounded-md"
              rows={5}
              placeholder="Enter description here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          )}

          {activeTab === "Participant" && (
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={showParticipants}
                  onChange={() => setShowParticipants(!showParticipants)}
                />
                Show number of participants
              </label>
            </div>
          )}

          {activeTab === "Documentation" && (
            <div>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={() =>
                  setUploadedDocs((prev) => [...prev, "sample-doc.pdf"])
                }
              >
                Upload Files
              </button>
              <ul className="mt-2">
                {uploadedDocs.map((doc, index) => (
                  <li
                    key={index}
                    className="flex justify-between border p-2 rounded-md"
                  >
                    <span>{doc}</span>
                    <button
                      className="text-red-500"
                      onClick={() =>
                        setUploadedDocs((prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "Contact" && (
            <div>
              <label className="block font-medium">Phone Number</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md mt-1"
                placeholder="Enter phone number"
                value={contact.phone}
                onChange={(e) =>
                  setContact((prev) => ({ ...prev, phone: e.target.value }))
                }
              />

              <label className="block mt-3 font-medium">Facebook</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md mt-1"
                placeholder="Facebook link"
                value={contact.facebook}
                onChange={(e) =>
                  setContact((prev) => ({ ...prev, facebook: e.target.value }))
                }
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
