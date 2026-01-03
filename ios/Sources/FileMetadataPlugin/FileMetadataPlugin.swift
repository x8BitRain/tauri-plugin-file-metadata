import UIKit
import Tauri
import WebKit
import UniformTypeIdentifiers

class GetFileMetadataArgs: Decodable {
    let uri: String
}

class FileMetadataPlugin: Plugin {
    @objc public func getFileMetadata(_ invoke: Invoke) throws {
        let args = try invoke.parseArgs(GetFileMetadataArgs.self)

        guard let url = URL(string: args.uri) else {
            invoke.reject("Invalid URI")
            return
        }

        // Get security-scoped access
        guard url.startAccessingSecurityScopedResource() else {
            invoke.reject("Failed to access file")
            return
        }

        defer {
            url.stopAccessingSecurityScopedResource()
        }

        do {
            var resourceKeys: Set<URLResourceKey> = [.nameKey, .fileSizeKey]
            if #available(iOS 14.0, *) {
                resourceKeys.insert(.contentTypeKey)
            }

            let resourceValues = try url.resourceValues(forKeys: resourceKeys)

            let fileName = resourceValues.name ?? "unknown"
            let fileSize = resourceValues.fileSize ?? 0

            var mimeType = "application/octet-stream"
            if #available(iOS 14.0, *) {
                mimeType = resourceValues.contentType?.preferredMIMEType ?? "application/octet-stream"
            }

            invoke.resolve([
                "name": fileName,
                "mimeType": mimeType,
                "size": fileSize
            ])
        } catch {
            invoke.reject("Error reading file metadata: \(error.localizedDescription)")
        }
    }
}

@_cdecl("init_plugin_file_metadata")
func initPlugin() -> Plugin {
    return FileMetadataPlugin()
}
