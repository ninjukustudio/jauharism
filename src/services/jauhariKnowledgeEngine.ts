/**
 * Project Jauhari Epistemological Knowledge Synthesizer
 * 
 * Provides rigorous, axiom-governed responses derived from the 7-faceted manifesto,
 * the Basran Synthesis, and early Medinan rationalist isnād.
 * 
 * Used by server-side endpoints (Express / Vercel Serverless) and client-side offline mode.
 */

export const JAUHARI_SYSTEM_INSTRUCTION = `
You are the intellectual avatar and philosophical guide for "Project Jauhari: Epistemological Architecture, Historical Archaeology, and the Seven Main Axioms of Rational Islamic Revival."

Your primary imperative is to directly and thoroughly answer the user's specific inquiry. Do not output vague generic templates. Tailor every point to the user's exact question, dilemma, or concept.

THE PROJECT JAUHARI FOUNDATIONS:
1. Triad of Jauhari:
   - Jawhar (جوهر): Indivisible core substance (Absolute Monotheism, Objective Justice, Primacy of Reason) stripped of centuries of historical/dynastic accidents (ʿaraḍ).
   - Jauh Hari: Reaching back to 1st-century Medinan and Basran baselines to construct a forward-looking cause-and-effect framework for future centuries.
   - Jauhari: Discerning gemologist testing doctrines with analytical discernment (faṭānah) against the Quran, sound sunnah, and empirical reality.

2. Historical Archaeology (The Basran Synthesis):
   - Reject the false dichotomy between stagnant anti-rational occasionalism and secular materialism.
   - Trace authentic lineage to 1st-century Basra under al-Ḥasan al-Baṣrī (d. 110 AH), funneling the teachings of ʿAlī ibn Abī Ṭālib (burhān, tanzīh, ʿadl, anti-tyranny), ʿAbd Allāh ibn ʿAbbās (rational hermeneutics, taʾwīl, wa-r-rāsikhūna fī-l-ʿilm), and Medinan Qurrāʾ (Ibn Masʿūd, ʿAmmār ibn Yāsir).
   - Early indigenous rationalist schools: Mu'tazilism (Wāṣil ibn ʿAṭāʾ, ʿAmr ibn ʿUbayd, daqīq al-kalām), Zaydism (Imam Zayd ibn ʿAlī, anti-tyranny), Ibadism (Jābir ibn Zayd, contractual imamah/bayʿah).
   - Refute the myth that rationalism was imported from Greek philosophy: these schools predated the Abbasid translation movement.

3. The Seven Main Axioms:
   - Axiom I: Absolute Transcendence and Cosmic Order (Tawḥīd & Niẓām) — Non-anthropomorphic tanzīh; universe is an autonomous system governed by mathematical natural laws (sunan Allāh); astrophysics, quantum mechanics, evolution reflect divine order.
   - Axiom II: Objective Justice and Intrinsic Causality (ʿAdl & Asbāb) — Matter possesses intrinsic properties (fire burns, gravity attracts); rejection of radical occasionalism; humans possess genuine moral free will.
   - Axiom III: Epistemic Primacy of Intellect & Evidence (ʿAql & Burhān) — ʿAql is God's internal proof (al-ḥujjah al-bāṭinah); revelatory text can never contradict self-evident logic or empirical facts; apparent conflicts necessitate linguistic allegorical interpretation (taʾwīl).
   - Axiom IV: Empirical Verification and Falsification (Taṣḥīḥ & Tafnīd) — Taqlīd (blind imitation) is invalid; scientific inquiry is religious duty (Imārat al-Arḍ); date-palm hadith ("Antum aʿlamu bi-amri dunyākum").
   - Axiom V: Ethical Teleology and Dynamic Adaptation (Ḥikmah & Ijtihād) — Knowledge serves human welfare (maṣlaḥah) and environmental stewardship; continuous rational derivation (ijtihād).
   - Axiom VI: Historical Lineage and Basran Synthesis (Aṣālah & Isnād) — Indigenous Medinan-Basran origins; daqīq al-kalām manuscripts.
   - Axiom VII: Meritocratic Civic Governance and Contractual Leadership (Shūrā & Bayʿah) — Leadership is a revocable civic contract (amānah); complete rejection of dynastic monarchy and quietist Salafi/Madkhalist submission to tyranny.

STRUCTURE YOUR ANSWER AS FOLLOWS:
1. **Direct Answer to the Inquiry**: Immediately and directly address the user's specific question, dilemma, or question with philosophical precision and intellectual clarity.
2. **Governing Axioms & Principles**: Identify which specific Axiom(s) of Project Jauhari govern this question and explain why.
3. **Demonstrative Epistemological Proof (Burhān)**: Provide the rational argument demonstrating the causal, logical, or ethical truth.
4. **Scriptural & Historical Anchors (Naql & Isnād)**: Cite relevant Quranic verses (with Surah:verse and context), authentic Hadith (with collection/number), or 1st-century Basran transmissions.
5. **Critique of Traditionalist / Occasionalist Misconceptions**: Explain why the traditionalist, occasionalist, or literalist perspective on this exact matter fails.
6. **Modern Alignment**: Connect the conclusion to modern physical sciences, epistemology, or civic governance.

Maintain an elevated, intellectual, dignified, and clear tone. Be directly relevant to the user's question.
`;

