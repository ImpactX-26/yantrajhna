import { readDocumentProgress, writeDocumentProgress } from "./progress-store.js";
import { evaluateSchemeEligibility } from "./eligibility.js";

const words = {
  en: {
    skip: "Skip to content", navSchemes: "Schemes", navAssistant: "Ask Saathi", navHelp: "Get help", languageLabel: "Choose language", myProfile: "My profile",
    eyebrow: "YOUR GOVERNMENT BENEFITS COMPANION", welcomeTitle: "Your voice. Your language. Your welfare.", welcomeSubtitle: "Find government schemes, understand eligibility, prepare documents, and learn how to apply through simple conversation.",
    searchLabel: "Search by scheme, benefit or need", searchPlaceholder: "Try “support for farmers”", searchButton: "Search", popular: "Popular:", photoCaption: "In-person help is available at local service centres.",
    catalogEyebrow: "EXPLORE SUPPORT", catalogTitle: "Schemes for every chapter", allSchemes: "All schemes", agriculture: "Agriculture", education: "Education", housing: "Housing", health: "Health", employment: "Employment", womenFamily: "Women & family", senior: "Senior citizens", finance: "Financial help", loading: "Loading schemes…",
    noResults: "No schemes found", tryAnother: "Try another search or choose a different category.", clearSearch: "Clear search", saathiOnline: "SAATHI IS HERE", askTitle: "What can I help you find?",
    assistantIntro: "Tell me what you need help with. I can look up schemes and explain the next steps.", promptFarmer: "I'm a farmer", promptLpg: "I need an LPG connection", askPlaceholderLabel: "Ask SarkariSaathi a question", askPlaceholder: "Type your question…",
    privacyNote: "No ID numbers, please.", assistantDisclaimer: "Answers are a guide. The official department decides eligibility.", quickCheck: "QUICK CHECK", checkTitle: "See what may fit you", checkText: "A few details can narrow down your options.", checkButton: "Check eligibility",
    catalogNote: "Scheme information is from official sources. Please confirm current rules before applying.", offlineEyebrow: "PREFER IN-PERSON HELP?", offlineTitle: "Find a Common Service Centre", offlineText: "A nearby CSC can help with online forms and document checks.",
    locationLabel: "City, district or PIN code", locationPlaceholder: "City, district or PIN code", findCsc: "Find a CSC", footerNote: "SarkariSaathi is an independent guide and is not a government website.", indiaPortal: "National Portal of India ↗",
    clear: "Clear", compareNow: "Compare schemes", profileEyebrow: "YOUR DETAILS", profileDialogTitle: "A clearer eligibility check", profileDialogIntro: "Share only what you’re comfortable sharing. These answers stay in this browser session and are not saved.",
    ageLabel: "Age", genderLabel: "Applicant", preferNot: "Choose or skip", woman: "Woman", man: "Man", other: "Another identity", occupationLabel: "Main occupation", choose: "Choose or skip", farmer: "Farmer", otherOccupation: "Other",
    landLabel: "Does your farmer family hold cultivable land?", poorLabel: "Does your household meet the PMUY poor-household declaration?", lpgLabel: "Is an LPG connection already registered in your household?", taxLabel: "Did anyone in the farmer family pay income tax last year?",
    employmentLabel: "Government employment in the farmer family", none: "None", regularEmployee: "Serving or retired (except Group D/MTS)", groupD: "Group D / MTS", pensionLabel: "Covered pension of ₹10,000/month or more?",
    professionalLabel: "Practising registered professional in the farmer family?", institutionalLabel: "Is the landholder an institution?", listedLabel: "Is your household already listed for PM-JAY?", stateLabel: "State or Union Territory", optional: "Optional",
    yes: "Yes", no: "No", cancel: "Cancel", runCheck: "Check my options", benefitHeading: "What it offers", eligibilityHeading: "Who may qualify", documentsHeading: "Documents to prepare", stepsHeading: "How to apply", contactHeading: "Get support", officialSource: "Official scheme page", sourceLink: "Source for scheme details",
    schemeCount: "schemes", readAnswer: "Read answer aloud", compare: "Compare", removeCompare: "Remove from comparison", saveScheme: "Save scheme", unsaveScheme: "Remove saved scheme", possibleMatch: "Possible match", unlikely: "Unlikely match", needsInformation: "More information needed", needsConfirmation: "Confirm with the scheme", savedEmpty: "You haven't saved any schemes yet.",
    resultMatch: "Your answers match the listed screening criteria. Final eligibility is decided by the scheme authority.", resultUnlikely: "One or more answers may not fit the listed rules. Check the official page for exceptions and final criteria.", resultNeeds: "Answer a few more questions for a useful screening.", resultConfirm: "This prototype cannot check every route into this scheme. Confirm directly with the scheme authority.",
    assistantError: "I couldn't reach the assistant just now. The scheme catalog and checker are still available.", demoAnswer: "I found scheme records that may fit your question. Open one below for the criteria, documents, and official application page.", mapsOpened: "Opening Google Maps in a new tab.", compareLimit: "Compare up to three schemes at a time.", compareHeading: "Compare schemes", categoryLabel: "Category", benefitLabel: "Benefit", whoLabel: "Eligibility", methodLabel: "Application", complexityLabel: "Process", close: "Close", modeDemo: "Catalog assistant", modeClaude: "Claude assistant",
    photoAlt: "A village service-centre operator helping a resident with online government services", searching: "Searching the scheme catalog…", details: "View details", possibleScreening: "Screening result", moreInfo: "Details to confirm", listSummary: "Based on your answers", sourceCaution: "This is a first-pass guide, not an official decision.", savedOnly: "Saved schemes", showAll: "Show all schemes", noSaved: "No saved schemes yet", speechUnsupported: "Voice input isn't available in this browser.", voiceError: "Voice input couldn't start. Check microphone access and try again.", profileSaved: "Your answers are available for this browser session only.", chatContext: "This reply uses the scheme catalog. Confirm important details with the official department.", speakWith: "Speak with SarkariSaathi", typeInstead: "Type instead", needEyebrow: "START WITH YOUR NEED", needTitle: "What do you need help with?", tryDemo: "Try a demo:", demoFarmer: "Farmer", demoStudent: "Student", demoSenior: "Senior citizen", clearConversation: "Clear conversation", journeyEyebrow: "YOUR SEARCH", dashboardTitle: "Your support dashboard", newSearch: "Start new search", myNeed: "My need", relevantSchemes: "Relevant schemes", eligibility: "Eligibility", documentsReady: "Documents identified", nextStep: "Next step", noIdNumbers: "Only share what is needed. Never share Aadhaar numbers here.", demoLabel: "Sample data"
  },
  hi: {
    skip: "मुख्य सामग्री पर जाएँ", navSchemes: "योजनाएँ", navAssistant: "साथी से पूछें", navHelp: "सहायता पाएँ", languageLabel: "भाषा चुनें", myProfile: "मेरी जानकारी",
    eyebrow: "सरकारी लाभों के लिए आपका साथी", welcomeTitle: "आपकी आवाज़। आपकी भाषा। आपका कल्याण।", welcomeSubtitle: "सरकारी योजनाएँ खोजें, पात्रता समझें, दस्तावेज़ तैयार करें और आवेदन के अगले कदम जानें।",
    searchLabel: "योजना, लाभ या ज़रूरत खोजें", searchPlaceholder: "जैसे “किसानों के लिए सहायता”", searchButton: "खोजें", popular: "लोकप्रिय:", photoCaption: "स्थानीय सेवा केंद्रों पर आमने-सामने मदद मिलती है।",
    catalogEyebrow: "सहायता खोजें", catalogTitle: "हर ज़रूरत के लिए योजनाएँ", allSchemes: "सभी योजनाएँ", agriculture: "कृषि", education: "शिक्षा", housing: "आवास", health: "स्वास्थ्य", employment: "रोज़गार", womenFamily: "महिला और परिवार", senior: "वरिष्ठ नागरिक", finance: "वित्तीय सहायता", loading: "योजनाएँ लोड हो रही हैं…",
    noResults: "कोई योजना नहीं मिली", tryAnother: "दूसरी खोज करें या कोई और श्रेणी चुनें।", clearSearch: "खोज हटाएँ", saathiOnline: "साथी आपकी मदद के लिए है", askTitle: "आप क्या जानना चाहते हैं?",
    assistantIntro: "बताएँ कि आपको किस मदद की ज़रूरत है। मैं योजनाएँ खोजकर अगले कदम समझा सकता हूँ।", promptFarmer: "मैं किसान हूँ", promptLpg: "मुझे एलपीजी कनेक्शन चाहिए", askPlaceholderLabel: "सरकारी साथी से सवाल पूछें", askPlaceholder: "अपना सवाल लिखें…",
    privacyNote: "पहचान संख्या साझा न करें।", assistantDisclaimer: "यह जानकारी मार्गदर्शन के लिए है। पात्रता का निर्णय संबंधित विभाग करता है।", quickCheck: "त्वरित जाँच", checkTitle: "देखें कौन-सी योजना आपके लिए हो सकती है", checkText: "कुछ जानकारी से विकल्प सीमित किए जा सकते हैं।", checkButton: "पात्रता जाँचें",
    catalogNote: "योजना की जानकारी आधिकारिक स्रोतों से है। आवेदन से पहले मौजूदा नियम जाँचें।", offlineEyebrow: "सामने से मदद चाहिए?", offlineTitle: "कॉमन सर्विस सेंटर खोजें", offlineText: "नज़दीकी CSC ऑनलाइन फ़ॉर्म और दस्तावेज़ जाँचने में मदद कर सकता है।",
    locationLabel: "शहर, ज़िला या पिन कोड", locationPlaceholder: "शहर, ज़िला या पिन कोड", findCsc: "CSC खोजें", footerNote: "सरकारी साथी एक स्वतंत्र मार्गदर्शक है, सरकारी वेबसाइट नहीं।", indiaPortal: "भारत का राष्ट्रीय पोर्टल ↗",
    clear: "हटाएँ", compareNow: "योजनाओं की तुलना", profileEyebrow: "आपकी जानकारी", profileDialogTitle: "पात्रता की बेहतर जाँच", profileDialogIntro: "केवल वही जानकारी दें जिसे साझा करने में आप सहज हों। जवाब इस ब्राउज़र सत्र में रहेंगे और सहेजे नहीं जाएँगे।",
    ageLabel: "उम्र", genderLabel: "आवेदक", preferNot: "चुनें या छोड़ें", woman: "महिला", man: "पुरुष", other: "अन्य पहचान", occupationLabel: "मुख्य व्यवसाय", choose: "चुनें या छोड़ें", farmer: "किसान", otherOccupation: "अन्य",
    landLabel: "क्या किसान परिवार के पास कृषि योग्य भूमि है?", poorLabel: "क्या परिवार उज्ज्वला की गरीब-परिवार घोषणा की शर्तें पूरी करता है?", lpgLabel: "क्या परिवार में पहले से LPG कनेक्शन है?", taxLabel: "क्या किसान परिवार के किसी सदस्य ने पिछले वर्ष आयकर दिया?",
    employmentLabel: "किसान परिवार में सरकारी नौकरी", none: "कोई नहीं", regularEmployee: "सेवारत या सेवानिवृत्त (ग्रुप D/MTS को छोड़कर)", groupD: "ग्रुप D / MTS", pensionLabel: "क्या पात्र पेंशन ₹10,000/माह या अधिक है?",
    professionalLabel: "क्या किसान परिवार में कोई पंजीकृत पेशेवर अभ्यास करता है?", institutionalLabel: "क्या भूमि का मालिक कोई संस्था है?", listedLabel: "क्या परिवार PM-JAY सूची में है?", stateLabel: "राज्य या केंद्र शासित प्रदेश", optional: "वैकल्पिक",
    yes: "हाँ", no: "नहीं", cancel: "रद्द करें", runCheck: "मेरे विकल्प जाँचें", benefitHeading: "लाभ", eligibilityHeading: "कौन पात्र हो सकता है", documentsHeading: "तैयार रखने वाले दस्तावेज़", stepsHeading: "आवेदन कैसे करें", contactHeading: "सहायता पाएँ", officialSource: "आधिकारिक योजना पृष्ठ", sourceLink: "योजना विवरण का स्रोत",
    schemeCount: "योजनाएँ", readAnswer: "जवाब सुनें", compare: "तुलना करें", removeCompare: "तुलना से हटाएँ", saveScheme: "योजना सहेजें", unsaveScheme: "सहेजी योजना हटाएँ", possibleMatch: "संभावित मेल", unlikely: "मेल की संभावना कम", needsInformation: "और जानकारी चाहिए", needsConfirmation: "योजना से पुष्टि करें", savedEmpty: "आपने अभी कोई योजना नहीं सहेजी है।",
    resultMatch: "आपके जवाब सूचीबद्ध जाँच मानदंडों से मेल खाते हैं। अंतिम पात्रता योजना प्राधिकरण तय करता है।", resultUnlikely: "एक या अधिक जवाब सूचीबद्ध नियमों से मेल नहीं खा सकते। अपवादों और अंतिम मानदंडों के लिए आधिकारिक पृष्ठ देखें।", resultNeeds: "उपयोगी जाँच के लिए कुछ और सवालों के जवाब दें।", resultConfirm: "यह प्रोटोटाइप इस योजना के सभी पात्रता मार्ग नहीं जाँच सकता। योजना प्राधिकरण से पुष्टि करें।",
    assistantError: "अभी सहायक से संपर्क नहीं हो पाया। योजना सूची और जाँच उपलब्ध हैं।", demoAnswer: "आपके सवाल से मेल खा सकने वाली योजनाएँ मिली हैं। मानदंड, दस्तावेज़ और आधिकारिक आवेदन पृष्ठ देखने के लिए नीचे योजना खोलें।", mapsOpened: "Google Maps नए टैब में खुल रहा है।", compareLimit: "एक बार में अधिकतम तीन योजनाओं की तुलना करें।", compareHeading: "योजनाओं की तुलना", categoryLabel: "श्रेणी", benefitLabel: "लाभ", whoLabel: "पात्रता", methodLabel: "आवेदन", complexityLabel: "प्रक्रिया", close: "बंद करें", modeDemo: "योजना सूची सहायक", modeClaude: "Claude सहायक",
    photoAlt: "गाँव के सेवा केंद्र का संचालक एक निवासी को ऑनलाइन सरकारी सेवाओं में मदद कर रहा है", searching: "योजना सूची खोजी जा रही है…", details: "विवरण देखें", possibleScreening: "जाँच परिणाम", moreInfo: "पुष्टि के लिए जानकारी", listSummary: "आपके जवाबों के आधार पर", sourceCaution: "यह शुरुआती मार्गदर्शन है, आधिकारिक निर्णय नहीं।", savedOnly: "सहेजी योजनाएँ", showAll: "सभी योजनाएँ दिखाएँ", noSaved: "अभी कोई सहेजी योजना नहीं", speechUnsupported: "इस ब्राउज़र में आवाज़ से लिखना उपलब्ध नहीं है।", voiceError: "आवाज़ से लिखना शुरू नहीं हुआ। माइक्रोफ़ोन अनुमति जाँचकर फिर कोशिश करें।", profileSaved: "आपके जवाब केवल इस ब्राउज़र सत्र में उपलब्ध हैं।", chatContext: "यह जवाब योजना सूची पर आधारित है। ज़रूरी जानकारी आधिकारिक विभाग से जाँचें।"
  },
  mr: {
    skip: "मुख्य मजकुराकडे जा", navSchemes: "योजना", navAssistant: "साथीला विचारा", navHelp: "मदत मिळवा", languageLabel: "भाषा निवडा", myProfile: "माझी माहिती",
    eyebrow: "सरकारी लाभांसाठी तुमचा साथी", welcomeTitle: "तुमच्यासाठी योग्य मदत शोधा.", welcomeSubtitle: "तुमच्या गरजेपासून सुरुवात करा. योजना आणि पुढची पायरी शोधण्यात आम्ही मदत करू.",
    searchLabel: "योजना, लाभ किंवा गरज शोधा", searchPlaceholder: "उदा. “शेतकऱ्यांसाठी मदत”", searchButton: "शोधा", popular: "लोकप्रिय:", photoCaption: "स्थानिक सेवा केंद्रांवर प्रत्यक्ष मदत मिळू शकते.",
    catalogEyebrow: "मदत शोधा", catalogTitle: "प्रत्येक गरजेसाठी योजना", allSchemes: "सर्व योजना", agriculture: "शेती", health: "आरोग्य", womenFamily: "महिला आणि कुटुंब", loading: "योजना लोड होत आहेत…",
    noResults: "योजना सापडली नाही", tryAnother: "दुसरा शब्द शोधा किंवा वेगळी श्रेणी निवडा.", clearSearch: "शोध पुसा", saathiOnline: "साथी मदतीसाठी आहे", askTitle: "तुम्हाला काय शोधायचे आहे?",
    assistantIntro: "तुम्हाला कोणती मदत हवी आहे ते सांगा. मी योजना शोधून पुढच्या पायऱ्या समजावू शकतो.", promptFarmer: "मी शेतकरी आहे", promptLpg: "मला LPG जोडणी हवी आहे", askPlaceholderLabel: "सरकारी साथीला प्रश्न विचारा", askPlaceholder: "तुमचा प्रश्न लिहा…",
    privacyNote: "ओळख क्रमांक देऊ नका.", assistantDisclaimer: "ही माहिती मार्गदर्शनासाठी आहे. पात्रतेचा निर्णय संबंधित विभाग घेतो.", quickCheck: "जलद तपासणी", checkTitle: "तुमच्यासाठी योग्य पर्याय पाहा", checkText: "काही माहिती दिल्यास पर्याय कमी करता येतात.", checkButton: "पात्रता तपासा",
    catalogNote: "योजनेची माहिती अधिकृत स्रोतांमधून आहे. अर्जापूर्वी सध्याचे नियम तपासा.", offlineEyebrow: "प्रत्यक्ष मदत हवी आहे?", offlineTitle: "कॉमन सर्व्हिस सेंटर शोधा", offlineText: "जवळचे CSC ऑनलाइन अर्ज आणि कागदपत्रे तपासण्यात मदत करू शकते.",
    locationLabel: "शहर, जिल्हा किंवा PIN कोड", locationPlaceholder: "शहर, जिल्हा किंवा PIN कोड", findCsc: "CSC शोधा", footerNote: "सरकारी साथी हे स्वतंत्र मार्गदर्शक आहे; सरकारी वेबसाइट नाही.", indiaPortal: "भारताचे राष्ट्रीय पोर्टल ↗",
    clear: "पुसा", compareNow: "योजनांची तुलना", profileEyebrow: "तुमची माहिती", profileDialogTitle: "पात्रतेची अधिक स्पष्ट तपासणी", profileDialogIntro: "तुम्हाला सोयीचे वाटेल तीच माहिती द्या. उत्तरे या ब्राउझर सत्रात राहतील आणि जतन केली जाणार नाहीत.",
    ageLabel: "वय", genderLabel: "अर्जदार", preferNot: "निवडा किंवा वगळा", woman: "महिला", man: "पुरुष", other: "इतर ओळख", occupationLabel: "मुख्य व्यवसाय", choose: "निवडा किंवा वगळा", farmer: "शेतकरी", otherOccupation: "इतर",
    landLabel: "शेतकरी कुटुंबाकडे लागवडीयोग्य जमीन आहे का?", poorLabel: "कुटुंब उज्ज्वला गरीब-कुटुंब घोषणेच्या अटी पूर्ण करते का?", lpgLabel: "कुटुंबात आधीपासून LPG जोडणी आहे का?", taxLabel: "शेतकरी कुटुंबातील कोणी मागील वर्षी आयकर भरला का?",
    employmentLabel: "शेतकरी कुटुंबातील सरकारी नोकरी", none: "कोणीही नाही", regularEmployee: "सेवेत किंवा निवृत्त (गट D/MTS वगळून)", groupD: "गट D / MTS", pensionLabel: "पात्र निवृत्तीवेतन ₹10,000/महिना किंवा अधिक आहे का?",
    professionalLabel: "शेतकरी कुटुंबात नोंदणीकृत व्यावसायिक काम करतो का?", institutionalLabel: "जमीनधारक संस्था आहे का?", listedLabel: "कुटुंब PM-JAY यादीत आहे का?", stateLabel: "राज्य किंवा केंद्रशासित प्रदेश", optional: "ऐच्छिक",
    yes: "होय", no: "नाही", cancel: "रद्द करा", runCheck: "माझे पर्याय तपासा", benefitHeading: "लाभ", eligibilityHeading: "कोण पात्र असू शकते", documentsHeading: "तयार ठेवायची कागदपत्रे", stepsHeading: "अर्ज कसा करावा", contactHeading: "मदत मिळवा", officialSource: "अधिकृत योजना पृष्ठ", sourceLink: "योजना तपशीलाचा स्रोत",
    schemeCount: "योजना", readAnswer: "उत्तर ऐका", compare: "तुलना करा", removeCompare: "तुलनेतून काढा", saveScheme: "योजना जतन करा", unsaveScheme: "जतन केलेली योजना काढा", possibleMatch: "संभाव्य जुळणी", unlikely: "जुळण्याची शक्यता कमी", needsInformation: "अधिक माहिती हवी", needsConfirmation: "योजनेकडून खात्री करा", savedEmpty: "तुम्ही अजून कोणतीही योजना जतन केलेली नाही.",
    resultMatch: "तुमची उत्तरे सूचीतील तपासणी निकषांशी जुळतात. अंतिम पात्रता योजना प्राधिकरण ठरवते.", resultUnlikely: "एक किंवा अधिक उत्तरे सूचीतील नियमांशी जुळत नसतील. अपवाद आणि अंतिम निकषांसाठी अधिकृत पृष्ठ पाहा.", resultNeeds: "उपयुक्त तपासणीसाठी आणखी काही प्रश्नांची उत्तरे द्या.", resultConfirm: "हा नमुना या योजनेचे सर्व पात्रता मार्ग तपासत नाही. योजना प्राधिकरणाकडून खात्री करा.",
    assistantError: "आत्ता सहाय्यकाशी संपर्क झाला नाही. योजना सूची आणि तपासणी उपलब्ध आहेत.", demoAnswer: "तुमच्या प्रश्नाशी जुळू शकणाऱ्या योजना सापडल्या. निकष, कागदपत्रे आणि अधिकृत अर्ज पृष्ठ पाहण्यासाठी खालील योजना उघडा.", mapsOpened: "Google Maps नवीन टॅबमध्ये उघडत आहे.", compareLimit: "एका वेळी जास्तीत जास्त तीन योजनांची तुलना करा.", compareHeading: "योजनांची तुलना", categoryLabel: "श्रेणी", benefitLabel: "लाभ", whoLabel: "पात्रता", methodLabel: "अर्ज", complexityLabel: "प्रक्रिया", close: "बंद करा", modeDemo: "योजना सूची सहाय्यक", modeClaude: "Claude सहाय्यक",
    photoAlt: "गावातील सेवा केंद्र चालक एका रहिवाशाला ऑनलाइन सरकारी सेवांसाठी मदत करत आहे", searching: "योजना सूची शोधत आहे…", details: "तपशील पाहा", possibleScreening: "तपासणीचा निकाल", moreInfo: "खात्रीसाठी माहिती", listSummary: "तुमच्या उत्तरांनुसार", sourceCaution: "हे प्राथमिक मार्गदर्शन आहे, अधिकृत निर्णय नाही.", savedOnly: "जतन केलेल्या योजना", showAll: "सर्व योजना दाखवा", noSaved: "अजून जतन केलेली योजना नाही", speechUnsupported: "या ब्राउझरमध्ये आवाजातून इनपुट उपलब्ध नाही.", voiceError: "आवाजातून इनपुट सुरू झाले नाही. मायक्रोफोनची परवानगी तपासून पुन्हा प्रयत्न करा.", profileSaved: "तुमची उत्तरे फक्त या ब्राउझर सत्रात उपलब्ध आहेत.", chatContext: "हे उत्तर योजना सूचीवर आधारित आहे. महत्त्वाची माहिती अधिकृत विभागाकडून तपासा."
  }
};

