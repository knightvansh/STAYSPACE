 const payBtn = document.getElementById('pay-btn');

if (payBtn) {
    payBtn.addEventListener('click', async function (e) { 
        e.preventDefault();
        const listingId = this.getAttribute('data-listing-id');
        
        try { 
            const response = await fetch('/api/payment/create-order', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({ amount:1000})
            });
            
            const data = await response.json();
            
            if (!data.success) {
                alert("Failed to create order. Check console.");
                return;
            } 
            
            var options = { 
                "key": "rzp_test_ThtQBiGLC853bc", 
                "amount": data.order.amount, 
                "currency": "INR",
                "name": "Stayspace", 
                "description": "Booking Transaction",
                "order_id": data.order.id, 
                "handler": async function(response) { 
                    const verifyRes = await fetch('/api/payment/verify-payment', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'same-origin',
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            listingId: listingId 
                        })
                    });

                    const verifyData = await verifyRes.json();
                    
                    if (verifyData.success) { 
                        alert("Booking Confirmed!");
                        window.location.reload(); 
                    } 
                } 
            };

            var rzp1 = new Razorpay(options);
            rzp1.open();

        } catch (error) { 
            console.error("Error connecting to backend:", error);
        } 
    }); 
}