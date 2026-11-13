import type { USER_ROLES } from "../constants/workflow.js";

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      role: (typeof USER_ROLES)[number];
      fullName: string;
    }

    interface Request {
      user?: User;
      cloudinaryResult?: {
        fileUrl: string;
        cloudinaryPublicId: string;
        fileName: string;
        fileMimeType: string;
        fileSize: number;
      };
    }
  }
}

export {};
