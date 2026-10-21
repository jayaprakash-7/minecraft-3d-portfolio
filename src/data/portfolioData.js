/**
 * Portfolio Data for Jayaprakash G
 * Preserving all original resume & portfolio information.
 */
export const portfolioData = {
  profile: {
    name: "Jayaprakash G",
    title: "Electronics and Communication Engineering Graduate",
    subtitle: "Embedded Systems · VLSI Interests · Robotics · Generative AI Automation",
    intro: "Hi, I'm Jayaprakash G. I'm an Electronics and Communication Engineering graduate interested in embedded systems, robotics, hardware development, and Generative AI.",
    aboutLong: "I am an Electronics and Communication Engineering graduate from Manakula Vinayagar Institute of Technology, Puducherry (2022–2026). My technical focus spans embedded systems, circuit prototyping, VLSI design concepts, robotics, and hardware troubleshooting. Through hands-on academic projects, practical internship exposure at IGNITE SKYLABS, and continuous skill building in Generative AI automation, I strive to design resilient hardware and intelligent robotic solutions.",
    degree: "B.Tech — Electronics and Communication Engineering",
    institution: "Manakula Vinayagar Institute of Technology, Puducherry",
    period: "2022 – 2026",
    cgpa: "7.35",
    location: "Pondicherry, India",
    email: "jayaprakashgnanavel@gmail.com",
    phone: "+91 8525019591",
    linkedin: "https://www.linkedin.com/in/jayaprakash-g-375a67258",
    github: "https://github.com",
    resumeAvailable: true,
  },

  skills: [
    {
      category: "Electronics & Hardware",
      icon: "⚡",
      blockType: "gold_ore",
      items: [
        { name: "Embedded Systems", level: "Proficient", desc: "Microcontroller architecture, sensor interfacing, peripheral communications (I2C, SPI, UART)." },
        { name: "Electronics", level: "Core", desc: "Analog and digital electronic circuits, power management, signal conditioning." },
        { name: "Microcontrollers", level: "Core", desc: "Experience with ESP32, Arduino AVR, and Raspberry Pi boards." },
        { name: "Circuit Design", level: "Core", desc: "Schematic capture, PCB design concepts, breadboard prototyping, LTspice simulation." },
        { name: "Hardware Troubleshooting", level: "Practical", desc: "Multimeter diagnostics, oscilloscope signal tracing, soldering, board repair." }
      ]
    },
    {
      category: "Programming",
      icon: "⌨",
      blockType: "diamond_ore",
      items: [
        { name: "C Programming", level: "Core Language", desc: "Firmware development, pointer arithmetic, memory management, hardware control loops." },
        { name: "Python", level: "Practical", desc: "Scripting, Raspberry Pi interfacing, basic AI automation workflows." }
      ]
    },
    {
      category: "Tools & Software",
      icon: "⚒",
      blockType: "iron_ore",
      items: [
        { name: "Arduino IDE", level: "Daily Tool", desc: "Firmware compilation, library management, serial debugging for microcontrollers." },
        { name: "AutoCAD", level: "Design Tool", desc: "2D drafting, engineering layouts, basic component dimensioning." },
        { name: "LTspice", level: "Simulation Tool", desc: "Analog circuit simulation, transient analysis, frequency response modeling." },
        { name: "Blender", level: "3D Tool", desc: "3D modeling concepts, geometric asset creation, spatial visualization." }
      ]
    },
    {
      category: "Career & Technical Interests",
      icon: "🔬",
      blockType: "redstone_ore",
      items: [
        { name: "VLSI Design", level: "Learning Interest", desc: "Digital electronics, semiconductor physics fundamentals, RTL design concepts, circuit synthesis." },
        { name: "Robotics and Automation", level: "Applied Interest", desc: "Autonomous motion, motor drivers, sensor fusion, assistive robotics." },
        { name: "Electronics Prototyping", level: "Practical Interest", desc: "Rapid hardware prototyping, sensor modules, mechanical-electronic integration." },
        { name: "Hardware Design & Development", level: "Career Goal", desc: "Designing robust embedded systems for real-world industrial and consumer applications." },
        { name: "Generative AI Automation", level: "Ongoing Training", desc: "Exploring how LLMs and agentic AI streamline engineering workflows and automation." }
      ]
    }
  ],

  projects: [
    {
      id: "robot-companion",
      missionNumber: "01",
      title: "Offline Emotional Support Robot Using Raspberry Pi",
      subtitle: "Raspberry Pi · Offline NLP · Emotion Detection · Embedded Audio",
      badge: "MISSION 01 · ROBOTICS / AI",
      blockType: "lapis_ore",
      shortDesc: "Offline AI companion integrating speech recognition, emotion detection, local language models, and text-to-speech on Raspberry Pi with visual emotional feedback.",
      fullDesc: "Developed an offline emotional support robot using a Raspberry Pi single-board computer. The system operates entirely without cloud dependence to ensure privacy and low-latency interaction. It integrates offline speech recognition, emotion sentiment detection, local language model inference, and text-to-speech synthesis. A companion display provides real-time visual emotional expressions, creating an engaging human-robot interaction loop.",
      features: [
        "Raspberry Pi-based embedded computing architecture",
        "Fully offline speech-to-text recognition without internet dependence",
        "Emotion detection and sentiment analysis engine",
        "Local lightweight language model integration for natural conversation",
        "Synthesized text-to-speech audio output",
        "Dynamic visual feedback and animated emotional facial cues"
      ],
      technologies: ["Raspberry Pi", "Python", "Local LLMs", "Offline STT / TTS", "Emotion Recognition", "Audio Processing"]
    },
    {
      id: "walking-stick",
      missionNumber: "02",
      title: "Assistive Walking Stick",
      subtitle: "ESP32 · Ultrasonic Sensing · Moisture Detection · Haptic Feedback",
      badge: "MISSION 02 · ASSISTIVE TECH",
      blockType: "emerald_ore",
      shortDesc: "ESP32-based smart assistive walking stick providing ultrasonic obstacle detection, wet-surface sensing, and haptic vibration feedback for visually impaired individuals.",
      fullDesc: "Assisted in the hardware integration and circuit assembly of an ESP32-powered assistive walking stick designed for visually impaired users. The system connects multi-directional ultrasonic distance sensors to detect obstacles at varying heights and includes a conductive probe at the base for puddle and wet-surface detection. Navigation alerts are translated into distinct vibration patterns on the handle.",
      features: [
        "ESP32 microcontroller integration and power regulation",
        "Multi-height ultrasonic sensor array for obstacle detection",
        "Water/wet-surface sensor to prevent slips and falls",
        "Vibration motor haptic feedback with variable pulse frequencies",
        "Ergonomic, lightweight hardware integration"
      ],
      technologies: ["ESP32", "C / C++", "Ultrasonic Sensors", "Moisture Sensing", "Haptic Motors", "Hardware Prototyping"]
    },
    {
      id: "solar-tracker",
      missionNumber: "03",
      title: "Pendulum-Based Solar Tracker",
      subtitle: "Smart India Hackathon 2024 · Mechanical Tracking · Passive Energy",
      badge: "MISSION 03 · RENEWABLE ENERGY / SIH 2024",
      blockType: "gold_ore",
      shortDesc: "Mechanical solar tracking system utilizing a pendulum linkage mechanism to orient solar panels without consuming electrical power for tracking motion.",
      fullDesc: "Designed a mechanical solar tracking concept showcased at Smart India Hackathon 2024. Unlike conventional motorized trackers that draw significant electrical energy, this system leverages a weighted pendulum linkage mechanism. By using mechanical motion transfer and gravity-assisted balancing, the panel orients toward optimal solar angles with minimal electrical power overhead.",
      features: [
        "Mechanical pendulum linkage design for passive angular adjustment",
        "Eliminates dependency on continuous motorized electrical drives",
        "Robust mounting frame suitable for harsh outdoor conditions",
        "Maximizes solar photovoltaic panel incidence efficiency",
        "Associated with Smart India Hackathon 2024 concept demonstration"
      ],
      technologies: ["Mechanical Linkage", "Solar PV Engineering", "Pendulum Dynamics", "CAD Modeling", "Passive Energy Design"]
    },
    {
      id: "line-robot",
      missionNumber: "04",
      title: "Line-Following Robot with Obstacle Avoidance",
      subtitle: "Arduino UNO · IR Sensor Array · L298N H-Bridge · Ultrasonic Navigation",
      badge: "MISSION 04 · EMBEDDED ROBOTICS",
      blockType: "redstone_ore",
      shortDesc: "Autonomous robotic vehicle using Arduino UNO, high-precision IR sensor array, and H-bridge motor driver for continuous line tracking and collision prevention.",
      fullDesc: "Designed and built an autonomous wheeled robot utilizing an Arduino UNO microcontroller. The vehicle relies on an array of infrared reflectance sensors to execute closed-loop line following over high-contrast courses. Integrated ultrasonic ranging allows the robot to detect unexpected path obstacles, brake safely, and execute autonomous detour maneuvers before resuming the track.",
      features: [
        "Arduino UNO central microcontroller running real-time control logic",
        "Reflective IR sensor array for high-speed edge and line detection",
        "L298N dual H-bridge motor driver for DC gearmotor speed & direction control",
        "Front-facing ultrasonic sensor for obstacle detection and avoidance",
        "Calibrated PID-like steering algorithm for smooth path tracking"
      ],
      technologies: ["Arduino UNO", "C / C++", "IR Reflectance Sensors", "L298N Driver", "DC Motors", "Closed-Loop Control"]
    }
  ],

  hackathons: [
    {
      title: "Smart India Hackathon 2024",
      role: "Team Concept & Mechanical Designer",
      desc: "Proposed a mechanical solar tracking solution using a pendulum-based linkage mechanism to adjust solar panel orientation without electrical power consumption."
    },
    {
      title: "Tata InnoVent 2025 — Proposed Concepts",
      role: "Innovator & Concept Architect",
      desc: "Architected a triad of forward-looking mobility solutions: E-Hive (Smart EV charging hub with Vehicle-to-Vehicle communication), Battery Passport (Blockchain-based EV battery lifecycle traceability), and ReservEX (AI-powered smart charging reservation and grid allocation)."
    }
  ],

  experience: [
    {
      organization: "IGNITE SKYLABS",
      location: "Pondicherry",
      role: "Embedded Systems Internship",
      period: "October 2023 – March 2024",
      summary: "Gained comprehensive hands-on exposure to embedded systems engineering, microcontroller firmware implementation, and circuit troubleshooting.",
      highlights: [
        "Worked on practical embedded systems projects and hardware-software interfacing.",
        "Gained hands-on exposure to project development, circuit testing, and system verification.",
        "Participated in collaborative technical activities and contributed to assigned prototyping tasks.",
        "Strengthened practical understanding of embedded microcontrollers, sensors, and actuator controls."
      ]
    }
  ],

  training: [
    {
      title: "Automation with Generative AI",
      provider: "CFRSI",
      status: "Currently Pursuing",
      desc: "Expanding knowledge of Generative AI, prompt engineering, agentic workflows, and exploring how intelligent LLM systems optimize technical documentation and engineering automation."
    },
    {
      title: "VLSI Systems & Digital Electronics Lab",
      provider: "Academic Curriculum & Self-Directed Learning",
      status: "Active Focus",
      desc: "Studying digital logic fundamentals, CMOS technology, semiconductor devices, RTL design basics, and simulation tools."
    }
  ],

  certifications: [
    { name: "Smartphone Service and Troubleshooting", institution: "New Technology Mobile Service and Training Institute" },
    { name: "Testing of Electronic Devices in Hardware Workshop", institution: "Raja Electronics Institute" },
    { name: "Drone Design (Design Thinking)", institution: "Vaayusastra Aerospace" },
    { name: "Foundation and Soft Skills Training Programme", institution: "Analytics Training Institute" }
  ],

  education: {
    degree: "Bachelor of Technology — Electronics and Communication Engineering",
    institution: "Manakula Vinayagar Institute of Technology, Puducherry",
    period: "2022 – 2026",
    cgpa: "7.35",
    coursework: [
      "Embedded Systems",
      "Digital Electronics",
      "VLSI Design Basics",
      "Microprocessors & Microcontrollers",
      "Signals and Systems",
      "Linear Integrated Circuits",
      "Wireless Communication",
      "Object Oriented Programming & C"
    ]
  }
};
