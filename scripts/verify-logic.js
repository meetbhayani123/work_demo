const jwt = require('jsonwebtoken');

const SECRET = 'secret';
const USER_ID = '123456789012345678901234';

console.log('--- Verifying Stateless Refresh Token Logic ---');

// 1. Simulate Server Issuing Token
const refreshTokenExpires = 7 * 24 * 60 * 60;
const refreshToken = jwt.sign(
    {
        userId: USER_ID,
        tokenType: 'refresh'
    },
    SECRET,
    { expiresIn: refreshTokenExpires }
);
console.log('[SUCCESS] Generated token:', refreshToken);

// 2. Simulate Server Verifying Token
try {
    const payload = jwt.verify(refreshToken, SECRET);
    console.log('[SUCCESS] Verified token payload:', payload);

    if (payload.tokenType !== 'refresh') {
        throw new Error('Invalid token type');
    }
    if (payload.userId !== USER_ID) {
        throw new Error('User ID mismatch');
    }
    console.log('[SUCCESS] Token validation checks passed.');
} catch (error) {
    console.error('[FAILED] Token verification failed:', error.message);
    process.exit(1);
}

// 3. Verify Invalid Token Rejection
try {
    const invalidToken = jwt.sign({ userId: USER_ID, tokenType: 'access' }, SECRET, { expiresIn: '1h' });
    const payload = jwt.verify(invalidToken, SECRET);
    if (payload.tokenType !== 'refresh') {
        console.log('[SUCCESS] correctly identified invalid token type');
    } else {
        console.error('[FAILED] Accepted invalid token type');
    }
} catch (e) {
    // verify might not throw if signature valid, but we check tokenType manually in code
}
