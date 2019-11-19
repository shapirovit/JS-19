/* ДЗ 2 - работа с массивами и объектами */

/*
 Задание 1:

 Напишите аналог встроенного метода forEach для работы с массивами
 Посмотрите как работает forEach и повторите это поведение для массива, который будет передан в параметре array
 */
function forEach(array, fn) {
    for (let i=0; i<array.length; i++) {
        fn(array[i], i, array);
    }
}

/*
 Задание 2:

 Напишите аналог встроенного метода map для работы с массивами
 Посмотрите как работает map и повторите это поведение для массива, который будет передан в параметре array
 */
function map(array, fn) {
    var newArray = array.slice();

    for (let i=0; i<array.length; i++) {
        let item = array[i];
        
        newArray[i] = fn(item, i, array);
    }

    return newArray;
}

/*
 Задание 3:

 Напишите аналог встроенного метода reduce для работы с массивами
 Посмотрите как работает reduce и повторите это поведение для массива, который будет передан в параметре array
 */
function reduce(array, fn, initial) {
    let i, result;
    if (initial) {
        i = 0;
        result = initial;
    } else {
        i = 1;
        result = array[0];
    }    
    while (i < array.length) {
        let item = array[i];

        result = fn(result, item, i, array);
        i++;
    }

    return result;
}

/*
 Задание 4:

 Функция должна перебрать все свойства объекта, преобразовать их имена в верхний регистр и вернуть в виде массива

 Пример:
   upperProps({ name: 'Сергей', lastName: 'Петров' }) вернет ['NAME', 'LASTNAME']
 */
function upperProps(obj) {
    let array = [];

    for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            array.push(prop.toUpperCase());
        }
    }

    return array;
}

/*
 Задание 5 *:

 Напишите аналог встроенного метода slice для работы с массивами
 Посмотрите как работает slice и повторите это поведение для массива, который будет передан в параметре array
 */
function slice(array, from = 0, to = array.length) {
    let newArray = [];
    
    if (from > array.length) {
        from = array.length;
    }
    if (from < 0 && from + array.length < 0) {
        from = 0;
    }
    if (to > array.length) {
        to = array.length;
    }
    if (to < 0 && to + array.length < 0) {
        to = 0;
    }

    if (from >= 0) {
        if (to >= 0) {
            for (let i = from; i < to; i++) {
                newArray.push(array[i]);        
            }
        } else {
            for (let i = from; i < array.length + to; i++) {
                newArray.push(array[i]);
            }
        }
    } else {
        if (to >= 0) {
            for (let i = array.length + from; i < to; i++) {
                newArray.push(array[i]);
            }
        } else {
            for (let i = array.length + from; i < array.length + to; i++) {
                newArray.push(array[i]);
            }
        }
    }
        
    return newArray;
}

/*
 Задание 6 *:

 Функция принимает объект и должна вернуть Proxy для этого объекта
 Proxy должен перехватывать все попытки записи значений свойств и возводить это значение в квадрат
 */

function createProxy(obj) {
    obj = new Proxy(obj, {
        set(target, prop, val) {
            terget[prop] = val * val;
            
            return true;
        }

    });

    return obj;

}

export {
    forEach,
    map,
    reduce,
    upperProps,
    slice,
    createProxy
};
