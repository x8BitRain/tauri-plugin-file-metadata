package app.tauri.filemetadata

import android.app.Activity
import android.net.Uri
import android.provider.OpenableColumns
import app.tauri.annotation.Command
import app.tauri.annotation.InvokeArg
import app.tauri.annotation.TauriPlugin
import app.tauri.plugin.Invoke
import app.tauri.plugin.JSObject
import app.tauri.plugin.Plugin

@InvokeArg
class GetFileMetadataArgs {
    lateinit var uri: String
}

@TauriPlugin
class FileMetadataPlugin(private val activity: Activity) : Plugin(activity) {
    @Command
    fun getFileMetadata(invoke: Invoke) {
        val args = invoke.parseArgs(GetFileMetadataArgs::class.java)
        val uri = Uri.parse(args.uri)

        try {
            val contentResolver = activity.contentResolver
            val cursor = contentResolver.query(uri, null, null, null, null)

            cursor?.use {
                if (it.moveToFirst()) {
                    val nameIndex = it.getColumnIndex(OpenableColumns.DISPLAY_NAME)
                    val sizeIndex = it.getColumnIndex(OpenableColumns.SIZE)

                    val fileName = if (nameIndex != -1) it.getString(nameIndex) else "unknown"
                    val fileSize = if (sizeIndex != -1) it.getLong(sizeIndex) else 0L
                    val mimeType = contentResolver.getType(uri) ?: "application/octet-stream"

                    val result = JSObject()
                    result.put("name", fileName)
                    result.put("mimeType", mimeType)
                    result.put("size", fileSize)

                    invoke.resolve(result)
                } else {
                    invoke.reject("Failed to read file metadata")
                }
            } ?: invoke.reject("Failed to query file URI")

        } catch (e: Exception) {
            invoke.reject("Error reading file metadata: ${e.message}")
        }
    }
}
