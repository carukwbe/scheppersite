# Schepern Website Testing

Hallo! Wenn du das liest, bedeutet das, dass das Scheppern auf Brettern eine Website bekommen hat, und sie tatsächlich soweit ist, dass sie jetzt getestet werden kann. Und du hast die Ehre, genau das zu erledigen. Keine Angst, wir nehmen dich an die Hand. Also los geht's!


## Voraussetzungen
- [ ] Collection "tickets" ist leer
- [ ] Collection "deleted_tickets" ist leer
- [ ] Collection "contact_form" ist leer
- [ ] Collection "faulty_transactions" ist leer
- [ ] Collection "secret_ticket_tokens" ist leer
- [ ] Alle counters stehen auf null
- [ ] "days_until_deletion" in der collection "dates" ist 14
- [ ] "days_until_reminder" in der collection "dates" ist 7
- [ ] "capasses" in der collection "ticket_quotas" ist ____
- [ ] "helpers" in der collection "ticket_quotas" ist ____
- [ ] "regulars" in der collection "ticket_quotas" ist ____


## Bestellen von Tickets

Zuerst bestellen wir alle möglichen Kombinationen von Tickets, und schauen, ob alles klappt. Bestätige jeweil AGBs, Datenschutz und über 18.

### Bestellen von regulären und Helfer*innen-Tickets

Führe die folgenden Bestellungen nacheinander durch:


Feld                    | Regulär                   | Regulär mit Carpass       | Helfer:in                 | Helfer*in mit Carpass
----------------------- | ------------------------- | ------------------------- | ------------------------- | ------------------------- 
Vorname                 | Test                      | Test                      | Test                      | Test
Nachname                | Regulär                   | Regulär Carpass           | Helper                    | Helper Carpass         
E-Mail                  | < deine email >           | < deine email >           | < deine mail >            | < deine email >          
Telefonnummer           | -                         | 123456789                 | 123456789                 | -          
Carpass                 | nein                      | ja                        | nein                      | ja
Helfer:in               | nein                      | ja                        | nein                      | ja
Helfer:in-Schichten     | -                         | -                         | wähle beliebige aus       |          
Helfer:in-Infos         | -                         | -                         | beliebiger Text           | -          


Nachdem du die Bestellungen abschickst, solltest du jeweils eine Bestätigungsmail bekommen. Prüfe dafüber hinaus im Firestore in der collection "tickets" auf die folgenden Resultate:


Feld                        | Regulär                   | Regulär mit Carpass       | Helfer:in                 | Helfer*in mit Carpass
--------------------------- | ------------------------- | ------------------------- | ------------------------- | ------------------------- 
Bestätigungsmail da         | ja                        | ja                        | ja                        | ja
agbs_accepted               | true                      | true                      | true                      | true
carpass                     | false                     | true                      | false                     | true
carpass_wish                | false                     | false                     | false                     | false          
data_protection_accepted    | true                      | true                      | true                      | true
email                       | < deine email >           | < deine email >           | < deine mail >            | < deine email >          
helper                      | false                     | false                     | true                      | true          
helper_shifts               | []                        | []                        | [Schicht1, Schicht2, ...] | [Schicht1, Schicht2, ...]        
helper_wish                 | false                     | false                     | false                     | false      
last_modified_at            | Zeitpunkt der Bestellung  | Zeitpunkt der Bestellung  | Zeitpunkt der Bestellung  | Zeitpunkt der Bestellung            
order_date                  | Zeitpunkt der Bestellung  | Zeitpunkt der Bestellung  | Zeitpunkt der Bestellung  | Zeitpunkt der Bestellung  
order_id                    | 2024-001-X-XX             | 2024-002-X-XC             | 2024-003-X-HX             | 2024-004-X-HC                       
over_18                     | true                      | true                      | true                      | true
phone                       | -                         | 123456789                 | 123456789                 | -          
price                       | 50                        | 55                        | 25                        | 27.5          
reminded                    | false                     | false                     | false                     | false    
secret                      | false                     | false                     | false                     | false    
status                      | ordered                   | ordered                   | ordered                   | ordered
surname                     | Regulär                   | Regulär Carpass           | Helper                    | Helper Carpass
ticket_sent                 | false                     | false                     | false                     | false

