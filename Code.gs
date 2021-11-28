const PROPERTIES = PropertiesService.getScriptProperties();
const FILE_ID = PROPERTIES.getProperty('FILE_ID');
const BACKBLAZE_ID = PROPERTIES.getProperty('BACKBLAZE_ID');
const BACKBLAZE_KEY = PROPERTIES.getProperty('BACKBLAZE_KEY');

function uploadToBackblaze() {
  // b2_authorize_account
  const credentials = `Basic ${Utilities.base64Encode(`${BACKBLAZE_ID}:${BACKBLAZE_KEY}`)}`;
  const authOptions = {
    'headers': {
      'Authorization': credentials
    }
  };
  const authResponse = UrlFetchApp.fetch('https://api.backblazeb2.com/b2api/v2/b2_authorize_account', authOptions);
  const authJson = JSON.parse(authResponse.getContentText());
  const apiUrl = authJson['apiUrl']; // Must use this host for the next API call
  let authToken = authJson['authorizationToken']; // This token can change after calling b2_get_upload_url
  const bucketId = authJson['allowed']['bucketId'];

  // b2_get_upload_url
  const getUploadUrlOptions = {
    'method': 'POST',
    'headers': {
      'Authorization': authToken
    },
    'payload': JSON.stringify({
      'bucketId': bucketId
    })
  };
  const getUploadUrlResponse = UrlFetchApp.fetch(`${apiUrl}/b2api/v2/b2_get_upload_url`, getUploadUrlOptions);
  const getUploadUrlJson = JSON.parse(getUploadUrlResponse.getContentText());
  authToken = getUploadUrlJson['authorizationToken'];
  const uploadUrl = getUploadUrlJson['uploadUrl'];

  // b2_upload_file
  const file = DriveApp.getFileById(FILE_ID);
  const fileName = file.getName();
  const mimeType = file.getMimeType();
  const contentLength = file.getSize();
  const data = file.getBlob();
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_1, data.getBytes());
  let sha1 = '';
  for (let byte of digest) {
    if (byte < 0) {
      byte += 256; // Negative values are 8-bit overflows, need to add 256
    }
    sha1 += byte.toString(16).padStart(2, '0');
  }

  const uploadOptions = {
    'method': 'POST',
    'headers': {
      'Authorization': authToken,
      'X-Bz-File-Name': fileName,
      'Content-Type': mimeType,
      'X-Bz-Content-Sha1': sha1
    },
    'contentLength': contentLength,
    'payload': data
  }
  const uploadResponse = UrlFetchApp.fetch(uploadUrl, uploadOptions);

  console.log(uploadResponse);
}
