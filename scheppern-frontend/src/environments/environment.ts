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
    firebaseConfig: {
        apiKey: 'AIzaSyB0pKhxP6HD0bUM6a4fcHVyystaTa-VHFM',
        authDomain: 'scheppersite.firebaseapp.com',
        // authDomain: 'localhost',
        projectId: 'scheppersite',
        storageBucket: 'scheppersite.appspot.com',
        messagingSenderId: '106030566145',
        appId: '1:106030566145:web:cc4aec14e4d2167b5c2900',
    },
    // Add emulator settings
    useEmulators: false,
    emulatorHost: 'localhost',
    emulatorPort: 8080, // Firestore emulator port
    production: false,
};

export const Global = {
  darkMode: false,
  helperShifts: [{
      key: 'bar',
      value: 'Bar',
      description: `
        Als Barschicht hast du die Möglichkeit die Welt auf einmal aus einer ganz anderen Perspektive zu sehen und zwar aus der
        hinterdemthresensteh-Perspektive.
      `
    }, {
      key: 'kueche',
      value: 'Küche',
      description: `
        Wir planen diesmal zu bestimmten Uhrzeiten Essen auszugeben. Schnippelhilfen können wir dabei immer gebrauchen. Solltest
        du selber Kocherfahrung mitbringen und Lust haben ein Gericht zu übernehmen, schreib es uns, dann planen wir
        zusammen!
      `
    }, {
      key: 'einlass',
      value: 'Einlass',
      description: `
        Leider durften wir letztes Jahr feststellen, dass wir doch nicht ganz nur wir waren auf dem Festival. Es haben sich eine
        Handvoll ungebetene Gäste unter uns geschlichen und auch einen erheblichen finanziellen Schaden verursacht. Um dies
        diesmal zu verhindern müssen wir leider den Einlass intensiver bewachen. Da wir 2 Eingänge haben ist das natürlich
        doppelt ärgerlich. Für ein bisschen Entertainment am Eingang werden wir auf jeden Fall sorgen!
        Gerne könnt ihr dort auch mit euren Homies chillen, allerdings sollte natürlich ein offenes Auge auf den Eingang zu
        jeder Zeit gewährleistet sein! Ihr bekommt eine Funke in die Hand und habt jederzeit die Möglichkeit Security zu rufen,
        falls ihr Probleme bekommt! Zu Stoßzeiten wird Security aber auch selber dort sein!
        `
    }, {
      key: 'awareness',
      value: 'Awareness',
      description: `
        Es wird ein ganzes Awareness Team geben und du bekommst ein Briefing vorher. Im Grundsatz übt Awareness bei uns keine
        Kontrolle aus, sondern ist streitschlichtender und problemlösender Part. Falls ihr euch nicht wohl fühlt, ist die
        Awareness Crew für euch da!
      `
    }, {
      key: 'security',
      value: 'Security',
      description: `
        Mit Lizenz oder nur mit Erfahrung, beides sehr willkommen!
      `
    }, {
      key: 'aufbau',
      value: 'Aufbau',
      description: `
        Der Aufbau startet schon bereits eine Woche vorher. Du solltest in der Zeit zum Großteil Zeit haben. Es gibt viel zu bauen und aufzubauen.
      `
    }, {
      key: 'abbau',
      value: 'Abbau',
      description: `
        Darauf hat keiner Bock, aber vielleicht ja du! Wir werden vorraussichtlich den Montag und den Dienstag beschäftigt sein.
      `
    }]
};