Object.assign(words.hi, {
  speakWith: "सरकारी साथी से बात करें", typeInstead: "लिखकर पूछें", needEyebrow: "अपनी ज़रूरत से शुरुआत करें", needTitle: "आपको किस मदद की ज़रूरत है?", tryDemo: "डेमो देखें:", demoFarmer: "किसान", demoStudent: "विद्यार्थी", demoSenior: "वरिष्ठ नागरिक", clearConversation: "बातचीत मिटाएँ", journeyEyebrow: "आपकी खोज", dashboardTitle: "आपकी सहायता डैशबोर्ड", newSearch: "नई खोज शुरू करें", myNeed: "मेरी ज़रूरत", relevantSchemes: "संबंधित योजनाएँ", eligibility: "पात्रता", documentsReady: "पहचाने दस्तावेज़", nextStep: "अगला कदम", noIdNumbers: "केवल ज़रूरी जानकारी दें। यहाँ आधार नंबर साझा न करें।", demoLabel: "नमूना जानकारी"
});

words.kn = {
  skip: "ವಿಷಯಕ್ಕೆ ಹೋಗಿ", navSchemes: "ಯೋಜನೆಗಳು", navAssistant: "ಸಾಥಿಗೆ ಕೇಳಿ", navHelp: "ಸಹಾಯ ಪಡೆಯಿರಿ", languageLabel: "ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ", myProfile: "ನನ್ನ ವಿವರಗಳು",
  eyebrow: "ಸರ್ಕಾರಿ ಸೌಲಭ್ಯಗಳಿಗೆ ನಿಮ್ಮ ಜೊತೆಗಾರ", welcomeTitle: "ನಿಮ್ಮ ಧ್ವನಿ. ನಿಮ್ಮ ಭಾಷೆ. ನಿಮ್ಮ ಕಲ್ಯಾಣ.", welcomeSubtitle: "ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ, ಅರ್ಹತೆಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ, ದಾಖಲೆ ಸಿದ್ಧಪಡಿಸಿ ಮತ್ತು ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ಮುಂದಿನ ಹಂತಗಳನ್ನು ತಿಳಿಯಿರಿ.",
  searchLabel: "ಯೋಜನೆ, ಸೌಲಭ್ಯ ಅಥವಾ ಅಗತ್ಯವನ್ನು ಹುಡುಕಿ", searchPlaceholder: "ಉದಾ: ರೈತರಿಗೆ ನೆರವು", searchButton: "ಹುಡುಕಿ", popular: "ಜನಪ್ರಿಯ:", photoCaption: "ಸ್ಥಳೀಯ ಸೇವಾ ಕೇಂದ್ರಗಳಲ್ಲಿ ಮುಖಾಮುಖಿ ಸಹಾಯ ಲಭ್ಯ.",
  catalogEyebrow: "ಸಹಾಯ ಹುಡುಕಿ", catalogTitle: "ಪ್ರತಿ ಅಗತ್ಯಕ್ಕೂ ಯೋಜನೆಗಳು", allSchemes: "ಎಲ್ಲಾ ಯೋಜನೆಗಳು", agriculture: "ಕೃಷಿ", education: "ಶಿಕ್ಷಣ", housing: "ವಸತಿ", health: "ಆರೋಗ್ಯ", employment: "ಉದ್ಯೋಗ", womenFamily: "ಮಹಿಳೆ ಮತ್ತು ಕುಟುಂಬ", senior: "ಹಿರಿಯ ನಾಗರಿಕರು", finance: "ಹಣಕಾಸಿನ ನೆರವು", loading: "ಯೋಜನೆಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ…",
  noResults: "ಯೋಜನೆಗಳು ಸಿಗಲಿಲ್ಲ", tryAnother: "ಬೇರೆ ಪದ ಹುಡುಕಿ ಅಥವಾ ಬೇರೆ ವರ್ಗ ಆರಿಸಿ.", clearSearch: "ಹುಡುಕಾಟ ಅಳಿಸಿ", saathiOnline: "ಸಾಥಿ ಇಲ್ಲಿದ್ದಾರೆ", askTitle: "ನಿಮಗೆ ಯಾವ ಸಹಾಯ ಬೇಕು?", assistantIntro: "ನಿಮಗೆ ಯಾವ ಸಹಾಯ ಬೇಕು ಎಂದು ಹೇಳಿ. ನಾನು ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ ಮುಂದಿನ ಹಂತಗಳನ್ನು ವಿವರಿಸುತ್ತೇನೆ.", promptFarmer: "ನಾನು ರೈತ", promptLpg: "ನನಗೆ LPG ಸಂಪರ್ಕ ಬೇಕು", askPlaceholderLabel: "ಸರ್ಕಾರಿ ಸಾಥಿಗೆ ಪ್ರಶ್ನೆ ಕೇಳಿ", askPlaceholder: "ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಬರೆಯಿರಿ…",
  privacyNote: "ಗುರುತು ಸಂಖ್ಯೆಯನ್ನು ಹಂಚಬೇಡಿ.", assistantDisclaimer: "ಇದು ಮಾರ್ಗದರ್ಶನ ಮಾತ್ರ. ಅರ್ಹತೆಯನ್ನು ಅಧಿಕೃತ ಇಲಾಖೆ ನಿರ್ಧರಿಸುತ್ತದೆ.", quickCheck: "ತ್ವರಿತ ಪರಿಶೀಲನೆ", checkTitle: "ನಿಮಗೆ ಹೊಂದುವ ಯೋಜನೆ ನೋಡಿ", checkText: "ಕೆಲವು ವಿವರಗಳು ಆಯ್ಕೆಗಳನ್ನು ಕಡಿಮೆ ಮಾಡಬಹುದು.", checkButton: "ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಿ", catalogNote: "ಅರ್ಜಿಸುವ ಮೊದಲು ಅಧಿಕೃತ ಮೂಲದಲ್ಲಿ ಇತ್ತೀಚಿನ ನಿಯಮಗಳನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.",
  offlineEyebrow: "ಮುಖಾಮುಖಿ ಸಹಾಯ ಬೇಕೇ?", offlineTitle: "ಸಾಮಾನ್ಯ ಸೇವಾ ಕೇಂದ್ರ ಹುಡುಕಿ", offlineText: "ಹತ್ತಿರದ CSC ಆನ್‌ಲೈನ್ ಅರ್ಜಿ ಮತ್ತು ದಾಖಲೆಗಳಲ್ಲಿ ಸಹಾಯ ಮಾಡಬಹುದು.", locationLabel: "ನಗರ, ಜಿಲ್ಲೆ ಅಥವಾ PIN ಕೋಡ್", locationPlaceholder: "ನಗರ, ಜಿಲ್ಲೆ ಅಥವಾ PIN ಕೋಡ್", findCsc: "CSC ಹುಡುಕಿ", footerNote: "ಸರ್ಕಾರಿ ಸಾಥಿ ಸ್ವತಂತ್ರ ಮಾರ್ಗದರ್ಶಿ; ಇದು ಸರ್ಕಾರಿ ವೆಬ್‌ಸೈಟ್ ಅಲ್ಲ.", indiaPortal: "ಭಾರತದ ರಾಷ್ಟ್ರೀಯ ಪೋರ್ಟಲ್ ↗",
  clear: "ಅಳಿಸಿ", compareNow: "ಯೋಜನೆಗಳನ್ನು ಹೋಲಿಸಿ", profileEyebrow: "ನಿಮ್ಮ ವಿವರಗಳು", profileDialogTitle: "ಅರ್ಹತೆಯ ಉತ್ತಮ ಪರಿಶೀಲನೆ", profileDialogIntro: "ನಿಮಗೆ ಅನುಕೂಲವಾದ ಮಾಹಿತಿಯನ್ನು ಮಾತ್ರ ಹಂಚಿಕೊಳ್ಳಿ. ಈ ಉತ್ತರಗಳು ಈ ಬ್ರೌಸರ್ ಸತ್ರದಲ್ಲಿ ಮಾತ್ರ ಇರುತ್ತವೆ.", ageLabel: "ವಯಸ್ಸು", genderLabel: "ಅರ್ಜಿದಾರರು", preferNot: "ಆರಿಸಿ ಅಥವಾ ಬಿಡಿ", woman: "ಮಹಿಳೆ", man: "ಪುರುಷ", other: "ಇತರೆ", occupationLabel: "ಮುಖ್ಯ ಉದ್ಯೋಗ", choose: "ಆರಿಸಿ ಅಥವಾ ಬಿಡಿ", farmer: "ರೈತ", otherOccupation: "ಇತರೆ",
  landLabel: "ನಿಮ್ಮ ರೈತ ಕುಟುಂಬಕ್ಕೆ ಕೃಷಿ ಭೂಮಿ ಇದೆಯೇ?", poorLabel: "ನಿಮ್ಮ ಕುಟುಂಬ PMUY ಬಡತನದ ಮಾನದಂಡ ಪೂರೈಸುತ್ತದೆಯೇ?", lpgLabel: "ನಿಮ್ಮ ಕುಟುಂಬದಲ್ಲಿ ಈಗಾಗಲೇ LPG ಸಂಪರ್ಕ ಇದೆಯೇ?", taxLabel: "ಕಳೆದ ವರ್ಷ ರೈತ ಕುಟುಂಬದಲ್ಲಿ ಯಾರಾದರೂ ಆದಾಯ ತೆರಿಗೆ ಪಾವತಿಸಿದ್ದಾರೆಯೇ?", employmentLabel: "ರೈತ ಕುಟುಂಬದಲ್ಲಿ ಸರ್ಕಾರಿ ಉದ್ಯೋಗವಿದೆಯೇ?", none: "ಯಾರೂ ಇಲ್ಲ", regularEmployee: "ಸೇವೆಯಲ್ಲಿರುವ ಅಥವಾ ನಿವೃತ್ತ ಉದ್ಯೋಗಿ", groupD: "ಗ್ರೂಪ್ D / MTS", pensionLabel: "ತಿಂಗಳ ಪಿಂಚಣಿ ₹10,000 ಅಥವಾ ಹೆಚ್ಚು ಇದೆಯೇ?", professionalLabel: "ಕುಟುಂಬದಲ್ಲಿ ನೋಂದಾಯಿತ ವೃತ್ತಿಪರರಿದ್ದಾರೆಯೇ?", institutionalLabel: "ಭೂಮಿಯ ಮಾಲೀಕರು ಸಂಸ್ಥೆಯೇ?", listedLabel: "ಕುಟುಂಬ PM-JAY ಪಟ್ಟಿಯಲ್ಲಿದೆಯೇ?", stateLabel: "ರಾಜ್ಯ ಅಥವಾ ಕೇಂದ್ರಾಡಳಿತ ಪ್ರದೇಶ", optional: "ಐಚ್ಛಿಕ", yes: "ಹೌದು", no: "ಇಲ್ಲ", cancel: "ರದ್ದುಮಾಡಿ", runCheck: "ನನ್ನ ಆಯ್ಕೆ ಪರಿಶೀಲಿಸಿ",
  benefitHeading: "ಯೋಜನೆಯ ಸೌಲಭ್ಯ", eligibilityHeading: "ಯಾರು ಅರ್ಹರಾಗಬಹುದು", documentsHeading: "ಸಿದ್ಧಪಡಿಸಬೇಕಾದ ದಾಖಲೆಗಳು", stepsHeading: "ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ವಿಧಾನ", contactHeading: "ಸಹಾಯ ಪಡೆಯಿರಿ", officialSource: "ಅಧಿಕೃತ ಯೋಜನೆ ಪುಟ", sourceLink: "ಯೋಜನೆಯ ಮೂಲ", schemeCount: "ಯೋಜನೆಗಳು", readAnswer: "ಉತ್ತರವನ್ನು ಕೇಳಿ", compare: "ಹೋಲಿಸಿ", removeCompare: "ಹೋಲಿಕೆಯಿಂದ ತೆಗೆದುಹಾಕಿ", saveScheme: "ಯೋಜನೆ ಉಳಿಸಿ", unsaveScheme: "ಉಳಿಸಿದ ಯೋಜನೆ ತೆಗೆದುಹಾಕಿ", possibleMatch: "ಸಂಭಾವ್ಯ ಹೊಂದಾಣಿಕೆ", unlikely: "ಹೊಂದಿಕೆಯಾಗುವ ಸಾಧ್ಯತೆ ಕಡಿಮೆ", needsInformation: "ಇನ್ನಷ್ಟು ಮಾಹಿತಿ ಬೇಕು", needsConfirmation: "ಯೋಜನೆಯಲ್ಲಿ ಖಚಿತಪಡಿಸಿ", savedEmpty: "ನೀವು ಇನ್ನೂ ಯಾವುದೇ ಯೋಜನೆ ಉಳಿಸಿಲ್ಲ.",
  resultMatch: "ನಿಮ್ಮ ಉತ್ತರಗಳು ಪಟ್ಟಿ ಮಾಡಿರುವ ಪರಿಶೀಲನಾ ನಿಯಮಗಳಿಗೆ ಹೊಂದುತ್ತವೆ. ಅಂತಿಮ ಅರ್ಹತೆಯನ್ನು ಯೋಜನಾ ಪ್ರಾಧಿಕಾರ ನಿರ್ಧರಿಸುತ್ತದೆ.", resultUnlikely: "ಒಂದು ಅಥವಾ ಹೆಚ್ಚು ಉತ್ತರಗಳು ಪಟ್ಟಿ ಮಾಡಿರುವ ನಿಯಮಗಳಿಗೆ ಹೊಂದದಿರಬಹುದು. ಅಧಿಕೃತ ಪುಟದಲ್ಲಿ ಪರಿಶೀಲಿಸಿ.", resultNeeds: "ಉಪಯುಕ್ತ ಪರಿಶೀಲನೆಗೆ ಇನ್ನೂ ಕೆಲವು ವಿವರಗಳು ಬೇಕು.", resultConfirm: "ಈ ಮಾದರಿ ಎಲ್ಲಾ ಅರ್ಹತಾ ಮಾರ್ಗಗಳನ್ನು ಪರಿಶೀಲಿಸುವುದಿಲ್ಲ. ಅಧಿಕೃತ ಪ್ರಾಧಿಕಾರದಿಂದ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.", assistantError: "ಸಹಾಯಕನನ್ನು ಈಗ ಸಂಪರ್ಕಿಸಲಾಗಲಿಲ್ಲ. ಯೋಜನೆಗಳ ಪಟ್ಟಿ ಲಭ್ಯವಿದೆ.", demoAnswer: "ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ ಹೊಂದುವ ಯೋಜನೆಗಳು ಸಿಕ್ಕಿವೆ. ನಿಯಮಗಳು, ದಾಖಲೆಗಳು ಮತ್ತು ಅಧಿಕೃತ ಅರ್ಜಿ ಪುಟಕ್ಕಾಗಿ ಯೋಜನೆ ತೆರೆಯಿರಿ.", mapsOpened: "Google Maps ಹೊಸ ಟ್ಯಾಬ್‌ನಲ್ಲಿ ತೆರೆಯುತ್ತಿದೆ.", compareLimit: "ಒಂದೇ ಬಾರಿ ಮೂರು ಯೋಜನೆಗಳವರೆಗೆ ಹೋಲಿಸಿ.", compareHeading: "ಯೋಜನೆಗಳನ್ನು ಹೋಲಿಸಿ", categoryLabel: "ವರ್ಗ", benefitLabel: "ಸೌಲಭ್ಯ", whoLabel: "ಅರ್ಹತೆ", methodLabel: "ಅರ್ಜಿ ವಿಧಾನ", complexityLabel: "ಪ್ರಕ್ರಿಯೆ", close: "ಮುಚ್ಚಿ", modeDemo: "ಮಾದರಿ ಪಟ್ಟಿ ಸಹಾಯಕ", modeClaude: "Claude ಸಹಾಯಕ",
  photoAlt: "ಗ್ರಾಮದ ಸೇವಾ ಕೇಂದ್ರದ ಸಿಬ್ಬಂದಿ ನಿವಾಸಿಗೆ ಆನ್‌ಲೈನ್ ಸರ್ಕಾರಿ ಸೇವೆಗಳಲ್ಲಿ ಸಹಾಯ ಮಾಡುತ್ತಿದ್ದಾರೆ", searching: "ಯೋಜನೆಗಳ ಪಟ್ಟಿಯಲ್ಲಿ ಹುಡುಕಲಾಗುತ್ತಿದೆ…", details: "ವಿವರ ನೋಡಿ", possibleScreening: "ಪರಿಶೀಲನೆಯ ಫಲಿತಾಂಶ", moreInfo: "ಖಚಿತಪಡಿಸಬೇಕಾದ ವಿವರಗಳು", listSummary: "ನಿಮ್ಮ ಉತ್ತರಗಳ ಆಧಾರದಲ್ಲಿ", sourceCaution: "ಇದು ಪ್ರಾಥಮಿಕ ಮಾರ್ಗದರ್ಶನ ಮಾತ್ರ; ಅಧಿಕೃತ ನಿರ್ಧಾರವಲ್ಲ.", savedOnly: "ಉಳಿಸಿದ ಯೋಜನೆಗಳು", showAll: "ಎಲ್ಲಾ ಯೋಜನೆಗಳನ್ನು ತೋರಿಸಿ", noSaved: "ಉಳಿಸಿದ ಯೋಜನೆಗಳಿಲ್ಲ", speechUnsupported: "ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಲಭ್ಯವಿಲ್ಲ.", voiceError: "ಮೈಕ್ರೋಫೋನ್ ಆರಂಭಿಸಲಾಗಲಿಲ್ಲ. ಅನುಮತಿ ಪರಿಶೀಲಿಸಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.", profileSaved: "ನಿಮ್ಮ ಉತ್ತರಗಳು ಈ ಬ್ರೌಸರ್ ಸತ್ರದಲ್ಲಿ ಮಾತ್ರ ಇರುತ್ತವೆ.", chatContext: "ಈ ಉತ್ತರ ಯೋಜನೆಗಳ ಪಟ್ಟಿಯನ್ನು ಆಧರಿಸಿದೆ. ಮುಖ್ಯ ವಿವರಗಳನ್ನು ಅಧಿಕೃತ ಇಲಾಖೆಯಲ್ಲಿ ಪರಿಶೀಲಿಸಿ.",
  speakWith: "ಸರ್ಕಾರಿ ಸಾಥಿಯೊಂದಿಗೆ ಮಾತನಾಡಿ", typeInstead: "ಬರೆಯಿರಿ", needEyebrow: "ನಿಮ್ಮ ಅಗತ್ಯದಿಂದ ಆರಂಭಿಸಿ", needTitle: "ನಿಮಗೆ ಯಾವ ಸಹಾಯ ಬೇಕು?", tryDemo: "ಮಾದರಿ ನೋಡಿ:", demoFarmer: "ರೈತ", demoStudent: "ವಿದ್ಯಾರ್ಥಿ", demoSenior: "ಹಿರಿಯ ನಾಗರಿಕ", clearConversation: "ಸಂಭಾಷಣೆ ಅಳಿಸಿ", journeyEyebrow: "ನಿಮ್ಮ ಹುಡುಕಾಟ", dashboardTitle: "ನಿಮ್ಮ ಸಹಾಯ ಫಲಕ", newSearch: "ಹೊಸ ಹುಡುಕಾಟ", myNeed: "ನನ್ನ ಅಗತ್ಯ", relevantSchemes: "ಸಂಬಂಧಿತ ಯೋಜನೆಗಳು", eligibility: "ಅರ್ಹತೆ", documentsReady: "ಗುರುತಿಸಿದ ದಾಖಲೆಗಳು", nextStep: "ಮುಂದಿನ ಹಂತ", noIdNumbers: "ಅಗತ್ಯವಿರುವ ಮಾಹಿತಿಯನ್ನು ಮಾತ್ರ ನೀಡಿ. ಆಧಾರ್ ಸಂಖ್ಯೆ ಹಂಚಬೇಡಿ.", demoLabel: "ಮಾದರಿ ಮಾಹಿತಿ", generateGuide: "ನನ್ನ ಅರ್ಜಿ ಯೋಜನೆ ರೂಪಿಸಿ", privacyNotice: "ಅಗತ್ಯ ಮಾಹಿತಿಯನ್ನು ಮಾತ್ರ ನೀಡಿ. ಆಧಾರ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಬೇಡಿ.", unsupported: "ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಲಭ್ಯವಿಲ್ಲ. ಪ್ರಶ್ನೆಯನ್ನು ಬರೆಯಿರಿ.", ready: "ಸಿದ್ಧ", listening: "ಕೇಳುತ್ತಿದೆ…", processing: "ಪರಿಶೀಲಿಸುತ್ತಿದೆ…", voiceErrorState: "ಮೈಕ್ರೊಫೋನ್ ದೋಷ"
};

