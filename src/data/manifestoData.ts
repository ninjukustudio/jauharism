import {
  AxiomData,
  TriadFacet,
  HistoricalFigure,
  HistoricalBranch,
  MatrixRow,
  FAQItem,
  BibliographyEntry,
} from "../types.ts";

export const PREAMBLE_TEXT = {
  title: "Preamble & Epistemological Foundations",
  subtitle: "Dismantling the False Dichotomy Paralyzing Islamic Thought",
  paragraph1:
    "The contemporary Muslim world suffers from a profound epistemological collapse. For centuries, public intellectual discourse and religious thought have been paralyzed by a false dichotomy. On one side stands a stagnant, anti-rational traditionalism that denies physical cause-and-effect in favor of a radical occasionalism; on the other stands a secular materialism that strips the cosmos of moral teleology and divine purpose.",
  paragraph2:
    "This intellectual paralysis is not an inherent feature of Islamic revelation, but the byproduct of late medieval political consolidations that severed reason (ʿaql) from revelation (naql), replaced the study of natural law with fatalistic theology, and elevated blind imitation (taqlīd) over empirical verification (tashīḥ).",
  paragraph3:
    "Project Jauhari is established to dismantle this false dichotomy. It offers a comprehensive blueprint for intellectual and spiritual restoration, demonstrating that an empirically grounded, scientifically aligned, and politically free Islam is not a modern secular importation, but a faithful retrieval of the earliest Medinan and Basran baselines of faith.",
};

export const TRIAD_FACETS: TriadFacet[] = [
  {
    id: "jawhar",
    title: "The Philosophical Anchor",
    arabic: "جوهر",
    subtitle: "Indivisible Substance vs. Transient Accidents (ʿAraḍ)",
    summary:
      "In classical speculative theology (ʿilm al-kalām), particularly early Mu'tazilite atomism documented in Abū Rashīd al-Nīsābūrī’s Al-Masāʾil fī al-Khilāf, the cosmos is analyzed through indivisible substance (jawhar) and transient accidents (ʿaraḍ).",
    philosophicalSignificance:
      "Centuries of historical, cultural, and dynastic accidents (ʿaraḍ) have cluttered Islamic thought. Project Jauhari strips these away to reveal the indestructible, primary substance (jawhar) of revelation: Absolute Monotheism (Tawḥīd), Objective Justice (ʿAdl), and the Primacy of Reason (ʿAql).",
    manifestoRole: "Metaphysical & Ontological Root",
  },
  {
    id: "jauh-hari",
    title: "The Temporal Bridge",
    arabic: "Jauh Hari",
    subtitle: "From Distant Medinan-Basran Origins to Centuries Ahead",
    summary:
      "In Malay, the idiom 'jauh hari' evokes 'days afar'—pointing simultaneously to an uncorrupted distant past and an expansive, forward-looking distant future.",
    philosophicalSignificance:
      "Project Jauhari reaches back to the distant past (jauh hari)—the zenith of 1st-century Medinan scholarship and the Basran synthesis—to construct a rigorous, cause-and-effect framework capable of guiding the Ummah into the technological and scientific challenges of the centuries ahead (jauh hari).",
    manifestoRole: "Historical & Temporal Horizon",
  },
  {
    id: "jauhari",
    title: "The Discerning Gemologist",
    arabic: "الجوهري",
    subtitle: "Analytical Discernment (Faṭānah) Over Blind Imitation",
    summary:
      "In classical regional usage, a Jauhari is a master gemologist—one endowed with the precision and analytical discernment (faṭānah) to distinguish genuine gems from counterfeit glass.",
    philosophicalSignificance:
      "Project Jauhari functions as a rigorous intellectual filter, evaluating inherited doctrines, sectarian dogmas, and popular traditions against the Quran, sound prophetic sunnah, and established scientific reality.",
    manifestoRole: "Critical Methodology & Hermeneutics",
  },
];

export const HISTORICAL_ARCHAEOLOGY = {
  title: "Historical Archaeology: The Basran Synthesis",
  subtitle: "How Political Patronage Institutionalized Occasionalism and the Unbroken Lineage at Basra",
  politicalShift: {
    heading: "The Political Shift to Occasionalism",
    body: "Following the Miḥnah (Inquisition) era, dynasties such as the Seljuk Empire—most notably under Grand Vizier Niẓām al-Mulk—institutionalized Ash'arite kalām across the state-funded Niẓāmiyya madrasa network. Radical occasionalism, which asserts that God continuously recreates every atom and accident at every instant without intrinsic natural causes, was favored politically because it simplified divine sovereignty for the masses while discouraging critical, independent inquiry into natural laws and political accountability. Simultaneously, early rationalist movements were systematically suppressed.",
  },
  convergence: {
    heading: "The Convergence at 1st-Century Basra",
    subheading: "Al-Ḥasan al-Baṣrī (d. 110 AH) as the Primary Intellectual Funnel",
    body: "When political consolidations are removed, the earliest stratum of Islamic scholarship converges at 1st-century Basra under al-Ḥasan al-Baṣrī. Through him, the core teachings of three primary Companions were synthesized into an integrated rationalist baseline:",
  },
  figures: [
    {
      name: "ʿAlī ibn Abī Ṭālib",
      arabicName: "علي بن أبي طالب",
      dates: "d. 40 AH",
      role: "The Fountain of Demonstrative Proof & Strict Transcendence",
      transmission:
        "The source of demonstrative rational proof (burhān), absolute divine transcendence (tanzīh), objective cosmic justice (ʿadl), and courageous resistance to autocratic tyranny.",
      corePrinciples: [
        "Demonstrative rational proof (burhān)",
        "Strict transcendence (tanzīh) rejecting anthropomorphism",
        "Objective justice (ʿadl) as divine necessity",
        "Resistance to dynastic tyranny and monarchical co-optation",
      ],
    },
    {
      name: "ʿAbd Allāh ibn ʿAbbās",
      arabicName: "عبد الله بن عباس",
      dates: "d. 68 AH",
      role: "Ḥabr al-Ummah (Scholar of the Nation)",
      transmission:
        "Established rational hermeneutics (taʾwīl) and the contextual analysis of ambiguous Quranic verses, reading Surah Ali 'Imran (3:7) with the conjunction (ʿaṭf).",
      corePrinciples: [
        "Rational allegorical hermeneutics (taʾwīl)",
        "Contextual resolution of metaphorical scriptures",
        "The Hermeneutical Conjunction of Surah 3:7 (wa-r-rāsikhūna fī-l-ʿilm)",
        "Rejection of mindless anthropomorphic literalism",
      ],
    },
    {
      name: "The Medinan Qurrāʾ",
      arabicName: "القرّاء المدنيون",
      dates: "1st Century AH",
      role: "Scholars of Legal Sobriety & Moral Integrity",
      transmission:
        "Represented by ʿAbd Allāh ibn Masʿūd, ʿAmmār ibn Yāsir, and al-Miqdād ibn al-Aswad—the early reciter-scholars who stood for moral accountability and resistance to monarchical corruption.",
      corePrinciples: [
        "Legal sobriety and textual fidelity",
        "Defended in revelation against mockers (Surah at-Tawbah 9:65)",
        "Personal moral responsibility over predestinarian quietism",
        "Incorruptible civic and ethical standards",
      ],
    },
  ] as HistoricalFigure[],
  branches: [
    {
      id: "mutazilism",
      name: "Early Mu'tazilism",
      founders: "Wāṣil ibn ʿAṭāʾ & ʿAmr ibn ʿUbayd (students of al-Ḥasan al-Baṣrī)",
      dating: "Early 2nd Century AH (c. 110–131 AH)",
      tradition: "Classical Speculative Metaphysics & Natural Law",
      metaphysics:
        "Formulated the classical ontology of intrinsic natural properties, atomic physics (daqīq al-kalām), and objective ethical realism (al-ḥusn wa-l-qubḥ al-ʿaqliyyān).",
      politicalStance: "Enjoined objective justice (ʿAdl) and condemned dynastic oppression.",
      manuscriptPreservation:
        "Preserved in treatises such as Abū Rashīd al-Nīsābūrī’s Al-Masāʾil and Qāḍī ʿAbd al-Jabbār’s Sharḥ al-Uṣūl al-Khamsa.",
    },
    {
      id: "zaydism",
      name: "Classical Zaydism",
      founders: "Imam Zayd ibn ʿAlī (d. 122 AH)",
      dating: "2nd Century AH",
      tradition: "Rationalist Jurisprudence & Active Justice",
      metaphysics:
        "Preserved classical Basran Mu'tazilite metaphysics, rigorous non-anthropomorphism (tanzīh), and an open, dynamic approach to jurisprudence (fiqh).",
      politicalStance:
        "Obligation of Khurūj (active resistance against tyrannical rulers); complete rejection of quietist submission to autocrats.",
      manuscriptPreservation:
        "Preserved in the Musnad al-Imām Zayd and Yemeni archival codices across centuries.",
    },
    {
      id: "ibadism",
      name: "Early Ibadism",
      founders: "Jābir ibn Zayd (d. 93 AH, contemporary of al-Ḥasan al-Baṣrī)",
      dating: "1st–2nd Century AH",
      tradition: "Ethical Realism & Democratized Governance",
      metaphysics:
        "Preserved early ethical realism, moral cause-and-effect, and divine non-anthropomorphism.",
      politicalStance:
        "Complete democratization of the Imamate as a conditional civic contract (bayʿah) open to any capable believer, with the civic right of deposition (ʿazl) for tyranny.",
      manuscriptPreservation:
        "Preserved in Omani and North African archival collections (e.g. Al-Sālimī’s Mashāriq Anwār al-ʿUqūl).",
    },
  ] as HistoricalBranch[],
};

