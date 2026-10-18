export const environment = {
  production: true,
  gateways: {
    api: 'https://gjbak5peji.execute-api.us-east-1.amazonaws.com',
    ia: '',
  },
  cognito: {
    userPoolId: 'us-east-1_P4Y0dHQlO',
    userPoolClientId: '5crd6pl0am16u6h2kvlf2df5ru',
    cognitoDomain: 'us-east-1p4y0dhqlo.auth.us-east-1.amazoncognito.com',
    redirectSignIn: 'https://wilazdev-front.jhonazcaratework.workers.dev/',
    redirectSignOut: 'https://wilazdev-front.jhonazcaratework.workers.dev/',
    scopes: ['openid', 'email', 'profile']
  }
};
