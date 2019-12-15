// import { createPlacemark as placemarkAdd } from '../js/geo-elements';

let placemarkObjects= [];

function mapInit() {
    ymaps.ready(() => {
        let myMap = new ymaps.Map('map', {
            center: [55.75553079, 37.61751179],
            zoom: 17,
            controls: [ 'zoomControl', 'fullscreenControl']
        });

        myMap.events.add('click', function(e) {
            let coords = e.get('coords');

            let formFeedback = document.createElement('div');
            let headerAdress = document.createElement('div');
            let historyFeedback = document.createElement('div');
            let textBefore = document.createElement('div');
            let nameInput = document.createElement('input');           
            let placeInput = document.createElement('input');
            let feedbackInput = document.createElement('input');
            let addButton = document.createElement('button');

            formFeedback.append(headerAdress);
            formFeedback.append(historyFeedback);
            formFeedback.append(textBefore);
            formFeedback.append(nameInput);
            formFeedback.append(placeInput);
            formFeedback.append(feedbackInput);
            formFeedback.append(addButton);

            textBefore.textContent = 'ВАШ ОТЗЫВ';
            addButton.textContent = 'Добавить';

            nameInput.placeholder = 'Ваше имя';
            nameInput.type = 'text';
            placeInput.placeholder = 'Укажите место';
            placeInput.type = 'text';
            feedbackInput.placeholder = 'Поделитесь впечатлениями';
            feedbackInput.type = 'text';

            let myPlacemark = createPlacemark(coords);
            myPlacemark.balloonContent = `${formFeedback}`;

            myMap.geoObjects.add(myPlacemark);







/*             getAddress(coords);
            myMap.geoObjects.add(myPlacemark);

            function getAddress(coords) {
                myPlacemark.properties.set('iconCaption', 'поиск...');
                ymaps.geocode(coords).then(function (res) {
                    var firstGeoObject = res.geoObjects.get(0);
                    console.log('firstGeoObject=', firstGeoObject);
        
                    myPlacemark.properties
                        .set({                            
                            balloonContent: firstGeoObject.getAddressLine()
                        });
                });
            }; */

            // Создание метки.
            function createPlacemark(coords) {
                return new ymaps.Placemark(coords, {
                    iconCaption: 'поиск...'
                }, {
                    preset: 'islands#violetDotIconWithCaption',
                    draggable: true
                });
            };
            
        })
    });
}

export {
    mapInit
}