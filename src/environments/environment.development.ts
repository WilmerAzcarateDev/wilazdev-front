export const environment = {
  production: false,
  cognito: {
    userPoolId: 'us-east-1_P4Y0dHQlO',
    userPoolClientId: '5crd6pl0am16u6h2kvlf2df5ru',
    cognitoDomain: 'us-east-1p4y0dhqlo.auth.us-east-1.amazoncognito.com',
    redirectSignIn: 'http://localhost:4200/',
    redirectSignOut: 'http://localhost:4200/',
    scopes: ['openid', 'email', 'profile']
  }
};
