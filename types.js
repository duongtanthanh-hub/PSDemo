export enum AppStep {
  CREATE_PHOTO = 1,
  CREATE_VIDEO = 2,
}

export interface UploadedFile {
  id: string;
  file: File;
  preview: string;
}