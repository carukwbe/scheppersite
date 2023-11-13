import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TicketService } from 'src/app/ticket-service.service';

@Component({
  selector: 'app-helper',
  templateUrl: './helper.component.html',
  styleUrls: ['./helper.component.css']
})
export class HelperComponent {
  isLoading = false;
  statusMessage = '';
  
  form!: FormGroup;
  categories = new FormControl('');

  categoryOptions = [
    {
      name: 'Aufbau',
      description: `
        Der Aufbau startet schon bereits eine Woche vorher. Du solltest in der Zeit zum Großteil Zeit haben. Es gibt viel zu bauen und aufzubauen.
      `
    }, {
      name: 'Einlass',
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
      name: 'Bar',
      description: `
        Als Barschicht hast du die Möglichkeit die Welt auf einmal aus einer ganz anderen Perspektive zu sehen und zwar die
        hinterdemthresensteh-Perspektive.
      `
    }, {
      name: 'Küche',
      description: `
        Wir planen diesmal zu bestimmten Uhrzeiten Essen auszugeben. Schnippelhilfen können wir dabei immer gebrauchen. Solltest
        du selber Kocherfahrung mitbringen und Lust haben ein Gericht zu übernehmen, schreib es uns, dann planen wir
        zusammen!
      `
    }, {
      name: 'Awareness',
      description: `
        Es wird ein ganzes Awareness Team geben und du bekommst ein Briefing vorher. Im Grundsatz übt Awareness bei uns keine
        Kontrolle aus, sondern ist streitschlichtender und problemlösender Part. Falls ihr euch nicht wohl fühlt, ist die
        Awareness Crew für euch da!
      `
    }, {
      name: 'Security',
      description: `
        Mit Lizenz oder nur mit Erfahrung, beides sehr willkommen!
      `
    }, {
      name: 'Abbau',
      description: `
        Darauf hat keiner Bock, aber vielleicht ja du! Wir werden vorraussichtlich den Montag und den Dienstag beschäftigt sein.
      `
    }
  ];


  // categoryNames = [
  //   'Einlass',
  //   'Bar',
  //   'Küche',
  //   'Awareness',
  //   'Security'
  // ];

  constructor(private fb: FormBuilder, private ticketService: TicketService, private router: Router) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['+', [Validators.pattern(/^(?:\+?[0-9] ?){6,14}[0-9]$/)]],
      categories: ['', Validators.required],
      comment: ['']
    });
  }

  submitHelper() {
    this.isLoading = true;
    this.statusMessage = 'Wird gesendet...';

    setTimeout(() => {
      this.isLoading = false;
      this.statusMessage = 'Danke für deine Bewerbung!';
    }, 2000);
  }
}
