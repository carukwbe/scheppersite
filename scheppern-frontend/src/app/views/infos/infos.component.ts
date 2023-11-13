import { Component } from '@angular/core';

@Component({
  selector: 'app-infos',
  templateUrl: './infos.component.html',
  styleUrls: ['./infos.component.css']
})
export class InfosComponent {
  faqItems: any[] = [
    // {
    //   question: 'Was ist Scheppern?',
    //   answer: 'Fahrrad fahren ist schön. Fahrrad fahren mit Musik ist schöner. Fahrrad fahren mit Musik, die andere hören können, ist am schönsten. Scheppern ist eine App, die dir hilft, deine Musik mit anderen zu teilen. Sie ist für Android und iOS verfügbar.'
    // },
    // {
    //   question: 'Wie funktioniert Scheppern?',
    //   answer: 'Scheppern funktioniert mit Bluetooth. Du verbindest dein Handy mit deinem Fahrradlautsprecher und spielst deine Musik ab. Scheppern übernimmt den Rest. Wenn du eine Strecke fährst, die du schon einmal gefahren bist, wird Scheppern die Musik, die du beim letzten Mal gehört hast, automatisch abspielen. Wenn du eine neue Strecke fährst, wird Scheppern dir eine Playlist mit Musik vorschlagen, die andere Scheppern-Nutzer in der Nähe gerne hören.'
    // },
    // {
    //   question: 'Wo kann man Scheppern benutzen?',
    //   answer: 'Scheppern ist in Berlin verfügbar. Wenn du in Berlin bist, kannst du Scheppern nutzen. Wenn du nicht in Berlin bist, kannst du Scheppern nicht nutzen. Wenn du in Berlin bist, aber Scheppern nicht nutzen kannst, dann ist das schade. Wenn du in Berlin bist und Scheppern nutzen kannst, dann ist das schön.'
    // },
    {
      question: 'Wie funktioniert das Ticket-System?',
      answer: 'Für die volle Kontrolle und die größte Flexibilität, haben wir uns entschieden, das Ticketsystem selbst zu bauen. Wir speichern deine Daten mit Absenden des Formulars in unserer eignen Datenbank. Nach dem Festival werden personenbezogenen Daten auch wieder gelöscht.'
    },
    {
      question: 'Hilfe ich hab kein Ticket bekommen!',
      answer: 'Du solltest nach Abschicken des Formulars direkt eine Bestätigungsmail bekommen haben. Das eigentliche Ticket kann je nach Banküberweisungsdauer auch erst nach ein paar Tagen erst kommen. Solltest du dich in der E-Mail vertippt haben oder es sonstige Probleme mit deinem Mail Account geben, dann kontaktiere uns.'
    },
    {
      question: 'Ich hab geheiratet und heiße jetzt anders',
      answer: 'Gar kein Film, ändere deine Daten einfach über den Link in deiner Ticket E-Mail.'
    },
    {
      question: 'Ich kann doch nicht kommen und möchte mein Ticket gerne loswerden!',
      answer: 'Unter dem Link in deiner Ticket E-Mail, kannst du dein Ticket weitergeben. Dazu gibst du die Daten der Tauschperson inklusive E-Mail ein. Die Tauschperson bekommt nun eine E-Mail in der sie die Möglichkeit hat das Ticket zu bestätigen. Anschließend bekommt sie dann eine Mail mit ganz eigenem Ticket. Das alte Ticket verliert natürlich seine Gültigkeit. Solltest du keine/n Ticketkäufer*in finden, wende dich an uns, wir versuchen zu vermitteln!'
    },
    {
      question: 'Mist, ich bin zu spät!',
      answer: 'Erfahrungsgemäß gibt es in den letzten Tagen immer ein paar Absagen. Trag dich in unsere Warteliste ein! Wir vermitteln dich, sobald du an der Reihe bist weiter. Anschließend müsst ihr euch privat einig werden und das Ticket via Umpersonalisierungsformular weitergeben!'
    }
  ]
}
