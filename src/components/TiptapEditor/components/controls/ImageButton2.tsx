// src/components/TiptapEditor/components/controls/ImageButton2.tsx
import React, { useRef, useState } from "react";
import MenuButton from "../MenuButton";
import { useEditorState } from "@tiptap/react";
import { useTiptapContext } from "../Provider";
import { fileUrlService } from "@/services/fileUrl.service";

const ImageButton = () => {
  const { editor } = useTiptapContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const state = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        active: ctx.editor.isActive("image"),
        disabled: !ctx.editor.isEditable || uploading,
      };
    },
  });

  const insertImage = (
    src: string,
    alt: string,
    width?: number,
    height?: number
  ) => {
    // Create a compact HTML string with no extra whitespace
    const imageHtml = `<img src="${src}" alt="${alt}" ${width ? `data-width="${width}"` : ""} ${height ? `data-height="${height}"` : ""}>`;

    // Insert the HTML directly
    editor.chain().focus().insertContent(imageHtml).run();
  };

  const handleLocalImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      // Upload files using the fileUrlService
      const { data: uploadedFiles } =
        await fileUrlService.uploadMultipleFilesCommunication(
          Array.from(files)
        );

      // Process each uploaded file
      for (const file of uploadedFiles) {
        // Get image dimensions before inserting
        const img = new Image();
        img.onload = () => {
          insertImage(file.fileUrl, file.fileName, img.width, img.height);
        };
        img.onerror = () => {
          // Handle image loading error - insert without dimensions
          insertImage(file.fileUrl, file.fileName);
        };
        img.src = file.fileUrl;
      }
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      // Reset the file input and uploading state
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setUploading(false);
    }
  };

  // Direct file select - no media library option
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <MenuButton
        icon="Image"
        tooltip={uploading ? "Uploading..." : "Image"}
        {...state}
        onClick={handleButtonClick}
      />
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        multiple
        onChange={handleLocalImageUpload}
      />
    </>
  );
};

export default ImageButton;
