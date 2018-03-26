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
            {color: "red"},
            {color: "crimson"},
            {color: "tomato"},
            {color: "indianred"},
            {color: "firebrick"},
            {color: "maroon"},
            {color: "darkred"},
            
            {color: "darkorange"}, 
            {color: "orange"},
            {color: "coral"},
            {color: "orangered"},
            {color: "yellow"},
            {color: "gold"},
            {color: "goldenrod"},
            
            {color: "greenyellow"},
            {color: "aquamarine"},
            {color: "darkseagreen"},
            {color: "olivedrab"},
            {color: "seagreen"},
            {color: "forestgreen"},
            {color: "darkgreen"},
            
            {color: "dodgerblue"},
            {color: "deepskyblue"},
            {color: "lightskyblue"},
            {color: "aqua"},
            {color: "darkslateblue"},
            {color: "darkblue"},
            {color: "navy"},
            
            {color: "deeppink"},
            {color: "hotpink"},
            {color: "fuchsia"},
            {color: "magenta"},
            {color: "lightpink"},
            {color: "plum"},
            {color: "purple"}
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
