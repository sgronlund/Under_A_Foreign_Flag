# Under_A_Foreign_Flag

## Design

### Inloggningsmeny 
* Ska kunna logga in som VIP, servitör, bartender eller fortsätta som gäst(?).
* I `DBloaded` finns inloggningsuppgifter.

### Vanlig kund
* Se meny
* Beställa, i grupp eller själv
* Ändra beställning
* Betala i baren eller vid bordet.

### VIP kund
* Se saldo (vid bordet)
* Betala utan att gå till baren med pengar från saldo. (vid bordet)
* Hämta speciell dryck med kombinationslås. (från baren)
* Fylla på saldo (i baren)

### Anställd

* Kolla lager status på en produkt
* Ta bort en produkt från menyn (temporärt)
* Ändra pris på en produkt
* Ge en produkt gratis till en kund
* Uppdater antalet i lager
* Notifiera dörrvakt.
* Hämta beställning for specifikt bordsnummer
* Ändra beställning.

### Manager/Owner

* Beställ mera produkter
* Lägga till eller ta bort produkter från menyn

### Andra krav
* Söka i databasen baserat på metadata, sortera i menyn (allergi, alkoholt, tanniner) 
* Kan bara beställa tio enheter åt gången.
* Notifiera bartendern om vi håller på få slut på en produkt
* Warning ska ges ifall det finns endast fem stycken kvar av en viss produkt i lager.
