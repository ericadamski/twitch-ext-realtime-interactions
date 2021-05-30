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
    }

    * {
        box-sizing: border-box;
        font-family: Poppins, sans-serif;
    }

    body {
        margin: 0;
    }
`;
