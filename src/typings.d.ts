/* SystemJS module definition */
declare var module: NodeModule;

interface NodeModule {
    id: string;
}

/* Allow importing json files in the application, Refer "Wildcard module declarations"
   in "https://www.typescriptlang.org/docs/handbook/modules.html"
*/
declare module '*.json' {
    const value: any;
    export default value;
}
