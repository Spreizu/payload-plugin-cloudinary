# Cloudinary Storage Plugin for Payload 3 (WIP)

This plugin provides a way to use [Cloudinary](https://cloudinary.com) with Payload.

## Features
* **Signed URLs**
    * Delivery and download URLs for original assets.
    * Delivery URL for a fixed-size thumbnail.
* **Config Passthrough**
    * Customize every aspect of the Cloudinary Node SDK configuration, as the config object is directly passed to the Cloudinary SDK.
    * Support for private CDNs and custom distribution URLs via configuration options.
* **Transformations**
    * Built-in support for [strict transformations](https://cloudinary.com/documentation/control_access_to_media#strict_transformations).
    * Transformations are eagerly generated for every image and video upon upload or when modified by the user.
    * Asynchronous generation of eager transformations using [Payload's Jobs](https://payloadcms.com/docs/jobs-queue/jobs).
    * Collection entries include `isProcessing` and `hasErrors` attributes, which can be used on the frontend to display a loading icon, for example.
  * Integration with [Cloudinary Media Editor](https://cloudinary.com/documentation/media_editor) in the Payload Admin UI, allowing users to directly modify transformations within the Admin UI.

## Installation
```bash
# Not yet possible
```

## Usage
TODO

## TODO-s
- [ ] **Add Service logic (in progress).**
- [ ] Signed delivery URLs for remote media thumbnails (e.g. YouTube). - Need to find a way to make this accessible. Feature itself is done.
- [ ] Ability to restore user provided transformations in the Media Editor.
- [ ] Update Admin UI in the details view when `isProcessing` or `hasErrors` attributes change for the file.