Object.assign(words.en, { generateGuide: "Build my application plan", privacyNotice: "Share only needed information. Do not enter Aadhaar numbers.", unsupported: "Voice input isn't available here. Type your question instead.", ready: "Ready", listening: "Listening…", processing: "Processing…", voiceErrorState: "Microphone error" });
Object.assign(words.hi, { generateGuide: "मेरी आवेदन योजना बनाएँ", privacyNotice: "केवल ज़रूरी जानकारी दें। आधार नंबर न लिखें।", unsupported: "इस ब्राउज़र में आवाज़ उपलब्ध नहीं है। सवाल लिखकर पूछें।", ready: "तैयार", listening: "सुन रहा है…", processing: "जाँच हो रही है…", voiceErrorState: "माइक्रोफ़ोन में समस्या" });
Object.assign(words.kn, { generateGuide: "ನನ್ನ ಅರ್ಜಿ ಯೋಜನೆ ರೂಪಿಸಿ", privacyNotice: "ಅಗತ್ಯ ಮಾಹಿತಿಯನ್ನು ಮಾತ್ರ ನೀಡಿ. ಆಧಾರ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಬೇಡಿ.", unsupported: "ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಲಭ್ಯವಿಲ್ಲ. ಪ್ರಶ್ನೆಯನ್ನು ಬರೆಯಿರಿ.", ready: "ಸಿದ್ಧ", listening: "ಕೇಳುತ್ತಿದೆ…", processing: "ಪರಿಶೀಲಿಸುತ್ತಿದೆ…", voiceErrorState: "ಮೈಕ್ರೊಫೋನ್ ದೋಷ" });
Object.assign(words.en, { clearProgress: "Clear checks", progressSaved: "Checklist checks stay in this browser on this device. No files are uploaded." });
Object.assign(words.hi, { clearProgress: "चेक मिटाएँ", progressSaved: "चेकलिस्ट इसी डिवाइस के ब्राउज़र में रहती है। कोई फ़ाइल अपलोड नहीं होती।" });
Object.assign(words.kn, { clearProgress: "ಗುರುತುಗಳನ್ನು ತೆರವುಗೊಳಿಸಿ", progressSaved: "ಚೆಕ್‌ಲಿಸ್ಟ್ ಗುರುತುಗಳು ಈ ಸಾಧನದ ಬ್ರೌಸರ್‌ನಲ್ಲೇ ಉಳಿಯುತ್ತವೆ. ಯಾವುದೇ ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಆಗುವುದಿಲ್ಲ." });
Object.assign(words.en, {
  agentDemoEyebrow: "SAFE APPLICATION DEMO", agentDemoTitle: "Let Saathi prepare a sample application",
  agentDemoText: "Watch Saathi fill a fictional application virtually, inside this app. Nothing is sent to a government service.",
  agentDemoButton: "Run virtual demo", agentDemoOpening: "Starting the virtual demo…",
  agentDemoPopupBlocked: "Allow pop-ups for this site, then try the demo again.", agentDemoPortalClosed: "The demo portal was closed.",
  agentDemoStep: "Agent step", agentDemoComplete: "The simulated receipt is ready in your dashboard.",
  agentDemoDashboardNeed: "Agriculture support (sample)", agentDemoDashboardSchemes: "1 sample scheme",
  agentDemoDashboardEligibility: "Official confirmation needed", agentDemoDashboardDocuments: "1/3 sample",
  agentDemoDashboardNext: "Review the scheme details and official source.", agentDemoReceiptTitle: "APPLICATION SUBMITTED — DEMO ONLY",
  agentDemoReceiptText: "Your sample application was marked submitted in SarkariSaathi's demo. It was not sent to any government service.", agentDemoReference: "Demo reference"
});
Object.assign(words.hi, {
  agentDemoEyebrow: "सुरक्षित आवेदन डेमो", agentDemoTitle: "साथी से नमूना आवेदन तैयार कराएँ",
  agentDemoText: "साथी को इसी ऐप में काल्पनिक आवेदन भरते देखें। सरकारी सेवा को कुछ नहीं भेजा जाता।",
  agentDemoButton: "वर्चुअल डेमो चलाएँ", agentDemoOpening: "वर्चुअल डेमो शुरू हो रहा है…",
  agentDemoPopupBlocked: "इस साइट के लिए पॉप-अप की अनुमति दें, फिर डेमो दोबारा चलाएँ।", agentDemoPortalClosed: "डेमो पोर्टल बंद हो गया।",
  agentDemoStep: "एजेंट चरण", agentDemoComplete: "नकली रसीद आपके डैशबोर्ड में तैयार है।",
  agentDemoDashboardNeed: "कृषि सहायता (नमूना)", agentDemoDashboardSchemes: "1 नमूना योजना",
  agentDemoDashboardEligibility: "सरकारी पुष्टि ज़रूरी", agentDemoDashboardDocuments: "1/3 नमूना",
  agentDemoDashboardNext: "योजना का विवरण और आधिकारिक स्रोत देखें।", agentDemoReceiptTitle: "डेमो में आवेदन जमा हुआ",
  agentDemoReceiptText: "आपका नमूना आवेदन केवल SarkariSaathi डेमो में जमा हुआ। यह किसी सरकारी सेवा को नहीं भेजा गया।", agentDemoReference: "डेमो संदर्भ"
});
Object.assign(words.kn, {
  agentDemoEyebrow: "ಸುರಕ್ಷಿತ ಅರ್ಜಿ ಡೆಮೋ", agentDemoTitle: "ಮಾದರಿ ಅರ್ಜಿಯನ್ನು ಸಿದ್ಧಪಡಿಸಲು ಸಾಥಿಗೆ ಹೇಳಿ",
  agentDemoText: "ಅದೇ ಆ್ಯಪ್‌ನೊಳಗೆ ಸಾಥಿ ಕಾಲ್ಪನಿಕ ಅರ್ಜಿಯನ್ನು ತುಂಬುವುದನ್ನು ನೋಡಿ. ಸರ್ಕಾರಿ ಸೇವೆಗೆ ಏನೂ ಕಳುಹಿಸುವುದಿಲ್ಲ.",
  agentDemoButton: "ವರ್ಚುವಲ್ ಡೆಮೋ ಪ್ರಾರಂಭಿಸಿ", agentDemoOpening: "ವರ್ಚುವಲ್ ಡೆಮೋ ಪ್ರಾರಂಭವಾಗುತ್ತಿದೆ…",
  agentDemoPopupBlocked: "ಈ ತಾಣಕ್ಕೆ ಪಾಪ್-ಅಪ್‌ಗಳನ್ನು ಅನುಮತಿಸಿ, ನಂತರ ಡೆಮೋವನ್ನು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.", agentDemoPortalClosed: "ಡೆಮೋ ಪೋರ್ಟಲ್ ಮುಚ್ಚಲಾಗಿದೆ.",
  agentDemoStep: "ಏಜೆಂಟ್ ಹಂತ", agentDemoComplete: "ಸಿಮ್ಯುಲೇಟೆಡ್ ರಸೀದಿ ನಿಮ್ಮ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಲ್ಲಿ ಸಿದ್ಧವಾಗಿದೆ.",
  agentDemoDashboardNeed: "ಕೃಷಿ ಸಹಾಯ (ಮಾದರಿ)", agentDemoDashboardSchemes: "1 ಮಾದರಿ ಯೋಜನೆ",
  agentDemoDashboardEligibility: "ಅಧಿಕೃತ ದೃಢೀಕರಣ ಅಗತ್ಯ", agentDemoDashboardDocuments: "1/3 ಮಾದರಿ",
  agentDemoDashboardNext: "ಯೋಜನೆಯ ವಿವರ ಮತ್ತು ಅಧಿಕೃತ ಮೂಲವನ್ನು ಪರಿಶೀಲಿಸಿ.", agentDemoReceiptTitle: "ಡೆಮೋದಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಲಾಗಿದೆ",
  agentDemoReceiptText: "ನಿಮ್ಮ ಮಾದರಿ ಅರ್ಜಿ SarkariSaathi ಡೆಮೋದಲ್ಲಷ್ಟೇ ಸಲ್ಲಿಸಲಾಗಿದೆ. ಇದನ್ನು ಯಾವುದೇ ಸರ್ಕಾರಿ ಸೇವೆಗೆ ಕಳುಹಿಸಿಲ್ಲ.", agentDemoReference: "ಡೆಮೋ ಉಲ್ಲೇಖ"
});

