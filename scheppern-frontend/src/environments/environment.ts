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
  darkMode: false
};
