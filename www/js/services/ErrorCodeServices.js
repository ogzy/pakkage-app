angular.module('Pakkage.ErrorcodeServices', [])
  .factory('ErrorCodeService', function() {
    return {
      getError: function(code) {
        var returnMessage = null;
        switch (code) {
          case 0: //-- Successfull
            returnMessage = 'Succesfull';
            break;
          case 999: //-- General
            returnMessage = 'Technical Error';
            break;
          case 998: //-- Token
            returnMessage = 'No Token Provided !';
            break;
          case 997: //-- Token
            returnMessage = 'Failed to authenticate token.';
            break;
          case 100: //-- Register
            returnMessage = 'No user type provided';
            break;
          case 101: //-- Register
            returnMessage = 'Password and Confirm password didnt match';
            break;
          case 102: //-- Register
            returnMessage = 'Email is already used by another user !';
            break;
          case 103: //-- Register
            returnMessage = 'Cannot upload this picture';
            break;
          case 104: //-- Register
            returnMessage = 'No image provided';
            break;
          case 105: //-- Register
            returnMessage = 'Mandatory field must be filled';
            break;
          case 106: //-- Activate
            returnMessage = 'Activation code is mandatory field';
            break;
          case 107: //-- Activate
            returnMessage = 'Activation code or email is wrong';
            break;
          case 108: //-- Login
            returnMessage = 'Credential should provided';
            break;
          case 109: //-- Login
            returnMessage = 'Account did not activated';
            break;
          case 110: //-- Login
            returnMessage = "Email or username couldn't find";
            break;
          case 111: //-- Login
            returnMessage = "Invalid username or password";
            break;
          case 112: //-- Forgot password
            returnMessage = "You already created restore code.Please provide it";
            break;
          case 113: //-- Forgot password
            returnMessage = "Your password locked.You should change your password";
            break;
          case 114: //-- Forgot password
            returnMessage = "Password restore code is invalid";
            break;
          case 115: //-- Forgot password
            returnMessage = "This password restore code already used";
            break;
          case 116: //-- General
            returnMessage = 'Some values should provide';
            break;
          case 117: //-- Package
            returnMessage = 'Your credential couldn\'t find in our system';
            break;
          case 118: //-- Profile
            returnMessage = 'This username already taken by another user';
            break;
          case 119: //-- Package
            returnMessage = 'No packages found';
            break;
          case 120: //-- Activate
            returnMessage = 'Activation Code has expired. Please try to register again and activate your account within 48 hours.';
            break;
          case 121: //-- Forgot password
            returnMessage = 'Password Restore Code was expired.Please check your mail box for new restoration code.';
            break;
          case 123: //-- Scan QR Code
            returnMessage = 'This package couldn\t find in the system.';
            break;
          case 124: //-- Scan QR Code
            returnMessage = 'This hub couldn\t find in the system.';
            break;
          case "E100":
            returnMessage = 'Please put activation code';
            break;
          case "E101":
            returnMessage = 'Please put email';
            break;
          case "E102":
            returnMessage = 'Please put email and restore code';
            break;
          case "E103":
            returnMessage = 'Please create new password and confirm password';
            break;
          case "E104":
            returnMessage = "Password can't smaller than 6 or larger than 20 character";
            break;
          case "E105":
            returnMessage = 'Phone number is not valid.E.x. 123-456-7890';
            break;
          case "E106":
            returnMessage = 'Zip code should a valid zip code number';
            break;
          case "E107":
            returnMessage = 'Work Phone number is not valid.E.x. 123-456-7890';
            break;
          case "E108":
            returnMessage = 'This username already taken.Please change it';
            break;
          case "E109":
            returnMessage = 'Error creating package';
            break;
          case "E110":
            returnMessage = 'Error uploading picture';
            break;
          case "E111":
            returnMessage = 'Email is not valid';
            break;
          case "E112":
            returnMessage = 'You didn \'t fill any fields.If you leave this page,package will be delete.';
            break;
          case "E113":
            returnMessage = 'Error updating package';
            break;
          case "E114":
            returnMessage = 'Currently your phone does n\'t have active internet connection.Please check connection and try again.';
            break;
          case "E115":
            returnMessage = 'You didn\'t fill your profile fully.Please fill mandatory field of profile.';
            break;
          case "E116":
            returnMessage = 'Please fill email,password and confirm password';
            break;
          case "E117":
            returnMessage = 'Username can\'t contains space character.Also can\'t smaller than 3 char and can\'t larger than 20 char';
            break;
          case "E118":
            returnMessage = 'Start date can\'t be equal or greater than Finish Date';
            break;
          case "E119":
            returnMessage = 'You can\'t create package without complete your profile info\'s';
            break;
          case "E120":
            returnMessage = 'Your session is ended.Please login again';
            break;
          case "E121":
            returnMessage = 'Your current location is not find.';
            break;
          case "E122":
            returnMessage = 'Avaible hubs is not found by your current city';
            break;
          case "S100":
            returnMessage = 'Please check your inbox for code';
            break;
          case "S101":
            returnMessage = 'Please create new password at next page';
            break;
          case "S102":
            returnMessage = 'Your password changed successfully';
            break;
          case "S103":
            returnMessage = 'Your profile updated successfully';
            break;
          case "S104":
            returnMessage = 'Package saved as draft';
            break;
          case "S105":
            returnMessage = 'Package saved successfully';
            break;
          case "S106":
            returnMessage = 'Package scanned successfully.Now you can give that to hub';
            break;
          case "S107":
            returnMessage = 'Package scanned successfully.Now you can give that to driver';
            break;
          case "S108":
            returnMessage = 'Package scanned successfully.Now you can take care of it';
            break;
          case "S999Temp":
            returnMessage = 'List of available hubs';
            break;
          case "C100":
            returnMessage = 'You didn\'t fill out all the fields with additional information about your profile. Do you wish to continue? ';
            break;
          case "C101":
            returnMessage = 'If you close this page,you cannot activate your account never.Do you want to continue ?';
            break;
          case "C102":
            returnMessage = 'You didn\'t fill mandatory fields.Your package will save as a draft.Would you like to continue ?';
            break;
          case "C103":
            returnMessage = 'Are you sure ? Your package will be save like this permanently.';
            break;
          default:
            returnMessage = 'Something went wrong !';
            break;
        }

        return returnMessage;
      }

    }

  });
