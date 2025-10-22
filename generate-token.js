const jose = require('jose');

async function generateToken() {
  const secret = new TextEncoder().encode('your-secret-key');

  const token = await new jose.SignJWT({
    sub: 'user_123',
    email: 'rifat@practicelink.com',
    org_id: 'org_456',
    roles: ['admin', 'hcp', 'user'],
    scopes: ['read', 'write'],
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);

  console.log('Generated Token:');
  console.log(token);
}

generateToken();
