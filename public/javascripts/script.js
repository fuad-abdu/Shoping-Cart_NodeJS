
function addToCart(proId) {
    $.ajax({
        url: '/add-to-cart/' + proId,
        method: 'get',
        success: (response) => {
            if (response.status) {
                alert('This Product is added to Cart')
                let count = $('#cart-count').html()
                count = parseInt(count) + 1
                $('#cart-count').html(count)
            }
        }
    })
}

function funPacked(userId) {

    $.ajax({
        url: '/packed/' + userId,
        method: 'get',
        success: (response) => {
            alert(response)
        }
    })
}

function funShipped(userId) {

    $.ajax({
        url: '/shipped/' + userId,
        method: 'get',
        success: (response) => {
            alert(response)
        }
    })
}


function deleteProduct(cartId, proId) {
    $.ajax({
        url: '/delete-product',
        data: {
            cart: cartId,
            product: proId
        },
        method: 'post',
        success: (response) => {
            if (response.deleteProduct) {
                alert('Product deleted from cart')
                location.reload()
            } else {
                console.log('deleting error');
            }
        }
    })
}

function deleteWishProduct(cartId, proId) {
    $.ajax({
        url: '/delete-Wish-product',
        data: {
            wishlist: cartId,
            product: proId
        },
        method: 'post',
        success: (response) => {
            if (response.deletewishProduct) {
                alert('Product deleted from wishlist')
                location.reload()
            } else {
                console.log('deleting error');
            }
        }
    })
}

$('#checkout-form').submit((e) => {
    e.preventDefault()
    $.ajax({
        url: '/place-order',
        method: 'post',
        data: ($('#checkout-form').serialize()),
        success: (response) => {
            alert(response)
            if (response.CODsuccess) {
                location.href = '/order-success'
            } else {
                razorpayPayment(response)
            }

        }
    })
})

function razorpayPayment(order) {
    var options = {
        "key": "rzp_test_EWF1Ys4vHivF4s", // Enter the Key ID generated from the Dashboard
        "amount": order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Acme Corp",
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response) {
            verifyPayment(response, order)
        },
        "prefill": {
            "name": "Gaurav Kumar",
            "email": "gaurav.kumar@example.com",
            "contact": "9999999999"
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#F37254"
        }
    };
    var rzp1 = new Razorpay(options);
    rzp1.open();
}

function verifyPayment(payment, order) {
    $.ajax({
        url: '/verify-payment',
        data: {
            payment,
            order
        },
        method: 'post',
        success: (response) => {
            if (response.status) {
                location.href = '/order-success'
                console.log('success');
            } else {
                console.log('failed');
                alert('Payment failed')
            }
        }
    })
}

$(function () {
    $('#table').DataTable();
});

function addToWishlist(proId) {

    $.ajax({
        url: '/add-to-wishlist/' + proId,
        method: 'get',
        success: (response) => {
            if (response.status) {
                alert('This product added to wishlist')

            }
        }
    })
}


$("#myInput").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#myTable").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});
