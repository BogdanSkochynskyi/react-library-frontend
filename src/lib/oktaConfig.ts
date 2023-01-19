export const oktaConfig = {
    clientId: '0oa80pyku4qMxyiIS5d7',
    issuer: 'https://dev-42718531.okta.com/oauth2/default',
    redirectUri: 'http://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsChecks: true,
}