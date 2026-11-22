/*
 * Bhasha content: languages, phrases, funny scenarios and copy.
 *
 * To add a language, append an object to LANGS (see CONTRIBUTING.md).
 * Each language needs 10 `easy` phrases and 8 `hard` phrases, in the same
 * order as CONCEPTS.easy and CONCEPTS.hard below.
 * A phrase is [native text, pronunciation, optional note].
 */
(function (root) {
  'use strict';

  /* ---------- the ideas every language teaches (English side) ---------- */
  var CONCEPTS = {
    easy: [
      { en: 'Hello', tip: 'Say it to everyone, even the cat. Especially the cat.',
        scenes: ['A very polite parrot lands on your head. Greet it:', 'You meet a friendly cow on your morning walk. Say it to her:'] },
      { en: 'Thank you', tip: 'Works on shopkeepers, teachers and anyone who passes the salt.',
        scenes: ['A stranger runs down the street to return your lost slipper:', 'Your friend hands you the last slice of pizza:'] },
      { en: 'Yes', tip: 'The easiest word to say when someone offers cake.',
        scenes: ['Someone asks: “Would you like a second helping of dessert?”', 'Your friend asks: “Shall we watch one more episode?”'] },
      { en: 'No', tip: 'Handy when someone offers you extra homework.',
        scenes: ['A shopkeeper asks: “Want to buy a talking potato?”', 'Your little brother asks: “Can I borrow your toothbrush?”'] },
      { en: 'Please', tip: 'The magic word. It makes the last biscuit appear.',
        scenes: ['You want the last slice of cake. Ask nicely:', 'You want to borrow your friend’s umbrella in a thunderstorm:'] },
      { en: 'Sorry', tip: 'Say it fast after sitting on someone’s sandwich.',
        scenes: ['You just sat on your friend’s sandwich:', 'You stepped on a cat’s tail and it gave you The Look:'] },
      { en: 'Good morning', tip: 'Say it to the rooster before he says it to you.',
        scenes: ['The sun is up and the rooster is yelling. Greet your family:', 'You walk into class at 8 a.m. looking like a sleepy panda:'] },
      { en: 'Goodbye', tip: 'Wave dramatically for extra points.',
        scenes: ['Your alien friend is flying home in a shiny spaceship:', 'The bus is leaving with your lunchbox inside. Wave it off:'] },
      { en: 'How are you?', tip: 'Ask kindly. The answer is usually “fine”, even after a bad hair day.',
        scenes: ['Your friend stayed up all night watching videos and looks like a zombie:', 'Your teacher walks in with a giant coffee and mismatched socks:'] },
      { en: 'Water', tip: 'The most useful word you will ever shout after a chili.',
        scenes: ['You just bit into a ridiculously spicy chili. Beg for:', 'You are lost in a desert in a very dramatic movie. Whisper:'] }
    ],
    hard: [
      { en: 'What is your name?', tip: 'Ask this first. Every friendship starts here.',
        scenes: ['A talking robot knocks on your door and you have no idea who it is:', 'A mysterious cat in a tiny hat sits down at your table:'] },
      { en: 'Nice to meet you', tip: 'Smile while you say it. It works in every language.',
        scenes: ['You bump into your favourite singer in a supermarket:', 'You are introduced to your friend’s very fancy grandmother:'] },
      { en: 'I don’t understand', tip: 'The most honest sentence in any language. Use it freely.',
        scenes: ['A magician speaks only in riddles for ten whole minutes:', 'Your cousin explains the rules of his invented board game for the fifth time:'] },
      { en: 'Where is the toilet?', tip: 'You will use this one more than you think. Learn it first.',
        scenes: ['You drank three glasses of juice on a very bumpy bus ride:', 'The film is exciting, but your bladder has other plans:'] },
      { en: 'How much is this?', tip: 'Say it with a calm face. Prices hate calm faces.',
        scenes: ['A golden banana sits in a shop window:', 'A shopkeeper holds up one suspiciously shiny pencil:'] },
      { en: 'I am hungry', tip: 'Loud stomach not included, but it helps.',
        scenes: ['Your stomach is growling like a lion at the zoo:', 'It is 3 a.m. and the fridge is calling your name:'] },
      { en: 'Do you speak English?', tip: 'A lifesaver, as long as you smile first.',
        scenes: ['You are lost, your map is upside down and everyone talks very fast:', 'A tour guide waves a tiny flag and speaks only in rhymes:'] },
      { en: 'Delicious!', tip: 'The compliment that makes every cook glow.',
        scenes: ['You taste the best dish of your whole life:', 'Grandma’s cooking has made you forget your own name:'] }
    ]
  };

  /* ---------- the fun ---------- */
  var SILLY = [
    'I am a potato', 'My cat is the boss', 'A dancing chicken', 'Pass me the moon',
    'Banana helicopter', 'Where did my socks go?', 'Free ice cream for everyone',
    'The Wi-Fi is sleeping', 'Seven sleepy penguins', 'I can fly (a little)'
  ];

  var FEEDBACK = {
    right: [
      'Chef’s kiss!', 'Tota is clapping with both wings.', 'Boom! Somebody give you a medal made of cake.',
      'Nailed it. Even the cat is impressed.', 'Your brain is on a roll.', 'Tota does a tiny happy dance.',
      'You are too good at this. Suspicious.', 'Smooth, like butter on warm toast.'
    ],
    wrong: [
      'Oops! Tota covers its eyes.', 'Not this time, but what confidence!', 'Plot twist: it was a different one.',
      'Close, in a very creative way.', 'Even the cat shook its head.', 'Wrong, but wow, what a brave guess.',
      'Tota blames the Wi-Fi. You can too.', 'That answer belongs in a comedy show.'
    ],
    late: [
      'Time’s up! The clock ate your answer.', 'Too slow! A sleepy snail just overtook you.',
      'Tick tock, the parrot is yawning.'
    ]
  };

  var LEVELS = {
    easy: { label: 'Easy', blurb: 'Everyday basics', detail: '10 short phrases. Pronunciation help stays on during the test.' },
    hard: { label: 'Hard', blurb: 'Real sentences', detail: '8 useful sentences. Pronunciation help is hidden until you answer, and a timer keeps you on your toes.' }
  };

  var PURPOSES = [
    { id: 'travel', label: 'Travel', tip: 'Travelling? Learn “Where is the toilet?” first. You will use it more than you think.' },
    { id: 'school', label: 'School or exams', tip: 'Five minutes a day beats one long cram. Short rounds are your friend.' },
    { id: 'work', label: 'Work', tip: 'Please and thank you open many doors at work. Start with those.' },
    { id: 'family', label: 'Family and friends', tip: 'Your people will love every attempt. Mistakes make the best stories.' },
    { id: 'culture', label: 'Movies, music and culture', tip: 'Listen for these phrases in songs and films. You will start spotting them everywhere.' },
    { id: 'fun', label: 'Just for fun', tip: 'The best reason, and the one that lasts. Let’s play.' }
  ];

  /* Languages that share roots. Used to suggest Hard to people who already know a relative. */
  var GROUPS = [
    ['hindi', 'marathi', 'gujarati', 'bengali'],
    ['tamil', 'telugu', 'kannada', 'malayalam'],
    ['spanish', 'french', 'italian', 'portuguese'],
    ['german', 'english']
  ];

  /* ---------- languages ---------- */
  var LANGS = [
    { id: 'hindi', name: 'Hindi', native: 'हिन्दी', lang: 'hi', sp: 'hi-IN', hue: 20, group: 'indian',
      region: 'Northern and central India', script: 'Devanagari script',
      fact: 'Hindi is written in Devanagari, where letters hang from a horizontal line.',
      easy: [['नमस्ते', 'namaste'], ['धन्यवाद', 'dhanyavaad'], ['हाँ', 'haan'], ['नहीं', 'nahin'], ['कृपया', 'kripaya'], ['माफ़ कीजिए', 'maaf kijiye'], ['सुप्रभात', 'suprabhaat'], ['अलविदा', 'alvida'], ['आप कैसे हैं?', 'aap kaise hain?', 'Respectful form.'], ['पानी', 'paani']],
      hard: [['आपका नाम क्या है?', 'aapka naam kya hai?'], ['आपसे मिलकर खुशी हुई', 'aapse milkar khushi hui'], ['मुझे समझ नहीं आया', 'mujhe samajh nahin aaya'], ['शौचालय कहाँ है?', 'shauchaalay kahaan hai?'], ['यह कितने का है?', 'yah kitne ka hai?'], ['मुझे भूख लगी है', 'mujhe bhookh lagi hai'], ['क्या आप अंग्रेज़ी बोलते हैं?', 'kya aap angrezi bolte hain?', 'Asking a woman: बोलती हैं (bolti hain).'], ['बहुत स्वादिष्ट!', 'bahut swaadisht!']] },

    { id: 'tamil', name: 'Tamil', native: 'தமிழ்', lang: 'ta', sp: 'ta-IN', hue: 350, group: 'indian',
      region: 'Tamil Nadu, Puducherry, Sri Lanka, Singapore', script: 'Tamil script',
      fact: 'India recognised Tamil as a classical language in 2004.',
      easy: [['வணக்கம்', 'vanakkam'], ['நன்றி', 'nandri'], ['ஆம்', 'aam'], ['இல்லை', 'illai'], ['தயவு செய்து', 'thayavu seydhu'], ['மன்னிக்கவும்', 'mannikkavum'], ['காலை வணக்கம்', 'kaalai vanakkam'], ['போய் வருகிறேன்', 'poi varugiren', 'Literally: I will go and come back.'], ['நீங்கள் எப்படி இருக்கிறீர்கள்?', 'neengal eppadi irukkireergal?'], ['தண்ணீர்', 'thanneer']],
      hard: [['உங்கள் பெயர் என்ன?', 'ungal peyar enna?'], ['உங்களைச் சந்தித்ததில் மகிழ்ச்சி', 'ungalai sandhithadhil magizhchi'], ['எனக்குப் புரியவில்லை', 'enakku puriyavillai'], ['கழிப்பறை எங்கே இருக்கிறது?', 'kazhippirai enge irukkiradhu?'], ['இது எவ்வளவு?', 'idhu evvalavu?'], ['எனக்குப் பசிக்கிறது', 'enakku pasikkiradhu'], ['உங்களுக்கு ஆங்கிலம் தெரியுமா?', 'ungalukku aangilam theriyumaa?'], ['சுவையாக இருக்கிறது!', 'suvaiyaaga irukkiradhu!']] },

    { id: 'bengali', name: 'Bengali', native: 'বাংলা', lang: 'bn', sp: 'bn-IN', hue: 160, group: 'indian',
      region: 'West Bengal, Tripura, Bangladesh', script: 'Bengali script',
      fact: 'Bengali is the official language of Bangladesh and is widely spoken in West Bengal and Tripura.',
      easy: [['নমস্কার', 'nomoshkar'], ['ধন্যবাদ', 'dhonnobad'], ['হ্যাঁ', 'hyaan'], ['না', 'na'], ['দয়া করে', 'doya kore'], ['দুঃখিত', 'dukkhito'], ['সুপ্রভাত', 'suprobhat'], ['বিদায়', 'biday'], ['আপনি কেমন আছেন?', 'apni kemon achhen?'], ['জল', 'jol']],
      hard: [['আপনার নাম কী?', 'apnar naam ki?'], ['আপনার সঙ্গে দেখা হয়ে ভালো লাগলো', 'apnar songe dekha hoye bhalo laglo'], ['আমি বুঝতে পারছি না', 'ami bujhte parchhi na'], ['টয়লেট কোথায়?', 'toilet kothay?'], ['এটার দাম কত?', 'etar daam koto?'], ['আমার খিদে পেয়েছে', 'amar khide peyechhe'], ['আপনি কি ইংরেজি বলতে পারেন?', 'apni ki ingreji bolte paren?'], ['খুব সুস্বাদু!', 'khub sushwadu!']] },

    { id: 'telugu', name: 'Telugu', native: 'తెలుగు', lang: 'te', sp: 'te-IN', hue: 45, group: 'indian',
      region: 'Andhra Pradesh, Telangana', script: 'Telugu script',
      fact: 'The Telugu and Kannada scripts look alike because they grew from a shared older script.',
      easy: [['నమస్కారం', 'namaskaram'], ['ధన్యవాదాలు', 'dhanyavaadaalu'], ['అవును', 'avunu'], ['కాదు', 'kaadu'], ['దయచేసి', 'dayachesi'], ['క్షమించండి', 'kshaminchandi'], ['శుభోదయం', 'shubhodayam'], ['వెళ్ళొస్తాను', 'vellostanu', 'Literally: I will go and come back.'], ['మీరు ఎలా ఉన్నారు?', 'meeru elaa unnaaru?'], ['నీళ్ళు', 'neellu']],
      hard: [['మీ పేరు ఏమిటి?', 'mee peru emiti?'], ['మిమ్మల్ని కలవడం సంతోషం', 'mimmalni kalavadam santhosham'], ['నాకు అర్థం కావడం లేదు', 'naaku artham kaavadam ledu'], ['టాయిలెట్ ఎక్కడ ఉంది?', 'toilet ekkada undi?'], ['ఇది ఎంత?', 'idi entha?'], ['నాకు ఆకలిగా ఉంది', 'naaku aakaligaa undi'], ['మీకు ఇంగ్లీష్ వచ్చా?', 'meeku english vacchaa?'], ['చాలా రుచిగా ఉంది!', 'chaalaa ruchigaa undi!']] },

    { id: 'marathi', name: 'Marathi', native: 'मराठी', lang: 'mr', sp: 'mr-IN', hue: 285, group: 'indian',
      region: 'Maharashtra', script: 'Devanagari script',
      fact: 'Marathi uses the same Devanagari script as Hindi, with a few extra letters of its own.',
      easy: [['नमस्कार', 'namaskar'], ['धन्यवाद', 'dhanyavaad'], ['हो', 'ho'], ['नाही', 'naahi'], ['कृपया', 'kripayaa'], ['माफ करा', 'maaf karaa'], ['सुप्रभात', 'suprabhaat'], ['येतो', 'yeto', 'Said by men. Women say येते (yete).'], ['तुम्ही कसे आहात?', 'tumhi kase aahat?'], ['पाणी', 'paani']],
      hard: [['तुमचे नाव काय आहे?', 'tumche naav kaay aahe?'], ['तुम्हाला भेटून आनंद झाला', 'tumhaalaa bhetun aanand jhaalaa'], ['मला समजत नाही', 'malaa samajat naahi'], ['टॉयलेट कुठे आहे?', 'toilet kuthe aahe?'], ['याची किंमत किती आहे?', 'yaachi kimmat kiti aahe?'], ['मला भूक लागली आहे', 'malaa bhook laagli aahe'], ['तुम्हाला इंग्रजी येते का?', 'tumhaalaa ingraji yete kaa?'], ['खूप चविष्ट!', 'khoop chavishta!']] },

    { id: 'kannada', name: 'Kannada', native: 'ಕನ್ನಡ', lang: 'kn', sp: 'kn-IN', hue: 75, group: 'indian',
      region: 'Karnataka', script: 'Kannada script',
      fact: 'Kannada is the official language of Karnataka, and its script is closely related to Telugu.',
      easy: [['ನಮಸ್ಕಾರ', 'namaskaara'], ['ಧನ್ಯವಾದಗಳು', 'dhanyavaadagalu'], ['ಹೌದು', 'haudu'], ['ಇಲ್ಲ', 'illa'], ['ದಯವಿಟ್ಟು', 'dayavittu'], ['ಕ್ಷಮಿಸಿ', 'kshamisi'], ['ಶುಭೋದಯ', 'shubhodaya'], ['ಹೋಗಿ ಬರುತ್ತೇನೆ', 'hogi baruttene', 'Literally: I will go and come back.'], ['ನೀವು ಹೇಗಿದ್ದೀರಿ?', 'neevu hegiddiri?'], ['ನೀರು', 'neeru']],
      hard: [['ನಿಮ್ಮ ಹೆಸರು ಏನು?', 'nimma hesaru enu?'], ['ನಿಮ್ಮನ್ನು ಭೇಟಿಯಾಗಿ ಸಂತೋಷವಾಯಿತು', 'nimmannu bhetiyaagi santoshavaayitu'], ['ನನಗೆ ಅರ್ಥವಾಗುತ್ತಿಲ್ಲ', 'nanage arthavaaguttilla'], ['ಶೌಚಾಲಯ ಎಲ್ಲಿದೆ?', 'shauchaalaya ellide?'], ['ಇದರ ಬೆಲೆ ಎಷ್ಟು?', 'idara bele eshtu?'], ['ನನಗೆ ಹಸಿವಾಗಿದೆ', 'nanage hasivaagide'], ['ನಿಮಗೆ ಇಂಗ್ಲಿಷ್ ಬರುತ್ತದೆಯೇ?', 'nimage english baruttadeye?'], ['ತುಂಬಾ ರುಚಿಯಾಗಿದೆ!', 'tumbaa ruchiyaagide!']] },

    { id: 'gujarati', name: 'Gujarati', native: 'ગુજરાતી', lang: 'gu', sp: 'gu-IN', hue: 200, group: 'indian',
      region: 'Gujarat', script: 'Gujarati script',
      fact: 'Gujarati script drops the horizontal top line that Devanagari letters hang from.',
      easy: [['નમસ્તે', 'namaste'], ['આભાર', 'aabhaar'], ['હા', 'haa'], ['ના', 'naa'], ['મહેરબાની કરીને', 'maherbaani karine'], ['માફ કરજો', 'maaf karjo'], ['સુપ્રભાત', 'suprabhaat'], ['આવજો', 'aavjo'], ['તમે કેમ છો?', 'tame kem chho?'], ['પાણી', 'paani']],
      hard: [['તમારું નામ શું છે?', 'tamaarun naam shun chhe?'], ['તમને મળીને આનંદ થયો', 'tamne maline aanand thayo'], ['મને સમજાતું નથી', 'mane samjaatun nathi'], ['શૌચાલય ક્યાં છે?', 'shauchaalay kyaan chhe?'], ['આની કિંમત કેટલી છે?', 'aani kimmat ketli chhe?'], ['મને ભૂખ લાગી છે', 'mane bhookh laagi chhe'], ['તમને અંગ્રેજી આવડે છે?', 'tamne angrezi aavde chhe?'], ['ખૂબ સ્વાદિષ્ટ!', 'khoob svaadisht!']] },

    { id: 'malayalam', name: 'Malayalam', native: 'മലയാളം', lang: 'ml', sp: 'ml-IN', hue: 130, group: 'indian',
      region: 'Kerala', script: 'Malayalam script',
      fact: 'Malayalam is the official language of Kerala. Its script is known for many conjunct letters.',
      easy: [['നമസ്കാരം', 'namaskaaram'], ['നന്ദി', 'nandi'], ['അതെ', 'athe'], ['അല്ല', 'alla'], ['ദയവായി', 'dayavaayi'], ['ക്ഷമിക്കണം', 'kshamikkanam'], ['സുപ്രഭാതം', 'suprabhaatham'], ['പോയി വരാം', 'poyi varaam', 'Literally: I will go and come back.'], ['സുഖമാണോ?', 'sukhamaano?'], ['വെള്ളം', 'vellam']],
      hard: [['നിങ്ങളുടെ പേര് എന്താണ്?', 'ningalude peru enthaanu?'], ['നിങ്ങളെ കണ്ടതിൽ സന്തോഷം', 'ningale kandathil santhosham'], ['എനിക്ക് മനസ്സിലായില്ല', 'enikku manassilaayilla'], ['ടോയ്‌ലറ്റ് എവിടെയാണ്?', 'toilet evideyaanu?'], ['ഇതിന് എത്രയാണ് വില?', 'ithinu ethrayaanu vila?'], ['എനിക്ക് വിശക്കുന്നു', 'enikku vishakkunnu'], ['നിങ്ങൾക്ക് ഇംഗ്ലീഷ് അറിയാമോ?', 'ningalkku english ariyaamo?'], ['വളരെ രുചികരം!', 'valare ruchikaram!']] },

    { id: 'spanish', name: 'Spanish', native: 'Español', lang: 'es', sp: 'es-ES', hue: 8, group: 'intl',
      region: 'Spain, Latin America, parts of the USA', script: 'Latin alphabet',
      fact: 'Spanish questions open with an upside-down ¿ and exclamations with ¡.',
      easy: [['Hola', 'OH-lah'], ['Gracias', 'GRAH-syahs'], ['Sí', 'see'], ['No', 'noh'], ['Por favor', 'por fah-VOR'], ['Lo siento', 'loh SYEN-toh'], ['Buenos días', 'BWEH-nohs DEE-ahs'], ['Adiós', 'ah-DYOHS'], ['¿Cómo estás?', 'KOH-moh es-TAHS', 'Informal. Formal: ¿Cómo está usted?'], ['Agua', 'AH-gwah']],
      hard: [['¿Cómo te llamas?', 'KOH-moh teh YAH-mahs'], ['Mucho gusto', 'MOO-choh GOOS-toh'], ['No entiendo', 'noh en-TYEN-doh'], ['¿Dónde está el baño?', 'DOHN-deh es-TAH el BAH-nyoh'], ['¿Cuánto cuesta esto?', 'KWAHN-toh KWES-tah ES-toh'], ['Tengo hambre', 'TEN-goh AHM-breh'], ['¿Hablas inglés?', 'AH-blahs een-GLES'], ['¡Delicioso!', 'deh-lee-SYOH-soh']] },

    { id: 'french', name: 'French', native: 'Français', lang: 'fr', sp: 'fr-FR', hue: 225, group: 'intl',
      region: 'France, Canada, Belgium, West and Central Africa', script: 'Latin alphabet',
      fact: 'Final consonants in French are often silent, so spelling and sound can differ a lot.',
      easy: [['Bonjour', 'bohn-ZHOOR'], ['Merci', 'mehr-SEE'], ['Oui', 'wee'], ['Non', 'nohn'], ['S’il vous plaît', 'seel voo PLEH'], ['Désolé', 'day-zoh-LAY', 'Women write désolée.'], ['Bon matin', 'bohn mah-TAN', 'Quebec French. In France, Bonjour is used all morning.'], ['Au revoir', 'oh ruh-VWAHR'], ['Comment allez-vous ?', 'koh-mohn tah-lay VOO'], ['Eau', 'oh']],
      hard: [['Comment vous appelez-vous ?', 'koh-mohn voo zah-play VOO', 'Formal. Friends say: Comment tu t’appelles ?'], ['Enchanté', 'ahn-shahn-TAY', 'Women write enchantée.'], ['Je ne comprends pas', 'zhuh nuh kohm-PRAHN pah'], ['Où sont les toilettes ?', 'oo sohn lay twah-LET'], ['C’est combien ?', 'seh kohm-BYAN'], ['J’ai faim', 'zhay FAN'], ['Vous parlez anglais ?', 'voo par-LAY ahn-GLAY'], ['Délicieux !', 'day-lee-SYUH']] },

    { id: 'german', name: 'German', native: 'Deutsch', lang: 'de', sp: 'de-DE', hue: 95, group: 'intl',
      region: 'Germany, Austria, Switzerland', script: 'Latin alphabet',
      fact: 'Every noun in German is capitalised, and each has a gender: der, die or das.',
      easy: [['Hallo', 'HAH-loh'], ['Danke', 'DAHN-kuh'], ['Ja', 'yah'], ['Nein', 'nine'], ['Bitte', 'BIT-tuh'], ['Entschuldigung', 'ent-SHUL-dee-goong'], ['Guten Morgen', 'GOO-ten MOR-gen'], ['Auf Wiedersehen', 'owf VEE-der-zay-en'], ['Wie geht es Ihnen?', 'vee gayt es EE-nen', 'Formal. Friends say: Wie geht’s?'], ['Wasser', 'VAH-ser']],
      hard: [['Wie heißt du?', 'vee HIGHST doo', 'Formal: Wie heißen Sie?'], ['Freut mich', 'froyt MIKH'], ['Ich verstehe nicht', 'ikh fer-SHTAY-uh nikht'], ['Wo ist die Toilette?', 'voh ist dee toy-LET-tuh'], ['Was kostet das?', 'vahs KOS-tet dahs'], ['Ich habe Hunger', 'ikh HAH-buh HOONG-er'], ['Sprichst du Englisch?', 'shprikhst doo ENG-lish', 'Formal: Sprechen Sie Englisch?'], ['Lecker!', 'LEK-er']] },

    { id: 'japanese', name: 'Japanese', native: '日本語', lang: 'ja', sp: 'ja-JP', hue: 330, group: 'intl',
      region: 'Japan', script: 'Kanji, hiragana and katakana',
      fact: 'Japanese is written with three scripts at once: kanji, hiragana and katakana.',
      easy: [['こんにちは', 'konnichiwa', 'Used during the day.'], ['ありがとう', 'arigatō'], ['はい', 'hai'], ['いいえ', 'iie'], ['お願いします', 'onegai shimasu', 'Used when asking for something.'], ['ごめんなさい', 'gomen nasai'], ['おはようございます', 'ohayō gozaimasu'], ['さようなら', 'sayōnara'], ['お元気ですか？', 'ogenki desu ka?'], ['水', 'mizu']],
      hard: [['お名前は何ですか？', 'onamae wa nan desu ka?'], ['はじめまして', 'hajimemashite'], ['わかりません', 'wakarimasen'], ['トイレはどこですか？', 'toire wa doko desu ka?'], ['いくらですか？', 'ikura desu ka?'], ['お腹がすきました', 'onaka ga sukimashita'], ['英語を話せますか？', 'eigo o hanasemasu ka?'], ['おいしい！', 'oishii!']] },

    { id: 'korean', name: 'Korean', native: '한국어', lang: 'ko', sp: 'ko-KR', hue: 180, group: 'intl',
      region: 'South Korea, North Korea', script: 'Hangul',
      fact: 'Hangul was created in the 15th century under King Sejong, and its letters are built from simple shapes.',
      easy: [['안녕하세요', 'annyeonghaseyo'], ['감사합니다', 'gamsahamnida'], ['네', 'ne'], ['아니요', 'aniyo'], ['부탁합니다', 'butakhamnida', 'Used when asking for something.'], ['죄송합니다', 'joesonghamnida'], ['좋은 아침', 'joeun achim'], ['안녕히 가세요', 'annyeonghi gaseyo', 'Said to the person who is leaving.'], ['잘 지내세요?', 'jal jinaeseyo?'], ['물', 'mul']],
      hard: [['이름이 뭐예요?', 'ireumi mwoyeyo?'], ['만나서 반갑습니다', 'mannaseo bangapseumnida'], ['이해가 안 돼요', 'ihaega an dwaeyo'], ['화장실이 어디예요?', 'hwajangsiri eodiyeyo?'], ['얼마예요?', 'eolmayeyo?'], ['배고파요', 'baegopayo'], ['영어 할 수 있어요?', 'yeongeo hal su isseoyo?'], ['맛있어요!', 'masisseoyo!']] },

    { id: 'mandarin', name: 'Mandarin Chinese', native: '普通话', lang: 'zh', sp: 'zh-CN', hue: 55, group: 'intl',
      region: 'China, Taiwan, Singapore', script: 'Chinese characters (simplified)',
      fact: 'Mandarin has four main tones plus a neutral one. The mark above each vowel shows the tone.',
      easy: [['你好', 'nǐ hǎo'], ['谢谢', 'xièxie'], ['是', 'shì'], ['不是', 'bú shì', 'Literally: is not.'], ['请', 'qǐng'], ['对不起', 'duìbuqǐ'], ['早上好', 'zǎoshang hǎo'], ['再见', 'zàijiàn'], ['你好吗？', 'nǐ hǎo ma?'], ['水', 'shuǐ']],
      hard: [['你叫什么名字？', 'nǐ jiào shénme míngzi?'], ['很高兴认识你', 'hěn gāoxìng rènshi nǐ'], ['我不明白', 'wǒ bù míngbai'], ['厕所在哪里？', 'cèsuǒ zài nǎlǐ?'], ['这个多少钱？', 'zhège duōshao qián?'], ['我饿了', 'wǒ è le'], ['你会说英语吗？', 'nǐ huì shuō yīngyǔ ma?'], ['好吃！', 'hǎochī!']] },

    { id: 'arabic', name: 'Arabic', native: 'العربية', lang: 'ar', sp: 'ar-SA', hue: 255, group: 'intl',
      region: 'Middle East and North Africa', script: 'Arabic script, right to left',
      fact: 'Arabic is written right to left, and short vowels are usually left out of the text.',
      easy: [['مرحبا', 'marhaban'], ['شكرا', 'shukran'], ['نعم', 'na‘am'], ['لا', 'laa'], ['من فضلك', 'min fadlak', 'To a woman: min fadlik.'], ['آسف', 'aasif', 'Said by men. Women say آسفة (aasifa).'], ['صباح الخير', 'sabaah al-khayr'], ['مع السلامة', 'ma‘a as-salaama'], ['كيف حالك؟', 'kayfa haalak?', 'To a woman: kayfa haalik.'], ['ماء', 'maa’']],
      hard: [['ما اسمك؟', 'ma ismuk?', 'To a woman: ما اسمكِ؟ (ma ismik?)'], ['تشرفنا', 'tasharrafna'], ['لا أفهم', 'laa afham'], ['أين الحمام؟', 'ayna al-hammaam?', 'Literally: Where is the bathroom?'], ['بكم هذا؟', 'bikam haadha?'], ['أنا جائع', 'ana jaa’i‘', 'Women say جائعة (jaa’i‘a).'], ['هل تتكلم الإنجليزية؟', 'hal tatakallam al-ingliiziyya?', 'To a woman: tatakallamiin.'], ['لذيذ!', 'ladhiidh!']] },

    { id: 'italian', name: 'Italian', native: 'Italiano', lang: 'it', sp: 'it-IT', hue: 118, group: 'intl',
      region: 'Italy, Switzerland, San Marino', script: 'Latin alphabet',
      fact: 'Italian grew out of Latin, and most Italian words end in a vowel.',
      easy: [['Ciao', 'chow', 'Friendly hello. It also works for goodbye.'], ['Grazie', 'GRAH-tsyeh'], ['Sì', 'see'], ['No', 'noh'], ['Per favore', 'pehr fah-VOH-reh'], ['Mi dispiace', 'mee dees-PYAH-cheh'], ['Buongiorno', 'bwon-JOR-noh'], ['Arrivederci', 'ar-ree-veh-DEHR-chee'], ['Come stai?', 'KOH-meh STAH-ee', 'Informal. Formal: Come sta?'], ['Acqua', 'AHK-kwah']],
      hard: [['Come ti chiami?', 'KOH-meh tee KYAH-mee'], ['Piacere', 'pyah-CHEH-reh'], ['Non capisco', 'nohn kah-PEE-skoh'], ['Dov’è il bagno?', 'doh-VEH eel BAH-nyoh'], ['Quanto costa questo?', 'KWAHN-toh KOH-stah KWEH-stoh'], ['Ho fame', 'oh FAH-meh'], ['Parli inglese?', 'PAR-lee een-GLEH-zeh', 'Formal: Parla inglese?'], ['Delizioso!', 'deh-lee-TSYOH-zoh']] },

    { id: 'portuguese', name: 'Portuguese', native: 'Português', lang: 'pt', sp: 'pt-BR', hue: 38, group: 'intl',
      region: 'Brazil, Portugal, Angola, Mozambique', script: 'Latin alphabet',
      fact: 'Portuguese has nasal vowels, shown by the tilde in words like “não”.',
      easy: [['Olá', 'oh-LAH'], ['Obrigado', 'oh-bree-GAH-doo', 'Women say obrigada.'], ['Sim', 'seeng'], ['Não', 'nowng'], ['Por favor', 'poor fah-VOR'], ['Desculpe', 'dehs-KOOL-peh'], ['Bom dia', 'bohm JEE-ah', 'In Portugal it sounds like bohm DEE-ah.'], ['Adeus', 'ah-DEH-oos', 'Casual: tchau.'], ['Como vai?', 'KOH-moo vy'], ['Água', 'AH-gwah']],
      hard: [['Qual é o seu nome?', 'kwahl eh oo SEH-oo NOH-meh'], ['Muito prazer', 'MWEEN-too prah-ZEHR'], ['Não entendo', 'nowng en-TEN-doo'], ['Onde fica o banheiro?', 'OHN-jee FEE-kah oo bah-NYAY-roo', 'In Portugal: casa de banho.'], ['Quanto custa isto?', 'KWAHN-too KOOS-tah EES-too'], ['Estou com fome', 'ehs-TOH kohm FOH-meh'], ['Você fala inglês?', 'voh-SAY FAH-lah een-GLEHS'], ['Delicioso!', 'deh-lee-SYOH-zoo']] },

    { id: 'russian', name: 'Russian', native: 'Русский', lang: 'ru', sp: 'ru-RU', hue: 238, group: 'intl',
      region: 'Russia, Belarus, Kazakhstan and nearby countries', script: 'Cyrillic alphabet',
      fact: 'Russian is written in the Cyrillic alphabet, which has 33 letters.',
      easy: [['Привет', 'pree-VYET', 'Informal. Formal: Здравствуйте (ZDRAHST-vooy-tye).'], ['Спасибо', 'spa-SEE-ba'], ['Да', 'da'], ['Нет', 'nyet'], ['Пожалуйста', 'pa-ZHAL-sta'], ['Извините', 'eez-vee-NEE-tye'], ['Доброе утро', 'DOH-bra-ye OO-tra'], ['До свидания', 'da svee-DAH-nya'], ['Как дела?', 'kak dee-LAH'], ['Вода', 'va-DAH']],
      hard: [['Как вас зовут?', 'kak vas za-VOOT'], ['Приятно познакомиться', 'pree-YAHT-na paz-na-KOH-meet-sya'], ['Я не понимаю', 'ya nye pa-nee-MAH-yu'], ['Где туалет?', 'gdye too-a-LYET'], ['Сколько это стоит?', 'SKOL-ka E-ta STOH-eet'], ['Я голоден', 'ya GOH-la-den', 'Women say Я голодна (ya ga-lad-NAH).'], ['Вы говорите по-английски?', 'vy ga-va-REE-tye pa an-GLEE-skee'], ['Вкусно!', 'VKOOS-na']] },

    { id: 'turkish', name: 'Turkish', native: 'Türkçe', lang: 'tr', sp: 'tr-TR', hue: 315, group: 'intl',
      region: 'Türkiye, Northern Cyprus', script: 'Latin alphabet',
      fact: 'Turkish has both a dotted i and a dotless ı, and they are different letters.',
      easy: [['Merhaba', 'MEHR-hah-bah'], ['Teşekkür ederim', 'teh-shek-KOOR eh-deh-REEM'], ['Evet', 'eh-VET'], ['Hayır', 'hah-YUR'], ['Lütfen', 'LOOT-fen'], ['Özür dilerim', 'er-ZOOR dee-leh-REEM'], ['Günaydın', 'goo-nai-DUN'], ['Hoşça kal', 'HOHSH-chah kahl', 'Said to someone staying. To someone leaving: Güle güle.'], ['Nasılsın?', 'NAH-sul-sun', 'Informal. Formal: Nasılsınız?'], ['Su', 'soo']],
      hard: [['Adınız nedir?', 'AH-dun-uz neh-DEER'], ['Memnun oldum', 'mem-NOON ol-DOOM'], ['Anlamıyorum', 'ahn-lah-muh-YOH-room'], ['Tuvalet nerede?', 'too-vah-LET neh-reh-DEH'], ['Bu ne kadar?', 'boo neh kah-DAR'], ['Acıktım', 'ah-juk-TUM'], ['İngilizce biliyor musunuz?', 'ing-ee-LEEZ-jeh bee-lee-YOR moo-soo-NOOZ'], ['Çok lezzetli!', 'chok lez-zet-LEE']] },

    { id: 'indonesian', name: 'Indonesian', native: 'Bahasa Indonesia', lang: 'id', sp: 'id-ID', hue: 170, group: 'intl',
      region: 'Indonesia', script: 'Latin alphabet',
      fact: 'Indonesian has no verb tenses and no grammatical gender, which makes it friendly for beginners.',
      easy: [['Halo', 'HAH-loh'], ['Terima kasih', 'teh-REE-mah KAH-see'], ['Ya', 'yah'], ['Tidak', 'TEE-dahk'], ['Tolong', 'TOH-long', 'Used when asking for help. When offering something, say Silakan.'], ['Maaf', 'MAH-af'], ['Selamat pagi', 'seh-LAH-maht PAH-gee'], ['Selamat tinggal', 'seh-LAH-maht TING-gahl', 'Said by the person leaving. The person staying says Selamat jalan.'], ['Apa kabar?', 'AH-pah KAH-bar'], ['Air', 'AH-eer']],
      hard: [['Siapa namamu?', 'see-AH-pah nah-MAH-moo'], ['Senang bertemu dengan Anda', 'seh-NAHNG ber-TEH-moo DEH-ngahn AHN-dah'], ['Saya tidak mengerti', 'SAH-yah TEE-dahk meng-UR-tee'], ['Di mana toilet?', 'dee MAH-nah TOY-let'], ['Berapa harganya?', 'beh-RAH-pah har-GAH-nyah'], ['Saya lapar', 'SAH-yah LAH-par'], ['Bisa bahasa Inggris?', 'BEE-sah bah-HAH-sah ING-grees'], ['Enak sekali!', 'AH-nahk seh-KAH-lee']] },

    { id: 'vietnamese', name: 'Vietnamese', native: 'Tiếng Việt', lang: 'vi', sp: 'vi-VN', hue: 300, group: 'intl',
      region: 'Vietnam', script: 'Latin alphabet with tone marks',
      fact: 'Northern Vietnamese has six tones, shown by the marks above and below the vowels.',
      easy: [['Xin chào', 'seen chow'], ['Cảm ơn', 'kahm UHN'], ['Vâng', 'vuhng', 'A polite yes.'], ['Không', 'khohm'], ['Làm ơn', 'lahm UHN'], ['Xin lỗi', 'seen LOY'], ['Chào buổi sáng', 'chow BWOY SAHNG'], ['Tạm biệt', 'tahm BYET'], ['Bạn khỏe không?', 'bahn KWEH khohm'], ['Nước', 'nuhk']],
      hard: [['Bạn tên là gì?', 'bahn ten lah ZEE'], ['Rất vui được gặp bạn', 'rut vooy duhk gahp bahn'], ['Tôi không hiểu', 'toy khohm HYEW'], ['Nhà vệ sinh ở đâu?', 'nyah vay sinh uh DOH'], ['Cái này giá bao nhiêu?', 'kai nay zah bow NYEW'], ['Tôi đói', 'toy DOY'], ['Bạn có nói tiếng Anh không?', 'bahn koh noy tyeng ahn khohm'], ['Ngon quá!', 'ngon kwah']] }
  ];

  var byId = {};
  LANGS.forEach(function (l) { byId[l.id] = l; });

  var KNOWN_CHOICES = [{ id: 'english', name: 'English' }].concat(
    LANGS.map(function (l) { return { id: l.id, name: l.name }; })
  );

  function nameOf(id) {
    if (id === 'english') return 'English';
    return byId[id] ? byId[id].name : id;
  }

  /* Which of the languages the person already knows are close relatives of `learnId`? */
  function relatedKnown(learnId, knownIds) {
    var out = [];
    GROUPS.forEach(function (g) {
      if (g.indexOf(learnId) === -1) return;
      g.forEach(function (id) {
        if (id !== learnId && knownIds.indexOf(id) !== -1 && out.indexOf(id) === -1) out.push(id);
      });
    });
    return out;
  }

  var api = {
    CONCEPTS: CONCEPTS, SILLY: SILLY, FEEDBACK: FEEDBACK, LEVELS: LEVELS, PURPOSES: PURPOSES,
    GROUPS: GROUPS, LANGS: LANGS, byId: byId, KNOWN_CHOICES: KNOWN_CHOICES,
    nameOf: nameOf, relatedKnown: relatedKnown
  };

  if (typeof module === 'object' && module.exports) { module.exports = api; }
  else { root.BhashaData = api; }
})(typeof self !== 'undefined' ? self : this);
