import FSCanvasEngineIDGenerator from '../utils/id-generator.js';

export default class FSCanvasEngineErrorLogger {
    /**
     * Display an Error Message
     * @param {string} title - Usually Error
     * @param {string} text  - Description of issue
     */
    static displayErrorMessage(title, text) {
        const id = FSCanvasEngineIDGenerator.generateId(64);

        document
            .getElementById('alerts-wrapper')
            .insertAdjacentHTML('beforeend', `
                <div class="alert-box error" id="${id}">
                <h2 class="alert-title">
                    ${title} 
                    <input type="button" class="close-error" value="x" id="${id}-button"/>
                </h2>
                <p class="alert-text">
                   ${text}
                </p>
                </div>
            `);

        /* Remove Error From SCR */
        document.addEventListener('DOMContentLoaded', () => {
            document
                .querySelectorAll('.close-error')
                .forEach(el => {
                    el.addEventListener('click',
                        (e) => {
                            if (document.getElementById(e.target.id.split('-')[0]) && e.target.id.split('-')[1] === 'button') {
                                document.getElementById(e.target.id.split('-')[0]).remove();
                            }
                        }
                    );
                })

        });
    }
}