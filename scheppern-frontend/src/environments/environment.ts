export const environment = {
  firebase: {
    projectId: 'scheppersite',
    appId: '1:106030566145:web:cc4aec14e4d2167b5c2900',
    databaseURL: 'https://scheppersite-default-rtdb.europe-west1.firebasedatabase.app',
    storageBucket: 'scheppersite.appspot.com',
    apiKey: 'AIzaSyB0pKhxP6HD0bUM6a4fcHVyystaTa-VHFM',
    authDomain: 'scheppersite.firebaseapp.com',
    messagingSenderId: '106030566145',
  },
  // Add emulator settings
  useEmulators: false,
  emulatorHost: 'localhost',
  emulatorPort: 8080, // Firestore emulator port
  production: false
};

export const Global = {
  darkMode: false,
  helperShifts: [
    {
      key: 'einlass',
      value: 'Einlass',
      description: `
        Um die beim Festival entstehenden Kosten zu decken, sollen diese fair durch alle Besucher*innen geteilt werden.
        Um dies zu ermöglichen und für Sicherheit zu sorgen wird es eine Einlasskontrolle geben. <br>
        Für die beiden Eingänge suchen wir daher motivierte Helfer*innen, die bei der Schicht die Tickets kontrollieren und auf ein Verhalten nach unseren Werten achten. <br>
        Bei Bedarf eilt unser Security-Team selbstverständlich an eure Seite. An sich könnt ihr aber eine entspannte Schicht erwarten, bei denen ihr sicherlich viele nette Gäste begrüßen dürft!
      `
    }, {
      key: 'bar',
      value: 'Bar',
      description: `
        Gibt nichts zu erklären, klassische Barschicht halt!
      `
    }, {
      key: 'awareness',
      value: 'Awareness',
      description: `
      Awareness Arbeit ist eine verantwortungsvolle Aufgabe mit dem Ziel, Diskriminierung und übergriffiges Verhalten zu verhindern und somit allen ein angenehmes Festival zu ermöglichen. Daher ist uns wichtig, dass wir uns auf dich verlassen können. <br><br>
        Zur Vorbereitung wird es ein verpflichtendes Awareness-Treffen {online und/oder zu Beginn des Festivals} geben. Dabei tauschen wir uns über die Aufgaben und Ziele der Awareness auf dem Festival aus und geben dir Handlungsmöglichkeiten für den Notfall an die Hand. Somit wollen wir sicherstellen, dass die Awareness-Teams gut koordiniert und vorbereitet sind. <br><br>
        Du wirst also von uns auf mögliche Schwierigkeiten vorbereitet werden und die Schichten mit mindestens einer weiteren Person gemeinsam bestreiten. Ihr werdet mit einer lila Weste als Erkennungszeichen und einem Telefon ausgestattet, auf dem ihr dauerhaft erreichbar seid. Außerdem wünschen wir uns von euch, dass ihr regelmäßig den Ort wechselt, um überall auf dem Gelände präsent zu sein und bei diskriminierendem und grenzüberschreitendem Verhalten eingreifen könnt. Es wird Aufmerksamkeit und Handlungsfähigkeit vorausgesetzt, sodass wir von allen, die diese Verantwortung übernehmen wollen, Nüchternheit während der Schicht erwarten.
      `
    }, {
      key: 'security',
      value: 'Security',
      description: `
        Du bekommst eine Funke in die Hand, bist auf dem Gelände präsent und jederzeit erreichbar.<br>
        Idealerweise hast du bereits Erfahrung und oder Qualifikationen in dem Bereich.<br>
        Wir werden in einem ersten Meeting die nötigen Details klären, inwiefern wir uns eine Zusammenarbeit vorstellen können!
      `
    }, {
      key: 'medic',
      value: 'Sanitäter',
      description: `
        Für unseren Sanitätsdienst benötigen wir Helfer:innen, welche eine Qualifikation in den Bereichen Rettungsdienst, Medizinstudium, Krankenpflege, Erste Hilfe o.Ä. mitbringen.<br><br>
        In einer Schicht bist du mit einer weiteren Person im Bereitschaftsdienst für Notfälle auf dem Gelände die erste Ansprechperson. Per Telefon/Funk werdet ihr im Falle eines Notfalls informiert. Auch ein Sanitätszelt wird es geben.<br>
        Geplant ist es, die Schichten so aufzuteilen, dass man 6 Stunden bis maximal 12 Stunden eingebunden ist. Um diese Aufgabe verantwortungsvoll auszuführen, ist es wichtig, dass du während dieser Zeit nüchtern bleibst.<br><br>
        Wenn du weitere Fragen hast, dann melde dich gern per Mail an: kai@scheppernaufbrettern.de
      `
    }
  ],
  nameCharLimit: 20,
  textCharLimit: 50,
  textAreaCharLimit: 5000
};
