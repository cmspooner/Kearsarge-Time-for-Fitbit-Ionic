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
            {color: "#FF0000"},
            {color: "#FF5555"},
            {color: "#CC0000"},
            {color: "#CC8888"},
            {color: "#FF9999"},
            {color: "#880000"},
            {color: "#884400"},
            
            {color: "#FFAA00"}, 
            {color: "#FF8800"},
            {color: "#FF4400"},
            {color: "#FFFF00"},
            {color: "#FFDD00"},
            {color: "#DDDD00"},
            {color: "#CC9922"},
            
            {color: "#00FF00"},
            {color: "#55FF55"},
            {color: "#00CC00"},
            {color: "#88CC88"},
            {color: "#99FF99"},
            {color: "#008800"},
            {color: "#448800"},
            
            {color: "#0000FF"},
            {color: "#5555FF"},
            {color: "#8888CC"},
            {color: "#9999FF"},
            {color: "#0000CC"},
            {color: "#000088"},
            {color: "#004488"},
            
            {color: "#FF00AA"},
            {color: "#FF0088"},
            {color: "#FF0044"},
            {color: "#FF00FF"},
            {color: "#4400FF"},
            {color: "#8800FF"},
            {color: "#AA00FF"}
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
