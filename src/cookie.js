/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующей cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если добавляемая cookie не соответсвует фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующей cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

let parsCookie = function() {
    document.cookie.split('; ').reduce( (prev, current) => {
        let [name, value] = current.split('=');
        prev[name] = value;

        return prev;
    }, {});
};

let printCookie = function(name, value) {
    let tr = document.createElement('tr'),
        tdName = document.createElement('td'),
        tdValue = document.createElement('td'),
        tdButton = document.createElement('td'),
        button = document.createElement('button');
    
    tdName.innerText = name;
    tdValue.innerText = value;
    button.innerText = 'удалить';
    tr.append(tdName);
    tr.append(tdValue);
    tr.append(tdButton);
    listTable.append(tr);

    button.addEventListener('click', () => {
        listTable.removeChild(tr);
        document.cookie = `${name}=${value}; max-age=-1`;
    });
}

let subStr = function(str, substr) {
    let arrStr = [];

    for (let i = 0; i < str.length; i++) {
        for (let j = i+1; j < str.length+1; j++) {
            arrStr.push(str.slice(i,j));          
        }
    }
    for (let i = 0; i < arrStr.length; i++) {
        if (arrStr[i] === substr) {

            return true;
        }      
    }

    return false;
}

filterNameInput.addEventListener('keyup', function() {
    let pars = parsCookie();
    let value = filterNameInput.value;

    if (value === '') {        
        for (let name of pars) {
            printCookie(name, pars[name]);
        }
    } else {
        for (let name of pars) {
            if (subStr(name, value) || subStr(pars[name], value)) {
                printCookie(name, pars[name]);
            }
        }
    }
    // здесь можно обработать нажатия на клавиши внутри текстового поля для фильтрации cookie
});

addButton.addEventListener('click', () => {
    let event = new Event("click");
    
    document.cookie = `${addNameInput.value}=${addValueInput.value}`;
    filterNameInput.dispatchEvent(event);
    // здесь можно обработать нажатие на кнопку "добавить cookie"
});
