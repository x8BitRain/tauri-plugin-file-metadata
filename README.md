# Tauri Plugin File Metadata

Get file metadata using content URIs on Android and iOS without having to load the entire file into memory first. 

No plans to expand this to desktop platforms yet, if you want to contribute support for Mac/Win/Linux, please open a PR!

## Typescript/JS Usage

```typescript
import { open } from '@tauri-apps/plugin-dialog';
import { getFileMetadata } from 'tauri-plugin-file-metadata';

// Get file URI from dialog
const selected = await open({ multiple: false });
const metadata = await getFileMetadata(selected.path);

console.log(metadata.name);      // File name
console.log(metadata.mimeType);  // MIME type
console.log(metadata.size);      // File size in bytes

// OR

const metadata = await invoke<FileMetadata>('plugin:file-metadata|getFileMetadata', {
  uri: selected.path
});
```

## Installation

I've not added this to NPM yet, for now you can clone/git submodule this repo into your project and reference it in your Cargo.toml and package.json manually. 

```json
"dependencies": {
  "tauri-plugin-file-metadata": "./plugins/tauri-plugin-file-metadata",
}
```

Then `npm/bun/pnpm/yarn install`.

Add the Rust plugin to your `src-tauri/Cargo.toml`:

```toml
[dependencies]
tauri-plugin-file-metadata = { path = "../plugins/tauri-plugin-file-metadata" }
```

Register the plugin in your `src-tauri/src/lib.rs`:

```rust
#[cfg(mobile)]
{
    builder = builder
        .plugin(tauri_plugin_file_metadata::init());
}
```

## Permissions

Add to your `src-tauri/capabilities/mobile-capability.json`:

```json
{
  "permissions": [
    "file-metadata:default"
  ]
}
```

## Platform Details

### Android
Uses Android's `ContentResolver` to query the content URI and extract:
- File name via `OpenableColumns.DISPLAY_NAME`
- File size via `OpenableColumns.SIZE`
- MIME type via `ContentResolver.getType()`

### iOS
Uses security-scoped resource access and `URLResourceValues` to extract:
- File name via `.nameKey`
- File size via `.fileSizeKey`
- MIME type via `.contentTypeKey` and `preferredMIMEType`