Object.assign(words.en, {
  agentDemoOpening: "Starting the virtual demo…", agentDemoVirtualTitle: "Virtual agent workspace",
  agentDemoVirtualText: "Watch Saathi prepare a fictional sample application inside the app.", agentDemoWorking: "WORKING IN DEMO MODE",
  agentDemoProcessTitle: "Saathi's steps", agentDemoUnderstand: "Understand the request", agentDemoSearch: "Find a matching scheme",
  agentDemoCheck: "Check sample details", agentDemoPrepare: "Prepare sample form", agentDemoReview: "Pause for your review",
  agentDemoSandboxBadge: "LOCAL SIMULATION", agentDemoFormTitle: "Sample application",
  agentDemoFormIntro: "Fictional farmer profile. Saathi fills these sample fields automatically.", agentDemoProgressLabel: "Sample form progress",
  agentDemoApplicantLabel: "Applicant", agentDemoStateLabel: "State", agentDemoDistrictLabel: "District",
  agentDemoOccupationLabel: "Occupation", agentDemoIncomeLabel: "Annual income", agentDemoSchemeLabel: "Scheme", agentDemoPurposeLabel: "Purpose",
  agentDemoDocumentTitle: "Sample supporting document", agentDemoDocumentText: "Land record — DEMO ONLY.pdf. Simulated; no file uploaded.",
  agentDemoSimulated: "SIMULATED", agentDemoGateEyebrow: "FINAL DEMO STEP", agentDemoGateTitle: "Demo verification gate",
  agentDemoGateText: "In a real service, stop here and enter the OTP yourself. This is not connected to a government portal.",
  agentDemoOtpHint: "Demo OTP:", agentDemoOtpHintText: "enter any six digits", agentDemoOtpLabel: "Test OTP",
  agentDemoCaptchaLabel: "Demo CAPTCHA", agentDemoOtpHelp: "Any six digits work in this demo.",
  agentDemoCaptchaHelp: "Type this word:", agentDemoSubmit: "Submit demo application",
  agentDemoFilling: "Preparing sample field", agentDemoGateReady: "Sample form ready. Review it, then complete the demo gate.",
  agentDemoSubmitting: "Creating simulated receipt…", agentDemoInvalid: "Check the six-digit OTP and enter the displayed demo code.",
  agentDemoSafetyNote: "Fictional sample only. No real document, OTP, or government application is involved."
});
Object.assign(words.hi, {
  agentDemoOpening: "वर्चुअल डेमो शुरू हो रहा है…", agentDemoVirtualTitle: "वर्चुअल एजेंट कार्यक्षेत्र",
  agentDemoVirtualText: "साथी को ऐप के अंदर नमूना आवेदन तैयार करते देखें।", agentDemoWorking: "डेमो मोड में काम कर रहा है",
  agentDemoProcessTitle: "साथी के चरण", agentDemoUnderstand: "ज़रूरत समझें", agentDemoSearch: "मिलती योजना खोजें",
  agentDemoCheck: "नमूना जानकारी जाँचें", agentDemoPrepare: "नमूना फ़ॉर्म तैयार करें", agentDemoReview: "आपकी पुष्टि के लिए रुकें",
  agentDemoSandboxBadge: "स्थानीय सिमुलेशन", agentDemoFormTitle: "नमूना आवेदन",
  agentDemoFormIntro: "काल्पनिक किसान की जानकारी। साथी नमूना फ़ील्ड अपने-आप भरेगा।", agentDemoProgressLabel: "नमूना फ़ॉर्म की प्रगति",
  agentDemoApplicantLabel: "आवेदक", agentDemoStateLabel: "राज्य", agentDemoDistrictLabel: "ज़िला",
  agentDemoOccupationLabel: "काम", agentDemoIncomeLabel: "सालाना आय", agentDemoSchemeLabel: "योजना", agentDemoPurposeLabel: "उद्देश्य",
  agentDemoDocumentTitle: "नमूना सहायक दस्तावेज़", agentDemoDocumentText: "भूमि रिकॉर्ड — केवल डेमो.pdf। नकली; कोई फ़ाइल अपलोड नहीं हुई।",
  agentDemoSimulated: "सिमुलेटेड", agentDemoGateEyebrow: "डेमो का अंतिम चरण", agentDemoGateTitle: "डेमो पुष्टि चरण",
  agentDemoGateText: "असली सेवा में यहाँ रुकें और OTP स्वयं दर्ज करें। यह सरकारी पोर्टल से जुड़ा नहीं है।",
  agentDemoOtpHint: "डेमो OTP:", agentDemoOtpHintText: "कोई भी छह अंक लिखें", agentDemoOtpLabel: "टेस्ट OTP",
  agentDemoCaptchaLabel: "डेमो CAPTCHA", agentDemoOtpHelp: "इस डेमो में कोई भी छह अंक चलेंगे।",
  agentDemoCaptchaHelp: "यह शब्द लिखें:", agentDemoSubmit: "डेमो आवेदन जमा करें",
  agentDemoFilling: "नमूना फ़ील्ड भर रहा है", agentDemoGateReady: "नमूना फ़ॉर्म तैयार है। इसे देखें और डेमो पुष्टि पूरी करें।",
  agentDemoSubmitting: "नकली रसीद बन रही है…", agentDemoInvalid: "छह अंकों का OTP जाँचें और दिखाया गया डेमो कोड लिखें।",
  agentDemoSafetyNote: "केवल काल्पनिक नमूना। कोई असली दस्तावेज़, OTP या सरकारी आवेदन नहीं है।"
});
Object.assign(words.kn, {
  agentDemoOpening: "ವರ್ಚುವಲ್ ಡೆಮೋ ಪ್ರಾರಂಭವಾಗುತ್ತಿದೆ…", agentDemoVirtualTitle: "ವರ್ಚುವಲ್ ಏಜೆಂಟ್ ಕಾರ್ಯಸ್ಥಳ",
  agentDemoVirtualText: "ಆ್ಯಪ್‌ನಲ್ಲೇ ಸಾಥಿ ಮಾದರಿ ಅರ್ಜಿಯನ್ನು ಸಿದ್ಧಪಡಿಸುವುದನ್ನು ನೋಡಿ.", agentDemoWorking: "ಡೆಮೋ ಮೋಡ್‌ನಲ್ಲಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿದೆ",
  agentDemoProcessTitle: "ಸಾಥಿಯ ಹಂತಗಳು", agentDemoUnderstand: "ಅಗತ್ಯವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ", agentDemoSearch: "ಹೊಂದುವ ಯೋಜನೆ ಹುಡುಕಿ",
  agentDemoCheck: "ಮಾದರಿ ವಿವರ ಪರಿಶೀಲಿಸಿ", agentDemoPrepare: "ಮಾದರಿ ಫಾರ್ಮ್ ಸಿದ್ಧಪಡಿಸಿ", agentDemoReview: "ನಿಮ್ಮ ಪರಿಶೀಲನೆಗಾಗಿ ನಿಲ್ಲಿಸಿ",
  agentDemoSandboxBadge: "ಸ್ಥಳೀಯ ಸಿಮ್ಯುಲೇಶನ್", agentDemoFormTitle: "ಮಾದರಿ ಅರ್ಜಿ",
  agentDemoFormIntro: "ಕಾಲ್ಪನಿಕ ರೈತರ ವಿವರಗಳು. ಸಾಥಿ ಮಾದರಿ ಕ್ಷೇತ್ರಗಳನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ತುಂಬುತ್ತದೆ.", agentDemoProgressLabel: "ಮಾದರಿ ಫಾರ್ಮ್ ಪ್ರಗತಿ",
  agentDemoApplicantLabel: "ಅರ್ಜಿದಾರರು", agentDemoStateLabel: "ರಾಜ್ಯ", agentDemoDistrictLabel: "ಜಿಲ್ಲೆ",
  agentDemoOccupationLabel: "ಕೆಲಸ", agentDemoIncomeLabel: "ವಾರ್ಷಿಕ ಆದಾಯ", agentDemoSchemeLabel: "ಯೋಜನೆ", agentDemoPurposeLabel: "ಉದ್ದೇಶ",
  agentDemoDocumentTitle: "ಮಾದರಿ ಸಹಾಯಕ ದಾಖಲೆ", agentDemoDocumentText: "ಭೂ ದಾಖಲೆ — ಡೆಮೋ ಮಾತ್ರ.pdf. ಸಿಮ್ಯುಲೇಟೆಡ್; ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಆಗಿಲ್ಲ.",
  agentDemoSimulated: "ಸಿಮ್ಯುಲೇಟೆಡ್", agentDemoGateEyebrow: "ಡೆಮೋದ ಕೊನೆಯ ಹಂತ", agentDemoGateTitle: "ಡೆಮೋ ಪರಿಶೀಲನೆ ಹಂತ",
  agentDemoGateText: "ನಿಜವಾದ ಸೇವೆಯಲ್ಲಿ ಇಲ್ಲಿ ನಿಲ್ಲಿಸಿ OTP ಅನ್ನು ನೀವೇ ನಮೂದಿಸಿ. ಇದು ಸರ್ಕಾರಿ ಪೋರ್ಟಲ್‌ಗೆ ಸಂಪರ್ಕಗೊಂಡಿಲ್ಲ.",
  agentDemoOtpHint: "ಡೆಮೋ OTP:", agentDemoOtpHintText: "ಯಾವುದೇ ಆರು ಅಂಕಿಗಳನ್ನು ನಮೂದಿಸಿ", agentDemoOtpLabel: "ಪರೀಕ್ಷಾ OTP",
  agentDemoCaptchaLabel: "ಡೆಮೋ CAPTCHA", agentDemoOtpHelp: "ಈ ಡೆಮೋದಲ್ಲಿ ಯಾವುದೇ ಆರು ಅಂಕಿಗಳು ಕೆಲಸ ಮಾಡುತ್ತವೆ.",
  agentDemoCaptchaHelp: "ಈ ಪದವನ್ನು ಟೈಪ್ ಮಾಡಿ:", agentDemoSubmit: "ಡೆಮೋ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ",
  agentDemoFilling: "ಮಾದರಿ ಕ್ಷೇತ್ರ ತುಂಬಲಾಗುತ್ತಿದೆ", agentDemoGateReady: "ಮಾದರಿ ಫಾರ್ಮ್ ಸಿದ್ಧವಾಗಿದೆ. ಪರಿಶೀಲಿಸಿ, ನಂತರ ಡೆಮೋ ದೃಢೀಕರಣ ಮುಂದುವರಿಸಿ.",
  agentDemoSubmitting: "ಸಿಮ್ಯುಲೇಟೆಡ್ ರಸೀದಿ ರಚಿಸಲಾಗುತ್ತಿದೆ…", agentDemoInvalid: "ಆರು ಅಂಕಿಯ OTP ಪರಿಶೀಲಿಸಿ ಮತ್ತು ತೋರಿಸಿದ ಡೆಮೋ ಕೋಡ್ ನಮೂದಿಸಿ.",
  agentDemoSafetyNote: "ಕಾಲ್ಪನಿಕ ಮಾದರಿ ಮಾತ್ರ. ನಿಜವಾದ ದಾಖಲೆ, OTP ಅಥವಾ ಸರ್ಕಾರಿ ಅರ್ಜಿ ಇಲ್ಲ."
});

Object.assign(words.en, {
  demoLoginEyebrow: "DEMO ACCESS", demoLoginTitle: "Sign in to SarkariSaathi",
  demoLoginIntro: "Use this shared demo account to open the prototype. Do not use a personal password.",
  demoLoginCredentialTitle: "Public demo credentials", demoUsernameLabel: "Username", demoPasswordLabel: "Password",
  demoLoginNotice: "Demo-only access. No account or personal password is stored.", demoLoginButton: "Sign in",
  demoLoginError: "The demo username or password is incorrect.", demoLoginNetworkError: "Could not sign in. Check that the app is running and try again.", demoLogout: "Sign out of demo",
  agentDemoNeedsDetails: "Enter your details to begin. They stay in this browser session.",
  agentDemoIntakeTitle: "Your application details", agentDemoIntakeText: "Enter the details you want Saathi to use. They stay in this browser and are not sent to a server.",
  agentDemoApplicantLabel: "Applicant name", agentDemoIncomeLabel: "Annual household income (optional)",
  agentDemoSchemeLabel: "Scheme you want help with", agentDemoPurposeLabel: "What do you need help with?",
  agentDemoChooseOccupation: "Choose one", agentDemoOtherOccupation: "Other worker",
  agentDemoPrivacyNote: "Do not enter Aadhaar numbers, passwords, bank details, or real OTPs.",
  agentDemoNotProvided: "Not provided",
  agentDemoBegin: "Let Saathi fill the demo form", agentDemoFormTitle: "Virtual application form",
  agentDemoFormIntro: "Saathi is transferring the details you entered into this virtual form.",
  agentDemoGateText: "Enter any six digits as the demo OTP. This local check does not contact a government service.",
  agentDemoCaptchaLabel: "Demo code", agentDemoCaptchaHelp: "Type the displayed code:",
  agentDemoRefreshCode: "Get a new demo code", agentDemoCodeRefreshed: "A fresh demo code is ready.",
  agentDemoStartError: "Could not start the demo. Please try again.",
  agentDemoInvalid: "Check the six-digit OTP and enter the displayed demo code.",
  speechVoiceUnavailable: "No voice is available for this language in your browser. Install a matching system voice or use the text answer.",
  speechVoiceError: "Speech playback failed. The written answer is still available."
});
Object.assign(words.hi, {
  demoLoginEyebrow: "डेमो प्रवेश", demoLoginTitle: "सरकारी साथी में साइन इन करें",
  demoLoginIntro: "प्रोटोटाइप खोलने के लिए यह साझा डेमो खाता उपयोग करें। अपना निजी पासवर्ड न डालें।",
  demoLoginCredentialTitle: "सार्वजनिक डेमो लॉगिन", demoUsernameLabel: "यूज़रनेम", demoPasswordLabel: "पासवर्ड",
  demoLoginNotice: "केवल डेमो प्रवेश। कोई खाता या निजी पासवर्ड सहेजा नहीं जाता।", demoLoginButton: "साइन इन करें",
  demoLoginError: "डेमो यूज़रनेम या पासवर्ड गलत है।", demoLoginNetworkError: "साइन इन नहीं हुआ। ऐप चल रहा है या नहीं जाँचें और फिर कोशिश करें।", demoLogout: "डेमो से साइन आउट करें",
  agentDemoNeedsDetails: "शुरू करने के लिए अपनी जानकारी भरें। यह इसी ब्राउज़र सत्र में रहेगी।",
  agentDemoIntakeTitle: "आपके आवेदन की जानकारी", agentDemoIntakeText: "साथी को उपयोग करने के लिए जानकारी भरें। यह इसी ब्राउज़र में रहती है, सर्वर पर नहीं भेजी जाती।",
  agentDemoApplicantLabel: "आवेदक का नाम", agentDemoIncomeLabel: "परिवार की सालाना आय (वैकल्पिक)",
  agentDemoSchemeLabel: "किस योजना में मदद चाहिए", agentDemoPurposeLabel: "आपको किस मदद की ज़रूरत है?",
  agentDemoChooseOccupation: "एक चुनें", agentDemoOtherOccupation: "अन्य काम",
  agentDemoPrivacyNote: "आधार नंबर, पासवर्ड, बैंक जानकारी या असली OTP न लिखें।",
  agentDemoNotProvided: "नहीं दिया",
  agentDemoBegin: "साथी से डेमो फ़ॉर्म भरवाएँ", agentDemoFormTitle: "वर्चुअल आवेदन फ़ॉर्म",
  agentDemoFormIntro: "साथी आपकी दी हुई जानकारी इस वर्चुअल फ़ॉर्म में भर रहा है।",
  agentDemoGateText: "डेमो OTP के लिए कोई भी छह अंक लिखें। यह स्थानीय जाँच सरकारी सेवा से नहीं जुड़ी है।",
  agentDemoCaptchaLabel: "डेमो कोड", agentDemoCaptchaHelp: "दिखाया गया कोड लिखें:",
  agentDemoRefreshCode: "नया डेमो कोड लें", agentDemoCodeRefreshed: "नया डेमो कोड तैयार है।",
  agentDemoStartError: "डेमो शुरू नहीं हुआ। कृपया फिर कोशिश करें।",
  agentDemoInvalid: "छह अंकों का OTP जाँचें और दिखाया गया डेमो कोड लिखें।",
  speechVoiceUnavailable: "आपके ब्राउज़र में इस भाषा की आवाज़ उपलब्ध नहीं है। संबंधित सिस्टम आवाज़ जोड़ें या लिखित जवाब पढ़ें।",
  speechVoiceError: "आवाज़ नहीं चल पाई। लिखित जवाब उपलब्ध है।"
});
Object.assign(words.kn, {
  demoLoginEyebrow: "ಡೆಮೋ ಪ್ರವೇಶ", demoLoginTitle: "ಸರ್ಕಾರಿ ಸಾಥಿಗೆ ಸೈನ್ ಇನ್ ಮಾಡಿ",
  demoLoginIntro: "ಮಾದರಿಯನ್ನು ತೆರೆಯಲು ಈ ಹಂಚಿಕೆಯ ಡೆಮೋ ಖಾತೆ ಬಳಸಿ. ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಪಾಸ್‌ವರ್ಡ್ ಬಳಸಬೇಡಿ.",
  demoLoginCredentialTitle: "ಸಾರ್ವಜನಿಕ ಡೆಮೋ ಲಾಗಿನ್", demoUsernameLabel: "ಬಳಕೆದಾರ ಹೆಸರು", demoPasswordLabel: "ಪಾಸ್‌ವರ್ಡ್",
  demoLoginNotice: "ಡೆಮೋ ಬಳಕೆ ಮಾತ್ರ. ಖಾತೆ ಅಥವಾ ವೈಯಕ್ತಿಕ ಪಾಸ್‌ವರ್ಡ್ ಉಳಿಸಲಾಗುವುದಿಲ್ಲ.", demoLoginButton: "ಸೈನ್ ಇನ್ ಮಾಡಿ",
  demoLoginError: "ಡೆಮೋ ಬಳಕೆದಾರ ಹೆಸರು ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್ ತಪ್ಪಾಗಿದೆ.", demoLoginNetworkError: "ಸೈನ್ ಇನ್ ಆಗಲಿಲ್ಲ. ಆ್ಯಪ್ ಚಾಲನೆಯಲ್ಲಿದೆಯೇ ಪರಿಶೀಲಿಸಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.", demoLogout: "ಡೆಮೋದಿಂದ ಸೈನ್ ಔಟ್ ಮಾಡಿ",
  agentDemoNeedsDetails: "ಪ್ರಾರಂಭಿಸಲು ನಿಮ್ಮ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ. ಅವು ಈ ಬ್ರೌಸರ್ ಸೆಷನ್‌ನಲ್ಲೇ ಇರುತ್ತವೆ.",
  agentDemoIntakeTitle: "ನಿಮ್ಮ ಅರ್ಜಿ ವಿವರಗಳು", agentDemoIntakeText: "ಸಾಥಿ ಬಳಸಬೇಕಾದ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ. ಅವು ಈ ಬ್ರೌಸರ್‌ನಲ್ಲೇ ಇರುತ್ತವೆ; ಸರ್ವರ್‌ಗೆ ಕಳುಹಿಸುವುದಿಲ್ಲ.",
  agentDemoApplicantLabel: "ಅರ್ಜಿದಾರರ ಹೆಸರು", agentDemoIncomeLabel: "ವಾರ್ಷಿಕ ಕುಟುಂಬ ಆದಾಯ (ಐಚ್ಛಿಕ)",
  agentDemoSchemeLabel: "ಯಾವ ಯೋಜನೆಗೆ ಸಹಾಯ ಬೇಕು", agentDemoPurposeLabel: "ನಿಮಗೆ ಯಾವ ಸಹಾಯ ಬೇಕು?",
  agentDemoChooseOccupation: "ಒಂದನ್ನು ಆಯ್ಕೆಮಾಡಿ", agentDemoOtherOccupation: "ಇತರ ಕೆಲಸ",
  agentDemoPrivacyNote: "ಆಧಾರ್ ಸಂಖ್ಯೆ, ಪಾಸ್‌ವರ್ಡ್, ಬ್ಯಾಂಕ್ ವಿವರ ಅಥವಾ ನಿಜವಾದ OTP ನಮೂದಿಸಬೇಡಿ.",
  agentDemoNotProvided: "ನೀಡಿಲ್ಲ",
  agentDemoBegin: "ಡೆಮೋ ಫಾರ್ಮ್ ತುಂಬಲು ಸಾಥಿಗೆ ಹೇಳಿ", agentDemoFormTitle: "ವರ್ಚುವಲ್ ಅರ್ಜಿ ಫಾರ್ಮ್",
  agentDemoFormIntro: "ನೀವು ನೀಡಿದ ವಿವರಗಳನ್ನು ಸಾಥಿ ಈ ವರ್ಚುವಲ್ ಫಾರ್ಮ್‌ಗೆ ಹಾಕುತ್ತಿದೆ.",
  agentDemoGateText: "ಡೆಮೋ OTPಗಾಗಿ ಯಾವುದೇ ಆರು ಅಂಕಿಗಳನ್ನು ನಮೂದಿಸಿ. ಈ ಸ್ಥಳೀಯ ಪರಿಶೀಲನೆ ಸರ್ಕಾರಿ ಸೇವೆಗೆ ಸಂಪರ್ಕಗೊಂಡಿಲ್ಲ.",
  agentDemoCaptchaLabel: "ಡೆಮೋ ಕೋಡ್", agentDemoCaptchaHelp: "ತೋರಿಸಿದ ಕೋಡ್ ನಮೂದಿಸಿ:",
  agentDemoRefreshCode: "ಹೊಸ ಡೆಮೋ ಕೋಡ್ ಪಡೆಯಿರಿ", agentDemoCodeRefreshed: "ಹೊಸ ಡೆಮೋ ಕೋಡ್ ಸಿದ್ಧವಾಗಿದೆ.",
  agentDemoStartError: "ಡೆಮೋ ಪ್ರಾರಂಭಿಸಲಾಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
  agentDemoInvalid: "ಆರು ಅಂಕಿಯ OTP ಪರಿಶೀಲಿಸಿ ಮತ್ತು ತೋರಿಸಿದ ಡೆಮೋ ಕೋಡ್ ನಮೂದಿಸಿ.",
  speechVoiceUnavailable: "ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಈ ಭಾಷೆಯ ಧ್ವನಿ ಲಭ್ಯವಿಲ್ಲ. ಹೊಂದಾಣಿಕೆಯ ಸಿಸ್ಟಮ್ ಧ್ವನಿ ಸೇರಿಸಿ ಅಥವಾ ಲಿಖಿತ ಉತ್ತರ ಓದಿ.",
  speechVoiceError: "ಧ್ವನಿ ಪ್ಲೇ ಆಗಲಿಲ್ಲ. ಲಿಖಿತ ಉತ್ತರ ಲಭ್ಯವಿದೆ."
});