export const SEVEN_AXIOMS: AxiomData[] = [
  {
    id: "axiom-i",
    number: "I",
    title: "Absolute Transcendence and Cosmic Order",
    arabicTitle: "التوحيد والنظام",
    latinTitle: "Tawḥīd & Niẓām",
    coreConcept: "Absolute Non-Material Transcendence & Invariant Cosmic Order",
    statement:
      "God is the ultimate, non-material Originator of the cosmos, infinitely transcendent (Tanzīh) above physical limitations, anthropomorphism, or temporal change. The physical universe operates as a created, autonomous system governed by consistent, mathematically coherent, and discoverable natural laws (sunan Allāh).",
    corollaries: [
      "God is wholly distinct from creation; no bodily parts, directionality, or spatial confinement can be attributed to the Divine Essence.",
      "The universe is an autonomous creation functioning through continuous, discoverable mathematical laws (sunan Allāh).",
      "Quantum mechanics, astrophysics, and biological evolution reflect the structural order (niẓām) of divine wisdom rather than arbitrary, chaotic interventions.",
      "Physical laws are not capricious habits broken at whim, but the stable framework through which moral agency and empirical science operate.",
    ],
    textualEvidence: [
      {
        quote: "There is nothing like unto Him, and He is the Hearing, the Seeing.",
        arabic: "لَيْسَ كَمِثْلِهِۦ شَىْءٌۭ ۖ وَهُوَ ٱلسَّمِيعُ ٱلْبَصِيرُ",
        source: "Surah ash-Shura (42:11)",
        category: "quran",
        commentary:
          "The supreme scriptural axiom of absolute transcendence (Tanzīh), forbidding any anthropomorphic projection onto God.",
      },
      {
        quote: "Vision perceives Him not, but He perceives [all] vision; and He is the Subtle, the Acquainted.",
        arabic: "لَّا تُدْرِكُهُ ٱلْأَبْصَـٰرُ وَهُوَ يُدْرِكُ ٱلْأَبْصَـٰرَ ۖ وَهُوَ ٱللَّطِيفُ ٱلْخَبِيرُ",
        source: "Surah al-An'am (6:103)",
        category: "quran",
        commentary:
          "Affirms that the Divine Essence cannot be visually or spatially circumscribed, refuting literalist claims of physical divine form.",
      },
      {
        quote:
          "The sun and the moon [move] by precise calculation, and the stars and trees prostrate. And the heaven He raised and imposed the balance (al-Mīzān).",
        arabic: "ٱلشَّمْسُ وَٱلْقَمَرُ بِحُسْبَانٍۢ ۝ وَٱلنَّجْمُ وَٱلشَّجَرُ يَسْجُدَانِ ۝ وَٱلسَّمَآءَ رَفَعَهَا وَوَضَعَ ٱلْمِيزَانَ",
        source: "Surah ar-Rahman (55:5–7)",
        category: "quran",
        commentary:
          "Explicitly defines celestial mechanics by mathematical computation (ḥusbān) and cosmic equilibrium (mīzān).",
      },
      {
        quote: "Indeed, all things We created with predetermined measure (qadar).",
        arabic: "إِنَّا كُلَّ شَىْءٍ خَلَقْنَـٰهُ بِقَدَرٍۢ",
        source: "Surah al-Qamar (54:49)",
        category: "quran",
        commentary:
          "Qadar signifies exact mathematical specification and invariant structural law, not arbitrary pre-scripted fatalism.",
      },
      {
        quote:
          "The sun and the moon are two signs among the signs of God. They do not eclipse because of the death or life of anyone.",
        arabic: "إِنَّ الشَّمْسَ وَالْقَمَرَ آيَتَانِ مِنْ آيَاتِ اللَّهِ لاَ يَنْكَسِفَانِ لِمَوْتِ أَحَدٍ وَلاَ لِحَيَاتِهِ",
        source: "Sahih al-Bukhari (#1043); Sahih Muslim (#901)",
        category: "hadith",
        commentary:
          "The Prophet ﷺ delivered this address upon the death of his infant son Ibrahim, explicitly disavowing superstition and affirming that physical phenomena operate under invariant natural laws.",
      },
    ],
    traditionalistCounter:
      "Traditionalists cite Surah al-Anfal (8:17) ('And you threw not when you threw, but it was God who threw') and Abraham's cool fire (21:69) to argue that physical matter lacks intrinsic properties, making natural laws mere divine habits (ʿādah) that God constantly breaks. They further rely on literalist interpretations of anthropomorphic Hadiths to criticize abstract rational transcendence.",
    jauhariRebuttal:
      "Isolating Surah al-Anfal (8:17) commits a fatal grammatical and contextual error. The verse affirms physical human action twice ('You killed them not... You threw not when you threw...') before attributing ultimate victory to divine grace. For a statement to affirm that believers threw before attributing the outcome to God, human agency must exist as an operational cause. The verse governs spiritual posture toward victory, not subatomic occasionalism. Miracles (muʿjizāt) are intentional, rare exceptions that prove the existence of an underlying rule, not the default state of physics.",
    scientificCivicAlignment: [
      "Astrophysics & Orbital Mechanics",
      "Quantum Mechanics & Conservation Laws",
      "Biological Evolution as Divine Structural Design",
      "Mathematical Determinism of Natural Law",
    ],
    modernDisciplines: "Astrophysics, Quantum Mechanics, General Relativity, Conservation Laws",
    keywords: ["Tanzīh", "Niẓām", "Sunan Allāh", "Anti-Anthropomorphism", "Mīzān"],
    accentColor: "teal",
  },
  {
    id: "axiom-ii",
    number: "II",
    title: "Objective Justice and Intrinsic Causality",
    arabicTitle: "العدل والأسباب",
    latinTitle: "ʿAdl & Asbāb",
    coreConcept: "Intrinsic Natural Properties & Objective Moral Reality",
    statement:
      "Divine Justice (ʿAdl) is objective and intrinsic. Creation operates on real physical and moral cause-and-effect (asbāb). Matter possesses God-given intrinsic properties (e.g., fire burns, gravity attracts), completely rejecting radical occasionalism. Human beings are free, morally accountable agents capable of observing causes and executing genuine ethical choices.",
    corollaries: [
      "Fire possesses the created intrinsic property to combust; water hydrates; medicine cures. Denying this reduces physical reality to an arbitrary illusion.",
      "Good (ḥusn) and evil (qubḥ) are intrinsic ontological qualities discernable by reason, not arbitrary decrees of power.",
      "Human beings possess authentic free will and moral agency; God does not command evil or coerce disbelief.",
      "Denial of physical causes breeds societal fatalism, scientific decay, and political resignation.",
    ],
    textualEvidence: [
      {
        quote: "Indeed, God does not do injustice, [even] as much as an atom's weight.",
        arabic: "إِنَّ ٱللَّهَ لَا يَظْلِمُ مِثْقَالَ ذَرَّةٍۢ",
        source: "Surah an-Nisa (4:40)",
        category: "quran",
        commentary: "Affirms that tyranny (ẓulm) is an impossibility for the Divine Essence, rooted in objective justice.",
      },
      {
        quote: "And you will never find in the way (Sunnah) of God any change, and you will never find in the way of God any alteration.",
        arabic: "وَلَن تَجِدَ لِسُنَّتِ ٱللَّهِ تَبْدِيلًۭا ۖ وَلَن تَجِدَ لِسُنَّتِ ٱللَّهِ تَحْوِيلًا",
        source: "Surah Fatir (35:43)",
        category: "quran",
        commentary: "The divine sunnah in nature and history is immutable and predictable, providing the bedrock for scientific inquiry.",
      },
      {
        quote: "God does not change the condition of a people until they change what is in themselves.",
        arabic: "إِنَّ ٱللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا۟ مَا بِأَنفُسِهِمْ",
        source: "Surah ar-Ra'd (13:11)",
        category: "quran",
        commentary: "Direct scriptural formulation of sociopolitical and moral cause-and-effect.",
      },
      {
        quote: "Tie her and rely upon God.",
        arabic: "اعْقِلْهَا وَتَوَكَّلْ",
        source: "Sunan at-Tirmidhi (#2517)",
        category: "hadith",
        commentary:
          "When a Bedouin asked whether to leave his camel untied relying on tawakkul, the Prophet ﷺ commanded physical causation as the prerequisite for spiritual reliance.",
      },
      {
        quote: "Make use of medical treatment, for God has not made a disease without appointing a remedy for it...",
        arabic: "تَدَاوَوْا فَإِنَّ اللَّهَ عَزَّ وَجَلَّ لَمْ يَضَعْ دَاءً إِلاَّ وَضَعَ لَهُ دَوَاءً",
        source: "Sunan Abi Dawud (#3855)",
        category: "hadith",
        commentary: "Commands medical naturalism and empirical biochemistry as divine mandates.",
      },
    ],
    traditionalistCounter:
      "Traditionalists cite Surah al-Anbiya (21:23) ('He cannot be questioned about what He does, but they will be questioned') and Surah Ibrahim (14:4) ('God misleads whom He wills...') to claim that justice is purely voluntaristic—meaning whatever God does is defined as just simply by virtue of ownership, rejecting objective moral standards.",
    jauhariRebuttal:
      "Surah al-Anbiya (21:23) states 'He cannot be questioned' precisely because His acts are inherently Just and Wise (Ḥakīm); He is incapable of unprovoked tyranny (ẓulm). Conversely, 'they will be questioned' applies to humans because human actions are prone to error and injustice. Surah Ibrahim (14:4) regarding guidance must be read alongside Surah al-Kahf (18:29): 'The truth is from your Lord, so whoever wills - let him believe; and whoever wills - let him disbelieve.' Divine 'misguiding' (iḍlāl) is a judicial consequence: when an individual chooses corruption, God leaves them to the natural trajectory of their own choice.",
    scientificCivicAlignment: [
      "Physical & Chemical Causality",
      "Pharmacology & Medical Naturalism",
      "Human Moral Agency & Legal Accountability",
      "Rejection of Societal & Theological Fatalism",
    ],
    modernDisciplines: "Chemistry, Biochemistry, Thermodynamics, Moral Philosophy, Legal Jurisprudence",
    keywords: ["ʿAdl", "Asbāb", "Intrinsic Properties", "Moral Accountability", "Anti-Fatalism"],
    accentColor: "amber",
  },
  {
    id: "axiom-iii",
    number: "III",
    title: "The Epistemic Primacy of Intellect & Evidence",
    arabicTitle: "العقل والبرهان",
    latinTitle: "ʿAql & Burhān",
    coreConcept: "Reason as God's Internal Proof & Revelatory Allegory",
    statement:
      "Reason (ʿaql) is God’s primary internal proof (al-ḥujjah al-bāṭinah). Revelatory text (naql) can never contradict self-evident rational necessity or verified empirical facts. Whenever an apparent conflict arises between a literal text and an established physical or logical reality, the text must be understood allegorically (taʾwīl) according to sound linguistic rules.",
    corollaries: [
      "Revelation addresses conscious minds; scripture cannot be used to annul the logical faculty required to authenticate scripture in the first place.",
      "Self-evident mathematical and logical laws (e.g. the law of non-contradiction) are absolute standards endowed by God.",
      "Allegorical hermeneutics (taʾwīl) is not a departure from the text, but the rigorous application of classical Arabic rhetoric to preserve divine transcendence.",
      "Human intellectual limitation in volume of knowledge does not invalidate the structural integrity of human logic.",
    ],
    textualEvidence: [
      {
        quote: "And it is not for a soul to believe except by permission of God, and He will place defilement upon those who will not use their reason (la yaʿqilūn).",
        arabic: "وَيَجْعَلُ ٱلرِّجْسَ عَلَى ٱلَّذِينَ لَا يَعْقِلُونَ",
        source: "Surah Yunus (10:100)",
        category: "quran",
        commentary: "Scripture equates the suspension of rational intellect with intellectual and spiritual filth (rijs).",
      },
      {
        quote: "Say, 'Produce your proof (burhānakum), if you should be truthful.'",
        arabic: "قُلْ هَاتُوا۟ بُرْهَـٰنَكُمْ إِن كُنتُمْ صَـٰدِقِينَ",
        source: "Surah al-Baqarah (2:111)",
        category: "quran",
        commentary: "Demonstrative rational proof (burhān) is demanded as the universal benchmark for any truth claim.",
      },
      {
        quote: "The Hermeneutical Conjunction: 'And none knows its hidden interpretation except Allah AND those firm in knowledge (wa-r-rāsikhūna fī-l-ʿilm).'",
        arabic: "وَمَا يَعْلَمُ تَأْوِيلَهُۥٓ إِلَّا ٱللَّهُ ۗ وَٱلرَّٰسِخُونَ فِى ٱلْعِلْمِ",
        source: "Surah Ali 'Imran (3:7)",
        category: "quran",
        commentary:
          "ʿAbd Allāh ibn ʿAbbās read the verse with a conjunction (ʿaṭf), establishing that scholars of sound knowledge possess the capacity for allegorical interpretation (taʾwīl).",
      },
      {
        quote:
          "God has two proofs against humanity: an external proof (ḥujjah ẓāhirah) and an internal proof (ḥujjah bāṭinah). As for the external, it is the Messengers; as for the internal, it is the Intellect (ʿAql).",
        arabic: "إِنَّ لِلَّهِ عَلَى النَّاسِ حُجَّتَيْنِ: حُجَّةً ظَاهِرَةً، وَحُجَّةً بَاطِنَةً...",
        source: "Al-Kulaynī, Al-Kāfī, Vol. 1; Imam Zayd ibn ʿAlī, Musnad",
        category: "tradition",
        commentary:
          "The foundational epistemic duality tradition preserved in early rationalist collections, elevating reason to co-equal proof.",
      },
    ],
    traditionalistCounter:
      "Traditionalists quote Surah an-Nisa (4:28) ('man was created weak') and Hadith warnings against personal opinion (raʾy) to argue that human intellect is corrupted and must defer to literal textual transmissions even when they defy logic or physical observation.",
    jauhariRebuttal:
      "Quranic Arabic distinguishes between ʿaql (formal, objective logical deduction) and hawā/raʾy (subjective desire or unsubstantiated conjecture). The Quran repeatedly commands the use of ʿaql (e.g., 10:100), while warnings against raʾy target speculation that ignores evidence. Saying human knowledge is limited ('given but little knowledge') conflates the volume of knowledge a human possesses with the validity of human logic. A finite ruler cannot measure an ocean, but the inches it does measure remain mathematically accurate.",
    scientificCivicAlignment: [
      "Propositional Logic & Analytical Epistemology",
      "Mathematical Physics",
      "Linguistic & Contextual Hermeneutics",
      "Cognitive Coherence & Refutation of Fideism",
    ],
    modernDisciplines: "Formal Logic, Philosophy of Mind, Linguistics, Epistemology",
    keywords: ["ʿAql", "Burhān", "Taʾwīl", "al-Ḥujjah al-Bāṭinah", "Logic"],
    accentColor: "blue",
  },
  {
    id: "axiom-iv",
    number: "IV",
    title: "Empirical Verification and Falsification",
    arabicTitle: "التصحيح والتفنيد",
    latinTitle: "Taṣḥīḥ & Tafnīd",
    coreConcept: "Scientific Methodology, Falsifiability & Rejection of Taqlīd",
    statement:
      "Blind imitation (taqlīd) of historical consensus, ancestors, or scholastic authority is epistemologically invalid. Truth claims require empirical observation (mushāhadah), logical verification, and rigorous falsification (tafnīd). The scientific method—observation, mathematical modeling, and peer-reviewed falsification—is a religious imperative for understanding physical reality (Imārat al-Arḍ).",
    corollaries: [
      "Historical consensus (ijmāʿ) cannot override demonstrated empirical data.",
      "Falsifying an interpretation or human commentary does not equal falsifying the revelatory text (naṣṣ) being interpreted.",
      "Hypotheses about the natural universe must be subjected to repeatable, empirical testing.",
      "The Quran consistently denounces ancestral imitation as the primary cause of pagan blindness.",
    ],
    textualEvidence: [
      {
        quote:
          "And when it is said to them, 'Follow what God has revealed,' they say, 'Rather, we will follow that which we found our fathers upon.' Even though their fathers understood nothing, nor were they guided?",
        arabic: "وَإِذَا قِيلَ لَهُمُ ٱتَّبِعُوا۟ مَآ أَنزَلَ ٱللَّهُ قَالُوا۟ بَلْ نَتَّبِعُ مَآ أَلْفَيْنَا عَلَيْهِ ءَابَآءَنَآ",
        source: "Surah al-Baqarah (2:170)",
        category: "quran",
        commentary: "Devastating Quranic critique of taqlīd and unquestioning obedience to ancestral tradition.",
      },
      {
        quote: "And do not pursue that of which you have no knowledge. Indeed, the hearing, the sight, and the heart – about all those you will be questioned.",
        arabic: "وَلَا تَقْفُ مَا لَيْسَ لَكَ بِهِۦ عِلْمٌ ۚ إِنَّ ٱلسَّمْعَ وَٱلْبَصَرَ وَٱلْفُؤَادَ كُلُّ أُو۟لَـٰٓئِكَ كَانَ عَنْهُ مَسْـُٔولًۭا",
        source: "Surah al-Isra (17:36)",
        category: "quran",
        commentary: "Scriptural mandate for empirical verification: sensory observation and intellectual scrutiny are moral obligations.",
      },
      {
        quote: "Say, [O Muhammad], 'Travel through the earth and observe (fanẓurū) how He began creation.'",
        arabic: "قُلْ سِيرُوا۟ فِى ٱلْأَرْضِ فَٱنظُرُوا۟ كَيْفَ بَدَأَ ٱلْخَلْقَ",
        source: "Surah al-Ankabut (29:20)",
        category: "quran",
        commentary:
          "Direct imperative to conduct geology, paleontology, and evolutionary biology—examining physical evidence to understand creation origins.",
      },
      {
        quote: "You are more knowledgeable about the affairs of your worldly world (Antum aʿlamu bi-amri dunyākum).",
        arabic: "أَنْتُمْ أَعْلَمُ بِأَمْرِ دُنْيَاكُمْ",
        source: "Sahih Muslim (#2363)",
        category: "hadith",
        commentary:
          "Delivered in Medina during the date-palm cross-pollination event, formally establishing the epistemic autonomy of empirical agricultural, technical, and natural sciences.",
      },
    ],
    traditionalistCounter:
      "Traditionalists cite Surah al-Baqarah (2:3) ('Who believe in the unseen...') to argue that faith requires accepting un-falsifiable transmissions over empirical scientific standards.",
    jauhariRebuttal:
      "Surah al-Baqarah (2:3) lists belief in the Unseen (al-ghayb) alongside physical, observable acts (prayer and charity). Faith in Islam is an inference drawn from observing physical creation (al-shahādah). Surah al-Mulk (67:4) commands: 'Then return your vision again and again. Your vision will return to you humbled...' Faith in the unseen Creator is anchored directly in the empirical examination of natural laws.",
    scientificCivicAlignment: [
      "Empirical Scientific Method & Falsificationism",
      "Peer-Reviewed Replicability",
      "Separation of Worldly Technical Expertise from Dogma",
      "Paleontology, Geology, and Observational Sciences",
    ],
    modernDisciplines: "Empirical Sciences, Scientific Method, Philosophy of Science, Popperian Falsification",
    keywords: ["Taṣḥīḥ", "Tafnīd", "Mushāhadah", "Rejection of Taqlīd", "Antum Aʿlam"],
    accentColor: "emerald",
  },
  {
    id: "axiom-v",
    number: "V",
    title: "Ethical Teleology and Dynamic Adaptation",
    arabicTitle: "الحكمة والاجتهاد",
    latinTitle: "Ḥikmah & Ijtihād",
    coreConcept: "Objective Human Welfare (Maṣlaḥah) & Living Jurisprudence",
    statement:
      "Knowledge, science, and jurisprudence exist to serve objective human welfare (maṣlaḥah) and environmental stewardship (imārat al-arḍ). Scientific discovery must be governed by objective ethics (preserving life, intellect, justice, and the ecosystem). Legal and intellectual frameworks must continuously adapt via dynamic rational derivation (ijtihād) to address expanding technological realities.",
    corollaries: [
      "The objectives of the divine law (maqāṣid al-sharīʿah) are not static legal rituals, but universal moral aims: preserving intellect, life, ecology, and justice.",
      "Technological advancements (e.g. artificial intelligence, biotechnology, renewable energy) require ongoing dynamic ijtihād.",
      "Environmental stewardship is not an elective green policy, but the divine command of planetary cultivation (imārat al-arḍ).",
      "Harm cannot be justified through blind literalism: the legal maxim 'Lā ḍarara wa-lā ḍirār' takes precedence over fossilized historical rulings.",
    ],
    textualEvidence: [
      {
        quote: "He produced you from the earth and settled you in it to cultivate it (istaʿmarakum fīhā).",
        arabic: "هُوَ أَنشَأَكُم مِّنَ ٱلْأَرْضِ وَٱسْتَعْمَرَكُمْ فِيهَا",
        source: "Surah Hud (11:61)",
        category: "quran",
        commentary: "Defines human purpose on Earth as active development, scientific progress, and environmental stewardship.",
      },
      {
        quote: "We have not sent you except as a mercy to the worlds.",
        arabic: "وَمَآ أَرْسَلْنَـٰكَ إِلَّا رَحْمَةًۭ لِّلْعَـٰلَمِينَ",
        source: "Surah al-Anbiya (21:107)",
        category: "quran",
        commentary: "The universal teleological benchmark: any interpretation resulting in systemic cruelty or harm violates the prophetic mandate.",
      },
      {
        quote: "Hadith of Muʿādh ibn Jabal: 'I will exert my own reason (Ajtahidu ra'yī) and spare no effort.'",
        arabic: "أَجْتَهِدُ رَأْيِي وَلاَ آلُو",
        source: "Sunan Abi Dawud (#3592); Sunan at-Tirmidhi (#1327)",
        category: "hadith",
        commentary:
          "The Prophet ﷺ approved Muʿādh's declaration to use dynamic rational reasoning (ijtihād) when facing novel contexts not explicitly solved in prior text.",
      },
      {
        quote: "Universal Legal Maxim: There shall be no harm brought upon oneself, nor reciprocal harm inflicted upon others (Lā ḍarara wa-lā ḍirār).",
        arabic: "لاَ ضَرَرَ وَلاَ ضِرَارَ",
        source: "Sunan Ibn Majah (#2340); Al-Muwatta (#1435)",
        category: "hadith",
        commentary: "Universal ethical compass overriding narrow, harm-producing literalism.",
      },
    ],
    traditionalistCounter:
      "Traditionalists quote Surah al-Ma'idah (5:3) ('This day I have perfected for you your religion...') and warnings against innovation (bidʿah) to claim that dynamic legal adaptation or scientific integration represents an illegitimate alteration of faith.",
    jauhariRebuttal:
      "Updating analytical tools to comprehend natural descriptions in scripture does not alter revelation. When classical jurists (e.g., al-Shāfiʿī, Abū Ḥanīfa) created legal frameworks (uṣūl al-fiqh), they introduced analytical tools not explicitly detailed in scripture, which were accepted because they derived rulings from the primary text. Accepting medieval analytical tools while banning modern scientific tools is an arbitrary double standard.",
    scientificCivicAlignment: [
      "Bioethics & AI Alignment",
      "Environmental Sustainability & Climate Action",
      "Maqāṣid-Driven Dynamic Jurisprudence",
      "Public Welfare (Maṣlaḥah Mursalah)",
    ],
    modernDisciplines: "Bioethics, Environmental Law, AI Ethics, Teleological Jurisprudence",
    keywords: ["Ḥikmah", "Ijtihād", "Imārat al-Arḍ", "Maṣlaḥah", "Lā Ḍarar"],
    accentColor: "cyan",
  },
  {
    id: "axiom-vi",
    number: "VI",
    title: "Historical Lineage and the Basran Synthesis",
    arabicTitle: "الأصالة والإسناد",
    latinTitle: "Aṣālah & Isnād",
    coreConcept: "Indigenous 1st-Century Origins & Manuscript Archaeology",
    statement:
      "Project Jauhari is not a modern secular import, but an authentic restoration (aṣālah) rooted in the 1st-century Basran synthesis under al-Ḥasan al-Baṣrī, inheriting the lineages of ʿAlī ibn Abī Ṭālib, ʿAbd Allāh ibn ʿAbbās, and the Medinan Qurrāʾ. Rationalism, objective justice, and causal realism represented the original Medinan and Basran baselines before Umayyad and Abbasid statecraft institutionalized occasionalism.",
    corollaries: [
      "The transmission of early kalām and physics preserved in Mu'tazilite, Zaydi, and Ibadi manuscripts represents an unbroken intellectual lineage (isnād).",
      "Early rationalism predated the Abbasid translation of Greek philosophy by decades.",
      "The marginalization of rationalism was an outcome of imperial dynastic security (Niẓām al-Mulk), not intellectual debate.",
      "Archival textual archaeology proves that atomism, non-anthropomorphism, and moral causality were indigenous to the early Islamic community.",
    ],
    textualEvidence: [
      {
        quote: "The Sabab al-Nuzūl of Surah at-Tawbah (9:65): Revelation defending the dedicated scholars/reciters (Qurrāʾ).",
        arabic: "قُلْ أَبِٱللَّهِ وَءَايَـٰتِهِۦ وَرَسُولِهِۦ كُنتُمْ تَسْتَهْزِءُونَ",
        source: "Surah at-Tawbah (9:65); Tafsīr al-Ṭabarī",
        category: "quran",
        commentary:
          "Revelation descended at Tabūk to defend the early scholar-reciters (Qurrāʾ—including Ibn Masʿūd and ʿAmmār ibn Yāsir) as an incorruptible intellectual vanguard.",
      },
      {
        quote: "Al-Ḥasan al-Baṣrī’s Risālah ilā ʿAbd al-Malik ibn Marwān fī al-Qadar",
        arabic: "رسالة الحسن البصري إلى عبد الملك بن مروان في القدر",
        source: "Earliest Surviving Theological Treatise (ed. H. Ritter, Der Islam 21)",
        category: "tradition",
        commentary:
          "Utilized Quranic and rational arguments to prove human moral responsibility and objective divine justice (ʿAdl) directly against Umayyad state-sponsored fatalism.",
      },
      {
        quote: "Abū Rashīd al-Nīsābūrī’s Al-Masāʾil fī al-Khilāf bayn al-Baṣriyyīn wa-al-Baghdādiyyīn",
        arabic: "المسائل في الخلاف بين البصريين والبغداديين",
        source: "Classical Basran Daqīq al-Kalām Manuscript",
        category: "tradition",
        commentary:
          "Documents the sophisticated 2nd-century debates on atomic physics, substance (jawhar), and accidents (ʿaraḍ) preserved across Iranian, Yemeni, and North African archives.",
      },
    ],
    traditionalistCounter:
      "Traditionalists claim that rationalist theology was imported from Greek philosophy during the Abbasid translation movement, making it alien to authentic Islamic tradition.",
    jauhariRebuttal:
      "Historical chronology refutes this claim. The core doctrines of Mu'tazilism, Ibadism, and Zaydism—objective justice, human moral agency, and the primacy of ʿAql—were codified by Wāṣil ibn ʿAṭāʾ, Jābir ibn Zayd, and Zayd ibn ʿAlī in the early 2nd century AH, decades before the translation of Aristotle or Plato into Arabic under the Abbasids. The rationalist baseline was born internally within Medina and Basra.",
    scientificCivicAlignment: [
      "Historical-Critical Textual Archaeology",
      "Archival Manuscript Recovery",
      "De-Hellenization of Rational Kalām Lineage",
      "Contextual Historiography",
    ],
    modernDisciplines: "Historical-Critical Method, Codicology, Intellectual History, Textual Archaeology",
    keywords: ["Aṣālah", "Isnād", "Basran Synthesis", "Al-Ḥasan al-Baṣrī", "Daqīq al-Kalām"],
    accentColor: "indigo",
  },
  {
    id: "axiom-vii",
    number: "VII",
    title: "Meritocratic Civic Governance and Contractual Leadership",
    arabicTitle: "الشورى والبيعة",
    latinTitle: "Shūrā & Bayʿah",
    coreConcept: "Contractual Civic Trust (Amānah) & Repudiation of Tyranny",
    statement:
      "Political leadership (imāmah) is a contractual civic trust (amānah) based on merit, intellectual competence, and community consent (shūrā), open to any qualified believer regardless of lineage, ethnicity, or social class. Project Jauhari unequivocally rejects dynastic monarchy, autocratic quietism, and the political submission enforced by Quietist Salafism (e.g., Madkhalism). Political legitimacy is contingent upon upholding justice (ʿadl) and the rule of law. A ruler who commits systemic tyranny breaks the contract (bayʿah) and forfeits their right to govern (ʿazl).",
    corollaries: [
      "No tribe, dynasty, or family holds an inherent divine right to rule; leadership is an accountable civic mandate.",
      "Quietist Salafism (Madkhalism) which forbids critiquing tyrants is a dynastic corruption masquerading as orthodoxy.",
      "Systemic tyranny automatically dissolves the civic contract (bayʿah), justifying removal and deposition (ʿazl).",
      "Consultation (Shūrā) and universal meritocracy align directly with modern constitutional democracy and human rights.",
    ],
    textualEvidence: [
      {
        quote: "And their affair is [conducted by] consultation (Shūrā) among themselves.",
        arabic: "وَأَمْرُهُمْ شُورَىٰ بَيْنَهُمْ",
        source: "Surah ash-Shura (42:38)",
        category: "quran",
        commentary: "Universal constitutional directive making governance an open consultative process.",
      },
      {
        quote: "Indeed, God commands you to render trusts (al-amānāt) to whom they belong and when you judge between people to judge with justice.",
        arabic: "إِنَّ ٱللَّهَ يَأْمُرُكُمْ أَن تُؤَدُّوا۟ ٱلْأَمَـٰنَـٰتِ إِلَىٰٓ أَهْلِهَا وَإِذَا حَكَمْتُم بَيْنَ ٱلنَّاسِ أَن تَحْكُمُوا۟ بِٱلْعَدْلِ",
        source: "Surah an-Nisa (4:58)",
        category: "quran",
        commentary: "Political governance is an amānah (conditional trust) contingent upon delivering objective justice.",
      },
      {
        quote: "Indeed, the most noble of you in the sight of God is the most righteous of you.",
        arabic: "إِنَّ أَكْرَمَكُمْ عِندَ ٱللَّهِ أَتْقَىٰكُمْ",
        source: "Surah al-Hujurat (49:13)",
        category: "quran",
        commentary: "Demolishes all claims of tribal supremacy, ethnic lineage, or dynastic privilege in civic status.",
      },
      {
        quote:
          "Farewell Sermon: 'An Arab has no superiority over a non-Arab, nor a non-Arab over an Arab; nor a white person over a black person, nor a black person over a white person, except by piety (Taqwā).' All usury is abolished... 'You will neither commit injustice nor suffer injustice.'",
        arabic: "لاَ فَضْلَ لِعَرَبِيٍّ عَلَى أَعْجَمِيٍّ وَلاَ لِعَجَمِيٍّ عَلَى عَرَبِيٍّ... إِلاَّ بِالتَّقْوَى",
        source: "Farewell Sermon (Khuṭbat al-Widāʿ), Bukhari & Muslim",
        category: "hadith",
        commentary:
          "The supreme constitutional charter of universal human equality, civic meritocracy, and economic justice.",
      },
      {
        quote: "There is no obedience to a created being in disobedience to the Creator.",
        arabic: "لاَ طَاعَةَ لِمَخْلُوقٍ فِي مَعْصِيَةِ الْخَالِقِ",
        source: "Musnad Aḥmad ibn Ḥanbal",
        category: "hadith",
        commentary: "Definitive rejection of blind obedience to rulers who command tyranny or violate justice.",
      },
    ],
    traditionalistCounter:
      "Traditionalist and Quietist Salafi strands (e.g., Madkhalism) cite Hadith traditions regarding patience under rulers to argue that Muslims must blindly obey any ruler who claims Islam, prohibiting political critique, elections, or deposition.",
    jauhariRebuttal:
      "Quietist Salafism conflates patience under general societal hardship with total religious submission to autocratic tyranny. The Prophet’s Farewell Sermon establishes that no human possesses innate superiority over another except through righteousness and justice. Commands to obey rulers in classical Hadith are explicitly conditional: 'There is no obedience to a created being in disobedience to the Creator.' When a ruler violates objective justice (ʿAdl) and systemic rights (al-amānāt), the civic contract is void.",
    scientificCivicAlignment: [
      "Constitutional Democracy & Rule of Law",
      "Universal Human Rights & Civic Meritocracy",
      "Separation of Powers & Anti-Autocratic Resistance",
      "Revocability of Executive Authority (Impeachment / ʿAzl)",
    ],
    modernDisciplines: "Constitutional Law, Political Science, Human Rights, Democratic Theory",
    keywords: ["Shūrā", "Bayʿah", "Amānah", "Anti-Quietism", "Farewell Sermon"],
    accentColor: "rose",
  },
];

