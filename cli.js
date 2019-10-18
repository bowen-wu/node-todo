#!/usr/bin/env node

const api = require('./index');

const program = require('commander');

const operator = (promise) => {
    promise.then(() => console.log('Success 🎉'), () => console.log('Fail 🤢'));
};

program
    .command('add')
    .description('add task')
    .action((...args) => {
        const task = args.slice(0, -1).join(' ');
        if(task) {
            operator(api.add(task));
        } else {
            api.askForCreateTask();
        }
    });

program
    .command('clear')
    .description('clear all tasks')
    .action(() => {
        operator(api.clear());
    });

program.parse(process.argv);

if(process.argv.length === 2) {
    api.showAll();
}

