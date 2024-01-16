// Function to calculate discount based on rules
function calculateDiscount(cart, rules) {
    let maxDiscount = 0;
    let discountApplied = "";

    // Check each rule and calculate discount
    for (const rule in rules) {
        const currentDiscount = rules[rule](cart);
        if (currentDiscount > maxDiscount) {
            maxDiscount = currentDiscount;
            discountApplied = rule;
        }
    }

    return { discount: discountApplied, amount: maxDiscount };
}

// Function to calculate the total price of the cart
function calculateTotal(cart) {
    let total = 0;
    for (const product of Object.keys(cart)) {
        total += cart[product].quantity * cart[product].price;
    }
    return total;
}

// Function to calculate the shipping fee
function calculateShippingFee(cart, shippingFeePerPackage) {
    const totalQuantity = Object.values(cart).reduce((acc, cur) => acc + cur.quantity, 0);
    const totalPackages = Math.ceil(totalQuantity / 10);
    return totalPackages * shippingFeePerPackage;
}

// Function to calculate the gift wrap fee
function calculateGiftWrapFee(cart) {
    let giftWrapFee = 0;
    for (const product of Object.keys(cart)) {
        if (cart[product].giftWrapped) {
            giftWrapFee += cart[product].quantity;
        }
    }
    return giftWrapFee;
}

// Main function to process the cart and generate the output
function processCart(cart) {
    const discountRules = {
        flat_10_discount: (cart) => calculateTotal(cart) > 200 ? 10 : 0,
        bulk_5_discount: (cart) => {
            for (const product of Object.keys(cart)) {
                if (cart[product].quantity > 10) {
                    return cart[product].quantity * cart[product].price * 0.05;
                }
            }
            return 0;
        },
        bulk_10_discount: (cart) => Object.values(cart).reduce((acc, cur) => acc + cur.quantity, 0) > 20 ? calculateTotal(cart) * 0.1 : 0,
        tiered_50_discount: (cart) => {
            const totalQuantity = Object.values(cart).reduce((acc, cur) => acc + cur.quantity, 0);
            for (const product of Object.keys(cart)) {
                if (cart[product].quantity > 15 && totalQuantity > 30) {
                    return cart[product].quantity * cart[product].price * 0.5;
                }
            }
            return 0;
        },
    };

    const discountResult = calculateDiscount(cart, discountRules);
    const subtotal = calculateTotal(cart);
    const shippingFee = calculateShippingFee(cart, 5);
    const giftWrapFee = calculateGiftWrapFee(cart);
    const total = subtotal - discountResult.amount + shippingFee + giftWrapFee;

    // Output
    console.log("Product Details:");
    for (const product of Object.keys(cart)) {
        console.log(`${product}: Quantity - ${cart[product].quantity}, Total - ${cart[product].quantity * cart[product].price}`);
    }
    console.log("\nSubtotal:", subtotal);
    console.log("Discount Applied:", discountResult.discount, "Amount:", discountResult.amount);
    console.log("Shipping Fee:", shippingFee);
    console.log("Gift Wrap Fee:", giftWrapFee);
    console.log("Total:", total);
}

// Example Cart
const cart = {
    ProductA: { quantity: 5, price: 20, giftWrapped: true },
    ProductB: { quantity: 15, price: 40, giftWrapped: false },
    ProductC: { quantity: 10, price: 50, giftWrapped: true },
};

// Process the cart and generate the output
processCart(cart);
