const baseUrl = "http://localhost:3000/";


function getOtp() {
    const phoneNumber = document.getElementById('phoneNumber').value;
    const email = document.getElementById('email').value;
    const url = baseUrl + `otp-verifection?phoneNumber=${phoneNumber}&email=${email}`;
    console.log(url);
    fetch(url)
        .then(res => {
            if (!res.ok) {
                throw new Error("Network response is not ok!");
            } else {
                return res.text();
            }
        })
        .then(data => {
           
            const otp = parseInt(data);
            const digit1 = document.getElementById('digit1').value;
            const digit2 = document.getElementById('digit2').value;
            const digit3 = document.getElementById('digit3').value;
            const digit4 = document.getElementById('digit4').value;
            const inputOTP = digit1 * 1000 + digit2 * 100 + digit3 * 10 + digit4 * 1;
            console.log(inputOTP);
            console.log(otp);
            if (inputOTP === otp) {
                window.location.href = `/password-change?phoneNumber=${phoneNumber}&email=${email}`;
            }
            else {
                const p = document.createElement('p');
                p.textContent = "Enter Correct OTP";
                p.style.color = "red";
                const div = document.getElementById('error');
                div.innerHTML = ''; 
                div.appendChild(p); 
            }
        })
        .catch(e => {
            console.error(e);
        })


}

