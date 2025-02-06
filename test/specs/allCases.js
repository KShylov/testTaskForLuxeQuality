import {assert} from 'chai'
import {JsonReader} from "../../utils/JsonReader.js";
import {filePathResolver} from "../../utils/FilePathResolver.js";
import loginPage from "../pageobjects/login.page.js";
import inventoryPage from "../pageobjects/inventory.page.js";
import cartPage from "../pageobjects/cart.page.js";
import checkoutPage from "../pageobjects/checkout.page.js";

const filePath = filePathResolver.getFilePath('testData.json');
const testData = JsonReader.readJson(filePath);

describe('Valid Login', () => {

    before(async () => {
        await loginPage.open();
    });
    it('Enter valid login into \"Login\" field', async () => {
        await loginPage.inputUsername.setValue(testData.users.standard_user);
        const actualDataStep1 = await loginPage.inputUsername.getValue();
        await assert.equal(actualDataStep1, testData.users.standard_user, "Data is entered to the field");
    });

    it('Enter valid password into \"Password\" field ', async () => {
        await loginPage.inputPassword.setValue(testData.password);
        const actualDataStep2 = await loginPage.inputPassword.getValue();
        await assert.isNotEmpty(actualDataStep2, "Data is entered to the field");
        const type = await loginPage.inputPassword.getAttribute('type');
        await assert.equal(type, 'password', "data is reprresented as dots instead of characters");
    });

    it("Click \"Login\" button", async () => {
        await loginPage.btnSubmit.click();
        const isVisibleCart = await inventoryPage.shoppingCartContainer.isDisplayed();
        await assert.isTrue(isVisibleCart, "User is redirected to the inventory page. Products and cart are displayed");

        const cards = inventoryPage.cards;
        const isVisibleCards = await cards.every(async (card) => {
            return await card.isDisplayed();
        })
        await assert.isTrue(isVisibleCards, "User is redirected to the inventory page. Products and cart are displayed");
    });
})

describe('Login with invalid password', () => {
    before(async () => {
        await loginPage.open();
    });
    it('Enter valid login into \"Login\" field', async () => {
        await loginPage.inputUsername.setValue(testData.users.standard_user);
        const actualDataStep1 = await loginPage.inputUsername.getValue();
        await assert.equal(actualDataStep1, testData.users.standard_user, "Data is entered to the field");
    });

    it('Enter invalid password into \"Password\" field', async () => {
        await loginPage.inputPassword.setValue('invalidPassword');
        const actualDataStep2 = await loginPage.inputPassword.getValue();
        await assert.isNotEmpty(actualDataStep2, "Data is entered to the field");
        const type = await loginPage.inputPassword.getAttribute('type');
        await assert.equal(type, 'password', "data is reprresented as dots instead of characters");
    });

    it("Click \"Login\" button", async () => {
        await loginPage.btnSubmit.click();
        await assert.isTrue(await loginPage.usernameErrorIcon.isDisplayed(), "\"X\" icons are displayed on the \"Login\" fields");
        await assert.isTrue(await loginPage.passwordErrorIcon.isDisplayed(), "\"X\" icons are displayed on the \"Password\" fields");
        const userHighlightedWithRed = await loginPage.inputUsername.getAttribute('class');
        await assert.include(userHighlightedWithRed, 'error', "this fields are highlighted with red");
        const passwordHighlightedWithRed = await loginPage.inputPassword.getAttribute('class');
        await assert.include(passwordHighlightedWithRed, 'error', "this fields are highlighted with red");
        const errorMessage = await loginPage.redMessage.getText();
        await assert.equal(errorMessage, testData.expectedError, "Epic sadface: Username and password do not match any user in this service\"\" error message are displayed");
    })
})

