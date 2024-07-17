'use strict';

angular.module('todoApp', [])
.service('PokemonService', ['$http', '$q', function($http, $q){

    var rest_inicial= "https://pokeapi.co/api/v2/pokemon";
    var rest_detalle= "https://pokeapi.co/api/v2/pokemon/";

    var factory = {
        cargainicial,
        actualizarLista,
        detallePokemon,
        allPokemon
    }

    return factory;

    function cargainicial(){
        var deferred= $q.defer();
        $http.get(rest_inicial)
        .then(function(response){
            deferred.resolve(response.data);
        })
        return deferred.promise;
    }

    function actualizarLista(url){
        var deferred= $q.defer();
        $http.get(url)
        .then(function(response){
            deferred.resolve(response.data);
        })
        return deferred.promise;
    }

    function detallePokemon(nombre){
        var deferred= $q.defer();
        $http.get(rest_detalle+nombre)
        .then(function(response){
            deferred.resolve(response.data);
        })
        return deferred.promise;
    }

    function allPokemon(total){
        var deferred= $q.defer();
        $http.get(rest_inicial,{
            params : {
                "limit" : total
            }})
        .then(function(response){
            deferred.resolve(response.data);
        })
        return deferred.promise;
    }
}])
.controller('BusquedaListController', ['$scope','PokemonService','filterFilter',function($scope,PokemonService, filterFilter) {
    self = this;

    self.dataPokemon=null;
    $scope.filterName="";
    $scope.noExistePokemon=false;
    self.detallePokemon=null;
    $scope.pokemonSeleccionado="";

    $scope.isVisibleDetalle=false;

    $scope.abc = [
        {tipo:'a',cantidad:0}, {tipo:'b',cantidad:0}, {tipo:'c',cantidad:0}, {tipo:'d',cantidad:0}, {tipo:'e',cantidad:0}, 
        {tipo:'f',cantidad:0}, {tipo:'g',cantidad:0}, {tipo:'h',cantidad:0}, {tipo:'i',cantidad:0}, {tipo:'j',cantidad:0}, 
        {tipo:'k',cantidad:0}, {tipo:'l',cantidad:0}, {tipo:'m',cantidad:0}, {tipo:'n',cantidad:0}, {tipo:'ñ',cantidad:0}, 
        {tipo:'o',cantidad:0}, {tipo:'p',cantidad:0}, {tipo:'q',cantidad:0}, {tipo:'r',cantidad:0}, {tipo:'s',cantidad:0}, 
        {tipo:'t',cantidad:0}, {tipo:'u',cantidad:0}, {tipo:'v',cantidad:0}, {tipo:'w',cantidad:0}, {tipo:'x',cantidad:0}, 
        {tipo:'y',cantidad:0}, {tipo:'z',cantidad:0} ];

    function init(){
        cargaPokemones();
        cargaPokemonAbecedario();
    }

    function cargaPokemones(){
        PokemonService.cargainicial()
        .then(function(response){
            self.dataPokemon= response;
        })
    }

    $scope.filtroNombre=function(nombre){
        $scope.noExistePokemon=false;
        if (nombre.length>0) {
            console.log(nombre)
            self.dataPokemon.results=filterFilter(self.dataPokemon.results,nombre);    
            console.log(self.dataPokemon.results)
            if(self.dataPokemon.results.length==0){
                $scope.noExistePokemon=true;
                cargaPokemones();     
            }
        }else{
            cargaPokemones(); 
        }
        
    }

    $scope.verPokemon=function(pokemon){
        $scope.pokemonSeleccionado=pokemon.toUpperCase();
        $scope.isVisibleDetalle=false;
        PokemonService.detallePokemon(pokemon)
        .then(function(response){
            console.log(response.stats)
            self.detallePokemon= response;
            $scope.isVisibleDetalle=true;
        })
    }

    $scope.actualizacionLista=function(url){
        PokemonService.actualizarLista(url)
        .then(function(response){
            self.dataPokemon= response;
        })
    }

    function cargaPokemonAbecedario(){
        PokemonService.allPokemon(1302)
        .then(function(response){
            var listaPokemon = response.results;
            console.log(listaPokemon)
            for (var index = 0; index < $scope.abc.length; index++) {
                var cantidad = listaPokemon.filter(pokemon=>{ return pokemon.name.charAt(0).toLowerCase().includes($scope.abc[index].tipo)});
                $scope.abc[index].cantidad= cantidad.length;
            }
            console.log($scope.abc)
        })
    }
    init();
}]);



//Para completar la siguiente prueba debes generar un proyecto AngularJs e implementar los
//siguientes requerimientos, utilizando la API pública que se detalle en este enlace
//https://pokeapi.co
//1. Generar una tabla con paginación, para recorrer el listado completo de Pokemones. Debe
//conectar al método obtener un listado de Pokemones:(https://pokeapi.co/api/v2/pokemon).
//  a. Debe tener la opción de filtrar por algún texto del nombre del pokemon, por ejemplo
//  charizard o pikachu. La tabla debe mostrar los pokemones cuyo nombre contiene el texto
//  ingresado
//  b. El filtro de texto debe tener autocompletador.
//2. Al seleccionar un pokemon del listado, en el contenedor de la derecha se debe mostrar su
//información detallada (obtener los datos de este método):
//https://pokeapi.co/api/v2/pokemon/charizard
//3. Si implementa el proyecto usando AngularJs debe utilizar al menos una vez las directivas
//NgModel y NgIf.
//4. Se debe generar una versión Mobile del sitio (responsive), la organización de los elementos
//queda a su total creatividad.
//5. En una tabla más debajo de la sección detallada previamente, debes colocar una tabla
//resumen. En esa tabla se deben indicar la cantidad de pokemones que inician con cada letra
//del abecedario.
//Finalmente enviar en un repositorio github, bitbucket o gitlab el que sea de tu preferencia de
//manera pública.
//
//Tiempo entrega: 1 día a partir de entrega.