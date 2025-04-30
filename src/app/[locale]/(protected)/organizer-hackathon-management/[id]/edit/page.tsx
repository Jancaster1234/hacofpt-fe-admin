// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/edit/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "@/hooks/useTranslations";
import { hackathonService } from "@/services/hackathon.service";
import HackathonCreateForm from "../../create/_components/HackathonCreateForm";
import HackathonCreateBanner from "../../create/_components/HackathonCreateBanner";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";

export default function EditHackathonPage() {
  const params = useParams();
  const hackathonId = params.id as string;
  const router = useRouter();
  const t = useTranslations("editHackathon");
  const { success, error } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state with all fields needed for a hackathon
  const [formData, setFormData] = useState({
    title: "",
    subTitle: "",
    bannerImageUrl: "",
    enrollStartDate: "",
    enrollEndDate: "",
    startDate: "",
    endDate: "",
    information: "",
    description: "",
    contact: "",
    category: "CODING",
    organization: "FPTU",
    minimumTeamMembers: 1,
    maximumTeamMembers: 5,
    documentation: [] as string[],
    showParticipants: true,
  });

  // Format dates function - moved outside useEffect to avoid recreation
  const formatDateForInput = useCallback((dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // format: "YYYY-MM-DDThh:mm"
  }, []);

  // Handle error display outside of useEffect
  const handleFetchError = useCallback((errorMessage: string) => {
    console.error("Error fetching hackathon:", errorMessage);
    // We're not calling toast.error here to avoid dependency issues
  }, []);

  // Fetch hackathon data when component mounts
  // Remove toast from dependency array to prevent infinite loops
  useEffect(() => {
    let isMounted = true;

    const fetchHackathon = async () => {
      try {
        const response = await hackathonService.getHackathonById(hackathonId);

        // Only update state if component is still mounted
        if (!isMounted) return;

        if (response.data.length > 0) {
          const hackathon = response.data[0];

          setFormData({
            title: hackathon.title || "",
            subTitle: hackathon.subTitle || "",
            bannerImageUrl: hackathon.bannerImageUrl || "",
            enrollStartDate: formatDateForInput(hackathon.enrollStartDate),
            enrollEndDate: formatDateForInput(hackathon.enrollEndDate),
            startDate: formatDateForInput(hackathon.startDate),
            endDate: formatDateForInput(hackathon.endDate),
            information: hackathon.information || "",
            description: hackathon.description || "",
            contact: hackathon.contact || "",
            category: hackathon.category || "CODING",
            organization: hackathon.organization || "FPTU",
            minimumTeamMembers: hackathon.minimumTeamMembers || 1,
            maximumTeamMembers: hackathon.maximumTeamMembers || 5,
            documentation: hackathon.documentation || [],
            showParticipants: hackathon.showParticipants !== false, // default to true if not specified
          });
        } else {
          if (isMounted) {
            // Instead of calling toast in useEffect, set a flag for empty data
            handleFetchError("hackathonNotFound");
            router.push("/organizer-hackathon-management");
          }
        }
      } catch (err) {
        if (isMounted) {
          handleFetchError(
            err instanceof Error ? err.message : "Unknown error"
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchHackathon();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [hackathonId, router, formatDateForInput, handleFetchError]);

  // Show error toast after the component has mounted and when the error flag is set
  useEffect(() => {
    // This is a separate useEffect specifically for displaying error messages
    // after rendering, not during the data fetching process
    if (!isLoading && formData.title === "") {
      error(t("hackathonNotFound"));
    }
  }, [isLoading, formData.title, error, t]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const hackathonData = {
        id: hackathonId,
        title: formData.title,
        subTitle: formData.subTitle,
        bannerImageUrl: formData.bannerImageUrl,
        enrollStartDate: formData.enrollStartDate,
        enrollEndDate: formData.enrollEndDate,
        startDate: formData.startDate,
        endDate: formData.endDate,
        information: formData.information,
        description: formData.description,
        contact: formData.contact,
        category: formData.category,
        organization: formData.organization,
        status: "ACTIVE",
        minimumTeamMembers: formData.minimumTeamMembers,
        maximumTeamMembers: formData.maximumTeamMembers,
        documentation: formData.documentation,
        //showParticipants: formData.showParticipants,
      };

      const result = await hackathonService.updateHackathon(hackathonData);

      // Display success toast with message from API response
      // This is fine since it's in response to a user action (submit button click)
      success(result.message || t("successMessage"));

      // Redirect back to the hackathon detail page
      router.push(`/organizer-hackathon-management/${hackathonId}`);
    } catch (err) {
      console.error("Error updating hackathon:", err);
      // Display error toast with message from API response if available
      // This is fine since it's in response to a user action (submit button click)
      error(err instanceof Error ? err.message : t("errorMessage"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" showText={true} text={t("loading")} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-gray-100">
        {t("title")}
      </h1>

      <HackathonCreateBanner
        bannerImageUrl={formData.bannerImageUrl}
        onBannerUpdate={(url) =>
          setFormData({ ...formData, bannerImageUrl: url })
        }
      />

      <div className="mt-4 mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 transition-colors duration-300">
          {formData.title || t("editHackathon")}
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 transition-colors duration-300">
          {formData.subTitle || t("enterSubtitle")}
        </p>
      </div>

      <HackathonCreateForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />

      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-colors duration-300">
            <LoadingSpinner size="lg" showText={true} />
            <p className="mt-4 text-center text-gray-700 dark:text-gray-300">
              {t("submitting")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
