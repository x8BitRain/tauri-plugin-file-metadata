import { invoke } from '@tauri-apps/api/core'

export interface FileMetadata {
  name: string
  mimeType: string
  size: number
}

/**
 * Get file metadata from a content URI on mobile platforms (for now) without having to read the entire file into memory.
 *
 * @param uri - The content URI to get metadata for
 * @returns Promise resolving to the file metadata
 *
 * @example
 * ```typescript
 * import { getFileMetadata } from 'tauri-plugin-file-metadata'
 *
 * const metadata = await getFileMetadata('content://...')
 * console.log(`File: ${metadata.name}, Size: ${metadata.size} bytes, Mime: ${metadata.mimeType}`)
 * ```
 */
export async function getFileMetadata(uri: string): Promise<FileMetadata> {
  return await invoke<FileMetadata>('plugin:file-metadata|getFileMetadata', {
    uri
  })
}
