export interface StoredFile {
  filename: string;
  originalName: string;
  extension: string;
  mimeType: string;
  size: number;
  folder: string | null;
  relativePath: string;
  absolutePath: string;
  url: string;
}
