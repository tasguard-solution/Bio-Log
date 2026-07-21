import { Organism } from './types';

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
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Animal_cell_structure_en.svg/1280px-Animal_cell_structure_en.svg.png',
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
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Plant_cell_structure_svg.svg/1280px-Plant_cell_structure_svg.svg.png',
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
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Blausen_0676_NeutrophilEngulfingAnthrax.png/1280px-Blausen_0676_NeutrophilEngulfingAnthrax.png',
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
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Neuron_Hand-tuned.svg/1280px-Neuron_Hand-tuned.svg.png',
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
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Blausen_0352_EpithelialTissueTypes.png/1280px-Blausen_0352_EpithelialTissueTypes.png',
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
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Bacillus_anthracis_Gram.jpg/1280px-Bacillus_anthracis_Gram.jpg',
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
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Blausen_0801_SkeletalMuscle.png/1280px-Blausen_0801_SkeletalMuscle.png',
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
          'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Agaricus_bisporus_3.jpg/1280px-Agaricus_bisporus_3.jpg',
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
          'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Penicillium_labeled.jpg/1280px-Penicillium_labeled.jpg',
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
          'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/S_cerevisiae_under_DIC_microscopy.jpg/1280px-S_cerevisiae_under_DIC_microscopy.jpg',
        imageSource: {
          label: "Saccharomyces cerevisiae under DIC microscopy – Masur",
          url: 'https://commons.wikimedia.org/wiki/File:S_cerevisiae_under_DIC_microscopy.jpg',
          license: 'Public Domain',
        },
      },
    ],
  },
];
