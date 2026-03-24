import { Scenario, TurnaroundPhase, Feedback, AssessmentState, LeadershipStyle, ChatMessage } from "../types";
import { GoogleGenAI } from "@google/genai";

// Initialize AI
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- CONSTANTS ---

const DEMO_PRAYER_CONTENT = `Heavenly Father, we lift up this leader to You. Grant them the wisdom of Solomon to discern the seasons of their organization. 
In the season of Surgery, give them the courage of Joshua to make the difficult cuts, knowing that pruning leads to growth. Let them not fear the conflict, but see it as the pathway to healing.
In the season of Resuscitation, bestow upon them the heart of David, to gather the mighty men and women, fostering a spirit of unity and innovation. Let them listen more than they speak, building a culture of trust.
And in the season of Therapy, grant them the foresight of Paul, planting seeds of righteousness that will outlast their tenure. May they lead not for their own glory, but as a steward of the resources entrusted to them. 
Bless their decisions, that they may bring prosperity to the company and dignity to every employee. 
We Pray all these in the name of Jesus Christ.`;

const DEMO_REPORT = {
    executiveSummary: "You demonstrate a 'Transformational Master' profile, adeptly shifting styles between phases. Your decisiveness in Surgery (Crisis) saved the firm, your democratic approach in Resuscitation (Growth) engaged the team, and your values-driven focus in Therapy (Legacy) ensured long-term sustainability. You are in the top 5% of leaders for adaptability.",
    detailedAnalysis: `### Phase 1: Surgery (The Crisis)
You correctly identified that a bleeding company needs a tourniquet, not a committee. By adopting the 'Benevolent Autocratic' style (Sun Zi), you stopped cash burn immediately. Your decisions to cut costs and divest non-core assets were painful but necessary.

### Phase 2: Resuscitation (The Recovery)
Once stability was achieved, you pivoted beautifully to a 'Democratic' and 'Participative' style (Confucius). You understood that while a general commands a battle, a gardener grows a forest. By empowering your team to innovate, you unlocked new revenue streams.

### Phase 3: Therapy (The Legacy)
In the final phase, you transitioned to 'Servant Leadership' (Zheng He). You focused on culture, ethics, and succession planning. You built a 'Corporate Immune System' that will protect the company long after you are gone.`,
    prayerContent: DEMO_PRAYER_CONTENT,
    prayerGuidance: "Listen to this prayer before your next board meeting to center your spirit."
};

// DATASET: 18 Scenarios (6 per phase) mapped strictly to Dr. Michael Teng's 12 Styles.

