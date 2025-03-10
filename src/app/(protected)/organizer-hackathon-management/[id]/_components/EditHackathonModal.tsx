// src/app/(protected)/organizer-hackathon-management/[id]/_components/EditHackathonModal.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Button from "@/components/ui/button/Button";

type EditModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
};

export default function EditHackathonModal({
  isOpen,
  onClose,
  onSave,
}: EditModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-6">
        <DialogTitle className="text-lg font-bold">Edit Hackathon</DialogTitle>
        <p className="text-gray-600">This is the edit modal.</p>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
