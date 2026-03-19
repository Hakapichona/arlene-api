export const COLLABORATOR_FILE_FIELDS = ['file1'] as const;

export type CollaboratorFileField = (typeof COLLABORATOR_FILE_FIELDS)[number];
export const MAX_FILE_SIZE = 7 * 1024 * 1024; //7MB

export type CollaboratorUploadedFiles = Partial<
  Record<CollaboratorFileField, Express.Multer.File[]>
>;
