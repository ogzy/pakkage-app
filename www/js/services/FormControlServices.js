angular.module('Pakkage.FormControlServices', [])
  .factory('PhoneControlService', function() {
    return {
      formatPhone: function(keyEvent, field) {
        switch (keyEvent.which) {
          case 48:
          case 49:
          case 50:
          case 51:
          case 52:
          case 53:
          case 54:
          case 55:
          case 56:
          case 57:
          case 189:
          case 96:
          case 97:
          case 98:
          case 99:
          case 100:
          case 101:
          case 102:
          case 103:
          case 104:
          case 105:
            field.replace('-', '');
            if ((field.length == 3) || (field.length == 7))
              field += '-';
            else if (field.length == 4)
              field = field.substring(0, 3) + '-' + field.substring(field.length - 1);
            else if (field.length == 8)
              field = field.substring(0, 7) + '-' + field.substring(field.length - 1);
            break;
          default:
            if (keyEvent.which == 229 && isNaN(field[field.length - 1]) == false) {
              field.replace('-', '');
              if ((field.length == 3) || (field.length == 7))
                field += '-';
              else if (field.length == 4)
                field = field.substring(0, 3) + '-' + field.substring(field.length - 1);
              else if (field.length == 8)
                field = field.substring(0, 7) + '-' + field.substring(field.length - 1);
            } else if (keyEvent.which != 8 && keyEvent.which != 46 && keyEvent.which != 9) {
              field = field.substring(0, field.length - 1);
            }
            break;
        }
        if (field != undefined) {
          if (field.length > 12)
            field = field.substring(0, field.length - 1);
        }
        //alert("\nKey Identifier : " + keyEvent.keyIdentifier + "\n" +"Which : " + keyEvent.which + "\n" + "Key Code : " + keyEvent.keyCode + "\n" + "Char Code : " + keyEvent.charCode + "\n" + "Code : " + keyEvent.code + "\n");
        //console.log(keyEvent);
        return field;
      }
    }

  })
  .factory('PackageFilterService', function($filter, $rootScope, LocalStorageService, moment) {
    return {
      homePackagesFilter: function(filters, detailFilters) {

        //-- Set main filters for caching
        console.log(filters.directionFilter);
        $rootScope.statusFilter = filters.statusFilter;
        $rootScope.dateFilter = filters.dateFilter;
        $rootScope.directionFilter = filters.directionFilter;
        $rootScope.status = detailFilters.status;

        $rootScope.fromMe = detailFilters.fromMe;
        $rootScope.toMe = detailFilters.toMe;
        $rootScope.date = detailFilters.date;

        var filteredPackages = {},
          packages = LocalStorageService.get('packages');
        if (filters.statusFilter) {
          var draft = detailFilters.status.draft ? 0 : '',
            readyToSend = detailFilters.status.readyToSend ? 1 : '';
          filteredPackages = $filter('filter')(packages, function(d) {
            return (d.status === draft) || (d.status === readyToSend);
          });
          packages = filteredPackages;
        }
        if (filters.dateFilter) {
          switch (detailFilters.date) {
            case 'today':
              filteredPackages = $filter('filter')(packages, function(d) {
                return (Date.parse(d.date) >= Date.parse(moment().subtract(1, 'days'))) && (Date.parse(d.date) <= Date.parse(moment().format()));
              });
              break;
            case 'lastWeek':
              filteredPackages = $filter('filter')(packages, function(d) {
                return (Date.parse(d.date) >= Date.parse(moment().subtract(7, 'days'))) && (Date.parse(d.date) <= Date.parse(moment().format()));
              });

              break;
            case 'lastMonth':
              filteredPackages = $filter('filter')(packages, function(d) {
                return (Date.parse(d.date) >= Date.parse(moment().subtract(30, 'days'))) && (Date.parse(d.date) <= Date.parse(moment().format()));
              });
              break;
            case 'lastYear':

              filteredPackages = $filter('filter')(packages, function(d) {
                return (Date.parse(d.date) >= Date.parse(moment().subtract(365, 'days'))) && (Date.parse(d.date) <= Date.parse(moment().format()));
              });
              break;
          }
        }

        if (filters.directionFilter) {
          if (detailFilters.fromMe) {
            filteredPackages = $filter('filter')(packages, function(d) {
              return d.senderId[0] === LocalStorageService.get('userId');
            });
          }
          if (detailFilters.toMe) {
            filteredPackages = $filter('filter')(packages, function(d) {
              return d.receiver[0].email === LocalStorageService.get('email');
            });
          }
          if (detailFilters.fromMe && detailFilters.toMe) {
            filteredPackages = $filter('filter')(packages, function(d) {
              return (d.senderId[0] === LocalStorageService.get('userId')) || (d.receiver[0].email === LocalStorageService.get('email'));
            });
          }

        }
        console.log(filteredPackages);
        if (!filters.statusFilter && !filters.dateFilter && !filters.directionFilter)
          $rootScope.packages = LocalStorageService.get('packages');
        else
          $rootScope.packages = filteredPackages;
        /*if (typeof (filteredPackages) === 'object')
        {
          $rootScope.packages = [];
          $rootScope.packages.push(filteredPackages);
        }*/

        console.log($rootScope.packages);
        console.log(typeof(filteredPackages));
        $rootScope.$emit("callSyncPackagesMethod", {});
        //return filteredPackages;
      },
      filterHubPackages: function() {
        var toMePackages = [],willSplice = [];
        for (var i = 0; i < $rootScope.packages.length; i++) {
          var userType = LocalStorageService.get('userType')
          if(userType == 'Hub')
          {
            if ($rootScope.packages[i].hubs != undefined) {
              if ($rootScope.packages[i].hubs.hubId === LocalStorageService.get('userId')) {
                console.log('PakkageBeta : Silinmeden onceki d object : ' + JSON.stringify($rootScope.packages[i]));
                //console.log('PakkageBeta : indexof : ' + $rootScope.packages.indexOf($rootScope.packages[i]));

                toMePackages.push($rootScope.packages[i]);
                willSplice.push(i);
              }
            }
          }
          else if (userType == 'Driver') {
            if ($rootScope.packages[i].drivers != undefined) {
              if ($rootScope.packages[i].drivers.hubId === LocalStorageService.get('userId')) {
                console.log('PakkageBeta : Silinmeden onceki d object : ' + JSON.stringify($rootScope.packages[i]));
                //console.log('PakkageBeta : indexof : ' + $rootScope.packages.indexOf($rootScope.packages[i]));

                toMePackages.push($rootScope.packages[i]);
                willSplice.push(i);
              }
            }
          }

        }
        for (var i = 0; i < willSplice.length; i++) {
          $rootScope.packages.splice(willSplice[i], 1);
        }


        console.log('PakkageBeta : toMePackages pure : ' + JSON.stringify(toMePackages));
        return toMePackages;
      }
    }
  });
