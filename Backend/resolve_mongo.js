const https = require('https');

const srvHostname = '_mongodb._tcp.cluster0.r9o6qtx.mongodb.net';
const url = `https://dns.google/resolve?name=${srvHostname}&type=SRV`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const response = JSON.parse(data);
            if (response.Answer) {
                const shards = response.Answer.map(record => {
                    // SRV record format: priority weight port target
                    const parts = record.data.split(' ');
                    const port = parts[2];
                    const target = parts[3];
                    return `${target}:${port}`;
                }).join(',');

                console.log('SHARDS=' + shards);
            } else {
                console.error('No SRV records found');
                console.error(JSON.stringify(response, null, 2));
            }
        } catch (e) {
            console.error('Error parsing JSON:', e.message);
        }
    });
}).on('error', (err) => {
    console.error('Error fetching DNS:', err.message);
});
