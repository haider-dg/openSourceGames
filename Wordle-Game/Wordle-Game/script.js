(function () {
  "use strict";

  const LEVELS = {
    easy: { wordLength: 4, maxGuesses: 6, name: "Easy" },
    medium: { wordLength: 5, maxGuesses: 6, name: "Medium" },
    hard: { wordLength: 6, maxGuesses: 5, name: "Hard" },
    expert: { wordLength: 7, maxGuesses: 5, name: "Expert" },
  };

  // Word lists by length (all lowercase, no duplicates)
  const WORDS = {
    4: [
      "able", "acid", "aged", "also", "area", "army", "atom", "baby", "back", "ball",
      "band", "bank", "base", "beam", "bear", "beat", "been", "belt", "best", "bike",
      "bird", "bite", "blog", "blue", "boat", "body", "bolt", "bone", "book", "boom",
      "born", "boss", "both", "bowl", "bulk", "burn", "bush", "busy", "cake", "call",
      "calm", "came", "camp", "cape", "card", "care", "case", "cash", "cast", "cell",
      "chew", "chip", "city", "clay", "clip", "club", "coat", "code", "coil", "coin",
      "cold", "come", "cook", "cool", "copy", "core", "cost", "crew", "crop", "cube",
      "curb", "cure", "curl", "cute", "cycle", "damp", "dark", "dash", "data", "date",
      "dead", "dear", "deck", "deep", "desk", "diet", "disk", "dock", "doll", "door",
      "dose", "down", "drag", "draw", "drop", "drug", "dual", "duct", "duel", "duke",
      "dull", "dumb", "dump", "dune", "dust", "duty", "dye", "each", "earl", "earn",
      "east", "easy", "echo", "edge", "edit", "else", "even", "ever", "exit", "expo",
      "eyed", "face", "fact", "fail", "fair", "fake", "fall", "fame", "fang", "farm",
      "fast", "fate", "fear", "feed", "feel", "felt", "fern", "feud", "fiber", "file",
      "fill", "film", "find", "fine", "fire", "fish", "five", "flat", "flea", "flew",
      "flip", "flow", "foam", "foil", "fold", "folk", "food", "foot", "ford", "form",
      "fort", "foul", "free", "from", "fuel", "full", "fund", "fury", "fuse", "gain",
      "game", "gap", "gate", "gave", "gear", "germ", "gift", "girl", "give", "glad",
      "glee", "glen", "glue", "goal", "goat", "gold", "gone", "good", "grab", "gray",
      "grid", "grin", "grip", "grit", "grow", "gulf", "gush", "gym", "half", "hall",
      "halo", "halt", "hand", "hang", "hard", "haul", "have", "haze", "head", "heap",
      "hear", "heat", "help", "herb", "herd", "here", "hero", "high", "hire", "hive",
      "hold", "holy", "home", "hood", "hook", "hope", "horn", "hose", "host", "hour",
      "huge", "hull", "hung", "hunt", "hurt", "icon", "idea", "idle", "idol", "inch",
      "into", "iron", "item", "jail", "jam", "jar", "jaw", "jazz", "jeep", "jerk",
      "jet", "jinx", "join", "joke", "jolt", "joy", "junk", "jury", "just", "keen",
      "keep", "kept", "kick", "kiln", "kind", "king", "kiss", "kite", "knee", "knit",
      "knot", "know", "lace", "lack", "lady", "lake", "lamb", "lamp", "land", "lane",
      "lard", "lark", "last", "late", "lava", "lawn", "lazy", "lead", "leaf", "leak",
      "lean", "leap", "left", "lend", "lens", "liar", "life", "lift", "lily", "limb",
      "limp", "line", "link", "lion", "lips", "list", "live", "load", "loan", "lobe",
      "lock", "loft", "logo", "long", "loom", "loop", "loot", "lord", "lose", "loss",
      "loud", "love", "luck", "lump", "lung", "lure", "lush", "lute", "main", "make",
      "many", "mark", "mayb", "maze", "meal", "mean", "meet", "mesh", "mess", "mice",
      "milk", "mill", "mime", "mind", "mine", "mint", "miss", "mist", "mode", "mold",
      "moon", "more", "moss", "most", "moth", "move", "much", "mud", "mule", "must",
      "mute", "nail", "name", "near", "neat", "neck", "need", "neon", "nest", "news",
      "next", "node", "none", "noon", "nose", "note", "noun", "nude", "oath", "obey",
      "oily", "okay", "omen", "only", "onto", "opal", "open", "oral", "orbit", "oven",
      "over", "pace", "pack", "page", "paid", "pail", "pain", "pair", "pale", "palm",
      "pane", "pant", "park", "part", "pass", "past", "path", "peak", "pear", "peas",
      "peck", "peel", "peer", "pelt", "pent", "pert", "pest", "pets", "pick", "pier",
      "pike", "pile", "pill", "pine", "pink", "pint", "pipe", "pity", "plan", "play",
      "plea", "plot", "plug", "plum", "plus", "poem", "poet", "poke", "pole", "poll",
      "polo", "pond", "pony", "pool", "poor", "pork", "port", "pose", "post", "pour",
      "pray", "prep", "prey", "prom", "prop", "puff", "pull", "pump", "pure", "push",
      "quake", "quay", "quit", "quiz", "race", "rack", "raft", "rage", "raid", "rail",
      "rain", "rake", "ramp", "rang", "rare", "rash", "rate", "rave", "rays", "read",
      "real", "rear", "reed", "reef", "rely", "rent", "rest", "rice", "rich", "ride",
      "right", "rink", "riot", "ripe", "rise", "risk", "rite", "road", "roar", "robe",
      "rock", "rode", "role", "roll", "roof", "room", "rope", "rose", "ruby", "rude",
      "rug", "ruin", "rule", "rung", "rush", "rust", "sack", "safe", "sage", "sail",
      "salt", "same", "sand", "sane", "sang", "sank", "saps", "save", "scan", "scar",
      "seal", "seam", "seat", "seed", "seen", "seek", "self", "sell", "semi", "send",
      "sent", "shed", "shin", "ship", "shop", "show", "shut", "sick", "side", "sign",
      "silo", "silk", "sill", "silt", "sing", "sink", "sire", "site", "size", "skim",
      "skin", "skip", "slab", "slag", "slam", "slap", "slat", "slay", "sled", "slew",
      "slid", "slim", "slip", "slit", "slob", "slog", "slot", "slow", "slug", "slum",
      "slur", "smog", "smug", "snag", "snap", "snip", "snow", "snub", "snug", "soak",
      "soap", "soar", "sock", "soda", "sofa", "soft", "soil", "sold", "sole", "solo",
      "some", "song", "soon", "soot", "sore", "sort", "soup", "sour", "span", "spar",
      "spat", "sped", "spew", "spin", "spit", "spot", "spur", "stab", "stag", "star",
      "stay", "stem", "step", "stew", "stir", "stop", "stow", "stub", "stud", "stun",
      "such", "suck", "suit", "sung", "sunk", "sure", "surf", "swab", "swam", "swan",
      "swap", "sway", "swig", "swim", "swum", "swop", "tack", "tact", "tags", "tail",
      "take", "talc", "talk", "tall", "tame", "tang", "tank", "taps", "tare", "taro",
      "tart", "task", "taut", "taxi", "teal", "team", "tear", "teat", "tech", "teen",
      "tell", "tend", "tent", "term", "test", "text", "than", "that", "thaw", "thee",
      "them", "then", "they", "thin", "this", "thou", "thus", "tick", "tide", "tidy",
      "tied", "tier", "tile", "till", "tilt", "time", "tint", "tiny", "tips", "tire",
      "toad", "toes", "toil", "told", "toll", "tomb", "tone", "tons", "took", "tool",
      "tops", "tore", "torn", "tort", "toss", "tote", "tour", "tout", "town", "toys",
      "tram", "trap", "tray", "tree", "trek", "trim", "trio", "trip", "trod", "trot",
      "true", "tuba", "tube", "tuck", "tuft", "tuna", "tune", "turf", "turn", "tusk",
      "twig", "twin", "type", "tyre", "ugly", "undo", "unit", "unto", "upon", "urge",
      "used", "user", "vacuum", "vain", "vale", "vamp", "vane", "vary", "vase", "vast",
      "vats", "vault", "veal", "veer", "veil", "vein", "vend", "vent", "verb", "very",
      "vest", "veto", "vibe", "vice", "view", "vile", "vine", "visa", "vise", "void",
      "volt", "vote", "vow", "wade", "waft", "wage", "wail", "wait", "wake", "walk",
      "wall", "wand", "wane", "want", "ward", "ware", "warm", "warn", "warp", "wart",
      "wary", "wash", "wasp", "watt", "wave", "wavy", "wax", "weak", "weal", "wean",
      "wear", "week", "weed", "week", "weep", "weld", "well", "went", "were", "what",
      "when", "whew", "whey", "whim", "whip", "whiz", "who", "whom", "wick", "wide",
      "wife", "wig", "wild", "will", "wilt", "wily", "wimp", "wind", "wine", "wing",
      "wink", "wins", "wipe", "wire", "wiry", "wise", "wish", "wisp", "with", "wolf",
      "womb", "wood", "wool", "word", "work", "worm", "worn", "wove", "wrap", "wren",
      "writ", "x-ray", "yard", "yarn", "yawn", "yeah", "year", "yell", "yelp", "yeti",
      "yoga", "yoke", "yolk", "yore", "you", "your", "yule", "zeal", "zero", "zest",
      "zinc", "zone", "zoom",
    ],
    5: [
      "about", "above", "after", "again", "alarm", "allow", "alone", "along", "aloft", "amber",
      "amiss", "among", "ample", "amuse", "anger", "angle", "anvil", "apple", "apply", "arena",
      "argue", "arise", "array", "arrow", "asset", "audio", "attic", "avoid", "award", "awful",
      "bacon", "badge", "badly", "banjo", "basic", "basis", "baton", "beach", "beard", "begin",
      "being", "below", "bench", "bevel", "birth", "black", "blame", "blank", "blast", "block",
      "blood", "blush", "board", "boast", "bonus", "boost", "booze", "booty", "bound", "bowel",
      "brain", "brake", "brand", "brave", "bread", "break", "bridge", "brief", "bring", "brine",
      "brisk", "broad", "brook", "broom", "brown", "brute", "buddy", "build", "bulge", "bunch",
      "bunny", "burry", "burst", "buyer", "cabin", "cable", "cadet", "calm", "cameo", "canal",
      "candy", "canoe", "canon", "cargo", "carol", "carry", "carve", "caste", "catch", "cause",
      "cedar", "cello", "chain", "chair", "chalk", "charm", "chart", "chase", "cheap", "check",
      "cheek", "cheer", "chess", "chest", "chief", "child", "chill", "chime", "choir", "chord",
      "chore", "chuck", "churn", "chute", "cider", "cinch", "civil", "claim", "clang", "clasp",
      "class", "clean", "clear", "clerk", "click", "cliff", "climb", "cloak", "clock", "clone",
      "close", "cloth", "cloud", "clump", "coach", "coast", "cobra", "cocoa", "colon", "color",
      "comet", "comma", "condo", "couch", "cough", "could", "count", "court", "cover", "craft",
      "crane", "crank", "crash", "crawl", "craze", "crazy", "creak", "cream", "creed", "creek",
      "creep", "crepe", "crest", "cried", "crime", "crisp", "crook", "cross", "crowd", "crown",
      "crude", "cruel", "crumb", "crush", "crust", "crypt", "cubic", "cupid", "curve", "cycle",
      "daily", "dairy", "daisy", "dance", "dandy", "datum", "daunt", "dawn", "dealt", "death",
      "debug", "debit", "debut", "decal", "decay", "decor", "decoy", "deign", "deity", "delay",
      "delta", "delve", "demon", "demur", "denim", "dense", "depot", "depth", "derby", "deter",
      "detox", "deuce", "devil", "diary", "dicey", "digit", "diner", "dingo", "dirty", "disco",
      "ditch", "ditty", "divan", "diver", "dizzy", "dodge", "dogma", "doing", "dolly", "donor",
      "donut", "doubt", "dough", "dowly", "downy", "dowry", "dozen", "draft", "drain", "drake",
      "drama", "drank", "drape", "drawl", "drawn", "dread", "dream", "dress", "dried", "drier",
      "drift", "drill", "drink", "drive", "droll", "drone", "drool", "droop", "dross", "drove",
      "drown", "druid", "drunk", "dryly", "duchy", "dully", "dummy", "dumpy", "dunce", "dusk",
      "dusty", "dutch", "dwarf", "dwell", "dwelt", "dying", "eager", "eagle", "early", "earth",
      "easel", "eaten", "eater", "ebony", "ebook", "echo", "edged", "edger", "edict", "edify",
      "eerie", "egret", "eight", "eject", "elate", "elder", "elect", "elegy", "elfin", "elide",
      "elite", "elope", "elude", "email", "embed", "ember", "emcee", "emend", "emery", "empty",
      "enact", "ender", "endow", "enemy", "enjoy", "ennui", "enoki", "enrol", "ensue", "enter",
      "entry", "envoy", "epoch", "epoxy", "equal", "equip", "erase", "erect", "erode", "error",
      "erupt", "essay", "ester", "ether", "ethic", "ethos", "ethyl", "evade", "event", "every",
      "evict", "evil", "evoke", "exact", "exalt", "excel", "exert", "exile", "exist", "exit",
      "expel", "extol", "extra", "exult", "fable", "facet", "faint", "fairy", "faith", "false",
      "fancy", "fanny", "farad", "farce", "fatal", "fated", "fates", "fauna", "favor", "feast",
      "fetal", "feces", "feels", "feign", "feint", "fella", "felon", "femme", "femur", "fence",
      "feral", "ferry", "fetal", "fetch", "fetid", "fetus", "fever", "fewer", "fiber", "ficus",
      "field", "fiend", "fiery", "fifth", "fifty", "fight", "filch", "filet", "fillo", "filmy",
      "filth", "final", "finch", "finds", "finer", "finis", "finny", "first", "fishy", "fitly",
      "fiver", "fixed", "fixer", "fizzy", "fjord", "flack", "flagy", "flail", "flair", "flake",
      "flaky", "flame", "flank", "flare", "flash", "flask", "flats", "flaws", "flaxn", "fleas",
      "fleck", "fleet", "flesh", "flick", "flied", "flier", "flies", "fling", "flint", "flips",
      "flirt", "float", "flock", "flood", "floor", "flora", "floss", "flour", "flout", "flown",
      "fluff", "fluid", "fluke", "flume", "flung", "flunk", "flush", "flute", "flyby", "flyer",
      "foals", "foams", "focal", "focus", "foggy", "foist", "folio", "folly", "foods", "foots",
      "foray", "force", "forge", "forgo", "forte", "forth", "forty", "forum", "found", "fount",
      "foyer", "frail", "frame", "franc", "frank", "fraud", "freak", "freed", "freer", "fresh",
      "friar", "fried", "frill", "frisk", "frizz", "frock", "froggy", "front", "frost", "froth",
      "frown", "froze", "fruit", "fudge", "fugue", "fully", "fungi", "funny", "furze", "fused",
      "fussy", "futon", "fuzzy",
    ],
    6: [
      "action", "actual", "addict", "adjust", "advent", "advice", "affect", "afford", "afraid", "agency",
      "agenda", "almost", "always", "amount", "animal", "annual", "answer", "anyone", "arcane", "around",
      "artist", "ascend", "aspect", "assess", "assist", "assume", "attack", "attend", "author", "avatar",
      "ballet", "banner", "barber", "barrel", "basket", "battle", "beauty", "become", "before", "behind",
      "belief", "belong", "beside", "better", "beyond", "bishop", "bitter", "blazer", "blight", "bonnet",
      "border", "borrow", "bottle", "bottom", "bounce", "branch", "breach", "bridge", "bright", "broken",
      "bronze", "bubble", "budget", "burden", "button", "camera", "cancel", "candle", "canvas", "career",
      "carpet", "casino", "castle", "casual", "center", "chance", "change", "charge", "cheese", "choice",
      "choose", "chorus", "church", "circle", "circus", "clause", "clever", "client", "clinic", "closed",
      "closer", "closet", "cloudy", "clutch", "coffee", "cohort", "colony", "column", "combat", "comedy",
      "comics", "commit", "common", "comply", "comput", "concur", "config", "confer", "corner", "corpus",
      "cotton", "county", "couple", "course", "cousin", "covers", "create", "credit", "crisis", "critic",
      "cruise", "custom", "damage", "dancer", "danger", "deadly", "dealer", "debate", "decade", "decent",
      "decide", "decree", "defeat", "defect", "defend", "define", "degree", "demand", "depend", "deploy",
      "deputy", "desert", "design", "desire", "detail", "detect", "device", "devise", "dialog", "differ",
      "digest", "dinner", "direct", "dishes", "divide", "doctor", "dollar", "domain", "donkey", "dosage",
      "double", "dragon", "drawer", "dreams", "driver", "during", "easily", "eating", "echoes", "editor",
      "effect", "effort", "either", "eleven", "emerge", "empire", "employ", "enable", "energy", "engine",
      "enough", "ensure", "entire", "entity", "enzyme", "equity", "escape", "estate", "ethics", "ethnic",
      "except", "excess", "expand", "expect", "expert", "expire", "export", "expose", "extend", "extent",
      "fabric", "facial", "factor", "failed", "fairly", "family", "famous", "farmer", "father", "favour",
      "fellow", "female", "fender", "fibers", "figure", "filler", "filter", "finale", "finger", "finish",
      "fiscal", "flavor", "flight", "flower", "fluent", "flying", "follow", "footer", "forest", "forget",
      "formal", "format", "former", "foster", "fourth", "freeze", "french", "friend", "fringe", "frozen",
      "fuller", "fusion", "future", "galaxy", "garden", "garlic", "gather", "gender", "gently", "german",
      "glance", "global", "golden", "govern", "gradual", "gravel", "ground", "growth", "guilty", "guitar",
      "hammer", "handle", "happen", "harbor", "hardly", "hazard", "health", "header", "height", "helmet",
      "herbal", "highly", "hockey", "holder", "hollow", "honest", "horror", "humble", "hungry", "hunter",
      "hybrid", "ignore", "images", "impact", "import", "income", "indeed", "indoor", "induce", "infant",
      "inform", "injury", "inland", "insect", "inside", "instil", "intend", "intent", "invest", "island",
      "itself", "jacket", "jersey", "jungle", "junior", "keeper", "kernel", "kettle", "knight", "ladder",
      "laptop", "larger", "lastly", "latest", "layout", "leader", "league", "leaves", "legend", "length",
      "lesson", "letter", "linear", "lining", "linked", "liquid", "listen", "little", "lively", "living",
      "locate", "locked", "lonely", "losing", "lovely", "luxury", "magnet", "mainly", "making", "manage",
      "manner", "manual", "marble", "margin", "market", "master", "matrix", "matter", "mature", "medium",
      "member", "memory", "mental", "merely", "merger", "method", "middle", "mighty", "miller", "mining",
      "minute", "mirror", "misery", "mobile", "modern", "modest", "modify", "module", "moment", "monkey",
      "months", "mostly", "mother", "motion", "motive", "moving", "murder", "muscle", "museum", "mutual",
      "myself", "narrow", "nation", "native", "nature", "nearby", "nearly", "needle", "netted", "neuron",
      "nibble", "nickel", "nightly", "nobody", "noises", "normal", "notice", "notify", "notion", "number",
      "object", "obtain", "occupy", "office", "offset", "online", "opened", "option", "oracle", "orange",
      "origin", "orphan", "others", "output", "oxford", "oxygen", "packet", "palace", "panels", "parent",
      "partly", "patent", "patrol", "patron", "pauper", "payout", "people", "period", "permit", "person",
      "phrase", "picked", "picket", "picnic", "pillar", "pillow", "pirate", "planet", "player", "please",
      "pledge", "plenty", "pocket", "podium", "poetry", "poison", "police", "policy", "polish", "portal",
      "poster", "powder", "powers", "praise", "prayer", "prefer", "pretty", "priest", "prince", "prison",
      "profit", "prompt", "proper", "proven", "public", "pulled", "punch", "punish", "puppet", "purely",
      "purity", "purple", "puzzle", "quaint", "quartz", "queasy", "quench", "quests", "quiver", "quotes",
      "rabbit", "racial", "racing", "radial", "radios", "radius", "raised", "random", "rarely", "rather",
      "rating", "reader", "really", "reason", "recall", "recent", "recipe", "record", "reduce", "reform",
      "refuge", "refuse", "regard", "regime", "region", "relate", "relief", "remain", "remedy", "remind",
      "remote", "remove", "render", "rental", "repair", "repeat", "report", "rescue", "reside", "resist",
      "resort", "result", "resume", "retail", "retain", "retire", "return", "reveal", "review", "reward",
      "rhythm", "ribbon", "riding", "rights", "rising", "ritual", "robust", "rocket", "roller", "rubble",
      "ruling", "runner", "safety", "salary", "sample", "saving", "scarce", "scheme", "school", "screen",
      "script", "search", "season", "second", "secret", "sector", "secure", "seeing", "select", "seller",
      "senate", "sender", "senior", "sensor", "series", "server", "settle", "severe", "sewage", "shadow",
      "shaken", "shared", "sharply", "shelly", "shield", "should", "shower", "shrine", "shrink", "siding",
      "signal", "signed", "silent", "silver", "simple", "simply", "singer", "single", "sister", "sketch",
      "skills", "sleeve", "slight", "slogan", "slowly", "smooth", "soccer", "social", "socket", "sodium",
      "soften", "solely", "solver", "somber", "sooner", "source", "soviet", "speech", "sphere", "spider",
      "spinal", "spirit", "splash", "spoken", "sponge", "sports", "spread", "spring", "sprint", "square",
      "squash", "stable", "stacks", "stages", "stairs", "stance", "static", "statue", "status", "steady",
      "stereo", "sticks", "sticky", "stigma", "stitch", "stocks", "stolen", "stones", "stored", "stormy",
      "strain", "strand", "streak", "stream", "street", "stress", "strict", "stride", "strike", "string",
      "stripe", "strive", "stroke", "strong", "struck", "studio", "submit", "subtle", "suburb", "sudden",
      "suffer", "summer", "summit", "summon", "superb", "supply", "surely", "survey", "switch", "symbol",
      "system", "tablet", "tackle", "talent", "target", "tasted", "tastes", "tattoo", "taught", "teamed",
      "temple", "tenant", "tender", "tennis", "tenure", "thanks", "theory", "thesis", "threat", "thrift",
      "thrill", "thrive", "ticket", "timber", "timely", "timing", "tissue", "titled", "titles", "tomato",
      "tongue", "topics", "torque", "toward", "traced", "tracks", "travel", "treaty", "tremor", "tribal",
      "tricky", "triple", "tropic", "tunnel", "turkey", "twelve", "twenty", "typing", "unique", "unless",
      "unlock", "unpaid", "unseen", "untour", "uphold", "upland", "uproar", "upside", "uptake", "urgent",
      "usable", "useful", "utmost", "valley", "vandal", "varied", "vastly", "vector", "velvet", "vendor",
      "verbal", "verify", "vessel", "vested", "victim", "viewed", "viewer", "violin", "virgin", "virtue",
      "vision", "visits", "visual", "voices", "volume", "vortex", "voting", "voyage", "waited", "walker",
      "walnut", "wander", "wanted", "warmth", "washes", "wasted", "waters", "wealth", "wearer", "weekly",
      "weight", "whilst", "wholly", "wicked", "window", "winner", "winter", "wisdom", "wisely", "wished",
      "within", "wizard", "wonder", "worker", "worthy", "writer", "writes", "yearly", "yellow", "yields",
      "youths", "zodiac", "zombie",
    ],
    7: [
      "ability", "absence", "academy", "account", "achieve", "acquire", "address", "advance", "adverse", "advice",
      "advisor", "against", "already", "another", "anxiety", "anyways", "applied", "arrange", "arrival", "article",
      "assumed", "attempt", "attract", "average", "balance", "banking", "barrier", "battery", "because", "believe",
      "benefit", "between", "binding", "blanket", "blocked", "booking", "brother", "brought", "browser", "builder",
      "cabinet", "caliber", "calling", "capital", "capture", "careful", "carried", "catalog", "caution", "central",
      "century", "certain", "chamber", "chapter", "charity", "charter", "checked", "chicken", "chronic", "circuit",
      "citizen", "classic", "clearly", "climate", "closely", "collect", "college", "combine", "comfort", "command",
      "comment", "compact", "company", "compare", "compete", "complex", "concept", "concern", "concert", "conduct",
      "confirm", "connect", "consent", "consist", "contact", "contain", "content", "contest", "context", "control",
      "convert", "correct", "council", "counsel", "country", "couples", "courses", "covered", "culture", "current",
      "cutting", "dealing", "decided", "decline", "default", "defense", "defined", "defects", "degrees", "delayed",
      "deliver", "demand", "density", "depend", "deposit", "derived", "deserve", "design", "despite", "destroy",
      "details", "develop", "devices", "diamond", "digital", "discuss", "disease", "display", "dispute", "distant",
      "diverse", "divided", "drawing", "driving", "dynamic", "economy", "edition", "effects", "element", "embrace",
      "emotion", "employ", "enabled", "enacted", "engaged", "enhance", "enjoyed", "enquiry", "ensured", "entered",
      "episode", "equally", "evening", "exactly", "examine", "example", "excited", "exclude", "execute", "exercise",
      "exhibit", "existed", "expand", "expect", "explain", "explore", "express", "extract", "extreme", "factory",
      "faculty", "failure", "fashion", "feature", "federal", "feeling", "fiction", "fifteen", "finally", "finance",
      "finding", "fishing", "fitness", "focused", "foreign", "forever", "formula", "fortune", "forward", "freedom",
      "friends", "further", "gallery", "general", "genuine", "getting", "granted", "gravity", "greater", "greatly",
      "growing", "handled", "happens", "healthy", "hearing", "heavily", "helpful", "history", "holiday", "honesty",
      "hostile", "housing", "however", "hundred", "husband", "illegal", "illness", "imagine", "impact", "improve",
      "include", "initial", "inquiry", "insight", "install", "instant", "instead", "intense", "interim", "invalid",
      "inverse", "involve", "journal", "journey", "justice", "keeping", "killing", "kitchen", "knowing", "labeled",
      "landing", "largely", "learned", "leather", "lecture", "legally", "letters", "limited", "listing", "logical",
      "loyalty", "machine", "managed", "manager", "mapping", "married", "masters", "maximum", "meaning", "measure",
      "medical", "meeting", "mention", "message", "million", "mineral", "minimal", "minimum", "minutes", "missing",
      "mission", "mistake", "mixture", "monitor", "monthly", "morning", "musical", "mystery", "natural", "neither",
      "nervous", "network", "nothing", "nowhere", "nuclear", "objects", "obvious", "offered", "officer", "opening",
      "operate", "opinion", "optical", "organic", "outcome", "outdoor", "outside", "overall", "package", "painful",
      "parents", "partial", "partner", "passion", "patient", "pattern", "payment", "perfect", "perform", "perhaps",
      "physics", "picture", "plastic", "playing", "popular", "portion", "poverty", "precisely", "prepare", "present",
      "prevent", "primary", "privacy", "private", "problem", "process", "produce", "product", "profile", "program",
      "project", "promise", "promote", "protect", "provide", "publish", "purpose", "pushing", "quality", "quarter",
      "quickly", "quietly", "radical", "railway", "readily", "reading", "reality", "receive", "recently", "records",
      "reflect", "regular", "related", "release", "remains", "renewal", "replace", "request", "require", "rescued",
      "research", "reserve", "resolve", "respect", "respond", "restored", "retired", "revenue", "reverse", "review",
      "routine", "running", "satisfy", "savings", "science", "section", "segment", "serious", "service", "session",
      "setting", "several", "shaping", "sharing", "shelter", "shortly", "showing", "silence", "similar", "skilled",
      "smoking", "society", "someone", "speaker", "special", "species", "sponsor", "station", "storage", "strange",
      "stretch", "student", "subject", "succeed", "success", "suggest", "support", "surface", "surgery", "surplus",
      "survive", "suspect", "sustain", "targets", "teacher", "tension", "testing", "theatre", "therapy", "thereby",
      "thought", "through", "tonight", "totally", "towards", "traffic", "tragedy", "trained", "training", "travel",
      "treated", "treaty", "trouble", "typical", "uniform", "unknown", "unusual", "usually", "utility", "vaguely",
      "valuable", "various", "vehicle", "venture", "version", "veteran", "village", "violent", "virtual", "visible",
      "waiting", "walking", "warning", "weather", "website", "wedding", "weekend", "welcome", "western", "whereas",
      "whether", "willing", "without", "working", "worried", "writing", "written",
    ],
  };

  const ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

  // Short generic hints per word (category/synonym). Fallback used if missing.
  const HINTS = {
    4: {
      able: "Capable", acid: "Sour substance", aged: "Old", also: "In addition", area: "Region", army: "Soldiers", atom: "Tiny particle", baby: "Infant", back: "Behind", ball: "Round toy", band: "Group", bank: "Money place", base: "Foundation", beam: "Ray of light", bear: "Animal", beat: "Win", been: "Past of be", belt: "Waist strap", best: "Top", bike: "Two-wheeler", bird: "Animal", bite: "Chop with teeth", blog: "Web log", blue: "Color", boat: "Water vessel", body: "Physical form", bolt: "Screw or flash", bone: "Skeleton part", book: "Read", boom: "Loud noise", born: "Brought to life", boss: "Manager", both: "The two", bowl: "Deep dish", bulk: "Large mass", burn: "On fire", bush: "Small shrub", busy: "Occupied", cake: "Sweet dessert", call: "Phone", calm: "Peaceful", came: "Arrived", camp: "Outdoor stay", cape: "Hero cloak", card: "Greeting", care: "Attention", case: "Situation", cash: "Money", cast: "Actors", cell: "Tiny unit", chew: "Eat slowly", chip: "Small piece", city: "Town", clay: "Moldable earth", clip: "Metal fastener", club: "Group or stick", coat: "Outer wear", code: "Cipher or script", coil: "Spiral shape", coin: "Metal money", cold: "Chilly", come: "Arrive", cook: "Prepare food", cool: "Chilly", copy: "Duplicate", core: "Center part", cost: "Price", crew: "Group of workers", crop: "Farm harvest", cube: "Six-sided shape", curb: "Edge of road", cure: "Heal", curl: "Spiral lock", cute: "Adorable", cycle: "Repeat pattern", damp: "Slightly wet", dark: "No light", dash: "Quick run", data: "Info", date: "Day", dead: "Not alive", dear: "Beloved", deck: "Ship floor", deep: "Far down", door: "Entry", down: "Below", draw: "Sketch", drop: "Fall", each: "Every", earl: "Noble", east: "Direction", easy: "Simple", edge: "Border", else: "Other", even: "Equal", ever: "Always", face: "Front", fact: "Truth", fair: "Just", fall: "Drop", farm: "Land", fast: "Quick", feel: "Touch", file: "Document", fill: "Occupy", film: "Movie", find: "Discover", fine: "Okay", fire: "Flames", fish: "Animal", five: "Number", flat: "Level", flow: "Move", food: "Eat", foot: "Body part", form: "Shape", free: "No cost", from: "Origin", full: "Complete", game: "Play", gave: "Donated", girl: "Female", give: "Donate", gold: "Metal", gone: "Left", good: "Nice", gray: "Color", grow: "Expand", half: "50%", hand: "Body part", hard: "Tough", have: "Own", head: "Body", hear: "Listen", heat: "Hot", help: "Assist", here: "This place", high: "Tall", hold: "Grasp", home: "House", hope: "Wish", hour: "60 min", idea: "Thought", into: "Inside", just: "Only", keep: "Retain", kind: "Nice", king: "Ruler", know: "Understand", land: "Ground", last: "Final", late: "Delayed", lead: "Guide", left: "Side", life: "Living", line: "Row", list: "Series", live: "Reside", long: "Lengthy", look: "See", love: "Adore", main: "Primary", make: "Create", many: "Lots", mark: "Sign", mayb: "Perhaps", maze: "Puzzle", meal: "Food", mean: "Average", meet: "Encounter", mind: "Brain", miss: "Fail", more: "Extra", most: "Maximum", move: "Relocate", much: "A lot", must: "Have to", name: "Title", need: "Require", next: "Following", none: "Zero", only: "Just", open: "Unclosed", over: "Done", part: "Piece", pass: "Go", past: "Before", plan: "Scheme", play: "Game", poor: "Needy", pull: "Tug", push: "Shove", read: "Peruse", real: "True", rest: "Relax", rich: "Wealthy", right: "Correct", room: "Space", rule: "Law", same: "Identical", save: "Rescue", seat: "Chair", seen: "Viewed", sell: "Vend", send: "Mail", ship: "Boat", shop: "Store", show: "Display", side: "Edge", sign: "Symbol", site: "Place", size: "Dimension", some: "Few", sort: "Type", stay: "Remain", step: "Stride", stop: "Halt", such: "So", take: "Grab", talk: "Speak", team: "Group", tell: "Say", term: "Word", than: "Compared", that: "Which", them: "Those", then: "Next", they: "Them", this: "It", time: "Clock", town: "City", tree: "Plant", true: "Real", turn: "Rotate", type: "Kind", unit: "One", upon: "On", very: "Quite", want: "Desire", ward: "Zone", warm: "Hot", week: "7 days", well: "Good", went: "Go past", were: "Be past", what: "Which", when: "Time", will: "Shall", wind: "Breeze", with: "Plus", word: "Term", work: "Job", year: "12 months", news: "Info", neck: "Body part", nest: "Bird home", near: "Close", noon: "Midday", nose: "Face part", note: "Small text", oath: "Promise", obey: "Follow rules", oily: "Greasy", opal: "Gemstone", oral: "By mouth", oven: "Baker", pace: "Speed", pack: "Bundle", page: "Paper sheet", paid: "Settled", pail: "Bucket", pain: "Hurt", pair: "Two", park: "Green zone", path: "Trail", peak: "Top", pear: "Fruit", peas: "Veggie", pick: "Choose", pier: "Dock", pile: "Heaped", pill: "Medicine", pine: "Evergreen", pink: "Color", pint: "Drink measure", pipe: "Tube", pity: "Sympathy", plot: "Story line", plug: "Stopper", plum: "Fruit", poem: "Verse", poet: "Writer", pole: "Stick", pond: "Small water", pony: "Small horse", pool: "Water area", pork: "Meat", port: "Harbor", pose: "Position", post: "Mail", pour: "Spill", pray: "Ask god", prey: "Target", prop: "Support", puff: "Air burst", pump: "Mover", pure: "Clean", quit: "Stop", quiz: "Test", race: "Run", rack: "Shelf", raft: "Flat boat", rage: "Anger", raid: "Attack", rail: "Track", rain: "Water fall", rake: "Tool", ramp: "Slope", rare: "Uncommon", rate: "Speed", reed: "Plant", reef: "Coral", rely: "Trust", rent: "Lease", rice: "Grain", ride: "Travel", rink: "Skate", riot: "Uprising", ripe: "Ready to eat", rise: "Go up", risk: "Danger", road: "Street", roar: "Sound", robe: "Gown", rock: "Stone", role: "Part", roll: "Flatten", roof: "Top of house", rope: "Cord", rose: "Flower", ruby: "Red gem", rude: "Impolite", rug: "Carpet", ruin: "Destroy", rush: "Hurry", rust: "Metal rot", sack: "Bag", safe: "Secure", sage: "Wise", sail: "Boat part", salt: "Spice", sand: "Beach", scan: "Look over", scar: "Mark", seal: "Closure", seam: "Line", seed: "Plant start", seek: "Look for", self: "Me", send: "Mail", shed: "Small shack", shin: "Leg part", shoe: "Foot wear", shot: "Fired", show: "Display", shut: "Close", sick: "Ill", silk: "Fabric", sing: "Melody", sink: "Wash basin", site: "Place", size: "Measure", skim: "Glance", skin: "Outer layer", skip: "Jump", slab: "Flat block", slam: "Shut hard", slap: "Hit", slay: "Kill", sled: "Winter cart", slim: "Thin", slip: "Fall", slit: "Cut", slow: "Not fast", slug: "Garden pest", slum: "Poor area", snap: "Quick break", snip: "Cut", snow: "Ice", snug: "Cozy", soak: "Wet", soap: "Clean", soar: "Fly", sock: "Foot gear", soda: "Pop", sofa: "Couch", soft: "Flexible", soil: "Dirt", solo: "Alone", song: "Music", soon: "Early", sore: "Hurting", soup: "Liquid food", sour: "Tart", span: "Full length", spin: "Rotate", spit: "Expel", spot: "Place", stab: "Cut", star: "Night light", stay: "Wait", stem: "Plant part", step: "Move", stew: "Cook", stir: "Mix", stop: "Halt", stow: "Store", stun: "Shock", suit: "Outfit", sung: "Performed", sunk: "Deep", sure: "Certain", surf: "Waves", swam: "Moved water", swan: "White bird", swap: "Trade", sway: "Move", swim: "Move in water", tack: "Tact", tail: "Tail", take: "Grab", tall: "Tall", tame: "Tame", tank: "Tank", task: "Task", taxi: "Taxi", team: "Team", tear: "Tear", tell: "Tell", tent: "Tent", term: "Term", test: "Test", text: "Text", than: "Than", that: "That", them: "Them", then: "Then", they: "They", thin: "Thin", this: "This", thus: "Thus", tick: "Tick", tide: "Tide", tidy: "Tidy", tile: "Tile", till: "Till", tilt: "Tilt", time: "Time", tint: "Tint", tiny: "Tiny", tire: "Tire", toad: "Toad", toil: "Toil", told: "Told", toll: "Toll", tomb: "Tomb", tone: "Tone", took: "Took", tool: "Tool", tops: "Tops", tore: "Tore", torn: "Torn", toss: "Toss", town: "Town", trap: "Trap", tray: "Tray", tree: "Tree", trek: "Trek", trim: "Trim", trio: "Trio", trip: "Trip", true: "True", tuba: "Tuba", tube: "Tube", tuck: "Tuck", tuna: "Tuna", tune: "Tune", turf: "Turf", tusk: "Tusk", twig: "Twig", twin: "Twin", type: "Type", tyre: "Tyre", ugly: "Ugly", unit: "Unit", unto: "Unto", upon: "Upon", urge: "Urge", used: "Used", user: "User", vain: "Vain", vale: "Vale", vase: "Vase", vast: "Vast", veal: "Veal", veer: "Veer", veil: "Veil", vein: "Vein", vend: "Vend", vent: "Vent", verb: "Verb", very: "Very", vest: "Vest", veto: "Veto", vibe: "Vibe", vice: "Vice", view: "View", vile: "Vile", vine: "Vine", visa: "Visa", void: "Void", volt: "Volt", vote: "Vote", vow: "Vow", wade: "Wade", waft: "Waft", wage: "Wage", wail: "Wail", wait: "Wait", wake: "Wake", walk: "Walk", wall: "Wall", wand: "Wand", wane: "Wane", want: "Want", ward: "Ward", ware: "Ware", warm: "Warm", warn: "Warn", warp: "Warp", wart: "Wart", wary: "Wary", wash: "Wash", wasp: "Wasp", watt: "Watt", wave: "Wave", wavy: "Wavy", wax: "Wax", weak: "Weak", wear: "Wear", weed: "Weed", week: "Week", weep: "Weep", weld: "Weld", well: "Well", went: "Went", were: "Were", what: "What", when: "When", whim: "Whim", whip: "Whip", whiz: "Whiz", who: "Who", whom: "Whom", wick: "Wick", wide: "Wide", wife: "Wife", wig: "Wig", wild: "Wild", will: "Will", wilt: "Wilt", wily: "Wily", wind: "Wind", wine: "Wine", wing: "Wing", wink: "Wink", wins: "Wins", wipe: "Wipe", wire: "Wire", wiry: "Wiry", wise: "Wise", wish: "Wish", with: "With", wolf: "Wolf", womb: "Womb", wood: "Wood", wool: "Wool", word: "Word", work: "Work", worm: "Worm", worn: "Worn", wrap: "Wrap", wren: "Wren", yard: "Yard", yarn: "Yarn", yawn: "Yawn", yeah: "Yeah", year: "Year", yell: "Yell", yelp: "Yelp", yoga: "Yoga", yoke: "Yoke", yolk: "Yolk", yore: "Yore", you: "You", your: "Your", yule: "Yule", zeal: "Zeal", zero: "Zero", zest: "Zest", zinc: "Zinc", zone: "Zone", zoom: "Zoom",
    },
    5: {
      about: "Regarding", above: "Over", after: "Following", again: "Once more", allow: "Permit", alone: "Solo", along: "With", among: "Between", anger: "Rage", angle: "Corner", apple: "Fruit", apply: "Use", arena: "Stadium", argue: "Debate", arise: "Occur", array: "List", asset: "Resource", audio: "Sound", avoid: "Skip", award: "Prize", badly: "Poorly", basic: "Simple", basis: "Base", beach: "Shore", begin: "Start", being: "Existing", below: "Under", bench: "Seat", birth: "Born", black: "Color", blame: "Fault", blank: "Empty", blast: "Explosion", block: "Cube", blood: "Red fluid", board: "Plank", boost: "Lift", brain: "Mind", brand: "Label", brave: "Courageous", bread: "Food", break: "Shatter", bridge: "Crossing", brief: "Short", bring: "Carry", broad: "Wide", brown: "Color", build: "Construct", burst: "Explode", buyer: "Customer", cable: "Wire", calm: "Peaceful", candy: "Sweet", carry: "Hold", catch: "Grab", cause: "Reason", chain: "Link", chair: "Seat", chart: "Graph", cheap: "Inexpensive", check: "Verify", chest: "Torso", chief: "Main", child: "Kid", claim: "Assert", class: "Grade", clean: "Tidy", clear: "Obvious", climb: "Ascend", clock: "Time", close: "Shut", cloud: "Sky", coach: "Trainer", coast: "Shore", color: "Hue", could: "Might", count: "Number", court: "Trial", cover: "Lid", craft: "Skill", crash: "Collide", cream: "Dairy", crime: "Illegal", cross: "Intersect", curve: "Bend", dance: "Move", death: "End", delay: "Wait", delta: "Change", dirty: "Unclean", doubt: "Uncertain", dozen: "Twelve", draft: "Rough", drama: "Play", drawn: "Pulled", dream: "Sleep", dress: "Clothes", drink: "Beverage", drive: "Steer", eager: "Keen", early: "Before", earth: "Planet", eight: "Number", empty: "Vacant", enemy: "Foe", enjoy: "Like", enter: "Go in", equal: "Same", error: "Mistake", event: "Occasion", every: "Each", exact: "Precise", exist: "Be", extra: "More", faith: "Belief", false: "Not true", fault: "Blame", field: "Area", fifth: "Number", fight: "Battle", final: "Last", first: "Initial", fixed: "Set", flash: "Burst", floor: "Ground", fluid: "Liquid", focus: "Concentrate", force: "Power", forth: "Forward", frame: "Border", fresh: "New", front: "Face", fruit: "Food", fully: "Completely", funny: "Amusing", giant: "Huge", given: "Granted", glass: "Cup", globe: "Earth", grace: "Elegance", grade: "Score", grain: "Seed", grand: "Great", grant: "Give", grass: "Lawn", great: "Big", green: "Color", gross: "Total", group: "Set", grown: "Matured", guard: "Protect", guess: "Estimate", guest: "Visitor", guide: "Lead", happy: "Glad", heart: "Organ", heavy: "Weighty", hello: "Greeting", horse: "Animal", hotel: "Lodging", house: "Home", human: "Person", ideal: "Perfect", image: "Picture", index: "List", inner: "Inside", input: "Data", issue: "Problem", joint: "Shared", judge: "Referee", juice: "Drink", knife: "Blade", known: "Famous", label: "Tag", large: "Big", later: "After", laugh: "Giggle", layer: "Level", learn: "Study", least: "Minimum", leave: "Go", legal: "Lawful", level: "Stage", light: "Lamp", limit: "Max", local: "Nearby", logic: "Reason", loose: "Free", lunch: "Meal", major: "Main", maker: "Creator", march: "Walk", match: "Game", maybe: "Perhaps", metal: "Material", meter: "Measure", might: "Could", minor: "Small", minus: "Less", mixed: "Blended", model: "Example", money: "Cash", month: "30 days", moral: "Ethical", motor: "Engine", mouth: "Lips", movie: "Film", music: "Songs", never: "Not ever", night: "Dark", noise: "Sound", north: "Direction", novel: "Book", nurse: "Care", occur: "Happen", ocean: "Sea", offer: "Propose", often: "Frequently", order: "Request", other: "Else", ought: "Should", outer: "External", owner: "Possessor", panel: "Board", paper: "Sheet", party: "Celebration", peace: "Calm", phase: "Stage", phone: "Call", photo: "Picture", piece: "Part", pilot: "Fly", pitch: "Throw", place: "Location", plain: "Simple", plane: "Aircraft", plant: "Grow", plate: "Dish", point: "Dot", pound: "Weight", power: "Force", press: "Push", price: "Cost", prime: "Best", print: "Copy", prior: "Before", prize: "Award", proof: "Evidence", proud: "Pride", prove: "Show", quick: "Fast", quiet: "Silent", quite: "Very", quote: "Cite", radio: "Broadcast", raise: "Lift", range: "Scope", rapid: "Fast", ratio: "Proportion", reach: "Arrive", ready: "Prepared", refer: "Mention", right: "Correct", river: "Stream", round: "Circle", route: "Path", royal: "King", rural: "Country", scale: "Size", scene: "View", scope: "Range", score: "Points", sense: "Feel", serve: "Help", seven: "Number", shall: "Will", shape: "Form", share: "Divide", sharp: "Pointed", sheet: "Layer", shelf: "Storage", shell: "Cover", shift: "Change", shine: "Gleam", shoot: "Fire", short: "Brief", shown: "Displayed", sight: "View", since: "Because", skill: "Ability", sleep: "Rest", slide: "Glide", small: "Tiny", smart: "Clever", smile: "Grin", smith: "Metal worker", solid: "Firm", solve: "Answer", sorry: "Apology", sound: "Noise", south: "Direction", space: "Room", speak: "Talk", speed: "Velocity", spend: "Use", split: "Divide", spoke: "Said", sport: "Game", staff: "Employees", stage: "Phase", stake: "Bet", stand: "Rise", start: "Begin", state: "Condition", steam: "Vapor", steel: "Metal", stick: "Rod", still: "Motionless", stock: "Supply", stone: "Rock", store: "Shop", storm: "Weather", story: "Tale", strip: "Remove", study: "Learn", stuff: "Things", style: "Fashion", sugar: "Sweet", suite: "Room set", super: "Great", sweet: "Sugar", table: "Furniture", taken: "Seized", taste: "Flavor", teach: "Instruct", teeth: "Molars", thank: "Grateful", their: "Belonging", theme: "Topic", there: "Place", these: "Those", thick: "Wide", thing: "Object", think: "Consider", third: "Number", those: "These", three: "Number", throw: "Toss", tight: "Firm", title: "Name", today: "Now", total: "Sum", touch: "Feel", tough: "Hard", track: "Path", trade: "Exchange", train: "Teach", treat: "Handle", trend: "Pattern", trial: "Test", tribe: "Group", trick: "Deceive", truly: "Really", trust: "Believe", truth: "Fact", twice: "Two times", under: "Below", union: "Group", until: "Till", upper: "Higher", urban: "City", usual: "Normal", valid: "Legal", value: "Worth", video: "Recording", virus: "Bug", visit: "Go to", vital: "Critical", voice: "Speech", waste: "Squander", watch: "See", water: "Liquid", wheel: "Circle", where: "Place", which: "What", while: "During", white: "Color", whole: "Entire", whose: "Belonging", woman: "Female", world: "Earth", worry: "Anxiety", worse: "Bad", worth: "Value", would: "Will", write: "Compose", wrong: "Incorrect", young: "Youth", youth: "Young", alarm: "Waking bell", aloft: "High up", amber: "Yellow gem", amiss: "Wrong", ample: "Plenty", amuse: "Entertain", anvil: "Metal block", arrow: "Pointy stick", attic: "Roof room", awful: "Very bad", bacon: "Breakfast meat", badge: "Metal tag", banjo: "Stronged instrument", baton: "Stick", beard: "Chin hair", bevel: "Sloped edge", blush: "Red face", boast: "Brag", bonus: "Extra", booze: "Alcohol", booty: "Loot", bound: "Tied", bowel: "Organ", brake: "Stop", brine: "Salt water", brisk: "Fast", brook: "Small stream", broom: "Sweeper", brute: "Beast", buddy: "Friend", bulge: "Bump", bunch: "Group", bunny: "Rabbit", burry: "Hidden", cabin: "Small house", cadet: "Trainee", cameo: "Small part", canal: "Water way", canoe: "Small boat", canon: "Law", cargo: "Goods", carol: "Song", carve: "Cut", caste: "Social class", cedar: "Wood type", cello: "Large violin", charm: "Magic", chase: "Run after", cheek: "Face part", cheer: "Shout", chess: "Board game", chill: "Cold", chime: "Bell sound", choir: "Singers", chord: "Music notes", chore: "Task", chuck: "Throw", churn: "Mix", chute: "Slider", cider: "Apple drink", cinch: "Easy task", civil: "Polite", clang: "Loud noise", clasp: "Fastener", clerk: "Office worker", click: "Mouse action", cliff: "High rock", cloak: "Cape", clone: "Copy", cloth: "Fabric", clump: "Group", coach: "Trainer", coast: "Shore", cobra: "Snake", cocoa: "Chocolate", colon: "Punctuation", comet: "Space rock", comma: "Punctuation", condo: "Apartment", couch: "Sofa", cough: "Throat noise", crane: "Bird or lifter", crank: "Handle", crawl: "Move slow", craze: "Fad", crazy: "Wild", creak: "Squeak", cream: "Dairy", creed: "Belief", creek: "Stream", creep: "Move quiet", crepe: "Thin pancake", crest: "Peak", cried: "Wept", crisp: "Crunchy", crook: "Thief", crown: "King's hat", crude: "Raw", cruel: "Mean", crumb: "Small piece", crush: "Smash", crust: "Outer layer", crypt: "Tomb", cubic: "Boxy", cupid: "Love god", daily: "Every day", dairy: "Milk products", daisy: "Flower", dandy: "Fine", datum: "Single info", daunt: "Scare", dawn: "Sunrise", dealt: "Gave out", death: "End", debug: "Fix code", debit: "Withdrawal", debut: "First show", decal: "Sticker", decay: "Rot", decor: "Decoration", decoy: "Distraction", deign: "Stoop", deity: "God", delay: "Wait", delta: "Change", delve: "Dig deep", demon: "Evil spirit", demur: "Object", denim: "Jeans fabric", dense: "Thick", depot: "Station", depth: "Deepness", derby: "Race", deter: "Prevent", detox: "Cleanse", deuce: "Two", devil: "Evil one", diary: "Journal", dicey: "Risky", digit: "Number", diner: "Eating place", dingo: "Wild dog", dirty: "Unclean", disco: "Dance club", ditch: "Trench", ditty: "Short song", divan: "Couch", diver: "Water explorer", dizzy: "Lightheaded", dodge: "Evade", dogma: "Belief", doing: "Acting", dolly: "Small cart", donor: "Giver", donut: "Sweet treat", doubt: "Uncertain", dough: "Unbaked bread", dowry: "Wedding gift", dozen: "Twelve", drake: "Male duck", drama: "Play", drank: "Swallowed", drape: "Curtain", drawl: "Slow speech", dread: "Fear", dream: "Sleep vision", dried: "No moisture", drier: "Heat tool", drift: "Float away", drill: "Tool", drink: "Beverage", drive: "Steer", droll: "Funny", drone: "Buzzer", drool: "Saliva", droop: "Hang down", dross: "Waste", drove: "Guided", drown: "Sink", druid: "Forest priest", drunk: "Intoxicated", dryly: "Witty", duchy: "Duke's land", dully: "Boringly", dummy: "Fake", dumpy: "Short fat", dunce: "Fool", dusk: "Sunset", dusty: "Powdery", dutch: "From Holland", dwarf: "Tiny", dwell: "Live", dwelt: "Resided", eager: "Keen", eagle: "Bird", early: "Soon", earth: "Planet", easel: "Art stand", eaten: "Consumed", eater: "Consumer", ebony: "Black wood", ebook: "Digital book", echo: "Reflection", edged: "Bordered", edger: "Trimmer", edict: "Order", edify: "Enlighten", eerie: "Spooky", egret: "White bird", eject: "Throw out", elate: "Make happy", elder: "Older", elect: "Choose", elegy: "Sad poem", elfin: "Small", elide: "Omit", elite: "Best", elope: "Run away", elude: "Escape", email: "Message", embed: "Fix inside", ember: "Coals", emcee: "Host", emend: "Fix text", emery: "Grinder", empty: "Vacant", enact: "Pass law", ender: "Finisher", endow: "Give money", enjoy: "Like", ennui: "Boredom", enoki: "Mushroom", enrol: "Join", ensue: "Follow", enter: "Go in", envoy: "Messenger", epoch: "Era", epoxy: "Glue", equal: "Same", equip: "Provide", erase: "Remove", erect: "Build", erode: "Wear away", erupt: "Explode", essay: "Writing", ester: "Chemical", ether: "Gas", ethic: "Moral", ethos: "Spirit", ethyl: "Alcohol type", evade: "Avoid", event: "Occasion", evict: "Throw out", evoke: "Call up", exalt: "Praise", excel: "Be best", exert: "Use force", exile: "Banish", exist: "Be", exit: "Way out", expel: "Kick out", extol: "Praise highly", exult: "Rejoice", fable: "Story", facet: "Side", faint: "Pass out", fairy: "Magic being", faith: "Belief", fancy: "Nice", fanny: "Rear", farad: "Unit", farce: "Comedy", fatal: "Deadly", fated: "Destined", fates: "Destiny", fauna: "Animals", favor: "Help", feast: "Big meal", fecal: "Waste", feces: "Waste", feign: "Fake", feint: "Fake move", fella: "Guy", felon: "Criminal", femme: "Woman", femur: "Bone", fence: "Barrier", feral: "Wild", ferry: "Boat", fetch: "Get", fetid: "Stinky", fetus: "Unborn", fever: "High heat", fewer: "Less", fiber: "Thread", ficus: "Plant", field: "Open area", fiend: "Demon", fiery: "Hot", fifth: "Middle", fifty: "Number", fight: "Battle", filch: "Steal", filet: "Meat cut", fillo: "Pastry", filmy: "Thin", filth: "Dirt", finch: "Bird", finer: "Better", finis: "End", finny: "Fish-like", first: "Initial", fishy: "Odd", fitly: "Well", fiver: "Five", fixer: "Mender", fizzy: "Bubbly", fjord: "Inlet", flack: "Criticism", flail: "Swing", flair: "Style", flake: "Small piece", flame: "Fire", flank: "Side", flare: "Light burst", flash: "Quick light", flask: "Bottle", flats: "Levels", flaws: "Errors", flaxn: "Fiber", fleas: "Bugs", fleck: "Speck", fleet: "Fast", flesh: "Skin", flick: "Quick move", flied: "Fleas", flier: "Flyer", flies: "Insects", fling: "Throw", flint: "Stone", flirt: "Tease", float: "Buoy", flock: "Group", flood: "Water burst", floor: "Ground", flora: "Plants", floss: "Tooth string", flour: "Bakery powder", flout: "Scorn", flown: "Moved", fluff: "Soft", fluid: "Liquid", fluke: "Chance", flume: "Slide", flung: "Threw", flunk: "Fail", flush: "Blush", flute: "Instrument", flyby: "Pass", flyer: "Pass", foals: "Horses", foams: "Bubbles", focal: "Central", focus: "Look at", foggy: "Mist", foist: "Force", folio: "Book", folly: "Foolish", foods: "Eats", foots: "Feet", foray: "Attack", force: "Power", forge: "Make", forgo: "Skip", forte: "Strength", forth: "Forward", forty: "Number", forum: "Meeting", found: "Discovered", fount: "Spring", foyer: "Entry", frail: "Weak", frame: "Border", franc: "Money", frank: "Honest", fraud: "Fake", freak: "Odd", freed: "Released", freer: "More free", fresh: "New", friar: "Monk", fried: "Cooked", frill: "Trim", frisk: "Search", frizz: "Curl", frock: "Dress", froggy: "Green", frost: "Ice", froth: "Foam", frown: "Sad face", froze: "Iced", fruit: "Food", fudge: "Chocolate", fugue: "Music", fully: "Total", fungi: "Mushrooms", funny: "Amusing", furze: "Bush", fused: "Joined", fussy: "Picky", futon: "Bed", fuzzy: "Soft",
    },
    6: {
      action: "Deed", actual: "Real", advice: "Tip", affect: "Impact", afford: "Pay for", afraid: "Scared", agency: "Bureau", agenda: "Plan", almost: "Nearly", always: "Forever", amount: "Quantity", animal: "Creature", annual: "Yearly", answer: "Reply", anyone: "Somebody", around: "About", artist: "Creator", assess: "Evaluate", assist: "Help", assume: "Suppose", attack: "Strike", attend: "Go to", author: "Writer", battle: "Fight", beauty: "Looks", become: "Turn into", before: "Prior", behind: "After", belief: "Faith", belong: "Fit in", better: "Improved", beyond: "Past", branch: "Limb", bridge: "Crossing", budget: "Funds", burden: "Load", button: "Click", camera: "Lens", career: "Job", center: "Middle", chance: "Luck", change: "Alter", charge: "Cost", choice: "Option", choose: "Pick", church: "Temple", client: "Customer", closed: "Shut", coffee: "Drink", column: "Pillar", comedy: "Humour", commit: "Pledge", common: "Usual", comply: "Obey", concept: "Idea", concern: "Worry", config: "Setup", confirm: "Verify", create: "Make", credit: "Trust", crisis: "Emergency", custom: "Habit", damage: "Harm", danger: "Risk", dealer: "Seller", debate: "Argue", decade: "Ten years", decide: "Choose", defend: "Protect", define: "Explain", degree: "Level", demand: "Ask", depend: "Rely", design: "Plan", detail: "Fact", device: "Gadget", differ: "Vary", doctor: "Physician", double: "Twice", driver: "Motorist", during: "While", easily: "Simply", editor: "Writer", effect: "Result", effort: "Try", either: "Or", employ: "Hire", enable: "Allow", energy: "Power", engine: "Motor", ensure: "Guarantee", entire: "Whole", escape: "Flee", except: "But", expand: "Grow", expect: "Anticipate", expert: "Pro", export: "Send", extend: "Stretch", factor: "Element", family: "Kin", famous: "Known", father: "Dad", figure: "Number", finger: "Digit", finish: "End", flight: "Trip", follow: "Track", forest: "Woods", forget: "Miss", formal: "Official", format: "Layout", former: "Previous", foster: "Nurture", friend: "Pal", future: "Later", garden: "Yard", gather: "Collect", gender: "Sex", gently: "Softly", global: "Worldwide", ground: "Earth", growth: "Rise", handle: "Grip", happen: "Occur", health: "Wellness", height: "Tallness", highly: "Very", honest: "Truthful", impact: "Effect", import: "Bring in", income: "Earnings", indeed: "Really", injury: "Harm", inside: "Within", intend: "Mean", invest: "Put in", island: "Land", itself: "Self", junior: "Younger", knight: "Warrior", laptop: "Computer", latest: "Newest", leader: "Boss", league: "Group", length: "Extent", lesson: "Class", letter: "Note", likely: "Probably", living: "Alive", losing: "Failing", manage: "Run", manner: "Way", master: "Expert", matter: "Issue", medium: "Middle", member: "Part", memory: "Recall", mental: "Mind", method: "Way", middle: "Center", minute: "Moment", modern: "Current", moment: "Instant", mother: "Mom", motion: "Movement", moving: "Shifting", murder: "Kill", museum: "Gallery", nation: "Country", native: "Local", nature: "World", nobody: "No one", normal: "Usual", notice: "See", number: "Figure", object: "Thing", office: "Work", option: "Choice", origin: "Source", outcome: "Result", output: "Yield", parent: "Mother or father", people: "Folks", period: "Time", person: "Individual", phrase: "Saying", planet: "World", player: "Gamer", please: "Kindly", plenty: "Lots", pocket: "Pouch", policy: "Rule", pretty: "Nice", prince: "Royal", profit: "Gain", proper: "Correct", public: "Open", purpose: "Aim", raised: "Lifted", random: "Chance", rarely: "Seldom", rather: "Instead", reason: "Cause", recall: "Remember", recent: "Latest", record: "Log", reduce: "Lessen", reform: "Change", refuse: "Decline", regard: "Consider", region: "Area", relate: "Connect", remain: "Stay", remote: "Distant", remove: "Take off", repeat: "Again", report: "Tell", resort: "Retreat", result: "Outcome", return: "Come back", review: "Check", reward: "Prize", safety: "Security", sample: "Example", scheme: "Plan", school: "Academy", screen: "Display", script: "Text", search: "Find", second: "Next", secret: "Hidden", sector: "Area", secure: "Safe", select: "Choose", senior: "Older", series: "Sequence", server: "Host", settle: "Resolve", shadow: "Shade", should: "Ought", silver: "Metal", simple: "Easy", single: "One", sister: "Sibling", source: "Origin", speech: "Talk", spirit: "Soul", spread: "Extend", spring: "Season", square: "Shape", stable: "Steady", status: "State", stream: "Flow", street: "Road", stress: "Pressure", strict: "Severe", stroke: "Hit", strong: "Powerful", submit: "Send", sudden: "Quick", summer: "Season", supply: "Provide", survey: "Poll", switch: "Change", symbol: "Sign", system: "Method", target: "Goal", tennis: "Sport", thanks: "Gratitude", theory: "Idea", threat: "Danger", ticket: "Pass", timing: "When", toward: "To", travel: "Trip", treaty: "Pact", unique: "Only", unless: "Except", useful: "Handy", valley: "Dale", variety: "Range", victim: "Sufferer", vision: "Sight", visual: "Seeing", weight: "Heaviness", window: "Pane", winter: "Cold season", wonder: "Marvel", worker: "Employee", writer: "Author", yellow: "Color", addict: "User", adjust: "Fix", advent: "Arrival", afraid: "Scared", arcane: "Secret", ascend: "Go up", aspect: "Side", avatar: "Image", ballet: "Dance", banner: "Sign", barber: "Cutter", barrel: "Drum", basket: "Carrier", bishop: "Clergy", blazer: "Jacket", blight: "Disease", bonnet: "Hat", border: "Edge", borrow: "Take", bottle: "Jug", bottom: "Base", bounce: "Jump", breach: "Break", broken: "Burst", bronze: "Metal", bubble: "Gloam", cancel: "Stop", candle: "Light", canvas: "Cloth", carpet: "Rug", casino: "Game", castle: "Fort", casual: "Relaxed", cheese: "Dairy", chorus: "Singers", circle: "Round", circus: "Show", clause: "Part", clever: "Smart", clinic: "Health", cloudy: "Foggy", clutch: "Grip", cohort: "Group", colony: "Settler", comics: "Funny", comput: "Calculate", concur: "Agree", confer: "Talk", corpus: "Body", cotton: "Fiber", county: "Area", cousin: "Kin", covers: "Lids", critic: "Judge", cruise: "Ship", dancer: "Artist", deadly: "Fatal", decent: "Good", decree: "Order", defeat: "Loss", defect: "Flaw", deploy: "Use", deputy: "Second", desert: "Dry land", desire: "Want", detect: "Find", devise: "Plan", dialog: "Speech", digest: "Eat", dinner: "Meal", direct: "Guide", dishes: "Plates", divide: "Part", dollar: "Money", domain: "Area", donkey: "Animal", dosage: "Amount", dragon: "Myth", drawer: "Box", dreams: "Vision", eating: "Consume", echoes: "Sound", eleven: "Number", emerge: "Appear", empire: "Order", enough: "Plenty", entity: "Being", enzyme: "Chemical", equity: "Value", estate: "Land", ethics: "Morals", ethnic: "Culture", excess: "Extra", expire: "End", expose: "Show", fabric: "Cloth", facial: "Face", failed: "Flop", fairly: "Legal", farmer: "Grower", favour: "Help", fellow: "Guy", female: "Girl", fender: "Guard", fibers: "Threads", filler: "Extra", filter: "Screen", finale: "Last", fiscal: "Money", flavor: "Taste", flower: "Plant", fluent: "Smooth", flying: "Airborne", footer: "Base", fourth: "Number", freeze: "Ice", french: "France", fringe: "Edge", frozen: "Iced", fuller: "More", fusion: "Join", galaxy: "Stars", garlic: "Spice", german: "Germany", glance: "Look", golden: "Metal", govern: "Rule", gravel: "Stones", guitar: "Music", hammer: "Tool", harbor: "Dock", hardly: "Rare", hazard: "Risk", header: "Top", helmet: "Head", herbal: "Plant", hockey: "Sport", holder: "Grip", hollow: "Empty", horror: "Fear", humble: "Modest", hungry: "Eager", hunter: "Chaser", hybrid: "Mixed", ignore: "Skip", images: "Photos", indoor: "Inside", induce: "Start", infant: "Baby", inform: "Tell", inland: "Inside", insect: "Bug", instil: "Fix", intent: "Aim", jacket: "Coat", jersey: "Shirt", jungle: "Forest", keeper: "Guard", kernel: "Seed", kettle: "Pot", ladder: "Climber", larger: "Big", lastly: "Final", layout: "Plan", leaves: "Plants", legend: "Story", linear: "Straight", lining: "Inside", linked: "Joined", liquid: "Fluid", listen: "Hear", little: "Small", lively: "Active", locate: "Find", locked: "Closed", lonely: "Solo", lovely: "Pretty", luxury: "Elite", magnet: "Puller", mainly: "Mostly", making: "Creator", manual: "Book", marble: "Stone", margin: "Edge", market: "Shop", matrix: "Grid", mature: "Adult", merely: "Only", merger: "Union", mighty: "Strong", miller: "Grinder", mining: "Deep", mirror: "Glass", misery: "Sad", mobile: "Moving", modest: "Simple", modify: "Change", module: "Part", monkey: "Animal", mostly: "Mainly", motive: "Reason", muscle: "Body", mutual: "Shared", myself: "Me", narrow: "Thin", nearby: "Close", nearly: "Almost", needle: "Sew", netted: "Caught", neuron: "Brain", nibble: "Bite", nickel: "Metal", nightly: "Dark", noises: "Sounds", notify: "Tell", notion: "Idea", obtain: "Get", occupy: "Live", offset: "Shift", online: "Web", opened: "Unclosed", oracle: "Seer", orange: "Color", orphan: "Child", others: "Else", oxford: "Shoes", oxygen: "Air", packet: "Bundle", palace: "Home", panels: "Boards", partly: "Some", patent: "Logic", patrol: "Guard", patron: "Giver", pauper: "Poor", payout: "Cash", picked: "Chosen", picket: "Sign", picnic: "Meal", pillow: "Soft", pirate: "Thief", pledge: "Promise", podium: "Stand", poetry: "Verse", poison: "Toxic", police: "Law", polish: "Shiny", portal: "Gate", poster: "Ad", powder: "Dust", powers: "Force", praise: "Laud", prayer: "Wish", prefer: "Like", priest: "Clergy", prompt: "Quick", proven: "Shown", pulled: "Tugged", punch: "Hit", punish: "Beat", puppet: "Doll", purely: "Clean", purity: "Holy", purple: "Color", quaint: "Old", quartz: "Gem", queasy: "Ill", quench: "Drink", quests: "Tasks", quiver: "Shake", rabbit: "Animal", racial: "Race", racing: "Fast", radial: "Round", radios: "Sound", radius: "Size", rating: "Score", reader: "Pupil", recipe: "Food", refuge: "Safety", regime: "Order", relief: "Calm", remedy: "Cure", remind: "Tell", render: "Show", rental: "Lease", repair: "Fix", rescue: "Save", reside: "Live", resist: "Stop", resume: "Start", retail: "Shop", retain: "Keep", retire: "Quit", reveal: "Show", rhythm: "Music", ribbon: "Tie", riding: "Horse", rights: "Legal", rising: "Going up", ritual: "Rite", robust: "Strong", rocket: "Space", roller: "Wheel", rubble: "Rocks", ruling: "Order", runner: "Athlete", salary: "Pay", saving: "Money", scarce: "Rare", season: "Time", seeing: "View", senate: "Law", sender: "Mover", sensor: "Tool", severe: "Hard", sewage: "Waste", shaken: "Moved", sharply: "Acrid", shelly: "Sea", shield: "Guard", shower: "Rain", shrine: "Holy", shrink: "Small", siding: "Wall", signal: "Sign", signed: "Done", silent: "Still", simply: "Easy", singer: "Voice", sister: "Kin", sketch: "Draw", skills: "Power", sleeve: "Arm", slight: "Small", slogan: "Sign", smooth: "Silky", soccer: "Sport", social: "Group", socket: "Plug", sodium: "Salt", soften: "Easy", solely: "Only", solver: "Reason", somber: "Sad", sooner: "Early", soviet: "Russia", sphere: "Round", spider: "Insect", spinal: "Back", splash: "Water", sponge: "Sift", sports: "Game", spring: "Season", sprint: "Run", squash: "Vegetable", stable: "Steady", stacks: "Piles", stages: "Phases", stairs: "Steps", stance: "Pose", static: "Still", statue: "Image", steady: "Firm", stereo: "Music", sticks: "Woods", sticky: "Glue", stigma: "Mark", stitch: "Sew", stocks: "Shares", stolen: "Taken", stones: "Rocks", stored: "Kept", stormy: "Windy", strain: "Stress", strand: "Fiber", streak: "Line", stream: "River", stride: "Step", strike: "Hit", string: "Line", stripe: "Line", strive: "Try", struck: "Hit", studio: "Art", subtle: "Soft", suburb: "Home", suffer: "Pain", summit: "Peak", summon: "Call", superb: "Best", surely: "True", tablet: "Device", tackle: "Hit", talent: "Skill", tasted: "Ate", tastes: "Eat", tattoo: "Ink", taught: "Pupil", teamed: "Group", temple: "Church", tenant: "User", tender: "Soft", tenure: "Job", thesis: "Paper", thrift: "Cheap", thrill: "Exciting", thrive: "Grow", timber: "Wood", timely: "Early", tissue: "Paper", titled: "Named", titles: "Names", tomato: "Veggie", tongue: "Mouth", topics: "Themes", torque: "Force", traced: "Drawn", tracks: "Lines", tremor: "Shake", tribal: "Group", tricky: "Hard", triple: "Three", tropic: "Hot", tunnel: "Deep", turkey: "Bird", twelve: "Number", twenty: "Number", typing: "Keys", unlock: "Open", unpaid: "Free", unseen: "Hidden", untour: "False", uphold: "Keep", upland: "High", uproar: "Noisy", upside: "Top", uptake: "Gain", urgent: "Fast", usable: "Handy", utmost: "Best", valley: "Low", vandal: "Thief", varied: "Lot", vastly: "Huge", vector: "Line", velvet: "Soft", vendor: "Seller", verbal: "Speech", verify: "Check", vessel: "Ship", vested: "Clad", viewed: "Seen", viewer: "Eye", violin: "Music", virgin: "Pure", virtue: "Good", visits: "Goes", voices: "Speech", volume: "Sound", vortex: "Spiral", voting: "Choosing", voyage: "Trip", waited: "Stayed", walker: "Stride", walnut: "Nut", wander: "Walk", wanted: "Desired", warmth: "Heat", washes: "Cleans", wasted: "Lost", waters: "Sea", wealth: "Rich", wearer: "User", weekly: "Time", whilst: "During", wholly: "Totally", wicked: "Evil", winner: "First", winter: "Cold", wisdom: "Smart", wisely: "Smartly", wished: "Wanted", within: "Inside", wizard: "Magic", worthy: "Good", writes: "Composes", yields: "Gains", youths: "Kids", zodiac: "Stars", zombie: "Dead",
    },
    7: {
      ability: "Skill", absence: "Lack", academy: "School", account: "Story", achieve: "Get", acquire: "Gain", address: "Home", advance: "Move", adverse: "Bad", advice: "Tips", advisor: "Guide", against: "Oppose", already: "Before", another: "Other", anxiety: "Worry", anyways: "Anyhow", applied: "Used", arrange: "Set", arrival: "Coming", article: "Story", assumed: "Thought", attempt: "Try", attract: "Pull", average: "Normal", balance: "Steady", banking: "Money", barrier: "Wall", battery: "Power", because: "Since", believe: "Trust", benefit: "Gain", between: "Among", binding: "Tied", blanket: "Cover", blocked: "Stopped", booking: "Entry", brother: "Kin", brought: "Took", browser: "Web", builder: "Maker", cabinet: "Box", caliber: "Grade", calling: "Nal", capital: "Cash", capture: "Catch", careful: "Wary", carried: "Held", catalog: "List", caution: "Wary", central: "Main", century: "Era", certain: "Sure", chamber: "Room", chapter: "Part", charity: "Gift", charter: "Pact", checked: "Seen", chicken: "Bird", chronic: "Long", circuit: "Loop", citizen: "Local", classic: "Old", clearly: "Mainly", climate: "Sky", closely: "Near", collect: "Get", college: "School", combine: "Join", comfort: "Ease", command: "Order", compact: "Small", company: "Firm", compare: "Match", compete: "Fight", complex: "Hard", concept: "Idea", concern: "Worry", concert: "Show", conduct: "Way", confirm: "Verify", connect: "Link", consent: "Yes", consist: "Be", contact: "Touch", contain: "Hold", content: "Inside", contest: "Game", context: "Scene", control: "Rule", convert: "Change", correct: "Right", council: "Group", counsel: "Help", country: "Land", couples: "Pairs", courses: "Paths", covered: "Hid", culture: "Way", current: "Now", cutting: "Edge", dealing: "Trading", decided: "Sure", decline: "Drop", default: "Basic", defense: "Guard", defined: "Set", defects: "Flaws", degrees: "Levels", delayed: "Late", deliver: "Give", demand: "Ask", density: "Thick", depend: "Rely", deposit: "Put", derived: "Gained", deserve: "Earn", design: "Plan", despite: "Though", destroy: "Ruin", details: "Facts", develop: "Grow", devices: "Tools", diamond: "Gem", digital: "Web", discuss: "Talk", disease: "Ill", display: "Show", dispute: "Argue", distant: "Far", diverse: "Varied", divided: "Split", drawing: "Art", driving: "Cars", dynamic: "Active", economy: "Cash", edition: "Form", effects: "Impact", element: "Part", embrace: "Hug", emotion: "Feel", employ: "Hire", enabled: "Open", enacted: "Done", engaged: "Busy", enhance: "Better", enjoyed: "Liked", enquiry: "Ask", ensured: "Sure", entered: "Went", episode: "Part", equally: "Same", evening: "Night", exactly: "Sure", examine: "Look", example: "Sample", excited: "Happy", exclude: "Keep out", execute: "Do", exercise: "Sport", exhibit: "Show", existed: "Was", expand: "Grow", expect: "Wait", explain: "Tell", explore: "Find", express: "Say", extract: "Take", extreme: "Most", factory: "Plant", faculty: "Staff", failure: "Flop", fashion: "Style", feature: "Trait", federal: "Land", feeling: "Feel", fiction: "Story", fifteen: "Value", finally: "Last", finance: "Cash", finding: "Result", fishing: "Sport", fitness: "Health", focused: "Fixed", foreign: "Away", forever: "Always", formula: "Plan", fortune: "Luck", forward: "Ahead", freedom: "Free", friends: "Pals", further: "More", gallery: "Art", general: "Main", genuine: "Real", getting: "Main", granted: "Given", gravity: "Pull", greater: "Big", greatly: "Very", growing: "More", handled: "Grip", happens: "Occur", healthy: "Fit", hearing: "Ear", heavily: "Very", helpful: "Handy", history: "Past", holiday: "Trip", honesty: "Truth", hostile: "Mean", housing: "Homes", however: "But", hundred: "Score", husband: "Man", illegal: "Bad", illness: "Sick", imagine: "Think", impact: "Hit", improve: "Better", include: "Have", initial: "First", inquiry: "Ask", insight: "Idea", install: "Set", instant: "Fast", instead: "Or", intense: "Deep", interim: "Mid", invalid: "Null", inverse: "Back", involve: "Take", journal: "News", journey: "Trip", justice: "Law", keeping: "Holding", killing: "Death", kitchen: "Food", knowing: "Main", labeled: "Mark", landing: "Floor", largely: "Mainly", learned: "Smart", leather: "Skin", lecture: "Talk", legally: "Law", letters: "Mail", limited: "Small", listing: "Items", logical: "Smart", loyalty: "Trust", machine: "Tool", managed: "Done", manager: "Boss", mapping: "Plan", married: "Wed", masters: "Pro", maximum: "Most", meaning: "Sense", measure: "Size", medical: "Health", meeting: "Show", mention: "Tell", message: "Note", million: "Bank", mineral: "Rock", minimal: "Small", minimum: "Least", minutes: "Time", missing: "Gone", mission: "Goal", mistake: "Error", mixture: "Join", monitor: "Look", monthly: "Cycle", morning: "A.M.", musical: "Song", mystery: "Odd", natural: "Real", neither: "Nor", nervous: "Wary", network: "Web", nothing: "Null", nowhere: "Gone", nuclear: "Power", objects: "Items", obvious: "Clear", offered: "Gave", officer: "Cops", opening: "Gate", operate: "Run", opinion: "View", optical: "Eye", organic: "Pure", outcome: "End", outdoor: "Field", outside: "Entry", overall: "Main", package: "Box", painful: "Hurt", parents: "Kin", partial: "Part", partner: "Mate", passion: "Love", patient: "Sick", pattern: "Way", payment: "Cash", perfect: "Pure", perform: "Act", perhaps: "Maybe", physics: "Science", picture: "Image", plastic: "Form", playing: "Game", popular: "Star", portion: "Part", poverty: "Poor", precisely: "Sure", prepare: "Set", present: "Now", prevent: "Stop", primary: "Main", privacy: "Hid", private: "Self", problem: "Hard", process: "Way", produce: "Make", product: "Item", profile: "Site", program: "App", project: "Task", promise: "Word", promote: "Host", protect: "Guard", provide: "Give", publish: "Send", purpose: "Aim", pushing: "Move", quality: "Best", quarter: "One", quickly: "Fast", quietly: "Soft", radical: "New", railway: "Train", readily: "Easy", reading: "Book", reality: "Real", receive: "Get", recently: "New", records: "Log", reflect: "Show", regular: "Norm", related: "Same", release: "Free", remains: "Rest", renewal: "New", replace: "Swap", request: "Ask", require: "Need", rescued: "Saved", research: "Find", reserve: "Keep", resolve: "Fix", respect: "Care", respond: "Say", restored: "New", retired: "Done", revenue: "Cash", reverse: "Back", review: "Look", routine: "Way", running: "Fast", satisfy: "Yes", savings: "Bank", science: "Study", section: "Part", segment: "Part", serious: "Main", service: "Help", session: "Meeting", setting: "Scene", several: "Some", shaping: "Form", sharing: "Give", shelter: "Home", shortly: "Soon", showing: "Seen", silence: "Dead", similar: "Same", skilled: "Good", smoking: "Fire", society: "Group", someone: "User", speaker: "Talk", special: "Rare", species: "Kind", sponsor: "Host", station: "Bus", storage: "Space", strange: "Odd", stretch: "Long", student: "Pupil", subject: "Theme", succeed: "Win", success: "Gain", suggest: "Ask", support: "Back", surface: "Top", surgery: "Cut", surplus: "Lots", survive: "Live", suspect: "Wary", sustain: "Keep", targets: "Goal", teacher: "Staff", tension: "Hard", testing: "Wait", theatre: "Show", therapy: "Help", thereby: "Then", thought: "Mind", through: "Past", tonight: "Dark", totally: "Full", towards: "Near", traffic: "Cars", tragedy: "Loss", trained: "Good", training: "Task", travel: "Trip", treated: "Care", treaty: "Pact", trouble: "Hard", typical: "Norm", uniform: "Same", unknown: "Hide", unusual: "Rare", usually: "Norm", utility: "Tool", vaguely: "Soft", valuable: "Gold", various: "Many", vehicle: "Cars", venture: "Task", version: "Form", veteran: "Old", village: "Home", violent: "Hard", virtual: "Web", visible: "See", waiting: "Stay", walking: "Move", warning: "Wary", weather: "Sky", website: "Site", wedding: "Ring", weekend: "Home", welcome: "Hi", western: "West", whereas: "When", whether: "If", willing: "Yes", without: "Lack", working: "Job", worried: "Fear", writing: "Art", written: "Penned",
    },
  };

  // Fill fallback for 6- and 7-letter: use first letter + " word" or "Common word"
  function getHint(word) {
    const len = word.length;
    const map = HINTS[len];
    if (map && map[word]) return map[word];
    return "Common word";
  }

  const levelScreen = document.getElementById("levelScreen");
  const gameScreen = document.getElementById("gameScreen");
  const boardEl = document.getElementById("board");
  const keyboardEl = document.getElementById("keyboard");
  const levelBadge = document.getElementById("levelBadge");
  const resultOverlay = document.getElementById("resultOverlay");
  const resultTitle = document.getElementById("resultTitle");
  const resultWord = document.getElementById("resultWord");
  const hintArea = document.getElementById("hintArea");
  const showHintsToggle = document.getElementById("showHintsToggle");
  const howToPlayOverlay = document.getElementById("howToPlayOverlay");
  const howToPlayClose = document.getElementById("howToPlayClose");

  let currentLevel = "medium";
  let wordLength = 5;
  let maxGuesses = 6;
  let targetWord = "";
  let guesses = [];
  let currentGuess = "";
  let gameOver = false;

  function getConfig() {
    const cfg = LEVELS[currentLevel];
    return { wordLength: cfg.wordLength, maxGuesses: cfg.maxGuesses, name: cfg.name };
  }

  function pickWord() {
    const list = WORDS[wordLength];
    return list[Math.floor(Math.random() * list.length)];
  }

  function isValidWord(word) {
    return WORDS[wordLength].indexOf(word.toLowerCase()) !== -1;
  }

  function getFeedback(guess, target) {
    const result = [];
    const g = guess.toLowerCase().split("");
    const t = target.toLowerCase().split("");
    const used = [];

    for (let i = 0; i < g.length; i++) {
      if (g[i] === t[i]) {
        result[i] = "correct";
        used[i] = true;
      }
    }
    for (let i = 0; i < g.length; i++) {
      if (result[i] === "correct") continue;
      let found = false;
      for (let j = 0; j < t.length; j++) {
        if (!used[j] && t[j] === g[i]) {
          used[j] = true;
          found = true;
          break;
        }
      }
      result[i] = found ? "present" : "absent";
    }
    return result;
  }

  function buildBoard() {
    const { wordLength: len, maxGuesses: max } = getConfig();
    boardEl.innerHTML = "";
    boardEl.className = "board size-" + len;
    for (let r = 0; r < max; r++) {
      const row = document.createElement("div");
      row.className = "board-row";
      for (let c = 0; c < len; c++) {
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.dataset.row = String(r);
        tile.dataset.col = String(c);
        row.appendChild(tile);
      }
      boardEl.appendChild(row);
    }
  }

  function buildKeyboard() {
    keyboardEl.innerHTML = "";
    const row2 = document.createElement("div");
    row2.className = "keyboard-row";
    ROWS[0].split("").forEach((k) => row2.appendChild(createKey(k)));
    keyboardEl.appendChild(row2);

    const row1 = document.createElement("div");
    row1.className = "keyboard-row";
    ROWS[1].split("").forEach((k) => row1.appendChild(createKey(k)));
    keyboardEl.appendChild(row1);

    const row0 = document.createElement("div");
    row0.className = "keyboard-row";
    const enter = createKey("Enter");
    enter.classList.add("wide");
    enter.textContent = "Enter";
    row0.appendChild(enter);
    ROWS[2].split("").forEach((k) => row0.appendChild(createKey(k)));
    const back = createKey("Backspace");
    back.classList.add("wide");
    back.textContent = "⌫";
    row0.appendChild(back);
    keyboardEl.appendChild(row0);
  }

  function createKey(key) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "key";
    btn.dataset.key = key;
    if (key.length === 1) btn.textContent = key;
    btn.addEventListener("click", () => handleKey(key));
    return btn;
  }

  function syncBoard() {
    const rows = boardEl.querySelectorAll(".board-row");
    const len = wordLength;
    guesses.forEach((guess, r) => {
      const feedback = getFeedback(guess, targetWord);
      const tiles = rows[r].querySelectorAll(".tile");
      guess.split("").forEach((letter, c) => {
        tiles[c].textContent = letter;
        tiles[c].classList.remove("filled", "correct", "present", "absent");
        tiles[c].classList.add("filled", feedback[c]);
      });
    });
    if (guesses.length < maxGuesses && currentGuess.length > 0) {
      const r = guesses.length;
      const tiles = rows[r].querySelectorAll(".tile");
      currentGuess.split("").forEach((letter, c) => {
        tiles[c].textContent = letter;
        tiles[c].classList.add("filled");
        tiles[c].classList.remove("correct", "present", "absent");
      });
      for (let c = currentGuess.length; c < len; c++) {
        tiles[c].textContent = "";
        tiles[c].classList.remove("filled", "correct", "present", "absent");
      }
    }
    updateKeyboardColors();
  }

  function updateKeyboardColors() {
    const keys = keyboardEl.querySelectorAll(".key[data-key]");
    const keyState = {};
    guesses.forEach((guess) => {
      const feedback = getFeedback(guess, targetWord);
      guess.split("").forEach((letter, i) => {
        const k = letter.toLowerCase();
        if (feedback[i] === "correct") keyState[k] = "correct";
        else if (feedback[i] === "present" && keyState[k] !== "correct") keyState[k] = "present";
        else if (feedback[i] === "absent" && !keyState[k]) keyState[k] = "absent";
      });
    });
    keys.forEach((btn) => {
      const k = btn.dataset.key.toLowerCase();
      if (k.length !== 1) return;
      btn.classList.remove("correct", "present", "absent");
      if (keyState[k]) btn.classList.add(keyState[k]);
    });
  }

  function showResult(won) {
    gameOver = true;
    resultTitle.textContent = won ? "You got it!" : "Game over";
    resultWord.textContent = targetWord.toUpperCase();
    resultOverlay.classList.remove("hidden");
  }

  function shakeRow(rowIndex) {
    const row = boardEl.querySelectorAll(".board-row")[rowIndex];
    const tiles = row.querySelectorAll(".tile");
    tiles.forEach((t) => t.classList.add("shake"));
    setTimeout(() => tiles.forEach((t) => t.classList.remove("shake")), 500);
  }

  function submitGuess() {
    if (currentGuess.length !== wordLength || gameOver) return;
    if (!isValidWord(currentGuess)) {
      shakeRow(guesses.length);
      return;
    }
    guesses.push(currentGuess);
    const won = currentGuess.toLowerCase() === targetWord.toLowerCase();
    currentGuess = "";
    syncBoard();
    if (won) {
      setTimeout(() => showResult(true), 500);
      return;
    }
    if (guesses.length >= maxGuesses) {
      setTimeout(() => showResult(false), 500);
    }
  }

  function handleKey(key) {
    if (gameOver) return;
    if (key === "Enter") {
      submitGuess();
      return;
    }
    if (key === "Backspace") {
      currentGuess = currentGuess.slice(0, -1);
      syncBoard();
      return;
    }
    if (key.length === 1 && /[a-zA-Z]/.test(key) && currentGuess.length < wordLength) {
      currentGuess += key.toLowerCase();
      syncBoard();
    }
  }

  function initGame() {
    const cfg = getConfig();
    wordLength = cfg.wordLength;
    maxGuesses = cfg.maxGuesses;
    targetWord = pickWord();
    guesses = [];
    currentGuess = "";
    gameOver = false;
    levelBadge.textContent = cfg.name;
    buildBoard();
    buildKeyboard();
    syncBoard();
    resultOverlay.classList.add("hidden");
    updateHintVisibility();
  }

  function updateHintVisibility() {
    if (showHintsToggle.checked) {
      hintArea.textContent = getHint(targetWord);
      hintArea.classList.remove("hidden");
    } else {
      hintArea.textContent = "";
      hintArea.classList.add("hidden");
    }
  }

  function openHowToPlay() {
    howToPlayOverlay.classList.remove("hidden");
    howToPlayOverlay.setAttribute("aria-hidden", "false");
  }

  function closeHowToPlay() {
    howToPlayOverlay.classList.add("hidden");
    howToPlayOverlay.setAttribute("aria-hidden", "true");
  }

  function showLevelScreen() {
    levelScreen.classList.remove("hidden");
    gameScreen.classList.add("hidden");
  }

  function showGameScreen() {
    levelScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    initGame();
  }

  document.querySelectorAll(".level-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentLevel = btn.dataset.level;
      showGameScreen();
    });
  });

  document.getElementById("changeLevelBtn").addEventListener("click", showLevelScreen);
  document.getElementById("newGameBtn").addEventListener("click", initGame);
  document.getElementById("playAgainBtn").addEventListener("click", initGame);
  document.getElementById("changeLevelFromResultBtn").addEventListener("click", () => {
    resultOverlay.classList.add("hidden");
    showLevelScreen();
  });

  showHintsToggle.addEventListener("change", updateHintVisibility);

  document.getElementById("howToPlayBtnLevel").addEventListener("click", openHowToPlay);
  document.getElementById("howToPlayBtnGame").addEventListener("click", openHowToPlay);
  howToPlayClose.addEventListener("click", closeHowToPlay);
  howToPlayOverlay.addEventListener("click", (e) => {
    if (e.target === howToPlayOverlay) closeHowToPlay();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !howToPlayOverlay.classList.contains("hidden")) closeHowToPlay();
  });

  document.addEventListener("keydown", (e) => {
    if (gameScreen.classList.contains("hidden")) return;
    if (!howToPlayOverlay.classList.contains("hidden")) return;
    if (e.key === "Backspace") e.preventDefault();
    handleKey(e.key);
  });

  // Background Sound Logic
  (function () {
    const bgSound = document.getElementById("bg-sound");
    const soundToggle = document.getElementById("sound-toggle");
    const onIcon = document.getElementById("sound-on-icon");
    const offIcon = document.getElementById("sound-off-icon");

    if (bgSound) {
      bgSound.volume = 0.3;
    }

    function playBackgroundSound() {
      if (bgSound) {
        bgSound.play().then(() => {
          document.removeEventListener("click", playBackgroundSound);
          document.removeEventListener("touchstart", playBackgroundSound);
          document.removeEventListener("keydown", playBackgroundSound);
        }).catch(function (error) {
          console.log("Background audio playback failed or prevented:", error);
        });
      }
    }

    document.addEventListener("click", playBackgroundSound);
    document.addEventListener("touchstart", playBackgroundSound);
    document.addEventListener("keydown", playBackgroundSound);

    if (soundToggle && bgSound) {
      soundToggle.addEventListener("click", function (e) {
        e.stopPropagation();
        if (bgSound.muted) {
          bgSound.muted = false;
          onIcon.style.display = "block";
          offIcon.style.display = "none";
        } else {
          bgSound.muted = true;
          onIcon.style.display = "none";
          offIcon.style.display = "block";
        }
      });
    }
  })();

  buildKeyboard();
})();
