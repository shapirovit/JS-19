function Init() {
    // let socket = io();
    //const socket = io('http://localhost:8080');  // ??? или let socket = io.connect('http://localhost:3000/'); 

    let socket = io();

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
                    foto: 'http://www.techportal.ru/upload/nophoto.jpg',
                    online: true
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
        if (input.value === '') {
            alert('Введите сообщение!')
        } else {
            socket.emit('chat message', socket.id, printTime, input.value);
            input.value = '';
            /* return false; */
        }            
    }

    function renderMessage(id, foto, name, time, msg) {
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
        imgBlock.setAttribute('idClient', id);
        nameBlock.textContent = name;
        timeBlock.textContent = time;
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
        socket.on('chat message', (id, foto, name, time, msg) => {
            console.log('chat message on id=', id);
            console.log('chat message on name=', name);
            console.log('chat message on time=', time);
            console.log('chat message on msg=', msg);
            renderMessage(id, foto, name, time, msg);
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
        let formLoadFoto = document.querySelector('.form-loadFoto');
        let buttonCancel = document.querySelector('.form-loadFoto-inner-button-cancel');
        let buttonLoad = document.querySelector('.form-loadFoto-inner-button-load');
        let placeDrop = document.querySelector('.form-loadFoto-inner-placeDrop');
        let placeDropFoto = document.querySelector('.form-loadFoto-inner-placeDrop-foto');
        let placeDropText = document.querySelector('.form-loadFoto-inner-placeDrop-text');

        buttonCancel.addEventListener('click', e => {
            e.preventDefault();
            formLoadFoto.classList.add('hidden');
        });

        buttonLoad.addEventListener('click', e => {
            e.preventDefault();

            if (placeDropFoto.src === "http://localhost:3000/") {
                alert('Вы не перетащили изображение для загрузки!');                    
            } else {
                socket.emit('load foto', socket.id, placeDropFoto.src);
                formLoadFoto.classList.add('hidden');
            }

        });

        placeDrop.addEventListener('click', e => {
            e.preventDefault();
        });

        document.addEventListener('click', e => {
            e.preventDefault();

        });

        placeDrop.addEventListener('drop', (e) => {
            e.preventDefault();
            const dt = e.dataTransfer;

            if (dt.files && dt.files.length) {
                const [file] = dt.files;
                const reader = new FileReader();

                if (file.size > 512 * 1024 || !(file.type === 'image/jpeg' || file.type === 'image/jpg')) {
                    alert('Можно загружать только JPG-файлы до 512кб');
                } else {

                    reader.readAsDataURL(file);
                    reader.addEventListener('load', () => {
                        // placeDropFoto.src = `url(${reader.result})`
                        placeDropText.classList.add('hidden');
                        placeDropFoto.src = `${reader.result}`;
                    });
                }
            }

        });

        document.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        document.addEventListener('drop', (e) => {
            e.preventDefault();
        });
    }

    function updateFoto() {           

        socket.on('update foto', (id, foto) => {
            let avatarFoto = document.querySelector('.block-avatar-foto');
            let imgBlocks = document.querySelectorAll('.block-right-message-foto');

            console.log('update foto socket.id=', socket.id);
            console.log('update foto id=', id);
            console.log('update foto foto=', foto);
            if (socket.id === id) {
                avatarFoto.src = foto;
            }
            for (let i = 0; i < imgBlocks.length; i++) {                    
                // console.log('imgBlocks[i].getAttribute(idClient)=', imgBlocks[i].getAttribute(idClient));

                if (imgBlocks[i].hasAttribute('idClient')) {
                    console.log('update foto imgBlocks[i] with "idClient"=', imgBlocks[i]);
                    if (imgBlocks[i].getAttribute('idClient') === id) {
                        imgBlocks[i].src = foto;
                    }

                } 
            }

        });
    }

    function historyMessage() {
        socket.on('history', (id, msgArr) => {
            if (socket.id === id) {
                for (let i = 0; i < msgArr.length; i++) {
                    let id = msgArr[i].id;
                    let foto = msgArr[i].foto;
                    let name = msgArr[i].name;
                    let time = msgArr[i].time;
                    let msg = msgArr[i].msg;
                    renderMessage(id, foto, name, time, msg);
                }
            }
        });
    }

    function updateData() {
        socket.on('update data', (id, oldId, name, oldName, foto) => {
            let avatarFoto = document.querySelector('.block-avatar-foto');
            let placeDropFoto = document.querySelector('.form-loadFoto-inner-placeDrop-foto');
            let imgBlocks = document.querySelectorAll('.block-right-message-foto');
            let topName = document.querySelectorAll('.block-right-message-top-name');

            

            if (socket.id === id) {
                avatarFoto.src = foto;
                placeDropFoto.src = foto;
            }

            for (let i = 0; i < imgBlocks.length; i++) {

                if (imgBlocks[i].hasAttribute('idClient')) {
                    if (imgBlocks[i].getAttribute('idClient') === oldId) {
                        console.log('imgBlocks[i]Before=', imgBlocks[i]);
                        console.log('topName[i]Before=', topName[i]);
                        console.log('oldId=', oldId);
                        console.log('id=', id);
                        imgBlocks[i].setAttribute('idClient', id);
                        console.log('imgBlocks[i]After=', imgBlocks[i]);
                        topName[i].textContent = name;
                        console.log('topName[i]After=', topName[i]);
                        imgBlocks[i].src = foto;
                    }

                } 
            }                
        });
    }
    
    authorization();
    submit();
    countParticipants();
    fotoLoad();
    formFoto();
    updateFoto();
    historyMessage();
    updateData();
}

export {
    Init
};