- [ ] Test bestanden


### Bestellen von Secret-Tickets

Jetzt wird das Bestellen von secret Tickets getestet, die wir rausschicken können, ohne das die Empfänger*innen bezahlen müssen. Das ist sinnvoll, z.B. wenn es beim Bezahlprozess im System zu Fehlern kam, und wir das Ticket manuell herausgeben müssen. Gehe dazu auf https://scheppernaufbrettern.de/supersecrettickets

#### Test des Admin-Logins

In diesem Zuge wird gleich der Admin-Login gestestet. Probiere zuerst die folgenden Fälle:
- [ ] Login mit einem falschen username und einem falschen Passwort funktioniert nicht
- [ ] Login mit einem falschen username und dem richtigen Passwort funktioniert nicht
- [ ] Login mit dem richtigen username und einem falschen Passwort funktioniert nicht

Logge dich jetzt mit den korrekten Daten ein.
- [ ] Login mit dem richtigen username und dem richtigen Passwort funktioniert

Bestelle nun über das Formular ein Ticket ohne Carpass und ohne ein Helfer*innen-Ticket zu wählen. Gib wieder deine eigene E-Mail an.
- [ ] Ich habe eine E-Mail mit einem Link zum Annehmen des Tickets bekommen (noch nicht anklicken!)

Prüfe die folgenden Dinge im Firestore:
- [ ] Das Feld "secret" ist "true"
- [ ] "status" ist "pending"
- [ ] "order_id" ist 2024-001-0-XX (Wichtig ist hier die "0" vor dem -XX)

Klicke jetzt auf den Link in der E-Mail
- [ ] Das Feld "status" wird zu "payed"
- [ ] Ich habe eine E-Mail mit Ticket bekommen

Warte jetzt 10 Minuten. Schau ein youtube video, geh aufs Klo, hol dir Kaffee, was auch immer. Hauptsache, du wartest einfach 10 Minutern und lässt das Fenster mit dem Secret-Ticketshop offen.

Versuche jetzt erneut, ein beliebiges Ticket zu bestellen.
- [ ] Es gibt eine Fehlermeldung, die mich darauf hinweist, dass meine Sitzung abgelaufen ist

Geschafft! Gehe jetzt zurück auf https://scheppernaufbrettern.de/secrettickets

### Counters

Schauen wir uns jetzt unsere Zähler an. Gehe in die Firebase-Console und navigiere zur collection "counters".
- [ ] "carpasses" steht auf 2
- [ ] "helpers" steht auf 2
- [ ] "orders" steht auf 4
- [ ] "regulars" steht auf 2
- [ ] "secret_tickets" steht auf 1


### Preisstufen

Jetzt testen wir, dass die Preisstufen das tun, was sie sollen. Modifiziere zuerst die Dokumente in der collection "price_levels" so, dass das aktuelle Datum in die Preisstufe 2 fällt. Bearbeite dazu "active_from" von level_2 so, dass es in der Vergangenheit liegt. Passe "active_until" von level_1 entsprechend auf den gleichen Wert an. Führe nun noch einmal alle vier Fälle (Regulär, Regulär mit Caprass, Helfer* in, Helfer*in mit Carpass) durch, die du schon zu Anfang getestet hast. Falls du keine Lust mehr auf noch mehr Emails hast, kannst du auch eine beliebige E-Mail eingeben. Suche die neuen Dokumente im Firestore raus, und achte auf die Folgenden Felder:

Feld                        | Regulär                   | Regulär mit Carpass       | Helfer:in                 | Helfer*in mit Carpass
--------------------------- | ------------------------- | ------------------------- | ------------------------- | ------------------------- 
order_id                    | 2024-005-X-XX             | 2024-006-X-XC             | 2024-007-X-HX             | 2024-008-X-HC                       
price                       | 55                        | 60                        | 27.5                      | 30          

