// import { createPlacemark as placemarkAdd } from '../js/geo-elements';

function mapInit() {
    ymaps.ready(() => {
        let historyAll = {};
        let value;
        let eventClick;      
    
        // 1. Создаем карту
        let myMap = new ymaps.Map('map', {
            center: [55.650625, 37.62708],
            zoom: 10,
            controls: ['zoomControl']
        }, {
            yandexMapDisablePoiInteractivity: true
        });

        // 2. Задаем обработчик клика по нашей карте
        myMap.events.add('click', function (e) {
            let coords = e.get('coords');
            let position = e.get('position');
            let myGeoCoder = ymaps.geocode(coords);
            
            value = coords;
    
            myGeoCoder.then(res => {
                let obj = new Object();

                obj.coords = coords;
                obj.address = res.geoObjects.get(0).properties.get('text');
                openForm(obj, position, e);
            });    
        });
    
        // 3. Создаем шаблон кластера
        let customItemContentLayout = ymaps.templateLayoutFactory.createClass(
            // Флаг "raw" означает, что данные вставляют "как есть" без экранирования html.
            '<h2 class=ballon_header>{{ properties.place|raw }}</h2>' +
            '<a href="" id=mAdress class=ballon_body>{{ properties.address|raw }}</a></br></br>' +
            '<div class=ballon_body>{{ properties.feedback|raw }}</div></br>' +
            '<div class=ballon_footer>{{ properties.date|raw }}</div>', {
    
                build: function () {                
                    customItemContentLayout.superclass.build.call(this);

                    let mAdress = document.querySelector('#mAdress');

                    mAdress.addEventListener('click', this.onAddress.bind(this));
                },

                clear: function () {
                    let mAdress = document.querySelector('#mAdress');

                    mAdress.addEventListener('click', this.onAddress);                
                    customItemContentLayout.superclass.clear.call(this);
                },
        
                onAddress: function (e) {                
                    let coords = this.getData().properties._data.coords;
                    let address = this.getData().properties._data.address;            
                    let position = [e.clientX, e.clientY];
                    let obj = new Object();

                    e.preventDefault();
                    value = coords;                
                    obj.coords = coords;
                    obj.address = address;
                    openForm(obj, position, e);
                    this.events.fire('userclose');
                }    
            }
        );

        // 4. Создаем кластер
        let clusterer = new ymaps.Clusterer({
            clusterDisableClickZoom: true,
            clusterOpenBalloonOnClick: true,
            hideIconOnBalloonOpen: false,
            clusterBalloonContentLayout: 'cluster#balloonCarousel',
            clusterBalloonItemContentLayout: customItemContentLayout,
            clusterBalloonPanelMaxMapArea: 0,
            clusterBalloonContentLayoutWidth: 300,
            clusterBalloonContentLayoutHeight: 200,
            clusterBalloonPagerSize: 5
        });

        // 5. Функция создания метки на карте по координатам
        function createPlacemark(coords) {
            let placemark = new ymaps.Placemark(coords);
    
            placemark.events.add('click', (e) => {
                let position = e.get('position');
                let myGeoCoder = ymaps.geocode(coords);
                
                value = coords;        
                myGeoCoder.then(res => {
                    let obj = new Object();

                    obj.coords = coords;
                    obj.address = res.geoObjects.get(0).properties.get('text');
                    openForm(obj, position, e);
                });
            });

            return placemark;
        }
    
        // 6. Функция открытия формы
        function openForm(obj, position, e) {
            let hist;
            let addressTextModal = document.querySelector('#adressText');
            let historyFeedbackModal = document.querySelector('#historyFeedback');
            let modalForm = document.querySelector('#formFeedback');
            let addButton = document.querySelector('#addButton');
            let close = document.querySelector('.close');
            let nameInput = document.querySelector('#nameInput');
            let placeInput = document.querySelector('#placeInput');
            let feedbackInput = document.querySelector('#feedbackInput');
    
            if (!historyAll[value]) {
                hist = 'Отзывов пока нет...';
            } else hist = historyAll[value];            

            addressTextModal.textContent = obj.address;    
            historyFeedbackModal.innerHTML = hist;
    
            if (modalForm.classList.contains('modalActive')) {
                addButton.removeEventListener('click', eventClick);
            } else {
                modalForm.classList.remove('modalForm');
                modalForm.classList.add('modalActive');
            }
    
            modalForm.style = `top: ${position[1]}px ; left: ${position[0]}px;`;    
            eventClick = clickAdd.bind(e);
            addButton.addEventListener('click', eventClick);            
            close.addEventListener('click', () => {                
                nameInput.value = '';
                placeInput.value = '';
                feedbackInput.value = '';
                modalForm.classList.remove('modalActive');
                modalForm.classList.add('modalForm');
                addButton.removeEventListener('click', eventClick);
            });

            // Функция обработки клика по кнопке
            function clickAdd() {
                let date = new Date();
                let printDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
                let printTime = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2);
    
                if (nameInput.value === '') {
                    alert('Введите пожалуйста своё имя!');
                } else {
                    if (placeInput.value === '') {
                        alert('Введите пожалуйста название места!');
                    } else {
                        if (feedbackInput.value === '') {
                            alert('Введите пожалуйста свой отзыв!');
                        } else {
                            let myPlacemark = createPlacemark(obj.coords);                            
                            let messageFeedback = ['<div class="historyFeedback__box">',
                                `<strong>${nameInput.value}</strong> `,
                                `${placeInput.value}`,
                                ` <time>${printDate} ${printTime}</time>`,
                                `<span>${feedbackInput.value}</span>`,
                                '</div>'].join('');
                
                            if (historyAll[value]) {
                                historyAll[value] += messageFeedback;
                            } else {
                                historyAll[value] = messageFeedback;    
                            }
                            historyFeedbackModal.innerHTML = historyAll[value];
                            myPlacemark.properties
                                .set({
                                    name: nameInput.value,
                                    place: placeInput.value,
                                    address: obj.address,
                                    coords: obj.coords,
                                    feedback: feedbackInput.value,
                                    date: `${printDate} ${printTime}`
                                });                            
                            clusterer.add(myPlacemark);
                            myMap.geoObjects.add(clusterer);    
                            nameInput.value = '';
                            placeInput.value = '';
                            feedbackInput.value = '';
                        }
                    }
                }
            }
    
        }
    });
}

export {
    mapInit
}