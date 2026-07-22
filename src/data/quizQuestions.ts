import { QuizQuestion } from '../types';

// Per-topic quiz questions linked to encyclopedia organism IDs
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ── Animal Cell ─────────────────────────────────────────────────────────────
  {
    id: 'quiz-animal-cell-1',
    organismId: 'animal-cell',
    question: 'Which organelle is known as the "powerhouse" of the cell?',
    options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi apparatus'],
    correctIndex: 2,
    explanation: 'Mitochondria produce ATP through aerobic respiration, supplying energy for all cellular activities. They have a double membrane — the inner membrane is folded into cristae to increase surface area for ATP synthesis.',
  },
  {
    id: 'quiz-animal-cell-2',
    organismId: 'animal-cell',
    question: 'Which of the following is found in animal cells but NOT in plant cells?',
    options: ['Cell wall', 'Centrioles', 'Chloroplasts', 'Large central vacuole'],
    correctIndex: 1,
    explanation: 'Centrioles are found in animal cells and play a role in cell division (forming the spindle fibres during mitosis). Plant cells have cell walls (cellulose), chloroplasts, and a large central vacuole — none of which are found in animal cells.',
  },
  {
    id: 'quiz-animal-cell-3',
    organismId: 'animal-cell',
    question: 'The site of protein synthesis in the cell is the',
    options: ['Golgi body', 'Ribosome', 'Nucleus', 'Lysosome'],
    correctIndex: 1,
    explanation: 'Ribosomes read mRNA and assemble amino acids into proteins. They can be free in the cytoplasm or attached to the rough endoplasmic reticulum. The Golgi body packages/ships proteins, the nucleus stores DNA, and lysosomes digest waste.',
  },
  {
    id: 'quiz-animal-cell-4',
    organismId: 'animal-cell',
    question: 'What is the function of the cell membrane?',
    options: [
      'Provides rigid structural support',
      'Controls what enters and exits the cell',
      'Produces energy for the cell',
      'Stores genetic information',
    ],
    correctIndex: 1,
    explanation: 'The cell membrane (plasma membrane) is selectively permeable — it controls the passage of substances in and out of the cell. It also plays roles in cell recognition and communication. It does NOT provide rigid support (that is the cell wall in plants).',
  },

  // ── Plant Cell ──────────────────────────────────────────────────────────────
  {
    id: 'quiz-plant-cell-1',
    organismId: 'plant-cell',
    question: 'The cell wall of plant cells is made of',
    options: ['Chitin', 'Cellulose', 'Protein', 'Lignin only'],
    correctIndex: 1,
    explanation: 'Plant cell walls are primarily composed of cellulose, a polysaccharide made of glucose monomers. Secondary cell walls may also contain lignin (for extra rigidity, e.g., in wood). Fungi cell walls are made of chitin. The cell wall provides structural support and protection.',
  },
  {
    id: 'quiz-plant-cell-2',
    organismId: 'plant-cell',
    question: 'Which organelle converts light energy into chemical energy (glucose)?',
    options: ['Mitochondria', 'Ribosome', 'Chloroplast', 'Vacuole'],
    correctIndex: 2,
    explanation: 'Chloroplasts are the site of photosynthesis. They contain chlorophyll, the green pigment that absorbs light. Photosynthesis equation: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂. Mitochondria are for respiration (the reverse process).',
  },
  {
    id: 'quiz-plant-cell-3',
    organismId: 'plant-cell',
    question: 'A turgid plant cell is one that has',
    options: [
      'Lost water and shrunk',
      'Absorbed water and swelled against its wall',
      'No cell wall',
      'No chloroplasts',
    ],
    correctIndex: 1,
    explanation: 'Turgidity occurs when a plant cell absorbs water by osmosis. The cell swells and the cell contents push against the rigid cell wall, creating turgor pressure. This keeps plant stems upright. The opposite (plasmolysis) happens in concentrated solutions — cells lose water and wilt.',
  },

  // ── White Blood Cell ────────────────────────────────────────────────────────
  {
    id: 'quiz-wbc-1',
    organismId: 'white-blood-cell',
    question: 'The process by which white blood cells engulf and destroy pathogens is called',
    options: ['Phagocytosis', 'Plasmolysis', 'Pinocytosis', 'Endocytosis of nutrients'],
    correctIndex: 0,
    explanation: 'Phagocytosis is the process by which phagocytes (mainly neutrophils and macrophages) engulf and digest bacteria, dead cells, and foreign particles. The cell extends pseudopods around the pathogen, enclosing it in a phagosome, which then fuses with a lysosome to destroy the contents.',
  },
  {
    id: 'quiz-wbc-2',
    organismId: 'white-blood-cell',
    question: 'Which type of white blood cell produces antibodies?',
    options: ['Neutrophils', 'Eosinophils', 'B-lymphocytes', 'Monocytes'],
    correctIndex: 2,
    explanation: 'B-lymphocytes (B cells) differentiate into plasma cells that produce antibodies (immunoglobulins) specific to antigens on pathogens. T-lymphocytes are involved in cell-mediated immunity. Neutrophils and monocytes are phagocytes. Eosinophils combat parasites and allergic reactions.',
  },
  {
    id: 'quiz-wbc-3',
    organismId: 'white-blood-cell',
    question: 'HIV primarily destroys which cells, leading to AIDS?',
    options: ['Red blood cells', 'Platelets', 'CD4+ T-lymphocytes', 'Neutrophils'],
    correctIndex: 2,
    explanation: 'HIV infects and destroys CD4+ T-helper lymphocytes. When CD4 count falls below 200 cells/µL, the immune system is severely compromised and the person is diagnosed with AIDS. Without treatment, opportunistic infections (tuberculosis, Pneumocystis pneumonia) become life-threatening.',
  },

  // ── Amoeba ──────────────────────────────────────────────────────────────────
  {
    id: 'quiz-amoeba-1',
    organismId: 'amoeba',
    question: 'Amoeba moves using extensions of its cell called',
    options: ['Flagella', 'Cilia', 'Pseudopodia', 'Tentacles'],
    correctIndex: 2,
    explanation: 'Amoeba moves by extending temporary, finger-like projections called pseudopodia ("false feet") through cytoplasmic streaming. These pseudopodia also surround and engulf food particles (phagocytosis). Flagella are whip-like structures; cilia are hair-like projections used by other protists.',
  },

  // ── Neuron ──────────────────────────────────────────────────────────────────
  {
    id: 'quiz-neuron-1',
    organismId: 'neuron',
    question: 'Sensory neurons carry impulses',
    options: [
      'From CNS to muscles',
      'Between neurons within the CNS',
      'From sense organs to the CNS',
      'Along the spinal cord only',
    ],
    correctIndex: 2,
    explanation: 'Sensory (afferent) neurons carry nerve impulses from receptors (sense organs: eyes, ears, skin) to the central nervous system (brain and spinal cord). Motor neurons carry signals from the CNS to effectors (muscles/glands). Interneurons (relay neurons) connect sensory and motor neurons within the CNS.',
  },
  {
    id: 'quiz-neuron-2',
    organismId: 'neuron',
    question: 'The fatty coating that speeds up nerve impulse transmission is the',
    options: ['Axon membrane', 'Myelin sheath', 'Dendrite covering', 'Synapse layer'],
    correctIndex: 1,
    explanation: 'The myelin sheath is a lipid-rich coating produced by Schwann cells (PNS) around the axon. It acts as electrical insulation, causing the nerve impulse to "jump" between Nodes of Ranvier (saltatory conduction), increasing speed from ~1 m/s to over 100 m/s. Multiple sclerosis occurs when myelin is damaged.',
  },

  // ── Human Brain ─────────────────────────────────────────────────────────────
  {
    id: 'quiz-brain-1',
    organismId: 'human-brain',
    question: 'The cerebellum is responsible for',
    options: [
      'Regulating heartbeat and breathing',
      'Conscious thought and intelligence',
      'Balance, posture, and coordination of movement',
      'Regulating body temperature',
    ],
    correctIndex: 2,
    explanation: 'The cerebellum, located at the back of the brain, coordinates voluntary movements, maintains balance and posture, and ensures smooth, precise movements. The cerebrum handles conscious thought, the medulla oblongata controls involuntary functions (heartbeat, breathing), and the hypothalamus regulates temperature and hormones.',
  },
  {
    id: 'quiz-brain-2',
    organismId: 'human-brain',
    question: 'Which part of the brain controls breathing and heartbeat?',
    options: ['Cerebrum', 'Cerebellum', 'Medulla oblongata', 'Hypothalamus'],
    correctIndex: 2,
    explanation: 'The medulla oblongata (brainstem) controls vital automatic (involuntary) functions including breathing, heartbeat, blood pressure, swallowing, and coughing. These are essential for survival. Damage to the medulla can be fatal. The hypothalamus regulates homeostasis including temperature control and hormone release.',
  },

  // ── Human Eye ───────────────────────────────────────────────────────────────
  {
    id: 'quiz-eye-1',
    organismId: 'human-eye',
    question: 'The part of the eye where images are focused is the',
    options: ['Cornea', 'Lens', 'Retina', 'Iris'],
    correctIndex: 2,
    explanation: 'The retina is the light-sensitive inner layer of the eye where images are formed. It contains photoreceptors: rods (for dim light/black-and-white vision) and cones (for colour vision in bright light). The fovea centralis is the area of sharpest vision. The image on the retina is inverted; the brain processes it right-side up.',
  },
  {
    id: 'quiz-eye-2',
    organismId: 'human-eye',
    question: 'The iris controls',
    options: [
      'The shape of the lens',
      'The size of the pupil (amount of light entering)',
      'The production of tears',
      'The focus of the image',
    ],
    correctIndex: 1,
    explanation: 'The iris is the coloured part of the eye that controls the size of the pupil by contracting and relaxing. In bright light, the iris constricts (radial muscles relax, circular muscles contract) making the pupil smaller. In dim light, the pupil dilates (radial muscles contract) to allow more light in. This is a reflex action.',
  },

  // ── DNA ──────────────────────────────────────────────────────────────────────
  {
    id: 'quiz-dna-1',
    organismId: 'dna-double-helix',
    question: 'The base pairing rule in DNA states that Adenine (A) pairs with',
    options: ['Guanine (G)', 'Cytosine (C)', 'Thymine (T)', 'Uracil (U)'],
    correctIndex: 2,
    explanation: 'In DNA: Adenine (A) pairs with Thymine (T) via two hydrogen bonds, and Guanine (G) pairs with Cytosine (C) via three hydrogen bonds. This complementary base pairing (Chargaff\'s rules) is fundamental to DNA replication and transcription. In RNA, Uracil (U) replaces Thymine.',
  },
  {
    id: 'quiz-dna-2',
    organismId: 'dna-double-helix',
    question: 'A mutation is best defined as',
    options: [
      'A change in an organism\'s phenotype due to environment',
      'A permanent change in the DNA sequence of a gene or chromosome',
      'The process of DNA replication',
      'The expression of a recessive allele',
    ],
    correctIndex: 1,
    explanation: 'A mutation is a change in the DNA nucleotide sequence. It can involve a single base pair (point mutation — substitution, insertion, or deletion) or a larger chromosomal change (e.g., deletion or duplication of a chromosome segment). Mutations in germ cells are heritable. Most mutations are neutral or harmful; rarely they are beneficial.',
  },

  // ── Human Heart ─────────────────────────────────────────────────────────────
  {
    id: 'quiz-heart-1',
    organismId: 'human-heart',
    question: 'Which chamber of the heart pumps oxygenated blood to the whole body?',
    options: ['Right atrium', 'Right ventricle', 'Left atrium', 'Left ventricle'],
    correctIndex: 3,
    explanation: 'The left ventricle has the thickest muscular wall and pumps oxygenated blood under high pressure through the aorta to the body (systemic circulation). The right ventricle pumps deoxygenated blood to the lungs (pulmonary circulation). The atria are receiving chambers, the ventricles are pumping chambers.',
  },
  {
    id: 'quiz-heart-2',
    organismId: 'human-heart',
    question: 'The bicuspid (mitral) valve prevents backflow of blood from the',
    options: [
      'Right ventricle to right atrium',
      'Aorta to left ventricle',
      'Left ventricle to left atrium',
      'Pulmonary artery to right ventricle',
    ],
    correctIndex: 2,
    explanation: 'The bicuspid (mitral) valve lies between the left atrium and left ventricle. When the left ventricle contracts, the valve closes, preventing blood from flowing back into the left atrium. The tricuspid valve is between the right atrium and right ventricle. Semilunar valves are at the aorta and pulmonary artery exits.',
  },

  // ── Digestive System ────────────────────────────────────────────────────────
  {
    id: 'quiz-digestive-1',
    organismId: 'digestive-system',
    question: 'Proteins are digested into amino acids by the enzyme',
    options: ['Amylase', 'Lipase', 'Protease (e.g., pepsin, trypsin)', 'Bile'],
    correctIndex: 2,
    explanation: 'Proteases are enzymes that break down proteins into amino acids. Pepsin (secreted by the stomach) breaks proteins into polypeptides. Trypsin (from the pancreas) further digests them in the small intestine. Amylase digests starch, lipase digests fats, and bile emulsifies fats (it is not an enzyme).',
  },
  {
    id: 'quiz-digestive-2',
    organismId: 'digestive-system',
    question: 'Absorption of digested food mainly occurs in the',
    options: ['Stomach', 'Large intestine', 'Small intestine', 'Oesophagus'],
    correctIndex: 2,
    explanation: 'The small intestine (duodenum, jejunum, ileum) is the main site of absorption. Its surface area is enormously increased by: folds (plicae circulares), villi (finger-like projections), and microvilli (brush border). Nutrients pass into blood capillaries (glucose, amino acids) and lacteals (fats). The large intestine absorbs water and minerals.',
  },

  // ── Epithelial Cell ──────────────────────────────────────────────────────────
  {
    id: 'quiz-epithelial-1',
    organismId: 'epithelial-cell',
    question: 'Epithelial tissue primarily functions to',
    options: [
      'Contract and produce movement',
      'Transmit nerve impulses',
      'Cover body surfaces and line organs',
      'Store energy as fat',
    ],
    correctIndex: 2,
    explanation: 'Epithelial tissue covers and lines the internal and external surfaces of the body. It forms the skin (outer layer), lines the alimentary canal, lungs, blood vessels, and kidney tubules. It serves protective, secretory, absorptive, and sensory functions. Muscle tissue contracts, nervous tissue transmits impulses, adipose tissue stores fat.',
  },

  // ── Muscle Cell ──────────────────────────────────────────────────────────────
  {
    id: 'quiz-muscle-1',
    organismId: 'muscle-cell',
    question: 'Which type of muscle is under voluntary control?',
    options: ['Cardiac muscle', 'Smooth muscle', 'Skeletal (striated) muscle', 'Visceral muscle'],
    correctIndex: 2,
    explanation: 'Skeletal (striated or voluntary) muscle is attached to bones and under conscious control. Cardiac muscle (in the heart) is involuntary and never tires. Smooth muscle (in walls of gut, blood vessels, uterus) is involuntary. Only skeletal muscles can be consciously contracted and relaxed.',
  },

  // ── Leaf Cross-section ────────────────────────────────────────────────────
  {
    id: 'quiz-leaf-1',
    organismId: 'leaf-cross-section',
    question: 'The pores on the underside of a leaf through which gas exchange and transpiration occur are called',
    options: ['Lenticels', 'Stomata', 'Guard cells', 'Chloroplasts'],
    correctIndex: 1,
    explanation: 'Stomata (singular: stoma) are tiny pores found mainly on the underside of leaves. They allow CO₂ in and O₂ out during photosynthesis, and O₂ in and CO₂ out during respiration. Water vapour is also lost through stomata (transpiration). Each stoma is surrounded by two guard cells that control its opening and closing.',
  },

  // ── Human Skeleton ────────────────────────────────────────────────────────
  {
    id: 'quiz-skeleton-1',
    organismId: 'human-skeleton',
    question: 'The function of the skeleton includes all EXCEPT',
    options: [
      'Support and shape of the body',
      'Protection of delicate organs',
      'Production of ATP energy',
      'Red blood cell production in red bone marrow',
    ],
    correctIndex: 2,
    explanation: 'The skeleton has 5 main functions: support, protection, movement (with muscles), blood cell production (red bone marrow), and mineral storage (calcium and phosphorus). ATP production occurs in mitochondria during cellular respiration — this is NOT a function of the skeleton.',
  },
];
