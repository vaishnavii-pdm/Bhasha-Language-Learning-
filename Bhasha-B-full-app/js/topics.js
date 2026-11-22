/*
 * Bhasha topic packs: extra lessons beyond Easy and Hard.
 * Loads after data.js and adds each pack to BhashaData.CONCEPTS (English side),
 * BhashaData.TOPICS (the list shown on screen) and every language object (the phrases).
 *
 * To add a pack: add an entry to TOPICS, add its phrases for every language in PACKS,
 * in the same order as the concepts. `npm test` checks the counts.
 * A phrase is [native text, pronunciation, optional note].
 */
(function (root) {
  'use strict';

  var D = (typeof module === 'object' && module.exports) ? require('./data.js') : root.BhashaData;

  var TOPICS = [
    { id: 'numbers', name: 'Numbers', blurb: 'Count from one to ten', mark: '1 2 3',
      concepts: [
        { en: 'One', tip: 'The easiest number. Hold up one finger for extra clarity.' },
        { en: 'Two', tip: 'Two cups of tea, two slices of cake. Always two.' },
        { en: 'Three', tip: 'Three is a magic number in every language.' },
        { en: 'Four', tip: 'Four legs on a chair, four legs on a cat.' },
        { en: 'Five', tip: 'Count your fingers while you say it.' },
        { en: 'Six', tip: 'Six is the number of snacks you really need.' },
        { en: 'Seven', tip: 'Seven days in a week, seven sleepy penguins.' },
        { en: 'Eight', tip: 'Eight looks like a snowman lying down.' },
        { en: 'Nine', tip: 'Almost ten. Almost there!' },
        { en: 'Ten', tip: 'Ten fingers, ten toes, ten out of ten.' }
      ] },
    { id: 'food', name: 'Food and drink', blurb: 'Order a meal like a local', mark: 'Tea',
      concepts: [
        { en: 'Rice', tip: 'Rice shows up in almost every meal across Asia.' },
        { en: 'Bread', tip: 'Warm bread is a friendly word in every country.' },
        { en: 'Tea', tip: 'Ask for this one and you will make friends.' },
        { en: 'Milk', tip: 'Handy at breakfast and after very spicy food.' },
        { en: 'Fruit', tip: 'A snack that is also a very useful word.' },
        { en: 'Not spicy, please', tip: 'Say it early. The chef does not read minds.' },
        { en: 'I am vegetarian', tip: 'Say it with a smile and point at the vegetables.' },
        { en: 'The bill, please', tip: 'The last phrase of every good meal.' }
      ] },
    { id: 'family', name: 'Family and friends', blurb: 'Talk about the people you love', mark: 'Mum',
      concepts: [
        { en: 'Mother', tip: 'Often the very first word a baby says.' },
        { en: 'Father', tip: 'Short and easy in most languages.' },
        { en: 'Brother', tip: 'Some languages have separate words for older and younger.' },
        { en: 'Sister', tip: 'Some languages have separate words for older and younger.' },
        { en: 'Friend', tip: 'The most important word for travelling.' },
        { en: 'Grandmother', tip: 'Some languages have different words for each side of the family.' }
      ] },
    { id: 'sos', name: 'Emergencies', blurb: 'Words you hope you never need', mark: 'SOS',
      concepts: [
        { en: 'Help!', tip: 'Shout it loudly. People will come.' },
        { en: 'I need a doctor', tip: 'Learn it now, never use it later.' },
        { en: 'Call the police', tip: 'Calm voice, clear words.' },
        { en: 'I am lost', tip: 'Say it, then show a map or point at your phone.' },
        { en: 'I am sick', tip: 'Press your tummy or your head to show where.' },
        { en: 'Where is the hospital?', tip: 'Keep this one handy when you travel.' },
        { en: 'Stop!', tip: 'Loud and short is all it takes.' }
      ] }
  ];

  var PACKS = {
    hindi: {
      numbers: [['एक', 'ek'], ['दो', 'do'], ['तीन', 'teen'], ['चार', 'chaar'], ['पाँच', 'paanch'], ['छह', 'chhah'], ['सात', 'saat'], ['आठ', 'aath'], ['नौ', 'nau'], ['दस', 'das']],
      food: [['चावल', 'chaaval'], ['रोटी', 'rotee'], ['चाय', 'chaay'], ['दूध', 'doodh'], ['फल', 'phal'], ['कम तीखा, कृपया', 'kam teekha, kripaya'], ['मैं शाकाहारी हूँ', 'main shaakaahaari hoon'], ['बिल दीजिए', 'bil deejiye']],
      family: [['माँ', 'maan'], ['पिता', 'pita'], ['भाई', 'bhaai'], ['बहन', 'bahan'], ['दोस्त', 'dost'], ['दादी', 'daadee', 'Father’s mother. Mother’s mother is नानी (naanee).']],
      sos: [['बचाओ!', 'bachaao!'], ['मुझे डॉक्टर चाहिए', 'mujhe doctor chaahiye'], ['पुलिस को बुलाओ', 'police ko bulaao'], ['मैं रास्ता भूल गया हूँ', 'main raasta bhool gaya hoon', 'Said by men. Women say भूल गई हूँ (bhool gayee hoon).'], ['मैं बीमार हूँ', 'main beemaar hoon'], ['अस्पताल कहाँ है?', 'aspataal kahaan hai?'], ['रुको!', 'ruko!']]
    },
    tamil: {
      numbers: [['ஒன்று', 'ondru'], ['இரண்டு', 'irandu'], ['மூன்று', 'moondru'], ['நான்கு', 'naangu'], ['ஐந்து', 'ainthu'], ['ஆறு', 'aaru'], ['ஏழு', 'ezhu'], ['எட்டு', 'ettu'], ['ஒன்பது', 'onbathu'], ['பத்து', 'paththu']],
      food: [['சாதம்', 'saadham'], ['ரொட்டி', 'rotti'], ['தேநீர்', 'theneer'], ['பால்', 'paal'], ['பழம்', 'pazham'], ['காரம் குறைவாக வேண்டும்', 'kaaram kuraivaaga vendum'], ['நான் சைவம்', 'naan saivam'], ['பில் கொடுங்கள்', 'bill kodungal']],
      family: [['அம்மா', 'amma'], ['அப்பா', 'appa'], ['அண்ணன்', 'annan', 'Older brother. Younger brother is தம்பி (thambi).'], ['அக்கா', 'akka', 'Older sister. Younger sister is தங்கை (thangai).'], ['நண்பன்', 'nanban', 'Said of a male friend. A female friend is தோழி (thozhi).'], ['பாட்டி', 'paatti']],
      sos: [['உதவி!', 'udhavi!'], ['எனக்கு மருத்துவர் வேண்டும்', 'enakku maruthuvar vendum'], ['காவல்துறையை அழையுங்கள்', 'kaavalthuraiyai azhaiyungal'], ['நான் வழி தவறிவிட்டேன்', 'naan vazhi thavarivitten'], ['எனக்கு உடம்பு சரியில்லை', 'enakku udambu sariyillai'], ['மருத்துவமனை எங்கே?', 'maruthuvamanai enge?'], ['நில்லுங்கள்!', 'nillungal!']]
    },
    bengali: {
      numbers: [['এক', 'ek'], ['দুই', 'dui'], ['তিন', 'tin'], ['চার', 'chaar'], ['পাঁচ', 'paanch'], ['ছয়', 'chhoy'], ['সাত', 'shaat'], ['আট', 'aat'], ['নয়', 'noy'], ['দশ', 'dosh']],
      food: [['ভাত', 'bhaat'], ['রুটি', 'ruti'], ['চা', 'cha'], ['দুধ', 'dudh'], ['ফল', 'fol'], ['ঝাল কম দিন', 'jhal kom din'], ['আমি নিরামিষাশী', 'ami niramishashi'], ['বিল দিন', 'bil din']],
      family: [['মা', 'maa'], ['বাবা', 'baba'], ['ভাই', 'bhai'], ['বোন', 'bon'], ['বন্ধু', 'bondhu'], ['ঠাকুমা', 'thakuma', 'Father’s mother. Mother’s mother is দিদিমা (didima).']],
      sos: [['বাঁচান!', 'baachan!'], ['আমার ডাক্তার দরকার', 'amar daktar dorkar'], ['পুলিশ ডাকুন', 'police dakun'], ['আমি পথ হারিয়েছি', 'ami poth hariyechhi'], ['আমি অসুস্থ', 'ami oshustho'], ['হাসপাতাল কোথায়?', 'haashpaatal kothay?'], ['থামুন!', 'thamun!']]
    },
    telugu: {
      numbers: [['ఒకటి', 'okati'], ['రెండు', 'rendu'], ['మూడు', 'moodu'], ['నాలుగు', 'naalugu'], ['ఐదు', 'aidu'], ['ఆరు', 'aaru'], ['ఏడు', 'edu'], ['ఎనిమిది', 'enimidi'], ['తొమ్మిది', 'tommidi'], ['పది', 'padi']],
      food: [['అన్నం', 'annam'], ['రొట్టె', 'rotte'], ['టీ', 'tee'], ['పాలు', 'paalu'], ['పండు', 'pandu'], ['కారం తక్కువగా', 'kaaram takkuvaga'], ['నేను శాకాహారిని', 'nenu shaakaahaarini'], ['బిల్లు ఇవ్వండి', 'billu ivvandi']],
      family: [['అమ్మ', 'amma'], ['నాన్న', 'nanna'], ['అన్న', 'anna', 'Older brother. Younger brother is తమ్ముడు (thammudu).'], ['అక్క', 'akka', 'Older sister. Younger sister is చెల్లి (chelli).'], ['స్నేహితుడు', 'snehithudu', 'Said of a male friend. A female friend is స్నేహితురాలు (snehithuraalu).'], ['అమ్మమ్మ', 'ammamma', 'Mother’s mother. Father’s mother is నాన్నమ్మ (naannamma).']],
      sos: [['సహాయం!', 'sahaayam!'], ['నాకు డాక్టర్ కావాలి', 'naaku doctor kaavali'], ['పోలీసులను పిలవండి', 'polisulanu pilavandi'], ['నేను దారి తప్పాను', 'nenu daari tappaanu'], ['నాకు అనారోగ్యంగా ఉంది', 'naaku anaarogyamga undi'], ['ఆసుపత్రి ఎక్కడ ఉంది?', 'aasupatri ekkada undi?'], ['ఆగండి!', 'aagandi!']]
    },
    marathi: {
      numbers: [['एक', 'ek'], ['दोन', 'don'], ['तीन', 'teen'], ['चार', 'chaar'], ['पाच', 'paach'], ['सहा', 'sahaa'], ['सात', 'saat'], ['आठ', 'aath'], ['नऊ', 'nau'], ['दहा', 'dahaa']],
      food: [['भात', 'bhaat'], ['चपाती', 'chapaati'], ['चहा', 'chahaa'], ['दूध', 'doodh'], ['फळ', 'phal'], ['कमी तिखट द्या', 'kami tikhat dyaa'], ['मी शाकाहारी आहे', 'mi shaakaahaari aahe'], ['बिल द्या', 'bil dyaa']],
      family: [['आई', 'aai'], ['वडील', 'vadil'], ['भाऊ', 'bhaau'], ['बहीण', 'bahin'], ['मित्र', 'mitra'], ['आजी', 'aaji']],
      sos: [['वाचवा!', 'vaachavaa!'], ['मला डॉक्टर हवा आहे', 'malaa doctor havaa aahe'], ['पोलिसांना बोलवा', 'polisaanna bolavaa'], ['मी हरवलो आहे', 'mi haravalo aahe', 'Said by men. Women say हरवले आहे (haravale aahe).'], ['मी आजारी आहे', 'mi aajaari aahe'], ['रुग्णालय कुठे आहे?', 'rugnaalay kuthe aahe?'], ['थांबा!', 'thaambaa!']]
    },
    kannada: {
      numbers: [['ಒಂದು', 'ondu'], ['ಎರಡು', 'eradu'], ['ಮೂರು', 'mooru'], ['ನಾಲ್ಕು', 'naalku'], ['ಐದು', 'aidu'], ['ಆರು', 'aaru'], ['ಏಳು', 'elu'], ['ಎಂಟು', 'entu'], ['ಒಂಬತ್ತು', 'ombattu'], ['ಹತ್ತು', 'hattu']],
      food: [['ಅನ್ನ', 'anna'], ['ರೊಟ್ಟಿ', 'rotti'], ['ಚಹಾ', 'chahaa'], ['ಹಾಲು', 'haalu'], ['ಹಣ್ಣು', 'hannu'], ['ಖಾರ ಕಡಿಮೆ ಹಾಕಿ', 'khaara kadime haaki'], ['ನಾನು ಸಸ್ಯಾಹಾರಿ', 'naanu sasyaahaari'], ['ಬಿಲ್ ಕೊಡಿ', 'bill kodi']],
      family: [['ಅಮ್ಮ', 'amma'], ['ಅಪ್ಪ', 'appa'], ['ಅಣ್ಣ', 'anna', 'Older brother. Younger brother is ತಮ್ಮ (tamma).'], ['ಅಕ್ಕ', 'akka', 'Older sister. Younger sister is ತಂಗಿ (tangi).'], ['ಸ್ನೇಹಿತ', 'snehita'], ['ಅಜ್ಜಿ', 'ajji']],
      sos: [['ಸಹಾಯ ಮಾಡಿ!', 'sahaaya maadi!'], ['ನನಗೆ ವೈದ್ಯರು ಬೇಕು', 'nanage vaidyaru beku'], ['ಪೊಲೀಸರನ್ನು ಕರೆಯಿರಿ', 'poleesarannu kareyiri'], ['ನಾನು ದಾರಿ ತಪ್ಪಿದ್ದೇನೆ', 'naanu daari tappiddene'], ['ನನಗೆ ಹುಷಾರಿಲ್ಲ', 'nanage hushaarilla'], ['ಆಸ್ಪತ್ರೆ ಎಲ್ಲಿದೆ?', 'aaspatre ellide?'], ['ನಿಲ್ಲಿ!', 'nilli!']]
    },
    gujarati: {
      numbers: [['એક', 'ek'], ['બે', 'be'], ['ત્રણ', 'tran'], ['ચાર', 'chaar'], ['પાંચ', 'paanch'], ['છ', 'chha'], ['સાત', 'saat'], ['આઠ', 'aath'], ['નવ', 'nav'], ['દસ', 'das']],
      food: [['ભાત', 'bhaat'], ['રોટલી', 'rotli'], ['ચા', 'chaa'], ['દૂધ', 'doodh'], ['ફળ', 'fal'], ['ઓછું તીખું રાખજો', 'ochhu tikhu raakhajo'], ['હું શાકાહારી છું', 'hu shaakaahaari chhu'], ['બિલ આપો', 'bil aapo']],
      family: [['મા', 'maa'], ['પપ્પા', 'pappa'], ['ભાઈ', 'bhaai'], ['બહેન', 'bahen'], ['મિત્ર', 'mitra'], ['દાદી', 'daadi', 'Father’s mother. Mother’s mother is નાની (naani).']],
      sos: [['બચાવો!', 'bachaavo!'], ['મને ડૉક્ટર જોઈએ છે', 'mane doctor joie chhe'], ['પોલીસને બોલાવો', 'polisne bolaavo'], ['હું ખોવાઈ ગયો છું', 'hu khovaai gayo chhu', 'Said by men. Women say ગઈ છું (gai chhu).'], ['હું બીમાર છું', 'hu beemaar chhu'], ['હોસ્પિટલ ક્યાં છે?', 'hospital kyaa chhe?'], ['ઊભા રહો!', 'ubhaa raho!']]
    },
    malayalam: {
      numbers: [['ഒന്ന്', 'onnu'], ['രണ്ട്', 'randu'], ['മൂന്ന്', 'moonnu'], ['നാല്', 'naalu'], ['അഞ്ച്', 'anchu'], ['ആറ്', 'aaru'], ['ഏഴ്', 'ezhu'], ['എട്ട്', 'ettu'], ['ഒമ്പത്', 'ombathu'], ['പത്ത്', 'paththu']],
      food: [['ചോറ്', 'choru'], ['റൊട്ടി', 'rotti'], ['ചായ', 'chaaya'], ['പാൽ', 'paal'], ['പഴം', 'pazham'], ['എരിവ് കുറച്ച് മതി', 'eriv kuracchu mathi'], ['ഞാൻ വെജിറ്റേറിയൻ ആണ്', 'njaan vegetarian aanu'], ['ബിൽ തരൂ', 'bill tharoo']],
      family: [['അമ്മ', 'amma'], ['അച്ഛൻ', 'achhan'], ['ചേട്ടൻ', 'chettan', 'Older brother. Younger brother is അനിയൻ (aniyan).'], ['ചേച്ചി', 'chechi', 'Older sister. Younger sister is അനിയത്തി (aniyathi).'], ['സുഹൃത്ത്', 'suhruthu'], ['മുത്തശ്ശി', 'muthashi']],
      sos: [['രക്ഷിക്കൂ!', 'rakshikkoo!'], ['എനിക്ക് ഡോക്ടറെ വേണം', 'enikku doctore venam'], ['പോലീസിനെ വിളിക്കൂ', 'poleesine vilikkoo'], ['ഞാൻ വഴി തെറ്റിപ്പോയി', 'njaan vazhi thettippoyi'], ['എനിക്ക് സുഖമില്ല', 'enikku sukhamilla'], ['ആശുപത്രി എവിടെയാണ്?', 'aashupathri evideyaanu?'], ['നിൽക്കൂ!', 'nilkkoo!']]
    },
    spanish: {
      numbers: [['uno', 'OO-noh'], ['dos', 'dohs'], ['tres', 'trehs'], ['cuatro', 'KWAH-troh'], ['cinco', 'SEEN-koh'], ['seis', 'sayss'], ['siete', 'SYEH-teh'], ['ocho', 'OH-choh'], ['nueve', 'NWEH-veh'], ['diez', 'dyehs']],
      food: [['El arroz', 'el ah-RROHS'], ['El pan', 'el pahn'], ['El té', 'el teh'], ['La leche', 'lah LEH-cheh'], ['La fruta', 'lah FROO-tah'], ['Sin picante, por favor', 'seen pee-KAHN-teh por fah-VOR'], ['Soy vegetariano', 'soy veh-heh-tah-RYAH-noh', 'Women say vegetariana.'], ['La cuenta, por favor', 'lah KWEN-tah por fah-VOR']],
      family: [['La madre', 'lah MAH-dreh'], ['El padre', 'el PAH-dreh'], ['El hermano', 'el ehr-MAH-noh'], ['La hermana', 'lah ehr-MAH-nah'], ['El amigo', 'el ah-MEE-goh', 'A female friend is la amiga.'], ['La abuela', 'lah ah-BWEH-lah']],
      sos: [['¡Socorro!', 'soh-KOH-rroh'], ['Necesito un médico', 'neh-seh-SEE-toh oon MEH-dee-koh'], ['Llame a la policía', 'YAH-meh ah lah poh-lee-SEE-ah'], ['Estoy perdido', 'ehs-TOY pehr-DEE-doh', 'Women say perdida.'], ['Estoy enfermo', 'ehs-TOY ehn-FEHR-moh', 'Women say enferma.'], ['¿Dónde está el hospital?', 'DOHN-deh ehs-TAH el ohs-pee-TAHL'], ['¡Alto!', 'AHL-toh']]
    },
    french: {
      numbers: [['un', 'uhn'], ['deux', 'duh'], ['trois', 'trwah'], ['quatre', 'KAHTR'], ['cinq', 'sank'], ['six', 'sees'], ['sept', 'set'], ['huit', 'weet'], ['neuf', 'nuhf'], ['dix', 'dees']],
      food: [['Le riz', 'luh ree'], ['Le pain', 'luh pan'], ['Le thé', 'luh tay'], ['Le lait', 'luh leh'], ['Un fruit', 'uhn frwee'], ['Pas épicé, s’il vous plaît', 'pah zay-pee-SAY seel voo PLEH'], ['Je suis végétarien', 'zhuh swee vay-zhay-tah-RYAN', 'Women write végétarienne.'], ['L’addition, s’il vous plaît', 'lah-dee-SYOHN seel voo PLEH']],
      family: [['La mère', 'lah mehr'], ['Le père', 'luh pehr'], ['Le frère', 'luh frehr'], ['La sœur', 'lah suhr'], ['L’ami', 'lah-MEE', 'A female friend is l’amie.'], ['La grand-mère', 'lah grahn-MEHR']],
      sos: [['Au secours !', 'oh suh-KOOR'], ['J’ai besoin d’un médecin', 'zhay buh-ZWAN duhn mayd-SAN'], ['Appelez la police', 'ah-play lah poh-LEES'], ['Je suis perdu', 'zhuh swee pehr-DEW', 'Women write perdue.'], ['Je suis malade', 'zhuh swee mah-LAHD'], ['Où est l’hôpital ?', 'oo eh loh-pee-TAHL'], ['Arrêtez !', 'ah-reh-TAY']]
    },
    german: {
      numbers: [['eins', 'ighns'], ['zwei', 'tsvigh'], ['drei', 'drigh'], ['vier', 'feer'], ['fünf', 'fewnf'], ['sechs', 'zeks'], ['sieben', 'ZEE-ben'], ['acht', 'ahkht'], ['neun', 'noyn'], ['zehn', 'tsayn']],
      food: [['Der Reis', 'dehr righs'], ['Das Brot', 'dahs broht'], ['Der Tee', 'dehr tay'], ['Die Milch', 'dee milkh'], ['Das Obst', 'dahs ohpst'], ['Nicht scharf, bitte', 'nikht sharf BIT-teh'], ['Ich bin Vegetarier', 'ikh bin veh-geh-TAH-ree-er', 'Women say Vegetarierin.'], ['Die Rechnung, bitte', 'dee REKH-noong BIT-teh']],
      family: [['Die Mutter', 'dee MOO-ter'], ['Der Vater', 'dehr FAH-ter'], ['Der Bruder', 'dehr BROO-der'], ['Die Schwester', 'dee SHVES-ter'], ['Der Freund', 'dehr froynt', 'A female friend is die Freundin.'], ['Die Oma', 'dee OH-mah']],
      sos: [['Hilfe!', 'HIL-feh'], ['Ich brauche einen Arzt', 'ikh BROW-kheh IGH-nen artst'], ['Rufen Sie die Polizei', 'ROO-fen zee dee poh-lee-TSIGH'], ['Ich habe mich verlaufen', 'ikh HAH-beh mikh fer-LOW-fen'], ['Ich bin krank', 'ikh bin krahnk'], ['Wo ist das Krankenhaus?', 'voh ist dahs KRAHN-ken-hows'], ['Halt!', 'hahlt']]
    },
    italian: {
      numbers: [['uno', 'OO-noh'], ['due', 'DOO-eh'], ['tre', 'treh'], ['quattro', 'KWAHT-troh'], ['cinque', 'CHEEN-kweh'], ['sei', 'say'], ['sette', 'SET-teh'], ['otto', 'OHT-toh'], ['nove', 'NOH-veh'], ['dieci', 'DYEH-chee']],
      food: [['Il riso', 'eel REE-zoh'], ['Il pane', 'eel PAH-neh'], ['Il tè', 'eel teh'], ['Il latte', 'eel LAHT-teh'], ['La frutta', 'lah FROOT-tah'], ['Non piccante, per favore', 'nohn peek-KAHN-teh pehr fah-VOH-reh'], ['Sono vegetariano', 'SOH-noh veh-jeh-tah-RYAH-noh', 'Women say vegetariana.'], ['Il conto, per favore', 'eel KOHN-toh pehr fah-VOH-reh']],
      family: [['La mamma', 'lah MAHM-mah'], ['Il papà', 'eel pah-PAH'], ['Il fratello', 'eel frah-TEL-loh'], ['La sorella', 'lah soh-REL-lah'], ['L’amico', 'lah-MEE-koh', 'A female friend is l’amica.'], ['La nonna', 'lah NOHN-nah']],
      sos: [['Aiuto!', 'ah-YOO-toh'], ['Ho bisogno di un medico', 'oh bee-ZOH-nyoh dee oon MEH-dee-koh'], ['Chiami la polizia', 'KYAH-mee lah poh-lee-TSEE-ah'], ['Mi sono perso', 'mee SOH-noh PEHR-soh', 'Women say persa.'], ['Sto male', 'stoh MAH-leh'], ['Dov’è l’ospedale?', 'doh-VEH loh-speh-DAH-leh'], ['Fermo!', 'FEHR-moh']]
    },
    portuguese: {
      numbers: [['um', 'oong'], ['dois', 'doysh'], ['três', 'trehsh'], ['quatro', 'KWAH-troo'], ['cinco', 'SEEN-koo'], ['seis', 'saysh'], ['sete', 'SEH-chee'], ['oito', 'OY-too'], ['nove', 'NOH-vee'], ['dez', 'dehs']],
      food: [['O arroz', 'oo ah-HOHS'], ['O pão', 'oo powng'], ['O chá', 'oo shah'], ['O leite', 'oo LAY-chee'], ['A fruta', 'ah FROO-tah'], ['Sem pimenta, por favor', 'sehng pee-MEN-tah poor fah-VOR'], ['Sou vegetariano', 'soh veh-zheh-tah-ree-AH-noo', 'Women say vegetariana.'], ['A conta, por favor', 'ah KOHN-tah poor fah-VOR']],
      family: [['A mãe', 'ah mighng'], ['O pai', 'oo pigh'], ['O irmão', 'oo eer-MOWNG'], ['A irmã', 'ah eer-MAHNG'], ['O amigo', 'oo ah-MEE-goo', 'A female friend is a amiga.'], ['A avó', 'ah ah-VOH']],
      sos: [['Socorro!', 'soh-KOH-hoo'], ['Preciso de um médico', 'preh-SEE-zoo jee oong MEH-jee-koo'], ['Chame a polícia', 'SHAH-mee ah poh-LEE-see-ah'], ['Estou perdido', 'ehs-TOH pehr-JEE-doo', 'Women say perdida.'], ['Estou doente', 'ehs-TOH doh-EN-chee'], ['Onde fica o hospital?', 'OHN-jee FEE-kah oo ohs-pee-TOW'], ['Pare!', 'PAH-ree']]
    },
    russian: {
      numbers: [['один', 'ah-DEEN'], ['два', 'dvah'], ['три', 'tree'], ['четыре', 'chee-TYR-ye'], ['пять', 'pyat'], ['шесть', 'shest'], ['семь', 'syem'], ['восемь', 'VOH-syem'], ['девять', 'DYEH-vyat'], ['десять', 'DYEH-syat']],
      food: [['Рис', 'rees'], ['Хлеб', 'khlyep'], ['Чай', 'chigh'], ['Молоко', 'ma-la-KOH'], ['Фрукты', 'FROOK-ty'], ['Не острое, пожалуйста', 'nye OHST-ra-ye pa-ZHAH-lu-sta'], ['Я вегетарианец', 'ya vye-gye-ta-ree-AH-nyets', 'Women say вегетарианка (vye-gye-ta-ree-AHN-ka).'], ['Счёт, пожалуйста', 'shchyot pa-ZHAH-lu-sta']],
      family: [['Мама', 'MAH-ma'], ['Папа', 'PAH-pa'], ['Брат', 'braht'], ['Сестра', 'syest-RAH'], ['Друг', 'drook', 'A female friend is подруга (pa-DROO-ga).'], ['Бабушка', 'BAH-boosh-ka']],
      sos: [['Помогите!', 'pa-ma-GEE-tye'], ['Мне нужен врач', 'mnye NOO-zhen vrahch'], ['Вызовите полицию', 'VY-za-vee-tye pa-LEE-tsi-yu'], ['Я заблудился', 'ya zab-loo-DEEL-sya', 'Women say заблудилась (zab-loo-DEE-las).'], ['Я болен', 'ya BOH-lyen', 'Women say больна (bal-NAH).'], ['Где больница?', 'gdye bal-NEE-tsa'], ['Стойте!', 'STOY-tye']]
    },
    turkish: {
      numbers: [['bir', 'beer'], ['iki', 'ee-KEE'], ['üç', 'ewch'], ['dört', 'dert'], ['beş', 'besh'], ['altı', 'AHL-tuh'], ['yedi', 'yeh-DEE'], ['sekiz', 'seh-KEEZ'], ['dokuz', 'doh-KOOZ'], ['on', 'ohn']],
      food: [['Pilav', 'pee-LAHV'], ['Ekmek', 'ek-MEK'], ['Çay', 'chigh'], ['Süt', 'sewt'], ['Meyve', 'mey-VEH'], ['Acısız olsun, lütfen', 'ah-juh-SUZ ol-SOON LOOT-fen'], ['Ben vejetaryenim', 'ben veh-zheh-tahr-YEH-neem'], ['Hesap, lütfen', 'heh-SAHP LOOT-fen']],
      family: [['Anne', 'AHN-neh'], ['Baba', 'BAH-bah'], ['Erkek kardeş', 'ehr-KEK kahr-DESH'], ['Kız kardeş', 'kuz kahr-DESH'], ['Arkadaş', 'ahr-kah-DASH'], ['Büyükanne', 'bew-yewk-AHN-neh']],
      sos: [['İmdat!', 'eem-DAHT'], ['Doktora ihtiyacım var', 'dok-toh-RAH eeh-tee-yah-JUHM vahr'], ['Polisi arayın', 'poh-lee-SEE ah-rah-YUHN'], ['Kayboldum', 'kay-bohl-DOOM'], ['Hastayım', 'hahs-tah-YUHM'], ['Hastane nerede?', 'hahs-tah-NEH neh-reh-DEH'], ['Dur!', 'door']]
    },
    japanese: {
      numbers: [['一', 'ichi'], ['二', 'ni'], ['三', 'san'], ['四', 'yon', 'Also read shi, but that sounds like the word for death, so yon is preferred.'], ['五', 'go'], ['六', 'roku'], ['七', 'nana', 'Also read shichi.'], ['八', 'hachi'], ['九', 'kyū', 'Also read ku.'], ['十', 'jū']],
      food: [['ご飯', 'gohan'], ['パン', 'pan'], ['お茶', 'ocha'], ['牛乳', 'gyūnyū'], ['果物', 'kudamono'], ['辛くしないでください', 'karaku shinai de kudasai'], ['私はベジタリアンです', 'watashi wa bejitarian desu'], ['お会計をお願いします', 'okaikei o onegai shimasu']],
      family: [['お母さん', 'okāsan'], ['お父さん', 'otōsan'], ['お兄さん', 'onīsan', 'Older brother. Younger brother is 弟 (otōto).'], ['お姉さん', 'onēsan', 'Older sister. Younger sister is 妹 (imōto).'], ['友達', 'tomodachi'], ['おばあさん', 'obāsan']],
      sos: [['助けて！', 'tasukete!'], ['医者が必要です', 'isha ga hitsuyō desu'], ['警察を呼んでください', 'keisatsu o yonde kudasai'], ['道に迷いました', 'michi ni mayoimashita'], ['具合が悪いです', 'guai ga warui desu'], ['病院はどこですか？', 'byōin wa doko desu ka?'], ['やめて！', 'yamete!']]
    },
    korean: {
      numbers: [['일', 'il', 'Sino-Korean numbers, used for dates, prices and phone numbers.'], ['이', 'i'], ['삼', 'sam'], ['사', 'sa'], ['오', 'o'], ['육', 'yuk'], ['칠', 'chil'], ['팔', 'pal'], ['구', 'gu'], ['십', 'sip']],
      food: [['밥', 'bap'], ['빵', 'ppang'], ['차', 'cha'], ['우유', 'uyu'], ['과일', 'gwail'], ['맵지 않게 해 주세요', 'maepji anke hae juseyo'], ['저는 채식주의자예요', 'jeoneun chaesikjuuijayeyo'], ['계산서 주세요', 'gyesanseo juseyo']],
      family: [['어머니', 'eomeoni'], ['아버지', 'abeoji'], ['형', 'hyeong', 'A man’s older brother. A woman says 오빠 (oppa).'], ['누나', 'nuna', 'A man’s older sister. A woman says 언니 (eonni).'], ['친구', 'chingu'], ['할머니', 'halmeoni']],
      sos: [['도와주세요!', 'dowajuseyo!'], ['의사가 필요해요', 'uisaga piryohaeyo'], ['경찰을 불러 주세요', 'gyeongchareul bulleo juseyo'], ['길을 잃었어요', 'gireul ireosseoyo'], ['몸이 아파요', 'momi apayo'], ['병원이 어디예요?', 'byeongwoni eodiyeyo?'], ['멈추세요!', 'meomchuseyo!']]
    },
    mandarin: {
      numbers: [['一', 'yī'], ['二', 'èr'], ['三', 'sān'], ['四', 'sì'], ['五', 'wǔ'], ['六', 'liù'], ['七', 'qī'], ['八', 'bā'], ['九', 'jiǔ'], ['十', 'shí']],
      food: [['米饭', 'mǐfàn'], ['面包', 'miànbāo'], ['茶', 'chá'], ['牛奶', 'niúnǎi'], ['水果', 'shuǐguǒ'], ['不要辣，谢谢', 'bú yào là, xièxie'], ['我吃素', 'wǒ chīsù'], ['请结账', 'qǐng jiézhàng']],
      family: [['妈妈', 'māma'], ['爸爸', 'bàba'], ['哥哥', 'gēge', 'Older brother. Younger brother is 弟弟 (dìdi).'], ['姐姐', 'jiějie', 'Older sister. Younger sister is 妹妹 (mèimei).'], ['朋友', 'péngyou'], ['奶奶', 'nǎinai', 'Father’s mother. Mother’s mother is 外婆 (wàipó).']],
      sos: [['救命！', 'jiùmìng!'], ['我需要医生', 'wǒ xūyào yīshēng'], ['请叫警察', 'qǐng jiào jǐngchá'], ['我迷路了', 'wǒ mílù le'], ['我不舒服', 'wǒ bù shūfu'], ['医院在哪里？', 'yīyuàn zài nǎlǐ?'], ['停下！', 'tíngxià!']]
    },
    arabic: {
      numbers: [['واحد', 'waahid'], ['اثنان', 'ithnaan'], ['ثلاثة', 'thalaatha'], ['أربعة', 'arba‘a'], ['خمسة', 'khamsa'], ['ستة', 'sitta'], ['سبعة', 'sab‘a'], ['ثمانية', 'thamaaniya'], ['تسعة', 'tis‘a'], ['عشرة', '‘ashara']],
      food: [['أرز', 'aruzz'], ['خبز', 'khubz'], ['شاي', 'shaay'], ['حليب', 'haliib'], ['فاكهة', 'faakiha'], ['بدون حار، من فضلك', 'bidoon haarr, min fadlak', 'To a woman: min fadlik.'], ['أنا نباتي', 'ana nabaati', 'Women say نباتية (nabaatiyya).'], ['الحساب، من فضلك', 'al-hisaab, min fadlak', 'To a woman: min fadlik.']],
      family: [['أم', 'umm'], ['أب', 'ab'], ['أخ', 'akh'], ['أخت', 'ukht'], ['صديق', 'sadiiq', 'A female friend is صديقة (sadiiqa).'], ['جدة', 'jadda']],
      sos: [['النجدة!', 'an-najda!'], ['أحتاج إلى طبيب', 'ahtaaj ilaa tabiib'], ['اتصل بالشرطة', 'ittasil bish-shurta', 'To a woman: ittasili.'], ['لقد ضللت الطريق', 'laqad dalaltu at-tariiq'], ['أنا مريض', 'ana mariid', 'Women say مريضة (mariida).'], ['أين المستشفى؟', 'ayna al-mustashfaa?'], ['قف!', 'qif!']]
    },
    vietnamese: {
      numbers: [['một', 'moht'], ['hai', 'high'], ['ba', 'bah'], ['bốn', 'bohn'], ['năm', 'nahm'], ['sáu', 'sow'], ['bảy', 'bye'], ['tám', 'tahm'], ['chín', 'cheen'], ['mười', 'MUH-ee']],
      food: [['Cơm', 'kuhm'], ['Bánh mì', 'bahn mee'], ['Trà', 'chah'], ['Sữa', 'suh-ah'], ['Trái cây', 'chai kay', 'In the north: hoa quả.'], ['Không cay, làm ơn', 'khohm kigh, lahm UHN'], ['Tôi ăn chay', 'toy an chigh'], ['Tính tiền, làm ơn', 'tinh tyen, lahm UHN']],
      family: [['Mẹ', 'meh'], ['Bố', 'boh'], ['Anh trai', 'ahn chigh'], ['Chị gái', 'chee guy'], ['Bạn', 'bahn'], ['Bà nội', 'bah noy', 'Father’s mother. Mother’s mother is bà ngoại.']],
      sos: [['Cứu tôi!', 'kuh-oo toy'], ['Tôi cần bác sĩ', 'toy kuhn bahk see'], ['Gọi cảnh sát giùm tôi', 'goy kighn saht zoom toy'], ['Tôi bị lạc', 'toy bee lahk'], ['Tôi bị ốm', 'toy bee ohm'], ['Bệnh viện ở đâu?', 'behn vyen uh DOH'], ['Dừng lại!', 'zung lye']]
    },
    indonesian: {
      numbers: [['satu', 'SAH-too'], ['dua', 'DOO-ah'], ['tiga', 'TEE-gah'], ['empat', 'UHM-paht'], ['lima', 'LEE-mah'], ['enam', 'UH-nahm'], ['tujuh', 'TOO-joo'], ['delapan', 'duh-LAH-pahn'], ['sembilan', 'suhm-BEE-lahn'], ['sepuluh', 'suh-POO-looh']],
      food: [['Nasi', 'NAH-see'], ['Roti', 'ROH-tee'], ['Teh', 'teh'], ['Susu', 'SOO-soo'], ['Buah', 'BOO-ah'], ['Jangan pedas, tolong', 'JAH-ngahn PUH-dahs, TOH-long'], ['Saya vegetarian', 'SAH-yah veh-geh-tah-ree-AHN'], ['Minta tagihannya, tolong', 'MIN-tah tah-gee-HAHN-nyah, TOH-long']],
      family: [['Ibu', 'EE-boo'], ['Ayah', 'AH-yah'], ['Saudara laki-laki', 'sow-DAH-rah LAH-kee LAH-kee'], ['Saudara perempuan', 'sow-DAH-rah puh-RUHM-pwahn'], ['Teman', 'TUH-mahn'], ['Nenek', 'NEH-nehk']],
      sos: [['Tolong saya!', 'TOH-long SAH-yah'], ['Saya butuh dokter', 'SAH-yah BOO-tooh DOHK-tuhr'], ['Panggil polisi', 'PAHNG-gil poh-LEE-see'], ['Saya tersesat', 'SAH-yah tuhr-suh-SAHT'], ['Saya sakit', 'SAH-yah SAH-kit'], ['Di mana rumah sakit?', 'dee MAH-nah ROO-mah SAH-kit'], ['Berhenti!', 'buhr-HUHN-tee']]
    }
  };

  /* ---------- attach everything ---------- */
  D.TOPICS = TOPICS;
  D.topicById = {};
  TOPICS.forEach(function (t) {
    D.topicById[t.id] = t;
    D.CONCEPTS[t.id] = t.concepts;
  });
  D.LANGS.forEach(function (l) {
    var pack = PACKS[l.id] || {};
    TOPICS.forEach(function (t) { l[t.id] = pack[t.id] || []; });
  });
  /* Every set name a phrase can come from: easy, hard and each topic. */
  D.SETS = ['easy', 'hard'].concat(TOPICS.map(function (t) { return t.id; }));

  if (typeof module === 'object' && module.exports) { module.exports = D; }
  else { root.BhashaData = D; }
})(typeof self !== 'undefined' ? self : this);