export const SUMMARY_MATRIX_ROWS: MatrixRow[] = [
  {
    number: "I",
    name: "Tawḥīd & Niẓām",
    latinTitle: "Absolute Transcendence & Cosmic Order",
    coreConcept: "God is non-material; cosmos is an autonomous system governed by mathematical natural laws (sunan Allāh).",
    primaryQuranAnchor: "Surah ash-Shura (42:11); Surah ar-Rahman (55:5–7)",
    primarySunnahAnchor: "Farewell Sermon; Eclipse Hadith (Bukhari #1043)",
    modernAlignment: "Astrophysics; Quantum Mechanics; General Relativity; Conservation Laws",
    traditionalistContrast: "Radical occasionalism; universe has no intrinsic laws; anthropomorphic literalism.",
  },
  {
    number: "II",
    name: "ʿAdl & Asbāb",
    latinTitle: "Objective Justice & Intrinsic Causality",
    coreConcept: "Matter possesses God-given intrinsic properties; humans possess genuine moral free will and accountability.",
    primaryQuranAnchor: "Surah an-Nisa (4:40); Surah Fatir (35:43)",
    primarySunnahAnchor: "'Tie her and rely upon God' (Tirmidhi #2517)",
    modernAlignment: "Physical Causality; Chemistry; Human Moral Agency",
    traditionalistContrast: "Voluntaristic morality (might equals right); denial of subatomic causality; fatalism.",
  },
  {
    number: "III",
    name: "ʿAql & Burhān",
    latinTitle: "Intellect as Primary Internal Proof",
    coreConcept: "Reason (al-ḥujjah al-bāṭinah) is co-equal proof; scripture must be read allegorically (taʾwīl) if in apparent conflict.",
    primaryQuranAnchor: "Surah Yunus (10:100); Surah Ali 'Imran (3:7)",
    primarySunnahAnchor: "Epistemic Duality Tradition (al-Ḥujjah al-Bāṭinah)",
    modernAlignment: "Propositional Logic; Mathematical Physics; Hermeneutics",
    traditionalistContrast: "Fideism; human intellect claimed fundamentally defective; hyper-literal textualism.",
  },
  {
    number: "IV",
    name: "Taṣḥīḥ & Tafnīd",
    latinTitle: "Empirical Verification & Falsification",
    coreConcept: "Rejection of taqlīd (blind imitation); scientific observation and peer falsification as religious duties.",
    primaryQuranAnchor: "Surah al-Isra (17:36); Surah al-Ankabut (29:20)",
    primarySunnahAnchor: "Date-Palm Instruction ('Antum aʿlamu...' - Muslim #2363)",
    modernAlignment: "Empirical Scientific Method; Falsification; Peer Review",
    traditionalistContrast: "Ancestral imitation (taqlīd); scholastic consensus (ijmāʿ) elevated over empirical facts.",
  },
  {
    number: "V",
    name: "Ḥikmah & Ijtihād",
    latinTitle: "Ethical Teleology & Dynamic Adaptation",
    coreConcept: "Science and jurisprudence exist to serve objective human welfare (maṣlaḥah) and environmental cultivation.",
    primaryQuranAnchor: "Surah Hud (11:61); Surah al-Anbiya (21:107)",
    primarySunnahAnchor: "Hadith of Muʿādh ibn Jabal (Abu Dawud #3592)",
    modernAlignment: "Bioethics; Environmental Stewardship; Dynamic Jurisprudence",
    traditionalistContrast: "Static legal ritualism; suspicion of modern technology; environmental neglect.",
  },
  {
    number: "VI",
    name: "Aṣālah & Isnād",
    latinTitle: "Basran Synthesis & Historical Lineage",
    coreConcept: "Indigenous 1st-century roots under al-Ḥasan al-Baṣrī, ʿAlī, and Ibn ʿAbbās preceding Greek translations.",
    primaryQuranAnchor: "Surah at-Tawbah (9:65); Surah Ali 'Imran (3:7)",
    primarySunnahAnchor: "Al-Ḥasan al-Baṣrī’s Risālah; Manuscripts of Daqīq al-Kalām",
    modernAlignment: "Historical-Critical Method; Archival Textual Archaeology",
    traditionalistContrast: "False claim that rationalism is an alien Greek import; erasure of early kalām manuscripts.",
  },
  {
    number: "VII",
    name: "Shūrā & Bayʿah",
    latinTitle: "Meritocratic Civic Governance",
    coreConcept: "Leadership is a revocable civic contract based on merit and consent; right of deposition (ʿazl) for tyranny.",
    primaryQuranAnchor: "Surah ash-Shura (42:38); Surah an-Nisa (4:58)",
    primarySunnahAnchor: "Farewell Sermon ('No superiority... except by Taqwā')",
    modernAlignment: "Constitutional Democracy; Meritocracy; Human Rights",
    traditionalistContrast: "Quietist Salafism (Madkhalism); unconditional obedience to tyrants; dynastic kingship.",
  },
];