describe('Login with invalid login', () => {
    before(async () => {
        await loginPage.open();
    });
    it('Enter invalid login into \"Login\" field', async () => {
        await loginPage.inputUsername.setValue('invalidLogin');
        const actualDataStep1 = await loginPage.inputUsername.getValue();
        await assert.equal(actualDataStep1, 'invalidLogin', "Data is entered to the field");
    });

    it('Enter valid password into \"Password\" field', async () => {
        await loginPage.inputPassword.setValue('invalidPassword');
        const actualDataStep2 = await loginPage.inputPassword.getValue();
        await assert.isNotEmpty(actualDataStep2, "Data is entered to the field");
        const type = await loginPage.inputPassword.getAttribute('type');
        await assert.equal(type, 'password', "data is reprresented as dots instead of characters");
    });

    it("Click \"Login\" button", async () => {
        await loginPage.btnSubmit.click();
        await assert.isTrue(await loginPage.usernameErrorIcon.isDisplayed(), "\"X\" icons are displayed on the \"Login\" fields");
        await assert.isTrue(await loginPage.passwordErrorIcon.isDisplayed(), "\"X\" icons are displayed on the \"Password\" fields");
        const userHighlightedWithRed = await loginPage.inputUsername.getAttribute('class');
        await assert.include(userHighlightedWithRed, 'error', "this fields are highlighted with red");
        const passwordHighlightedWithRed = await loginPage.inputPassword.getAttribute('class');
        await assert.include(passwordHighlightedWithRed, 'error', "this fields are highlighted with red");
        const errorMessage = await loginPage.redMessage.getText();
        await assert.equal(errorMessage, testData.expectedError, "Epic sadface: Username and password do not match any user in this service\"\" error message are displayed");
    })
})

describe('Logout', () => {
    before(async () => {
        await loginPage.open();
        await loginPage.login(testData.users.standard_user, testData.password);
    });
    it('Click on the \"Burger\" button at the top left corner', async () => {
        await inventoryPage.burgerButton.click();
        await assert.isTrue(await inventoryPage.menu.isDisplayed(), "Menu are expanded");
        await assert.equal(await inventoryPage.menuItems.length, 4, "4 items are displayed");
    });

    it('Click on the \"Logout\" button', async () => {
        await inventoryPage.logoutButton.click();
        let actualdata = {
            url: await browser.getUrl(),
            username: await loginPage.inputUsername.getValue(),
            password: await loginPage.inputPassword.getValue()
        }
        const expectedData = {
            url: 'https://www.saucedemo.com/',
            username: '',
            password: ''
        }
        await assert.deepEqual(actualdata, expectedData, "User are redirecred to the \"Login\" page, \"Username\" and \"Password\" field are empty");
    });
});

describe('Saving the card after logout', () => {
    before(async () => {
        await loginPage.open();
        await loginPage.login(testData.users.standard_user, testData.password);
    })
    let productNameToStep5;
    it('Click on the \"Add to cart\" button near any product', async () => {
        productNameToStep5 = await inventoryPage.productName.getText()

        await inventoryPage.addToCartButton.click();
        const nearCartEl = await inventoryPage.nearTheCartElement.getText();
        await assert.equal(nearCartEl, 1, "Number near the cart at the top right increase by 1, product is added to cart");
    });

    it('Click on the "Burger" button at the top left corner', async () => {
        await inventoryPage.burgerButton.click();
        await assert.isTrue(await inventoryPage.menu.isDisplayed(), "Menu are expanded");
        await assert.equal(await inventoryPage.menuItems.length, 4, "4 items are displayed");
    });

    it('Click on the "Logout" button', async () => {
        await inventoryPage.logoutButton.click();
        let actualdata = {
            url: await browser.getUrl(),
            username: await loginPage.inputUsername.getValue(),
            password: await loginPage.inputPassword.getValue()
        }
        const expectedData = {
            url: 'https://www.saucedemo.com/',
            username: '',
            password: ''
        }
        await assert.deepEqual(actualdata, expectedData, "User are redirecred to the \"Login\" page, \"Username\" and \"Password\" field are empty");
    });

    it('Login to the account using the same valid login and password', async () => {
        await loginPage.login(testData.users.standard_user, testData.password);
        const url = await browser.getUrl();
        await assert.equal(url, 'https://www.saucedemo.com/inventory.html', "User is redirected to the inventory page");

        const isVisibleCart = await inventoryPage.shoppingCartContainer.isDisplayed();
        await assert.isTrue(isVisibleCart, "cart is displayed");

        const isVisibleCards = await inventoryPage.cards.every(async (card) => {
            return await card.isDisplayed();
        })
        await assert.isTrue(isVisibleCards, "Products are displayed");
    });

    it('Click on the "Cart" button at the top right corner', async () => {
        await inventoryPage.shoppingCartContainer.click();
        const actualDataStep5 = {
            url: await browser.getUrl(),
            productName: await cartPage.productName.getText()
        }
        const expectedDataStep5 = {
            url: 'https://www.saucedemo.com/cart.html',
            productName: productNameToStep5
        }
        await assert.deepEqual(actualDataStep5, expectedDataStep5, "Cart page is displayed, product are the same as was added at step 1");
    })
})

