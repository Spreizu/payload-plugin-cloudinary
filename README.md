# Cloudinary Storage Plugin for Payload 3 (WIP)

This plugin provides a way to use [Cloudinary](https://cloudinary.com) with Payload.

## Features
* **Signed URLs**
  * Delivery & download URLs for original assets.
  * Delivery URL for a fixed-size thumbnail.
* **Config passthrough**
  * Ability to customize every aspect of the Cloudinary Node SDK config, as the config object is directly passed to the Cloudinary SDK.
  * Support for private CDNs and custom distribution URLs via config options.
* **Transformations**
  * Built-in support for [strict transformations](https://cloudinary.com/documentation/control_access_to_media#strict_transformations).
  Transformations are eagerly generated for every image & video on upload or when transformations are modified by the user.
  * Asynchronous generation of eager transformations using [Payload's Jobs](https://payloadcms.com/docs/jobs-queue/jobs).
  Collection entries include `isProcessing` and `hasErrors` attributes, that can be used on the frontend to show a loading icon, for example.
  * [Cloudinary Media Editor](https://cloudinary.com/documentation/media_editor) integration with Payload Admin UI.
  Users are able to directly modify the transformations provided by Cloudinary directly in the Admin UI.

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
