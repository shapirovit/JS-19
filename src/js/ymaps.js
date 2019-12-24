// import { createPlacemark as placemarkAdd } from '../js/geo-elements';

let placemarkObjects= [];

function mapInit() {
    ymaps.ready(() => {
        let historyAll = {};
        let value;
        let adressGet = 'Тут будет определен адрес!!!';
        let eventClick;
      
    
        // 1. Создаем карту
        let myMap = new ymaps.Map('map', {
                center: [55.650625, 37.62708],
                zoom: 10
            }, {
                searchControlProvider: 'yandex#search'
            });
        
    
        // 2. Создаем шаблон кластера
        let customItemContentLayout = ymaps.templateLayoutFactory.createClass(
            // Флаг "raw" означает, что данные вставляют "как есть" без экранирования html.
            '<h2 class=ballon_header>{{ properties.place|raw }}</h2>' +
            '<a href="" id=mAdress class=ballon_body>{{ properties.address|raw }}</a></br></br>' +
            '<div class=ballon_body>{{ properties.feedback|raw }}</div></br>' +
            '<div class=ballon_footer>{{ properties.date|raw }}</div>', {
    
            build: function () {
                // Сначала вызываем метод build родительского класса.
                customItemContentLayout.superclass.build.call(this);
                // А затем выполняем дополнительные действия.
    
                let getData = this.getData();
                console.log('getData=', getData);
    
                let coords = this.getData().properties._data.coords;
                console.log('coords=', coords);
    
                let address = this.getData().properties._data.address;
                console.log('address=', address);
                
                let mAdress = document.querySelector('#mAdress');
                mAdress.addEventListener('click', this.onAddress.bind(this));
            },
    
            // Аналогично переопределяем функцию clear, чтобы снять
            // прослушивание клика при удалении макета с карты.
            clear: function () {
                // Выполняем действия в обратном порядке - сначала снимаем слушателя,
                // а потом вызываем метод clear родительского класса.
    
                let mAdress = document.querySelector('#mAdress');
                mAdress.addEventListener('click', this.onAddress);
    
                customItemContentLayout.superclass.clear.call(this);
            },
    
            onAddress: function (e) {
                e.preventDefault();
                let coords = this.getData().properties._data.coords;
                let address = this.getData().properties._data.address;            
                let position = [e.clientX, e.clientY];
                console.log('this=', this);
                console.log('e=', e);
                console.log('coords=', coords);
                console.log('address=', address);
                console.log('position=', position);
                value = coords;
                let obj = new Object();
                obj.coords = coords;
                obj.address = address;
                openForm(obj, position, e);
                this.events.fire('userclose');
            }
    
            }
        );
        
    
        // 3. Создаем кластер
        let clusterer = new ymaps.Clusterer({
            clusterDisableClickZoom: true,
            clusterOpenBalloonOnClick: true,
            // Устанавливаем стандартный макет балуна кластера "Карусель".
            clusterBalloonContentLayout: 'cluster#balloonCarousel',
            // Устанавливаем собственный макет.
            clusterBalloonItemContentLayout: customItemContentLayout,
            // Устанавливаем режим открытия балуна. 
            // В данном примере балун никогда не будет открываться в режиме панели.
            clusterBalloonPanelMaxMapArea: 0,
            // Устанавливаем размеры макета контента балуна (в пикселях).
            clusterBalloonContentLayoutWidth: 300,
            clusterBalloonContentLayoutHeight: 200,
            // Устанавливаем максимальное количество элементов в нижней панели на одной странице
            clusterBalloonPagerSize: 5
            // Настройка внешнего вида нижней панели.
            // Режим marker рекомендуется использовать с небольшим количеством элементов.
            // clusterBalloonPagerType: 'marker',
            // Можно отключить зацикливание списка при навигации при помощи боковых стрелок.
            // clusterBalloonCycling: false,
            // Можно отключить отображение меню навигации.
            // clusterBalloonPagerVisible: false
        });
        
    
        // 4. Создаем шаблон балуна метки
        let BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div id="formFeedback">' +
                '<div id="headerAdress">' +
                    '<img src="./img/map-pin.png">' +
                    '<div id=adressText>{{ properties.address|raw }}</div>' +
                    '<a href="#" class="close placemarkClose"></a>' +
                '</div>' +
                `<div id="historyFeedback" class="placemarkHistoryFeedback"></div>` +
                '<div id="textBefore">ВАШ ОТЗЫВ</div>' +
                '<input type="text" placeholder="Ваше имя" id="nameInput" class="placemarkNameInput">' +
                '<input type="text" placeholder="Укажите место" id="placeInput" class="placemarkPlaceInput">' +
                '<textarea placeholder="Поделитесь впечатлениями" id="feedbackInput" class="placemarkFeedbackInput"></textarea>' +
                '<button id="addButton" class="placemarkBut">Добавить</button>' +
            '</div>', {
    
            build: function () {
                // Сначала вызываем метод build родительского класса.
                BalloonContentLayout.superclass.build.call(this);
                // А затем выполняем дополнительные действия.
    
                let historyFeedback = document.querySelector('#historyFeedback');
                value = this.getData().geoObject.properties._data.coords;
                historyFeedback.innerHTML = historyAll[value];
                
                let addButton = document.querySelector('#addButton');
                addButton.addEventListener('click', this.onAddButton.bind(this));
                
                let closeButton = document.querySelector('.close');
                closeButton.addEventListener('click', this.onCloseButton.bind(this));
            },
    
            // Аналогично переопределяем функцию clear, чтобы снять
            // прослушивание клика при удалении макета с карты.
            clear: function () {
                // Выполняем действия в обратном порядке - сначала снимаем слушателя,
                // а потом вызываем метод clear родительского класса.
    
                let addButton = document.querySelector('.placemarkBut');
                addButton.removeEventListener('click', this.onAddButton);
    
                let closeButton = document.querySelector('.placemarkClose');
                closeButton.removeEventListener('click', this.onCloseButton);
    
                BalloonContentLayout.superclass.clear.call(this);
            },
    
            onAddButton: function(e) {
    //             let historyFeedback = document.querySelector('.placemarkHistoryFeedback');            
    //             let nameInput = document.querySelector('.placemarkNameInput');
    //             let placeInput = document.querySelector('.placemarkPlaceInput');
    //             let feedbackInput = document.querySelector('.placemarkFeedbackInput');
    
    //             let date = new Date();
    //             let printDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
    //             let printTime = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2);
    
    //             if (nameInput.value === '') {
    //                 alert('Введите пожалуйста своё имя!');
    //             } else {
    //                 if (placeInput.value === '') {
    //                     alert('Введите пожалуйста название места!');
    //                 } else {
    //                     if (feedbackInput.value === '') {
    //                         alert('Введите пожалуйста свой отзыв!');
    //                     } else {
    //                         let messageFeedback = ['<div class="historyFeedback__box">',
    //                         `<strong>${nameInput.value}</strong> `,
    //                         `${placeInput.value}`,
    //                         ` <time>${printDate} ${printTime}</time>`,
    //                         `<span>${feedbackInput.value}</span>`,
    //                         '</div>'].join('');
                
    //                         if (historyAll[value]) {
    //                             historyAll[value] += messageFeedback;
    //                         } else {
    //                             historyAll[value] = messageFeedback;
    
    //                         };
                            
    //                         historyFeedback.innerHTML = historyAll[value];
    //                     }
    //                 }
    //             }
              
                let historyFeedback = document.querySelector('#historyFeedback');
                let nameInput = document.querySelector('#nameInput');
                let placeInput = document.querySelector('#placeInput');
                let feedbackInput = document.querySelector('#feedbackInput');
    
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
                            let messageFeedback = ['<div class="historyFeedback__box">',
                            `<strong>${nameInput.value}</strong> `,
                            `${placeInput.value}`,
                            ` <time>${printDate} ${printTime}</time>`,
                            `<span>${feedbackInput.value}</span>`,
                            '</div>'].join('');
    
                            value = this.getData().geoObject.properties._data.coords;
                            historyAll[value] += messageFeedback;                        
                            historyFeedback.innerHTML = historyAll[value];
    
                            let myPlacemark = createPlacemark(this.getData().geoObject.properties._data.coords);
    
                            myPlacemark.properties
                                .set({
                                    name: nameInput.value,
                                    place: placeInput.value,
                                    address: this.getData().geoObject.properties._data.address,
                                    coords: this.getData().geoObject.properties._data.coords,
                                    feedback: feedbackInput.value,
                                    date: `${printDate} ${printTime}`
                                });                      
                            
                            clusterer.add(myPlacemark);
                            myMap.geoObjects.add(clusterer);
    
                            nameInput.value = '';
                            placeInput.value = '';
                            feedbackInput.value = '';
    
                            e.preventDefault();
                        }
                    }
                }  
            },
    
            onCloseButton: function (e) {
                e.preventDefault();
                this.events.fire('userclose');
            }
        });
      
      
        // 5. Функция создания метки на карте по координатам
        function createPlacemark(coords) {
            let placemark = new ymaps.Placemark(coords, {
    
            },
            {
                
                // balloonContent: '<strong>серобуромалиновый</strong> цвет'
    
                // balloonLayout: BalloonContentLayout,
                // balloonPanelMaxMapArea: 0
              
            });
    
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
          
            // placemark.events.add('click', () => {
            //   placemark.balloon.open();
            // })
            return placemark;
        };
        
    
        // 6. Функция определения адреса по координатам
        function getAddress(coords, addressTextModal) {
            /* myPlacemark.properties.set('iconCaption', 'поиск...'); */
            ymaps.geocode(coords).then(function (res) {
                let firstGeoObject = res.geoObjects.get(0);
    
                addressTextModal.textContent = firstGeoObject.getAddressLine();
    
                /* myPlacemark.properties
                    .set({
                        // Формируем строку с данными об объекте.
                        address: firstGeoObject.getAddressLine()
                    }); */
            });
        };
        
    
        // 7. Функция открытия формы
        function openForm(obj, position, e) {
            let hist;
    
            if (!historyAll[value]) {
                hist = 'Отзывов пока нет...';
            } else hist = historyAll[value];
            
            let addressTextModal = document.querySelector('#adressText');
            let historyFeedbackModal = document.querySelector('#historyFeedback');
            addressTextModal.textContent = obj.address;
    
            historyFeedbackModal.innerHTML = hist;
    
            let modalForm = document.querySelector('#formFeedback');
            let addButton = document.querySelector('#addButton');
    
            if (modalForm.classList.contains('modalActive')) {
                addButton.removeEventListener('click', eventClick);
            } else {
                modalForm.classList.remove('modalForm');
                modalForm.classList.add('modalActive');
            }
    
            modalForm.style = `top: ${position[1]}px ; left: ${position[0]}px;`;
    
            eventClick = clickAdd.bind(e);
            addButton.addEventListener('click', eventClick);
    
            let close =  document.querySelector('.close');
            
            close.addEventListener('click', () => {
                let nameInput = document.querySelector('#nameInput');
                let placeInput = document.querySelector('#placeInput');
                let feedbackInput = document.querySelector('#feedbackInput');
                
                nameInput.value = '';
                placeInput.value = '';
                feedbackInput.value = '';
                
                modalForm.classList.remove('modalActive');
                modalForm.classList.add('modalForm');
    
                addButton.removeEventListener('click', eventClick);
            });
    
            function clickAdd() {
                let nameInput = document.querySelector('#nameInput');
                let placeInput = document.querySelector('#placeInput');
                let feedbackInput = document.querySelector('#feedbackInput');
    
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
    
                            };
                            
                            historyFeedback.innerHTML = historyAll[value];
    
                            let myPlacemark = createPlacemark(obj.coords);
    
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
            };        
    
        }
    
        
    
        // 8. Задаем обработчик клика по нашей карте
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
    });
}

export {
    mapInit
}