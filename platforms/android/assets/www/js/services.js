angular.module('starter.services', [])

.factory('Ceas', function() {
  var ceas = [{
    id: 0,
    name: 'Nombre del CEA 1',
    address: 'Direccion del CEA1',
    imagePlace: 'img/CEA1.jpg',
    latitude:5.5522056,
    longitude:-73.3564241
  }, {
    id: 1,
    name: 'Nombre del CEA 2',
    address: 'Direccion del CEA2',
    imagePlace: 'img/CEA2.jpg',
    latitude:5.547892465258138,
    longitude:-73.34650084376335
  }, {
    id: 2,
    name: 'Nombre del CEA 3',
    address: 'Direccion del CEA3',
    imagePlace: 'img/CEA3.jpg',
    latitude:5.5498304,
    longitude:-73.3521599
  }, {
    id: 3,
    name: 'Nombre del CEA 4',
    address: 'Direccion del CEA4',
    imagePlace: 'img/CEA4.jpg',
    latitude:5.549261991469555,
    longitude:-73.3502022922039
  }];

  return {
    all: function() {
      return ceas;
    },
    remove: function(cea) {
      ceas.splice(ceas.indexOf(cea), 1);
      //console.dir("Retornamos: "+ceas[i].name);
    },
    get: function(ceaId) {
      for (var i = 0; i < ceas.length; i++) {
        if (ceas[i].id === parseInt(ceaId)) {
          //console.dir("Retornamos: "+ceas[i].name);
          return ceas[i];
        }
      }
      return null;
    }
  };
});