export const IMPLEMENTATION_BLUEPRINT = [
  {
    id: "blueprint-1",
    phase: "5.1",
    title: "Reclaiming the Physical Sciences",
    arabic: "استرداد العلوم الطبيعية",
    theme: "Kitāb al-Kawn (The Book of Creation)",
    summary:
      "The physical sciences must no longer be viewed as 'Western importations' to be hesitantly Islamized. Natural science is the direct study of God's unwritten scripture—the Book of Creation (Kitāb al-Kawn).",
    actions: [
      "Physics, chemistry, biology, and mathematics are formal acts of witnessing divine order (niẓām).",
      "Dismantle the apologetic 'Islamization of knowledge' paradigm that treats science as alien.",
      "Recognize scientific research institutions as modern sanctuaries of divine contemplation (tadabbur).",
      "Re-establish cosmic mathematics and empirical discovery at the center of Islamic educational models.",
    ],
  },
  {
    id: "blueprint-2",
    phase: "5.2",
    title: "Deconstructing Anti-Intellectual Dogmas",
    arabic: "تفكيك الأيديولوجيات المعادية للعقل",
    theme: "Refuting Quietism & Madkhalism",
    summary:
      "Intellectual revival requires actively deconstructing systems that weaponize piety to enforce scientific illiteracy and political passivity.",
    actions: [
      "Scholars, educators, and writers must expose hyper-literalist ideologies (e.g., Madkhalism) as late political inventions designed to serve authoritarian interests.",
      "Critique radical occasionalism in school curricula, replacing it with Quranic causal realism (asbāb).",
      "Re-examine late-medieval consensus (ijmāʿ) through the lens of historical archaeology.",
      "Restore the distinction between immutable revelation (naṣṣ) and fallible human interpretations.",
    ],
  },
  {
    id: "blueprint-3",
    phase: "5.3",
    title: "Building Institutional Infrastructure",
    arabic: "بناء البنية التحتية المؤسسية",
    theme: "Curricula, Research & Manuscript Publishing",
    summary:
      "Project Jauhari calls for establishing research centers, educational curricula, and publication platforms dedicated to long-term intellectual restoration.",
    actions: [
      "Re-editing and publishing classical rationalist manuscripts: Daqīq al-Kalām, Zaydi codices, and Ibadi archives.",
      "Formulating modern Islamic approaches to bioethics, artificial intelligence, and environmental stewardship grounded in Axiom V.",
      "Developing integrated educational models where students learn formal logic, modern physics, and Quranic exegesis as an organic whole.",
      "Creating global academic exchanges bridging scientists, philosophers, and theological scholars.",
    ],
  },
];

