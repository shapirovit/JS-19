function Init() {
    // let socket = io();
    const socket = io('http://localhost');  // ??? или let socket = io.connect('http://localhost:3000/'); 

    function authorization() {
        let formBlock = document.querySelector('.form-block');
        let name = document.querySelector('#name');
        let login = document.querySelector('#login');
        let buttonAuth = document.querySelector('.form-block-button');
        let avatarText = document.querySelector('.block-avatar-name');
        let blockAvatar = document.querySelector('.block-avatar');
        let blockAvatarFoto = document.querySelector('.block-avatar-foto');
        let blockParticipants = document.querySelector('.block-participants');
        let message = document.querySelector('.block-right-bottom');

        buttonAuth.addEventListener('click', e => {                
            e.preventDefault();
            if (name.value === '' || login.value === '') {
                alert('Введите своё имя и логин!');
            } else {
                let person = {
                    login: login.value,
                    name: name.value,
                    id: socket.id,
                    foto: 'http://www.techportal.ru/upload/nophoto.jpg'
                }
                socket.emit('authorization', person);
                formBlock.classList.add('hidden');
                blockAvatar.classList.remove('hidden');
                blockParticipants.classList.remove('hidden');
                message.classList.remove('hidden');
                blockAvatarFoto.src = person.foto;
                avatarText.textContent = name.value;

                                  
            }
        });
    }    

    function addMessage(e) {
        e.preventDefault();
        let input = document.querySelector('.form-message-input');
        let date = new Date();
        let printTime = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
        console.log('input.value=', input.value);                
        socket.emit('chat message', /* socket.id, */ printTime, input.value);
        input.value = '';
        /* return false; */
    }

    function renderMessage(foto, name, time, msg) {
        let rightTop = document.querySelector('.block-right-top');
        let blockMessage = document.createElement('div');
        let fotoblock = document.createElement('div');
        let imgBlock = document.createElement('img');
        let messageTop = document.createElement('div');
        let nameBlock = document.createElement('div');
        let timeBlock = document.createElement('time');
        let messageBottom = document.createElement('div');
        let messageBlock = document.createElement('div');

        blockMessage.classList.add('block-right-message');
        fotoblock.classList.add('block-right-message-fotoblock');
        imgBlock.classList.add('block-right-message-foto');
        messageTop.classList.add('block-right-message-top');
        nameBlock.classList.add('block-right-message-top-name');
        timeBlock.classList.add('block-right-message-top-time');
        messageBottom.classList.add('block-right-message-bottom');
        messageBlock.classList.add('block-right-message-bottom-text');

        imgBlock.src = foto;
        nameBlock.textContent = name;
        timeBlock.textContent = ` ${time}`;
        messageBlock.textContent = msg;

        fotoblock.append(imgBlock);
        messageTop.append(nameBlock);
        messageTop.append(timeBlock);
        messageBottom.append(messageBlock);

        blockMessage.append(fotoblock);
        blockMessage.append(messageTop);
        blockMessage.append(messageBottom);

        rightTop.append(blockMessage);
    }

    function submit() {
        let input = document.querySelector('.form-message-input');
        let button = document.querySelector('.form-message-button');
        console.log('socket=', socket);
        button.addEventListener('click', addMessage);
        // input.addEventListener('change', addMessage);
        socket.on('chat message', (foto, name, time, msg) => {
            renderMessage(foto, name, time, msg);
            /* let message = document.querySelector('.block-right-top');
            let div = document.createElement('div');
            div.classList.add('block-right-message-bottom-text');
            div.textContent = msg;
            message.append(div);
            console.log('socket=', socket); */
        });
    };

    function renderParticipants(allClients) {
        console.log('allClients=', allClients);
            let blockParticipants = document.querySelector('.block-participants');                
            let participants = document.createElement('p');
            blockParticipants.innerHTML = '';
            blockParticipants.append(participants);

            participants.classList.add('block-participants-text-count');                
            participants.textContent = `Участники(${allClients.length})`;
            for (let i = 0; i < allClients.length; i++) {
                let clientName = document.createElement('p');
                clientName.classList.add('block-participants-text-person');
                clientName.textContent = allClients[i];
                blockParticipants.append(clientName);                    
            }
    };

    function countParticipants() {

        socket.on('plus', allClients => {
            renderParticipants(allClients);
        });
        socket.on('minus', allClients => {                
            renderParticipants(allClients);
        });
    }

    function fotoLoad() {
        let fotoChoice = document.querySelector('.block-avatar-foto-choice');
        fotoChoice.addEventListener('click', e => {
            e.preventDefault();
            let formLoadFoto = document.querySelector('.form-loadFoto');
            formLoadFoto.classList.remove('hidden');
        })

    }

    function formFoto() {
        let buttonCancel = document.querySelector('.form-loadFoto-inner-button-cancel');
        let buttonLoad = document.querySelector('.form-loadFoto-inner-button-load');
        let placeDrop = document.querySelector('.form-loadFoto-inner-placeDrop');

        buttonCancel.addEventListener('click', e => {
            e.preventDefault();
            let formLoadFoto = document.querySelector('.form-loadFoto');
            let placeDropFoto = document.querySelector('.form-loadFoto-inner-placeDrop-foto');

            formLoadFoto.classList.add('hidden');
            placeDropFoto.src = '';                
        });

        buttonLoad.addEventListener('click', e => {
            e.preventDefault();


        });

        placeDrop.addEventListener('click', e => {
            e.preventDefault();



        })





    }



    
    authorization();
    submit();
    countParticipants();
    fotoLoad();
    formFoto();
}

export {
    Init
};