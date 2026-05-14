// Practice Evidence stimulus library — v2 with cultural inclusion + moral/ethical/cultural-difference triggers.
// Source draft: src/practice-evidence/STIMULI_DRAFT.md
// This file is the runtime-consumable form (markdown is human-review form). Both kept in sync.

export const AFFECT_LABELING_STIMULI = [
  // EXCITED
  { id: "AL_E1", prompt: "You just got a yes from someone whose opinion you've been chasing for months.", primaryChip: "excited", secondaryChip: "focused", trigger: "external-validation", context: null },
  { id: "AL_E2", prompt: "You walk out of an audition, a pitch, or a first date and you can feel something landed.", primaryChip: "excited", secondaryChip: null, trigger: "post-performance", context: null },
  { id: "AL_E3", prompt: "A close friend tells you they bought the tickets for the trip you've been planning together.", primaryChip: "excited", secondaryChip: null, trigger: "anticipation-positive", context: null },
  { id: "AL_E4", prompt: "Your grandmother calls to say a recipe she's been holding back for years is finally yours to learn.", primaryChip: "excited", secondaryChip: "settled", trigger: "heritage-handoff", context: "family-tradition" },
  { id: "AL_E5", prompt: "A scholarship or grant application you were sure you wouldn't get comes through.", primaryChip: "excited", secondaryChip: null, trigger: "financial-relief-aspirational", context: "economic-access" },
  { id: "AL_E6", prompt: "Your team won the championship and the city is going to celebrate tonight.", primaryChip: "excited", secondaryChip: null, trigger: "collective-victory", context: "community-shared-event" },
  { id: "AL_E7", prompt: "Your name appears on a list you didn't expect to be on.", primaryChip: "excited", secondaryChip: "anxious", trigger: "recognition-unexpected", context: null },

  // FOCUSED
  { id: "AL_F1", prompt: "You've been on a problem for two hours and you can see the shape of the solution.", primaryChip: "focused", secondaryChip: null, trigger: "creative-flow", context: null },
  { id: "AL_F2", prompt: "You sit down at your desk after a strong morning routine and the work is right there.", primaryChip: "focused", secondaryChip: "settled", trigger: "routine-anchor", context: null },
  { id: "AL_F3", prompt: "You're walking into a meeting where you know what you're going to say and you've prepared everything.", primaryChip: "focused", secondaryChip: null, trigger: "preparedness", context: null },
  { id: "AL_F4", prompt: "You're cooking a meal that takes seven hours and you're three hours in.", primaryChip: "focused", secondaryChip: null, trigger: "extended-craft", context: "domestic-creative" },
  { id: "AL_F5", prompt: "You're sitting with a client and the right question to ask just came to you.", primaryChip: "focused", secondaryChip: null, trigger: "presence-attentive", context: "care-work-or-consulting" },
  { id: "AL_F6", prompt: "The student in your class who never raises their hand just raised it.", primaryChip: "focused", secondaryChip: null, trigger: "attention-shift-relational", context: "teaching-caregiving" },
  { id: "AL_F7", prompt: "You're holding tools you're trained to use and the work is about to start.", primaryChip: "focused", secondaryChip: null, trigger: "skilled-trade-execution", context: "skilled-labor" },

  // SETTLED
  { id: "AL_S1", prompt: "Your shift just ended. You're sitting on the bus home and your shoulders are starting to drop.", primaryChip: "settled", secondaryChip: null, trigger: "post-shift-decompression", context: "shift-work" },
  { id: "AL_S2", prompt: "You just had a hard conversation that landed well and the other person left feeling seen.", primaryChip: "settled", secondaryChip: "focused", trigger: "relational-resolution", context: null },
  { id: "AL_S3", prompt: "You finish a long walk and your breathing has slowed without you noticing.", primaryChip: "settled", secondaryChip: null, trigger: "physiological-downshift", context: null },
  { id: "AL_S4", prompt: "You're holding your baby and they finally fell asleep on your chest.", primaryChip: "settled", secondaryChip: null, trigger: "caregiving-rest", context: "parenting" },
  { id: "AL_S5", prompt: "You and your siblings are eating something your mother used to make. Nobody has to explain anything.", primaryChip: "settled", secondaryChip: null, trigger: "heritage-shared", context: "collectivist-family" },
  { id: "AL_S6", prompt: "You finished morning prayers and the quiet after them is yours.", primaryChip: "settled", secondaryChip: null, trigger: "spiritual-practice-completion", context: "religious-practice" },
  { id: "AL_S7", prompt: "You've been in pain for three days and this morning you woke up and it isn't there.", primaryChip: "settled", secondaryChip: "distant", trigger: "pain-remission", context: "chronic-illness" },

  // ANXIOUS
  { id: "AL_AN1", prompt: "Your phone buzzes with a text from someone you've been waiting to hear from. You pick it up and your hand is shaking before you read it.", primaryChip: "anxious", secondaryChip: null, trigger: "anticipation-uncertain", context: null },
  { id: "AL_AN2", prompt: "Email subject line: 'we need to talk' from someone you can't ignore.", primaryChip: "anxious", secondaryChip: null, trigger: "work-confrontation-pending", context: null },
  { id: "AL_AN3", prompt: "Your doctor's office called and left a voicemail asking you to call back. The office is closed for the weekend.", primaryChip: "anxious", secondaryChip: null, trigger: "health-uncertainty", context: null },
  { id: "AL_AN4", prompt: "Rent is due in three days and the deposit you were expecting hasn't landed.", primaryChip: "anxious", secondaryChip: null, trigger: "financial-acute", context: "housing-precarity" },
  { id: "AL_AN5", prompt: "You're crossing a border with a document situation that's complicated to explain.", primaryChip: "anxious", secondaryChip: "stuck", trigger: "status-precarity", context: "immigration" },
  { id: "AL_AN6", prompt: "Your parent calls outside their usual time. Their voice on the message is different.", primaryChip: "anxious", secondaryChip: null, trigger: "family-emergency-anticipation", context: "caregiving-distance" },
  { id: "AL_AN7", prompt: "You're about to disclose something about yourself to someone whose reaction you can't predict.", primaryChip: "anxious", secondaryChip: "stuck", trigger: "disclosure", context: "identity-or-health-or-belief" },
  { id: "AL_AN8", prompt: "The pregnancy test is on the counter and the timer hasn't gone off yet.", primaryChip: "anxious", secondaryChip: null, trigger: "anticipation-life-altering", context: "reproductive" },

  // ANGRY
  { id: "AL_AG1", prompt: "Someone interrupts you for the third time in the same meeting and looks at the person who actually asked the question.", primaryChip: "angry", secondaryChip: null, trigger: "workplace-erasure", context: null },
  { id: "AL_AG2", prompt: "Your partner tells you they handled something the way you specifically asked them not to.", primaryChip: "angry", secondaryChip: null, trigger: "boundary-violation-domestic", context: null },
  { id: "AL_AG3", prompt: "You read a message thread where someone takes credit for your work in front of people you respect.", primaryChip: "angry", secondaryChip: "stuck", trigger: "professional-violation", context: null },
  { id: "AL_AG4", prompt: "Someone makes a joke about people like you. The room laughs. Nobody looks at you.", primaryChip: "angry", secondaryChip: "distant", trigger: "identity-marked-violation", context: "marginalization" },
  { id: "AL_AG5", prompt: "A relative says something casual about your body that they meant as helpful.", primaryChip: "angry", secondaryChip: "stuck", trigger: "body-policing-familial", context: "family-of-origin" },
  { id: "AL_AG6", prompt: "You overhear two coworkers calling someone you know by a nickname they wouldn't use to their face.", primaryChip: "angry", secondaryChip: null, trigger: "witnessed-disrespect", context: "workplace" },
  { id: "AL_AG7", prompt: "Your child comes home and tells you what was said to them at school today.", primaryChip: "angry", secondaryChip: "stuck", trigger: "parental-protective", context: "parenting" },
  { id: "AL_AG8", prompt: "You see a news story about something that happened in your community and the comments are below it.", primaryChip: "angry", secondaryChip: "distant", trigger: "collective-violation", context: "public-discourse" },

  // STUCK — includes moral / ethical / cultural-difference triggers
  { id: "AL_ST1", prompt: "You've rewritten the same email seven times and the cursor is still blinking at the end.", primaryChip: "stuck", secondaryChip: null, trigger: "decision-paralysis-output", context: null },
  { id: "AL_ST2", prompt: "You keep checking the chat to see if they replied. They haven't replied for an hour.", primaryChip: "stuck", secondaryChip: "anxious", trigger: "rumination-relational", context: null },
  { id: "AL_ST3", prompt: "You can't decide between two options and you've been deciding for three days.", primaryChip: "stuck", secondaryChip: null, trigger: "decision-paralysis-choice", context: null },
  { id: "AL_ST4", prompt: "A conversation from two days ago is replaying in your head and you keep finding new things you should have said.", primaryChip: "stuck", secondaryChip: null, trigger: "rumination-replay", context: null },
  { id: "AL_ST5", prompt: "Your boss asked you to do something that isn't quite right, and you can't tell if the cost of speaking up is worth it.", primaryChip: "stuck", secondaryChip: "mixed", trigger: "moral-dilemma-workplace", context: "ethics" },
  { id: "AL_ST6", prompt: "Your family expects one thing for your future and you're starting to see a different one.", primaryChip: "stuck", secondaryChip: null, trigger: "identity-vs-family-cultural", context: "collectivist-family-expectation" },
  { id: "AL_ST7", prompt: "You're sitting with a choice that affects someone you care about, and either way somebody loses.", primaryChip: "stuck", secondaryChip: null, trigger: "moral-dilemma-relational", context: "ethics-caregiving" },
  { id: "AL_ST8", prompt: "Someone shared a confession with you that you're not sure you should be holding alone.", primaryChip: "stuck", secondaryChip: "anxious", trigger: "secret-burden-witness", context: "ethics-witness" },

  // FLAT
  { id: "AL_FL1", prompt: "You wake up, look at the day, and feel nothing about any of it. Not bad. Not good. Just nothing.", primaryChip: "flat", secondaryChip: null, trigger: "anhedonia-morning", context: null },
  { id: "AL_FL2", prompt: "Your favorite meal is on the table and you can't think of why you wanted it.", primaryChip: "flat", secondaryChip: null, trigger: "pleasure-disconnect", context: null },
  { id: "AL_FL3", prompt: "You finish work and stare at the wall. The to-do list is on your phone and you can't open it.", primaryChip: "flat", secondaryChip: "distant", trigger: "depletion-eod", context: null },
  { id: "AL_FL4", prompt: "Your kids are calling you to come watch something they're excited about. You're getting up, but you can't feel it.", primaryChip: "flat", secondaryChip: null, trigger: "caregiving-depletion", context: "parenting" },
  { id: "AL_FL5", prompt: "You're at a celebration and you remember you used to enjoy these.", primaryChip: "flat", secondaryChip: null, trigger: "contrast-past-self", context: "aging-or-grief-or-burnout" },
  { id: "AL_FL6", prompt: "You finished a treatment cycle and the relief you were promised hasn't arrived.", primaryChip: "flat", secondaryChip: null, trigger: "post-medical", context: "chronic-illness-or-mental-health" },

  // DISTANT — includes cultural-difference triggers
  { id: "AL_DT1", prompt: "You're listening to someone tell you something important and you realize you stopped hearing them three sentences ago.", primaryChip: "distant", secondaryChip: null, trigger: "dissociation-conversation", context: null },
  { id: "AL_DT2", prompt: "You catch your reflection in a window and don't recognize the expression on your face.", primaryChip: "distant", secondaryChip: null, trigger: "depersonalization-mirror", context: null },
  { id: "AL_DT3", prompt: "You're in the middle of a conversation and your body feels like it's a foot behind you.", primaryChip: "distant", secondaryChip: null, trigger: "dissociation-body", context: null },
  { id: "AL_DT4", prompt: "You're at a family event where you used to feel like you belonged, and today you don't.", primaryChip: "distant", secondaryChip: "flat", trigger: "belonging-shift-cultural", context: "family-or-cultural-difference" },
  { id: "AL_DT5", prompt: "You're switching between two languages in the same hour and your sense of who you are is switching with them.", primaryChip: "distant", secondaryChip: null, trigger: "code-switching-fatigue", context: "bilingual-multicultural" },
  { id: "AL_DT6", prompt: "You're in a body that doesn't feel like yours right now — illness, pregnancy, injury, medication, age, surgery.", primaryChip: "distant", secondaryChip: null, trigger: "body-estrangement", context: "physical-change" },

  // MIXED — deliberately ambiguous
  { id: "AL_MX1", prompt: "You just got the promotion you wanted. You can't tell if what you feel is excitement or dread.", primaryChip: "mixed", secondaryChip: "anxious", trigger: "ambivalence-success", context: null },
  { id: "AL_MX2", prompt: "Your kid moves out today. You're proud of them and you can barely look at the empty room.", primaryChip: "mixed", secondaryChip: null, trigger: "ambivalence-loss", context: null },
  { id: "AL_MX3", prompt: "A relationship just ended that needed to end. You're relieved and you can't stop crying.", primaryChip: "mixed", secondaryChip: null, trigger: "ambivalence-resolution", context: null },
];

