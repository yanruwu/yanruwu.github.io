var password="quebuenosamigos"

function passcheck() {
    if(document.getElementById('main-password').value !=password){
        alert('Contraseña incorrecta, por favor compruebe sus datos.');
        return false;
    }

    if(document.getElementById('main-password').value ==password){
        return true;
    }

}



