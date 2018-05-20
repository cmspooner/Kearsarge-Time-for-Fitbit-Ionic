function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Weather</Text>}>
        <Toggle
           settingsKey="unitToggle"
           label="US or Metric Units" 
           onChange={value => props.settingsStorage.setItem('unit', value.toString())}
         />
        <Text>Temperatures in degrees {props.settingsStorage.getItem('unit') == "true" ? "celsius" : "fahrenheit"}</Text>
        <Toggle
           settingsKey="weatherScrollToggle"
           label="Dissable weather scrolling"
         />
         <Toggle
           settingsKey="locationScrollToggle"
           label="Dissable location scrolling"
         />
        <Select
          label={`Weather Update Interval`}
          settingsKey="updateInterval"
          options={[
            {name:"5 minutes"},
            {name:"15 minutes"},
            {name:"30 minutes"},
            {name:"1 hour"},
            {name:"2 hours"},
          ]}
         />
        <Text align="center">
          Decreasing this will use more WATCH battery. 
        </Text>
        <Select
          label={`Location Update Interval`}
          settingsKey="locationUpdateInterval"
          options={[
            {name:"5 minutes"},
            {name:"15 minutes"},
            {name:"30 minutes"},
            {name:"1 hour"},
            {name:"2 hours"},
          ]}
         />
         <Text align="center">
           Decreasing this will use more PHONE battery.
         </Text>
         <Toggle
           settingsKey="dataAgeToggle"
           label="Show time of last weather update"
         />
         <Toggle
           settingsKey="errorMessageToggle"
           label="Show weather error messages"
         />
         <Toggle
           settingsKey="failCountToggle"
           label="Show number of weather attempts"
         />
        <Text align="left">
          These are mostly for informataion for nerds and depugging.
         </Text>
      </Section>
      <Section
        title={<Text bold align="center">Seperator Bar Color</Text>}>
        <Toggle
          settingsKey="seperatorToggle"
          label="Color based on day's progress"
        />
        <Text align="center">
          Color when not over-ridden
        </Text>
        <ColorSelect
          settingsKey="color"
          colors={[
            {color: "#FFCCCC"},
            {color: "#FF7F7F"},
            {color: "#FF4C4C"},
            {color: "#FF0000"},
            {color: "#CC0000"},
            {color: "#990000"},
            {color: "#660000"},
            
            {color: "#FF7700"}, 
            {color: "#FFAB00"},
            {color: "#FFCC00"},
            {color: "#FFFF00"},
            {color: "#E5E533"},
            {color: "#CCCC19"},
            {color: "#999919"},
            
            {color: "#B2FFB2"},
            {color: "#66FF66"},
            {color: "#33FF33"},
            {color: "#00FF00"},
            {color: "#00B200"},
            {color: "#339933"},
            {color: "#196619"},
            
            {color: "#00FF9C"},
            {color: "#00FFB9"},
            {color: "#00FFC8"},
            {color: "#00FFFF"},
            {color: "#00EEFF"},
            {color: "#00CDFF"},
            {color: "#00B6FF"},
            
            {color: "#B2B2FF"},
            {color: "#9999FF"},
            {color: "#4C4CFF"},
            {color: "#0000FF"},
            {color: "#0000B2"},
            {color: "#0000AA"},
            {color: "#004C99"},
           
            {color: "#9600FF"},
            {color: "#BE00FF"},
            {color: "#D300FF"},
            {color: "#FF00FF"},
            {color: "#FF00CB"},
            {color: "#FF009E"},
            {color: "#FF006A"}
          ]}
        />
      </Section>
      <Section
        title={<Text bold align="center">Schedule</Text>}>
        <Select
          label={`Type of Day`}
          settingsKey="schedule"
          options={[
            {name:"Regular"},
            {name:"No School"},
            {name:"2 Hour Delay"},
            {name:"PM Activity"},
            {name:"Assembly"},
            {name:"7 Period"},
            {name:"Exam"},
          ]}
          />
      </Section>
      <Section
        title={<Text bold align="center">Contact Me</Text>}>
        <Text>
          Please don't hesitate to contact me with questions or suggestions; but be sure to let me know which app or watchface you are talking about. This and all my other apps will always be free and Open Source. If you really like my app please consider buying me a coffee (or more likely electronic components that end up in my classroom). Thanks!
        </Text>
        <Link source="https://rawgit.com/cmspooner/Kearsarge-Time-for-Fitbit-Ionic/master/settings/email.html">
          <TextImageRow
            label="Email"
            sublabel="cmspooner@gmail.com"
            icon="https://github.com/cmspooner/Kearsarge-Time-for-Fitbit-Ionic/blob/master/resources/icons/settings/Email.png?raw=true"
          />
        </Link>
        <Link source="https://github.com/cmspooner">
          <TextImageRow
            label="Github"
            sublabel="https://github.com/cmspooner"
            icon="https://github.com/cmspooner/Kearsarge-Time-for-Fitbit-Ionic/blob/master/resources/icons/settings/Github.png?raw=true"
          />
        </Link>
        <Link source="https://paypal.me/CMSpooner">
          <TextImageRow
            label="PayPal"
            sublabel="cmspooner@gmail.com"
            icon="https://github.com/cmspooner/Kearsarge-Time-for-Fitbit-Ionic/blob/master/resources/icons/settings/Paypal.png?raw=true"
          />
        </Link>
      </Section>
      <Section
        title={<Text bold align="center">Build Version and Notes</Text>}>
        <Text>
          Beta 5.0.0: Revert...time to start cleaning memory usage
        </Text>
        <Text>
          Beta 5.1: Saving weather data
        </Text>
        <Text>
          Beta 5.0: Moved weather and condition on ionic.
        </Text>
        <Text>
          Beta 4.15.4: Fixed overly aggressive and replacement.
        </Text>
        <Text>
          Beta 4.15.3: Fixed yet another shortener.
        </Text>
        <Text>
          Beta 4.15.2.1: Fixing yet another shortener.
        </Text>
        <Text>
          Beta 4.15.2: Fixed yet another shortener.
        </Text>
        <Text>
          Beta 4.15.1: Fixed another shortener.
        </Text>
        <Text>
          Beta 4.15: Shortened text fields that were running off the screen.
        </Text>
        <Text>
          Beta 4.14.0: Reverted The reversion change because I broke Carbees Watch still.
        </Text>
        <Text>
          Beta 4.13.0: Reverted change because I broke Carbees Watch.....ooops.
        </Text>
        <Text>
          Beta 4.14: Changed height check to device check.
        </Text>
        <Text>
          Beta 4.13: Change from local to adjusted steps.
        </Text>
        <Text>
          Beta 4.12.4: Very small tweaks.
        </Text>
        <Text>
          Beta 4.12.3: Update time stamp on setting change and small tweaks.
        </Text>
        <Text>
          Beta 4.12.2: Minor reformatting for Versa on forecast.
        </Text>
        <Text>
          Beta 4.12.1: Minor reformatting for Versa.
        </Text>
        <Text>
          Beta 4.12: Major reformatting for Versa (Thanks Fitbot!!!)
        </Text>
        <Text>
          Beta 4.11.3: Faster refresh when failed, actually this time.
        </Text>
        <Text>
          Beta 4.11.2: Faster refresh when failed.
        </Text>
        <Text>
          Beta 4.11.1: Force fecth when no settings.
        </Text>
        <Text>
          Beta 4.11: More agressive rounding od recent time calc and more agressive settings saving.
        </Text>
        <Text>
          Beta 4.10.1: Fixed settings layout.
        </Text>
        <Text>
          Beta 4.10: Added setting for location update interval.
        </Text>
        <Text>
          Beta 4.9.4: Fix type in error message
        </Text>
        <Text>
          Beta 4.9.3: It works when tethered to my computer!
        </Text>
        <Text>
          Beta 4.9.2: I have no idea...
        </Text>
         <Text>
          Beta 4.9.1: Maybe this time I have it right??
        </Text>
        <Text>
          Beta 4.9: Got update running on time, without extra updates!
        </Text>
        <Text>
          Beta 4.8: Major cleaning on setting application
        </Text>
        <Text>
          Beta 4.7.2: reset weather update interval...again?
        </Text>
        <Text>
          Beta 4.7.1: reset weather update interval
        </Text>
        <Text>
          Beta 4.7: Fixed multiple hits to weather api on start
        </Text>
        <Text>
          Beta 4.6: Now running on most recent weather API
        </Text>
        <Text>
          Beta 4.5.2: Changed draw/hide order.
        </Text>
        <Text>
          Beta 4.5.1: Fixed overdraw error when changing schedule.
        </Text>
        <Text>
          Beta 4.5: Contact links in settings.
        </Text>
        <Text>
          Beta 4.4: Settings now stored properly.
        </Text>
        <Text>
          Beta 4.3.1: Updating to make sure that I'm in sync.
        </Text>
        <Text>
          Beta 4.3: Now using proper deg F via yahoo api, rather derived from deg C.
        </Text>
        <Text>
          Beta 4.2: Fixed shortening bug.
        </Text>
        <Text>
          Beta 4.1: Fixes to forcast screen.
        </Text>
        <Text>
          Beta 4.0: Weather forcast screen.
        </Text>
        <Text>
          Beta 3.2: Storing weather and showing last weather loaded and moving update message to location.
        </Text>
        <Text>
          Beta 3.1: back to beta! Manually fixing thunderstorm icons when showers.
        </Text>
        <Text>
          Beta 3.0.4: fixed shortener and now works... I hope
        </Text>
        <Text>
          Beta 3.0.3: Fixed duplicate red in settings, cleaned up spacing in versa stats screen
        </Text>
        <Text>
          Beta 3.0.2: Changed shortener change showers to rain, removed linking to submodules folder, removed non-build files from fitbit project; will leave in repo though.
        </Text>
        <Text>
          Beta 3.0.1: Changed shortener to fix more "Showers" problems
        </Text>
        <Text>
          Beta 3.0.0.1: Fixed Ionic Break!
        </Text>
        <Text>
          Beta 3.0: Now Versa Compatible!
        </Text>
        <Text>
          Beta 2.1.12: Changed color coding to be more rainbow-like, for reals this time. Used pallet tool at: http://www.perbang.dk/
        </Text>
        <Text>
          Beta 2.1.11: Changed color coding to be more rainbow-like
        </Text>
        <Text>
          Beta 2.1.10: Added a huge number of color options
        </Text>
        <Text>
          Beta 2.1.9: Shortened long weather descriptions
        </Text>
        <Text>
          Beta 2.1.8: Weather should update in background, all intervals now in x*1000 notation.
        </Text>
        <Text>
          Beta 2.1.7: Made changes to weather error handling.
        </Text>
        <Text>
          Beta 2.1.6: Fixed Rain showing as thunderstorm and added comments to weather icon switch statement
        </Text>
        <Text>
          Beta 2.1.5: Added this section
        </Text>
        <Text>
          Beta 2.1.4.2: Added Error Message to Weather
        </Text>
        <Text>
          Beta 2.1.4.1: Fixed updating message
        </Text>
        <Text>
          Beta 2.1.4: Updating Message Added
        </Text>
        <Text>
          Beta 2.1.2.1: Reverted Battery Change
        </Text>
        <Text>
          Beta 2.1.3: Chaged Battery
        </Text>
        <Text>
          Beta 2.1.2: Clean Up Battery
        </Text>
        <Text>
          Beta 2.1.1: Added Battery Percentage Color based on level
        </Text>
        <Text>
          Beta 2.1: Added Battery Percentage.
        </Text>
        <Text>
          Beta 2.0: Added Weather.
        </Text>
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);
