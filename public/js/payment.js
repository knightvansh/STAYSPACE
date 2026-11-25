const payBtn = document.getElementById('pay-btn');
const checkInInput = document.getElementById('check-in');
const checkOutInput = document.getElementById('check-out');
const bookingError = document.getElementById('booking-error');

if (payBtn) {
    const today = new Date().toISOString().slice(0, 10);
    checkInInput.min = today;
    checkOutInput.min = today;

    checkInInput.addEventListener('change', () => {
        const minimumCheckout = checkInInput.value
            ? new Date(new Date(`${checkInInput.value}T00:00:00.000Z`).getTime() + 86400000)
                .toISOString()
                .slice(0, 10)
            : today;
        checkOutInput.min = minimumCheckout;
        if (checkOutInput.value && checkOutInput.value < minimumCheckout) {
            checkOutInput.value = '';
        }
    });

    function showBookingError(message) {
        bookingError.textContent = message;
        bookingError.hidden = false;
    }

    payBtn.addEventListener('click', async function() {
        bookingError.hidden = true;
        if (!checkInInput.value || !checkOutInput.value || !checkInInput.checkValidity() || !checkOutInput.checkValidity()) {
            showBookingError('Choose valid check-in and check-out dates before booking.');
            return;
        }

        payBtn.disabled = true;
        try {
            const response = await fetch('/api/payment/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({
                    listingId: this.getAttribute('data-listing-id'),
                    checkIn: checkInInput.value,
                    checkOut: checkOutInput.value
                })
            });
            const data = await response.json();
            if (!response.ok || !data.success) {
                showBookingError(data.message || 'Could not reserve those dates.');
                payBtn.disabled = false;
                return;
            }

            const options = {
                "key": data.key,
                "amount": data.order.amount, 
                "currency": "INR",
                "name": "Stayspace", 
                "description": `${data.nights} night${data.nights === 1 ? '' : 's'}`,
                "order_id": data.order.id, 
                "handler": async function(paymentResponse) {
                    try {
                        const verifyRes = await fetch('/api/payment/verify-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'same-origin',
                            body: JSON.stringify({
                                razorpay_order_id: paymentResponse.razorpay_order_id,
                                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                                razorpay_signature: paymentResponse.razorpay_signature
                            })
                        });
                        const verifyData = await verifyRes.json();
                        if (verifyRes.ok && verifyData.success) {
                            window.location.reload();
                            return;
                        }
                        showBookingError(verifyData.message || 'Payment verification failed.');
                    } catch (error) {
                        console.error('Payment verification request failed:', error);
                        showBookingError('Could not verify the payment. Contact support before trying again.');
                    } finally {
                        payBtn.disabled = false;
                    }
                },
                "modal": {
                    "ondismiss": () => {
                        payBtn.disabled = false;
                    }
                }
            };

            const checkout = new Razorpay(options);
            checkout.open();
        } catch (error) {
            console.error('Booking request failed:', error);
            showBookingError('Could not start checkout. Please try again.');
            payBtn.disabled = false;
        }
    });
}