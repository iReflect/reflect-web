import * as _ from 'lodash';

export class AppEnvConfig {
    apiServerHostURL = '';
    baseApiURL = '';
    useAgGridEnterprise = false;
    agGridLicenseKey = '';

    private valid: boolean;

    constructor(config: any = {}) {
        if ('apiServerHostURL' in config) {
            this.apiServerHostURL = config['apiServerHostURL'];
        }
        if ('baseApiURL' in config) {
            this.baseApiURL = config['baseApiURL'];
        }
        if ('useAgGridEnterprise' in config) {
            this.useAgGridEnterprise = config['useAgGridEnterprise'];
        }
        if ('agGridLicenseKey' in config) {
            this.agGridLicenseKey = config['agGridLicenseKey'];
        }
    }

    private validate() {
        this.valid = (this.apiServerHostURL !== '' && this.baseApiURL !== '' &&
            (!this.useAgGridEnterprise || this.agGridLicenseKey !== ''));
    }

    isValid() {
        if (_.isUndefined(this.valid)) {
            this.validate();
        }
        return this.valid;
    }
}