const SURGERY_SCENARIOS: Omit<Scenario, 'id'>[] = [
  {
    phase: TurnaroundPhase.SURGERY,
    title: "Scenario 1: Hemorrhaging Cash",
    description: "The monthly financial report shows the company will run out of cash in 90 days. Immediate action is required to stop the bleeding.",
    context: "Focus: Immediate Survival.",
    options: [
      { id: "s1_benevolent", text: "Declare a state of emergency. Personally review every expense. Cut non-essentials deeply but protect core staff jobs to maintain loyalty.", mappedStyle: "Benevolent Autocratic" },
      { id: "s1_paternalistic", text: "Protect the 'family'. Cut external vendors and perks first. Ask employees to take voluntary pay cuts to save each other's jobs.", mappedStyle: "Paternalistic" },
      { id: "s1_task", text: "Issue a directive: All departments must reduce budget by 20% immediately. No exceptions. Execution must be completed by Friday.", mappedStyle: "Task-Oriented" },
      { id: "s1_trans", text: "Offer a bonus to managers who hit cost-cutting targets. Negotiate aggressive terms with suppliers: 'Lower prices or we walk'.", mappedStyle: "Transactional" }
    ]
  },
  {
    phase: TurnaroundPhase.SURGERY,
    title: "Scenario 2: The Toxic Division",
    description: "Division X is unprofitable and has a toxic culture, but holds sentimental value to the founders. It is dragging the whole ship down.",
    context: "Focus: Amputation.",
    options: [
      { id: "s2_trans", text: "Sell the division to the highest bidder immediately. Use the proceeds to shore up the balance sheet.", mappedStyle: "Transactional" },
      { id: "s2_benevolent", text: "Decide unilaterally to close the division. Explain clearly why it must be done to save the rest of the company, but offer fair severance.", mappedStyle: "Benevolent Autocratic" },
      { id: "s2_task", text: "Set a hard deadline: 'Turn a profit in 30 days or face immediate closure.' Assign a task force to audit operations daily.", mappedStyle: "Task-Oriented" },
      { id: "s2_paternalistic", text: "Retain the division but replace the leadership with loyalists who understand our 'family' values. Try to rehabilitate the staff.", mappedStyle: "Paternalistic" }
    ]
  },
  {
    phase: TurnaroundPhase.SURGERY,
    title: "Scenario 3: Insubordinate Management",
    description: "A senior VP openly questions your turnaround strategy in a town hall meeting, causing confusion among staff.",
    context: "Focus: Command & Control.",
    options: [
      { id: "s3_task", text: "Publicly correct the facts. Reiterate the specific tasks that need to be done and the timeline. Ignore the emotional outburst.", mappedStyle: "Task-Oriented" },
      { id: "s3_trans", text: "Privately offer the VP a choice: Get on board and receive stock options, or take a severance package and leave today.", mappedStyle: "Transactional" },
      { id: "s3_paternalistic", text: "Take the VP aside like a father figure. Explain that such behavior hurts the 'family' and ask for their loyalty in this hard time.", mappedStyle: "Paternalistic" },
      { id: "s3_benevolent", text: "Fire the VP immediately for the good of the collective. Demonstrate that obstructionism will not be tolerated during a crisis.", mappedStyle: "Benevolent Autocratic" }
    ]
  },
  {
    phase: TurnaroundPhase.SURGERY,
    title: "Scenario 4: Supply Chain Collapse",
    description: "A key supplier has gone bankrupt. Production will stop in 48 hours. You need a replacement immediately.",
    context: "Focus: Crisis Logistics.",
    options: [
      { id: "s4_benevolent", text: "Use your personal network to secure a new supplier. Make the deal yourself and instruct the team to execute the logistics.", mappedStyle: "Benevolent Autocratic" },
      { id: "s4_trans", text: "Find a temporary supplier and pay a premium for rush delivery. Money talks.", mappedStyle: "Transactional" },
      { id: "s4_task", text: "Assign the operations director to find 3 alternatives by close of business. Monitor their progress hourly.", mappedStyle: "Task-Oriented" },
      { id: "s4_paternalistic", text: "Gather the procurement team. Remind them we are in this together and encourage them to find a solution to save the company.", mappedStyle: "Paternalistic" }
    ]
  },
  {
    phase: TurnaroundPhase.SURGERY,
    title: "Scenario 5: Operational Bloat",
    description: "The org chart is top-heavy. There are too many middle managers slowing down decision-making.",
    context: "Focus: De-layering.",
    options: [
      { id: "s5_task", text: "Redraw the org chart based on function. Eliminate any role that does not directly contribute to production or sales.", mappedStyle: "Task-Oriented" },
      { id: "s5_paternalistic", text: "Move excess managers to special projects where they can't block progress, rather than firing them, to preserve morale.", mappedStyle: "Paternalistic" },
      { id: "s5_benevolent", text: "Flatten the structure. I will make the key decisions directly. Remove the layers that filter information.", mappedStyle: "Benevolent Autocratic" },
      { id: "s5_trans", text: "Offer early retirement packages. Trade job security for cash buyouts to reduce headcount quickly.", mappedStyle: "Transactional" }
    ]
  },
  {
    phase: TurnaroundPhase.SURGERY,
    title: "Scenario 6: The Creditor's Call",
    description: " The bank is threatening to call in a loan. You have a meeting with the bank manager tomorrow.",
    context: "Focus: Financial Defense.",
    options: [
      { id: "s6_trans", text: "Negotiate a deal. Offer higher interest rates later in exchange for a payment holiday now.", mappedStyle: "Transactional" },
      { id: "s6_benevolent", text: "Meet them personally. Show them my track record. Convince them to trust my leadership to turn this around.", mappedStyle: "Benevolent Autocratic" },
      { id: "s6_task", text: "Present a detailed, data-driven cost-cutting plan. Show exactly where every dollar will be saved.", mappedStyle: "Task-Oriented" },
      { id: "s6_paternalistic", text: "Appeal to the long-standing relationship between our organizations. Ask for leniency based on our history.", mappedStyle: "Paternalistic" }
    ]
  }
];

