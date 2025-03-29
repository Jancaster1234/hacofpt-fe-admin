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
  const [enrollmentStartDate, setEnrollmentStartDate] = useState("");
  const [enrollmentEndDate, setEnrollmentEndDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("");
  const [organization, setOrganization] = useState("");
  const [minTeamMembers, setMinTeamMembers] = useState(1);
  const [maxTeamMembers, setMaxTeamMembers] = useState(5);
  const [information, setInformation] = useState("");
  const [description, setDescription] = useState("");
  const [showParticipants, setShowParticipants] = useState(true);
  const [uploadedDocs, setUploadedDocs] = useState<File[]>([]);
  const [contact, setContact] = useState("");
  const [bannerImage, setBannerImage] = useState<File | null>(null);

  // Handle Banner Image Upload
  const handleBannerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && ["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setBannerImage(file);
    } else {
      alert("Invalid file type. Please upload a JPEG, PNG, or JPG image.");
    }
  };

  // Handle Document Upload
  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setUploadedDocs((prev) => [...prev, ...Array.from(files)]);
    }
  };

  // Handle File Deletion
  const handleDeleteFile = (index: number) => {
    setUploadedDocs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    console.log("Submitting hackathon details...");

    const formData = new FormData();

    // Append text fields
    formData.append("title", title);
    formData.append("subtitle", subtitle);
    formData.append("enrollStartDate", enrollmentStartDate);
    formData.append("enrollEndDate", enrollmentEndDate);
    formData.append("enrollmentCount", "0");
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("information", information);
    formData.append("description", description);
    formData.append("contact", contact);
    formData.append("category", category);
    formData.append("organization", organization);
    formData.append("status", "OPEN");
    formData.append("minimumTeamMembers", minTeamMembers.toString());
    formData.append("maximumTeamMembers", maxTeamMembers.toString());

    // Append banner image (if exists)
    if (bannerImage) {
      formData.append("bannerImage", bannerImage);
    }

    // Append uploaded documents (if exists)
    uploadedDocs.forEach((doc) => {
      formData.append("documentation", doc);
    });

    console.log("Sending form data...");

    try {
      const response = await fetch("https://your-api-endpoint.com/hackathons", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to create hackathon");

      const result = await response.json();
      console.log("Response from API:", result);

      alert("Hackathon created successfully!");
      onClose();
    } catch (error) {
      console.error("Error creating hackathon:", error);
      alert("Failed to create hackathon.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-99999">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
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

              <label className="block mt-3 font-medium">Banner Image</label>
              <input
                type="file"
                accept="image/jpeg, image/png, image/jpg"
                onChange={handleBannerUpload}
                className="block w-full border p-2 rounded-md"
              />
              {bannerImage && (
                <p className="mt-2 text-sm text-green-600">
                  Uploaded: {bannerImage.name}
                </p>
              )}

              <label className="block mt-3 font-medium">Subtitle</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="Enter a short description..."
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
              />

              <label className="block mt-3 font-medium">
                Enrollment Start Date
              </label>
              <input
                type="date"
                className="w-full p-2 border rounded-md mt-1"
                value={enrollmentStartDate}
                onChange={(e) => setEnrollmentStartDate(e.target.value)}
              />

              <label className="block mt-3 font-medium">
                Enrollment End Date
              </label>
              <input
                type="date"
                className="w-full p-2 border rounded-md mt-1"
                value={enrollmentEndDate}
                onChange={(e) => setEnrollmentEndDate(e.target.value)}
              />

              <label className="block mt-3 font-medium">
                Hackathon Start Date
              </label>
              <input
                type="date"
                className="w-full p-2 border rounded-md mt-1"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />

              <label className="block mt-3 font-medium">
                Hackathon End Date
              </label>
              <input
                type="date"
                className="w-full p-2 border rounded-md mt-1"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />

              <label className="block mt-3 font-medium">Category</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="e.g., AI, Web Dev, Healthcare"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />

              <label className="block mt-3 font-medium">Organization</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Organizer Name"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
              />

              <label className="block mt-3 font-medium">Team Size</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  className="w-1/2 p-2 border rounded-md"
                  min="1"
                  value={minTeamMembers}
                  onChange={(e) => setMinTeamMembers(Number(e.target.value))}
                  placeholder="Min Team Members"
                />
                <input
                  type="number"
                  className="w-1/2 p-2 border rounded-md"
                  min={minTeamMembers}
                  value={maxTeamMembers}
                  onChange={(e) => setMaxTeamMembers(Number(e.target.value))}
                  placeholder="Max Team Members"
                />
              </div>

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
              <label className="block font-medium">Upload Documents</label>
              <input
                type="file"
                multiple
                onChange={handleDocumentUpload}
                className="block w-full border p-2 rounded-md"
              />
              <ul className="mt-2">
                {uploadedDocs.map((doc, index) => (
                  <li
                    key={index}
                    className="flex justify-between border p-2 rounded-md"
                  >
                    <span>{doc.name}</span>
                    <button
                      className="text-red-500"
                      onClick={() => handleDeleteFile(index)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "Contact" && (
            <textarea
              className="w-full p-2 border rounded-md"
              rows={5}
              placeholder="Enter contact here..."
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
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
