const { App } = require('./config/config.json');

document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelector('title').innerHTML = App.window.title;
});
