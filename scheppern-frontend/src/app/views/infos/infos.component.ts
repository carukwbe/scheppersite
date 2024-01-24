import { Component } from '@angular/core';

@Component({
  selector: 'app-infos',
  templateUrl: './infos.component.html',
  styleUrls: ['./infos.component.css']
})
export class InfosComponent {
  faqSections = [
    {
      title: 'Allgemeines',
      questions: [
        {
          question: 'Wer sind wir?',
          answer: 'Wir sind das sagenumwobene Klangkollektiv Braunschweig e.V., das im Jahr 2023 aus der fröhlichen Geburtstagsfeier von drei Freunden entstanden ist. Mittlerweile sind wir ein eingetragener Verein und alle hochmotiviert, Großes zu vollbringen und eine Zeit zu schaffen, die keiner so schnell vergessen wird.'
        },
        {
          question: 'Was zeichnet uns aus?',
          answer: 'Familiarität, Zusammenhalt, Toleranz, Offenheit - das sind nicht nur Worte für uns, sondern der heilige Gral unseres Klangkollektivs. Wir sind so verbunden wie die Noten der Musik die wir lieben!'
        },
        {
          question: 'Was passiert mit den Einnahmen und warum ist das Ticket teurer als letztes Jahr?',
          answer: 'Das Scheppern findet in 2024 erstmalig öffentlich statt, daher kommen viele Punkte dazu, die wir vorher nicht bezahlen mussten. Wir auch schon wieder viel zu viele Dinge geplant, sodass wir einfach mehr Geld für Bauprojekte brauchen'
        },
      ]         
    }, {

      title: 'Festival',
      questions: [
        {
          question: 'Was zeichnet das Scheppern aus?',
          answer: 'Unser Festival bringt den Begriff "Wind in den Haaren" auf ein neues Level - auf dem Land, umgeben von majestätischen Windrädern. Hier wird nicht nur die Musik, sondern auch die Windturbine im Takt schaukeln!'
        },
        {
          question: 'Was erwartet mich auf dem Festival?',
          answer: 'Mehrere Bühnen, als wären wir im Bühnenhimmel! Workshops, die so lehrreich sind, dass selbst die Windräder neidisch werden. Bands, die so rockig sind, dass selbst die Grashalme im Rhythmus wippen, und DJs, die die Hühner auf der benachbarten Farm in Ekstase versetzen!'
        },
        {
          question: 'Wie erreiche ich das Scheppern Festival?',
          answer: ''
        },
        {
          question: 'Anreise/Abreise',
          answer: ''
        },
        {
          question: 'Was ist mit Fahrgemeinschaften?',
          answer: ''
        },
        {
          question: 'Welche Campingbereiche gibt es und wo ist es laut/leise?',
          answer: 'Es gibt verschiedene Campingbereiche, auch welche weiter weg sind und als Leise Camping ausgeschrieben werden. Letztes Jahr gab es ein paar Beschwerden, dass der Djungle sehr lange mit nicht gerade Schlaffreundlicher Musik lief, das haben wir auf jeden Fall auf dem Schirm!'
        },
        {
          question: 'Kann ich mein Auto/Camper aufs Campinggelände mitnehmen?',
          answer: ''
        },
        {
          question: 'Kann ich mit meinem Auto/Camper die Campingfläche jederzeit verlassen?',
          answer: ''
        },
        {
          question: 'Ist es erlaubt zu grillen oder einen Campingkocher zu nutzen?',
          answer: ''
        },
        {
          question: 'Treten neben DJs auch Bands auf?',
          answer: ''
        },
        {
          question: 'Wo finde ich Informationen zu Workshops und dem Timetable?',
          answer: ''
        },
        {
          question: 'Wo finden die Workshops statt?',
          answer: ''
        },
        {
          question: 'Wie melde ich mich zu Turnieren wie Flunky- oder Völkerball an?',
          answer: ''
        },
        {
          question: 'Mülltrennung',
          answer: 'Wir haben uns trotz vorher kalkuliertem doppeltem Preis für eine konsquent angebotene Mülltrennung entschieden. Daher gibt es bei jeder Müllstation 3 Müllarten. Zusätzlich haben wir noch zentrale Orte für Glas und Pfand. Schaut auf dem Plan, wo ihr diese findet'
        }
      ]         
    }, {
      title: 'Ticketkauf',
      questions: [
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
          answer: 'Unter dem Link in deiner Ticket E-Mail, kannst du dein Ticket weitergeben. Dazu gibst du die Daten der Tauschperson inklusive E-Mail ein. Die Tauschperson bekommt nun eine E-Mail in der sie die Möglichkeit hat das Ticket zu bestätigen. Anschließend bekommt sie dann ein eigenes neues Ticket. Das alte Ticket verliert ab Bestätigung der neuen Person seine Gültigkeit. Solltest du keine/n Tauschpartner/in finden, kontaktiere uns. Es wird nach Verkauf des letzten Tickets eine Warteliste/WhatsApp-Gruppe geben, für die Vermittlung der Tickets.'
        },
        {
          question: 'Mist, alle Tickets weg!',
          answer: 'Erfahrungsgemäß gibt es in den letzten Tagen immer ein paar Absagen. Trag dich in unsere Warteliste ein! Wir vermitteln dich, sobald du an der Reihe bist weiter. Anschließend müsst ihr euch privat einig werden und das Ticket via Umpersonalisierungsformular weitergeben!'
        }
      ]         
    }];
}
