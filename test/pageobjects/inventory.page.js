import { $ } from '@wdio/globals'


class InventoryPage {
    get priceElements () {
        return $$('.inventory_item_price');
    }
    get shoppingCartContainer () {
        return $('#shopping_cart_container');
    }
    get funnel() {
        return $('.product_sort_container');
    }
    get cards () {
        return $$('//*[@data-test="inventory-item"]');
    }
    get burgerButton () {
        return $('#react-burger-menu-btn');
    }
    get logoutButton () {
        return $('#logout_sidebar_link');
    }
    get addToCartButton () {
        return $('#add-to-cart-sauce-labs-backpack');
    }
    get nearTheCartElement () {
        return $('//*[@data-test="shopping-cart-badge"]');
    }
    get menu() {
        return $('//*[@id="menu_button_container"]/descendant::*[@class="bm-item-list"]');
    }
    get productName () {
        return $('#item_4_title_link');
    }
    get cardTitles () {
        return $$('.inventory_item_name');
    }
    get menuItems () {
        return $$('//*[@class="bm-item menu-item"]');
    }
    async  getExpectedSortPrices(colback) {
        let pr = await this.priceElements.map(async (el) => {
            let str = await el.getText();
            return parseFloat(str.replace('$', ''));
        });
        return pr.sort(colback).map(el => '$' + el);
    }
    async  getExpectedSortTitles(isReverse) {
        let pr = await this.cardTitles.map(el => el.getText());
        return isReverse ? pr.sort().reverse() : pr.sort();
    }
    getSocialElementByName(name) {
        return $(`//*[@data-test="social-${name}"]`);
    }
}

export default new InventoryPage();
