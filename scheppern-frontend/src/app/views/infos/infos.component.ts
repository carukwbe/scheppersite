import { Component } from '@angular/core';

@Component({
  selector: 'app-infos',
  templateUrl: './infos.component.html',
  styleUrls: ['./infos.component.css']
})
export class InfosComponent {
  faqItems: any[] = [
    {
      question: 'Wer sind wir?',
      answer: 'Wir sind der 2023 gegründete Klangkollektiv Braunschweig e.V.. Angefangen 2022 als Geburtstagsfeier von 3 Freunden sind wir nun auf um die 30 Mitglieder angewachsen. Wir sind alle höchstmotiviert große Dinge anzupacken und eine unvergessliche Zeit zu schaffen.'
    },
    {
      question: 'Was zeichnet uns aus?',
      answer: 'Familiarität, Zusammenhalt, Toleranz, Offenheit.'
    },
    {
      question: 'Wie funktioniert das Ticket-System?',
      answer: 'Für die volle Kontrolle und die größte Flexibilität, haben wir uns entschieden, das Ticketsystem selbst zu implementieren. Wir speichern deine Daten mit Absenden des Formulars in einer eigenen Datenbank. Nach dem Festival werden personenbezogenen Daten natürlich wieder gelöscht.'
    },
    {
      question: 'Hilfe ich hab kein Ticket bekommen!',
      answer: 'Du solltest nach Abschicken des Formulars direkt eine Bestätigungsmail bekommen haben. Das eigentliche Ticket kann je nach Banküberweisungsdauer auch erst nach ein paar Tagen kommen. Solltest du dich in der E-Mail vertippt haben oder es sonstige Probleme mit deinem Mail Account geben, dann kontaktiere uns.'
    },
    {
      question: 'Ich hab geheiratet und heiße jetzt anders!',
      answer: 'Gar kein Film, ändere deine Daten einfach über den Link in deiner Ticket E-Mail.'
    },
    {
      question: 'Ich kann doch nicht kommen und möchte mein Ticket gerne loswerden!',
      answer: 'Unter dem Link in deiner Ticket E-Mail, kannst du dein Ticket weitergeben. Dazu gibst du die Daten der Tauschperson inklusive E-Mail ein. Die Tauschperson bekommt nun eine E-Mail in der sie die Möglichkeit hat das Ticket zu bestätigen. Anschließend bekommt sie dann ein eigenes neues Ticket. Das alte Ticket verliert natürlich ab Bestätigung seine Gültigkeit. Solltest du keine/n Ticketkäufer*in finden, wende dich an uns, wir können dich wahrscheinlich vermitteln!'
    },
    {
      question: 'Mist, ich bin zu spät!',
      answer: 'Erfahrungsgemäß gibt es in den letzten Tagen immer ein paar Absagen. Trag dich in unsere Warteliste ein! Wir vermitteln dich, sobald du an der Reihe bist weiter. Anschließend müsst ihr euch privat einig werden und das Ticket via Umpersonalisierungsformular weitergeben!'
    }
  ]
}
