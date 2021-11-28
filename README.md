# google-apps-script-backblaze

This is a [Google Apps Script (GAS)](https://developers.google.com/apps-script) project with the minimal amount of code needed to upload a Google Drive file to [Backblaze B2 Cloud Storage](https://www.backblaze.com/b2/cloud-storage.html) using the [B2 API](https://www.backblaze.com/b2/docs/). It's intended to be copied into other projects and modified as necessary. 

This code assumes the file you want to upload to Backblaze has **already been uploaded to Google Drive**.

## Setting up the Google Drive file

1. Upload any file to Google Drive. Rename the file to what you want it to appear in Backblaze as.
2. In Google Drive, `right click > get link` and note the file's ID (the ID should look like this: `1xUrGGbaQLVRnytUKtnINAxzild0PBeJZ`).

## Setting up Backblaze

3. In Backblaze, create a new application key with write access to the storage bucket where you want to upload the file to.
4. Note the `keyID` and `applicationKey` shown.

## Setting up the GAS project

5. Create a [new GAS project](https://script.new).
6. Copy `Code.gs` from this repository into the GAS project.
7. Create the following [Google Apps Script properties](https://developers.google.com/apps-script/guides/properties) (environment variables):
- `FILE_ID` - the Google Drive file ID from step 2.
- `BACKBLAZE_ID` - the Backblaze application key ID (`keyId`) from step 4.
- `BACKBLAZE_KEY` - the Backblaze application key (`applicationKey`) from step 4.

**NOTE**: if you can't find where to create GAS properties, switch to the legacy UI (Click `Use legacy editor` on the top right side of the UI) and go to `File > Project properties > Script properties`.

## Usage

After completing the initial setup, execute the `uploadToBackblaze` function to upload the Google Drive file to Backblaze.