Tu das gleich jetzt mit level_3. Dafür müssen "active_from" und "active_until" von level_1 und level_2, und "active_from" von level_3 in der Vergangenheit liegen. Bestelle jetzt nochmal die vier Tickets und achte in den Dokumenten im Firestore auf die folgenden Resultate:  

Feld                        | Regulär                   | Regulär mit Carpass       | Helfer:in                 | Helfer*in mit Carpass
--------------------------- | ------------------------- | ------------------------- | ------------------------- | ------------------------- 
order_id                    | 2024-009-X-XX             | 2024-010-X-XC             | 2024-011-X-HX             | 2024-012-X-HC                       
price                       | 60                        | 65                        | 30                        | 32.5     

Kleines Update bei den Counters:
- [ ] "carpasses" steht auf 6
- [ ] "helpers" steht auf 6
- [ ] "orders" steht auf 12
- [ ] "regulars" steht auf 6
- [ ] "secret_tickets" steht auf 1


### Überschreiten der Ticketkontingente

Jetzt wird getestet, was passiert, wenn die Ticketkontingente überschritten werden. Gehe in den Firestore zur collection "ticket_quotas". Bearbeite dort den counter "regulars" so, dass sein Wert um eins größer ist als der "regulars" counter.
- [ ] Auf der Website erscheint eine Meldung, dass nur noch 1 Ticket verfügbar ist

Bestelle nun ein Ticket, ohne das Helfer*innen-Ticket auszuwählen
- [ ] Nach der Bestellung erscheint ein Fenster auf der Website, dass nur noch Helfer*innen-Tickets verfügbar sind
- [ ] Die Checkbox, dass man ein Helfer*innen-Ticket auswählen möchte, ist ausgwählt und lässt sich nicht mehr abwählen

Setze nun die quota für reguläre Tickets auf 400 zurück.
- [ ] Die Meldung und das automatische Auswählen der Checkbox verschwinden wieder

Bearbeite nun das quota "helpers" so, dass es genau dem Wert entspricht, der im counter für "helpers" steht.
- [ ] Das Helfer*innen-Ticket lässt sich nicht mehr auswählen
- [ ] Es erscheint eine neue Checkbox, durch die ausgewählt werden kann, dass man gerne noch Helfer*in geworden wäre

Bestelle ein Ticket, bei dem du diese neue Checkbox auswählst.
- [ ] Im bestellten Ticket ist das Feld "helper_wish" = "true"

Setze jetzt den "helpers" quota wieder auf 25 zurück.

Bearbeite nun das quota "carpasses" so, dass es genau dem Wert entspricht, der im counter für "carpasses" steht.
- [ ] Der Carpass lässt sich nicht mehr auswählen
- [ ] Es erscheint eine neue Checkbox, durch die ausgewählt werden kann, dass man gerne noch den Carpass genommen hätte

Bestelle ein Ticket, bei dem du diese Carpass-Wunsch auswählst.
- [ ] Im bestellten Ticket ist das Feld "carpass_wish" = "true"

Sorry, wir sind hier noch nicht fertig! :-) Setze jetzt den quota für Helfer* innen wieder auf den Wert, den der Counter für Helfer*innen hat.
- [ ] Helfer*innen-Ticket und Carpass lassen sich nicht mehr auswählen
- [ ] Es erscheinen beide zuvor angesprochenen Checkboxen
 
Bestelle ein Ticket, bei denen du beide Wunsch-Checkboxen auswählst.
- [ ] Im bestellten Ticket sind "helper_wish" und "carpass_wish" true

Setze jetzt auf den "regulars"-Quota auf den Wert, den der "regulars"-counter hat.
- [ ] Das Ticket-Bestellformular auf der Website verschwindet. Es erscheint eine Meldung inkl. Link zur Whatsapp-Gruppe.

Setze jetzt alle quotas wieder auf ihre Ursprungswerte zurück:
- regulars: 400
- carpasses: 20
- helpers: 25



## Bearbeiten von Bestellungen

