import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
    :root {
        --bg: #004643;
        --fg: #abd1c6;
        --header: #fffffe;
        --action: #f9bc60;
        --action-text: #001e1d;
        --extra: #e16162;
        --black: #272343;
        --white: #ffffff;
        --sky-blue-crayola: #7bdff2;
        --celeste: #b2f7ef;
        --mint-cream: #eff7f6;
        --piggy-pink: #f7d6e0;
        --cotton-candy: #f2b5d4;
        --mountbatten-pink: #93748a;
        --light-coral: #ef767a;
        --middle-blue-purple: #7d7abc;
        --liberty: #6457a6;
        --cerise: #db2763;
    }

    * {
        box-sizing: border-box;
        font-family: Poppins, sans-serif;
    }

    body {
        margin: 0;
    }
`;
