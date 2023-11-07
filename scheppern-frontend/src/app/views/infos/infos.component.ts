import { Component } from '@angular/core';

@Component({
  selector: 'app-infos',
  templateUrl: './infos.component.html',
  styleUrls: ['./infos.component.css']
})
export class InfosComponent {
  faqItems: any[] = [
    {
      question: 'Was ist Scheppern?',
      answer: 'Fahrrad fahren ist schön. Fahrrad fahren mit Musik ist schöner. Fahrrad fahren mit Musik, die andere hören können, ist am schönsten. Scheppern ist eine App, die dir hilft, deine Musik mit anderen zu teilen. Sie ist für Android und iOS verfügbar.'
    },
    {
      question: 'Wie funktioniert Scheppern?',
      answer: 'Scheppern funktioniert mit Bluetooth. Du verbindest dein Handy mit deinem Fahrradlautsprecher und spielst deine Musik ab. Scheppern übernimmt den Rest. Wenn du eine Strecke fährst, die du schon einmal gefahren bist, wird Scheppern die Musik, die du beim letzten Mal gehört hast, automatisch abspielen. Wenn du eine neue Strecke fährst, wird Scheppern dir eine Playlist mit Musik vorschlagen, die andere Scheppern-Nutzer in der Nähe gerne hören.'
    },
    {
      question: 'Wo kann man Scheppern benutzen?',
      answer: 'Scheppern ist in Berlin verfügbar. Wenn du in Berlin bist, kannst du Scheppern nutzen. Wenn du nicht in Berlin bist, kannst du Scheppern nicht nutzen. Wenn du in Berlin bist, aber Scheppern nicht nutzen kannst, dann ist das schade. Wenn du in Berlin bist und Scheppern nutzen kannst, dann ist das schön.'
    }
  ]
}
