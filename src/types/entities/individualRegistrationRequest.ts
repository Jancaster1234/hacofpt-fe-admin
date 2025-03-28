// src/types/entities/individualRegistrationRequest.ts
import { AuditCreatedBase } from "./auditCreatedBase";
import { Hackathon } from "./hackathon";
import { User } from "./user";

export type IndividualRegistrationRequestStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"; // Update this based on your Status enum if needed

export type IndividualRegistrationRequest = {
  id: string;
  hackathon?: Partial<Hackathon>;
  hackathonId?: string;
  status: IndividualRegistrationRequestStatus;
  reviewedBy?: Partial<User>;
  reviewedById?: string;
} & AuditCreatedBase;
