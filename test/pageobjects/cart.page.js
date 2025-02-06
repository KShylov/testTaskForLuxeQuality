import { $ } from '@wdio/globals'

class CartPage {
    get productName () {
        return $('#item_4_title_link');
    }
    get checkoutButton () {
        return $('#checkout');
    }
    get discription () {
        return $('.cart_item_label');
    }
    get cartItem () {
        return $('.cart_item');
    }
    get rootElement () {
        return $('#root');
    }
    async getPageText () {
        return await this.rootElement.getText();
    }
}

export default new CartPage();