export const BIBLIOGRAPHY_ENTRIES: BibliographyEntry[] = [
  {
    id: "bib-1",
    author: "Al-Bukhārī, Muḥammad ibn Ismāʿīl",
    arabicAuthor: "محمد بن إسماعيل البخاري",
    work: "Al-Jāmiʿ al-Ṣaḥīḥ (Ṣaḥīḥ al-Bukhārī)",
    arabicWork: "صحيح البخاري",
    category: "Classical Hadith",
    citations: "Hadith #1043 (Solar Eclipse), #2652 (Best Generations), #3191 (Pre-existence of God), #6227 (Creation).",
    relevance: "Cited for the Prophet's explicit rejection of celestial superstition during the solar eclipse.",
  },
  {
    id: "bib-2",
    author: "Muslim ibn al-Ḥajjāj",
    arabicAuthor: "مسلم بن الحجاج",
    work: "Al-Musnad al-Ṣaḥīḥ (Ṣaḥīḥ Muslim)",
    arabicWork: "صحيح مسلم",
    category: "Classical Hadith",
    citations: "Hadith #901 (Solar Eclipse), #2363 (Date Palm Pollination), #2517 (Tying the Camel).",
    relevance: "Establishes the epistemic autonomy of worldly empirical sciences ('Antum aʿlamu bi-amri dunyākum').",
  },
  {
    id: "bib-3",
    author: "Abū Dāwūd al-Sijistānī",
    arabicAuthor: "أبو داود السجستاني",
    work: "Sunan Abī Dāwūd",
    arabicWork: "سنن أبي داود",
    category: "Classical Hadith",
    citations: "Hadith #3592 (Hadith of Muʿādh ibn Jabal), #3855 (Medical Naturalism).",
    relevance: "Approves dynamic rational reasoning (ijtihād) and commands empirical medical treatment.",
  },
  {
    id: "bib-4",
    author: "At-Tirmidhī, Muḥammad ibn ʿĪsā",
    arabicAuthor: "محمد بن عيسى الترمذي",
    work: "Sunan at-Tirmidhi",
    arabicWork: "سنن الترمذي",
    category: "Classical Hadith",
    citations: "Hadith #2517 ('Tie her and rely upon God'), #1327 (Hadith of Muʿādh).",
    relevance: "Foundational evidence for physical cause-and-effect as the prerequisite for spiritual reliance.",
  },
  {
    id: "bib-5",
    author: "Abū Rashīd al-Nīsābūrī",
    arabicAuthor: "أبو رشيد النيسابوري",
    work: "Al-Masāʾil fī al-Khilāf bayn al-Baṣriyyīn wa-al-Baghdādiyyīn",
    arabicWork: "المسائل في الخلاف بين البصريين والبغداديين",
    category: "Kalam & Theology",
    citations: "Ed. Ma'n Ziyadah & Ridwan al-Sayyid. Beirut: Ma'had al-Inma' al-Arabi, 1979.",
    relevance: "Systematic documentation of early Basran atomic physics (daqīq al-kalām) and ontology.",
  },
  {
    id: "bib-6",
    author: "Qāḍī ʿAbd al-Jabbār ibn Aḥmad",
    arabicAuthor: "القاضي عبد الجبار بن أحمد",
    work: "Sharḥ al-Uṣūl al-Khamsa & Al-Mughnī fī Abwāb al-Tawḥīd wa-l-ʿAdl",
    arabicWork: "شرح الأصول الخمسة والمغني",
    category: "Kalam & Theology",
    citations: "Cairo: Maktabat Wahba & al-Alpāniyyah.",
    relevance: "Comprehensive classical exposition of objective divine justice (ʿAdl) and demonstrative reason.",
  },
  {
    id: "bib-7",
    author: "Al-Ḥasan al-Baṣrī",
    arabicAuthor: "الحسن البصري",
    work: "Risālah ilā ʿAbd al-Malik ibn Marwān fī al-Qadar",
    arabicWork: "رسالة الحسن البصري إلى عبد الملك بن مروان في القدر",
    category: "Kalam & Theology",
    citations: "Ed. H. Ritter (Der Islam 21).",
    relevance: "Earliest surviving theological treatise, establishing human moral responsibility and objective justice.",
  },
  {
    id: "bib-8",
    author: "Imam Zayd ibn ʿAlī",
    arabicAuthor: "الإمام زيد بن علي",
    work: "Musnad al-Imām Zayd (Al-Majmūʿ al-Fiqhī)",
    arabicWork: "مسند الإمام زيد",
    category: "Zaydi & Ibadi Primary",
    citations: "Beirut: Dār al-Kutub al-ʿIlmiyya.",
    relevance: "Classical preservation of the epistemic duality tradition (al-ḥujjah al-bāṭinah) and anti-tyranny fiqh.",
  },
  {
    id: "bib-9",
    author: "Al-Kulaynī, Muḥammad ibn Yaʿqūb",
    arabicAuthor: "محمد بن يعقوب الكليني",
    work: "Al-Kāfī, Vol. 1 (Kitāb al-ʿAql wa-l-Jahl)",
    arabicWork: "الكافي: كتاب العقل والجهل",
    category: "Zaydi & Ibadi Primary",
    citations: "Tehran: Dār al-Kutub al-Islāmiyya.",
    relevance: "Primary transmitter of the twin proofs of God (Messengers as external proof; Reason as internal proof).",
  },
  {
    id: "bib-10",
    author: "Al-Sālimī, Nūr al-Dīn ʿAbd Allāh",
    arabicAuthor: "نور الدين عبد الله السالمي",
    work: "Mashāriq Anwār al-ʿUqūl fī Taḥqīq Muʿtaqad al-Uṣūl",
    arabicWork: "مشارق أنوار العقول في تحقيق معتقد الأصول",
    category: "Zaydi & Ibadi Primary",
    citations: "Muscat: Ministry of Heritage and Culture.",
    relevance: "Authoritative Ibadi kalām manual synthesizing non-anthropomorphic tanzīh and contractual civic imamah.",
  },
  {
    id: "bib-11",
    author: "Ibn Khaldūn, ʿAbd al-Raḥmān",
    arabicAuthor: "عبد الرحمن بن خلدون",
    work: "Al-Muqaddimah (The Muqaddimah)",
    arabicWork: "مقدمة ابن خلدون",
    category: "Historical & Sectarian",
    citations: "Book 1. Beirut: Dār al-Fikr.",
    relevance: "Historical analysis of how royal authority (mulk) displaced early contractual civic consultation (shūrā).",
  },
  {
    id: "bib-12",
    author: "Al-Ṭabarī, Muḥammad ibn Jarīr",
    arabicAuthor: "محمد بن جرير الطبري",
    work: "Jāmiʿ al-Bayān ʿan Taʾwīl Āy al-Qurʾān (Tafsīr al-Ṭabarī)",
    arabicWork: "تفسير الطبري",
    category: "Historical & Sectarian",
    citations: "Cairo: Dār Hijr. Cited for sabab al-nuzūl of 9:65 and 3:7 waqf.",
    relevance: "Primary documentation for the transmission of Ibn ʿAbbās's conjunction in Surah Ali 'Imran (3:7).",
  },
];

