// Define baseUrl
const baseUrl = "http://localhost:3000/";

$(document).ready(function () {
    // Initialize intl-tel-input
    var input = document.querySelector("#phoneNumber");
    var iti = window.intlTelInput(input, {
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
        separateDialCode: true, // Display country code in a separate input
    });

    // Listen for changes in the country code input and update the flag accordingly
    $("#countryCode").on("input", function () {
        var countryCode = $(this).val();
        iti.setCountry(countryCode); // Set the flag based on the country code
    });
});

function postNumber() {
    const url = baseUrl + 'verifyPhoneNumber';
    const input = document.querySelector("#phoneNumber");
    const email = document.getElementById('email').value;
      
    // Get the selected country code using the intl-tel-input plugin
    const selectedCountryData = window.intlTelInputGlobals.getInstance(input).getSelectedCountryData();
    const countryCode = selectedCountryData.dialCode;

    const formData = {
        code: countryCode,
        number: input.value,
        email:email
    };

   

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    };

    fetch(url, options)
        .then(res => {
            if (!res.ok) {
                throw new Error("Network response is not ok!");
            } else {
                const phoneNumber =input.value;
                window.location.href = `/enter-otp?phoneNumber=${phoneNumber}&email=${email}`;
                return res.text();
            }
        })
        .then(data =>{
            console.log('phonenumber.js');
            window.location.href = `/enter-otp?phoneNumber=${input.value}&email=${email}`;
        })
        .catch(error =>{
            console.log('phonenumber.js1');
            console.error(error);
        });
}

