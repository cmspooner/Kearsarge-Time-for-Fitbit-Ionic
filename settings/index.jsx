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
          settingsKey="dataAgeToggle"
          label="Show age of last weather update"
        />
      </Section>
      <Section
        title={<Text bold align="center">Seperator Bar Color</Text>}>
        <Toggle
          settingsKey="seperatorToggle"
          label="Color based on day's progress"
        />
        <ColorSelect
          settingsKey="color"
          colors={[
            {color: "firebrick"},
            {color: "darkorange"}, 
            {color: "gold"},
            {color: "deepskyblue"},
            {color: "olivedrab"},
            {color: "deeppink"},
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
    </Page>
  );
}

registerSettingsPage(mySettings);
