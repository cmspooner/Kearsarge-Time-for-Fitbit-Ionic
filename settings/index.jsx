function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Seperator Bar Color</Text>}>
        <ColorSelect
          settingsKey="color"
          colors={[
            {color: "red"},
            {color: "#FFA500"}, //orange
            {color: "gold"},
            {color: "steelblue"},
            {color: "olivedrab"},
            {color: "#FF00FF"}, //FF00FF
            {color: "purple"}
          ]}
        />
      </Section>
      <Select
        label={`Type of Day`}
        settingsKey="schedule"
        options={[
          {name:"Regular"},
          {name:"No School"},
          {name:"MF"},
          {name:"Tuesday"},
          {name:"Wednesday"},
          {name:"Thurdsay"},
          {name:"2 Hour Delay"},
          {name:"PM Activity"},
          {name:"Assembly"},
          {name:"7 Period Day"},
          {name:"Exam"},
        ]}
        />
    </Page>
  );
}

registerSettingsPage(mySettings);
