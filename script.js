const form = document.getElementById('otp-genrator');
const emailInput = document.getElementById('email');
const otpInput = document.getElementById('otp');
const getOtpBtn = document.getElementById('get-otp');
const checkOtpBtn = document.getElementById('check-otp');
const message = document.getElementById('message');

// Use same origin when opened via server (e.g. http://localhost:3000)
const API_BASE = window.location.origin;

let generatedOtp = '';

function generateOtp() {
    return String(Math.floor(100000 + Math.random() * 900000));
}

function showMessage(text, color) {
    message.textContent = text;
    message.style.color = color;
}

async function sendOtpEmail(email, otp) {
    const res = await fetch(`${API_BASE}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to_email: email, otp }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || res.statusText);
    if (!data.ok) throw new Error(data.error || 'Send failed');
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
});

getOtpBtn.addEventListener('click', async () => {
    const email = emailInput.value.trim();

    if (!email) {
        showMessage('Enter an email address first.', '#c0392b');
        emailInput.focus();
        return;
    }

    generatedOtp = generateOtp();

    getOtpBtn.disabled = true;
    showMessage('Sending OTP to email...', '#2f75ff');

    try {
        await sendOtpEmail(email, generatedOtp);

        showMessage('OTP sent to your email.', '#11a36a');
        otpInput.value = '';
        otpInput.focus();
    } catch (error) {
        console.error(error);
        generatedOtp = '';
        showMessage(error.message || 'Failed to send OTP. Start the server and set .env (SMTP).', '#c0392b');
    } finally {
        getOtpBtn.disabled = false;
    }
});

checkOtpBtn.addEventListener('click', () => {
    const enteredOtp = otpInput.value.trim();

    if (!generatedOtp) {
        showMessage('Generate OTP first.', '#c0392b');
        return;
    }

    if (!/^\d{6}$/.test(enteredOtp)) {
        showMessage('Enter a valid 6-digit OTP.', '#c0392b');
        return;
    }

    if (enteredOtp === generatedOtp) {
        showMessage('OTP verified successfully.', '#11a36a');
    } else {
        showMessage('Invalid OTP. Try again.', '#c0392b');
    }
});