Object.assign(words.en, {
  agentDemoChooseScheme: "Choose a scheme", agentDemoNotSure: "Not sure / skip", streetVendor: "Street vendor",
  artisan: "Artisan", businessOwner: "Small business owner", educationLevelLabel: "What level are you studying?",
  postMatric: "After Class 10", otherStudy: "Other level", agentDemoEligiblePossible: "Possible match on the listed checks",
  agentDemoEligiblePossibleText: "Your answers match the checks available in this demo. The scheme authority makes the final decision.",
  agentDemoEligibleNo: "A listed requirement is not met", agentDemoEligibleNoText: "This demo will stop here because at least one listed condition does not match your answers.",
  agentDemoEligibleMore: "More information is needed", agentDemoEligibleMoreText: "Some required answers are missing or marked not sure. Edit your details to complete this basic check.",
  agentDemoEligibleConfirm: "Official confirmation is still needed", agentDemoEligibleConfirmText: "No listed mismatch was found, but this demo does not contain every official condition. This is not proof of eligibility.",
  agentDemoRequirementFail: "Does not match", agentDemoRequirementMissing: "Still to confirm", agentDemoEditDetails: "Edit details"
});
Object.assign(words.hi, {
  agentDemoChooseScheme: "योजना चुनें", agentDemoNotSure: "पता नहीं / छोड़ें", streetVendor: "रेहड़ी-पटरी विक्रेता",
  artisan: "कारीगर", businessOwner: "छोटे व्यवसाय के मालिक", educationLevelLabel: "आप किस स्तर पर पढ़ रहे हैं?",
  postMatric: "कक्षा 10 के बाद", otherStudy: "अन्य स्तर", agentDemoEligiblePossible: "सूचीबद्ध जाँच में संभावित मेल",
  agentDemoEligiblePossibleText: "आपके जवाब डेमो में उपलब्ध जाँच से मेल खाते हैं। अंतिम निर्णय योजना विभाग करता है।",
  agentDemoEligibleNo: "सूची की एक शर्त पूरी नहीं होती", agentDemoEligibleNoText: "यह डेमो यहीं रुकेगा क्योंकि कम-से-कम एक सूचीबद्ध शर्त आपके जवाबों से मेल नहीं खाती।",
  agentDemoEligibleMore: "और जानकारी चाहिए", agentDemoEligibleMoreText: "कुछ ज़रूरी जवाब छूटे हैं या ‘पता नहीं’ चुना गया है। जाँच पूरी करने के लिए जानकारी बदलें।",
  agentDemoEligibleConfirm: "सरकारी पुष्टि अभी ज़रूरी है", agentDemoEligibleConfirmText: "सूचीबद्ध शर्तों में कोई मेल न खाने वाली बात नहीं मिली, लेकिन डेमो में सभी सरकारी नियम नहीं हैं। यह पात्रता का प्रमाण नहीं है।",
  agentDemoRequirementFail: "मेल नहीं खाता", agentDemoRequirementMissing: "पुष्टि बाकी है", agentDemoEditDetails: "जानकारी बदलें"
});
Object.assign(words.kn, {
  agentDemoChooseScheme: "ಯೋಜನೆ ಆಯ್ಕೆಮಾಡಿ", agentDemoNotSure: "ತಿಳಿದಿಲ್ಲ / ಬಿಟ್ಟುಬಿಡಿ", streetVendor: "ಬೀದಿ ವ್ಯಾಪಾರಿ",
  artisan: "ಕುಶಲಕರ್ಮಿ", businessOwner: "ಸಣ್ಣ ವ್ಯಾಪಾರದ ಮಾಲೀಕರು", educationLevelLabel: "ನೀವು ಯಾವ ಹಂತದಲ್ಲಿ ಓದುತ್ತಿದ್ದೀರಿ?",
  postMatric: "10ನೇ ತರಗತಿಯ ನಂತರ", otherStudy: "ಬೇರೆ ಹಂತ", agentDemoEligiblePossible: "ಪಟ್ಟಿಯಲ್ಲಿರುವ ಪರಿಶೀಲನೆಯಲ್ಲಿ ಹೊಂದಾಣಿಕೆ ಇರಬಹುದು",
  agentDemoEligiblePossibleText: "ನಿಮ್ಮ ಉತ್ತರಗಳು ಈ ಡೆಮೋದಲ್ಲಿರುವ ಪರಿಶೀಲನೆಗೆ ಹೊಂದುತ್ತವೆ. ಅಂತಿಮ ನಿರ್ಧಾರವನ್ನು ಯೋಜನಾ ಪ್ರಾಧಿಕಾರ ಮಾಡುತ್ತದೆ.",
  agentDemoEligibleNo: "ಪಟ್ಟಿಯಲ್ಲಿರುವ ಒಂದು ನಿಯಮ ಪೂರ್ತಿಯಾಗಿಲ್ಲ", agentDemoEligibleNoText: "ಪಟ್ಟಿಯಲ್ಲಿರುವ ಕನಿಷ್ಠ ಒಂದು ಷರತ್ತು ನಿಮ್ಮ ಉತ್ತರಗಳಿಗೆ ಹೊಂದದ ಕಾರಣ ಈ ಡೆಮೋ ಇಲ್ಲಿ ನಿಲ್ಲುತ್ತದೆ.",
  agentDemoEligibleMore: "ಇನ್ನಷ್ಟು ಮಾಹಿತಿ ಬೇಕು", agentDemoEligibleMoreText: "ಕೆಲವು ಅಗತ್ಯ ಉತ್ತರಗಳು ಇಲ್ಲ ಅಥವಾ ‘ತಿಳಿದಿಲ್ಲ’ ಎಂದು ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ. ಪರಿಶೀಲನೆಗಾಗಿ ವಿವರಗಳನ್ನು ಬದಲಾಯಿಸಿ.",
  agentDemoEligibleConfirm: "ಅಧಿಕೃತ ದೃಢೀಕರಣ ಇನ್ನೂ ಅಗತ್ಯ", agentDemoEligibleConfirmText: "ಪಟ್ಟಿಯಲ್ಲಿರುವ ನಿಯಮಗಳಲ್ಲಿ ಹೊಂದದ ಅಂಶ ಕಂಡುಬಂದಿಲ್ಲ. ಆದರೆ ಡೆಮೋದಲ್ಲಿ ಎಲ್ಲಾ ಅಧಿಕೃತ ನಿಯಮಗಳಿಲ್ಲ. ಇದು ಅರ್ಹತೆಯ ದೃಢೀಕರಣವಲ್ಲ.",
  agentDemoRequirementFail: "ಹೊಂದಾಣಿಕೆಯಾಗಿಲ್ಲ", agentDemoRequirementMissing: "ದೃಢೀಕರಿಸಬೇಕಿದೆ", agentDemoEditDetails: "ವಿವರಗಳನ್ನು ಬದಲಾಯಿಸಿ"
});
Object.assign(words.en, {
  agentDemoIncomeRequired: "Annual household income", ruralResidenceLabel: "Does your household live in a rural area?",
  pmaygSurveyListedLabel: "Is your household included in the PMAY-G survey or list?", urbanResidenceLabel: "Does your household live in an urban area?",
  puccaHouseLabel: "Does your family own a pucca house in India?", recentHousingBenefitLabel: "Was your family allotted a government house in the last 20 years?",
  residentialElectricityLabel: "Do you have a residential electricity connection?", otherBankAccountLabel: "Do you already have another bank account?",
  businessActivityLabel: "Is this credit for an income-generating small business or allied activity?", girlChildLabel: "Is the account for a girl child?",
  girlChildAgeLabel: "Girl child's age", bankAccountLabel: "Do you have an account at a participating bank or post office?",
  pmkvyTrainingTypeLabel: "Choose the PMKVY training route", pmkvyShortTerm: "Short-term training", pmkvySpecial: "Special project",
  pmkvyPriorLearning: "Recognition of prior learning"
});
Object.assign(words.hi, {
  agentDemoIncomeRequired: "परिवार की सालाना आय", ruralResidenceLabel: "क्या आपका परिवार ग्रामीण क्षेत्र में रहता है?",
  pmaygSurveyListedLabel: "क्या आपका परिवार PMAY-G सर्वे या सूची में शामिल है?", urbanResidenceLabel: "क्या आपका परिवार शहरी क्षेत्र में रहता है?",
  puccaHouseLabel: "क्या आपके परिवार के पास भारत में पक्का घर है?", recentHousingBenefitLabel: "क्या पिछले 20 वर्षों में आपके परिवार को सरकारी घर मिला है?",
  residentialElectricityLabel: "क्या आपके पास घरेलू बिजली कनेक्शन है?", otherBankAccountLabel: "क्या आपके पास पहले से कोई दूसरा बैंक खाता है?",
  businessActivityLabel: "क्या यह कर्ज़ छोटे आय वाले व्यवसाय या उससे जुड़ी गतिविधि के लिए है?", girlChildLabel: "क्या खाता बालिका के लिए है?",
  girlChildAgeLabel: "बालिका की उम्र", bankAccountLabel: "क्या आपका खाता किसी भागीदार बैंक या डाकघर में है?",
  pmkvyTrainingTypeLabel: "PMKVY प्रशिक्षण का प्रकार चुनें", pmkvyShortTerm: "कम अवधि का प्रशिक्षण", pmkvySpecial: "विशेष परियोजना",
  pmkvyPriorLearning: "पहले से सीखे कौशल की मान्यता"
});
Object.assign(words.kn, {
  agentDemoIncomeRequired: "ಕುಟುಂಬದ ವಾರ್ಷಿಕ ಆದಾಯ", ruralResidenceLabel: "ನಿಮ್ಮ ಕುಟುಂಬ ಗ್ರಾಮೀಣ ಪ್ರದೇಶದಲ್ಲಿ ವಾಸಿಸುತ್ತಿದೆಯೇ?",
  pmaygSurveyListedLabel: "ನಿಮ್ಮ ಕುಟುಂಬ PMAY-G ಸಮೀಕ್ಷೆ ಅಥವಾ ಪಟ್ಟಿಯಲ್ಲಿ ಇದೆಯೇ?", urbanResidenceLabel: "ನಿಮ್ಮ ಕುಟುಂಬ ನಗರ ಪ್ರದೇಶದಲ್ಲಿ ವಾಸಿಸುತ್ತಿದೆಯೇ?",
  puccaHouseLabel: "ನಿಮ್ಮ ಕುಟುಂಬಕ್ಕೆ ಭಾರತದಲ್ಲಿ ಪಕ್ಕಾ ಮನೆ ಇದೆಯೇ?", recentHousingBenefitLabel: "ಕಳೆದ 20 ವರ್ಷಗಳಲ್ಲಿ ನಿಮ್ಮ ಕುಟುಂಬಕ್ಕೆ ಸರ್ಕಾರಿ ಮನೆ ಮಂಜೂರಾಗಿದೆಯೇ?",
  residentialElectricityLabel: "ನಿಮ್ಮ ಬಳಿ ವಸತಿ ವಿದ್ಯುತ್ ಸಂಪರ್ಕವಿದೆಯೇ?", otherBankAccountLabel: "ನಿಮ್ಮ ಬಳಿ ಈಗಾಗಲೇ ಬೇರೆ ಬ್ಯಾಂಕ್ ಖಾತೆಯಿದೆಯೇ?",
  businessActivityLabel: "ಈ ಸಾಲವು ಆದಾಯ ತರುವ ಸಣ್ಣ ವ್ಯಾಪಾರ ಅಥವಾ ಸಂಬಂಧಿತ ಚಟುವಟಿಕೆಗಾಗಿ ಇದೆಯೇ?", girlChildLabel: "ಈ ಖಾತೆ ಹೆಣ್ಣು ಮಗುವಿಗಾಗಿದೆಯೇ?",
  girlChildAgeLabel: "ಹೆಣ್ಣು ಮಗುವಿನ ವಯಸ್ಸು", bankAccountLabel: "ಭಾಗವಹಿಸುವ ಬ್ಯಾಂಕ್ ಅಥವಾ ಅಂಚೆ ಕಚೇರಿಯಲ್ಲಿ ಖಾತೆಯಿದೆಯೇ?",
  pmkvyTrainingTypeLabel: "PMKVY ತರಬೇತಿ ಮಾರ್ಗ ಆಯ್ಕೆಮಾಡಿ", pmkvyShortTerm: "ಅಲ್ಪಾವಧಿ ತರಬೇತಿ", pmkvySpecial: "ವಿಶೇಷ ಯೋಜನೆ",
  pmkvyPriorLearning: "ಹಿಂದಿನ ಕಲಿಕೆಯ ಮಾನ್ಯತೆ"
});

const categoryNames = {
  agriculture: { en: "Agriculture", hi: "कृषि", kn: "ಕೃಷಿ" },
  education: { en: "Education", hi: "शिक्षा", kn: "ಶಿಕ್ಷಣ" },
  housing: { en: "Housing", hi: "आवास", kn: "ವಸತಿ" },
  health: { en: "Health", hi: "स्वास्थ्य", kn: "ಆರೋಗ್ಯ" },
  employment: { en: "Employment", hi: "रोज़गार", kn: "ಉದ್ಯೋಗ" },
  women: { en: "Women & family", hi: "महिला और परिवार", kn: "ಮಹಿಳೆ ಮತ್ತು ಕುಟುಂಬ" },
  senior: { en: "Senior citizens", hi: "वरिष्ठ नागरिक", kn: "ಹಿರಿಯ ನಾಗರಿಕರು" },
  finance: { en: "Financial help", hi: "वित्तीय सहायता", kn: "ಹಣಕಾಸಿನ ನೆರವು" }
};
const state = {
  schemes: [],
  language: ["en", "hi", "kn"].includes(localStorage.getItem("sarkari-language")) ? localStorage.getItem("sarkari-language") : "en",
  category: "all",
  query: "",
  savedOnly: false,
  saved: new Set(readSaved()),
  comparing: new Set(),
  profile: null,
  demoAuthenticated: false,
  agentDemoApplication: null,
  agentDemoEligibility: null,
  pendingField: "",
  history: [],
  lastNeed: "",
  lastResults: [],
  documentReady: readDocumentProgress(),
  screening: new Map(),
  loading: true
};

const schemeList = document.querySelector("#scheme-list");
const emptyState = document.querySelector("#empty-state");
const profileDialog = document.querySelector("#profile-dialog");
const schemeDialog = document.querySelector("#scheme-dialog");
const compareDialog = document.querySelector("#compare-dialog");
const demoLoginDialog = document.querySelector("#demo-login-dialog");
const searchInput = document.querySelector("#scheme-search");
const assistantInput = document.querySelector("#assistant-input");
const toast = document.querySelector("#toast");
let toastTimer;

