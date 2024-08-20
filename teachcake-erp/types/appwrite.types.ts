import { Models } from "node-appwrite";

export interface Teacher extends Models.Document {
    userId: string;
    name: string;
    email: string;
    phone: string;
    birthDate: Date;
    gender: Gender;
    address: string;
    occupation: string;
    primaryProgram: string;
    documentUrl: FormData | undefined;
    privacyConsent: boolean;
    projectTopic: string;
}

export interface Appointment extends Models.Document {
    teacher: Teacher;
    schedule: Date;
    status: Status;
    primaryPhysician: string;
    reason: string;
    note: string;
    userId: string;
    cancellationReason: string | null;
}