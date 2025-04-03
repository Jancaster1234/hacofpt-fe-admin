// src/hooks/useApiModal.ts
import { useState } from "react";

interface ApiModalState {
  isOpen: boolean;
  title: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

const initialState: ApiModalState = {
  isOpen: false,
  title: "",
  message: "",
  type: "info",
};

export const useApiModal = () => {
  const [modalState, setModalState] = useState<ApiModalState>(initialState);

  const showModal = (
    title: string,
    message: string,
    type: "success" | "error" | "info" | "warning" = "info"
  ) => {
    setModalState({
      isOpen: true,
      title,
      message,
      type,
    });
  };

  const hideModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const showSuccess = (title: string, message: string) => {
    showModal(title, message, "success");
  };

  const showError = (title: string, message: string) => {
    showModal(title, message, "error");
  };

  const showWarning = (title: string, message: string) => {
    showModal(title, message, "warning");
  };

  const showInfo = (title: string, message: string) => {
    showModal(title, message, "info");
  };

  return {
    modalState,
    showModal,
    hideModal,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
