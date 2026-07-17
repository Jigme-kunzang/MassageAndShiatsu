const form = document.getElementById("form");
const result = document.getElementById("result");

form.addEventListener('submit', function(e){
    const formData = new FormData(form);
    e.preventDefault();

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    result.textContent = "S'il vous plait attendez...";

    fetch( 'https://api.web3forms.com/submit', {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: json
    })
    .then(async (response) => {
        let json = await response.json();
        if (response.status == 200){
            result.textContent = json.message;
        } else {
            console.log(response);
            result.textContent = json.message;
        }
    })
    .catch(error =>{
        console.log(error);
        result.textContent = "Une erreur c'est produite !";
    })
    .then(function() {
        form.reset();
        setTimeout(() => {
            result.style.display = "none";
        }, 3000);
    });
});