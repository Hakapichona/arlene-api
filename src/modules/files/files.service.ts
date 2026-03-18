import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import * as fs from 'fs/promises';
import { existsSync } from 'fs';
import { extname, isAbsolute, join, normalize, resolve } from 'path';
import { StoreFileOptions } from './dto/store-file-options.dto';
import { StoredFile } from './interfaces/stored-file.interface';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  private readonly baseUploadDir: string;
  private readonly publicPrefix: string;

  constructor(private readonly configService: ConfigService) {
    const configuredBaseDir =
      this.configService.get<string>('UPLOAD_BASE_DIR') ?? 'uploads';

    this.baseUploadDir = isAbsolute(configuredBaseDir)
      ? normalize(configuredBaseDir)
      : normalize(resolve(process.cwd(), configuredBaseDir));

    this.publicPrefix = this.normalizePublicPrefix(
      this.configService.get<string>('UPLOAD_PUBLIC_PREFIX') ?? '/uploads',
    );
  }

  async store(
    file: Express.Multer.File,
    options?: StoreFileOptions,
  ): Promise<StoredFile> {
    if (!file) {
      throw new BadRequestException('No se envió ningún archivo');
    }

    const normalizedFolder = this.normalizeFolder(options?.folder);
    const allowedExtensions = this.normalizeExtensions(
      options?.allowedExtensions,
    );

    const originalExtension = extname(file.originalname).toLowerCase();

    if (
      allowedExtensions.length > 0 &&
      !allowedExtensions.includes(originalExtension)
    ) {
      throw new BadRequestException(
        `Extensión no permitida. Extensiones aceptadas: ${allowedExtensions.join(', ')}`,
      );
    }

    const filename = `${randomUUID()}${originalExtension}`;
    const relativePath = normalizedFolder
      ? join(normalizedFolder, filename)
      : filename;

    const normalizedRelativePath = this.normalizeRelativeFilePath(relativePath);

    const absolutePath = resolve(this.baseUploadDir, normalizedRelativePath);
    const absoluteDir = normalizedFolder
      ? resolve(this.baseUploadDir, normalizedFolder)
      : resolve(this.baseUploadDir);

    this.ensurePathInsideBaseDir(absoluteDir);
    this.ensurePathInsideBaseDir(absolutePath);

    try {
      await this.ensureDirectoryExists(this.baseUploadDir);
      await this.ensureDirectoryExists(absoluteDir);

      await fs.writeFile(absolutePath, file.buffer);

      return {
        filename,
        originalName: file.originalname,
        extension: originalExtension,
        mimeType: file.mimetype,
        size: file.size,
        folder: normalizedFolder,
        relativePath: normalizedRelativePath,
        absolutePath: normalize(absolutePath),
        url: this.buildPublicUrl(normalizedRelativePath),
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error guardando archivo: ${err.message}`, err.stack);
      throw new BadRequestException('No se pudo guardar el archivo');
    }
  }

  async deleteByUrl(url?: string | null): Promise<void> {
    if (!url) return;

    if (!url.startsWith(this.publicPrefix)) {
      this.logger.warn(`Intento de borrado fuera del prefijo público: ${url}`);
      throw new BadRequestException('URL de archivo inválida');
    }

    const relativePath = url
      .slice(this.publicPrefix.length)
      .replace(/^\/+/, '');

    await this.deleteByRelativePath(relativePath);
  }

  async deleteByRelativePath(relativePath?: string | null): Promise<void> {
    if (!relativePath) return;

    const normalizedRelativePath = this.normalizeRelativeFilePath(relativePath);
    const absolutePath = resolve(this.baseUploadDir, normalizedRelativePath);

    this.ensurePathInsideBaseDir(absolutePath);

    try {
      if (!existsSync(absolutePath)) return;
      await fs.unlink(absolutePath);
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Error eliminando archivo (${absolutePath}): ${err.message}`,
        err.stack,
      );
      throw new BadRequestException('No se pudo eliminar el archivo');
    }
  }

  buildPublicUrl(relativePath: string): string {
    const normalizedRelativePath = this.normalizeRelativeFilePath(relativePath);

    return `${this.publicPrefix}/${normalizedRelativePath}`.replace(
      /\/+/g,
      '/',
    );
  }

  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    this.ensurePathInsideBaseDir(dirPath);
    await fs.mkdir(dirPath, { recursive: true });
  }

  private normalizeFolder(folder?: string): string | null {
    if (!folder) return null;

    const cleaned = normalize(folder)
      .replace(/^([/\\])+/, '')
      .replace(/([/\\])+$/, '')
      .replace(/\\/g, '/');

    if (!cleaned || cleaned === '.') {
      return null;
    }

    const segments = cleaned.split('/').filter(Boolean);

    if (
      segments.some(
        (segment) =>
          segment === '.' || segment === '..' || segment.includes('..'),
      )
    ) {
      throw new BadRequestException('La carpeta destino es inválida');
    }

    return segments.join('/');
  }

  private normalizeExtensions(extensions?: string[]): string[] {
    if (!extensions || extensions.length === 0) {
      return [];
    }

    return [
      ...new Set(
        extensions
          .map((ext) => ext.trim().toLowerCase())
          .filter(Boolean)
          .map((ext) => (ext.startsWith('.') ? ext : `.${ext}`)),
      ),
    ];
  }

  private normalizePublicPrefix(prefix: string): string {
    const cleaned = `/${prefix}`.replace(/\/+/g, '/');

    return cleaned.endsWith('/') && cleaned !== '/'
      ? cleaned.slice(0, -1)
      : cleaned;
  }

  private normalizeRelativeFilePath(relativePath: string): string {
    const normalizedPath = normalize(relativePath)
      .replace(/^([/\\])+/, '')
      .replace(/\\/g, '/');

    const segments = normalizedPath.split('/').filter(Boolean);

    if (
      !normalizedPath ||
      normalizedPath === '.' ||
      segments.length === 0 ||
      segments.some(
        (segment) =>
          segment === '.' || segment === '..' || segment.includes('..'),
      )
    ) {
      throw new BadRequestException('Ruta de archivo inválida');
    }

    return segments.join('/');
  }

  private ensurePathInsideBaseDir(absolutePath: string): void {
    const resolvedBase = resolve(this.baseUploadDir);
    const resolvedTarget = resolve(absolutePath);

    if (
      resolvedTarget !== resolvedBase &&
      !resolvedTarget.startsWith(`${resolvedBase}/`) &&
      !resolvedTarget.startsWith(`${resolvedBase}\\`)
    ) {
      this.logger.warn(`Path traversal detectado: ${resolvedTarget}`);
      throw new BadRequestException('Ruta de archivo inválida');
    }
  }
}
