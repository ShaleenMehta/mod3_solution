(function(){
  'use strict';

  angular.module('NarrowItDownApp',[])
  .controller('NarrowItDownController',NarrowItDownController_fn)
  .controller('FoundItemsController',function(){})
  .service('MenuSearchService',MenuSearchService_Constructor)
  .directive('foundItems',foundItems_init);


  function foundItems_init() {
    var ddo = {
      templateUrl: 'foundItems.html',
      scope: {
        found: '<',
        onRemove: '&'
      },
      controller: 'FoundItemsController as fi_ctrl',
      bindToController: true
    };
    return ddo;
  };

  NarrowItDownController_fn.$inject = ['MenuSearchService'];
  function NarrowItDownController_fn(MenuSearchService) {
    var p_ctrl = this;
    var svc = MenuSearchService;

    p_ctrl.search = function () {
      if(p_ctrl.searchTerm !== undefined && p_ctrl.searchTerm !== '')
      {
        svc.getMatchedMenuItems(p_ctrl.searchTerm)
        .then(
          function (response){p_ctrl.found = response}
        );
      }
      else {
            p_ctrl.found = [];
      };
    };
    p_ctrl.onRemove = function (pos) {
        p_ctrl.found.splice(pos,1);
    };
  }

  MenuSearchService_Constructor.$inject = ['$http'];
  function MenuSearchService_Constructor($http)
  {
    var service = this;

    service.getMatchedMenuItems = function (searchTerm) {
      return $http({
          url: 'https://davids-restaurant.herokuapp.com/menu_items.json'
      }).then(function (response) {
          var items = response.data.menu_items;
          var found = [];
          for (var i in items)
          {
                if(items[i].description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1)
                  found.push(items[i]);
          };
          return found;
      });
    };
  };

})();