function readSaved() {
  try {
    const data = JSON.parse(localStorage.getItem("sarkari-saved") || "[]");
    return Array.isArray(data) ? data.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function t(key) {
  return words[state.language]?.[key] || words.en[key] || key;
}

let agentDemoCompleted = false;
let agentDemoRun = 0;
let agentDemoChallengeId = "";

function showDemoLogin() {
  if (!demoLoginDialog.open) demoLoginDialog.showModal();
  document.querySelector("#demo-login-username").focus({ preventScroll: true });
}

async function initializeDemoAccess() {
  try {
    const response = await fetch("/api/demo/session", { cache: "no-store" });
    if (!response.ok) throw new Error("session check failed");
    const result = await response.json();
    state.demoAuthenticated = result.authenticated === true;
  } catch {
    state.demoAuthenticated = false;
    document.querySelector("#demo-login-status").textContent = t("demoLoginNetworkError");
    document.querySelector("#demo-login-status").hidden = false;
  }
  document.querySelector("#demo-logout").hidden = !state.demoAuthenticated;
  if (!state.demoAuthenticated) showDemoLogin();
}

async function signInToDemo(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const submit = form.querySelector('[type="submit"]');
  const status = document.querySelector("#demo-login-status");
  const values = new FormData(form);
  submit.disabled = true;
  status.hidden = true;
  try {
    const response = await fetch("/api/demo/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username: values.get("username"), password: values.get("password") })
    });
    const result = await response.json();
    if (!response.ok || result.authenticated !== true) {
      status.textContent = response.status === 401 ? t("demoLoginError") : t("demoLoginNetworkError");
      status.hidden = false;
      return;
    }
    state.demoAuthenticated = true;
    document.querySelector("#demo-logout").hidden = false;
    document.querySelector("#demo-login-password").value = "";
    status.textContent = "";
    demoLoginDialog.close();
  } catch {
    status.textContent = t("demoLoginNetworkError");
    status.hidden = false;
  } finally {
    submit.disabled = false;
  }
}

async function signOutOfDemo() {
  try {
    await fetch("/api/demo/logout", { method: "POST" });
  } catch {
    showToast(t("demoLoginNetworkError"));
  } finally {
    state.demoAuthenticated = false;
    state.agentDemoApplication = null;
    agentDemoChallengeId = "";
    document.querySelector("#demo-logout").hidden = true;
    document.querySelector("#agent-demo-profile-form").reset();
    document.querySelector("#agent-demo-dialog").close();
    showDemoLogin();
  }
}

function setAgentDemoStage(current) {
  document.querySelectorAll("[data-agent-step]").forEach((step, index) => {
    step.dataset.state = index < current ? "complete" : index === current ? "current" : "pending";
  });
}

const eligibilityFieldLabels = {
  age: "ageLabel", gender: "genderLabel", occupation: "occupationLabel", cultivableLand: "landLabel",
  poorHousehold: "poorLabel", householdLpg: "lpgLabel", incomeTaxPayer: "taxLabel", publicEmployment: "employmentLabel",
  monthlyPension: "pensionLabel", registeredProfessional: "professionalLabel", institutionalLand: "institutionalLabel",
  pmjayListed: "listedLabel", educationLevel: "educationLevelLabel", annualIncome: "agentDemoIncomeRequired",
  ruralResidence: "ruralResidenceLabel", pmaygSurveyListed: "pmaygSurveyListedLabel", urbanResidence: "urbanResidenceLabel",
  puccaHouse: "puccaHouseLabel", recentHousingBenefit: "recentHousingBenefitLabel", residentialElectricity: "residentialElectricityLabel",
  otherBankAccount: "otherBankAccountLabel", businessActivity: "businessActivityLabel", girlChild: "girlChildLabel",
  girlChildAge: "girlChildAgeLabel", bankAccount: "bankAccountLabel", pmkvyTrainingType: "pmkvyTrainingTypeLabel"
};

function selectedDemoScheme() {
  const schemeId = document.querySelector("#agent-demo-scheme").value;
  return state.schemes.find((scheme) => scheme.id === schemeId);
}

function renderAgentDemoSchemeOptions() {
  const select = document.querySelector("#agent-demo-scheme");
  const current = select.value;
  select.replaceChildren(new Option(t("agentDemoChooseScheme"), ""));
  state.schemes.forEach((scheme) => select.add(new Option(localizedSchemeName(scheme), scheme.id)));
  select.value = state.schemes.some((scheme) => scheme.id === current) ? current : "";
}

function renderAgentDemoQuestions() {
  const form = document.querySelector("#agent-demo-profile-form");
  const scheme = selectedDemoScheme();
  const rules = scheme?.eligibilityRules || scheme?.rules || {};
  const conditions = [...(rules.all || []), ...(rules.any || []), ...(rules.exclude || [])];
  const requiredFields = new Set(conditions.map((condition) => condition.field));
  const ageInput = form.elements.age;
  const genderSelect = form.elements.gender;
  const incomeInput = form.elements.annualIncome;
  ageInput.required = requiredFields.has("age");
  genderSelect.required = requiredFields.has("gender");
  incomeInput.required = requiredFields.has("annualIncome");
  document.querySelector("#agent-demo-income-label").textContent = t(incomeInput.required ? "agentDemoIncomeRequired" : "agentDemoIncomeLabel");

  const definitions = {
    cultivableLand: { label: "landLabel", options: [["yes", "yes"], ["no", "no"]] },
    poorHousehold: { label: "poorLabel", options: [["yes", "yes"], ["no", "no"]] },
    householdLpg: { label: "lpgLabel", options: [["yes", "yes"], ["no", "no"]] },
    incomeTaxPayer: { label: "taxLabel", options: [["yes", "yes"], ["no", "no"]] },
    publicEmployment: { label: "employmentLabel", options: [["none", "none"], ["regular", "regularEmployee"], ["group-d", "groupD"]] },
    monthlyPension: { label: "pensionLabel", options: [["over-10000", "yes"], ["under-10000", "no"]] },
    registeredProfessional: { label: "professionalLabel", options: [["yes", "yes"], ["no", "no"]] },
    institutionalLand: { label: "institutionalLabel", options: [["yes", "yes"], ["no", "no"]] },
    pmjayListed: { label: "listedLabel", options: [["yes", "yes"], ["no", "no"]] },
    educationLevel: { label: "educationLevelLabel", options: [["post-matric", "postMatric"], ["other", "otherStudy"]] },
    ruralResidence: { label: "ruralResidenceLabel", options: [["yes", "yes"], ["no", "no"]] },
    pmaygSurveyListed: { label: "pmaygSurveyListedLabel", options: [["yes", "yes"], ["no", "no"]] },
    urbanResidence: { label: "urbanResidenceLabel", options: [["yes", "yes"], ["no", "no"]] },
    puccaHouse: { label: "puccaHouseLabel", options: [["yes", "yes"], ["no", "no"]] },
    recentHousingBenefit: { label: "recentHousingBenefitLabel", options: [["yes", "yes"], ["no", "no"]] },
    residentialElectricity: { label: "residentialElectricityLabel", options: [["yes", "yes"], ["no", "no"]] },
    otherBankAccount: { label: "otherBankAccountLabel", options: [["yes", "yes"], ["no", "no"]] },
    businessActivity: { label: "businessActivityLabel", options: [["yes", "yes"], ["no", "no"]] },
    girlChild: { label: "girlChildLabel", options: [["yes", "yes"], ["no", "no"]] },
    bankAccount: { label: "bankAccountLabel", options: [["yes", "yes"], ["no", "no"]] },
    pmkvyTrainingType: { label: "pmkvyTrainingTypeLabel", options: [["stt", "pmkvyShortTerm"], ["special", "pmkvySpecial"], ["rpl", "pmkvyPriorLearning"]] },
    girlChildAge: { label: "girlChildAgeLabel", type: "number", min: 0, max: 9 }
  };
  const container = document.querySelector("#agent-demo-dynamic-fields");
  const previous = Object.fromEntries([...container.querySelectorAll("select, input")].map((input) => [input.name, input.value]));
  container.replaceChildren();
  const extraFields = [...new Set(conditions.map((condition) => condition.field))]
    .filter((field) => !["age", "gender", "occupation"].includes(field));
  for (const field of extraFields) {
    const definition = definitions[field];
    if (!definition) continue;
    const label = document.createElement("label");
    const caption = document.createElement("span");
    caption.textContent = t(definition.label);
    let control;
    if (definition.type === "number") {
      control = document.createElement("input");
      control.type = "number";
      control.min = String(definition.min);
      control.max = String(definition.max);
      control.inputMode = "numeric";
      control.value = previous[field] || "";
    } else {
      control = document.createElement("select");
      control.add(new Option(t("agentDemoNotSure"), "unknown"));
      definition.options.forEach(([value, key]) => control.add(new Option(t(key), value)));
      control.value = definition.options.some(([value]) => value === previous[field]) ? previous[field] : "unknown";
    }
    control.name = field;
    control.required = true;
    label.append(caption, control);
    container.append(label);
  }
}

function renderAgentDemoEligibility(result = state.agentDemoEligibility) {
  if (!result) return;
  const panel = document.querySelector("#agent-demo-eligibility");
  const titles = {
    "possible-match": "agentDemoEligiblePossible", unlikely: "agentDemoEligibleNo",
    "needs-information": "agentDemoEligibleMore", "needs-confirmation": "agentDemoEligibleConfirm"
  };
  const messages = {
    "possible-match": "agentDemoEligiblePossibleText", unlikely: "agentDemoEligibleNoText",
    "needs-information": "agentDemoEligibleMoreText", "needs-confirmation": "agentDemoEligibleConfirmText"
  };
  document.querySelector("#agent-demo-eligibility-title").textContent = t(titles[result.status]);
  document.querySelector("#agent-demo-eligibility-message").textContent = t(messages[result.status]);
  const fieldList = document.querySelector("#agent-demo-eligibility-fields");
  fieldList.replaceChildren();
  const blocked = result.status === "unlikely" || result.status === "needs-information";
  const fields = result.status === "unlikely"
    ? [...new Set([...(result.unmetFields || []), ...(result.triggeredFields || [])])]
    : result.status === "needs-information" ? [...new Set(result.missingFields || [])] : [];
  fields.forEach((field) => {
    const item = document.createElement("li");
    const label = t(eligibilityFieldLabels[field] || field);
    item.textContent = `${t(blocked && result.status === "unlikely" ? "agentDemoRequirementFail" : "agentDemoRequirementMissing")}: ${label}`;
    fieldList.append(item);
  });
  panel.dataset.status = result.status;
  panel.hidden = false;
  document.querySelector("#agent-demo-edit-details").hidden = !blocked;
}

function setAgentDemoStatus(message) {
  const status = document.querySelector("#agent-demo-status");
  status.textContent = message;
  status.hidden = !message;
}

function showAgentDemoReceipt(reference) {
  document.querySelector("#dashboard-need").textContent = t("agentDemoDashboardNeed");
  document.querySelector("#dashboard-schemes").textContent = t("agentDemoDashboardSchemes");
  document.querySelector("#dashboard-eligibility").textContent = t("agentDemoDashboardEligibility");
  document.querySelector("#dashboard-documents").textContent = t("agentDemoDashboardDocuments");
  document.querySelector("#dashboard-next").textContent = t("agentDemoDashboardNext");

  const receipt = document.querySelector("#agent-demo-receipt");
  receipt.replaceChildren();
  const heading = document.createElement("h3");
  heading.textContent = t("agentDemoReceiptTitle");
  const message = document.createElement("p");
  message.textContent = t("agentDemoReceiptText");
  const code = document.createElement("p");
  code.textContent = `${t("agentDemoReference")}: ${reference}`;
  receipt.append(heading, message, code);
  receipt.hidden = false;
  const modalReceipt = document.querySelector("#agent-demo-modal-receipt");
  const modalHeading = document.createElement("h3");
  modalHeading.textContent = t("agentDemoReceiptTitle");
  const modalMessage = document.createElement("p");
  modalMessage.textContent = t("agentDemoReceiptText");
  const modalCode = document.createElement("p");
  modalCode.textContent = `${t("agentDemoReference")}: ${reference}`;
  modalReceipt.replaceChildren(modalHeading, modalMessage, modalCode);
  modalReceipt.hidden = false;
  document.querySelector("#journey-dashboard").hidden = false;
  setAgentDemoStage(5);
  setAgentDemoStatus(t("agentDemoComplete"));
  document.querySelector("#agent-demo-modal-status").textContent = t("agentDemoComplete");
  document.querySelector("#journey-dashboard").scrollIntoView({ behavior: "smooth", block: "start" });
}

function startAgentDemo() {
  const button = document.querySelector("#start-agent-demo");
  const dialog = document.querySelector("#agent-demo-dialog");
  if (!state.demoAuthenticated) {
    showDemoLogin();
    return;
  }
  if (dialog.open) return;
  agentDemoRun += 1;
  agentDemoCompleted = false;
  state.agentDemoApplication = null;
  agentDemoChallengeId = "";
  document.querySelector("#agent-demo-receipt").hidden = true;
  document.querySelector("#agent-demo-modal-receipt").hidden = true;
  document.querySelector("#agent-demo-intake").hidden = false;
  document.querySelector("#agent-demo-output").hidden = true;
  document.querySelector("#agent-demo-eligibility").hidden = true;
  document.querySelector("#agent-demo-verification").hidden = true;
  document.querySelector("#agent-demo-document").hidden = true;
  document.querySelector("#agent-demo-profile-form").reset();
  state.agentDemoEligibility = null;
  renderAgentDemoQuestions();
  document.querySelectorAll("[data-agent-field]").forEach((field) => { field.value = ""; });
  document.querySelector("#agent-demo-progress").value = 0;
  document.querySelector("#agent-demo-otp").value = "";
  document.querySelector("#agent-demo-captcha").value = "";
  document.querySelector("#agent-demo-captcha-code").textContent = "-----";
  document.querySelector("#agent-demo-otp").disabled = false;
  document.querySelector("#agent-demo-captcha").disabled = false;
  document.querySelector("#submit-agent-demo").disabled = true;
  setAgentDemoStage(0);
  button.disabled = true;
  setAgentDemoStatus("");
  document.querySelector("#agent-demo-modal-status").textContent = t("agentDemoNeedsDetails");
  dialog.showModal();
  document.querySelector('#agent-demo-profile-form [name="applicant"]').focus({ preventScroll: true });
}

async function beginAgentDemo(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const submit = document.querySelector("#agent-demo-begin");
  const values = Object.fromEntries(new FormData(form).entries());
  const scheme = state.schemes.find((item) => item.id === values.schemeId);
  if (!scheme) return;
  const occupation = form.elements.occupation;
  const locale = ({ en: "en-IN", hi: "hi-IN", kn: "kn-IN" })[state.language];
  const gender = form.elements.gender;
  const profile = { ...values, age: values.age ? Number(values.age) : "unknown" };
  state.agentDemoEligibility = evaluateSchemeEligibility(scheme, profile);
  state.agentDemoApplication = {
    applicant: values.applicant.trim(),
    state: values.state.trim(),
    district: values.district.trim(),
    occupation: occupation.options[occupation.selectedIndex].textContent.trim(),
    age: values.age || t("agentDemoNotProvided"),
    gender: gender.value === "unknown" ? t("agentDemoNotSure") : gender.options[gender.selectedIndex].textContent.trim(),
    annualIncome: values.annualIncome
      ? new Intl.NumberFormat(locale, { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(values.annualIncome))
      : t("agentDemoNotProvided"),
    scheme: localizedSchemeName(scheme),
    purpose: values.purpose.trim()
  };
  submit.disabled = true;
  document.querySelector("#agent-demo-modal-status").textContent = t("agentDemoOpening");
  try {
    await refreshAgentDemoChallenge();
    if (!state.demoAuthenticated) return;
    document.querySelector("#agent-demo-intake").hidden = true;
    document.querySelector("#agent-demo-output").hidden = false;
    document.querySelector("#agent-demo-modal-status").textContent = t("agentDemoOpening");
    await runAgentDemo(++agentDemoRun);
  } catch {
    state.agentDemoApplication = null;
    document.querySelector("#agent-demo-modal-status").textContent = t("agentDemoStartError");
  } finally {
    submit.disabled = false;
  }
}

async function refreshAgentDemoChallenge(announce = false) {
  const refresh = document.querySelector("#refresh-agent-demo-captcha");
  const captchaInput = document.querySelector("#agent-demo-captcha");
  agentDemoChallengeId = "";
  document.querySelector("#agent-demo-captcha-code").textContent = "-----";
  captchaInput.value = "";
  refresh.disabled = true;
  captchaInput.disabled = true;
  document.querySelector("#submit-agent-demo").disabled = true;
  try {
    const response = await fetch("/api/demo/challenge", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{}",
      cache: "no-store"
    });
    const result = await response.json();
    if (response.status === 401) {
      state.demoAuthenticated = false;
      document.querySelector("#agent-demo-dialog").close();
      showDemoLogin();
      return;
    }
    if (!response.ok || typeof result.challengeId !== "string" || typeof result.challenge !== "string") throw new Error("challenge failed");
    agentDemoChallengeId = result.challengeId;
    captchaInput.value = "";
    document.querySelector("#agent-demo-captcha-code").textContent = result.challenge;
    if (announce) showToast(t("agentDemoCodeRefreshed"));
  } finally {
    refresh.disabled = false;
    captchaInput.disabled = !state.demoAuthenticated;
    updateAgentDemoSubmit();
  }
}

async function runAgentDemo(run) {
  const fieldStage = [0, 1, 1, 2, 2, 2, 3, 3, 3];
  let stage = 0;
  const fields = Object.entries(state.agentDemoApplication || {});
  const progress = document.querySelector("#agent-demo-progress");
  progress.max = fields.length;
  for (let index = 0; index < fields.length; index += 1) {
    await new Promise((resolve) => setTimeout(resolve, 170));
    const dialog = document.querySelector("#agent-demo-dialog");
    if (run !== agentDemoRun || !dialog.open) return;
    if (fieldStage[index] !== stage) {
      stage = fieldStage[index];
      setAgentDemoStage(stage);
    }
    const [key, value] = fields[index];
    document.querySelector(`[data-agent-field="${key}"]`).value = value;
    progress.value = index + 1;
    const status = `${t("agentDemoFilling")} ${index + 1}/${fields.length}`;
    document.querySelector("#agent-demo-modal-status").textContent = status;
    setAgentDemoStatus(status);
  }
  renderAgentDemoEligibility();
  const result = state.agentDemoEligibility;
  const blocked = result.status === "unlikely" || result.status === "needs-information";
  setAgentDemoStage(blocked ? 2 : 4);
  document.querySelector("#agent-demo-document").hidden = blocked;
  document.querySelector("#agent-demo-verification").hidden = blocked;
  const status = blocked ? t(result.status === "unlikely" ? "agentDemoEligibleNo" : "agentDemoEligibleMore") : t("agentDemoGateReady");
  document.querySelector("#agent-demo-modal-status").textContent = status;
  setAgentDemoStatus(status);
  if (!blocked) {
    document.querySelector("#agent-demo-verification").scrollIntoView({ behavior: "smooth", block: "nearest" });
    document.querySelector("#agent-demo-otp").focus({ preventScroll: true });
  } else {
    document.querySelector("#agent-demo-eligibility").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

function updateAgentDemoSubmit() {
  const otp = document.querySelector("#agent-demo-otp");
  const captcha = document.querySelector("#agent-demo-captcha");
  document.querySelector("#submit-agent-demo").disabled = !agentDemoChallengeId || !/^\d{6}$/.test(otp.value) || captcha.value.trim().toUpperCase() !== document.querySelector("#agent-demo-captcha-code").textContent;
}

async function submitAgentDemo(event) {
  event.preventDefault();
  const otp = document.querySelector("#agent-demo-otp");
  const captcha = document.querySelector("#agent-demo-captcha");
  const submit = document.querySelector("#submit-agent-demo");
  if (submit.disabled) {
    document.querySelector("#agent-demo-modal-status").textContent = t("agentDemoInvalid");
    return;
  }
  submit.disabled = true;
  otp.disabled = true;
  captcha.disabled = true;
  document.querySelector("#agent-demo-modal-status").textContent = t("agentDemoSubmitting");
  try {
    const response = await fetch("/api/demo/submit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ otp: otp.value, captcha: captcha.value, challengeId: agentDemoChallengeId })
    });
    const result = await response.json();
    if (response.status === 401) {
      state.demoAuthenticated = false;
      document.querySelector("#agent-demo-dialog").close();
      showDemoLogin();
      return;
    }
    if (!response.ok || result.status !== "simulated" || !/^DEMO-[A-Z0-9]{8}$/.test(result.reference || "")) throw new Error("Demo gate failed");
    agentDemoCompleted = true;
    agentDemoChallengeId = "";
    showAgentDemoReceipt(result.reference);
  } catch {
    otp.disabled = false;
    captcha.disabled = false;
    updateAgentDemoSubmit();
    document.querySelector("#agent-demo-modal-status").textContent = t("agentDemoInvalid");
  }
}

document.querySelector("#agent-demo-dialog").addEventListener("close", () => {
  agentDemoRun += 1;
  document.querySelector("#start-agent-demo").disabled = false;
  state.agentDemoApplication = null;
  state.agentDemoEligibility = null;
  agentDemoChallengeId = "";
  document.querySelector("#agent-demo-profile-form").reset();
  renderAgentDemoQuestions();
  document.querySelectorAll("[data-agent-field]").forEach((field) => { field.value = ""; });
  if (!agentDemoCompleted) setAgentDemoStatus("");
});

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function applyLanguage() {
  document.documentElement.lang = state.language;
  document.querySelector("#language").value = state.language;
  document.querySelector("#welcome-language").value = state.language;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = t(element.dataset.i18n);
    if (value) element.textContent = value;
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
  });
  document.querySelector(".welcome-image img").alt = t("photoAlt");
  document.querySelector(".saved-filter").title = state.savedOnly ? t("showAll") : t("savedOnly");
  document.querySelector(".saved-filter").setAttribute("aria-label", state.savedOnly ? t("showAll") : t("savedOnly"));
  document.querySelector(".mobile-menu").setAttribute("aria-label", state.language === "en" ? "Open navigation" : state.language === "hi" ? "नेविगेशन खोलें" : "ನ್ಯಾವಿಗೇಶನ್ ತೆರೆಯಿರಿ");
  document.querySelector("#demo-logout").title = t("demoLogout");
  document.querySelector("#voice-search").title = state.language === "en" ? "Search by voice" : state.language === "hi" ? "आवाज़ से खोजें" : "ಧ್ವನಿಯಿಂದ ಹುಡುಕಿ";
  renderAgentDemoSchemeOptions();
  renderAgentDemoQuestions();
  renderAgentDemoEligibility();
  renderSchemes();
}

