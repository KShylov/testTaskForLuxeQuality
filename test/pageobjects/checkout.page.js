import { $ } from '@wdio/globals'

class CheckoutPage {
    get discription () {
        return $('.cart_item_label');
    }
    get finishButton () {
        return $('#finish');
    }
    get continueButton () {
        return $('#continue');
    }
    get checkoutForm () {
        return $('//*[@class="checkout_info_wrapper"]/form');
    }
    get checkout_complete_container () {
        return $('#checkout_complete_container');
    }
}

export default new CheckoutPage();
