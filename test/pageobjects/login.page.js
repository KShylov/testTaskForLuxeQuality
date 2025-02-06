import { $ } from '@wdio/globals'
import Page from './page.js';

class LoginPage extends Page {

    get inputUsername () {
        return $('#user-name');
    }

    get inputPassword () {
        return $('#password');
    }

    get btnSubmit () {
        return $('#login-button');
    }
    get usernameErrorIcon () {
        return $(`//*[@id="user-name"]/following-sibling::*[@data-icon="times-circle"]`);
    }
    get passwordErrorIcon () {
        return $(`//*[@id="password"]/following-sibling::*[@data-icon="times-circle"]`);
    }
    get redMessage () {
        return $(`//*[@data-test="error"]`);
    }

    async login (username, password) {
        await this.inputUsername.setValue(username);
        await this.inputPassword.setValue(password);
        await this.btnSubmit.click();
    }

    open (page) {
        return super.open(page);
    }
}

export default new LoginPage();
