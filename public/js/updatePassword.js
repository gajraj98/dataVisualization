const baseUrl = "http://localhost:3000/";


function getOtp() {
    const phoneNumber = document.getElementById('phoneNumber').value;
    const email = document.getElementById('email').value;
    const url = baseUrl + `password-update?phoneNumber=${phoneNumber}&email=${email}`;
    const password = document.getElementById('digit1').value;
    const re_password = document.getElementById('digit2').value;
    console.log(password);
    if(password === re_password){
        const list = {
            phoneNumber:phoneNumber,
            email:  email,
            password:password
        };
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(list)
        };
        console.log(list);
        fetch(url,options)
        .then(res => {
            if (!res.ok) {
                throw new Error("Network response is not ok!");
            } else {
                return res.text();
            }
        })
        .then(data => {
            const div = document.getElementById('error');
            const p = document.createElement('p');
            p.textContent = "Password Updated Successfully";
            p.style.color = "green";
            div.appendChild(p);
                window.location.href = '/';
        })
        .catch(e => {
            console.error(e);
        })
    }
    else{
        const div = document.getElementById('error');
        const p = document.createElement('p');
        p.textContent = "password not matches";
        p.style.color = "red";
        div.appendChild(p);
    }


}