const RESUSCITATION_SCENARIOS: Omit<Scenario, 'id'>[] = [
  {
    phase: TurnaroundPhase.RESUSCITATION,
    title: "Scenario 7: New Product Strategy",
    description: "The company is stable, but sales are flat. We need a new product to drive growth.",
    context: "Focus: Innovation & Market Fit.",
    options: [
      { id: "s7_dem", text: "Hold a company-wide vote on three potential product concepts. Let the majority decide the direction.", mappedStyle: "Democratic" },
      { id: "s7_part", text: "Form a cross-functional team. Facilitate a brainstorming session where R&D, Sales, and Marketing co-create the solution.", mappedStyle: "Participative" },
      { id: "s7_collab", text: "Partner with a key customer. Co-develop the product with them to ensure it meets market needs perfectly.", mappedStyle: "Collaborative" },
      { id: "s7_coach", text: "Assign a promising junior product manager to lead this. Guide them, but let them own the project to build their skills.", mappedStyle: "Coaching" }
    ]
  },
  {
    phase: TurnaroundPhase.RESUSCITATION,
    title: "Scenario 8: The Marketing Push",
    description: "We have the budget for a campaign, but no clear message. The marketing team is hesitant.",
    context: "Focus: Brand Building.",
    options: [
      { id: "s8_coach", text: "Sit with the CMO. Ask probing questions to help them unlock their own creativity. 'What do you think is missing?'", mappedStyle: "Coaching" },
      { id: "s8_collab", text: "Bring in an external agency to work alongside our internal team. Foster a partnership to blend inside knowledge with outside flair.", mappedStyle: "Collaborative" },
      { id: "s8_dem", text: "Survey our customers and employees. Use the data to determine the most popular brand message.", mappedStyle: "Democratic" },
      { id: "s8_part", text: "Hold a workshop. Invite staff from all levels to pitch ideas. Select the best elements from various pitches.", mappedStyle: "Participative" }
    ]
  },
  {
    phase: TurnaroundPhase.RESUSCITATION,
    title: "Scenario 9: Siloed Departments",
    description: "Sales and Engineering are fighting. Engineering says Sales promises too much; Sales says Engineering is too slow.",
    context: "Focus: Alignment.",
    options: [
      { id: "s9_part", text: "Create a joint task force. Have them meet weekly to air grievances and solve process issues together.", mappedStyle: "Participative" },
      { id: "s9_dem", text: "Set up a committee with representatives from both sides. Let them vote on a Service Level Agreement (SLA).", mappedStyle: "Democratic" },
      { id: "s9_collab", text: "Incentivize shared goals. Create a bonus structure that requires both teams to succeed for either to get paid.", mappedStyle: "Collaborative" },
      { id: "s9_coach", text: "Mentor the heads of both departments. Help them understand each other's perspectives and develop emotional intelligence.", mappedStyle: "Coaching" }
    ]
  },
  {
    phase: TurnaroundPhase.RESUSCITATION,
    title: "Scenario 10: Talent Gap",
    description: "We need new skills (digital marketing) that our current team lacks. We can hire or train.",
    context: "Focus: Human Capital.",
    options: [
      { id: "s10_collab", text: "Hire a consultant to work with our team, transferring knowledge while doing the work.", mappedStyle: "Collaborative" },
      { id: "s10_coach", text: "Select high-potential internal staff. Send them to training and coach them through the transition to the new role.", mappedStyle: "Coaching" },
      { id: "s10_part", text: "Ask the team to identify their own skill gaps and propose a training plan they are committed to.", mappedStyle: "Participative" },
      { id: "s10_dem", text: "Present the options (Hire vs Train) to the department and let them decide which path they prefer.", mappedStyle: "Democratic" }
    ]
  },
  {
    phase: TurnaroundPhase.RESUSCITATION,
    title: "Scenario 11: Improving Service Quality",
    description: "Customer complaints are rising. The process is broken.",
    context: "Focus: Quality Control.",
    options: [
      { id: "s11_dem", text: "Establish a quality council with elected members from the floor. Empower them to change the rules.", mappedStyle: "Democratic" },
      { id: "s11_coach", text: "Shadow the frontline staff. Observe their challenges and guide them on how to handle difficult situations better.", mappedStyle: "Coaching" },
      { id: "s11_part", text: "Implement 'Quality Circles'. Small groups of workers meet regularly to identify problems and implement solutions.", mappedStyle: "Participative" },
      { id: "s11_collab", text: "Work with our top 3 complaining customers. Invite them to help us redesign our service protocols.", mappedStyle: "Collaborative" }
    ]
  },
  {
    phase: TurnaroundPhase.RESUSCITATION,
    title: "Scenario 12: Expansion Opportunity",
    description: "A competitor is weak. We could acquire them or launch an aggressive campaign to take their market share.",
    context: "Focus: Growth.",
    options: [
      { id: "s12_collab", text: "Propose a strategic alliance or merger. Work together to dominate the market rather than destroying them.", mappedStyle: "Collaborative" },
      { id: "s12_part", text: "Gather the strategic planning team. Facilitate a SWOT analysis and let the strategy emerge from the group's collective wisdom.", mappedStyle: "Participative" },
      { id: "s12_coach", text: "Ask the Sales Director: 'What do you see as the opportunity here?' Help them build the business case.", mappedStyle: "Coaching" },
      { id: "s12_dem", text: "Put the acquisition to a Board vote. Abide strictly by the majority decision.", mappedStyle: "Democratic" }
    ]
  }
];

