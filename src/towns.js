// import loadAndSortTowns from '../src/index';
/*
 Страница должна предварительно загрузить список городов из
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 и отсортировать в алфавитном порядке.

 При вводе в текстовое поле, под ним должен появляться список тех городов,
 в названии которых, хотя бы частично, есть введенное значение.
 Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.

 Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 После окончания загрузки городов, надпись исчезает и появляется текстовое поле.

 Разметку смотрите в файле towns-content.hbs

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер

 *** Часть со звездочкой ***
 Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 При клике на кнопку, процесс загрузки повторяется заново
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');

/* Блок с надписью "Загрузка" */
const loadingBlock = homeworkContainer.querySelector('#loading-block');
/* Блок с текстовым полем и результатом поиска */
const filterBlock = homeworkContainer.querySelector('#filter-block');
/* Текстовое поле для поиска по городам */
const filterInput = homeworkContainer.querySelector('#filter-input');
/* Блок с результатами поиска */
const filterResult = homeworkContainer.querySelector('#filter-result');

/*
 Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов пожно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 */
function loadTowns() {
    return new Promise(resolve => {
        fetch('https://raw654.githubusercontent.com/smelukov/citiesTest/master/cities.json')
            .then(response => {
                if (response.status >= 400) {

                    return Promise.reject();
                }

                return response.json();
            })
            .then(json => {
                json.sort((a, b) => a.name > b.name ? 1 : -1);
                resolve(json);
            })
            .catch(() => {
                const div = document.createElement('div');
                const button = document.createElement('button');

                loadingBlock.style = 'display: none;';
                div.textContent = 'Не удалось загрузить города ';
                button.textContent = 'Повторить';
                div.append(button);
                homeworkContainer.append(div);
                button.addEventListener('click', () => {
                    homeworkContainer.remove(div);
                    loadTowns();
                    loadingBlock.style = '';
                });

            })
    });
}

let arrTowns;

filterBlock.style = 'display: none;';
loadTowns().then(towns => {
    arrTowns = towns;
    filterBlock.style = '';
    loadingBlock.style = 'display: none;';
});

/*
 Функция должна проверять встречается ли подстрока chunk в строке full
 Проверка должна происходить без учета регистра символов

 Пример:
   isMatching('Moscow', 'moscow') // true
   isMatching('Moscow', 'mosc') // true
   isMatching('Moscow', 'cow') // true
   isMatching('Moscow', 'SCO') // true
   isMatching('Moscow', 'Moscov') // false
 */
function isMatching(full, chunk) {
    let arrSub = [];

    full = full.toLowerCase();
    chunk = chunk.toLowerCase();
    for (let i=0; i<full.length; i++) {
        for (let j=i+1;j<full.length+1; j++) {
            arrSub.push(full.slice(i, j));
        }
    }
    for (let i = 0; i < arrSub.length; i++) {
        if (arrSub[i] === chunk) {

            return true;
        }
    }

    return false;
}

filterInput.addEventListener('keyup', function() {
    filterResult.innerHTML = '';
    if (filterInput.value === '') {
        filterResult.innerHTML = '';
    } else {
        let keyTown = filterInput.value;

        for (let i = 0; i < arrTowns.length; i++) {
            if (isMatching(arrTowns[i].name, keyTown)) {
                const div = document.createElement('div');

                div.textContent = arrTowns[i].name;
                filterResult.append(div);
            }
        }
    }
});

export {
    loadTowns,
    isMatching
};
