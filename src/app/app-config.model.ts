export interface IAppConfig {
    env: {
        // Name of the environment of which the config file is.
        name: string
    };
    apiServer: {
        hostUrl: string,
        baseUrl: string
    };
    agGridSettings: {
        useEnterprise: boolean,
        licenseKey: string
    };
}
