import http from 'http';

const endpoints = [
    '/api/health',
    '/api/courses',
    '/api/scholars',
    '/api/policies',
    '/api/testimonials',
    '/api/about'
];

const checkEndpoint = (path: string) => {
    return new Promise((resolve) => {
        http.get(`http://localhost:5000${path}`, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const status = res.statusCode;
                const isSuccess = status && status >= 200 && status < 300;
                console.log(`${isSuccess ? '✅' : '❌'} ${path} - Status: ${status}`);
                if (!isSuccess) {
                    console.log(`   Response: ${data.substring(0, 100)}...`);
                }
                resolve(true);
            });
        }).on('error', (err) => {
            console.log(`❌ ${path} - Error: ${err.message}`);
            resolve(false);
        });
    });
};

const runChecks = async () => {
    console.log('Starting API Health Check...');
    for (const endpoint of endpoints) {
        await checkEndpoint(endpoint);
    }
    console.log('Check complete.');
};

runChecks();
