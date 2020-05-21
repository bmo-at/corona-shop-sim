# Supermarkt/Krankenhaus-Corona Manger Simulator

## Primäre Idee

Als Manager eines Kauf- oder Krankenhauses oder andere Institutionen musst du deine Einrichtung pandemiegerecht vorbereiten. Dazu zählt ein Sicherheitskonzept mit Mindestabstand, Mundschutzpflicht und Spuckschutz etc., welches natürlich auch durchgesetzt werden muss. 
Der Aufbau der Einrichtung besteht vorher, die Challenge des Spiels ist es, die Leute gesund zu halten, in dem sie dem Sicherheitskonzept folgen.
Natürlich gibt es Leute, die sich kategorisch nich daran halten, diese müssen durch Mitarbeiter in Schacht gehalten werden.
Sollte ein Ordnungsamtmitarbeiter im Laden Verstöße feststellen, so gibt er eine Verwarnung. Bei drei Verwarnungen wird der Laden dicht gemacht und das Spiel ist vorbei.
Zu managende Faktore sind unter anderem Umsatz des Ladens, Personalkosten und das Wohlgefühl der Kunden. 

## Technische Umsetzung

Webgame im 8-Bit- oder Cartoon-Grafikstiel (sprite based). Laden im Top-Down-View, alle NPCs/Gegenstände sind immer sichtbar, es sei dann man ist reingezoomt.

![Kaufhaus Top-Down-Skizze](https://cdn.discordapp.com/attachments/674685440049020928/708356397552894213/Kaufhaus.png)

Steuerung des Managers erfolgt über Pfeiltasten rechts/links/hoch/runter, Interaktion mit Gegenständen und anderen Personen via Maus. Die eingestellten Sicherheitskräfte und KassiererInnen machen ihre Jobs selbstständig.

## Ausarbeitung

Levels eskalieren von kleinem Tante-Emma-Laden über nromalen Supermarkt und großes Warenhaus bis zu Großer Luxus-Einkaufsmall.

Es kommen stetig neue Regelungen hinzu (ähnlich zu Papers Please), die zusätzlich zu den bereits bestehenden Regeln beachtet werden müssen. ( Die Fehlertoleranz nimmt auch immer weiter ab um zusätzlich für Schwierigkeit zu sorgen)
* Per Level geregelt: 
    * Anzahl der Leute im Laden
    * Regelungen
    * ...
* Mit der Zeit geregelt:
    * ...

Zeit ist anhaltbar, und kann auf drei Stufen ablaufen (normale, doppelte und dreifache Geschwindigkeit). Jedes Level sollte bei normaler Geschwindigkeit ca. 30 Miunten Spielzeit mindestens bieten. Alle zwei Minuten sollte das Spiel automatisch speichern, so dass auch bei Schließen des Browsers möglichst wenig Fortschritt verloren geht.
Progression wird erzielt, in dem der Spieler in jedem Level mehrere Bedingungen erfüllt, die mindestens folgendes einschließen:
* gewisse Ingame Zeit mit aktuellem Level verbracht (eine Woche/zwei Wochen/einen Monat, wird im Balancing adjustiert)
* gewisser Profit pro Tag (pro Level unterschiedlich)
* gewisse Menge an Ersparnissen in der Bank (pro Level unterschiedlich)

Der Spieler wird in jedem Level zum (freiwilligen) Upgrade angeregt, da das nächste Level jeweils stark höhere Profite verspricht. Es soll ihm allerdings weder schaden noch einen großen Vorteil verschaffen, nach Erreichen der Requirements noch ein wenig im aktuellen Level zu verweilen.

### Grobe Level-Struktur: 

#### "Tante Emma"-Laden (Tutorial)

Spielercharakter ist permanent hinter der Theke, kann aber mit dem gesamten Laden interagieren und auch mit den Leuten in der Schlange vor dem Laden. 

Zwei Kunden maximal gleichzeitig, Rest wartet draußen. Weitere Regeln kommen mit der Zeit (Maskenpflicht, Spuckschutz, regelmäßige Reinigungen). Challenges: Leute in einer ordentlichen Reihe halten, auf maximale Kundenanzahl achten.

#### Supermarkt

Gewisse Maximalkundenanzahl (bspw. 30), jeder muss mit Einkaufswagen rein (Man startet initial mit nur 10 Wägen). Weitere Regeln kommen mit der Zeit (Handschuhe, Mindestabstand 2m, Lagermanagement). Challenges: Einkaufen von Einkäufwagen zur Ausreizung des angehobenen Kundenlimits, Manager kann sich nun bewegen und Kunden müssen gelegentlich auf Abstand hingewiesen werden, Charaktere haben nur einen gewissen Radius in dem sie mit anderen Charakteren interagieren Können. Es können zusätzliche Mitarbeiter eingestellt werden, zwei werden direkt eingestellt: ein Kassierer und eine Sicherheitskraft am Eingang, die die Leute einlässt. 

#### Warenhaus

Höhere Maximalkundenanzahl, mehr anfängliche Einkaufswägen (übernommen aus dem letzten Level) und mehr Kapazität für zusätzliche, mehr Warenkategorien.  Weitere Regeln kommen mit der Zeit (Abgabe nur in haushaltsüblichen Mengen, zufällige Lieferstops für Produktkategorien -> fehlende Ware macht Kunden unglücklich).

PA-System auf dem Durchsagen gemacht werden können, die alle Kunden hören. Optionale Selbstbedienungskasse (muss auch gereinigt werden). Kontaktloses Zahlen vs. Bargeld. Desinfektionsstationen, die die Reinigungsrate senkt.


#### Einkaufsmeile

Im Gegensatz zu vorigen Leven nicht ein Laden, sondern ein Verbund aus vielen kleineren Läden, in denen initial einige der vorigen Regeln wieder wegfallen. Zusätzlich hat jeder Laden zwei bis drei Mitarbeiter, die autonom bereits viele der Regeln durchsetzen können. Auf der Minimap werden Verstöße auch bereits mit einem Ausrufezeichen markiert, so dass diese für den Spiele leichter zu entdecken sind.

Kinderbeausichtigung, größere Massen an Leuten, engere Gänge, Restaurants stellen eine besondere Gefahrenquelle dar. 

Desinfektionsroombas helfen, alles sauber zu halten. Mehr Mitarbeiter, die sich autonom verhalten.

### Inspektor

Der Inspektor wird in zufälligen Abständen vom Ordnungsamt in den Laden geschickt. Er ist ein NPC mit einem Discovery-Radius, in dem er Verstöße gegen geltende Regelungen aufspürt und vermerkt. Besonders in größeren Leveln kann dies genuzt werden, um trotz seiner Anwesenheit noch Regeln zu umgehen (bspw. wenn er sich an der Fleischtheke befindet kann immer noch an der Kasse in zu großen Mengen verkauft werden).
Bei gewissen hat der Spiele auch noch die Möglichkeit zu intervenieren (bspw. Inspektor stellt Abstandsregelungsmisachtung fest, Spieler kann Kunden vor Augen des Inspektors drauf hinweisen und so die Gefahr neutralisieren).
Am Ende seines Besuches gibt der Inspektor einen Bericht ab. Befanden sich die Verstöße in einem akzeptablen bis geringen Rahmen muss eine Strafe gezahlt werden, bei schweren Verstößen wird zusätzlich eine Verwarnung ausgesprochen. Nach drei Verwarnungen ist das Spiel zu Ende und muss komplett von vorne angefangen werde oder ab dem letzten vom Spiele angefertigten Speicherpunkt aufgenommen werden.