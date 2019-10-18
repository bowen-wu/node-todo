const db = require('./db');
const inquirer = require('inquirer');

module.exports = {
    add: async (title) => {
        const list = await db.read();
        list.push({status: 'todo', title});
        await db.write(list);
    },
    clear: async () => {
        await db.write([]);
    },
    showAll: async () => {
        const list = await db.read();
        printTasks(list);
    },
    askForCreateTask: async () => {
        const list = await db.read();
        askForCreateTask(list);
    }
};

function printTasks(list) {
    const choices = list.map((task, index) => {
        const status = (() => {
            switch (task.status) {
                case 'todo':
                    return '[_]';
                case 'done':
                    return '[✅ ]';
                case 'delete':
                    return '[x]';
            }
        })();
        return {name: `${status} ${task.title}`, value: index.toString()};
    });

    inquirer.prompt({
        type: 'list',
        message: '请选择你想操作的任务?',
        name: 'taskIndex',
        choices: [
            {name: '退出', value: 'quit'},
            ...choices,
            {name: '创建任务', value: 'createTask'},
        ],
    })
        .then(({taskIndex}) => {
            switch (taskIndex) {
                case 'quit':
                    break;
                case 'createTask':
                    askForCreateTask(list);
                    break;
                default:
                    askForAction(list, taskIndex);
            }
        });
}

function askForCreateTask(list) {
    inquirer.prompt({
        type: 'input',
        name: 'title',
        message: '请输入任务标题',
    }).then(async ({title}) => {
        if(title) {
            list.push({status: 'todo', title});
            await db.write(list);
        } else {
            askForCreateTask(list);
        }
    });
}

function askForAction(list, taskIndex) {
    const actionChoices = [
        {name: '退出', value: 'quit'},
        {name: '已完成', value: 'maskAsDone'},
        {name: '未完成', value: 'maskAsUndone'},
        {name: '改标题', value: 'updateTitle'},
        {name: '删除', value: 'removeTask'},
    ];

    inquirer.prompt({
        type: 'list',
        massage: '请选择操作？',
        name: 'action',
        choices: actionChoices,
    }).then(async ({action}) => {
        const index = parseInt(taskIndex);
        const actions = {maskAsDone, maskAsUndone, updateTitle, removeTask};
        actions[action] && actions[action](list, index);
    });
}

function maskAsDone(list, index) {
    list[index].status = 'done';
    db.write(list);
}

function maskAsUndone(list, index) {
    list[index].status = 'todo';
    db.write(list);
}

function updateTitle(list, index) {
    inquirer.prompt({
        type: 'input',
        name: 'title',
        message: '请输入任务标题',
        default: list[index].title
    }).then(async ({title}) => {
        if(title) {
            list[index].title = title;
            await db.write(list);
        } else {
            updateTitle(list, index);
        }
    });
}

function removeTask(list, index) {
    list.splice(index, 1);
    db.write(list);
}