Puh! Anstrengend, die ganze Bestellerei. Jetzt erstmal ordentlich aufräumen. Lösche die ganzen Bestellungen (Pro-Tipp: einfach die collection löschen und neu erstellen) und sorge generell dafür, dass die ganzen Voraussetzungen oben wieder erfüllt sind. Jetzt geht's ums Bearbeiten und Umpersonalisieren von Bestellungen.

Bestelle dazu nochmal irgendein Ticket über die Website, achte darauf, dass du deine eigene Mail verwendest, und dass es kein Helfer*innen-Ticket ist. Gehe im Firestore zu deiner Bestellung und kopiere die ID des Dokuments, die du oberhalb von allen Datenfeldern findest.

Gehe jetzt auf https://scheppernaufbrettern.de/tickets/<deine_id_hier>.

#### Ticketbearbeitung vor Bezahlung

Bevor wir was ändern:
- [ ] Das E-Mail Feld in der Eingabemaske ist ausgegraut und du kannst nichts eingeben

Ändere in der Eingabemaske die Telefonnummer der Bestellung.
- [ ] Du bekommst eine Meldung "Ticketdaten erfolgreich geändert" zurück.
- [ ] Die Telefonnummer-Änderung ist im Dokument im Firestore sichtbar

Ändere nun Vor- und/oder Nachnamen der Bestellung.
- [ ] Du bekommst eine Meldung "Ticketdaten erfolgreich geändert" zurück.
- [ ] Die Namensänderung ist im Dokument im Firestore sichtbar


#### Ticketbearbeitung nach Bezahlung

Ändere nun das "status"-Feld deines Dokuments im Firestore manuell auf "payed". Dadurch tun wir so, als wäre das Ticket bereits bezahlt worden.
- [ ] Das E-Mail Feld in der Eingabemaske ist jetzt nicht mehr ausgegraut

Ändere in der Eingabemaske wieder die Telefonnummer der Bestellung.
- [ ] Du bekommst eine Meldung "Ticketdaten erfolgreich geändert" zurück.
- [ ] Die Telefonnummer-Änderung ist im Dokument im Firestore sichtbar

Ändere nochmal Vor- und/oder Nachnamen der Bestellung.
- [ ] Du bekommst eine Meldung "Ticketdaten erfolgreich geändert. Wir schicken dir ein neues Ticket mit dem aktualisierten Namen." zurück.
- [ ] Die Namensänderung ist im Dokument im Firestore sichtbar
- [ ] Du bekommst eine E-Mail mit einem Ticket


#### Umpersonalisierung eines Tickets

Jetzt testen wir den Umpersonalisierungsvorgang. Ändere dazu die E-Mail in der Eingabemaske auf eine andere E-Mail, zunächst auf eine beliebige E-Mail, die nicht existiert, damit du vorerst keine Mails bekommst.
- [ ] Du bekommst eine Meldung "Das Ticket für die Person, an die du es überträgst, wurde erfolgreich in unserer Datenbank gespeichert. Es wurde eine E-Mail an die Person zum Annahme des Tickets gesendet."
- [ ] Es ist in der Datenbank ein weiteres Ticket entstanden, dass die E-Mail hat, auf die du es übertragen hast
- [ ] Der Status des zweiten Tickets ist "pending"
- [ ] Das zweite Ticket hat die gleiche order_id und order_date wie das ursprüngliche
- [ ] Du hast an die E-Mail, die du bei der urspünglichen Bestellung eingegeben hast, eine Mail gekriegt, die dich informiert, dass du eine Umpersonalisierung gestartet hast.

