// src/components/ui/LoadingSpinner.tsx
import { FC } from "react";
import { useTranslations } from "@/hooks/useTranslations";

type LoadingSpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
};

const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  size = "md",
  className = "",
  showText = false,
}) => {
  const t = useTranslations("loadingSpinner");

  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-3",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-full border-t-transparent border-blue-500 dark:border-blue-400 animate-spin transition-colors duration-300`}
        role="status"
        aria-label={t("loading")}
      />
      {showText && (
        <span className="ml-2 text-gray-700 dark:text-gray-300 text-sm transition-colors duration-300">
          {t("loading")}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;
