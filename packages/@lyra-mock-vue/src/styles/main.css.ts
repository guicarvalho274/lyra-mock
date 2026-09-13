export const styles = `
    :root {
        --lyra-mock-font-core: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial,
            Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
            --font-core-mock-lyra: var(--lyra-mock-font-core);
        --lyra-mock-color-primary: #6366f1;
        --lyra-mock-color-bg: #fff;
        --lyra-mock-radius-md: 6px;

        --lyra-mock-font-weight-light: 300;
        --lyra-mock-font-weight-regular: 400;
        --lyra-mock-font-weight-medium: 500;
        --lyra-mock-font-weight-semibold: 600;
        --lyra-mock-font-weight-bold: 700;
        --lyra-mock-font-weight-extrabold: 800;
        --lyra-mock-font-weight-black: 900;

        --lyra-mock-color-text-dark: #3b3b3b;
        --lyra-mock-color-text-gray: #8a8a8a;
        --lyra-mock-color-border: #eaeaea;
        --lyra-mock-color-foregound-color: white;
        --lyra-mock-color-white-bg-hover:#f5f5f5; 
        --lyra-mock-box-shadow-light: 0px 4px 15px rgba(0, 0, 0, 0.048);

        /**Fonts**/
        --lyra-mock-font-size-minimum: 12px;
    }

    [data-lyra-mock], 
    [data-lyra-mock] * {
        font-family: var(--font-core-mock-lyra);
        font-weight: var(--lyra-mock-font-weight-regular);
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    [data-lyra-mock] .flex-column{
        display: flex;
        flex-direction: column;
    }

    [data-lyra-mock] .flex{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    [data-lyra-mock] .inline-flex{
        display: inline-flex;
    }


    [data-lyra-mock] .flex-justify-start{
        justify-content: flex-start;
    }

    [data-lyra-mock] .flex-justify-end{
        justify-content: flex-end;
    }

    [data-lyra-mock] .flex-justify-center{
        justify-content: center;
    }

    [data-lyra-mock] .flex-align-center{
        align-items: center;
    }

    [data-lyra-mock] .flex-align-start{
        align-items: flex-start;
    }

    [data-lyra-mock] .flex-align-end{
        align-items: flex-end;
    }

    [data-lyra-mock-title].title{
        font-size: clamp(13px, 1.3vw, 14px);
        color: var(--lyra-mock-color-text-dark);
        font-weight: var(--lyra-mock-font-weight-bold);
    }

    [data-lyra-mock-subtitle].subtitle-mock{
        font-size: var(--lyra-mock-font-size-minimum);
        font-weight: var(--lyra-mock-font-weight-medium);
        color: var(--lyra-mock-color-text-gray);
        padding-top: 10px;
        padding-inline: 16px;
        padding-bottom: 4px;
    }

        
    [data-lyra-mock-toogle].toogle {
        position: relative;
        width: 30px;
        height: 18px;
        border-radius: 9999px;
        background: var(--lyra-mock-color-border);
        cursor: pointer;
        transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        border: none;
        padding: 0;
        outline: none;
    }

    [data-lyra-mock-toogle].toogle::before {
        content: '';
        position: absolute;
        top: 3px;
        left: 3px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--lyra-mock-color-foregound-color);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
        transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 2;
    }

    [data-lyra-mock-toogle].toogle::after {
        content: '';
        position: absolute;
        top: 3px;
        right: 3px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--lyra-mock-color-text-dark);
        opacity: 0;
        transform: scale(0);
        transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                    opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1;
    }

    [data-lyra-mock-toogle].toogle.active,
    [data-lyra-mock-toogle].toogle.is-active {
        background: #22c55e;
    }

    [data-lyra-mock-toogle].toogle.active::before,
    [data-lyra-mock-toogle].toogle.is-active::before {
        transform: translateX(16px);
    }

    [data-lyra-mock-toogle].toogle.active::after,
    [data-lyra-mock-toogle].toogle.is-active::after {
        opacity: 1;
        transform: scale(2.6);
        background: #22c55e;
    }

    [data-lyra-mock-toogle].toogle:hover {
        filter: brightness(0.95);
    }






`