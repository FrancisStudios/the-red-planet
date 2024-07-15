import config from '../config/config.json' with {type: 'json'};

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('title').innerHTML = config.App.window.title;
});
