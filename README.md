# esp8266-react-scheduler
A basic scheduler for ESP8266 based on https://github.com/rjwats/esp8266-react
    -D FT_UPLOAD_FIRMWARE=1
FT_UPLOAD_FIRMWARE | Controls the whether the manual upload firmware feature is enabled. Disable this if you won't be manually uploading firmware.

Make sure you are familiar with building the project by going to the lick above for more documenation.

If you run into issues with the date-picker follow the steps on the link below, a manual intervention will be needed in that case:
https://material-ui-pickers.dev/getting-started/installation

You may need to install the following modules after an attempt on the initial build.
<p>npm i @material-ui/pickers
<p>npm i @date-io/date-fns@1.x date-fns