export const CURATED_FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "Was early Islamic rationalism imported from Greek philosophy?",
    category: "Epistemology & Reason",
    relatedAxiomNumber: "VI",
    keyScripture: "Surah at-Tawbah (9:65); Al-Ḥasan al-Baṣrī's Risālah",
    summary:
      "No. Historical chronology proves that early rationalism was indigenous to 1st-century Medina and Basra, preceding the translation of Greek texts by decades.",
    answer:
      "Historical chronology decisively refutes the claim that Islamic rationalism was an alien Greek importation. The foundational doctrines of Mu'tazilism, Ibadism, and Zaydism—including objective justice (ʿAdl), human moral agency, atomic physics (daqīq al-kalām), and the primacy of intellect (ʿAql)—were formulated and debated in 1st and early 2nd century Medina and Basra by figures like al-Ḥasan al-Baṣrī (d. 110 AH), Jābir ibn Zayd (d. 93 AH), and Wāṣil ibn ʿAṭāʾ (d. 131 AH). This occurred decades before the Abbasid translation movement rendered Aristotle and Plato into Arabic under Caliph al-Ma'mūn. Early kalām was an indigenous development arising directly from Quranic imperatives.",
  },
  {
    id: "faq-2",
    question: "Does asserting physical causality (asbāb) undermine God's omnipotence?",
    category: "Theology & Metaphysics",
    relatedAxiomNumber: "II",
    keyScripture: "Surah Fatir (35:43); Sunan at-Tirmidhi (#2517)",
    summary:
      "No. God is the Creator of both the causes and the effects; establishing invariant natural laws is the highest demonstration of divine wisdom (Ḥikmah).",
    answer:
      "Affirming real physical cause-and-effect does not limit God; it honors His wisdom (Ḥikmah). God created matter with intrinsic properties—gravity attracts, fire combusts, medicine cures. When a cause produces an effect, it does so by the continuous, autonomous law (Sunnah) established by God. Radical occasionalism—claiming God must directly recreate every atom and accident without intermediate causes—turns the cosmos into an unpredictable, chaotic illusion where science becomes impossible. The Quran explicitly praises God's creation as an orderly measure (qadar) with an unchanging Sunnah (Surah Fatir 35:43).",
  },
  {
    id: "faq-3",
    question: "How does Project Jauhari explain miracles (muʿjizāt) if natural laws are invariant?",
    category: "Science & Causality",
    relatedAxiomNumber: "I",
    keyScripture: "Surah ar-Rahman (55:5–7); Sahih al-Bukhari (#1043)",
    summary:
      "Miracles are rare, purposeful epistemic exceptions that prove the rule, rather than evidence of a chaotic, lawless universe.",
    answer:
      "In the Jauhari epistemological framework, miracles (muʿjizāt) are intentional, rare historical exceptions designed as prophetic signs (āyāt). Logically, a miracle cannot even be recognized as miraculous unless there is an overwhelming, predictable, and invariant baseline of natural law (niẓām). If the universe were occasionalist—where God randomly suspends fire's burning or celestial orbits at any moment—miracles would lose all evidential value because nothing would be stable. The exception proves the existence of the divine rule.",
  },
  {
    id: "faq-4",
    question: "What is the rationalist response to claims that human intellect is 'too weak' to judge revelation?",
    category: "Epistemology & Reason",
    relatedAxiomNumber: "III",
    keyScripture: "Surah Yunus (10:100); Al-Kāfī, Vol. 1",
    summary:
      "This conflates the quantity of human knowledge with the structural validity of human logic. A finite ruler cannot measure an ocean, but its inches remain mathematically accurate.",
    answer:
      "Traditionalists often cite verses stating that man was given 'little knowledge' to invalidate human logic. However, this conflates the scope (quantity) of information with the validity (structural truth) of reasoning. A standard 12-inch ruler cannot measure the depth of the Pacific Ocean, but the inches it does measure are mathematically true. Furthermore, revelation is addressed to human minds; if the logical faculty is deemed fundamentally untrustworthy, humans could never authenticate whether a prophet is truthful or a scripture is divine in the first place.",
  },
  {
    id: "faq-5",
    question: "Why does Project Jauhari reject Quietist Salafism (Madkhalism) and blind obedience to autocrats?",
    category: "Governance & Ethics",
    relatedAxiomNumber: "VII",
    keyScripture: "Surah an-Nisa (4:58); Farewell Sermon (Bukhari & Muslim)",
    summary:
      "Governance is a contractual trust (amānah). Unconditional submission to tyrannical monarchs is an imperial Umayyad invention that violates the Prophet's Farewell Sermon.",
    answer:
      "Quietist Salafism (such as Madkhalism) enforces unconditional submission to any ruler who claims Islam, prohibiting political critique, constitutional accountability, or deposition. Project Jauhari rejects this as an imperial political corruption. Under Axiom VII, political leadership is an amānah (conditional trust) governed by mutual consultation (shūrā) and objective justice (ʿadl). The Prophet's Farewell Sermon established that no person holds inherent superiority over another except through piety and justice. As stated in authentic hadith: 'There is no obedience to a created being in disobedience to the Creator.' A ruler who commits systemic tyranny breaches the civic contract (bayʿah) and forfeits the right to govern.",
  },
  {
    id: "faq-6",
    question: "How does the Hermeneutical Conjunction of Surah Ali 'Imran (3:7) change Quranic interpretation?",
    category: "Epistemology & Reason",
    relatedAxiomNumber: "III",
    keyScripture: "Surah Ali 'Imran (3:7); Tafsīr al-Ṭabarī",
    summary:
      "By connecting 'except Allah AND those firm in knowledge', Ibn ʿAbbās affirmed that competent scholars can understand metaphorical texts through rational hermeneutics (taʾwīl).",
    answer:
      "In Surah Ali 'Imran (3:7), literalists pause (waqf) after 'except Allah', claiming that no human being can ever understand metaphorical or ambiguous verses (mutashābihāt). However, the premier Quranic exegete among the Companions, ʿAbd Allāh ibn ʿAbbās, read the verse with a conjunction (ʿaṭf): 'And none knows its interpretation except Allah AND those who are firm in knowledge (wa-r-rāsikhūna fī-l-ʿilm).' Ibn ʿAbbās explicitly stated: 'I am among those firm in knowledge who know its interpretation.' This establishes that reason-guided allegorical interpretation (taʾwīl) is a sanctioned method for resolving apparent textual conflicts.",
  },
  {
    id: "faq-7",
    question: "How does Project Jauhari view biological evolution, astrophysics, and quantum physics?",
    category: "Science & Causality",
    relatedAxiomNumber: "I",
    keyScripture: "Surah al-Ankabut (29:20); Surah al-Qamar (54:49)",
    summary:
      "Modern sciences are the empirical discovery of God's unwritten Book of Creation (Kitāb al-Kawn). Scientific truths cannot contradict authentic revelation.",
    answer:
      "Project Jauhari views biological evolution, quantum mechanics, and astrophysics as empirical investigations into the Book of Creation (Kitāb al-Kawn). In Surah al-Ankabut (29:20), the Quran directly commands humans: 'Travel through the earth and observe how He originated creation.' Biological evolution is the discovered biological mechanism through which divine order manifests, completely distinct from philosophical materialism. Just as gravity describes how God sustains celestial orbits, evolutionary biology describes how God unfolds biological diversity over deep geological time.",
  },
  {
    id: "faq-8",
    question: "What does the date-palm pollination Hadith teach us about religious vs. worldly knowledge?",
    category: "Science & Causality",
    relatedAxiomNumber: "IV",
    keyScripture: "Sahih Muslim (#2363)",
    summary:
      "The Prophet ﷺ clearly delineated between divine moral/theological guidance and autonomous empirical worldly expertise ('Antum aʿlamu bi-amri dunyākum').",
    answer:
      "In Sahih Muslim (#2363), when the Prophet ﷺ suggested that cross-pollinating date palms might not be necessary, resulting in a poor yield, he openly clarified: 'You are more knowledgeable about the affairs of your worldly world (Antum aʿlamu bi-amri dunyākum).' This profound prophetic statement established the epistemic autonomy of empirical sciences, agronomy, engineering, and medicine. Revelation provides moral teleology, metaphysics, and ethical boundaries; it is not an encyclopedia of empirical botany or astrophysics.",
  },
];
