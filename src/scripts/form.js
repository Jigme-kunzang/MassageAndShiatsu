form.addEventListener('submit', function(e){
    e.preventDefault();

    // --- contrôle du captcha ---
    const captchaField = form.querySelector('textarea[name="h-captcha-response"]');
    const hCaptcha = captchaField ? captchaField.value : "";

    if (!hCaptcha) {
        alert("S'il vous plaît, remplissez le captcha !");
        return;
    }

    // --- construction du payload (inclut h-captcha-response) ---
    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    result.textContent = "S'il vous plaît, patientez...";

    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: json
    })
    .then(async (response) => {
        let json = await response.json();
        result.textContent = json.message;
        if (response.status != 200) console.log(response);
    })
    .catch(error => {
        console.log(error);
        result.textContent = "Une erreur s'est produite !";
    })
    .then(function() {
        form.reset();
        setTimeout(() => { result.style.display = "none"; }, 3000);
    });
});