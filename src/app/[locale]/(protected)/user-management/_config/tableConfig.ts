// src/app/[locale]/(protected)/user-management/_config/tableConfig.ts
import { User } from "@/types/entities/user";
import {
  TDataTableAddDataProps,
  TDataTableEditDataProps,
  TDataTableContextMenuProps,
  TDataTableExportProps,
} from "@/types/dataTable";
import { IAdvancedDataTable } from "@/interface/IDataTable";

export const exportProps: TDataTableExportProps = {
  exportFileName: "users-export",
};

export const actionProps: IAdvancedDataTable<User>["actionProps"] = {
  onDelete: (selected) => console.log("Delete Users", selected),
  onUserExport: (selected) => console.log("Export Users", selected),
};

export const addDataProps: TDataTableAddDataProps<User> = {
  enable: true,
  title: "Add User",
  description: "Fill the user details below.",
  onSubmitNewData: (newUser: User) => console.log("New user", newUser),
};

export const editDataProps: TDataTableEditDataProps<User> = {
  title: "Edit User",
  description: "Modify the user data below.",
  onSubmitEditData: (editedUser: User) =>
    console.log("Edited user", editedUser),
};

export const contextMenuProps: TDataTableContextMenuProps = {
  enableEdit: true,
  enableDelete: true,
  onDelete: (data: User) => console.log("Context delete", data),
};
