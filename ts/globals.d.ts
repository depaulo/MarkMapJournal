// Global type extensions for custom window properties and elements

declare global {
  interface Window {
    setDarkMode?: (enabled: boolean) => Promise<void>;
    toggleDarkMode?: () => Promise<void>;
    isDarkMode?: () => boolean;
    __cmSetText?: (text: string) => void;
    __cmInsertAtCursor?: (text: string) => void;
    [key: string]: any;
  }

  interface Document {
    __mapStyleEscapeBound?: boolean;
    [key: string]: any;
  }

  interface HTMLElement {
    __bound?: boolean;
    __addImageBound?: boolean;
    [key: string]: any;
  }

  interface HTMLInputElement {
    __addImageBound?: boolean;
    [key: string]: any;
  }

  interface HTMLTextAreaElement {
    __cmSetText?: (text: string) => void;
    __cmInsertAtCursor?: (text: string) => void;
    [key: string]: any;
  }

  interface Element {
    offsetTop?: number;
    offsetLeft?: number;
    offsetWidth?: number;
    offsetHeight?: number;
  }

  interface EventTarget {
    files?: FileList;
    closest?: (selector: string) => Element | null;
    contains?: (node: Node | null) => boolean;
  }

  interface Node {
    setAttribute?: (name: string, value: string) => void;
    style?: CSSStyleDeclaration;
  }
}

export {};