const THERAPY_SCENARIOS: Omit<Scenario, 'id'>[] = [
  {
    phase: TurnaroundPhase.THERAPY,
    title: "Scenario 13: Defining the Legacy",
    description: "The company is profitable. You need to codify the culture for the next generation.",
    context: "Focus: Long-term Vision.",
    options: [
      { id: "s13_val", text: "Write a 'Credo' based on ethics and integrity. Ensure all decisions align with these core truths.", mappedStyle: "Values-Driven" },
      { id: "s13_serv", text: "Flip the pyramid. Dedicate your time to serving the employees, ensuring they have what they need to serve the customers.", mappedStyle: "Servant Leadership" },
      { id: "s13_spir", text: "Focus on the spiritual/higher purpose of the company. How do we bless the world, not just make money?", mappedStyle: "Spiritual" },
      { id: "s13_insp", text: "Paint a vivid picture of the future. Inspire the team with a grand vision of changing the industry forever.", mappedStyle: "Inspirational" }
    ]
  },
  {
    phase: TurnaroundPhase.THERAPY,
    title: "Scenario 14: The Ethical Supply Chain",
    description: "A supplier is cheaper but uses questionable labor practices. It is legal, but is it right?",
    context: "Focus: Corporate Conscience.",
    options: [
      { id: "s14_val", text: "Drop the supplier immediately. We must do what is right, regardless of the cost to the bottom line.", mappedStyle: "Values-Driven" },
      { id: "s14_spir", text: "Pray for guidance and seek a path that honors the dignity of all human beings involved.", mappedStyle: "Spiritual" },
      { id: "s14_serv", text: "Visit the supplier. Offer to help them improve their working conditions, serving their workers as well as ours.", mappedStyle: "Servant Leadership" },
      { id: "s14_insp", text: "Use this as a moment to lead the industry. Announce a new 'Clean Chain' initiative that inspires others to follow.", mappedStyle: "Inspirational" }
    ]
  },
  {
    phase: TurnaroundPhase.THERAPY,
    title: "Scenario 15: Succession Planning",
    description: "It is time to choose your successor. Two candidates are technically strong but have different styles.",
    context: "Focus: Stewardship.",
    options: [
      { id: "s15_insp", text: "Choose the one who inspires the masses. The one who can stand on a stage and make people believe in the impossible.", mappedStyle: "Inspirational" },
      { id: "s15_serv", text: "Choose the one who is humble. The one who eats last and cares most for the junior staff.", mappedStyle: "Servant Leadership" },
      { id: "s15_val", text: "Choose the one with the strongest moral compass. Competence matters, but character is non-negotiable.", mappedStyle: "Values-Driven" },
      { id: "s15_spir", text: "Seek discernment. Look for the candidate who views the role as a calling rather than a career step.", mappedStyle: "Spiritual" }
    ]
  },
  {
    phase: TurnaroundPhase.THERAPY,
    title: "Scenario 16: Employee Wellbeing",
    description: "Profits are up, but burnout is rising. People are working too hard.",
    context: "Focus: Holistic Health.",
    options: [
      { id: "s16_spir", text: "Introduce mindfulness and spiritual wellness programs. Help employees find peace and purpose in their work.", mappedStyle: "Spiritual" },
      { id: "s16_val", text: "Enforce a work-life balance policy because it is the decent thing to do. We value people over profits.", mappedStyle: "Values-Driven" },
      { id: "s16_serv", text: "Ask the staff: 'How can I lighten your load?' Take on some of the burden yourself to relieve them.", mappedStyle: "Servant Leadership" },
      { id: "s16_insp", text: "Rally the team. Remind them why their hard work matters, giving them a sense of mission that energizes them.", mappedStyle: "Inspirational" }
    ]
  },
  {
    phase: TurnaroundPhase.THERAPY,
    title: "Scenario 17: Community Engagement",
    description: "The local community needs help with a social issue (e.g., education or housing).",
    context: "Focus: CSR.",
    options: [
      { id: "s17_serv", text: "Send our teams to build houses or teach. We lead by serving the community directly.", mappedStyle: "Servant Leadership" },
      { id: "s17_insp", text: "Launch a massive campaign. Use our brand voice to champion the cause and inspire the public to act.", mappedStyle: "Inspirational" },
      { id: "s17_spir", text: "Partner with faith groups or NGOs. Support the healing of the community's soul.", mappedStyle: "Spiritual" },
      { id: "s17_val", text: "Allocate a fixed percentage of profits to the cause. It is our moral duty to share our success.", mappedStyle: "Values-Driven" }
    ]
  },
  {
    phase: TurnaroundPhase.THERAPY,
    title: "Scenario 18: Industry Disruption",
    description: "A new technology threatens to make the industry obsolete in 10 years. How do you prepare?",
    context: "Focus: Future Proofing.",
    options: [
      { id: "s18_insp", text: "Cast a vision of a new future where we reinvent ourselves. 'We will not just survive; we will lead the revolution.'", mappedStyle: "Inspirational" },
      { id: "s18_val", text: "Ensure we protect our current employees during the transition. We will not sacrifice our people for progress.", mappedStyle: "Values-Driven" },
      { id: "s18_spir", text: "Trust in the greater plan. Navigate the changes with wisdom and faith, knowing our purpose endures beyond technology.", mappedStyle: "Spiritual" },
      { id: "s18_serv", text: "Serve the customer's evolving needs. If we simply serve them well, the technology is just a tool.", mappedStyle: "Servant Leadership" }
    ]
  }
];