describe('Products', () => {
    before(async () => {
        await loginPage.open();
        await loginPage.login(testData.users.standard_user, testData.password);
    })

    let inputData = [
        {
            elements: "cardTitles",
            nameMethod: "getExpectedSortTitles",
            selector: "Name (Z to A)",
            sortColback: true
        },
        {
            elements: "cardTitles",
            nameMethod: "getExpectedSortTitles",
            selector: "Name (A to Z)",
            sortColback: false
        },
        {
            elements: "priceElements",
            nameMethod: "getExpectedSortPrices",
            selector: "Price (high to low)",
            sortColback: (a, b) => b - a
        },
        {
            elements: "priceElements",
            nameMethod: "getExpectedSortPrices",
            selector: "Price (low to high)",
            sortColback: (a, b) => a - b
        }
    ]
    for (const data of inputData) {
        it(`Choose one of the sorting options ${data.selector}`, async () => {
            const expectedPrices = await inventoryPage[data.nameMethod](data.sortColback);
            let funnelEl = await inventoryPage.funnel;
            await funnelEl.click();
            await funnelEl.selectByVisibleText(data.selector);
            let actualPrices = await inventoryPage[data.elements].map(el => el.getText());
            await assert.deepEqual(actualPrices, expectedPrices, "All products was sorted due choosed sorting");
        })
    }
});

describe('Footer Links', () => {
    before(async () => {
        await loginPage.open();
        await loginPage.login(testData.users.standard_user, testData.password);
    })

    let mainTub;

    it("Click on the \"Twitter\" icon on the footer", async () => {
        mainTub = (await browser.getWindowHandles())[0];
        let twitterUrl = await flow(mainTub, "twitter");
        await assert.include(twitterUrl, "https://x.com", "Twitter of the company is opened on the new tab");
    });

    it("Return to the main page and click on the \"Facebook\" icon on the footer", async () => {
        await browser.switchToWindow(mainTub);
        let facebookUrl = await flow(mainTub, "facebook");
        await assert.include(facebookUrl, "https://www.facebook.com", "Facebook of the company is opened on the new tab");
    });

    it("Return to the main page and click on the \"Linkedin\" icon on the footer", async () => {
        await browser.switchToWindow(mainTub);
        let linkedinUrl = await flow(mainTub, "linkedin");
        await assert.include(linkedinUrl, "https://www.linkedin.com", "Linkedin of the company is opened on the new tab");
    })

    async function flow(mainTub, name) {
        const socialElement = await inventoryPage.getSocialElementByName(name);
        await socialElement.click();
        let socialTub = (await browser.getWindowHandles()).find(id => id !== mainTub);
        await browser.switchToWindow(socialTub);
        let url = await browser.getUrl();
        await browser.closeWindow();
        return url;
    }
});

