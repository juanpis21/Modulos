const { exec } = require('child_process');
const fs = require('fs');

exec('npm run build', (error, stdout, stderr) => {
    fs.writeFileSync('clean_build.log', stdout + '\n' + stderr, 'utf8');
});
