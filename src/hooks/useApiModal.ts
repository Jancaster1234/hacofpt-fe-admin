// src/hooks/useApiModal.ts
import { useState, useCallback } from "react";

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

  // Use useCallback to prevent recreating these functions on each render
  const showModal = useCallback(
    (
      title: string,
      message: string,
      type: "success" | "error" | "info" | "warning" = "info"
    ) => {
      // Prevent multiple modals with the same error
      setModalState((prevState) => {
        // If the modal is already showing this exact error, don't update state
        if (
          prevState.isOpen &&
          prevState.title === title &&
          prevState.message === message &&
          prevState.type === type
        ) {
          return prevState;
        }

        return {
          isOpen: true,
          title,
          message,
          type,
        };
      });
    },
    []
  );

  const hideModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const showSuccess = useCallback(
    (title: string, message: string) => {
      showModal(title, message, "success");
    },
    [showModal]
  );

  const showError = useCallback(
    (title: string, message: string) => {
      showModal(title, message, "error");
    },
    [showModal]
  );

  const showWarning = useCallback(
    (title: string, message: string) => {
      showModal(title, message, "warning");
    },
    [showModal]
  );

  const showInfo = useCallback(
    (title: string, message: string) => {
      showModal(title, message, "info");
    },
    [showModal]
  );

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