const ALL_SCENARIOS = [...SURGERY_SCENARIOS, ...RESUSCITATION_SCENARIOS, ...THERAPY_SCENARIOS];

export const getScenarioByIndex = async (index: number): Promise<Scenario> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  const template = ALL_SCENARIOS[index];
  if (!template) throw new Error("Scenario index out of bounds");
  return { id: `sc_${index}`, ...template };
};

export const getTotalScenarios = () => ALL_SCENARIOS.length;

export const evaluateDecision = async (
  phase: TurnaroundPhase,
  scenario: Scenario,
  choiceId: string,
  isFaithBased: boolean = false
): Promise<Feedback> => {
  await new Promise(resolve => setTimeout(resolve, 600)); 

  const selectedOption = scenario.options.find(o => o.id === choiceId);
  if (!selectedOption) throw new Error("Invalid option selected");

  const style = selectedOption.mappedStyle;
  
  let score = 0;
  let analysis = "";
  let trainingTip = "";
  let scriptureCitation = "";

  const phaseName = typeof phase === 'string' && phase.includes(':') ? phase.split(':')[1].trim() : String(phase);

  // --- CALIBRATED SCORING & EDUCATIONAL LOGIC ---
  
  if (phase === TurnaroundPhase.SURGERY) {
      if (style === 'Benevolent Autocratic') {
          score = 100;
          trainingTip = "Excellent. 'Benevolent Autocratic' (Sun Zi) is the precise archetype for immediate bleeding control. You prioritized survival over popularity.";
          if(isFaithBased) scriptureCitation = "Joshua 1:9 - 'Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged.'";
      } else if (style === 'Task-Oriented') {
          score = 75;
          trainingTip = "Strong. Task-oriented leadership gets things done efficiently, though it lacks the slight 'benevolent' protection of core staff that characterizes the perfect Sun Zi approach.";
          if(isFaithBased) scriptureCitation = "Proverbs 21:5 - 'The plans of the diligent lead to profit as surely as haste leads to poverty.'";
      } else if (style === 'Paternalistic') {
          score = 50;
          trainingTip = "Caution. Paternalism prioritizes harmony over survival. In Phase 1, protecting everyone often leads to saving no one. You need to cut deeper to cure.";
          if(isFaithBased) scriptureCitation = "Proverbs 27:6 - 'Wounds from a friend can be trusted, but an enemy multiplies kisses.'";
      } else {
          score = 25;
          trainingTip = "Ineffective for Surgery. Transactional leadership is too slow and mercenary. When survival is at stake, you need absolute command, not negotiation.";
          if(isFaithBased) scriptureCitation = "Proverbs 22:3 - 'The prudent see danger and take refuge, but the simple keep going and pay the penalty.'";
      }
      analysis = `You selected ${style}. In the Surgery Phase, the organization is in critical condition.`;

  } else if (phase === TurnaroundPhase.RESUSCITATION) {
      if (style === 'Democratic') {
          score = 100;
          trainingTip = "Correct. The bleeding has stopped. Now you need buy-in. 'Democratic' (Confucius) leadership rebuilds trust and encourages the innovation needed for growth.";
          if(isFaithBased) scriptureCitation = "Proverbs 15:22 - 'Plans fail for lack of counsel, but with many advisers they succeed.'";
      } else if (style === 'Participative') {
          score = 75; 
          trainingTip = "Very Strong. Participation engages the team, though Democratic leadership (Voting/Consensus) is slightly more effective for broad buy-in here.";
          if(isFaithBased) scriptureCitation = "Ecclesiastes 4:9 - 'Two are better than one, because they have a good return for their labor.'";
      } else if (style === 'Coaching' || style === 'Collaborative') {
          score = 50;
          trainingTip = "Good. Building up your team (King David's Mighty Men) is essential here, but you must also empower them to make the decisions (Democratic).";
          if(isFaithBased) scriptureCitation = "Proverbs 27:17 - 'As iron sharpens iron, so one person sharpens another.'";
      } else {
          score = 25;
          trainingTip = "Dangerous. Continuing Autocratic leadership into Phase 2 causes rebellion. The crisis is over; now you must listen to the market and your team.";
          if(isFaithBased) scriptureCitation = "1 Peter 5:3 - 'Not lording it over those entrusted to you, but being examples to the flock.'";
      }
      analysis = `You selected ${style}. In Resuscitation, the focus shifts from survival to stability and growth.`;

  } else {
      if (style === 'Servant Leadership') {
          score = 100;
          trainingTip = "Perfect. To build a 100-year company, you need a 'Corporate Immune System'. Servant Leadership (Zheng He/Paul) builds a culture that survives without you.";
          if(isFaithBased) scriptureCitation = "Mark 10:43-44 - 'Whoever wants to become great among you must be your servant.'";
      } else if (style === 'Values-Driven' || style === 'Spiritual') {
          score = 75;
          trainingTip = "Excellent. Values and Spirit are the bedrock of legacy, closely aligned with Servant Leadership.";
          if(isFaithBased) scriptureCitation = "Matthew 5:16 - 'Let your light shine before others, that they may see your good deeds.'";
      } else if (style === 'Inspirational') {
          score = 50;
          trainingTip = "Good. Inspiration drives vision, but ensure it is grounded in deep values and service to be sustainable long-term.";
          if(isFaithBased) scriptureCitation = "Proverbs 29:18 - 'Where there is no revelation, people cast off restraint.'";
      } else {
          score = 25;
          trainingTip = "Short-sighted. Transactional leadership here creates mercenaries, not missionaries. You need to build a family culture, not just hit numbers.";
          if(isFaithBased) scriptureCitation = "Luke 16:13 - 'No one can serve two masters... You cannot serve both God and money.'";
      }
      analysis = `You selected ${style}. In Therapy, you are securing the organization's long-term soul.`;
  }

  return {
    score,
    analysis,
    coachingTips: [
        trainingTip, 
        `Review: Dr. Teng maps this to ${phaseName} Strategy.`
    ],
    recommendedAction: "Reflect on whether this style fits the urgency of the specific phase.",
    leadershipTrait: style,
    scriptureCitation: isFaithBased ? scriptureCitation : undefined
  };
};

