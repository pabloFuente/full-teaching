// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  URL_UPLOAD: 'https://localhost:5000/api-load-files/upload/course/',
  URL_PIC_UPLOAD: 'https://localhost:5000/api-load-files/upload/picture/',
  URL_EMAIL_FILE_UPLOAD: 'https://localhost:5000/api-file-reader/upload/course/',
  PUBLIC_RECAPTCHA_KEY: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
  OPENVIDU_URL: 'wss://127.0.0.1:8443/',
  CHAT_URL: 'wss://127.0.0.1:5000/chat'
};
