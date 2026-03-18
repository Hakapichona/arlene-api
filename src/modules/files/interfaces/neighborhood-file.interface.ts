export const NEIGHBORHOOD_FILE_FIELDS = [
  'file1',
  'file2',
  'file3',
  'file4',
  'file5',
] as const;

export type NeighborhoodFileField = (typeof NEIGHBORHOOD_FILE_FIELDS)[number];
export const MAX_FILE_SIZE = 7 * 1024 * 1024; //7MB

export type NeighborhoodUploadedFiles = Partial<
  Record<NeighborhoodFileField, Express.Multer.File[]>
>;
