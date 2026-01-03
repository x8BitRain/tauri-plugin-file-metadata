// swift-tools-version:5.9
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "tauri-plugin-file-metadata",
    platforms: [
        .iOS(.v13)
    ],
    products: [
        .library(
            name: "tauri-plugin-file-metadata",
            type: .static,
            targets: ["FileMetadataPlugin"]
        )
    ],
    dependencies: [
        .package(name: "Tauri", path: "../.tauri/tauri-api")
    ],
    targets: [
        .target(
            name: "FileMetadataPlugin",
            dependencies: [
                .product(name: "Tauri", package: "Tauri")
            ]
        )
    ]
)
