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
        Um dies zu ermöglichen und für Sicherheit zu sorgen wird es eine Einlasskontrolle geben. 
        Für die beiden Eingänge suchen wir daher noch motivierte Helfer*innen, die bei der Schicht die Tickets kontrollieren und auf ein Verhalten nach unseren Werten achten. 
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
        Awareness Arbeit ist eine verantwortungsvolle Aufgabe mit dem Ziel, allen Teilnehmenden ein angenehmes Festival zu ermöglichen. 
        Dabei wirkt sie präventiv und reaktiv Diskriminierung und übergriffigem Verhalten verhindernd entgegen. 
        Uns ist wichtig, dass wir uns auf dich verlassen können. Zur Vorbereitung wird es ein verpflichtendes Awareness-Treffen geben. 
        Wir tauschen uns über die Aufgaben und Ziele der Awareness auf dem Festival aus und geben dir Handlungsmöglichkeiten für den Notfall an die Hand. 
        Wir wollen sicherstellen, dass die Awareness-Teams gut koordiniert und vorbereitet sind. Du wirst von uns auf mögliche Schwierigkeiten vorbereitet und in den Schichten auch nicht alleine eingeteilt werden. 
        Ihr bekommt eine lila Weste und einem Telefon, auf dem ihr zu der Zeit dauerhaft erreichbar seid. 
        Außerdem wünschen wir uns von euch, dass ihr regelmäßig den Ort wechselt, um überall auf dem Gelände präsent zu sein und bei diskriminierendem und grenzüberschreitendem Verhalten eingreifen zu können. 
        Es wird Aufmerksamkeit und Handlungsfähigkeit vorausgesetzt, sodass wir von allen, die diese Verantwortung übernehmen wollen, Nüchternheit während der Schicht erwarten.
      `
    }, {
      key: 'security',
      value: 'Security',
      description: `
        Du bekommst eine Funke in die Hand, bist auf dem Gelände präsent und jederzeit erreichbar. 
        Idealerweise hast du bereits Erfahrung und oder Qualifiaktionen in dem Bereich. 
        Wir werden in einem ersten Meeting die nötigen Details klären, inwiefern wir uns eine Zusammenarbeit vorstellen können!
        Security wird auf dem Festival nicht dazu da sein, die Gäste zu überwachen, sondern ist für uns einfach als eine zusätzliche Maßnahme da,
        um in Krisensitationen (wie der Diebstahl von Laptops 2023) handlungsfähig zu bleiben und allen Gästen das Gefühl zu geben an einem sicheren Ort zu sein.
      `
    }
  ],
  textCharLimit: 50,
  textAreaCharLimit: 5000
};