function categoryName(category) {
  return categoryNames[category]?.[state.language] || categoryNames[category]?.en || category;
}

function localizedSchemeName(scheme) {
  return scheme.localNames?.[state.language] || scheme.name;
}

function filteredSchemes() {
  const query = state.query.trim().toLocaleLowerCase();
  return state.schemes.filter((scheme) => {
    if (state.category !== "all" && scheme.category !== state.category) return false;
    if (state.savedOnly && !state.saved.has(scheme.id)) return false;
    if (!query) return true;
    const text = [scheme.name, ...Object.values(scheme.localNames || {}), scheme.categoryLabel, categoryName(scheme.category), scheme.benefit, scheme.badge, ...scheme.eligibility].join(" ").toLocaleLowerCase();
    return text.includes(query);
  });
}

function statusLabel(status) {
  return ({ "possible-match": t("possibleMatch"), unlikely: t("unlikely"), "needs-information": t("needsInformation"), "needs-confirmation": t("needsConfirmation") })[status] || "";
}

function statusSummary(status) {
  return ({ "possible-match": t("resultMatch"), unlikely: t("resultUnlikely"), "needs-information": t("resultNeeds"), "needs-confirmation": t("resultConfirm") })[status] || "";
}

function bookmarkIcon() {
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4.75A1.75 1.75 0 0 1 7.75 3h8.5A1.75 1.75 0 0 1 18 4.75V21l-6-3.7L6 21V4.75Z"/></svg>';
}

function compareIcon() {
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14M5 10h14M5 15h8M5 20h8"/><path d="M17 15v6m-3-3h6"/></svg>';
}

function renderSchemes() {
  if (state.loading) {
    schemeList.setAttribute("aria-busy", "true");
    emptyState.hidden = true;
    return;
  }
  const filtered = filteredSchemes();
  const count = document.querySelector("#result-count");
  count.textContent = `${filtered.length} ${t("schemeCount")}`;
  schemeList.setAttribute("aria-busy", "false");
  document.querySelector(".saved-filter").setAttribute("aria-pressed", String(state.savedOnly));
  document.querySelector("#clear-search").hidden = false;
  if (state.savedOnly && state.saved.size === 0) {
    document.querySelector("#empty-state h3").textContent = t("noSaved");
    document.querySelector("#empty-state p").textContent = t("savedEmpty");
  } else {
    document.querySelector("#empty-state h3").textContent = t("noResults");
    document.querySelector("#empty-state p").textContent = t("tryAnother");
  }
  emptyState.hidden = filtered.length > 0;
  schemeList.innerHTML = filtered.map((scheme) => {
    const saved = state.saved.has(scheme.id);
    const compared = state.comparing.has(scheme.id);
    const screening = state.screening.get(scheme.id);
    return `<article class="scheme-card" data-scheme-card="${escapeHtml(scheme.id)}">
      <div class="scheme-topline"><span class="scheme-category" data-kind="${escapeHtml(scheme.category)}">${escapeHtml(categoryName(scheme.category))}</span>
        <button type="button" class="icon-button save-scheme" data-save-id="${escapeHtml(scheme.id)}" aria-label="${saved ? escapeHtml(t("unsaveScheme")) : escapeHtml(t("saveScheme"))}" aria-pressed="${saved}" title="${saved ? escapeHtml(t("unsaveScheme")) : escapeHtml(t("saveScheme"))}">${bookmarkIcon()}</button>
      </div>
      <h3>${escapeHtml(localizedSchemeName(scheme))}</h3>
      <span class="scheme-badge">${escapeHtml(scheme.badge)}</span>
      <p class="scheme-benefit">${escapeHtml(scheme.benefit)}</p>
      ${screening ? `<div class="screening-box" data-status="${escapeHtml(screening.status)}"><h3>${escapeHtml(t("possibleScreening"))}: ${escapeHtml(statusLabel(screening.status))}</h3><p>${escapeHtml(statusSummary(screening.status))}</p></div>` : ""}
      <div class="scheme-meta"><span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>${escapeHtml(scheme.complexity)}</span><span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5"/></svg>${escapeHtml(scheme.documents.length)} ${escapeHtml(t("documentsHeading").toLocaleLowerCase())}</span></div>
      <div class="scheme-actions"><button class="text-button" type="button" data-open-scheme="${escapeHtml(scheme.id)}">${escapeHtml(t("details"))} <span aria-hidden="true">→</span></button>
        <button class="compare-toggle" type="button" data-compare-id="${escapeHtml(scheme.id)}" aria-pressed="${compared}" aria-label="${compared ? escapeHtml(t("removeCompare")) : escapeHtml(t("compare"))}">${compareIcon()}<span>${escapeHtml(compared ? t("removeCompare") : t("compare"))}</span></button></div>
    </article>`;
  }).join("");
  updateCompareDock();
}

function updateCompareDock() {
  const dock = document.querySelector("#compare-dock");
  const count = state.comparing.size;
  dock.hidden = count === 0;
  document.querySelector("#compare-summary").textContent = `${count} ${t("schemeCount")}`;
  document.querySelector("#compare-open").disabled = count < 2;
  document.querySelector("#compare-open").title = count < 2 ? t("compareLimit") : t("compareNow");
}

function closeButton() {
  return `<button class="icon-button dialog-close" type="button" data-close-dialog aria-label="${escapeHtml(t("close"))}" title="${escapeHtml(t("close"))}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>`;
}

function saveButton(scheme) {
  const saved = state.saved.has(scheme.id);
  return `<button type="button" class="icon-button save-scheme" data-save-id="${escapeHtml(scheme.id)}" aria-label="${escapeHtml(saved ? t("unsaveScheme") : t("saveScheme"))}" aria-pressed="${saved}" title="${escapeHtml(saved ? t("unsaveScheme") : t("saveScheme"))}">${bookmarkIcon()}</button>`;
}

function openScheme(id) {
  const scheme = state.schemes.find((item) => item.id === id);
  if (!scheme) return;
  const screening = state.screening.get(id);
  const content = document.querySelector("#scheme-dialog-content");
  const phoneLink = scheme.helpline.phone ? `<a href="tel:${escapeHtml(scheme.helpline.phone)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 3.5h3l1.5 4-2 1.5a13 13 0 0 0 5.9 5.9l1.5-2 4 1.5v3c0 1.1-.9 2-2 2C10.4 18.8 5.2 13.6 4.6 5.5c0-1.1.9-2 2-2Z"/></svg>${escapeHtml(scheme.helpline.label)} ${escapeHtml(scheme.helpline.phone)}</a>` : `<a href="${escapeHtml(scheme.helpline.url)}" target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6m0-6-9 9"/><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"/></svg>${escapeHtml(scheme.helpline.label)}</a>`;
  content.innerHTML = `<div class="scheme-dialog-content">
    <div class="scheme-dialog-heading"><div><p class="eyebrow">${escapeHtml(categoryName(scheme.category))} · ${escapeHtml(scheme.complexity)}</p><h2>${escapeHtml(localizedSchemeName(scheme))}</h2></div>${saveButton(scheme)}${closeButton()}</div>
    <p class="scheme-dialog-benefit">${escapeHtml(scheme.benefit)}</p>
    ${screening ? `<div class="screening-box" data-status="${escapeHtml(screening.status)}"><h3>${escapeHtml(t("possibleScreening"))}: ${escapeHtml(statusLabel(screening.status))}</h3><p>${escapeHtml(statusSummary(screening.status))}</p>${screening.missing?.length ? `<ul class="missing-list">${screening.missing.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}${screening.triggered?.length ? `<ul class="missing-list">${screening.triggered.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}</div>` : ""}
    <div class="scheme-detail-grid">
      <section><h3>${escapeHtml(t("eligibilityHeading"))}</h3><ul>${scheme.eligibility.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
      <section><h3>${escapeHtml(t("documentsHeading"))}</h3><p class="document-progress" id="document-progress-${escapeHtml(scheme.id)}"><span></span><button class="text-button" type="button" data-clear-progress-id="${escapeHtml(scheme.id)}" hidden>${escapeHtml(t("clearProgress"))}</button></p><p class="progress-saved-note">${escapeHtml(t("progressSaved"))}</p><ul class="document-checklist">${scheme.documents.map((item, index) => `<li><label><input type="checkbox" data-document-id="${escapeHtml(scheme.id)}:${index}" aria-label="${escapeHtml(item)}" ${state.documentReady.get(scheme.id)?.has(item) ? "checked" : ""}><span>${escapeHtml(item)}</span></label></li>`).join("")}</ul></section>
      <section class="detail-wide application-plan"><h3>${escapeHtml(t("stepsHeading"))}</h3><p>${escapeHtml(scheme.applicationMethod)}</p><ol class="guide-steps" id="guide-steps-${escapeHtml(scheme.id)}">${scheme.steps.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol><button class="outline-button" type="button" data-guide-id="${escapeHtml(scheme.id)}">${escapeHtml(t("generateGuide"))}</button></section>
      <section class="detail-wide"><h3>${escapeHtml(t("contactHeading"))}</h3><p>${escapeHtml(scheme.helpline.note)}</p></section>
      <section class="detail-wide"><h3>${escapeHtml(t("sourceCaution"))}</h3><p>${escapeHtml(scheme.stateAvailability)}</p><p class="review-date">${escapeHtml(scheme.lastReviewed)} · ${escapeHtml(t("sourceLink"))}</p></section>
    </div>
    <div class="detail-links"><a href="${escapeHtml(scheme.officialUrl)}" target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6m0-6-9 9"/><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"/></svg>${escapeHtml(t("officialSource"))}</a>${phoneLink}<a href="${escapeHtml(scheme.sourceUrl)}" target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6m0-6-9 9"/><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"/></svg>${escapeHtml(t("sourceLink"))}</a></div>
  </div>`;
  schemeDialog.showModal();
  updateDocumentProgress(scheme.id);
}

function updateDocumentProgress(schemeId) {
  const scheme = state.schemes.find((item) => item.id === schemeId);
  const output = document.querySelector(`#document-progress-${CSS.escape(schemeId)}`);
  if (!scheme || !output) return;
  const checked = new Set(scheme.documents.filter((document) => state.documentReady.get(schemeId)?.has(document)));
  output.querySelector("span").textContent = `${checked.size} / ${scheme.documents.length} ${t("documentsReady").toLocaleLowerCase()}`;
  output.querySelector("[data-clear-progress-id]").hidden = checked.size === 0;
}

async function buildApplicationGuide(schemeId) {
  const target = document.querySelector(`#guide-steps-${CSS.escape(schemeId)}`);
  if (!target) return;
  const button = document.querySelector(`[data-guide-id="${CSS.escape(schemeId)}"]`);
  if (button) button.disabled = true;
  try {
    const response = await fetch("/api/application-guide", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ schemeId, profile: state.profile || {} })
    });
    const { guide } = await response.json();
    if (!response.ok) throw new Error(guide?.error || t("assistantError"));
    target.innerHTML = guide.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("");
    target.parentElement.querySelectorAll(".dashboard-next, .read-response").forEach((item) => item.remove());
    const summary = document.createElement("p");
    summary.className = "dashboard-next";
    summary.textContent = guide.screeningNote;
    target.after(summary);
    const listen = document.createElement("button");
    listen.className = "read-response icon-button";
    listen.type = "button";
    listen.title = t("readAnswer");
    listen.setAttribute("aria-label", t("readAnswer"));
    listen.dataset.speakText = [...guide.steps, guide.screeningNote].join(". ");
    listen.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h3l4 3V7l-4 3H4Z"/><path d="M15 9a4 4 0 0 1 0 6m2.5-8a7 7 0 0 1 0 10"/></svg>';
    summary.after(listen);
  } catch (error) {
    showToast(error.message || t("assistantError"));
  } finally {
    if (button) button.disabled = false;
  }
}

async function openCompare() {
  const selected = state.schemes.filter((scheme) => state.comparing.has(scheme.id)).slice(0, 3);
  if (selected.length < 2) return;
  let comparison = selected;
  try {
    const response = await fetch("/api/schemes/compare", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ schemeIds: selected.map((scheme) => scheme.id) })
    });
    const result = await response.json();
    if (response.ok && Array.isArray(result.schemes)) comparison = result.schemes;
  } catch {
    showToast(t("assistantError"));
  }
  const rows = [
    [t("categoryLabel"), (scheme) => categoryName(scheme.category)],
    [t("benefitLabel"), (scheme) => scheme.benefit],
    [t("whoLabel"), (scheme) => `<ul>${scheme.eligibility.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`],
    [t("documentsHeading"), (scheme) => `<ul>${scheme.documents.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`],
    [t("methodLabel"), (scheme) => scheme.applicationMethod],
    [t("complexityLabel"), (scheme) => scheme.complexity],
    [t("officialSource"), (scheme) => `<a class="official-link" href="${escapeHtml(scheme.officialUrl)}" target="_blank" rel="noreferrer">${escapeHtml(t("officialSource"))}</a>`]
  ];
  document.querySelector("#compare-dialog-content").innerHTML = `<div class="compare-table-wrap"><div class="dialog-header"><div><p class="eyebrow">${escapeHtml(t("catalogEyebrow"))}</p><h2>${escapeHtml(t("compareHeading"))}</h2></div>${closeButton()}</div><table class="compare-table"><thead><tr><th></th>${comparison.map((scheme) => `<th>${escapeHtml(scheme.name)}</th>`).join("")}</tr></thead><tbody>${rows.map(([label, value]) => `<tr><th>${escapeHtml(label)}</th>${comparison.map((scheme) => { const cell = value(scheme); return `<td>${String(cell).startsWith("<ul>") || String(cell).startsWith("<a ") ? cell : escapeHtml(cell)}</td>`; }).join("")}</tr>`).join("")}</tbody></table><p class="compare-footnote">${escapeHtml(t("sourceCaution"))}</p></div>`;
  compareDialog.showModal();
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("visible");
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 3200);
}

function openProfile() {
  const form = document.querySelector("#profile-form");
  if (state.profile) {
    for (const [key, value] of Object.entries(state.profile)) {
      const field = form.elements.namedItem(key);
      if (field) field.value = value;
    }
  }
  profileDialog.showModal();
}

function updateDashboard(result) {
  const dashboard = document.querySelector("#journey-dashboard");
  const schemes = (result.schemes || []).map((item) => state.schemes.find((scheme) => scheme.id === (item.id || item.schemeId))).filter(Boolean);
  state.lastResults = schemes;
  if (!schemes.length && !state.profile?.need) return;
  dashboard.hidden = false;
  const need = state.profile?.need || state.lastNeed || "";
  document.querySelector("#dashboard-need").textContent = categoryName(need) || t("myNeed");
  document.querySelector("#dashboard-schemes").textContent = String(schemes.length);
  const statuses = result.eligibility || [];
  const possible = statuses.filter((item) => item.status === "possible-match").length;
  const confirm = statuses.filter((item) => ["needs-information", "needs-confirmation"].includes(item.status)).length;
  document.querySelector("#dashboard-eligibility").textContent = possible ? `${possible} ${t("possibleMatch").toLocaleLowerCase()}` : confirm ? `${confirm} ${t("needsConfirmation").toLocaleLowerCase()}` : "—";
  const first = schemes[0];
  const ready = first ? first.documents.filter((document) => state.documentReady.get(first.id)?.has(document)).length : 0;
  document.querySelector("#dashboard-documents").textContent = first ? `${ready}/${first.documents.length}` : "—";
  document.querySelector("#dashboard-next").textContent = result.question ? `${t("nextStep")}: ${result.question}` : first ? `${t("nextStep")}: ${localizedSchemeName(first)}` : "";
}