describe('Valid Checkout', () => {
    before(async () => {
        await browser.execute('window.localStorage.clear();'); // Очистка локального хранилища
        await loginPage.open();
        await loginPage.login(testData.users.standard_user, testData.password);
    })
    let productNameToStep2;
    it("Click on the \"Add to cart\" button near any product", async () => {
        productNameToStep2 = await inventoryPage.productName.getText();
        debugger;
        await inventoryPage.addToCartButton.click();
        const nearCartEl = await inventoryPage.nearTheCartElement.getText();
        await assert.equal(nearCartEl, 1, "Number near the cart at the top right increase by 1, product is added to cart");
    });

    it("Click on the \"Cart\" button at the top right corner", async () => {
        await inventoryPage.shoppingCartContainer.click();
        const actualDataStep2 = {
            url: await browser.getUrl(),
            productName: await cartPage.productName.getText()
        }
        const expectedDataStep2 = {
            url: 'https://www.saucedemo.com/cart.html',
            productName: productNameToStep2
        }
        await assert.deepEqual(actualDataStep2, expectedDataStep2, "Cart page is displayed, product are the same as was added at step 1");
    });

    let discription;

    it("Click on the \"Checkout\" button", async () => {
        discription = (await cartPage.discription.getText()).replace('Remove', '');

        await cartPage.checkoutButton.click();
        await assert.isTrue(await checkoutPage.checkoutForm.isDisplayed(), "Checkout form are displayed")
    });

    it("Fill the \"First Name\" field with valid data", async () => {
        await checkoutPage.checkoutForm.$('#first-name').setValue(testData.firstName);
        const firstName = await checkoutPage.checkoutForm.$('#first-name').getValue();
        await assert.equal(firstName, testData.firstName, "Data is entered to the field");
    });

    it("Fill the \"Second Name\" field with valid data", async () => {
        await checkoutPage.checkoutForm.$('#last-name').setValue(testData.lastName);
        const lastName = await checkoutPage.checkoutForm.$('#last-name').getValue();
        await assert.equal(lastName, testData.lastName, "Data is entered to the field");
    });

    it("Fill the \"Postal Code\" field with valid data", async () => {
        await checkoutPage.checkoutForm.$('#postal-code').setValue(testData.zipCode);
        const zipCode = await checkoutPage.checkoutForm.$('#postal-code').getValue();
        await assert.equal(zipCode, testData.zipCode, "Data is entered to the field");
    });

    it("Click on the \"Continue\" button", async () => {
        await checkoutPage.continueButton.click();
        let actualDiscription = await checkoutPage.discription.getText();
        await assert.equal(actualDiscription.trim(), discription.trim(), "User is redirected to the \"Overview\" page, Products from step 1 is displayed. Total price = price of products from step 1");
    });

    it("Click on the \"Finish\" button", async () => {
        await checkoutPage.finishButton.click();
        const actualText = await checkoutPage.checkout_complete_container.getText();
        await assert.include(actualText, "Thank you for your order!", "User is redirected to the \"Checkout Complete\" page, \"Thank you for your order!\" message are displayed");
    });

    it("Click on the \"Back Home\" button", async () => {
        await checkoutPage.checkout_complete_container.$('#back-to-products').click();
        const actualDataStep9 = {
            url: await browser.getUrl(),
            isProduct: await inventoryPage.cards.every(async (card) => {
                return await card.isDisplayed();
            }),
            cart: await inventoryPage.nearTheCartElement.isDisplayed()
        }
        const expectedData = {
            url: 'https://www.saucedemo.com/inventory.html',
            isProduct: true,
            cart: false
        }
        await assert.deepEqual(actualDataStep9, expectedData, "User is redirected to the inventory page. Products are displayed. Cart is emptye");
    });
});

describe('Checkout without products', () => {
    before(async () => {
        await loginPage.open();
        await loginPage.login(testData.users.standard_user, testData.password);
    })

    it("Click on the \"Cart\" button at the top right corner", async () => {
        await inventoryPage.shoppingCartContainer.click();
        const cartUrl = await browser.getUrl();
        await assert.equal(cartUrl, 'https://www.saucedemo.com/cart.html', "Cart page is displayed");
        await assert.isFalse(await cartPage.cartItem.isDisplayed(), "products are not displayed")
    });

    it("Click on the \"Checkout\" button", async () => {
        await cartPage.checkoutButton.click();
        let actualText = await cartPage.getPageText();
        await assert.include(actualText, "Cart is empty", "User are located on the \"Cart\" Page, error message \"Cart is empty\" are displayed");
    })
})