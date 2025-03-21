import { AuditCreatedBase } from "./auditCreatedBase";
import { User } from "./user";
import { Round } from "./round";

export type JudgeRound = {
  id: string;
  judge?: User;
  judgeId?: string;
  round?: Round;
  roundId?: string;
  isDeleted: boolean;
} & AuditCreatedBase;
