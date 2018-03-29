function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Weather</Text>}>
        <Select
          label={`Update Interval`}
          settingsKey="updateInterval"
          options={[
            {name:"15 minutes"},
            {name:"30 minutes"},
            {name:"1 hour"},
            {name:"2 hours"},
          ]}
         />
         <Toggle
           settingsKey="unitToggle"
           label="Tempterature in °F or °C"
         />
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
            {color: "#CC0000"},
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
        title={<Text bold align="center">Build Version and Notes</Text>}>
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
