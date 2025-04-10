import { useState } from "react";
import { toast } from "sonner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaFile,
  FaFileWord,
  FaFilePdf,
  FaFileExcel,
  FaFileImage,
  FaFileAudio,
  FaFileVideo,
  FaFileArchive,
  FaFileAlt,
  FaTimes,
} from "react-icons/fa";
import { hackathonService } from "@/services/hackathon.service";
import { fileUrlService } from "@/services/fileUrl.service";

interface Hackathon {
  id: string;
  title: string;
  subTitle: string;
  bannerImageUrl: string;
  enrollStartDate: string;
  enrollEndDate: string;
  startDate: string;
  endDate: string;
  information: string;
  description: string;
  contact: string;
  category: string;
  organization: string;
  status: string;
  minimumTeamMembers: number;
  maximumTeamMembers: number;
  documentation: string[];
}

interface CreateHackathonModalProps {
  onClose: () => void;
  onSuccess?: (newHackathon: Hackathon) => void;
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
  onSuccess,
}: CreateHackathonModalProps) {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  // Controlled form states
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [enrollmentStartDate, setEnrollmentStartDate] = useState<Date | null>(
    null
  );
  const [enrollmentEndDate, setEnrollmentEndDate] = useState<Date | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [category, setCategory] = useState<
    "CODING" | "EXTERNAL" | "INTERNAL" | "DESIGN" | "OTHERS"
  >("CODING");
  const [organization, setOrganization] = useState<
    "FPTU" | "NASA" | "IAI_HACKATHON" | "CE_HACKATHON" | "OTHERS"
  >("FPTU");
  const [minTeamMembers, setMinTeamMembers] = useState(1);
  const [maxTeamMembers, setMaxTeamMembers] = useState(5);
  const [information, setInformation] = useState("");
  const [description, setDescription] = useState("");
  const [showParticipants, setShowParticipants] = useState(true);
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const [contact, setContact] = useState("");
  const [bannerImageUrl, setBannerImageUrl] = useState<string>("");

  const ORGANIZATIONS = [
    { value: "FPTU", label: "FPTU" },
    { value: "NASA", label: "NASA" },
    { value: "IAI_HACKATHON", label: "IAI HACKATHON" },
    { value: "CE_HACKATHON", label: "CE Hackathon" },
    { value: "OTHERS", label: "Others" },
  ];

  const CATEGORIES = [
    { value: "CODING", label: "Coding Hackathons" },
    { value: "EXTERNAL", label: "External Hackathons" },
    { value: "INTERNAL", label: "Internal Hackathons" },
    { value: "DESIGN", label: "Design Hackathons" },
    { value: "OTHERS", label: "Others" },
  ];

  // Handle Banner Image Upload
  const handleBannerUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      toast.error(
        "Invalid file type. Please upload a JPEG, PNG, or JPG image."
      );
      return;
    }

    try {
      const response = await fileUrlService.uploadMultipleFilesCommunication([
        file,
      ]);
      if (response.data && response.data.length > 0) {
        setBannerImageUrl(response.data[0].fileUrl);
        toast.success("Banner image uploaded successfully!");
      } else {
        throw new Error("No file URL returned from server");
      }
    } catch (error) {
      console.error("Error uploading banner image:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image"
      );
    }
  };

  // Handle Document Upload
  const handleDocumentUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      const fileArray = Array.from(files);
      const response = await fileUrlService.uploadMultipleFilesCommunication(
        fileArray
      );

      if (response.data && response.data.length > 0) {
        // Extract fileUrls from the response
        const newFileUrls = response.data.map((file) => file.fileUrl);
        setUploadedDocs((prev) => [...prev, ...newFileUrls]);
        toast.success("Documents uploaded successfully!");
      } else {
        throw new Error("No file URLs returned from server");
      }
    } catch (error) {
      console.error("Error uploading documents:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload documents"
      );
    }
  };

  // Handle File Deletion
  const handleDeleteFile = (index: number) => {
    setUploadedDocs((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileName = (fileUrl: string) => {
    // Extract file name from URL
    const decodedUrl = decodeURIComponent(fileUrl);
    const parts = decodedUrl.split("/");
    const lastPart = parts[parts.length - 1];
    // If there's a UUID in the filename (format: uuid_filename)
    if (lastPart.includes("_")) {
      return lastPart.split("_").slice(1).join("_");
    }
    return lastPart;
  };

  const getFileIcon = (fileUrl: string) => {
    const extension = fileUrl.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "doc":
      case "docx":
        return <FaFileWord size={16} />;
      case "pdf":
        return <FaFilePdf size={16} />;
      case "xls":
      case "xlsx":
        return <FaFileExcel size={16} />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <FaFileImage size={16} />;
      case "mp3":
      case "wav":
      case "ogg":
        return <FaFileAudio size={16} />;
      case "mp4":
      case "avi":
      case "mov":
        return <FaFileVideo size={16} />;
      case "zip":
      case "rar":
      case "7z":
        return <FaFileArchive size={16} />;
      case "txt":
        return <FaFileAlt size={16} />;
      default:
        return <FaFile size={16} />;
    }
  };

  const handleCreate = async () => {
    console.log("Submitting hackathon details...");

    const hackathonData = {
      title,
      subTitle: subtitle,
      bannerImageUrl,
      enrollStartDate: enrollmentStartDate?.toISOString(),
      enrollEndDate: enrollmentEndDate?.toISOString(),
      enrollmentCount: 0,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      information,
      description,
      contact,
      category,
      organization,
      status: "ACTIVE",
      minimumTeamMembers: minTeamMembers,
      maximumTeamMembers: maxTeamMembers,
      documentation: uploadedDocs,
    };

    console.log("Hackathon data:", hackathonData);

    try {
      const result = await hackathonService.createHackathon(hackathonData);

      toast.success("Hackathon created successfully!", {
        duration: 3000,
        position: "top-right",
      });

      onSuccess?.(result.data);
      onClose();
    } catch (error) {
      console.error("Error creating hackathon:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create hackathon.",
        {
          duration: 3000,
          position: "top-right",
        }
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-99999">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="p-6 border-b relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <FaTimes size={20} />
          </button>
          <h2 className="text-2xl font-bold">Create New Hackathon</h2>
          <div className="flex flex-wrap border-b mt-4">
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
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 overflow-y-auto flex-1">
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
                {bannerImageUrl && (
                  <p className="mt-2 text-sm text-green-600 flex items-center gap-2">
                    {getFileIcon(bannerImageUrl)}
                    Uploaded: {getFileName(bannerImageUrl)}
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
                <DatePicker
                  selected={enrollmentStartDate}
                  onChange={(date) => setEnrollmentStartDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className="w-full p-2 border rounded-md mt-1"
                  placeholderText="Select enrollment start date"
                />

                <label className="block mt-3 font-medium">
                  Enrollment End Date
                </label>
                <DatePicker
                  selected={enrollmentEndDate}
                  onChange={(date) => setEnrollmentEndDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className="w-full p-2 border rounded-md mt-1"
                  placeholderText="Select enrollment end date"
                  minDate={enrollmentStartDate || undefined}
                />

                <label className="block mt-3 font-medium">Start Date</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className="w-full p-2 border rounded-md mt-1"
                  placeholderText="Select start date"
                  minDate={enrollmentEndDate || undefined}
                />

                <label className="block mt-3 font-medium">End Date</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className="w-full p-2 border rounded-md mt-1"
                  placeholderText="Select end date"
                  minDate={startDate || undefined}
                />

                <label className="block mt-3 font-medium">Category</label>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value as
                        | "CODING"
                        | "EXTERNAL"
                        | "INTERNAL"
                        | "DESIGN"
                        | "OTHERS"
                    )
                  }
                  className="w-full p-2 border rounded-md"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>

                <label className="block mt-3 font-medium">Organization</label>
                <select
                  value={organization}
                  onChange={(e) =>
                    setOrganization(
                      e.target.value as
                        | "FPTU"
                        | "NASA"
                        | "IAI_HACKATHON"
                        | "CE_HACKATHON"
                        | "OTHERS"
                    )
                  }
                  className="w-full p-2 border rounded-md"
                >
                  {ORGANIZATIONS.map((org) => (
                    <option key={org.value} value={org.value}>
                      {org.label}
                    </option>
                  ))}
                </select>

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
                  {uploadedDocs.map((url, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center border p-2 rounded-md"
                    >
                      <span className="flex items-center gap-2">
                        {getFileIcon(url)}
                        {getFileName(url)}
                      </span>
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
        </div>

        {/* Footer - Fixed */}
        <div className="p-6 border-t">
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
