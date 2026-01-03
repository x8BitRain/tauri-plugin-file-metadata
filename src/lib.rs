#![cfg(mobile)]

use tauri::{
    plugin::{Builder, TauriPlugin},
    Runtime,
};

#[cfg(target_os = "android")]
const PLUGIN_IDENTIFIER: &str = "app.tauri.filemetadata";

#[cfg(target_os = "ios")]
tauri::ios_plugin_binding!(init_plugin_file_metadata);

/// Initializes the plugin.
pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("file-metadata")
        .setup(|_app, api| {
            #[cfg(target_os = "android")]
            api.register_android_plugin(PLUGIN_IDENTIFIER, "FileMetadataPlugin")?;
            #[cfg(target_os = "ios")]
            api.register_ios_plugin(init_plugin_file_metadata)?;
            Ok(())
        })
        .build()
}