export const DEFUSION_THOUGHTS = [
  // Mind-reading / Personalization
  { id: "DEF_M1", thought: "She didn't reply because she's mad at me.", distortion: "mind-reading, personalization", domain: "relational", context: null },
  { id: "DEF_M2", thought: "He didn't text back because I came on too strong.", distortion: "mind-reading, personalization", domain: "relational-romantic", context: null },
  { id: "DEF_M3", thought: "They're going to figure out I don't actually belong here.", distortion: "fortune-telling, impostor pattern", domain: "identity-professional", context: null },
  { id: "DEF_M4", thought: "If I speak up, they'll think I'm playing the [identity] card.", distortion: "mind-reading, fortune-telling", domain: "identity-marginalization", context: "race-gender-disability-orientation" },
  { id: "DEF_M5", thought: "They're judging me right now.", distortion: "mind-reading", domain: "social", context: null },

  // Fortune-telling / Catastrophizing
  { id: "DEF_F1", thought: "If I push back on this, they'll cut me off.", distortion: "fortune-telling, catastrophizing", domain: "relational", context: null },
  { id: "DEF_F2", thought: "If I rest, everything will fall apart.", distortion: "catastrophizing, control fallacy", domain: "identity-productivity", context: null },
  { id: "DEF_F3", thought: "It's already too late to fix this.", distortion: "fortune-telling, catastrophizing", domain: "situational", context: null },
  { id: "DEF_F4", thought: "If I tell my parents, they'll be devastated and never forgive me.", distortion: "fortune-telling, catastrophizing", domain: "family-disclosure", context: "collectivist-family-honor" },
  { id: "DEF_F5", thought: "If I'm seen with this body, they'll dismiss what I have to say.", distortion: "fortune-telling, mind-reading", domain: "body-politics", context: "weight-disability-marked-body" },

  // Self-labeling / Overgeneralization
  { id: "DEF_L1", thought: "I'm a bad parent because I lost my temper.", distortion: "self-labeling, overgeneralization", domain: "parenting", context: null },
  { id: "DEF_L2", thought: "I'm too much for people.", distortion: "self-labeling, overgeneralization", domain: "relational", context: null },
  { id: "DEF_L3", thought: "I keep doing this — something is wrong with me.", distortion: "self-labeling, overgeneralization", domain: "self-judgment", context: null },
  { id: "DEF_L4", thought: "This always happens to me.", distortion: "overgeneralization, victim framing", domain: "situational", context: null },
  { id: "DEF_L5", thought: "I'm taking up too much space.", distortion: "self-labeling, should-statement", domain: "identity-presence", context: "gendered-or-marginalized" },

  // Should-statements / Dichotomous
  { id: "DEF_S1", thought: "I should have known better.", distortion: "should-statement, hindsight bias", domain: "self-judgment", context: null },
  { id: "DEF_S2", thought: "If I take the day off, it means I'm lazy.", distortion: "should-statement, dichotomous thinking", domain: "identity-productivity", context: "capitalist-protestant-work-ethic" },
  { id: "DEF_S3", thought: "I have to handle this alone or I'm weak.", distortion: "should-statement, dichotomous thinking", domain: "identity-strength", context: null },
  { id: "DEF_S4", thought: "If I rest, I'm letting my family down.", distortion: "should-statement, catastrophizing", domain: "family-obligation", context: "collectivist-family-or-caregiver" },
  { id: "DEF_S5", thought: "I should be over this by now.", distortion: "should-statement, hindsight bias", domain: "grief-recovery-trauma", context: null },

  // Worth-as-output
  { id: "DEF_W1", thought: "If I'm not productive, I have nothing to offer.", distortion: "worth-as-output, dichotomous thinking", domain: "identity-productivity", context: null },

  // Religious / spiritual
  { id: "DEF_R1", thought: "God is testing me and I'm failing.", distortion: "should-statement, self-labeling", domain: "faith", context: "abrahamic-monotheistic" },
  { id: "DEF_R2", thought: "If I had more faith, this would be easier.", distortion: "should-statement, self-labeling", domain: "faith", context: "religious-practice" },

  // Collectivist / family-honor
  { id: "DEF_C1", thought: "I'm bringing shame on my family.", distortion: "self-labeling, catastrophizing", domain: "family-honor", context: "collectivist" },
  { id: "DEF_C2", thought: "I started behind where they did, so I'll never catch up.", distortion: "fortune-telling, dichotomous thinking", domain: "identity-class-mobility", context: "class-or-immigrant" },

  // Body / health
  { id: "DEF_B1", thought: "My body is failing me.", distortion: "self-labeling, personalization", domain: "body-illness", context: "chronic-illness-or-aging" },
  { id: "DEF_B2", thought: "My pain isn't as bad as someone else's so I shouldn't complain.", distortion: "should-statement, comparison-minimization", domain: "pain-validity", context: "chronic-illness-invalidation" },

  // Moral / ethical witness
  { id: "DEF_E1", thought: "I should have said something.", distortion: "should-statement, hindsight bias", domain: "moral-witness", context: "ethics" },
  { id: "DEF_E2", thought: "I caused this by being there.", distortion: "personalization, control fallacy", domain: "moral-witness", context: "ethics-or-trauma" },

  // Identity / disclosure
  { id: "DEF_I1", thought: "If I cry in front of them, they'll lose respect for me.", distortion: "fortune-telling, mind-reading", domain: "relational-vulnerability", context: "gendered-emotional-expression" },
  { id: "DEF_I2", thought: "If they really knew me, they'd leave.", distortion: "fortune-telling, mind-reading", domain: "relational-disclosure", context: "identity-or-trauma-or-secret" },
];

// Chip label lookup (matches live feelChips set in App.jsx)
export const CHIP_LABELS = {
  excited: "Excited",
  focused: "Focused",
  settled: "Settled",
  anxious: "Anxious",
  angry: "Angry",
  stuck: "Stuck",
  mixed: "Mixed",
  flat: "Flat",
  distant: "Distant",
  unsure: "Unsure",
};

export const CHIP_IDS = Object.keys(CHIP_LABELS);
