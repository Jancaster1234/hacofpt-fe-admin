// src/app/[locale]/(protected)/organizer-hackathon-management/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/hooks/useTranslations";
import { hackathonService } from "@/services/hackathon.service";
import HackathonCreateForm from "./_components/HackathonCreateForm";
import HackathonCreateBanner from "./_components/HackathonCreateBanner";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";

export default function CreateHackathonPage() {
  const router = useRouter();
  const t = useTranslations("createHackathon");
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default form state with all fields needed for a hackathon
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
    minimumTeamMembers: 2,
    maximumTeamMembers: 5,
    documentation: [] as string[],
    showParticipants: true,
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const hackathonData = {
        title: formData.title,
        subTitle: formData.subTitle,
        bannerImageUrl: formData.bannerImageUrl,
        enrollStartDate: formData.enrollStartDate,
        enrollEndDate: formData.enrollEndDate,
        enrollmentCount: 0,
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
      };

      const result = await hackathonService.createHackathon(hackathonData);

      // Display success toast with message from API response
      toast.success(result.message || t("successMessage"));

      // Redirect to the newly created hackathon detail page
      router.push(`/organizer-hackathon-management/${result.data.id}`);
    } catch (error) {
      console.error("Error creating hackathon:", error);
      // Display error toast with message from API response if available
      toast.error(error instanceof Error ? error.message : t("errorMessage"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

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
          {formData.title || t("newHackathon")}
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
