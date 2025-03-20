// src/components/data-table/data-table-input.tsx
"use client";

import * as React from "react";
import { InputHTMLAttributes, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

interface DataTableInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  debounce?: number;
}

export function DataTableInput({
  value,
  onChange,
  debounce = 500,
  ...props
}: DataTableInputProps) {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (internalValue !== value) {
        onChange(internalValue);
      }
    }, debounce);

    return () => clearTimeout(timeout);
  }, [internalValue]);

  return (
    <Input
      {...props}
      value={internalValue}
      onChange={(e) => setInternalValue(e.target.value)}
    />
  );
}