Bevor wir im Umpersonalisierungsprozess weitermachen, testen wir, dass jeweils nur eine einzelne Umpersonalisierung aktiv sein kann. Ändere dazu nochmal die E-Mail in der Eingabemaske. Dieses Mal auf eine, auf die du Zugriff hast, aber eine andere, als die der ursprünglichen Bestellung.
- [ ] Es wird, wie oben, ein neues "pending" Ticket erstellt
- [ ] Das "pending" Ticket mit der nicht existenten E-Mail, dass zuvor da war, wurde gelöscht
- [ ] Du hast an die E-Mail, die du bei der urspünglichen Bestellung eingegeben hast, wieder eine Mail gekriegt, die dich informiert, dass du eine Umpersonalisierung gestartet hast.
- [ ] Du hast an die neue E-Mail eine Mail bekommen, die dich informiert, dass ein Ticket fürs Scheppern auf dich übertragen wurde. In der Mail ist ein Link/Button, mit dem das Ticket angenommen werden kann
- [ ] Das alte "pending" Ticket wurde der collection "deleted_tickets" hinzugefügt. Als "reason" ist "Overwritten by other repersonalization" angegeben

Klicke nun auf den Button, mit dem du das Ticket annehmen kannst. Es erscheint eine Meldung, die dich informiert, dass das Ticket auf dich umpersonalisiert wurde.
- [ ] Der Status des zweiten "pending" Tickets ist jetzt "payed"
- [ ] Das ursprüngliche Ticket, von dem aus du die Umpersonalisierung gestartet hast, wurde der collection "deleted_tickets" hinzugefügt. Als "reason" ist "Pending ticket validated" angegeben
- [ ] Du hast an die ursprüngliche E-Mail eine Nachricht bekommen, die dich informiert, dass die Umpersonalisierung des Tickets abgeschlossen und damit dein altes Ticket ungültig ist
- [ ] Du hast an die neue E-Mail eine Nachricht mit dem Ticket bekommen



#### Umpersonalisierung bei invalidem Status

Jetzt wird getestet, dass nur Umpersonalisierungen zu Tickets angenommen werden können, deren Status "payed" ist. Erstelle dazu eine neue Umpersonalisierung mit einer E-Mail, die dir gehört. Ändere den Status des Tickets, aus dem die Umpersonalisiserung hervorgeht, manuell im Firestore auf "ordered". Probiere dann, die Umpersonalisierung über den Link in der E-Mail, an die du die Umpersonalisierung durchführst, anzunehmen.
- [ ] Du bekommst eine Fehlermeldung, dass dem Ticket kein bezahltes oder noch nicht gescanntes Ticket zugeordnet werden konnte.

Ändere jetzt den Status des Tickets, aus dem die Umpersonalisierung hervorgeht, auf "scanned" und probiere erneut, die Umpersonalisierung anzunehmen.
- [ ] Du bekommst eine Fehlermeldung, dass ein Ticket mit der gleichen Bestellnummer bereits auf dem Festival gescant wurde.

Ändere den Status, den du gerade auf "scanned" gesetzt hast, nun zurück auf "payed".

Jetzt wird getestet, was passiert, wenn du einer Umpersonalisierung mehr als ein bezahltes Ticket gehören. Erstelle dazu eine neue Bestellung. Ändere den Status des entstandenen Eintrags im Firestore manuell auf "payed" und die Bestellnummer auf die der Umpersonalisierung, die du vor zwei Checkboxen erstellt hast. Probiere jetzt wieder, die Umpersonalisierung anzunehmen.
- [ ] Du bekommst eine Fehlermeldung, dass zu dem übertragenen Ticket mehr als ein bezahltes existiert.


Jetzt wird getestet, dass Bestellungen von Helfer*innen nicht umpersonalisiert werden können. Bestelle dazu ein beliebiges Helfer:innen-Ticket und ändere dessen Status erneut auf "payed". Gehe zur Bearbeitungsseite.
- [ ] Das E-Mail feld ist ausgegraut und du kannst das Ticket nicht umpersonalisieren.


### Stornieren von Bestellungen

Jetzt wird das Stornieren von Bestellungen getestet. Lösche wieder alle Bestellungen und stelle die Voraussetzungen von oben wieder her. Setze auf jeden Fall die Counter zurück! 

Stornieren soll nur bei Tickets möglich sein, die den Status "ordered" haben. Bestelle dafür ein Ticket über das normale Formualar, wähle am Besten Helfer* in als auch Carpass aus.
- [ ] Die Counter "helper", "carpass" und "orders" stehen auf 1, der Rest auf 0 

