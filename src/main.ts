import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { Amplify } from 'aws-amplify';
import { environment } from './environments/environment';

const { cognito } = environment;
const {
  userPoolId,
  userPoolClientId,
  cognitoDomain,
  scopes,
  redirectSignIn,
  redirectSignOut
} = cognito;
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId,
      userPoolClientId,
      loginWith:{
        oauth: {
          domain: cognitoDomain,
          scopes,
          redirectSignIn:[redirectSignIn],
          redirectSignOut:[redirectSignOut],
          responseType: 'code',
          providers: ['Google']
        }
      }
    },
  },
});

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
