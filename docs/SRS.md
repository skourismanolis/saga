![logo](logo.png "Logo")

# Τεχνολογία λογισμικού

## Έγγραφο Software Requirement Specifications

**Μέλη ομάδας:**

Νάνας Ιωάννης 1115201700102

Παπαθυμιόπουλος Θωμάς 1115201700119

Σιώτης Κωνσταντίνος 1115201700140

Σκούρης Εμμανουήλ-Νικόλαος 1115201700142

Συνοδινού Ευδοκία 1115201700154

## Στόχος του Saga

Στόχος της πλατφόρμας Saga είναι η προσφορά των κατάλληλων εργαλείων για την διαχείριση ομαδικών project μέσω του συστήματος [scrum](<https://en.wikipedia.org/wiki/Scrum_(software_development)>).
Η πλατφόρμα δίνει την δυνατότητα σε κάποιον χρήστη να δημιουργήσει δικά του project, καθώς και να συμμετάσχει σε ομάδες υπαρχόντων project.
Επιπλέον προσφέρει τρόπους διαμοιρασμού του φόρτου εργασίας των project στα μέλη της ομάδας του και την δυνατότητα αξιολόγησης της δουλειάς κάθε μέλους.
Μέσω των παραπάνω το Saga αποσκοπεί στην ενίσχυση της συνεργασίας και της επικοινωνίας μεταξύ των μελών μια ομάδας και κατά συνέπεια την πιο αποτελεσματική ολοκλήρωση των project των χρηστών του.

## Ομάδες χρηστών

| Ομάδα                | Περιγραφή                                                                                                                                                                                                                                                                                                                               |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Μέλος ομάδας project | Οι χρήστες αυτοί έχουν ως βασική αρμοδιότητα την ολοκλήρωση issues του project στο οποίο είναι μέλη. Επιπλέον μπορούν να δημιουργήοσυν epics, sprints και issues οι ίδιοι ανάλογα με τις απαιτήσεις του project.                                                                                                                        |
| Διαχειριστής project | Οι χρήστες αυτόι έχουν όλες τις δυνατότητες των μελών ομάδας project, αφού είναι και οι ίδιοι μέλη της ομάδας. Οι διαχειριστές ενός project έχουν επιπλέον την ικανότητα να αλλάξουν τα στοιχεία ενός project, να προσκαλέσουν μέλη στην ομάδα, να εκδιώξουν μέλη από την ομάδα, καθώς και να προάγουν μέλη της ομάδας σε διαχειριστές. |

## Απαιτήσεις χρηστών

### Λειτουργικές απαιτήσεις:

- Απαιτήσεις όλων των χρηστών:

  - Εγγραφή/Σύνδεση στην πλατφόρμα.
  - Πιστοποίηση εισόδου.
  - Αποσύνδεση από την πλατφόρμα.
  - Αλλαγή στοιχείων λογαριασμού.
  - Διαγραφή λογαριασμού.
  - Αλλαγή πλάνου.
  - Δημιουργία project.
  - Προβολή λίστας τρεχόντων project.
  - Αναζήτηση στην λίστα τρεχόντων project.

- Απαιτήσεις των μελών ομάδας project:

  - Προβολή λογαριασμού κάποιου άλλου χρήστη μέλους της ομάδας.
  - Προβολή λίστας από issues.
  - Προβολή λίστας απο epics.
  - Προβολή λίστας από sprints.
  - Φιλτράρισμα λίστας των issues με βάση τα label, epic.
  - Δημιουργία epic.
  - Δημιουργία sprint.
  - Προσθήκη/Αφαίρεση issue σε sprint.
  - Προσθήκη/Αφαίρεση issue σε epic.
  - Προσθήκη epic σε sprint.
  - Εκκίνηση sprint.
  - Προεπισκόπηση ενός issue.
  - Προεπισκόπηση ενός epic.
  - Επεξεργασία των στοιχείων ενός issue.
  - Επεξεργασία των στοιχείων ενός epic.
  - Προβολή των καταστάσεων των issues ενός sprint (to-do, σε εξέλιξη, ολοκληρωμένα).
  - Ορισμός κατηγοριών των issues και επιλογή χρώματος για αυτές.
  - Μετακίνηση issue από κάποια κατάσταση σε κάποια άλλη.
  - Αποχώρηση από κάποιο project.
  - Ανάρτηση και διαγραφή σχολίων.

- Απαιτήσεις των διαχειριστών project:
  - Επεξεργασία των ρυθμίσεων του project.
  - Διαγραφή project.
  - Πρόσκληση νέων μελών στην ομάδα του project.
  - Εκδίωξη μελών από την ομάδα του project.
  - Προαγωγή/Υποβίβαση μελών σε/από διαχειριστές.

### Μη λειτουργικές απαιτήσεις:

- Κανονική έκδοση της πλατφόρμας.
- Premium έκδοση της πλατφόρμας.
- Δημιουργία νέων καταστάσεων στο board.
- Επεξεργασία καταστάσεων στο board (αλλαγή ονόματος).

### Επιπλέον λειτουργίες αν προλάβουμε:

- Προβολή ιστορικού πληρωμών.
- Αλλαγή κωδικού πρόσβασης ('Ξέχασα τον κωδικό μου').

## Παραδοχές

- Ένα μονάχα sprint μπορεί να είναι ενεργό σε κάποιο project.
- Με την ολοκλήρωση κάποιου sprint, όλα τα issues που είναι στην κατάσταση "Ολοκληρωμένα" διαγράφονται από το sprint.
- Απαγορεύεται η πρόσβαση σε project εαν το μέλος δεν έχει πιστοποιήσει τον λογαριασμό του μέσω email.
- Αν σε κάποιο project έχει μείνει ένας μόνο διαχειριστής, ο ίδιος δεν μπορεί να αποχωρήσει από το project.

## Προδιαγραφές

| Απαίτηση           | Εγγραφή/Σύνδεση στην πλατφόρμα                                                                                                                                                                                                                                        |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ομάδες Χρηστών** | Όλες                                                                                                                                                                                                                                                                  |
| **Προδιαγραφή**    | Ο χρήστης μπορεί να εγγραφεί/συνδεθεί στην σελίδα πατώντας το κουμπί "Σύνδεση/Εγγραφή". Με την συμπλήρωση των κατάλληλων πεδίων ο χρήστης εισέρχεται στην πλατφόρμα. Κατά την εγγραφή ο χρήστης θα πρέπει να επιλέξει πλάνο και να γίνει η πιστοποίηση του email του. |

| Απαίτηση           | Πιστοποίηση εισόδου                                                                                                                                                                                                                                                          |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ομάδες Χρηστών** | Όλες                                                                                                                                                                                                                                                                         |
| **Προδιαγραφή**    | Η πιστοποίηση του χρήστη γίνεται αρχικά κατά την σύνδεση μέσω του κωδικού του ο οποίος μετά από hashing φυλάσσεται στην βάση. Κατά την είσοδο του χρήστη στην πλατφόρμα ο χρήστης θα αποκτά ένα token που θα στέλνεται σε κάθε επικοινωνία του με τον server για πιστοποίση. |

| Απαίτηση           | Αποσύνδεση από την πλατφόρμα                                                                                                                           |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Ομάδες Χρηστών** | Όλες                                                                                                                                                   |
| **Προδιαγραφή**    | Ο χρήστης για να αποσυνδεθεί από την πλατφόρμα πατάει το κουμπί με το όνομα χρήστη του και την εικόνα λογαριασμού του και πατάει το κουμπί αποσύνδεση. |

| Απαίτηση           | Αλλαγή στοιχείων λογαριασμού                                                                                                                                                                                                                                                                                                                                                     |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ομάδες Χρηστών** | Όλες                                                                                                                                                                                                                                                                                                                                                                             |
| **Προδιαγραφή**    | Ο χρήστης μπορεί να πλοηγηθεί στην σελίδα αλλαγής στοιχείων λογαριασμού πατώντας το κουμπί με το όνομα χρήστη. Από εκεί πατώντας την επιλογή "Ο Λογαριασμός μου" ο χρήστης κατευθύνεται στην προβολή λογαριασμού. Από εκεί πατώντας το κουμπί "Ρυθμίσεις" ο χρήστης κατευθύνεται στην σελίδα αλλαγής στοιχείων λογαριασμού και αλλάζει τα στοιχεία του συμπληρώνοντας την φόρμα. |

| Απαίτηση           | Διαγραφή λογαριασμού                                                                                                                    |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Ομάδες Χρηστών** | Όλες                                                                                                                                    |
| **Προδιαγραφή**    | Στην σελίδα αλλαγής στοιχείων λογαριασμού ο χρήστης μπορεί να διαγράψει τον λογαριασμό του πατώντας την επιλογή "Διαγραφή Λογαριασμού". |

| Απαίτηση           | Αλλαγή πλάνου                                                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| **Ομάδες Χρηστών** | Όλες                                                                                                                           |
| **Προδιαγραφή**    | Στην σελίδα αλλαγής στοιχείων λογαριασμού ο χρήστης μπορεί να πατήσει την επιλογή "Αλλαγή πλάνου" και να αλλάξει το πλάνο του. |

| Απαίτηση           | Δημιουργία project                                                                                                                                                                                         |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ομάδες Χρηστών** | Όλες                                                                                                                                                                                                       |
| **Προδιαγραφή**    | Αφού ένας χρήστης έχει συνδεθεί, μπορεί να δημιουργήσει ένα νέο project πατώντας το κουμπί "Δημιουργία Project". Ένα modal θα εμφανιστεί στην οθόνη στο οποίο χρήστης συμπληρώνει τα στοιχεία του project. |

| Απαίτηση           | Προβολή λίστας τρεχώντων project                                                                                                          |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Ομάδες Χρηστών** | Όλες                                                                                                                                      |
| **Προδιαγραφή**    | Αφού ένας χρήστης έχει συνδεθεί, στην αρχική σελίδα μπορεί να δεί την λίστα με τα ενεργά project που του ανήκουν ή στα οποία είναι μέλος. |

| Απαίτηση           | Αναζήτηση στην λίστα τρεχόντων project                                                                                                              |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ομάδες Χρηστών** | Όλες                                                                                                                                                |
| **Προδιαγραφή**    | Στην αρχική σελίδα ο χρήστης μπορεί να αναζητήσει το κάποιο project από την λίστα των project εισάγοντας το όνομα του project στο πεδίο αναζήτησης. |

<br/><br/>

| Απαίτηση           | Προβολή λογαριασμού κάποιου άλλου χρήστη μέλους της ομάδας                                                                                                                                                                                                                                                                                                                                          |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ομάδες Χρηστών** | Μέλος ομάδας project & Διαχειριστής project                                                                                                                                                                                                                                                                                                                                                         |
| **Προδιαγραφή**    | Πατώντας κάποιο project από την λίστα των project ο χρήστης κατευθύνεται στο backlog του project αυτού. Από το project navabar που εμφανίζεται πατώντας την καρτέλα "Ρυθμίσεις Project" ο χρήστης οδηγείται στις ρυθμίσεις του project όπου μπορεί να δει την λίστα με τα μέλη του project. Πατώντας σε οποιοδήποτε μέλος ο χρήστης κατευθύνεται στην προβολή λογαριασμού του συγκεκριμένου μέλους. |

| Απαίτηση           | Προβολή λίστας από issues                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| **Ομάδες Χρηστών** | Μέλος ομάδας project & Διαχειριστής project                                                      |
| **Προδιαγραφή**    | Στην καρτέλα backlog, στην προβολή project, ο χρήστης μπορεί να δει το backlog με όλα τα issues. |

| Απαίτηση           | Προβολή λίστας απο epics                                                |
| ------------------ | ----------------------------------------------------------------------- |
| **Ομάδες Χρηστών** | Μέλος ομάδας project & Διαχειριστής project                             |
| **Προδιαγραφή**    | Στην καρτέλα backlog ο χρήστης μπορεί να δει την λίστα με όλα τα epics. |

| Απαίτηση           | Προβολή λίστας από sprints                                                      |
| ------------------ | ------------------------------------------------------------------------------- |
| **Ομάδες Χρηστών** | Μέλος ομάδας project & Διαχειριστής project                                     |
| **Προδιαγραφή**    | Στην καρτέλα backlog ο χρήστης μπορεί να δει την λίστα με όλα τα ενεργά sprint. |

| Απαίτηση           | Φιλτράρισμα λίστας των issues με βάση τα label, epic                                                      |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| **Ομάδες Χρηστών** | Μέλος ομάδας project & Διαχειριστής project                                                               |
| **Προδιαγραφή**    | Ο χρήστης μπορεί να φιλτράρει τα issues με κριτήριο το label ή το epic πατώντας τις αντίστοιχες επιλογές. |

| Απαίτηση           | Δημιουργία epic                                                                                                                                                   |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ομάδες Χρηστών** | Μέλος ομάδας project & Διαχειριστής project                                                                                                                       |
| **Προδιαγραφή**    | Πατώντας το κομπί "Δημιουργία epic" ο χρήστης οδηγείται στην σελίδα δημιουργίας epic. Εκεί συμπληρώνοντας τα κατάλληλα πεδία μπορεί να δημιουργήσει ένα νέο epic. |

| Απαίτηση           | Δημιουργία sprint                                                                                                                        |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Ομάδες Χρηστών** | Μέλος ομάδας project & Διαχειριστής project                                                                                              |
| **Προδιαγραφή**    | Στην καρτέλα backlog πατώντας της επιλογή "Νέο sprint" ο χρήστης συμπληρώνει τα κατάλληλα πεδία για να δημιουργήσει ένα νέο κενό sprint. |

| Απαίτηση           | Προσθήκη/Αφαίρεση issue σε sprint                                                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ομάδες Χρηστών** | Μέλος ομάδας project & Διαχειριστής project                                                                                                           |
| **Προδιαγραφή**    | Στην καρτέλα backlog ο χρήστης απλά τραβάει κάποιο issue από το backlog και το τοποθετεί στο sprint που επιθυμεί. Αντίστροφη διαδικασία για αφαίρεση. |

| Απαίτηση           | Προσθήκη/Αφαίρεση issue σε epic                                                                                                                     |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ομάδες Χρηστών** | Μέλος ομάδας project & Διαχειριστής project                                                                                                         |
| **Προδιαγραφή**    | Στην καρτέλα backlog ο χρήστης απλά τραβάει κάποιο issue από το backlog και το τοποθετεί στο epic που επιθυμεί. Αντίστροφη διαδικασία για αφαίρεση. |

| Απαίτηση           | Προσθήκη epic σε sprint                                                                                                                                                     |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ομάδες Χρηστών** | Μέλος ομάδας project & Διαχειριστής project                                                                                                                                 |
| **Προδιαγραφή**    | Στην καρτέλα backlog ο χρήστης απλά τραβάει κάποιο epic από το backlog και το τοποθετεί στο sprint. Τότε αυτόματα όλα τα issues του συγκεκριμένου epic θα μπουν στο sprint. |

| Απαίτηση           | Εκκίνηση sprint                                                    |
| ------------------ | ------------------------------------------------------------------ |
| **Ομάδες Χρηστών** | Μέλος ομάδας project & Διαχειριστής project                        |
| **Προδιαγραφή**    | Στην καρτέλα backlog ο χρήστης παταέι το κουμπί "Εκκίνηση sprint". |

| Απαίτηση           | Προεπισκόπηση ενός issue                                                                                   |
| ------------------ | ---------------------------------------------------------------------------------------------------------- |
| **Ομάδες Χρηστών** | Μέλος ομάδας project & Διαχειριστής project                                                                |
| **Προδιαγραφή**    | Ο χρήστης πατώντας τον τίτλο κάποιου sprint στο backlog εμφανίζει ένα modal με όλα τα στοιχεία του sprint. |

| Απαίτηση           | Προεπισκόπηση ενός epic                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------- |
| **Ομάδες Χρηστών** | Μέλος ομάδας project & Διαχειριστής project                                                 |
| **Προδιαγραφή**    | Ο χρήστης πατώντας τον τίτλο κάποιου epic οδηγείται σελίδα προβολής των στοιχείων του epic. |

| Απαίτηση           | Επεξεργασία των στοιχείων ενός issue                                                                                               |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Ομάδες Χρηστών** | Μέλος ομάδας project & Διαχειριστής project                                                                                        |
| **Προδιαγραφή**    | Στο modal προεπισκόπησης των issue ο χρήστης μπορεί να επεξεργαστεί τα στοιχεία του issue πατώντας το μολύβι δίπλα από κάθε πεδίο. |

| Απαίτηση           | Επεξεργασία των στοιχείων ενός epic                                                                                           |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| **Ομάδες Χρηστών** | Μέλος ομάδας project & Διαχειριστής project                                                                                   |
| **Προδιαγραφή**    | Στην σελίδα προβολής ενός epic ο χρήστης μπορεί να επεξεργαστεί τα στοιχεία του epic πατώντας το μολύβι δίπλα από κάθε πεδίο. |

| Απαίτηση           | Προβολή των καταστάσεων των issues ενός sprint (to-do, σε εξέλιξη, ολοκληρωμένα)                                                                |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ομάδες Χρηστών** | Μέλος ομάδας project & Διαχειριστής project                                                                                                     |
| **Προδιαγραφή**    | Πατώντας την καρτέλα board ο χρήστης μπορεί να δει τρεις στήλες (to-do, σε εξέλιξη, ολοκληρωμένα) με τις καταστάσεις των issues κάποιου sprint. |

| Απαίτηση           | Ορισμός κατηγοριών των issues και επιλογή χρώματος για αυτές                                                                                                                 |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ομάδες Χρηστών** | Μέλος ομάδας project & Διαχειριστής project                                                                                                                                  |
| **Προδιαγραφή**    | Ο χρήστης θα μπορεί να δημιουργήσει και να επιλέξει χρώματα για τα labels των issues του sprint πατώντας το αντίστοιχο κουμπί και συμπληρώνοντας το modal που θα εμφανιστεί. |

| Απαίτηση           | Μετακίνηση issue από μια κατάσταση σε κάποια άλλη                              |
| ------------------ | ------------------------------------------------------------------------------ |
| **Ομάδες Χρηστών** | Μέλος ομάδας project & Διαχειριστής project                                    |
| **Προδιαγραφή**    | Στην καρτέλα board ο χρήστης τραβάει κάποιο issue από την μια στήλη στην άλλη. |

| Απαίτηση           | Αποχώρηση από κάποιο project                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| **Ομάδες Χρηστών** | Μέλος ομάδας project & Διαχειριστής project                                                             |
| **Προδιαγραφή**    | Ο χρήστης κατευθύνεται στην καρτέλα "Ρυθμίσεις project" και πατάει την επιλογή "Αποχώρηση από project". |

| Απαίτηση           | Ανάρτηση και διαγραφή σχολίων                                                     |
| ------------------ | --------------------------------------------------------------------------------- |
| **Ομάδες Χρηστών** | Μέλος ομάδας project & Διαχειριστής project                                       |
| **Προδιαγραφή**    | Ο χρήστης μπορεί να αναρτήσει σχόλια σε ένα issue και να διαγράψει τα σχόλιά του. |

<br/><br/>

| Απαίτηση           | Επεξεργασία των ρυθμίσεων του project                                                                                |
| ------------------ | -------------------------------------------------------------------------------------------------------------------- |
| **Ομάδες Χρηστών** | Διαχειριστής project                                                                                                 |
| **Προδιαγραφή**    | Στην καρτέλα "Ρυθμίσεις project" o χρήστης μπορεί να αλλάξει τα στοιχεία του project αλλάζοντας τα απαραίτητα πεδία. |

| Απαίτηση           | Διαγραφή project                                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| **Ομάδες Χρηστών** | Διαχειριστής project                                                                                                     |
| **Προδιαγραφή**    | Στην καρτέλα "Ρυθμίσεις project" o χρήστης μπορεί να διαγράψει το project πατώντας το κόκκινο κουμπι "Διαγραφή project". |

| Απαίτηση           | Πρόσκληση νέων μελών στην ομάδα του project                                                                                 |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| **Ομάδες Χρηστών** | Διαχειριστής project                                                                                                        |
| **Προδιαγραφή**    | Στην καρτέλα "Ρυθμίσεις project" o χρήστης μπορεί να προσκαλέσει άτομα στην ομάδα του project στέλνοντας τους τον σύνδεσμο. |

| Απαίτηση           | Εκδίωξη μελών από την ομάδα του project                                                                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Ομάδες Χρηστών** | Διαχειριστής project                                                                                                                                                     |
| **Προδιαγραφή**    | Στην καρτέλα "Ρυθμίσεις project" o χρήστης μπορεί να εκδιώξει άτομα από την ομάδα του Project πατώντας το κόκκινο απαγορευτικό δίπλα από το όνομα τους στην λίστα μελών. |

| Απαίτηση           | Προαγωγή/Υποβίβαση μελών σε/από διαχειριστές                                                                                                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ομάδες Χρηστών** | Διαχειριστής project                                                                                                                                                                                          |
| **Προδιαγραφή**    | Στην καρτέλα "Ρυθμίσεις project" o χρήστης μπορεί να προάγει άτομα από την ομάδα του Project πατώντας το μπλε βελάκι δίπλα από το όνομα τους στην λίστα μελών. Για υποβίβαση ακολουθεί αντίστοιχη διαδικασία. |
