import { Component } from '@angular/core';
import { TicketService } from 'src/app/services/ticket-service.service';

@Component({
  selector: 'app-infos',
  templateUrl: './infos.component.html',
  styleUrls: ['./infos.component.css']
})
export class InfosComponent {

  constructor(
    private ticketService: TicketService,
  ) { 
    this.ticketService.sendHeaders('infos');
  }
  
  faqSections = [
    {
      title: 'Über uns',
      questions: [
        {
          question: 'Wer sind wir / wer veranstaltet das Scheppern?',
          answer: 'Das Scheppern auf Brettern ist 2022 aus einer Geburtstagsfeier von drei Freunden entstanden, die den Windpark Druiberg gemietet haben und eine kleine Bühne in einen LKW gebaut haben. Im Jahr darauf haben wir die Idee ausgebaut, richtige Bühnenteams organisiert, mehr DJs rekrutiert und haufenweise Workshops umgesetzt. Da sich immer mehr Leute für das Scheppern begeistert haben, ist unsere Crew mittlerweile auf etwa 30 Mitglieder gewachsen. Wir haben schließlich den Klangkollektiv Braunschweig e.V. gegründet, um das Scheppern 2024 erstmals als offizielles Festival zu veranstalten und darüber hinaus einen Beitrag zur Kunst und Kultur in Braunschweig zu leisten.'
        }, {
          question: 'Unsere Werte',
          answer: 'Toleranz, Vielfalt, Offenheit, Nachhaltigkeit, Feminismus und Demokratie sind die grundlegende Werte unseres Klangkollektivs. Wir betrachten sie nicht nur als Worte, sondern leben sie in allem, was wir tun. Wir sind ihnen so verbunden wie die Noten der Musik die wir lieben! Wir sind immer offen für neue Leute die unsere Werte teilen!'
        }, {
          question: 'Was kann ich erwarten?',
          answer: 'Das Motto ist, die Sommer- und Festivalsaison einzuläuten. Wir setzen dabei auf eine gute Mischung aus DJ Sets (hauptsächlich Techno und Drum and Bass), Live-Bands, Workshops und Turniere wie das legendäre Flunkyball Championat! Abgerundet wird das ganze durch verschiedene Bau- und Dekoprojekte, die den ohnehin schon epischen Windpark Druiberg verschönern, gewisse Chillbereiche schaffen und zu einer angenehm verschepperten Atmosphäre beitragen.'
        }, {
          question: 'Wie setzt sich der Ticketpreis zusammen?',
          answer: `
            Weil sich 50€+ nach nicht wenig Geld anfühlen. Gab es intern große Diskussionen über den Ticketpreis. Dieses Jahr ändert sich aber einiges. Wir haben ein Verein gegründet um das Festival rechtlich abzusichern und euch diesmal zu ermöglichen all eure Freund*innen mitzubringen! Die Kosten sind durch eine öffentliche Austragung des Festivals leider deutlich gestiegen. Wir haben uns dazu entschieden es sicher anzugehen und in diesem Jahr diesen hohen Ticketpreis anzusetzen. Es können so die geplanten Bauprojekte mit 4 Festivaltagen auf jeden Fall sicher umgesetzt werden! <br><br>
            Alle Gelder bleiben im Sinne des gemeinnützigen Vereins im Verein und werden nicht als Gewinn ausgeschüttet. Sollten wir feststellen, dass wir am Ende einen großen Überschuss haben, werden wir 1. Investitionen tätigen für weitere Events 2. potenzielle Überschüsse spenden 3. euch im darauffolgenden Jahr ein noch besseres Festival bei gleichem oder sogar günstigerem Preis anbieten! <br><br>
            Wir können natürlich nichts versprechen, werden euch aber so transparent wie möglich auf dem Laufenden halten! Eine grobe Vorkalkulation unserer Ausgaben seht ihr im Folgenden:
          `
        }
      ]         
    }, {
      title: 'An- und Abreise',
      questions: [
        {
          question: 'Anreise / Abreise Zeiten',
          answer: 'Wir wollen mehr vom Scheppern haben, also starten wir schon Donnerstag! Die Anreise ist am Donnerstag (23.05.) ab 15 Uhr möglich. Nach einem langen und intensiven Samstagabend folgen am Sonntag (26.05.) zum Ausklang noch kleine Workshops und entspannte DJ Sets. Ab Sonntag Nachmittag ist Feierabend und wir starten mit dem Abbau. Wer länger bleiben möchte, kann das gerne tun indem er/sie uns beim Abbau hilft.'
        }, {
          question: 'Wie erreiche ich das Scheppern Festival?',
          answer: 'Der Windpark Druiberg ist direkt bei Maps zu finden. Die Route sollte von dem anliegenden Ort Dardesheim dann immer geradeaus den Butterberg hoch führen bis du die Schranke und unseren Einlass findest. Dort gibt es dann auch die Bändchen, nachdem die Tickets gescannt sind. Lade einfach ganz bequem deine Sachen aus und such dir einen Parkplatz auf der Wiese vor dem Gelände, bzw. an einem der umliegenden Windräder. Auf das Gelände darf dieses Jahr durch die gestiegene Personenzahl nur noch mit einem Carpass gefahren werden. Bei der Anreise mit den Öffis ist die nächstliegende Bushaltestelle der Dardesheim Busbahnhof, gefolgt von einem 1,7 km Fußweg den Berg hoch.'
        }, {
          question: 'Wie kann ich Fahrgemeinschaften finden/bilden?',
          answer: "Komm' in die Gruppe! Es wird wieder eine Gruppe geben für den gezielten Austausch geben! Vergesst nicht eure Fahrten dort anzubieten, solltet ihr noch Plätze haben!"
        }, {
          question: 'Kann ich mein Auto/Camper aufs Campinggelände mitnehmen?',
          answer: 'Ja, dafür gibt es die Carpass Tickets, die zusätzlich zum Festivalticket erworben werden können. Durch den begrenzten Platz auf dem Windpark Gelände sind diese allerdings limitiert. Die Fahrzeuge müssen außerdem so geparkt werden, dass sie über die Wege erreicht werden können.'
        }, {
          question: 'Kann ich mit meinem Auto/Camper das Gelände jederzeit verlassen?',
          answer: 'Nein, wir wollen keinen unnötigen Verkehr auf dem Gelände haben. Daher bitte mit Carpass erst ab Sonntag 12 Uhr wieder das Fahrzeug bewegen und im Zweifelsfall andere Autos außerhalb des Geländes nutzen. In Notfällen sieht das natürlich anders aus! '
        }
      ]
    }, {
      title: 'Camping',
      questions: [
        {
          question: 'Welche Campingbereiche gibt es und wo ist es laut/leise?',
          answer: 'Es gibt 3 Campingbereiche in unterschiedlichen Lautstärkestufen: Schlummerland (leise), Schäfchenwiese (mittellaut), Rest in Beats (laut,da in unmittelbarer Nähe zur Jungle Stage) → die Stage wird aber nur bis etwa 4 Uhr bespielt, dieses mal wirklich! Genaueres findet ihr später im Geländeplan.'
        }, {
          question: 'Ist es erlaubt zu grillen oder einen Campingkocher zu nutzen?',
          answer: 'Durch die Brandgefahr sind flache Grills (Einweggrills) und offene Feuer verboten. Es wird wieder einen zentralen Feuerplatz an der Mainstage geben. Bitte bei Verwendung von Campingkochern außerdem auf einen nicht brennbaren Untergrund achten!  '
        }, {
          question: 'Gibt es auf dem Festival Essensangebote?',
          answer: 'Ja, es ist geplant zu bestimmten Zeiten Essen auszugeben. Eine komplette Versorgung wird das aber nicht ersetzen können. Bringt daher ausreichend Verpflegung für das Wochenende mit! '
        }, {
          question: 'Mülltrennung',
          answer: 'Wir haben uns trotz voraussichtlich doppelten Kosten uns für eine konsquente Mülltrennung entschieden. Daher gibt es bei jeder Müllstation 3 Müllarten. Zusätzlich haben wir noch zentrale Orte für Glas und Pfand. Schaut auf den Plan, wo ihr diese findet. Wir geben euch am Eingang bereits verschiedene Müllsäcke, dass ihr auch im Camp direkt trennen könnt!'
        }, {
          question: 'Gibt es auf dem Gelände Strom?',
          answer: 'Nein, auf dem Campinggelände wird es keinen Strom geben. Wir werden aber wie letztes Jahr eine offen zugängliche Ladestation bereitstellen, behaltet hier aber eure Geräte auf jeden Fall im Auge!'
        }, {
          question: 'Gibt es auf dem Gelände Trinkwasser?',
          answer: 'Ja, auch wenn auf dem Gelände keine Leitungen liegen, werden wir euch Trinkwasser zur Verfügung stellen '
        }, {
          question: 'An was sollte ich denken und was ist sinnvoll mitzubringen?',
          answer: `• Zelt, Isomatte, Schlafsack, Kopfkissen <br>
            • Campingstuhl/Tisch <br>
            • Pavillon und Hängematte, wenn vorhanden <br>
            • Kulturbeutel, Powerbank, Panzertape, Kondome <br>
            • Lampe fürs Camp <br>
            • Desinfektionsmittel, Klopapier/Cewa <br>
            • Trockentuch (Abwasch-Equipment gibt es ansonsten am ServicePoint) <br>
            • Kleidung (dickgenugundauchfürRegen), Sonnenbrille, Sonnencreme <br>
            • FesteSchuhe, Flip-Flops <br>
            • Essen und genug Trinken <br>
            • Gasbrenner, Feuerzeug, Topf, Besteck <br>
            • Mückenzeugs, Notfall-Apotheke <br>
            • Persönliches Party Equipment <br>
            • euer persönliches Ticket natürlich <br>
            • Bargeld <br>`
        }, {
          question: 'Was darf ich nicht mitbringen?',
          answer: 'Generatoren, Waffen jeglicher Art und sonstige allgemein verbotene Gegenstände in Deutschland. '
        }, {
          question: 'Wird auf Inklusion geachtet?',
          answer: 'Ja, wir wollen im Rahmen unserer Möglichkeit das Festival so inklusiv wie möglich gestalten. Für Rollstuhlfahrer*innen ist das Gelände, abgesehen von gewissen Steigungen, frei zugänglich und wir stellen eine barrierrearme Toilette zur Verfügung. Sollten darüber hinaus weitere Wünsche oder Fragen bestehen, schreibt uns gerne eine E-Mail über das Kontaktformular!'
        }
      ]
    }, {
      title: 'Programm',
      questions: [
        {
          question: 'Auf was für Musik kann ich mich einstellen?',
          answer: 'Der Fokus des Festivals liegt auf elektronischer Musik. Dieses Jahr wird es im Vergleich zum letzten jedoch auch einige Bands geben, die euch wegscheppern werden!'
        }, {
          question: 'Wo finde ich Informationen zu Workshops und dem Timetable?',
          answer: 'Hier auf der Website, Insta, WhatsApp, per Aushang! Wir lassen nichts unversucht um euch mit den allerfeinsten Informationen zu versorgen!'
        }
      ]
    }, {
      title: 'Ticketing',
      questions: [
        {
          question: 'Wie funktioniert das Ticketsystem?',
          answer: 'Um Kosten zu sparen, haben wir uns dazu entschieden das Ticketsystem selber in die Hand zu nehmen. Da Online Zahlungsdienstleister*innen auch für jede Transaktion Geld verlangen, bieten wir bei uns ausschließlich Zahlung per Überweisung an. Unser System checkt täglich die Kontobewegungen und ordnet so anhand des Verwendungszwecks die Einzahlung einem ausstehendem Ticket zu. Sollte irgendetwas schief gehen, kontaktiert uns, wir haben Zugriff auf die Daten und können dann schauen woran es lag.'
        }, {
          question: 'Ich habe keine Bestätigungsmail bekommen!',
          answer: 'Ein eingehendes Ticket triggert direkt einen Mailausgang. Es sollte also innerhalb weniger Sekunden/Minuten da sein. Du hast dich vermutlich verschrieben. Kontaktiere uns und wir lösen das Problem! '
        }, {
          question: 'Ich habe kein Ticket bekommen!',
          answer: 'Hast du eine Bestätigungsmail bekommen und daraufhin dein Geld überwiesen? Je nach Bank kann es auch ein paar Arbeitstage dauern bis die Überweisung wirklich durchgeht. Konktaktiere uns falls das nicht passiert. '
        }, {
          question: 'Ich möchte meine Daten ändern!',
          answer: 'Sobald du dein Ticket erhältst, bekommst du die Möglichkeit dazu!'
        }, {
          question: 'Kann ich mein Ticket an jemand anders übertragen?',
          answer: 'Unter dem Link in deiner Ticket E-Mail, kannst du dein Ticket weitergeben. Dazu gibst du die Daten der Tauschperson inklusive E-Mail ein. Die Tauschperson bekommt nun eine E-Mail in der sie die Möglichkeit hat das Ticket zu bestätigen. Anschließend bekommt sie dann ein eigenes neues Ticket. Das alte Ticket verliert ab Bestätigung der neuen Person seine Gültigkeit. Solltest du keine/n Tauschpartner*in finden, kontaktiere uns. Es wird nach Verkauf des letzten Tickets eine Warteliste/WhatsApp-Gruppe geben, für die Vermittlung der Tickets.'
        }, {
          question: 'Umpersonailsierung von Helfer*in Ticket und Carpass Ticket',
          answer: 'Helfer*innen Tickets können nicht über das System übertragen werden, solltest du dein Helfer*in Ticket loswerden wollen kontaktiere uns, wir finden dann eine Lösung! Carpass Tickets sind übetragbar, das Carpass Ticket wird zwar mitübertragen, ist dann am Eingang bei uns aber erstattungsfähig, sollte es nicht eingelöst werden. Meldet euch trotzdem im Vorhinein bei uns in dem Fall, damit wir das Kontingent erhöhen können!'
        }, {
          question: 'Wie funktionieren Helfer:innen-Tickets?',
          answer: 'Du gibst beim Ticketkauf an, dass du Helfer*in sein möchtest und erhältst erstmal einen direkten Rabatt von 50%. Vorraussetzung sind dann auch geleistete Schichten von mindestens 6 Stunden. Solltest du mehr arbeiten wollen, wird es auch dafür entsprechende Vergütungen geben. Z.B. in Form von Essens und Getränkemarken!'
        }, {
          question: 'Mist, alle Tickets weg',
          answer: 'Erfahrungsgemäß gibt es in den letzten Tagen immer ein paar Absagen. Trag dich in unsere Warteliste ein! Wir vermitteln dich, sobald du an der Reihe bist weiter. Anschließend müsst ihr euch privat einig werden und das Ticket via Umpersonalisierungsformular weitergeben!'
        }
      ]         
    }];
}