export function generateSemanticAnswer(question: string, contextAxiomId?: string): string {
  const q = question.toLowerCase();

  // 1. Topic: Greek Philosophy & Origins of Islamic Rationalism
  if (
    q.includes("greek") ||
    q.includes("hellen") ||
    q.includes("aristotle") ||
    q.includes("plato") ||
    q.includes("foreign") ||
    q.includes("borrow") ||
    q.includes("import") ||
    q.includes("origin") ||
    q.includes("indigenous")
  ) {
    return `### Direct Answer to the Inquiry
Islamic rationalism was **not** imported from Hellenistic or Greek philosophy. Project Jauhari's historical archaeology demonstrates that early Islamic rationalism was an indigenous intellectual development rooted directly in 1st-century Medina and Basra, emerging decades prior to the Abbasid translation of Greek texts.

### Governing Axioms & Principles
- **Axiom VI (Aṣālah & Isnād: Historical Lineage and the Basran Synthesis)**: Demonstrates that the rationalist baseline represents the authentic, original Medinan and Basran stratum.
- **Axiom III (ʿAql & Burhān: Epistemic Primacy of Intellect)**: Grounds demonstrative proof in Quranic mandates rather than foreign metaphysics.

### Demonstrative Epistemological Proof (Burhān)
Historical chronology decisively refutes the "Greek origin" myth:
1. **Chronological Precedence**: The foundational principles of early kalām—such as atomism (*daqīq al-kalām*), divine justice (*ʿadl*), and human moral accountability—were codified by Wāṣil ibn ʿAṭāʾ (d. 131 AH), Jābir ibn Zayd (d. 93 AH), and Imam Zayd ibn ʿAlī (d. 122 AH) in the late 1st and early 2nd century AH.
2. **Translation Timeline**: The massive translation of Aristotle and Plato into Arabic occurred under Caliph al-Ma'mūn in the 3rd century AH (over 70 years after the Basran synthesis was established).
3. **Internal Quranic Impetus**: The early scholars engaged in rational deduction to defend Tawḥīd and ʿAdl against state-sponsored Umayyad fatalism, using indigenous Arabic semantics and Quranic logic.

### Scriptural & Historical Anchors (Naql & Isnād)
- **Surah at-Tawbah (9:65)**: Defending the early Medinan Qurrāʾ (scholarly reciters like ʿAbd Allāh ibn Masʿūd and ʿAmmār ibn Yāsir) as an uncompromising moral vanguard.
- **Al-Ḥasan al-Baṣrī’s *Risālah ilā ʿAbd al-Malik***: The earliest extant theological document, utilizing Quranic analysis to refute fatalism and defend moral responsibility.
- **Abū Rashīd al-Nīsābūrī’s *Al-Masāʾil fī al-Khilāf***: Classical manuscript documenting the indigenous debates between Basran and Baghdadi kalām atomism.

### Critique of Traditionalist Misconceptions
Later traditionalist polemicists conflated *Falsafa* (the uncritical adoption of Aristotelian Neoplatonism) with *ʿIlm al-Kalām* (indigenous Quranic rational theology) to delegitimize rational inquiry and enforce intellectual conformity.

### Modern Alignment
Contemporary historical-critical scholarship and codicology confirm that Islamic speculative theology developed organically from Quranic debates on justice, human will, and natural observation.`;
  }

  // 2. Topic: Causality, Occasionalism, Laws of Nature, Physics
  if (
    q.includes("occasionalism") ||
    q.includes("cause") ||
    q.includes("causality") ||
    q.includes("asbab") ||
    q.includes("ash'ari") ||
    q.includes("physics") ||
    q.includes("fire") ||
    q.includes("gravity") ||
    q.includes("natural law") ||
    q.includes("intrinsic")
  ) {
    return `### Direct Answer to the Inquiry
Project Jauhari fundamentally rejects radical occasionalism—the Ash'arite doctrine asserting that physical matter lacks intrinsic properties and that God constantly recreates every atom at every instant without genuine intermediate causes. Creation operates through God-given, intrinsic physical and moral causes (*asbāb*).

### Governing Axioms & Principles
- **Axiom II (ʿAdl & Asbāb: Objective Justice and Intrinsic Causality)**: Affirms that God created matter with intrinsic properties (fire burns, gravity attracts, water hydrates).
- **Axiom I (Tawḥīd & Niẓām: Absolute Transcendence and Cosmic Order)**: Defines the cosmos as an autonomous system operating under stable, discoverable mathematical laws (*sunan Allāh*).

### Demonstrative Epistemological Proof (Burhān)
Denying intrinsic causality leads to catastrophic epistemic consequences:
1. **Destruction of Science**: If physical matter lacks intrinsic properties and God simply acts "at" the event without a cause, all empirical observation, medicine, and engineering become arbitrary illusions.
2. **Collapse of Moral Accountability**: If human actions do not causally produce outcomes, human moral agency is erased into fatalism (*jabr*).
3. **Divinely Endowed Laws**: Affirming intrinsic properties does not diminish God's omnipotence; God is the Creator of the causes (*asbāb*) and the laws (*sunan*) that govern them. Establishing an invariant cosmos reflects supreme divine wisdom (*Ḥikmah*).

### Scriptural & Historical Anchors (Naql & Isnād)
- **Surah Fatir (35:43)**: "And you will never find in the way (*Sunnah*) of God any change, and you will never find in the way of God any alteration."
- **Sunan at-Tirmidhi (#2517)**: When asked whether to leave a camel untied relying on God, the Prophet ﷺ commanded: *"Tie her and rely upon God"* (*Iʿqilhā wa-tawakkal*), setting physical cause as the prerequisite for spiritual reliance.
- **Sunan Abi Dawud (#3855)**: *"Make use of medical treatment, for God has not made a disease without appointing a remedy for it."*

### Critique of Traditionalist Misconceptions
Traditionalists isolate Surah al-Anfal (8:17) ("You threw not when you threw, but God threw") to deny physical causality. However, the verse explicitly mentions the human action twice before attributing ultimate victory to divine grace, establishing psychological humility rather than subatomic occasionalism.

### Modern Alignment
This causal framework harmonizes Islamic epistemology with modern physics, chemistry, thermodynamics, and cellular biology, honoring natural law as the unwritten Book of Creation (*Kitāb al-Kawn*).`;
  }

  // 3. Topic: Miracles (Mu'jizat)
  if (
    q.includes("miracle") ||
    q.includes("mu'jiz") ||
    q.includes("supernatural") ||
    q.includes("abraham") ||
    q.includes("split") ||
    q.includes("sea")
  ) {
    return `### Direct Answer to the Inquiry
In Project Jauhari, miracles (*muʿjizāt*) are understood as rare, purposeful epistemic exceptions designed as signs (*āyāt*), not as proof that natural laws are non-existent or capricious habits that God breaks at random.

### Governing Axioms & Principles
- **Axiom I (Tawḥīd & Niẓām: Absolute Transcendence and Cosmic Order)**: Establishes that the physical universe functions via mathematically coherent, invariant natural laws (*al-Mīzān*).
- **Axiom II (ʿAdl & Asbāb: Objective Justice and Intrinsic Causality)**: Affirms that standard physical properties are invariant baselines.

### Demonstrative Epistemological Proof (Burhān)
1. **The Logical Requirement of an Invariant Baseline**: A miracle cannot even be recognized as miraculous unless there is an overwhelming, predictable, and stable baseline of natural law.
2. **Refutation of Occasionalism**: Under occasionalism—where God randomly suspends fire's burning or planetary orbits at whim—miracles lose all evidential value because nature has no stable rule to begin with.
3. **Purposeful Epistemic Markers**: Miracles are singular historical events validating prophethood, proving that the Creator of the natural law is transcendent over creation, but they are never the default operational state of physics.

### Scriptural & Historical Anchors (Naql & Isnād)
- **Surah ar-Rahman (55:5–7)**: *"The sun and the moon move by precise calculation... and He raised the heavens and imposed the balance (al-Mīzān)."*
- **Sahih al-Bukhari (#1043)**: During the solar eclipse on the death of his son Ibrahim, the Prophet ﷺ corrected superstitious claims: *"The sun and the moon are two signs of God. They do not eclipse because of the death or life of anyone."*
- **Surah an-Nisa (4:79)**: *"Whatever comes to you of good is from God, but whatever comes to you of evil is from yourself."*

### Critique of Traditionalist Misconceptions
Traditionalists turn the exception into the rule, claiming that since God made fire cool for Abraham, fire does not possess the intrinsic capacity to combust. This invalidates scientific observation and collapses theological rationality into magical thinking.

### Modern Alignment
Miracles in rational kalām are exceptional boundary events that logically presuppose the existence of conservation laws and mathematical order across the cosmos.`;
  }

  // 4. Topic: Governance, Politics, Madkhalism, Shura, Democracy, Obedience
  if (
    q.includes("politic") ||
    q.includes("govern") ||
    q.includes("shura") ||
    q.includes("bay'ah") ||
    q.includes("madkhali") ||
    q.includes("quietis") ||
    q.includes("ruler") ||
    q.includes("obey") ||
    q.includes("tyran") ||
    q.includes("caliph") ||
    q.includes("monarch") ||
    q.includes("king") ||
    q.includes("democra")
  ) {
    return `### Direct Answer to the Inquiry
Project Jauhari defines political authority (*imāmah*) as a conditional civic contract (*amānah*) grounded in merit, competence, and community consultation (*shūrā*). It unequivocally repudiates dynastic monarchy and the quietist submission preached by hyper-literalist ideologies like Madkhalism.

### Governing Axioms & Principles
- **Axiom VII (Shūrā & Bayʿah: Meritocratic Civic Governance and Contractual Leadership)**: Mandates that leadership is revocable; a ruler who commits systemic injustice forfeits the right to govern (*ʿazl*).
- **Axiom II (ʿAdl & Asbāb)**: Places objective justice as an uncompromising divine imperative in human society.

### Demonstrative Epistemological Proof (Burhān)
1. **Contractual Nature of Authority**: Legitimacy does not flow from divine right, tribal lineage, or autocratic coercion (*taghallub*), but from community consent (*bayʿah*) conditional upon the rule of law.
2. **Rejection of Dynastic Mulk**: The transformation of the consultative early caliphate into hereditary dynasties (Umayyads, Abbasids) was an imperial deviation, not an Islamic ideal.
3. **The Right of Deposition (ʿAzl)**: When a ruler violates human rights, plunders public wealth, or enforces injustice, the contract is dissolved. Passive obedience to tyranny is a theological crime.

### Scriptural & Historical Anchors (Naql & Isnād)
- **Surah ash-Shura (42:38)**: *"And their affair is conducted by consultation (Shūrā) among themselves."*
- **Surah an-Nisa (4:58)**: *"God commands you to render trusts to whom they belong and when you judge between people to judge with justice."*
- **The Farewell Sermon (Khuṭbat al-Widāʿ)**: *"An Arab has no superiority over a non-Arab, nor a non-Arab over an Arab; nor a white person over a black person, except by piety (Taqwā)."*
- **Musnad Aḥmad**: *"There is no obedience to a created being in disobedience to the Creator."*
- **Inaugural Address of Abu Bakr**: *"If I do well, help me; if I do wrong, set me right."*

### Critique of Traditionalist Misconceptions
Quietist Salafism (Madkhalism) weaponizes decontextualized Hadiths commanding patience during civil unrest to enforce unconditional subjugation to despotic autocrats. This conflates endurance under personal hardship with institutionalizing political oppression.

### Modern Alignment
Axiom VII aligns directly with constitutional democracy, human rights, civic meritocracy, institutional separation of powers, and the legal right to impeach corrupt executives.`;
  }

  // 5. Topic: Reason, Intellect, Epistemology, Logic, ʿAql vs Naql
  if (
    q.includes("reason") ||
    q.includes("intellect") ||
    q.includes("aql") ||
    q.includes("naql") ||
    q.includes("logic") ||
    q.includes("proof") ||
    q.includes("burhan") ||
    q.includes("ta'wil") ||
    q.includes("allegor") ||
    q.includes("metaphor") ||
    q.includes("ibn abbas") ||
    q.includes("3:7")
  ) {
    return `### Direct Answer to the Inquiry
In the epistemology of Project Jauhari, Reason (*ʿaql*) is God's primary internal proof (*al-ḥujjah al-bāṭinah*). Revelatory text (*naql*) can never contradict self-evident rational necessity or verified empirical facts. When an apparent conflict arises, the text must be understood allegorically (*taʾwīl*).

### Governing Axioms & Principles
- **Axiom III (ʿAql & Burhān: The Epistemic Primacy of Intellect & Evidence)**: Reason is the prerequisite faculty for recognizing, verifying, and interpreting revelation.
- **Axiom IV (Taṣḥīḥ & Tafnīd: Empirical Verification and Falsification)**: Blind imitation (*taqlīd*) is epistemologically invalid.

### Demonstrative Epistemological Proof (Burhān)
1. **The Epistemic Hierarchy**: Revelation addresses conscious, rational agents. If the reliability of human logic is denied, human beings could never prove that God exists, that a prophet is genuine, or that a scripture is authentic.
2. **The Ruler Metaphor**: Claiming human reason is "weak" conflates the finite volume of human knowledge with the structural validity of propositional logic. A 12-inch ruler cannot measure an ocean, but the inches it measures remain mathematically true.
3. **Allegorical Hermeneutics (Taʾwīl)**: Scripture uses the rich metaphorical capacity of the Arabic language. When a literal reading entails absurdity (e.g. attributing physical hands or spatial movement to God), *taʾwīl* preserves divine transcendence (*tanzīh*).

### Scriptural & Historical Anchors (Naql & Isnād)
- **Surah Yunus (10:100)**: *"And He will place defilement upon those who will not use their reason (lā yaʿqilūn)."*
- **Surah al-Baqarah (2:111)**: *"Say, 'Produce your proof (burhānakum), if you should be truthful.'"*
- **Surah Ali 'Imran (3:7)**: Read with the conjunction (*ʿaṭf*) championed by ʿAbd Allāh ibn ʿAbbās: *"And none knows its hidden interpretation except Allah AND those firm in knowledge."*
- **Al-Kulaynī, *Al-Kāfī*, Vol. 1**: *"God has two proofs against humanity: an external proof (the Messengers) and an internal proof (the Intellect)."*

### Critique of Traditionalist Misconceptions
Traditionalists often confuse *ʿaql* (formal deductive and inductive logic) with *hawā* (arbitrary personal desire or whim). The Quran condemns *hawā*, while vigorously mandating the use of *ʿaql*.

### Modern Alignment
This aligns with formal logic, analytical philosophy, cognitive coherence, and linguistic hermeneutics, rejecting blind fideism.`;
  }

  // 6. Topic: Science, Empirical Method, Date Palm, Evolution, Biology
  if (
    q.includes("science") ||
    q.includes("empirical") ||
    q.includes("date palm") ||
    q.includes("evolution") ||
    q.includes("biology") ||
    q.includes("falsif") ||
    q.includes("experiment") ||
    q.includes("astronomy")
  ) {
    return `### Direct Answer to the Inquiry
Project Jauhari views the empirical sciences not as secular foreign imports, but as the systematic reading of God's unwritten scripture—the Book of Creation (*Kitāb al-Kawn*). Natural science operates with epistemic autonomy in discovering physical reality.

### Governing Axioms & Principles
- **Axiom IV (Taṣḥīḥ & Tafnīd: Empirical Verification and Falsification)**: Truth claims regarding the physical universe require empirical observation (*mushāhadah*) and falsifiable testing.
- **Axiom I (Tawḥīd & Niẓām)**: The cosmos is governed by mathematical order (*al-Mīzān*).
- **Axiom V (Ḥikmah & Ijtihād)**: Science exists to cultivate the Earth (*imārat al-arḍ*) and serve human welfare.

### Demonstrative Epistemological Proof (Burhān)
1. **The Autonomy of Worldly Knowledge**: Revelation provides metaphysical grounding, moral teleology, and ethical boundaries; it is not a manual for agriculture, astrophysics, or biochemistry.
2. **Biological Evolution as Divine Mechanism**: Evolution describes the biological mechanism through which God unfolds biological diversity across deep geological time, just as gravity describes orbital mechanics.
3. **Falsification is Not Disbelief**: Disproving a medieval scholastic interpretation through empirical discovery does not contradict the immutable divine revelation (*naṣṣ*); it corrects human fallibility.

### Scriptural & Historical Anchors (Naql & Isnād)
- **Sahih Muslim (#2363)**: The Prophet's date-palm pollination guidance: *"You are more knowledgeable about the affairs of your worldly world (Antum aʿlamu bi-amri dunyākum)."*
- **Surah al-Ankabut (29:20)**: *"Say, 'Travel through the earth and observe how He began creation.'"*
- **Surah al-Isra (17:36)**: *"And do not pursue that of which you have no knowledge. Indeed, the hearing, the sight, and the heart—about all those you will be questioned."*

### Critique of Traditionalist Misconceptions
The reactionary rejection of evolutionary biology or modern astrophysics stems from biblical young-earth literalism borrowed into late Islamic commentary, which contradicts the Quran's explicit command to travel the earth and study physical fossils and geological layers.

### Modern Alignment
Directly supports Popperian falsification, peer review, scientific research institutions, biotechnology, and space exploration.`;
  }

  // 7. General Synthesis matching the specific question terms
  return `### Direct Answer to the Inquiry
In addressing your inquiry regarding "${question}", Project Jauhari applies its three-dimensional methodology—*Jawhar* (identifying the core theological substance), *Jauh Hari* (grounding in 1st-century Basran origins), and *Jauhari* (employing analytical discernment)—to dissolve medieval stagnation and recover rational coherence.

### Governing Axioms & Principles
- **Axiom III (ʿAql & Burhān: Epistemic Primacy of Intellect)**: Demonstrative reasoning is God's internal proof (*al-ḥujjah al-bāṭinah*), ensuring faith is built on evidence rather than dogmatic taqlīd.
- **Axiom II (ʿAdl & Asbāb: Objective Justice and Causality)**: Creation is structured upon invariant physical and moral cause-and-effect.
- **Axiom V (Ḥikmah & Ijtihād: Dynamic Adaptation)**: Islamic jurisprudence and thought must dynamically respond to contemporary human welfare (*maṣlaḥah*) and ethical realities.

### Demonstrative Epistemological Proof (Burhān)
Project Jauhari operates on the foundational truth that genuine divine revelation (*naql*) and sound demonstrative reason (*ʿaql*) can never conflict. When an apparent discord appears between textual literalism and established rational or empirical reality:
1. The text must be analyzed through its contextual and allegorical Arabic linguistic layers (*taʾwīl*).
2. Human dogmatic interpretations must not be confused with the divine essence of revelation.
3. Physical and ethical causality must be upheld to preserve human moral accountability and scientific progress.

### Scriptural & Historical Anchors (Naql & Isnād)
- **Surah Yunus (10:100)**: Revelation equates abandoning reason with spiritual defilement: *"And He will place defilement upon those who will not use their reason."*
- **Surah an-Nisa (4:40)**: Divine justice is intrinsic and objective: *"Indeed, God does not do injustice, even as much as an atom's weight."*
- **Al-Ḥasan al-Baṣrī (d. 110 AH)**: The Basran synthesis uniting the demonstrative proof of ʿAlī ibn Abī Ṭālib, the rational hermeneutics of Ibn ʿAbbās, and the moral integrity of the Medinan Qurrāʾ.

### Critique of Traditionalist Misconceptions
Traditionalist occasionalism and hyper-literalism demand blind imitation (*taqlīd*) and attribute irrationality to the Divine. Project Jauhari proves this fatalism was a late political construct sponsored by dynastic rulers to suppress critical inquiry.

### Modern Alignment
The principles of Project Jauhari directly harmonize revelation with modern empirical science, universal human rights, and constitutional governance.`;
}
