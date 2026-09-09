export const environment = {
  production: true,
  cognito: {
    userPoolId: 'us-east-1_P4Y0dHQlO',
    userPoolClientId: '5crd6pl0am16u6h2kvlf2df5ru',
    cognitoDomain: 'us-east-1p4y0dhqlo.auth.us-east-1.amazoncognito.com',
    redirectSignIn: [
      'https://wilazdev-front.jhonazcaratework.workers.dev/',
      'http://localhost:4200/'
    ],
    redirectSignOut: [
      'https://wilazdev-front.jhonazcaratework.workers.dev/',
      'http://localhost:4200/'
    ],
    scopes: ['openid', 'email', 'profile']
  }
};
