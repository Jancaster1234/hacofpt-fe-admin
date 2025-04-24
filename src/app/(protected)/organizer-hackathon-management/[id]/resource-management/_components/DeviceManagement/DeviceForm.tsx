// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/DeviceManagement/DeviceForm.tsx
import React, { useState, useEffect } from "react";
import { DeviceStatus } from "@/types/entities/device";
import { Round } from "@/types/entities/round";
import { roundService } from "@/services/round.service";

interface DeviceFormProps {
  hackathonId: string;
  initialData?: {
    id?: string;
    name: string;
    description: string;
    status: DeviceStatus;
    quantity: number;
    roundId?: string;
    roundLocationId?: string;
    files?: File[];
  };
  activeRound?: Round | null;
  activeLocationId?: string | null;
  onSubmit: (formData: any) => Promise<void>;
  onCancel: () => void;
  submitButtonText?: string;
}

const DeviceForm: React.FC<DeviceFormProps> = ({
  hackathonId,
  initialData,
  activeRound: propActiveRound,
  activeLocationId: propActiveLocationId,
  onSubmit,
  onCancel,
  submitButtonText = "Create Device",
}) => {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [loadingRounds, setLoadingRounds] = useState<boolean>(false);

  const defaultFormData = {
    name: "",
    description: "",
    status: "AVAILABLE" as DeviceStatus,
    files: [] as File[],
    quantity: 1,
    roundId: "",
    roundLocationId: "",
  };

  const [formData, setFormData] = useState(initialData || defaultFormData);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Load rounds for the form
  useEffect(() => {
    const loadRounds = async () => {
      setLoadingRounds(true);
      try {
        const roundsResponse = await roundService.getRoundsByHackathonId(
          hackathonId
        );
        if (roundsResponse.data) {
          setRounds(roundsResponse.data);

          // If we have initialData with roundId, use it
          // Otherwise if we have propActiveRound, set it as the selected round
          if (initialData?.roundId) {
            setFormData((prev) => ({
              ...prev,
              roundId: initialData.roundId,
            }));
          } else if (propActiveRound && !formData.roundId) {
            setFormData((prev) => ({
              ...prev,
              roundId: propActiveRound.id,
            }));
          }

          // If we have initialData with roundLocationId, use it
          // Otherwise if we have propActiveLocationId, set it as the selected location
          if (initialData?.roundLocationId) {
            setFormData((prev) => ({
              ...prev,
              roundLocationId: initialData.roundLocationId,
            }));
          } else if (propActiveLocationId && !formData.roundLocationId) {
            setFormData((prev) => ({
              ...prev,
              roundLocationId: propActiveLocationId,
            }));
          }
        }
      } catch (error) {
        console.error("Error loading rounds:", error);
        setErrors({
          ...errors,
          form: "Failed to load rounds. Please try again.",
        });
      } finally {
        setLoadingRounds(false);
      }
    };

    loadRounds();
  }, [hackathonId]);

  // Get the active round
  const activeRound = formData.roundId
    ? rounds.find((round) => round.id === formData.roundId)
    : null;

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // If changing round, reset location selection
    if (name === "roundId") {
      setFormData({
        ...formData,
        roundId: value,
        roundLocationId: "", // Reset location when round changes
      });
    } else {
      setFormData({
        ...formData,
        [name]: name === "quantity" ? parseInt(value) || 1 : value,
      });
    }

    // Clear error for this field when user changes input
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        files: Array.from(e.target.files),
      });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Device name is required";
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = "Quantity must be at least 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Create a copy of formData to send to API
      const submissionData = { ...formData };

      // If a location is selected and active round exists, find the actual roundLocation ID
      if (submissionData.roundLocationId && activeRound) {
        const selectedRoundLocation = activeRound.roundLocations.find(
          (rl) => rl.location.id === submissionData.roundLocationId
        );

        if (selectedRoundLocation) {
          // Replace location.id with the actual roundLocation.id
          submissionData.roundLocationId = selectedRoundLocation.id;
        }
      }

      await onSubmit(submissionData);
    } catch (error) {
      console.error("Error submitting device form:", error);
      setErrors({
        ...errors,
        form: "Failed to save device. Please try again.",
      });
    }
  };

  const getLocationName = (locationId: string) => {
    if (!activeRound) return "";

    const location = activeRound.roundLocations.find(
      (rl) => rl.location.id === locationId
    );

    return location?.location.name || "";
  };

  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Device Name*
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-md`}
              placeholder="Enter device name"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="IN_USE">IN USE</option>
              <option value="DAMAGED">DAMAGED</option>
              <option value="LOST">LOST</option>
              <option value="RETIRED">RETIRED</option>
              <option value="PENDING">PENDING</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              min="1"
              className={`w-full px-3 py-2 border ${
                errors.quantity ? "border-red-500" : "border-gray-300"
              } rounded-md`}
            />
            {errors.quantity && (
              <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Round
            </label>
            <select
              name="roundId"
              value={formData.roundId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled={loadingRounds}
            >
              <option value="">None (General Hackathon Device)</option>
              {rounds.map((round) => (
                <option key={round.id} value={round.id}>
                  {round.roundTitle}
                </option>
              ))}
            </select>
            {loadingRounds && (
              <p className="text-gray-500 text-xs mt-1">Loading rounds...</p>
            )}
          </div>

          {activeRound &&
            activeRound.roundLocations &&
            activeRound.roundLocations.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <select
                  name="roundLocationId"
                  value={formData.roundLocationId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">None (General Round Device)</option>
                  {activeRound.roundLocations.map((roundLocation) => (
                    <option
                      key={roundLocation.location.id}
                      value={roundLocation.location.id}
                    >
                      {roundLocation.location.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
              placeholder="Enter device description"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Device Files
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {initialData?.id && (
              <p className="text-xs text-gray-500 mt-1">
                Upload new files to add to this device. Existing files will be
                preserved.
              </p>
            )}
            {!initialData?.id && (
              <p className="text-xs text-gray-500 mt-1">
                Upload device manuals, specifications, etc.
              </p>
            )}
          </div>
        </div>

        {activeRound && formData.roundLocationId && (
          <div className="mb-4 p-3 bg-yellow-50 text-yellow-700 text-sm rounded">
            <p>
              This device will be assigned to{" "}
              {getLocationName(formData.roundLocationId)} in{" "}
              {activeRound.roundTitle}.
            </p>
          </div>
        )}

        {activeRound && !formData.roundLocationId && (
          <div className="mb-4 p-3 bg-yellow-50 text-yellow-700 text-sm rounded">
            <p>
              This device will be assigned to {activeRound.roundTitle} without a
              specific location.
            </p>
          </div>
        )}

        {errors.form && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded">
            {errors.form}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="mr-2 px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            {submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeviceForm;
