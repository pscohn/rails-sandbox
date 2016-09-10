import { PAGE_TITLE } from '../config';

var timeout;

export function flashTitle(newMsg, howManyTimes) {
    function step() {
        document.title = (document.title == PAGE_TITLE) ? newMsg : PAGE_TITLE;

        if (--howManyTimes > 0) {
            timeout = setTimeout(step, 1000);
        };
    };

    howManyTimes = parseInt(howManyTimes);

    if (isNaN(howManyTimes)) {
        howManyTimes = 5;
    };

    cancelFlashTitle(timeout);
    step();
};

export function cancelFlashTitle() {
    clearTimeout(timeout);
    document.title = PAGE_TITLE;
};
