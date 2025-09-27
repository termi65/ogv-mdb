# OGV - Deckelmanager
---
Der DM wird zum Abrechnen von Deckeln verwendet. Es können Gäste und Getränke eingegeben werden und mit diesen die verschiedenen Deckel der Gäste verwaltet werden.  

Der Deckelmanager ist eine PWA, die die IndexedDB des Browsers verwendet. Sie kann in der .env aber auch auf supabase umgestellt werden  
## Handhabung
---
Die Verwendung ist intuitiv. Geben Sie ein paar Gäste und ein paar Getränke ein. Klicken Sie auf #Deckel# und das Plus dahinter. Damit legen Sie einen neuen Deckel an. Geben Sie einen Kunden und ein Getränk ein (Getränk muss zwingend angegeben werden! Wenn der Kunde nicht bekannt ist, wird ein Kunde namens "Kunde" "1"("2" ...) angelegt).
Klicken Sie auf #Speichern#. Sie gelangen wieder zur Deckelliste, wo nun der Gast mit dem Getränk steht. In dieser Liste können Sie die Anzahl des Getränks erhöhen oder vermindern!  
Desweiteren sehen sie hinter dem Kunden auch ein anderes Plus-Zeichen. Mit diesem buchen Sie auf den Gast ein neues Getränk. Probieren Sie es aus!
