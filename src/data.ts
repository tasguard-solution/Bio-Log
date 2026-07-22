import { Organism, CurriculumLevel } from './types';

/**
 * All images are sourced from Wikimedia Commons and are used under their respective
 * Creative Commons or Public Domain licenses. See each entry's `imageSource` for details.
 */
export const ORGANISMS: Organism[] = [
  // ─── ANIMAL CELL ───────────────────────────────────────────────────────────
  {
    id: 'animal-cell',
    name: 'Animal Cell',
    subtitle: 'Eukaryotic Cell',
    category: 'Animal Cell',
    description:
      'The fundamental building block of all animals. It is a eukaryotic cell — meaning it has a membrane-bound nucleus housing its DNA — surrounded only by a flexible plasma membrane, unlike plant cells which have an additional rigid cell wall.',
    imageUrl:
      '/images/organisms/Animal_cell_structure_en.svg',
    imageSource: {
      label: 'Animal cell structure – LadyofHats (Mariana Ruiz Villarreal)',
      url: 'https://commons.wikimedia.org/wiki/File:Animal_cell_structure_en.svg',
      license: 'Public Domain',
    },
    stats: [
      { label: 'Size', value: '10 – 30 µm' },
      { label: 'Shape', value: 'Variable (mostly round/irregular)' },
      { label: 'Cell Wall', value: 'Absent' },
      { label: 'Respiration', value: 'Aerobic' },
      { label: 'Key Organelles', value: 'Mitochondria, Centrioles, Lysosomes' },
    ],
    details: [
      {
        title: 'Mitochondria — The Powerhouse',
        content:
          'Mitochondria generate ATP via oxidative phosphorylation. They contain their own circular DNA (inherited maternally) and are thought to have evolved from ancient proteobacteria engulfed by early eukaryotic cells (endosymbiotic theory).',
      },
      {
        title: 'KEY TAKEAWAYS',
        content:
          '• No cell wall — boundary is only the plasma membrane.\n• Contains centrioles (absent in plant cells) for cell division.\n• Lysosomes digest waste materials and cellular debris.\n• Lacks chloroplasts — cannot photosynthesize.',
      },
    ],
  },

  // ─── PLANT CELL ────────────────────────────────────────────────────────────
  {
    id: 'plant-cell',
    name: 'Plant Cell',
    subtitle: 'Eukaryotic Cell',
    category: 'Plant Cell',
    description:
      'A eukaryotic cell type found in all plants. Unlike animal cells, plant cells have a rigid cellulose cell wall for structural support, chloroplasts that capture sunlight for photosynthesis, and a large central vacuole that maintains turgor pressure.',
    imageUrl:
      '/images/organisms/1280px-Plant_cell_structure_svg_labels.svg.png',
    imageSource: {
      label: 'Plant cell structure – LadyofHats (Mariana Ruiz Villarreal)',
      url: 'https://commons.wikimedia.org/wiki/File:Plant_cell_structure_svg_labels.svg',
      license: 'Public Domain',
    },
    stats: [
      { label: 'Size', value: '10 – 100 µm' },
      { label: 'Shape', value: 'Rectangular / Box-like' },
      { label: 'Cell Wall', value: 'Present (cellulose)' },
      { label: 'Chloroplasts', value: 'Present' },
      { label: 'Central Vacuole', value: 'Large (up to 90% of volume)' },
    ],
    details: [
      {
        title: 'Chloroplasts — Solar Panels of the Cell',
        content:
          'Chloroplasts capture light energy and use it to convert CO₂ and water into glucose and oxygen during photosynthesis. Like mitochondria, they contain their own DNA and are also thought to have evolved from ancient cyanobacteria (endosymbiotic theory).',
      },
      {
        title: 'KEY TAKEAWAYS',
        content:
          '• Cell wall made of cellulose provides rigidity and prevents osmotic lysis.\n• Large central vacuole stores water and maintains turgor pressure.\n• Plasmodesmata (pores in the cell wall) allow communication between adjacent plant cells.\n• No centrioles — plant cells divide using a different mechanism.',
      },
    ],
  },

  // ─── WHITE BLOOD CELL ──────────────────────────────────────────────────────
  {
    id: 'white-blood-cell',
    name: 'Neutrophil',
    subtitle: 'White Blood Cell (Leukocyte)',
    category: 'White Blood Cell',
    description:
      'Neutrophils are the most abundant type of white blood cell and are the immune system\'s first responders to infection. They engulf and destroy bacteria and fungi through a process called phagocytosis, and can also release a web of DNA called a Neutrophil Extracellular Trap (NET) to catch pathogens.',
    imageUrl:
      '/images/organisms/Neutrophil.png',
    imageSource: {
      label: 'Neutrophil engulfing anthrax – BruceBlaus (Blausen Medical)',
      url: 'https://commons.wikimedia.org/wiki/File:Blausen_0676_NeutrophilEngulfingAnthrax.png',
      license: 'CC BY 3.0',
    },
    stats: [
      { label: 'Size', value: '12 – 15 µm' },
      { label: 'Lifespan', value: '5 – 90 hours in blood' },
      { label: 'Nucleus', value: 'Multi-lobed (2–5 lobes)' },
      { label: 'Abundance', value: '~60% of all white blood cells' },
      { label: 'Function', value: 'Phagocytosis, NETosis' },
    ],
    details: [
      {
        title: 'Phagocytosis — Engulfing the Enemy',
        content:
          'Neutrophils detect pathogens via chemical signals (chemotaxis), migrate to the infection site, engulf the pathogen inside a phagosome, and destroy it using reactive oxygen species (the "oxidative burst") and enzymes stored in granules.',
      },
      {
        title: 'KEY TAKEAWAYS',
        content:
          '• Multi-lobed nucleus is a key identifier under a microscope.\n• First cells to arrive at a site of bacterial infection.\n• Short-lived but produced in huge numbers (~100 billion/day by bone marrow).\n• Low count (neutropenia) leaves the body vulnerable to life-threatening infections.',
      },
    ],
  },

  // ─── NEURON ────────────────────────────────────────────────────────────────
  {
    id: 'neuron',
    name: 'Neuron',
    subtitle: 'Nerve Cell (Eukaryotic)',
    category: 'Neuron',
    description:
      'Neurons are the electrically excitable cells that form the nervous system. They receive signals through branching dendrites, process them in the cell body (soma), and transmit electrical impulses along a long axon to the next neuron or muscle via a synapse. The human brain contains approximately 86 billion neurons.',
    imageUrl:
      '/images/organisms/Neuron_Hand-tuned.svg',
    imageSource: {
      label: 'Complete neuron cell diagram – Quasar Jarosz',
      url: 'https://commons.wikimedia.org/wiki/File:Neuron_Hand-tuned.svg',
      license: 'CC BY-SA 3.0',
    },
    stats: [
      { label: 'Body (Soma) Size', value: '4 – 100 µm' },
      { label: 'Axon Length', value: 'Up to 1 metre' },
      { label: 'Signal Speed', value: 'Up to 120 m/s' },
      { label: 'Lifespan', value: 'Lifetime of the organism' },
      { label: 'Count in Brain', value: '~86 billion' },
    ],
    details: [
      {
        title: 'Action Potential — The Electrical Signal',
        content:
          'When a neuron is sufficiently stimulated, sodium ions rush into the cell, rapidly raising the membrane potential from -70 mV to +40 mV (depolarisation). This "spike" travels along the axon at high speed, then potassium ions rush out to restore the resting potential (repolarisation).',
      },
      {
        title: 'KEY TAKEAWAYS',
        content:
          '• Neurons are post-mitotic in adults — they generally cannot divide to replace themselves.\n• Myelin sheath (made by Schwann cells) insulates the axon and dramatically increases signal speed.\n• The synapse gap between neurons is crossed by chemical neurotransmitters (e.g. dopamine, serotonin).\n• Dendritic spines can number in the thousands per neuron, receiving inputs from many sources.',
      },
    ],
  },

  // ─── EPITHELIAL CELL ───────────────────────────────────────────────────────
  {
    id: 'epithelial-cell',
    name: 'Epithelial Cell',
    subtitle: 'Eukaryotic Cell',
    category: 'Epithelial Cell',
    description:
      'Epithelial cells form the lining of surfaces throughout the body — skin, gut, lungs, blood vessels, and organs. They act as selective barriers, controlling what passes between compartments, and are the most common site of origin for cancers (carcinomas) due to their high turnover rate.',
    imageUrl:
      '/images/organisms/Epithelial.png',
    imageSource: {
      label: 'Epithelial tissue types – BruceBlaus (Blausen Medical)',
      url: 'https://commons.wikimedia.org/wiki/File:Blausen_0352_EpithelialTissueTypes.png',
      license: 'CC BY 3.0',
    },
    stats: [
      { label: 'Size', value: '5 – 50 µm (varies by type)' },
      { label: 'Shape', value: 'Squamous, Cuboidal, or Columnar' },
      { label: 'Layers', value: 'Simple or Stratified' },
      { label: 'Turnover Rate', value: 'Every 3–5 days (gut lining)' },
      { label: 'Function', value: 'Barrier, secretion, absorption' },
    ],
    details: [
      {
        title: 'Types of Epithelial Tissue',
        content:
          'Simple squamous epithelium lines blood vessels (endothelium) and allows diffusion. Stratified squamous (skin/epidermis) withstands abrasion. Simple columnar epithelium lines the gut, often bearing microvilli that increase surface area for absorption. Pseudostratified ciliated epithelium lines the airway, with cilia that sweep mucus and debris upward.',
      },
      {
        title: 'KEY TAKEAWAYS',
        content:
          '• Cells are tightly joined by structures called tight junctions, desmosomes, and gap junctions.\n• Sit on a basement membrane (basal lamina) which anchors them to underlying connective tissue.\n• Avascular — no blood vessels run through epithelium; nutrients diffuse from below.\n• Gut epithelial cells (enterocytes) are replaced entirely every 3–5 days.',
      },
    ],
  },

  // ─── BACTERIA CELL ─────────────────────────────────────────────────────────
  {
    id: 'bacillus-anthracis',
    name: 'Bacillus anthracis',
    subtitle: 'Prokaryotic Cell (Bacterium)',
    category: 'Bacteria Cell',
    description:
      'A gram-positive, rod-shaped bacterium that causes anthrax. Unlike all other organisms in this collection, it is prokaryotic — meaning it has no membrane-bound nucleus. Its DNA floats freely in a region called the nucleoid. It is uniquely dangerous due to its ability to form tough, resilient endospores that survive for decades.',
    imageUrl:
      '/images/organisms/1280px-Bacillus_anthracis_Gram.jpg',
    imageSource: {
      label: 'Bacillus anthracis Gram stain – CDC / Public Health Image Library',
      url: 'https://commons.wikimedia.org/wiki/File:Bacillus_anthracis_Gram.jpg',
      license: 'Public Domain (US Government)',
    },
    stats: [
      { label: 'Shape', value: 'Bacillus (Rod-shaped)' },
      { label: 'Size', value: '1–1.2 × 3–5 µm' },
      { label: 'Gram Stain', value: 'Gram-positive (purple)' },
      { label: 'Motility', value: 'Non-motile' },
      { label: 'Respiration', value: 'Facultative anaerobe' },
    ],
    details: [
      {
        title: 'WAEC NOTES — Endospore Formation',
        content:
          'When nutrients are scarce, B. anthracis forms an endospore: a highly resistant dormant form with a thick coat that resists heat, UV radiation, and most disinfectants. Spores can survive in soil for over 70 years before germinating into active bacteria when conditions improve.',
      },
      {
        title: 'KEY TAKEAWAYS',
        content:
          '• Prokaryote — no membrane-bound nucleus (contrast with all other organisms here).\n• Possesses a poly-D-glutamic acid capsule that helps it evade the immune system.\n• Produces a three-component anthrax toxin (Protective Antigen, Edema Factor, Lethal Factor).\n• No organelles — ribosomes are 70S (smaller than eukaryotic 80S ribosomes).',
      },
    ],
  },

  // ─── MUSCLE CELL ───────────────────────────────────────────────────────────
  {
    id: 'muscle-cell',
    name: 'Skeletal Muscle Cell',
    subtitle: 'Myocyte (Eukaryotic)',
    category: 'Muscle Cell',
    description:
      'Skeletal muscle cells (myocytes or muscle fibres) are extraordinarily long multinucleate cells that generate voluntary movement. They are packed with myofibrils — bundles of alternating actin (thin) and myosin (thick) filaments whose sliding interaction produces contraction, consuming ATP in the process.',
    imageUrl:
      '/images/organisms/1280px-Blausen_0801_SkeletalMuscle.png',
    imageSource: {
      label: 'Skeletal muscle anatomy – BruceBlaus (Blausen Medical)',
      url: 'https://commons.wikimedia.org/wiki/File:Blausen_0801_SkeletalMuscle.png',
      license: 'CC BY 3.0',
    },
    stats: [
      { label: 'Length', value: '1 mm – 30 cm (very long!)' },
      { label: 'Diameter', value: '10 – 100 µm' },
      { label: 'Nuclei', value: 'Multiple (multinucleate)' },
      { label: 'Striations', value: 'Present (visible under microscope)' },
      { label: 'Control', value: 'Voluntary (somatic nervous system)' },
    ],
    details: [
      {
        title: 'The Sliding Filament Theory',
        content:
          'Muscle contraction occurs when myosin "heads" bind to actin filaments and pivot, pulling the actin toward the centre of the sarcomere. Each cycle requires one ATP molecule. A muscle fibre shortens when millions of sarcomeres contract simultaneously in response to a nerve impulse (action potential) triggering calcium release from the sarcoplasmic reticulum.',
      },
      {
        title: 'KEY TAKEAWAYS',
        content:
          '• Formed by fusion of many myoblast cells during development — hence multinucleate.\n• Contain abundant mitochondria to supply ATP for sustained contraction.\n• Two fibre types: slow-twitch (Type I, fatigue-resistant) and fast-twitch (Type II, powerful but fatigues quickly).\n• Cannot divide after maturity; repair relies on satellite (stem) cells.',
      },
    ],
  },

  // ─── FUNGI ─────────────────────────────────────────────────────────────────
  {
    id: 'fungi',
    name: 'Fungi',
    subtitle: 'Eukaryotic Kingdom',
    category: 'Fungi',
    description:
      'Fungi are a kingdom of eukaryotic organisms — distinct from plants, animals, and bacteria. They are heterotrophs (cannot make their own food) that digest food externally by secreting enzymes, then absorbing the resulting nutrients. Their cell walls are made of chitin (the same material as insect exoskeletons), not cellulose like plants.',
    imageUrl: '',
    isFungiGroup: true,
    stats: [],
    details: [
      {
        title: 'Key Characteristics',
        content:
          'Eukaryotic Nature: Fungi have membrane-bound nuclei and organelles.\nChitin Cell Walls: Fungal cell walls are composed primarily of chitin.\nHeterotrophic Feeding: They absorb nutrients from their environment.',
      },
    ],
    fungiList: [
      {
        id: 'agaricus',
        name: 'Agaricus bisporus',
        commonName: 'Common Button Mushroom',
        description:
          'A basidiomycete mushroom native to grasslands in Europe and North America. It is the world\'s most cultivated mushroom, available as both the white button mushroom and the brown crimini / portobello depending on harvesting stage.',
        type: 'Macroscopic',
        imageUrl:
          '/images/organisms/Agaricus.png',
        imageSource: {
          label: 'Agaricus bisporus – Ak ccm',
          url: 'https://commons.wikimedia.org/wiki/File:Agaricus_bisporus_3.jpg',
          license: 'CC BY-SA 3.0',
        },
      },
      {
        id: 'penicillium',
        name: 'Penicillium chrysogenum',
        commonName: 'Antibiotic-producing Mold',
        description:
          'A blue-green mold common in soil and on decaying food. It is the original source of penicillin — Alexander Fleming noticed in 1928 that it killed surrounding bacteria on his petri dishes, leading to the antibiotic revolution that has saved hundreds of millions of lives.',
        type: 'Microscopic',
        imageUrl:
          '/images/organisms/Penicillium_labeled.jpg',
        imageSource: {
          label: 'Penicillium microscopy – Y tambe',
          url: 'https://commons.wikimedia.org/wiki/File:Penicillium_labeled.jpg',
          license: 'CC BY-SA 3.0',
        },
      },
      {
        id: 'saccharomyces',
        name: 'Saccharomyces cerevisiae',
        commonName: "Baker's / Brewer's Yeast",
        description:
          "A single-celled ascomycete fungus that reproduces by budding. It ferments sugars to produce ethanol and CO₂, underpinning bread-making, brewing, and winemaking for millennia. It is also one of the most important model organisms in biological research.",
        type: 'Single-celled',
        imageUrl:
          '/images/organisms/1280px-S_cerevisiae_under_DIC_microscopy.jpg',
        imageSource: {
          label: "Saccharomyces cerevisiae under DIC microscopy – Masur",
          url: 'https://commons.wikimedia.org/wiki/File:S_cerevisiae_under_DIC_microscopy.jpg',
          license: 'Public Domain',
        },
      },
    ]
  },
  // ─── NEW WAEC SYLLABUS ADDITIONS ───────────────────────────────────────────
  
  // ── AMOEBA ─────────────────────────────────────────────────────────────────
  {
    id: 'amoeba',
    name: 'Amoeba Proteus',
    subtitle: 'Unicellular Eukaryote',
    category: 'Protist',
    description: 'A unicellular organism known for its ability to alter its shape, primarily by extending and retracting pseudopods. Found in freshwater environments, it is a classic example of protozoan movement and phagocytosis (eating by engulfing).',
    imageUrl: '/images/organisms/Amoeba.png',
    sketchfabId: 'a385750059c445eeaf057e3f8d3d9203', // Placeholder
    imageSource: {
      label: 'Amoeba diagram – Pearson Scott Foresman',
      url: 'https://commons.wikimedia.org/wiki/File:Amoeba_(PSF).png',
      license: 'Public Domain',
    },
    stats: [
      { label: 'Size', value: '250 – 750 µm' },
      { label: 'Movement', value: 'Amoeboid (Pseudopodia)' },
      { label: 'Nutrition', value: 'Holozoic (Phagocytosis)' },
      { label: 'Reproduction', value: 'Binary Fission' },
      { label: 'Habitat', value: 'Freshwater ponds/lakes' },
    ],
    details: [
      {
        title: 'Pseudopodia (False Feet)',
        content: 'Amoebas move by extending temporary, arm-like projections called pseudopodia. Cytoplasm streams into the extending pseudopod, pulling the rest of the cell along. These are also used to engulf prey like bacteria and smaller protists in a process called phagocytosis.'
      },
      {
        title: 'KEY TAKEAWAYS FOR WAEC',
        content: '• Contractile Vacuole: Essential for osmoregulation (pumping out excess water) because it lives in a hypotonic freshwater environment.\n• Food Vacuole: Forms around engulfed food for digestion.\n• Ectoplasm (clear, outer layer) vs Endoplasm (granular, inner region).'
      }
    ]
  },

  // ── LEAF CROSS SECTION ──────────────────────────────────────────────────────
  {
    id: 'leaf-cross-section',
    name: 'Leaf Cross-Section',
    subtitle: 'Plant Anatomy',
    category: 'Plant Anatomy',
    description: 'The internal structure of a typical dicotyledonous leaf, adapted perfectly for photosynthesis. It shows the distinct layers: epidermis, palisade mesophyll, spongy mesophyll, and the vascular bundle (veins).',
    imageUrl: '/images/organisms/1280px-Leaf_anatomy.svg.png',
    sketchfabId: '2b733b8a4f6f4b6287c2f6d0f9a2db12', // Placeholder
    imageSource: {
      label: 'Leaf anatomy diagram – Zephyris',
      url: 'https://commons.wikimedia.org/wiki/File:Leaf_anatomy.svg',
      license: 'CC BY-SA 3.0',
    },
    stats: [
      { label: 'Primary Function', value: 'Photosynthesis & Transpiration' },
      { label: 'Upper Layer', value: 'Cuticle (waxy, waterproof)' },
      { label: 'Photosynthetic Tissue', value: 'Palisade Mesophyll' },
      { label: 'Gas Exchange', value: 'Stomata (pores)' },
      { label: 'Transport', value: 'Xylem & Phloem (Veins)' },
    ],
    details: [
      {
        title: 'Palisade vs Spongy Mesophyll',
        content: 'The palisade mesophyll consists of tightly packed, column-shaped cells rich in chloroplasts, positioned near the top to catch maximum sunlight. The spongy mesophyll below has loosely packed cells with air spaces to allow CO2 to diffuse easily to the photosynthetic cells.'
      },
      {
        title: 'KEY TAKEAWAYS FOR WAEC',
        content: '• Stomata (guarded by Guard Cells) are mostly on the lower epidermis to reduce water loss.\n• Xylem transports water and dissolved minerals from roots to leaf.\n• Phloem transports manufactured food (glucose/sucrose) from the leaf to other plant parts.'
      }
    ]
  },

  // ── HUMAN HEART ────────────────────────────────────────────────────────────
  {
    id: 'human-heart',
    name: 'Human Heart',
    subtitle: 'Circulatory System Organ',
    category: 'Organ',
    description: 'A muscular organ about the size of a fist, located just behind and slightly left of the breastbone. The heart pumps blood through the network of arteries and veins called the cardiovascular system.',
    imageUrl: '/images/organisms/1280px-Diagram_of_the_human_heart__cropped_.svg.png',
    sketchfabId: '13f412c1b9f7431e8088ed8cb2142e88', // Actual Sketchfab models can be embedded here
    imageSource: {
      label: 'Diagram of the human heart – Wapcaplet',
      url: 'https://commons.wikimedia.org/wiki/File:Diagram_of_the_human_heart_(cropped).svg',
      license: 'CC BY-SA 3.0',
    },
    stats: [
      { label: 'Chambers', value: '4 (2 Atria, 2 Ventricles)' },
      { label: 'Weight', value: '250 – 350 grams' },
      { label: 'Beats per Minute', value: '60 – 100 (Resting)' },
      { label: 'Tissue Type', value: 'Cardiac Muscle (Myocardium)' },
      { label: 'Circulation', value: 'Double (Systemic & Pulmonary)' },
    ],
    details: [
      {
        title: 'Double Circulation',
        content: 'Mammals have a double circulatory system. The right side of the heart pumps deoxygenated blood to the lungs (pulmonary circulation). The left side receives oxygenated blood from the lungs and pumps it to the rest of the body (systemic circulation).'
      },
      {
        title: 'KEY TAKEAWAYS FOR WAEC',
        content: '• Left ventricle has a thicker muscular wall than the right because it pumps blood around the entire body at higher pressure.\n• Valves (Tricuspid, Bicuspid, Semilunar) prevent backflow of blood.\n• The aorta is the largest artery; the vena cava is the largest vein.'
      }
    ]
  },

  // ── HUMAN DIGESTIVE SYSTEM ─────────────────────────────────────────────────
  {
    id: 'digestive-system',
    name: 'Human Digestive System',
    subtitle: 'Alimentary Canal',
    category: 'System',
    description: 'The human digestive system consists of the gastrointestinal tract plus the accessory organs of digestion (the tongue, salivary glands, pancreas, liver, and gallbladder). Digestion involves the breakdown of food into smaller and smaller components, until they can be absorbed and assimilated into the body.',
    imageUrl: '/images/organisms/Digestive_system_diagram_en.svg',
    sketchfabId: 'c126839ff9154a4f89d38c1c4f620bd3', 
    imageSource: {
      label: 'Digestive system diagram – Mariana Ruiz Villarreal',
      url: 'https://commons.wikimedia.org/wiki/File:Digestive_system_diagram_en.svg',
      license: 'Public Domain',
    },
    stats: [
      { label: 'Length', value: 'Approx. 9 metres (in adults)' },
      { label: 'Major Organs', value: 'Stomach, Small Intestine, Large Intestine' },
      { label: 'Accessory Organs', value: 'Liver, Pancreas, Gallbladder' },
      { label: 'Main Function', value: 'Digestion and Absorption' },
      { label: 'Stomach pH', value: '1.5 – 3.5 (Highly Acidic)' },
    ],
    details: [
      {
        title: 'Chemical Digestion',
        content: 'Enzymes break down complex macromolecules. Amylase in saliva breaks down starch. Pepsin in the stomach breaks down proteins. The pancreas secretes lipase, protease, and more amylase into the small intestine to complete digestion.'
      },
      {
        title: 'KEY TAKEAWAYS FOR WAEC',
        content: '• Small intestine has villi and microvilli to massively increase surface area for absorption.\n• Liver produces bile (stored in gallbladder) which emulsifies fats.\n• The stomach secretes HCl to kill bacteria and provide optimal pH for pepsin.\n• Large intestine primarily absorbs water and forms faeces.'
      }
    ]
  },

  // ── HUMAN SKELETON ─────────────────────────────────────────────────────────
  {
    id: 'human-skeleton',
    name: 'Human Skeleton',
    subtitle: 'Supporting Tissue System',
    category: 'System',
    description: 'The internal framework of the human body. It is composed of around 270 bones at birth – this total decreases to around 206 bones by adulthood after some bones get fused together.',
    imageUrl: '/images/organisms/Human-Skeleton.jpg',
    sketchfabId: 'ddf0a3ec378c4a169b12853de8e7b926',
    imageSource: {
      label: 'Human Skeleton – LadyofHats',
      url: 'https://commons.wikimedia.org/wiki/File:Human-Skeleton.jpg',
      license: 'Public Domain',
    },
    stats: [
      { label: 'Adult Bone Count', value: '206' },
      { label: 'Axial Skeleton', value: 'Skull, Vertebral Column, Ribcage (80 bones)' },
      { label: 'Appendicular Skeleton', value: 'Limbs & Girdles (126 bones)' },
      { label: 'Longest Bone', value: 'Femur (Thigh bone)' },
      { label: 'Smallest Bone', value: 'Stapes (in the middle ear)' },
    ],
    details: [
      {
        title: 'Functions of the Skeleton',
        content: 'The skeleton provides shape and support, protects vital internal organs (like the brain, heart, and lungs), allows for movement (acting as levers for muscles), stores minerals (calcium and phosphorus), and produces blood cells in the bone marrow.'
      },
      {
        title: 'KEY TAKEAWAYS FOR WAEC',
        content: '• Joints: Hinge joints (elbow, knee) allow movement in one plane. Ball and socket joints (shoulder, hip) allow multi-directional movement.\n• Ligaments connect bone to bone; Tendons connect muscle to bone.\n• Cartilage provides cushioning at joints and structural support in the nose/ears.'
      }
    ]
  },

  // ── HUMAN BRAIN ────────────────────────────────────────────────────────────
  {
    id: 'human-brain',
    name: 'Human Brain',
    subtitle: 'Central Nervous System',
    category: 'Organ',
    description: 'The central organ of the human nervous system. It controls most of the activities of the body, processing, integrating, and coordinating the information it receives from the sense organs, and making decisions as to the instructions sent to the rest of the body.',
    imageUrl: '/images/organisms/1280px-Blausen_0102_Brain_Motor_Sensory.png',
    sketchfabId: 'b7bcfd81b9514757b10c660be4f3fc3c',
    imageSource: {
      label: 'Brain Motor and Sensory – BruceBlaus',
      url: 'https://commons.wikimedia.org/wiki/File:Blausen_0102_Brain_Motor%26Sensory.png',
      license: 'CC BY 3.0',
    },
    stats: [
      { label: 'Weight', value: 'Approx. 1.3 - 1.4 kg' },
      { label: 'Cerebrum', value: 'Largest part (conscious thought)' },
      { label: 'Cerebellum', value: 'Balance and coordination' },
      { label: 'Medulla Oblongata', value: 'Autonomic functions (breathing, heart rate)' },
      { label: 'Protection', value: 'Skull & Meninges' },
    ],
    details: [
      {
        title: 'Parts of the Brain',
        content: 'The cerebrum (divided into two hemispheres) is responsible for voluntary actions, memory, and intelligence. The cerebellum coordinates muscle movement. The brainstem (including the medulla) connects to the spinal cord and controls involuntary, life-sustaining functions.'
      },
      {
        title: 'KEY TAKEAWAYS FOR WAEC',
        content: '• Reflex Action vs Voluntary Action: Brain is primarily involved in voluntary actions and complex processing, while simple reflexes are often handled by the spinal cord.\n• Hypothalamus controls body temperature, thirst, and hunger (Homeostasis).'
      }
    ]
  },

  // ── HUMAN EYE ──────────────────────────────────────────────────────────────
  {
    id: 'human-eye',
    name: 'Human Eye',
    subtitle: 'Sensory Organ (Vision)',
    category: 'Organ',
    description: 'The sensory organ of the visual system. It reacts to light and allows vision. Rod and cone cells in the retina are conscious light perceptive cells in vision including color differentiation and the perception of depth.',
    imageUrl: '/images/organisms/Schematic_diagram_of_the_human_eye_en.svg',
    sketchfabId: '3c0a5d4e12344efaa0a581413a1024bd',
    imageSource: {
      label: 'Schematic diagram of the human eye – Rhcastilhos',
      url: 'https://commons.wikimedia.org/wiki/File:Schematic_diagram_of_the_human_eye_en.svg',
      license: 'Public Domain',
    },
    stats: [
      { label: 'Shape', value: 'Spherical (approx. 24mm diameter)' },
      { label: 'Retina', value: 'Contains photoreceptors (Rods & Cones)' },
      { label: 'Lens', value: 'Biconvex, flexible' },
      { label: 'Optic Nerve', value: 'Transmits signals to the brain' },
      { label: 'Blind Spot', value: 'Where optic nerve exits (no photoreceptors)' },
    ],
    details: [
      {
        title: 'Image Formation',
        content: 'Light enters through the cornea, passes through the pupil, and is focused by the lens onto the retina. The image formed on the retina is real and inverted. The brain processes these impulses to perceive an upright image.'
      },
      {
        title: 'KEY TAKEAWAYS FOR WAEC',
        content: '• Accommodation: The ciliary muscles contract or relax to change the shape of the lens to focus on near or distant objects.\n• Iris: Controls the size of the pupil, regulating the amount of light entering the eye.\n• Common defects: Myopia (short-sightedness, corrected with concave lens) and Hypermetropia (long-sightedness, corrected with convex lens).'
      }
    ]
  },

  // ── DNA DOUBLE HELIX ───────────────────────────────────────────────────────
  {
    id: 'dna-double-helix',
    name: 'DNA Double Helix',
    subtitle: 'Deoxyribonucleic Acid',
    category: 'Molecule',
    description: 'The molecule that carries genetic instructions for the development, functioning, growth and reproduction of all known organisms and many viruses. Structurally, DNA consists of two long polynucleotide chains coiling around each other to form a double helix.',
    imageUrl: '/images/organisms/0322_DNA_Nucleotides.jpg',
    sketchfabId: 'a3857490f2384a2ea2e88cb9f67a7d4a',
    imageSource: {
      label: 'DNA Nucleotides – OpenStax',
      url: 'https://commons.wikimedia.org/wiki/File:0322_DNA_Nucleotides.jpg',
      license: 'CC BY 4.0',
    },
    stats: [
      { label: 'Structure', value: 'Double Helix' },
      { label: 'Monomer', value: 'Nucleotide (Sugar + Phosphate + Base)' },
      { label: 'Bases', value: 'Adenine, Thymine, Cytosine, Guanine' },
      { label: 'Base Pairing', value: 'A-T (2 H-bonds), C-G (3 H-bonds)' },
      { label: 'Location', value: 'Nucleus (in eukaryotes)' },
    ],
    details: [
      {
        title: 'The Genetic Code',
        content: 'The sequence of the four nitrogenous bases along the DNA backbone encodes biological information. Genes are specific sequences of DNA that instruct cells to produce specific proteins.'
      },
      {
        title: 'KEY TAKEAWAYS FOR WAEC',
        content: '• DNA Replication is semi-conservative (each new double helix has one old strand and one new strand).\n• Found within chromosomes.\n• Differences from RNA: DNA is double-stranded, has deoxyribose sugar, and uses Thymine instead of Uracil.'
      }
    ]
  }
];


export const WAEC_CURRICULUM: CurriculumLevel[] = [
  {
    level: 'SS1 Biology',
    topics: [
      {
        title: 'The Cell & its Environment',
        organismIds: ['plant-cell', 'animal-cell']
      },
      {
        title: 'Microorganisms',
        organismIds: ['amoeba', 'bacillus-anthracis', 'fungi']
      },
      {
        title: 'Plant Nutrition & Anatomy',
        organismIds: ['leaf-cross-section']
      }
    ]
  },
  {
    level: 'SS2 Biology',
    topics: [
      {
        title: 'Tissues & Supporting Systems',
        organismIds: ['epithelial-cell', 'muscle-cell', 'human-skeleton']
      },
      {
        title: 'Transport System',
        organismIds: ['white-blood-cell', 'human-heart']
      },
      {
        title: 'Digestive System',
        organismIds: ['digestive-system']
      }
    ]
  },
  {
    level: 'SS3 Biology',
    topics: [
      {
        title: 'Nervous Coordination',
        organismIds: ['neuron', 'human-brain']
      },
      {
        title: 'Sense Organs',
        organismIds: ['human-eye']
      },
      {
        title: 'Genetics',
        organismIds: ['dna-double-helix']
      }
    ]
  }
];
