angular.module('Pakkage.TestService', [])
  .factory('ServiceTest', function($ionicLoading) {
    return {
      scan: function(purpose) {
        console.log('PakkageBeta : Scan fonksiyonuna girdi')
        console.log('PakkageBeta : scanmess = ' + JSON.stringify(this.scanMessages(purpose)))
        return { data : 'deneem' };
      },
      scanMessages: function(code) {
        var returnMessage = {},
          defaultTitle = 'Pakkage Scanner',
          defaultDescription = 'Please show QR barcode to camera',
          defaultDrawsight = true;
        //-- code format [controllerName]-[buttonName]
        switch (code) {
          case 'AvailableHubs-scanQRAvailableHubs':
            returnMessage = {
              text_title: defaultTitle,
              text_instructions: defaultDescription,
              drawSight: defaultDrawsight
            };
            break;
          case 'HubDetail-scanQRHubsDetail':
            returnMessage = {
              text_title: defaultTitle,
              text_instructions: 'This package will be assign to this hub',
              drawSight: defaultDrawsight
            };
            break;
          case 'EditPackage-scanFromPackageButton':
            returnMessage = {
              text_title: defaultTitle,
              text_instructions: 'You will care with this package',
              drawSight: defaultDrawsight
            };
            break;
          case 'EditPackage-scanFromPackageForSender':
            returnMessage = {
              text_title: defaultTitle,
              text_instructions: 'This package to be accepted by Org. Hub',
              drawSight: defaultDrawsight
            };
            break;
          case 'Home-scanQRFromHomePage':
            returnMessage = {
              text_title: defaultTitle,
              text_instructions: 'Search package with this QRCode',
              drawSight: defaultDrawsight
            };
            break;
          default:
            returnMessage = {
              text_title: defaultTitle,
              text_instructions: defaultDescription,
              drawSight: defaultDrawsight
            };
            break;
        }
        return returnMessage;
      }
    }
  });
