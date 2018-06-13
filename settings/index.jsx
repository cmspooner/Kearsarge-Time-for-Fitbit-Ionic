function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Heading</Text>}>
        <Select
          label={`Date Format`}
          settingsKey="dateFormat"
          options={[
            {name:"Mon, Jan 31"},
            {name:"Jan 31, 2018"},
            {name:"1/31/2018"},
            {name:"Mon 31 Jan"},
            {name:"31. Jan 2018"},
            {name:"31/1/2018"},
            {name:"2018.01.31"},
            {name:"31. 1. 2018"},
            {name:"31.01.2018"},
          ]}
          />
        <Toggle
           settingsKey="batteryToggle"
           label="Change Battery Bar to Battery %" 
           onChange={value => props.settingsStorage.setItem('unit', value.toString())}
         />
      </Section>
      <Section
        title={<Text bold align="center">Weather</Text>}>
        <Toggle
           settingsKey="unitToggle"
           label="Set Temperature units to Celsius" 
           onChange={value => props.settingsStorage.setItem('unit', value.toString())}
         />
        <Toggle
           settingsKey="weatherScrollToggle"
           label="Disable weather scrolling"
         />
         <Toggle
           settingsKey="locationScrollToggle"
           label="Disable location scrolling"
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
           settingsKey="fetchToggle"
           label="Show when weather is fetched"
         />
        <Text align="left">
          These are mostly for information for nerds and debugging.
         </Text>
      </Section>
      <Section
        title={<Text bold align="center">Separator Bar Color</Text>}>
        <Toggle
          settingsKey="seperatorToggle"
          label="Color based on day's progress"
        />
        <Text align="center">
          Color when not overridden
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
          Beta 7.11.2: Fixed Weather Load Errors
        </Text>
        <Text>
          Beta 7.11.1: Fixed scroll toggle error!
        </Text>
        <Text>
          Beta 7.11: Moved forecase stuff around...noticed low was big and chinese cut the top off of today
        </Text>
        <Text>
          Beta 7.10.2: Another fix
        </Text>
        <Text>
          Beta 7.10.1: Wait 3 seconds befroe load weather
        </Text>
        <Text>
          Beta 7.10: Wait 3 seconds befroe load weather
        </Text>
         <Text>
          Beta 7.9: More Translation Work
        </Text>
        <Text>
          Beta 7.8.2: Removed some debugging settings
        </Text>
        <Text>
          Beta 7.8.1: Clear files before writing
        </Text>
        <Text>
          Beta 7.8: Changed string times to minutes from midnight
        </Text>
        <Text>
          Beta 7.7.2: Even More Cleaning for memory improvement
        </Text>
        <Text>
          Beta 7.7.1: More Cleaning for memory improvement
        </Text>
        <Text>
          Beta 7.7: Cleaning for memory improvement
        </Text>
        <Text>
          Beta 7.6: Modified Strings file and trying localization again
        </Text>
        <Text>
          Beta 7.5: Removed localization until fix memory issue
        </Text>
        <Text>
          Beta 7.4.2: Stil trying to fix memory issues
        </Text>
        <Text>
          Beta 7.4.1: Trying to fix memory issues
        </Text>
        <Text>
          Beta 7.4: Trying to fix memory issues
        </Text>
        <Text>
          Beta 7.3.2.1: Un-force chinese!
        </Text>
        <Text>
          Beta 7.3.2: Only using first two characters of locale
        </Text>
        <Text>
          Beta 7.3.1: More Translations and some memory work
        </Text>
        <Text>
          Beta 7.3: Raised stats update to once a second from once every 3 seconds. Started translation for chinese and spanish!
        </Text>
        <Text>
          Beta 7.2: Replace weather description "Sunny" to "Clear" when it's night time
        </Text>
        <Text>
          Beta 7.1: Fixed fetching debugging option; was always reporting current time
        </Text>
        <Text>
          Beta 7.0: Added extra Date formats and moving into localization
        </Text>
        <Text>
          Beta 6.13.1: Moved steps icon on both versa and ionic when coming off charger
        </Text>
        <Text>
          Beta 6.13: Fix steps on remove from charger on ionic
        </Text>
        <Text>
          Beta 6.12: Added show fetch option
        </Text>
        <Text>
          Beta 6.11: Change dayToSched to switch statement
        </Text>
        <Text>
          Beta 6.10: Make sure weather/period switch at beginning/end of day.
        </Text>
        <Text>
          Beta 6.9.2: Only update period after settings loaded;
        </Text>
        <Text>
          Beta 6.9.1: Load clock before setting to speed up start...maybe;
        </Text>
        <Text>
          Beta 6.9: Load clock right after setting to speed up start;
        </Text>
        <Text>
          Beta 6.8.1: Moved steps other direction on Ionic
        </Text>
        <Text>
          Beta 6.8: Back to work on handling battery state changes
        </Text>
        <Text>
          Beta 6.7.5: Remove some esoteric debugging issues, since it seems better...
        </Text>
        <Text>
          Beta 6.7.4: How bout now??
        </Text>
        <Text>
          Beta 6.7.3: EBEN MOAR DEBUG
        </Text>
        <Text>
          Beta 6.7.2: MOAR DEBUG
        </Text>
        <Text>
          Beta 6.7.1: Force Re-start Heart Monitor if no heartrate.
        </Text>
        <Text>
          Beta 6.7: Removed view check for clock and period data
        </Text>
        <Text>
          Beta 6.6: Update charge info when pluggedin/unplugged
        </Text>
        <Text>
          Beta 6.5: More Detailed Heartrate Failure Modes
        </Text>
        <Text>
          Beta 6.4: If no show error, show location
        </Text>
        <Text>
          Beta 6.3: Bold forecast dates!
        </Text>
        <Text>
          Beta 6.2.1: Steps image way low, steps text too high
        </Text>
        <Text>
          Beta 6.2: Started handle battery alert on other screens
        </Text>
        <Text>
          Beta 6.1.3: Small adjustment on Veras....Ionic is probably trash!
        </Text>
        <Text>
          Beta 6.1.2: Trying again again again
        </Text>
        <Text>
          Beta 6.1.1: Trying again again
        </Text>
        <Text>
          Beta 6.1: Trying again
        </Text>
        <Text>
          Beta 6.0: Trying to handle low-battery and charging states.
        </Text>
        <Text>
          Beta 5.12: Changed schedule function to return only one schedule
        </Text>
        <Text>
          Beta 5.11: Fixed the auto day switching error
        </Text>
        <Text>
          Beta 5.10.1.1: Speeling es hrad
        </Text>
        <Text>
          Beta 5.10.1: Forgot to do Ionic...fixed now!
        </Text>
        <Text>
          Beta 5.10: Battery % to bar graph option
        </Text>
        <Text>
          Beta 5.9.1: Add update Period to update Clock
        </Text>
        <Text>
          Beta 5.9: Fix timeStamp error; Thanks Dave!
        </Text>
        <Text>
          Beta 5.8: Changed views to global; hope to fix some performance issues
        </Text>
        <Text>
          Beta 5.7.2.1: Change reset view on change to off, using the correct syntax
        </Text>
        <Text>
          Beta 5.7.2: Change reset view on change to off
        </Text>
        <Text>
          Beta 5.7.1: Remove reset view on change
        </Text>
        <Text>
          Beta 5.7: only update correct interval
        </Text>
        <Text>
          Beta 5.6.3: Changed view loading to only load the parts needed
        </Text>
        <Text>
          Beta 5.6.2: Fixed Versa cal bug and moved initial clock/period load before weather load 
        </Text>
        <Text>
          Beta 5.6.1: Fix first run I think...
        </Text>
        <Text>
          Beta 5.6: Now with date options!
        </Text>
        <Text>
          Beta 5.5.1: Missed a DOM ref
        </Text>
        <Text>
          Beta 5.5: Weather now saves!!!
        </Text>
        <Text>
          Beta 5.4: Moved each variable in schedule.js to functions
        </Text>
        <Text>
          Beta 5.3.2: changed period stuff
        </Text>
        <Text>
          Beta 5.3: Moved Dom References into functions
        </Text>
        <Text>
          Beta 5.2.3: Fix temp change error
        </Text>
        <Text>
          Beta 5.2.2: Fix tons of schedule stuff
        </Text>
        <Text>
          Beta 5.2.1: Fix heart rate
        </Text>
        <Text>
          Beta 5.2: Memory clean-up work
        </Text>
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
          Beta 4.12: Major reformatting for Versa (Thanks Fitbit!!!)
        </Text>
        <Text>
          Beta 4.11.3: Faster refresh when failed, actually this time.
        </Text>
        <Text>
          Beta 4.11.2: Faster refresh when failed.
        </Text>
        <Text>
          Beta 4.11.1: Force fetch when no settings.
        </Text>
        <Text>
          Beta 4.11: More aggressive rounding of recent time calc and more aggressive settings saving.
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
          Beta 4.0: Weather forecast screen.
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
          Beta 2.1.3: Change Battery
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


