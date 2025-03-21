// src/app/(protected)/user-management/_config/validationConfig.ts
import { z } from "zod";
import { TDataTableDataValidation } from "@/types/dataTable";
import { faker } from "@faker-js/faker";

export const userDataValidationProps: TDataTableDataValidation[] = [
  {
    id: "firstName",
    component: "input",
    label: "First Name",
    schema: z.string().min(3, "First name must be at least 3 characters"),
  },
  {
    id: "lastName",
    component: "input",
    label: "Last Name",
    schema: z.string().min(3, "Last name must be at least 3 characters"),
  },
  {
    id: "email",
    component: "input",
    label: "Email",
    schema: z.string().email("Must be a valid email address"),
  },
  {
    id: "status",
    component: "select",
    label: "Relationship Status",
    placeholder: "Select your status",
    data: [
      { value: "single", children: "Single" },
      { value: "complicated", children: "Complicated" },
      { value: "relationship", children: "In a relationship" },
    ],
    schema: z.enum(["single", "complicated", "relationship"]),
  },
  {
    id: "locality",
    component: "combobox",
    label: "Locality",
    placeholder: "Choose your locality",
    data: new Array(50).fill(0).map(() => {
      const country = faker.location.country();
      return { value: country, children: country };
    }),
    schema: z.string().min(3, "You must choose a locality"),
  },
];