Gehe auf den Link zum Bearbeiten des Tickets. Dort findest du die Schaltfläche "Bestellung stornieren". Klicke sie an.
- [ ] Du bekommst eine Meldung, dass die Stornierung erfolgreich war
- [ ] Du bekommst eine E-Mail, die dich darüber informiert, dass dein Ticket storniert wurde
- [ ] Das Ticket wurde der collection "deleted_tickets" hinzugefügt, als "reason" ist "order cancelled" angegeben
- [ ] Alle counter außer "orders" stehen wieder auf 0

Erstelle nun ein neues Ticket und ändere den Status nacheinander auf "payed", "scanned", "pending" und am Schluss auf ein beliebiges Wort. Probiere jeweils dazwischen, das Ticket zu storineren.
- [ ] Du bekommst jeweils eine Fehlermeldung und das Stornieren funktioniert nicht



### Automatische Bezahlerinnerung und Stornierung von abgelaufenen Bestellungen

Wir erinnern Bestellende nach 7 Tagen daran, dass sie noch bezahlen müssen, wenn sie es noch nicht getan haben. Nach 14 Tagen werden die Bestellungen automatisch gelöscht. Das testen wir jetzt.

Bestelle zwei Tickets, jeweils zu E-Mails die zu dir gehören. Ändere bei einem der beiden manuell im Firestore das "ordered_date" auf 7 Tage vor dem aktuellen Datum, bei dem anderen auf 14 Tage davor. Führt nun die Firebase Function "order_lifecycle_handler_req" aus, indem du ihre URL in deinem Browser aufrufst. Die URL findest du unter dem Function-Namen in der Firebase Console (https://console.firebase.google.com/u/0/project/scheppersite/functions).
- [ ] Die Seite zeigt "ok" an
- [ ] Du bekommst für das Ticket, dessen Bestelldatum du 7 Tage vorverlegt hast, eine E-Mail, die dich daran erinnert, dass du noch bezahlen musst. Dort ist angegeben, dass wenn das Ticket nicht bis 7 Tagen vom aktuellen Datum bezahlt ist, die Bestellung storniert wird
- [ ] Im Dokument in der "tickets" collection ist "reminded" auf "true"
- [ ] Du bekommst für das Ticket, dessen Bestelldatum du 14 Tage vorverlegt hast, eine E-Mail, die dich informiert, dass das Ticket storniert wurde.
- [ ] Das Ticket wurde der collection "deleted_tickets" hinzugefügt, "reason" ist "order expired"

Führe "order_lifecycle_handler_req" erneut aus.
- [ ] Du bekommst keine erneute Erinnerung für das Ticket, für das du bereits erinnert wurdest



### Scannen von Tickets

Jetzt wird getestet, wie der Scan von Tickets beim Einlass funktioniert. Räume, wenn du magst, wieder die Datenbank auf und stelle die Voraussetzungen wieder her. Bestelle regulär ein Ticket über das Formular. Ändere manuell den Status auf "payed". Kopiere die ID des Dokuments, wie über den Datenfeldern im Firestore steht. Rufe im Browser https://scheppernaufbrettern.de/scan_ticket/<deine_id_hier> auf.
- [ ] Du bekommst die Ticket-Daten angezeigt. Darunter steht die Meldung "Scan erfolgreich".

Ändere den Status des Tickets jetzt auf "scanned" und rufe die Seite erneut auf.
- [ ] Du bekommst die Ticket-Daten angezeigt. Darunter steht die Meldung "Scan erfolgreich".

Ändere den Status des Tickets jetzt auf "ordered".
- [ ] Du bekommst eine Meldung, dass das Ticket noch nicht bezahlt wurde. Außerdem werden einige Ticket-Daten angezeigt.

Ändere den Status des Tickets jetzt auf "pending".
- [ ] Du bekommst eine Meldung, dass das Ticket noch angenommen werden muss. Außerdem werden einige Ticket-Daten angezeigt.

Ändere den Status jetzt wieder auf "payed". Gehe außerdem in die collection "dates" und ändere den Eintrag "festival_start" auf ein Datum in der Vergangenheit. Erstelle dann eine Umpersonalisierung für das Ticket, indem du die Bearbeitungsseite aufrufst und die E-Mail änderst. Rufe die Scanning-Seite jetzt erneut auf.
- [ ] Du bekommst die Ticket-Daten angezeigt. Darunter steht die Meldung "Scan erfolgreich", und eine Meldung, die dich informiert, dass alle ausstehenden Umpersonalisierungen entfernt wurden.
- [ ] Das Ticket hat jetzt den Status "scanned".
- [ ] Das "pending"-Ticket zur Umpersonalisierung wurde entfernt. Es wurde der collection "deleted_tickets" hinzugefügt, als "reason" ist "Original ticket scanned while festival" angegeben.
- [ ] Das Feld "last modified at" ist auf die aktuelle Uhrzeit gesetzt.


Rufe jetzt die Seite https://scheppernaufbrettern.de/scan_ticket/aaaaaaaaaaaaaaaaaaaa auf.
- [ ] Du bekommst eine Meldung, dass das Ticket nicht gefunden werden konnte.



### Übermitteln von Nachrichten über die Kontaktform

Jetzt wird getestet, ob wir Nachrichten über die Kontaktform korrekt bekommen. Gehe zu https://scheppernaufbrettern.de/kontakt. Schreibe eine Nachricht mit beliebigem Inhalt.
- [ ] Du bekommst die Meldung "Nachricht erfolgreich übermittelt"
- [ ] Die Nachricht taucht in der collection "contact_form" auf, mit dem aktuellen Datum als ID
- [ ] Falls du ein Admin bist, bekommst du eine Mail, die dich informiert, dass eine neue Nachricht über die contact form reingekommen ist.



### process transactions
Valid amount = one of the preisstufen, correct amount = actual one in order
- transaction with valid amount, correct amount and correct id --> payed true, ticket sent true, ticket wird geschickt, last modified gesetzt
- transaction with valid amount, false amount and correct id --> faulty
- transaction with valid amoung and incorrect id  --> faulty
- transaction with invalid amount and correct id  --> faulty
- transaction with invalid amount and invalid id --> nothing
- erneute ausführung schickt nicht noch ein ticket und fügt keine weiteren dokumente in faulty_transactione ein

--------------------------------------------------------


### save message from contact form
- taucht in db auf mit datum als id DONE
- mail an admins DONE


### Scan ticket
- ungültige ticket id
- status --> scanned, last modified gesetzt, aber nur wenn nach festival start
- status nicht payed oder scanned --> geht nicht DONE
- löschung von pending tickets wenn festival date > now


### create ticket

- testen dass preisstufen funktionieren DONE
- testen dass counter hochzählen DONE
- secret ticket mit secret=true, status pending  DONE
- regulars quota exceeded DONE
- helpers quota exceeded DONE
- carpass quota exceeded DONE
- von den oberern drei alle möglichen kombinationen DONE



### admin login
- falscher username DONE
- falsches passwort DONE
- session expired DONE




### edit ticket
- bei noch nicht bezahlt namen ändern --> kein ticket DONE
- bei noch nicht bezahlt telefonnummer ändern --> kein ticket DONE
- bei schon bezahlt namen ändern --> neues ticket DONE
- bei schon bezahlt telefonnummer ändern --> kein neues ticket DONE 
- bei schon behazahlt mail ändern --> umperso, neues pending ticket. Bei erneuter umperso altes pending ticket weg DONE
- status scanned --> nicht erlaubt DONE
- status nicht payed bei umpersonalisierung --> nicht erlaubt DONE
- ticket id die es nicht gibt
- last modified gesetzt
- secret ticket bleibt secret
- sichergehen dass keine felder auf none gesetzt werden die es davor nicht waren


### validate ticket
- scanned --> geht nicht DONE
- kein oder 2 payed tickets DONE
- löschung von anderen pending tickets und vom originalen payed ticket DONE
- secret ticket --> payed, last modified at wir gesetzt DONE