export const generateFinalReport = async (
  state: AssessmentState
): Promise<AssessmentState['finalReport']> => {
    
    const isDemo = state.isDemo === true;
    const isFaithBased = state.isFaithBased;

    // DEMO MODE SHORTCUT
    if (isDemo) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const demoReport = { ...DEMO_REPORT };
        if (!isFaithBased) {
            demoReport.prayerContent = "";
            demoReport.prayerGuidance = "";
        }
        return demoReport;
    }

    const historySummary = state.history.map((h, i) => {
        return `Scenario ${i+1} (${h.phase}): User selected "${h.scenario.options.find(o => o.id === h.userChoiceId)?.text}" (Style: ${h.feedback.leadershipTrait}). Score: ${h.feedback.score}`;
    }).join('\n');

    // Updated Prompt Engineering
    let prompt = `
    Act as a Senior Change Management Consultant and Executive Coach using Dr. Michael Teng's Transformation Framework (Surgery, Resuscitation, Therapy).
    
    User Profile:
    - Industry: ${state.industry}
    - Country: ${state.country}
    - Mode: ${isFaithBased ? "Faith-Based (Christian)" : "Secular/Business"}
    
    Assessment History:
    ${historySummary}

    Task: Generate a JSON response for the Final Report. 
    CRITICAL INSTRUCTIONS:
    1. The content must be STRICTLY targeted at findings and recommendations based on their specific choices. 
    2. DO NOT include generic definitions of the phases (e.g., "Surgery is the crisis phase..."). Assume the user knows the definitions. Focus on THEIR performance.
    3. Use the Google Search tool to find 1-2 real-world corporate use cases (e.g., companies in ${state.industry} or ${state.country}) that faced similar turnaround situations to support your recommendations.
    ${isFaithBased ? "4. Cite relevant Biblical scriptures to support your secular recommendations in the analysis." : ""}
    
    JSON Fields:
    1. executiveSummary (approx 150 words): High-level diagnosis of their leadership adaptability.
    2. detailedAnalysis (approx 400 words): Breakdown by phase. Did they pivot styles correctly? 
       - Integrate specific real-world case studies found via search here.
       - Reference Sun Zi, Confucius, and Zheng He.
    3. prayerContent (approx 200 words): A personalized prayer for the leader. ONLY if Mode is Faith-Based. Otherwise return empty string.
       STRICT FORMAT FOR PRAYER:
       - Start with "Heavenly Father", "Lord", or "Jesus".
       - Content must be specific to the user's weak points identified in the assessment (e.g., if they lacked courage in Surgery, pray for courage).
       - MUST END with exactly: "We Pray all these in the name of Jesus Christ."
    4. prayerGuidance (string): Brief instruction on how to use the prayer. ONLY if Mode is Faith-Based.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                // Enable Google Search for Use Cases
                tools: [{ googleSearch: {} }] 
            }
        });

        const text = response.text;
        if (!text) throw new Error("No response from AI");
        
        // If grounding metadata exists, we could process it, but for now we trust the model integrated it into the text.
        return JSON.parse(text) as AssessmentState['finalReport'];
    } catch (e) {
        console.error("AI Generation Failed, using fallback", e);
        return {
            executiveSummary: "We encountered an error generating your custom report. However, your scores indicate a need to balance decisive action with team consensus.",
            detailedAnalysis: "Please review your section scores. High scores in Surgery indicate strong crisis management. High scores in Therapy indicate strong cultural leadership.",
            prayerContent: isFaithBased ? "Heavenly Father, grant me wisdom to lead with integrity. We Pray all these in the name of Jesus Christ." : "",
            prayerGuidance: ""
        };
    }
};

export const generateDemoHistory = async (isFaithBased: boolean): Promise<AssessmentState['history']> => {
    const demoHistory: AssessmentState['history'] = [];
    const indices = [0, 3, 6, 9, 12, 15]; 
    
    for (const idx of indices) {
        const scenario = await getScenarioByIndex(idx);
        let bestOption = scenario.options[0];
        
        if (scenario.phase === TurnaroundPhase.SURGERY) {
            bestOption = scenario.options.find(o => o.mappedStyle === 'Benevolent Autocratic' || o.mappedStyle === 'Task-Oriented') || bestOption;
        } else if (scenario.phase === TurnaroundPhase.RESUSCITATION) {
             bestOption = scenario.options.find(o => o.mappedStyle === 'Democratic' || o.mappedStyle === 'Participative') || bestOption;
        } else {
             bestOption = scenario.options.find(o => o.mappedStyle === 'Servant Leadership' || o.mappedStyle === 'Values-Driven') || bestOption;
        }

        const feedback = await evaluateDecision(scenario.phase, scenario, bestOption.id, isFaithBased);
        
        demoHistory.push({
            phase: scenario.phase,
            scenario: scenario,
            userChoiceId: bestOption.id,
            feedback: feedback
        });
    }

    return demoHistory;
};

export const chatWithAssistant = async (history: ChatMessage[]): Promise<string> => {
    const systemPrompt = `
    You are the "Turnaround Strategy Virtual Assistant" for the Corporate Turnaround Centre. 
    Context: Dr. Michael Teng's Corporate Transformation Framework.
    
    Rules:
    1. Answer questions pertaining to the Centre and the 3-Phase Framework ONLY.
    2. Do not answer general knowledge questions unrelated to the assessment.
    3. Keep answers concise (Strict limit: under 200 words).
    4. Professional tone.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: history.map(m => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }]
            })),
            config: {
                systemInstruction: systemPrompt
            }
        });

        return response.text || "I apologize, I could not generate a response.";
    } catch (e) {
        console.error("Chat error", e);
        return "I am currently offline. Please try again later.";
    }
};