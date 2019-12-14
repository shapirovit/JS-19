function mapInit() {
    umaps.ready(() => {
        let moscowMap = new ymaps.Map('map', {
            center: [55.7, 37.6],
            zoom: 17
        });
    });
}

export {
    mapInit
}