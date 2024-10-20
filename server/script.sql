DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS memes;
DROP TABLE IF EXISTS captions;
DROP TABLE IF EXISTS meme_captions;
DROP TABLE IF EXISTS round;
DROP TABLE IF EXISTS game;
DROP TABLE IF EXISTS game_round;

CREATE TABLE memes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image VARCHAR(255) NOT NULL
);

CREATE TABLE captions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text VARCHAR(255) NOT NULL
);

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL
);

CREATE TABLE meme_captions (
    meme_id INTEGER NOT NULL,
    caption_id INTEGER NOT NULL,
    PRIMARY KEY (meme_id, caption_id),
    FOREIGN KEY (meme_id) REFERENCES memes(id),
    FOREIGN KEY (caption_id) REFERENCES captions(id)
);

CREATE TABLE round (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    meme_id INTEGER NOT NULL,
    guessed BOOLEAN NOT NULL,
    FOREIGN KEY (meme_id) REFERENCES memes(id)
);

CREATE TABLE game (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    score INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE game_round (
    game_id INTEGER NOT NULL,
    round_id INTEGER NOT NULL,
    PRIMARY KEY (game_id, round_id),
    FOREIGN KEY (game_id) REFERENCES game(id),
    FOREIGN KEY (round_id) REFERENCES round(id)
);

INSERT INTO memes (image) VALUES
('meme1.png'),
('meme2.png'),
('meme3.png'),
('meme4.png'),
('meme5.png'),
('meme6.png'),
('meme7.png'),
('meme8.png'),
('meme9.png'),
('meme10.png');

INSERT INTO captions (text) VALUES
('Quando incontri una matricola durante il tuo sesto appello di fisica 1'),
('Quando una matricola ti chiede perchè il portale non va'),
('Quando il programma funziona sul mio pc ma non su quello del prof'),
('Non so se questo sia un bug o una feature'),
('Quando consegni il progetto 5 minuti prima della scadenza'),
('Tutte le volte che compila al primo colpo e senza errori'),
('Ti sei appena accorto che sono le 11PM e la scadenza era alle 11AM'),
('Quando scopri che del codice commentato ti crea dei bug'),
('0 warning 0 errors'),
('Vedere tutta la test suite in verde'),
('Quando riesci a fare merge di un branch senza conflitti'),
('Quando commenti il codice e il te del futuro ti ringrazierà'),
('Il tuo manager ti chiede di implementare una nuova feature e dice che ci vorrano maasimo 2 ore'),
('Quando qualcuno ti dice che non usa git per salvare il proprio codice'),
('Quando il tuo team scopre che hai rotto il codice'),
('Quando stavi programmando da 2 giorni ma ti accorgi di essere sul branch sbagliato'),
('Non puoi essere bocciato ad un esame se non ti presenti'),
('Non puoi avere conflitti se non pushi il tuo codice'),
('Quando il cliente ti chiede se un progetto di 3 mesi può essere fatto in una settimana'),
('Quando to chiedono se puoi scrivere tu i test'),
('Quando il debugger trova un errore che non esisteva prima'),
('Quando il capo progetto suggerisce di riscrivere tutto in un nuovo framework'),
('Quando ti chiedono di aggiornare la documentazione del codice'),
('Quando ti accorgi che il bug era solo un errore di battitura'),
('Quando ti rendi conto che il database è andato giù il giorno del rilascio'),
('Quando il codice non compila e scopri che è perché manca un punto e virgola'),
('Quando ti accorgi che lerrore è nel file di configurazione'),
('Quando qualcuno toglie i commenti dal tuo codice'),
('Quando scopri che la tua applicazione non funziona solo su un browser specifico'),
('Quando un collega ti chiede se hai già provato a riavviare il server'),
('Quando scopri che hai dimenticato di fare il commit prima di spegnere il PC'),
('Quando il capo ti chiede di aggiungere "solo un piccolo cambio" a 30 min dalla consegna'),
('Quando la tua funzione finalmente restituisce il risultato corretto'),
('Quando ti accorgi che hai lavorato sul ambiente di produzione invece che su quello di sviluppo'),
('Quando il cliente cambia le specifiche del progetto 1 giorno prima della consegna'),
('Quando scopri che il bug è causato da una libreria di terze parti'),
('Quando il test automatico fallisce per un timeout di pochi millisecondi'),
('Quando scrivi un one-liner perfetto che funziona al primo colpo'),
('Quando scopri che il problema era solo una questione di permessi di file'),
('Quando un collega ti chiede di spiegargli il tuo codice e non sai da dove iniziare'),
('Quando finalmente risolvi un bug ma crei altri tre'),
('Quando capisci che hai dimenticato di salvare il file prima di eseguire il codice'),
('Quando il software funziona perfettamente in locale ma fallisce in produzione'),
('Quando devi fare il debug di codice scritto da qualcun altro'),
('Quando scopri che il problema era nel file di configurazione del server'),
('Quando riesci a ridurre il tempo di esecuzione di una query da minuti a millisecondi'),
('Quando ti accorgi che il server è sovraccarico perché hai dimenticato un ciclo infinito'),
('Quando devi integrare il tuo codice con una API mal documentata'),
('Quando ricevi una pull request da un collega e ci sono più modifiche di quanto previsto'),
('Quando il capo ti chiede di fare una "piccola presentazione" del tuo lavoro');

-- Popola la tabella intermedia collegando ogni meme con due didascalie
INSERT INTO meme_captions (meme_id, caption_id) VALUES
(1, 1),
(1, 2),
(2, 3),
(2, 4),
(3, 5),
(3, 6),
(4, 7),
(4, 8),
(5, 9),
(5, 10),
(6, 11),
(6, 12),
(7, 13),
(7, 14),
(8, 15),
(8, 16),
(9, 17),
(9, 18),
(10, 19),
(10, 20);

INSERT INTO users (username, password, salt) VALUES
('filippo@mail.com', 'f6db033651f5a08374241cf95e203b92b3e74ef86a093cee6708be3d1d3ed289', '3f01fa6dfe941733'),
('test@mail.com', 'd4df57e502ae71839b2b9bec2f01609981569a7eb03ef2dacda241557e9618a5', '420d85b4743f5c39');
