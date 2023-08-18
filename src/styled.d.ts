import "styled-components";

// and extend them!
declare module "styled-components" {
  export interface DefaultTheme {
    headerColor: string;
    bgColor: string;
    boardColor: string;
    cardColor: string;
    textColor: string;
    AddBgColor: string;
    AddtextColor: string;
  }
}
