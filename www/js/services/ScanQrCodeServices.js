angular.module('Pakkage.ScanQrCodeService', [])
  .factory('ScanQR', function($ionicLoading) {
    return {
      scan: function(purpose) {
        //--  Bazı sorunlar çıkardı.Şimdilik kullanılmıyor
        console.log('PakkageBeta : Scan fonksiyonuna girdi')
        document.addEventListener("deviceready", function() {
          console.log('PakkageBeta : Scan device ready')
          console.log('PakkageBeta : scanmess = ' + JSON.stringify(scanMessages(purpose)))
          cloudSky.zBar.scan(scanMessages(purpose),
            function(success) {
              console.log('PakkageBeta : camera açtı')
              return success;
            },
            function(error) {});
        }, false);
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