function renderAssistantReply(message, result) {
  const thread = document.querySelector("#chat-messages");
  if (result.eligibility?.length) {
    for (const item of result.eligibility) state.screening.set(item.schemeId, item);
    renderSchemes();
  }
  const bubble = document.createElement("div");
  bubble.className = "chat-bubble assistant-bubble";
  const paragraph = document.createElement("p");
  paragraph.textContent = result.answer || t("assistantError");
  bubble.append(paragraph);
  if (result.profile) {
    state.profile = result.profile;
    state.pendingField = result.pendingField || "";
    const details = [
      result.profile.occupation && `${t("occupationLabel")}: ${result.profile.occupation}`,
      result.profile.age !== undefined && `${t("ageLabel")}: ${result.profile.age}`,
      result.profile.state && `${t("stateLabel")}: ${result.profile.state}`
    ].filter(Boolean);
    if (details.length) {
      const summary = document.createElement("div");
      summary.className = "profile-summary";
      summary.setAttribute("aria-label", t("myProfile"));
      details.forEach((label) => { const item = document.createElement("span"); item.textContent = label; summary.append(item); });
      bubble.append(summary);
    }
  }
  if (result.question) {
    const question = document.createElement("p");
    question.className = "assistant-question";
    question.textContent = result.question;
    bubble.append(question);
  }
  if (result.schemes?.length) {
    const links = document.createElement("div");
    links.className = "chat-scheme-links";
    result.schemes.slice(0, 3).forEach((scheme) => {
      const known = state.schemes.find((item) => item.id === (scheme.id || scheme.schemeId));
      if (!known) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "chat-scheme-link";
      button.dataset.openScheme = known.id;
      button.innerHTML = `<span>${escapeHtml(localizedSchemeName(known))}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>`;
      links.append(button);
      const source = document.createElement("a");
      source.className = "chat-scheme-source";
      source.href = known.officialUrl;
      source.target = "_blank";
      source.rel = "noreferrer";
      source.textContent = `${t("officialSource")}: ${localizedSchemeName(known)}`;
      links.append(source);
    });
    if (links.childElementCount) bubble.append(links);
  }
  if (result.workflow?.length) {
    const workflow = document.createElement("ol");
    workflow.className = "workflow-list";
    workflow.setAttribute("aria-label", "Agent workflow");
    result.workflow.forEach((step) => { const item = document.createElement("li"); item.textContent = step; workflow.append(item); });
    bubble.append(workflow);
  }
  const documents = result.documents;
  const guide = result.guide;
  if (documents?.length || guide?.length) {
    const details = document.createElement("div");
    details.className = "chat-quick-details";
    if (documents?.length) details.innerHTML += `<strong>${escapeHtml(t("documentsHeading"))}</strong><ul>${documents.slice(0, 6).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
    if (guide?.length) details.innerHTML += `<strong>${escapeHtml(t("stepsHeading"))}</strong><ol>${guide.slice(0, 4).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>`;
    bubble.append(details);
  }
  const mapsUrl = result.locationSearch?.mapsUrl || result.mapsUrl;
  if (mapsUrl && mapsUrl.startsWith("https://www.google.com/maps/search/")) {
    const mapLink = document.createElement("a");
    mapLink.className = "chat-action-link";
    mapLink.href = mapsUrl;
    mapLink.target = "_blank";
    mapLink.rel = "noreferrer";
    mapLink.textContent = t("findCsc");
    bubble.append(mapLink);
  }
  if (result.helpline?.url || result.helpline?.phone) {
    const helpline = document.createElement("a");
    helpline.className = "chat-action-link";
    helpline.href = result.helpline.phone ? `tel:${result.helpline.phone}` : result.helpline.url;
    helpline.textContent = [result.helpline.label, result.helpline.phone].filter(Boolean).join(" · ");
    if (!result.helpline.phone) {
      helpline.target = "_blank";
      helpline.rel = "noreferrer";
    }
    bubble.append(helpline);
  }
  const audioButton = document.createElement("button");
  audioButton.className = "read-response icon-button";
  audioButton.type = "button";
  audioButton.title = t("readAnswer");
  audioButton.setAttribute("aria-label", t("readAnswer"));
  audioButton.dataset.speakText = [result.answer, result.question].filter(Boolean).join(". ");
  audioButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h3l4 3V7l-4 3H4Z"/><path d="M15 9a4 4 0 0 1 0 6m2.5-8a7 7 0 0 1 0 10"/></svg>';
  bubble.append(audioButton);
  const mode = document.createElement("span");
  mode.className = "chat-status";
  mode.textContent = result.mode === "claude" ? t("modeClaude") : t("modeDemo");
  bubble.append(mode);
  thread.append(bubble);
  thread.scrollTop = thread.scrollHeight;
  updateDashboard(result);
}

async function askAssistant(text) {
  text = String(text || "").trim();
  if (!text) {
    showToast(t("askPlaceholder"));
    assistantInput.focus();
    return;
  }
  const previousHistory = state.history.slice(-8);
  state.history.push({ role: "user", content: text });
  state.lastNeed = state.profile?.need || state.lastNeed;
  const thread = document.querySelector("#chat-messages");
  const userBubble = document.createElement("div");
  userBubble.className = "chat-bubble user-bubble";
  const userText = document.createElement("p");
  userText.textContent = text;
  userBubble.append(userText);
  thread.append(userBubble);
  assistantInput.value = "";

  const thinking = document.createElement("div");
  thinking.className = "chat-bubble assistant-bubble assistant-thinking";
  thinking.innerHTML = `<span>${escapeHtml(t("searching"))}</span><span class="typing-dots" aria-hidden="true"><span></span><span></span><span></span></span>`;
  thread.append(thinking);
  thread.scrollTop = thread.scrollHeight;
  const submit = document.querySelector("#assistant-form .send-button");
  submit.disabled = true;
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text, language: state.language, profile: state.profile || {}, pendingField: state.pendingField, history: previousHistory })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || t("assistantError"));
    thinking.remove();
    renderAssistantReply(text, result);
    state.history.push({ role: "assistant", content: [result.answer, result.question].filter(Boolean).join(" ") });
    state.history = state.history.slice(-8);
  } catch (error) {
    thinking.remove();
    renderAssistantReply(text, { answer: error.message || t("assistantError"), mode: "demo" });
    state.history.push({ role: "assistant", content: error.message || t("assistantError") });
    state.history = state.history.slice(-8);
  } finally {
    submit.disabled = false;
    assistantInput.focus();
  }
}

function startVoice(target, button) {
  const status = document.querySelector("#voice-state");
  const setStatus = (key) => {
    status.hidden = !key;
    status.textContent = key ? t(key) : "";
    status.dataset.state = key === "listening" ? "listening" : key === "processing" ? "processing" : key === "voiceErrorState" ? "error" : "ready";
  };
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) {
    setStatus("unsupported");
    showToast(t("speechUnsupported"));
    return;
  }
  const recognition = new Recognition();
  recognition.lang = ({ en: "en-IN", hi: "hi-IN", kn: "kn-IN" })[state.language] || "en-IN";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  button.classList.add("listening");
  button.setAttribute("aria-pressed", "true");
  setStatus("listening");
  recognition.onstart = () => setStatus("listening");
  recognition.onresult = (event) => {
    setStatus("processing");
    const spoken = event.results?.[0]?.[0]?.transcript || "";
    target.value = spoken;
    if (target === searchInput) {
      state.query = spoken;
      renderSchemes();
    } else if (spoken) {
      askAssistant(spoken);
    }
  };
  recognition.onerror = () => { setStatus("voiceErrorState"); showToast(t("voiceError")); };
  recognition.onend = () => {
    button.classList.remove("listening");
    button.setAttribute("aria-pressed", "false");
    if (status.dataset.state === "listening") setStatus("ready");
  };
  try {
    recognition.start();
  } catch {
    button.classList.remove("listening");
    button.setAttribute("aria-pressed", "false");
    setStatus("voiceErrorState");
    showToast(t("voiceError"));
  }
}

async function speak(text) {
  if (!("speechSynthesis" in window) || !text) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  let voices = synth.getVoices();
  if (!voices.length) {
    voices = await new Promise((resolve) => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        synth.removeEventListener("voiceschanged", finish);
        resolve(synth.getVoices());
      };
      synth.addEventListener("voiceschanged", finish, { once: true });
      window.setTimeout(finish, 1000);
    });
  }
  const language = state.language;
  const locale = ({ en: "en-IN", hi: "hi-IN", kn: "kn-IN" })[language] || "en-IN";
  const prefix = `${language}-`;
  const voice = voices.find((item) => item.lang.toLowerCase() === locale.toLowerCase())
    || voices.find((item) => item.lang.toLowerCase().startsWith(prefix));
  if (!voice && language !== "en") {
    showToast(t("speechVoiceUnavailable"));
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = locale;
  if (voice) utterance.voice = voice;
  utterance.onerror = (event) => {
    if (event.error !== "canceled" && event.error !== "interrupted") showToast(t("speechVoiceError"));
  };
  synth.speak(utterance);
}

function handleBookmark(id) {
  if (state.saved.has(id)) state.saved.delete(id);
  else state.saved.add(id);
  localStorage.setItem("sarkari-saved", JSON.stringify([...state.saved]));
  renderSchemes();
  if (schemeDialog.open) openScheme(id);
}

function handleCompare(id) {
  if (state.comparing.has(id)) {
    state.comparing.delete(id);
  } else {
    if (state.comparing.size >= 3) {
      showToast(t("compareLimit"));
      return;
    }
    state.comparing.add(id);
  }
  renderSchemes();
}

async function runEligibility(profile) {
  const response = await fetch("/api/eligibility", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ profile })
  });
  if (!response.ok) throw new Error("Eligibility screening failed.");
  const { results } = await response.json();
  state.screening = new Map((results || []).map((item) => [item.schemeId, item]));
  renderSchemes();
  const possible = (results || []).filter((item) => item.status === "possible-match");
  const uncertain = (results || []).filter((item) => ["needs-information", "needs-confirmation"].includes(item.status));
  const outcome = possible.length
    ? `${t("listSummary")}: ${possible.map((item) => state.schemes.find((scheme) => scheme.id === item.schemeId)?.name || item.name).join(", ")}. ${t("sourceCaution")}`
    : `${t("listSummary")}: ${uncertain.length ? uncertain.map((item) => state.schemes.find((scheme) => scheme.id === item.schemeId)?.name || item.name).join(", ") : t("noResults")}. ${t("sourceCaution")}`;
  renderAssistantReply("", { answer: outcome, mode: "demo", schemes: possible.length ? possible : uncertain });
  document.querySelector("#schemes").scrollIntoView({ behavior: "smooth", block: "start" });
}

function setLanguage(language) {
  state.language = ["en", "hi", "kn"].includes(language) ? language : "en";
  localStorage.setItem("sarkari-language", state.language);
  window.speechSynthesis?.cancel();
  applyLanguage();
}

function resetConversation() {
  state.profile = null;
  state.pendingField = "";
  state.history = [];
  state.lastNeed = "";
  state.lastResults = [];
  state.screening.clear();
  document.querySelector("#journey-dashboard").hidden = true;
  document.querySelector("#agent-demo-receipt").hidden = true;
  setAgentDemoStatus("");
  document.querySelector("#chat-messages").innerHTML = `<div class="chat-bubble assistant-bubble"><p>${escapeHtml(t("assistantIntro"))}</p></div>`;
  renderSchemes();
}

const needPrompts = {
  agriculture: "I need help with farming and agriculture support.",
  education: "I am a student and need help with education or fees.",
  housing: "I need help with housing.",
  health: "I need help with health care or hospital costs.",
  employment: "I need help with work or employment.",
  women: "I need support for women and family.",
  senior: "I need support for a senior citizen.",
  finance: "I need financial help or a small business loan."
};

document.querySelector("#demo-login-form").addEventListener("submit", signInToDemo);
demoLoginDialog.addEventListener("cancel", (event) => event.preventDefault());
document.querySelector("#demo-logout").addEventListener("click", signOutOfDemo);
document.querySelector("#start-agent-demo").addEventListener("click", startAgentDemo);
document.querySelector("#agent-demo-profile-form").addEventListener("submit", beginAgentDemo);
document.querySelector("#agent-demo-scheme").addEventListener("change", renderAgentDemoQuestions);
document.querySelector("#agent-demo-edit-details").addEventListener("click", () => {
  document.querySelector("#agent-demo-output").hidden = true;
  document.querySelector("#agent-demo-intake").hidden = false;
  document.querySelector("#agent-demo-eligibility").hidden = true;
  document.querySelector("#agent-demo-progress").value = 0;
  renderAgentDemoQuestions();
  document.querySelector('#agent-demo-profile-form [name="applicant"]').focus({ preventScroll: true });
});
document.querySelector("#agent-demo-form").addEventListener("submit", submitAgentDemo);
document.querySelector("#refresh-agent-demo-captcha").addEventListener("click", async () => {
  try {
    await refreshAgentDemoChallenge(true);
  } catch {
    document.querySelector("#agent-demo-modal-status").textContent = t("agentDemoStartError");
  }
});
document.querySelector("#agent-demo-otp").addEventListener("input", (event) => {
  event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "").slice(0, 6);
  updateAgentDemoSubmit();
});
document.querySelector("#agent-demo-captcha").addEventListener("input", updateAgentDemoSubmit);
document.querySelector("#language").addEventListener("change", (event) => setLanguage(event.target.value));
document.querySelector("#welcome-language").addEventListener("change", (event) => setLanguage(event.target.value));
document.querySelector("#start-speaking").addEventListener("click", () => {
  document.querySelector("#assistant").scrollIntoView({ behavior: "smooth", block: "center" });
  setTimeout(() => document.querySelector("#voice-chat").click(), 250);
});
document.querySelector("#start-typing").addEventListener("click", () => {
  document.querySelector("#assistant").scrollIntoView({ behavior: "smooth", block: "center" });
  setTimeout(() => assistantInput.focus(), 250);
});
document.querySelectorAll(".need-option").forEach((button) => button.addEventListener("click", () => {
  const category = button.dataset.need;
  state.category = category;
  state.query = "";
  state.savedOnly = false;
  searchInput.value = "";
  state.lastNeed = category;
  state.profile = { ...(state.profile || {}), need: category };
  document.querySelectorAll(".category-button").forEach((item) => {
    const active = item.dataset.category === category;
    item.classList.toggle("active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  renderSchemes();
  askAssistant(needPrompts[category]);
  document.querySelector("#assistant").scrollIntoView({ behavior: "smooth", block: "center" });
}));
document.querySelectorAll("[data-scenario]").forEach((button) => button.addEventListener("click", () => {
  resetConversation();
  const scenarios = {
    farmer: { text: "I am a farmer from Karnataka and need government financial assistance.", profile: { occupation: "farmer", state: "Karnataka", need: "agriculture" } },
    student: { text: "I am a student and need help paying for my education.", profile: { occupation: "student", need: "education" } },
    senior: { text: "I am 65 and want to know what government benefits I can receive.", profile: { age: 65, need: "senior" } }
  };
  const scenario = scenarios[button.dataset.scenario];
  if (!scenario) return;
  state.profile = scenario.profile;
  state.lastNeed = scenario.profile.need;
  askAssistant(scenario.text);
}));
document.querySelector("#clear-chat").addEventListener("click", resetConversation);
document.querySelector("#new-search").addEventListener("click", () => {
  resetConversation();
  state.category = "all";
  state.query = "";
  state.savedOnly = false;
  searchInput.value = "";
  document.querySelectorAll(".category-button").forEach((item) => {
    const active = item.dataset.category === "all";
    item.classList.toggle("active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  renderSchemes();
  document.querySelector("#assistant").scrollIntoView({ behavior: "smooth", block: "center" });
});

document.querySelector("#search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  state.query = searchInput.value.trim();
  state.savedOnly = false;
  renderSchemes();
  document.querySelector("#schemes").scrollIntoView({ behavior: "smooth", block: "start" });
});
searchInput.addEventListener("input", () => {
  state.query = searchInput.value.trim();
  renderSchemes();
});
document.querySelectorAll(".quick-searches [data-query]").forEach((button) => button.addEventListener("click", () => {
  searchInput.value = button.dataset.query;
  state.query = button.dataset.query;
  state.savedOnly = false;
  renderSchemes();
  document.querySelector("#schemes").scrollIntoView({ behavior: "smooth", block: "start" });
}));
document.querySelectorAll(".category-button").forEach((button) => button.addEventListener("click", () => {
  state.category = button.dataset.category;
  document.querySelectorAll(".category-button").forEach((item) => {
    const active = item === button;
    item.classList.toggle("active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  renderSchemes();
}));
document.querySelector("#clear-search").addEventListener("click", () => {
  searchInput.value = "";
  state.query = "";
  state.category = "all";
  state.savedOnly = false;
  document.querySelectorAll(".category-button").forEach((button) => {
    const active = button.dataset.category === "all";
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  renderSchemes();
});

document.querySelector(".saved-filter").addEventListener("click", () => {
  state.savedOnly = !state.savedOnly;
  renderSchemes();
  document.querySelector("#schemes").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.addEventListener("click", (event) => {
  const save = event.target.closest("[data-save-id]");
  if (save) {
    handleBookmark(save.dataset.saveId);
    return;
  }
  const compare = event.target.closest("[data-compare-id]");
  if (compare) {
    handleCompare(compare.dataset.compareId);
    return;
  }
  const guide = event.target.closest("[data-guide-id]");
  if (guide) {
    buildApplicationGuide(guide.dataset.guideId);
    return;
  }
  const clearProgress = event.target.closest("[data-clear-progress-id]");
  if (clearProgress) {
    const schemeId = clearProgress.dataset.clearProgressId;
    state.documentReady.delete(schemeId);
    writeDocumentProgress(state.documentReady);
    schemeDialog.close();
    openScheme(schemeId);
    updateDashboard({ schemes: state.lastResults, eligibility: [...state.screening.values()] });
    return;
  }
  const open = event.target.closest("[data-open-scheme]");
  if (open) {
    openScheme(open.dataset.openScheme);
    return;
  }
  if (event.target.closest("[data-open-profile]")) {
    openProfile();
    return;
  }
  if (event.target.closest("[data-close-dialog]")) {
    event.target.closest("dialog")?.close();
    return;
  }
  const read = event.target.closest("[data-speak-text]");
  if (read) speak(read.dataset.speakText);
});

document.addEventListener("change", (event) => {
  const checkbox = event.target.closest("[data-document-id]");
  if (!checkbox) return;
  const [schemeId, indexText] = checkbox.dataset.documentId.split(":");
  const index = Number(indexText);
  const scheme = state.schemes.find((item) => item.id === schemeId);
  const documentName = scheme?.documents[index];
  if (!documentName) return;
  const ready = new Set(state.documentReady.get(schemeId) || []);
  if (checkbox.checked) ready.add(documentName);
  else ready.delete(documentName);
  if (ready.size) state.documentReady.set(schemeId, ready);
  else state.documentReady.delete(schemeId);
  writeDocumentProgress(state.documentReady);
  updateDocumentProgress(schemeId);
  updateDashboard({ schemes: state.lastResults, eligibility: [...state.screening.values()] });
});

document.querySelector("#clear-compare").addEventListener("click", () => {
  state.comparing.clear();
  renderSchemes();
});
document.querySelector("#compare-open").addEventListener("click", openCompare);

document.querySelector("#profile-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(event.currentTarget).entries());
  if (values.age) values.age = Number(values.age);
  else delete values.age;
  if (values.gender === "unknown") delete values.gender;
  if (values.occupation === "unknown") delete values.occupation;
  if (values.state === "") delete values.state;
  state.profile = values;
  profileDialog.close();
  try {
    await runEligibility(values);
  } catch (error) {
    showToast(error.message);
  }
});

document.querySelector("#assistant-form").addEventListener("submit", (event) => {
  event.preventDefault();
  askAssistant(assistantInput.value);
});
document.querySelectorAll(".suggestion-list [data-prompt]").forEach((button) => button.addEventListener("click", () => askAssistant(button.dataset.prompt)));
document.querySelector("#voice-search").addEventListener("click", (event) => startVoice(searchInput, event.currentTarget));
document.querySelector("#voice-chat").addEventListener("click", (event) => startVoice(assistantInput, event.currentTarget));

document.querySelector("#csc-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const location = document.querySelector("#csc-location").value.trim();
  if (location.length < 2) {
    document.querySelector("#csc-location").focus();
    showToast(t("locationPlaceholder"));
    return;
  }
  const query = `Common Service Centre near ${location}`;
  window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, "_blank", "noopener,noreferrer");
  showToast(t("mapsOpened"));
});

document.querySelector(".mobile-menu").addEventListener("click", (event) => {
  const nav = document.querySelector(".main-nav");
  const open = nav.classList.toggle("open");
  event.currentTarget.setAttribute("aria-expanded", String(open));
});
document.querySelectorAll(".main-nav a").forEach((link) => link.addEventListener("click", () => {
  document.querySelector(".main-nav").classList.remove("open");
  document.querySelector(".mobile-menu").setAttribute("aria-expanded", "false");
}));

async function loadSchemes() {
  try {
    const response = await fetch("/api/schemes");
    if (!response.ok) throw new Error("Scheme catalog unavailable.");
    const result = await response.json();
    state.schemes = Array.isArray(result.schemes) ? result.schemes : [];
    renderAgentDemoSchemeOptions();
    renderAgentDemoQuestions();
    state.loading = false;
    renderSchemes();
  } catch {
    state.loading = false;
    schemeList.innerHTML = `<div class="empty-state"><h3>${escapeHtml(t("noResults"))}</h3><p>${escapeHtml(t("assistantError"))}</p></div>`;
    schemeList.setAttribute("aria-busy", "false");
  }
}

applyLanguage();
loadSchemes();
void initializeDemoAccess();
