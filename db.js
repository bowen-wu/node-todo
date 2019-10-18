const fs = require('fs');
const path = require('path');
const homedir = require('os').homedir();
const home = process.env.HOME || homedir;
const filePath = path.join(home, '.todo');

module.exports = {
    read: (path = filePath) => {
        return new Promise((resolve, reject) => {
            fs.readFile(path, {flag: 'a+'}, (error, data) => {
                if(error) return reject(error);
                try {
                    const list = JSON.parse(data.toString());
                    resolve(list);
                } catch(error) {
                    resolve([]);
                }
            });
        });
    },
    write: (content, path = filePath) => {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, `${JSON.stringify(content)}\n`, error => error ? reject(error) : resolve());
        });
    },
};
