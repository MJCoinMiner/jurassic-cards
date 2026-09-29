// User Session & Account-Specific State Variables
let currentUser = localStorage.getItem('dinoUser') || null;
let coins = 0;
let permits = 0;
let userCollection = [];

let questBattlesCount = 0; let questExcavatesCount = 0; let questWinsCount = 0; let questMapCount = 0; let questCommonCount = 0;
let claimedQ1 = false; let claimedQ2 = false; let claimedQ3 = false; let claimedQ4 = false; let claimedQ5 = false;

let claimedM1 = false;
let claimedM2 = false;

let facilityTutorialDone = false;

// --- NEW ARENA SECURITY VARIABLES ---
let dailyBattlesPlayed = 0;
let isBattling = false; // Anti-spam lock

// Audio Helper
function playSound(id) {
    const sound = document.getElementById(id + '-sound');
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => {});
    }
}

const masterCatalog = [
    { 
        id: 1, name: "Triceratops", era: "Cretaceous", diet: "Herbivore", dietIcon: "🌿", ovr: 88, rarity: "epic", level: 1, region: "North America", city: "Colorado, USA", mapX: 25, mapY: 32, stats: { pac: 60, pwr: 85, def: 95, siz: 80, iq: 65, agi: 45 }, 
        statReasons: { pac: "Weighing several tons, it lacked the biomechanics for sustained running. However, its powerful hind legs allowed for terrifying short-distance charges to fend off predators.", pwr: "Equipped with a solid bony frill and three massive facial horns, its offensive lunges could easily puncture the tough hides of apex predators like the Tyrannosaurus Rex.", def: "Its massive neck frill acted as a built-in biological shield, protecting its most vulnerable spots from lethal bites during combat.", siz: "Reaching lengths of nearly 30 feet and weighing up to 12 tons, the Triceratops was built like a heavily armored tank of the Late Cretaceous period.", iq: "It possessed the average intelligence for a large herd animal, relying on strong survival instincts and group mechanics rather than complex problem-solving.", agi: "Supported by four stout, pillared legs, it was incredibly stable but suffered from a very slow turning radius, making it vulnerable to flanking maneuvers." }, 
        funFact: "The Triceratops' massive skull could grow up to 8 feet long, making up nearly a third of its entire body length!", img: "images/triceratops.jpg.jpg", bio: "A heavily armored herbivore instantly recognizable by its three horns and massive neck frill." 
    },
    { 
        id: 2, name: "Stegosaurus", era: "Jurassic", diet: "Herbivore", dietIcon: "🌿", ovr: 82, rarity: "rare", level: 1, region: "North America", city: "Wyoming, USA", mapX: 24, mapY: 31, stats: { pac: 40, pwr: 75, def: 90, siz: 75, iq: 40, agi: 30 }, 
        statReasons: { pac: "With forelimbs significantly shorter than its hind legs, its maximum speed was heavily restricted, meaning it had to stand its ground rather than flee from danger.", pwr: "Its primary weapon was the 'thagomizer'—a cluster of four lethal bone spikes at the end of its flexible tail capable of swinging with bone-shattering force.", def: "Lined with two staggered rows of large dermal plates, its back was incredibly difficult for predators like the Allosaurus to bite from above.", siz: "A bulky, heavily built animal weighing over 5 tons, providing a massive physical barrier against attackers.", iq: "Notorious for having a brain roughly the size of a walnut or a dog's brain, operating almost entirely on primal reflexes.", agi: "Its highly rigid spine and incredibly heavy tail made rapid movements and sharp pivoting practically impossible." }, 
        funFact: "Paleontologists believe the giant plates on its back were filled with blood vessels and could flush with red blood to intimidate predators or cool the dinosaur down!", img: "images/stegosaurus.jpg.jpg", bio: "A distinct, slow-moving herbivore recognized by its armored plates and spiked tail." 
    },
    { 
        id: 3, name: "Velociraptor", era: "Cretaceous", diet: "Carnivore", dietIcon: "🥩", ovr: 85, rarity: "epic", level: 1, region: "Asia", city: "Gobi Desert, Mongolia", mapX: 72, mapY: 32, stats: { pac: 95, pwr: 70, def: 40, siz: 30, iq: 95, agi: 99 }, 
        statReasons: { pac: "Built entirely for speed, its lightweight, hollow avian bones and elongated hind legs made it an exceptionally fast sprinter over open desert plains.", pwr: "Its most devastating weapon was a massive, 3-inch retractable sickle-claw on each foot, designed to hook into and deeply slash struggling prey.", def: "With a very fragile, bird-like skeletal frame, it possessed almost no natural defense and relied entirely on dodging counterattacks.", siz: "Relatively small, standing no taller than a large dog or wolf, relying on coordinated pack hunting to take down larger game.", iq: "Believed to be one of the most intelligent dinosaurs, showing evidence of complex pack coordination, communication, and ambush strategies.", agi: "A specialized stiffened tail acted as a high-speed rudder, allowing it to execute impossibly sharp turns without losing balance." }, 
        funFact: "Real Velociraptors were actually only about the size of a large turkey and were completely covered in feathers, much like modern birds of prey!", img: "images/velociraptor.jpg.jpg", bio: "A highly intelligent, incredibly agile pack hunter armed with a lethal sickle claw." 
    },
    { 
        id: 6, name: "Tyrannosaurus Rex", era: "Cretaceous", diet: "Carnivore", dietIcon: "🥩", ovr: 96, rarity: "legendary", level: 1, region: "North America", city: "South Dakota, USA", mapX: 26, mapY: 31, stats: { pac: 75, pwr: 99, def: 85, siz: 90, iq: 80, agi: 60 }, 
        statReasons: { pac: "While heavily debated by paleontologists, biomechanical models suggest it could reach speeds of 12-15 mph in short, earth-shaking sprints.", pwr: "Boasting the strongest bite force of any terrestrial animal to ever live, a T-Rex could exert over 12,000 pounds of pressure to easily crush solid bone.", def: "Protected by thick, scaly skin and a massively robust skeletal structure, mature Tyrannosaurs were nearly impervious to attacks from lesser predators.", siz: "Reaching lengths of up to 40 feet and weighing over 9 tons, its sheer mass allowed it to physically dominate the Late Cretaceous landscape.", iq: "Casts of the T-Rex brain cavity reveal exceptionally large olfactory lobes, giving it a sense of smell rivaling modern vultures to easily track prey.", agi: "While its massive skull made high-speed turns difficult, its heavy tail acted as a counterbalance, allowing it to pivot with surprising grace." }, 
        funFact: "A T-Rex's teeth were the size and shape of bananas, featuring serrated edges that allowed them to easily tear through heavily armored prey!", img: "images/trex.jpg.jpg", bio: "The undisputed tyrant lizard king and apex predator of the Cretaceous period." 
    },
    { 
        id: 7, name: "Spinosaurus", era: "Cretaceous", diet: "Carnivore", dietIcon: "🥩", ovr: 95, rarity: "legendary", level: 1, region: "Africa", city: "Bahariya, Egypt", mapX: 52, mapY: 42, stats: { pac: 80, pwr: 95, def: 80, siz: 95, iq: 70, agi: 65 }, 
        statReasons: { pac: "Uniquely adapted for a semi-aquatic lifestyle, its dense bones provided ballast for swift, powerful swimming through deep prehistoric river systems.", pwr: "Its massive, crocodile-like jaws and conical teeth were perfectly engineered to grip and tear massive, slippery aquatic prey.", def: "The towering, 6-foot sail on its back made it look significantly larger than it was, intimidating rival predators on land.", siz: "Currently recognized as the largest terrestrial carnivore known to science, even surpassing the mighty Tyrannosaurus Rex in total length.", iq: "Possessed highly specialized sensory intelligence, using pits in its snout to detect the movement of fish in murky waters.", agi: "Extremely graceful and maneuverable in the water, but its short hind legs made it slow and clunky on dry land." }, 
        funFact: "Spinosaurus is currently the only known dinosaur that spent the vast majority of its life swimming and hunting directly in the water!", img: "images/spinosaurus.jpg.jpg", bio: "A colossal, sail-backed aquatic predator uniquely adapted for ruling prehistoric rivers." 
    },
    { 
        id: 8, name: "Allosaurus", era: "Jurassic", diet: "Carnivore", dietIcon: "🥩", ovr: 89, rarity: "epic", level: 1, region: "North America", city: "Utah, USA", mapX: 23, mapY: 32, stats: { pac: 85, pwr: 88, def: 75, siz: 70, iq: 75, agi: 80 }, 
        statReasons: { pac: "Built lighter than later tyrannosaurs, its long legs made it a relentless pursuit hunter capable of running down swift prey.", pwr: "Its skull was uniquely hinged, allowing it to open its jaws incredibly wide and use its upper teeth like a serrated hatchet to slash prey.", def: "A rugged, muscular frame offered moderate defense, but it relied more on outmaneuvering heavier armored herbivores.", siz: "A substantial and terrifying apex predator, measuring up to 28 feet in length and dominating the Jurassic food chain.", iq: "Fossil evidence suggests they may have occasionally hunted in loose packs to take down massive sauropods, requiring complex coordination.", agi: "Highly nimble for its size, able to perform quick directional changes to avoid the lethal tail swings of Stegosaurus." }, 
        funFact: "The Allosaurus shed and replaced its teeth constantly. A single Allosaurus could go through thousands of razor-sharp teeth in its lifetime!", img: "images/allosaurus.jpg.jpg", bio: "The lion of the Jurassic, a ferocious and highly agile apex predator." 
    },
    { 
        id: 9, name: "Diplodocus", era: "Jurassic", diet: "Herbivore", dietIcon: "🌿", ovr: 83, rarity: "rare", level: 1, region: "North America", city: "Colorado, USA", mapX: 25, mapY: 32, stats: { pac: 30, pwr: 65, def: 80, siz: 95, iq: 45, agi: 25 }, 
        statReasons: { pac: "A massive, quadrupedal beast built for browsing rather than speed, moving at a slow, deliberate walking pace.", pwr: "Its primary defense was its incredibly long, thin tail, which could be cracked like a colossal bullwhip to fend off attackers.", def: "Its sheer scale made it nearly impossible for a single predator to successfully attack without risking severe injury.", siz: "One of the longest known dinosaurs, reaching up to 90 feet from the tip of its snout to the end of its tail.", iq: "Driven entirely by the basic survival instincts required to migrate, find vegetation, and stay within the safety of a herd.", agi: "Due to its colossal length and quadrupedal stance, turning around was a slow and cumbersome process." }, 
        funFact: "Its whip-like tail could be swung fast enough to break the sound barrier, creating a 'sonic boom' that would deafen approaching predators!", img: "images/diplodocus.jpg.jpg", bio: "A massive sauropod famous for its incredibly long neck and whip-like tail." 
    },
    { 
        id: 10, name: "Dilophosaurus", era: "Jurassic", diet: "Carnivore", dietIcon: "🥩", ovr: 82, rarity: "rare", level: 1, region: "North America", city: "Arizona, USA", mapX: 23, mapY: 34, stats: { pac: 85, pwr: 75, def: 60, siz: 55, iq: 75, agi: 90 }, 
        statReasons: { pac: "A slender, lightly built theropod that relied on explosive speed and long strides to hunt down smaller, fast-moving game.", pwr: "Its jaws featured a distinct 'notch' behind its front teeth, allowing it to grip and hold onto struggling prey with ease.", def: "Lacked heavy armor or bulk, relying on its speed to escape larger threats in the Early Jurassic.", siz: "Much larger than depicted in movies, growing up to 20 feet long and weighing nearly 900 pounds.", iq: "A highly capable and intelligent hunter that likely utilized stealth and ambush tactics in dense vegetation.", agi: "Its light frame and powerful hind legs allowed for rapid leaping and sudden changes in direction during a pursuit." }, 
        funFact: "While famously depicted in movies as a small dinosaur that spits venom and has a neck frill, the real Dilophosaurus lacked both and was actually a massive apex predator!", img: "images/dilophosaurus.jpg.jpg", bio: "An Early Jurassic predator featuring two spectacular cranial crests." 
    },
    { 
        id: 11, name: "Brachiosaurus", era: "Jurassic", diet: "Herbivore", dietIcon: "🌿", ovr: 80, rarity: "rare", level: 1, region: "Africa", city: "Tanzania", mapX: 55, mapY: 60, stats: { pac: 20, pwr: 60, def: 85, siz: 99, iq: 50, agi: 10 }, 
        statReasons: { pac: "Its colossal weight and unique skeletal structure restricted it to a very slow, majestic walking speed.", pwr: "Could generate immense crushing force simply by stomping its massive, pillar-like legs on the ground.", def: "Its towering height placed its vital organs well out of reach of almost every Jurassic predator.", siz: "A true titan of the prehistoric world, weighing up to 40 tons and standing taller than a four-story building.", iq: "Possessed standard herd intelligence, following ancient migration routes to find fresh feeding grounds.", agi: "Almost entirely immobile in terms of rapid pivoting or dodging, relying solely on its size for survival." }, 
        funFact: "Unlike almost every other dinosaur, its front legs were significantly longer than its back legs, giving it a giraffe-like posture to reach the highest treetops!", img: "images/brachiosaurus.jpg.jpg", bio: "A towering, graceful giant with incredibly long forelimbs." 
    },
    { 
        id: 12, name: "Woolly Mammoth", era: "Ice Age", diet: "Herbivore", dietIcon: "🌿", ovr: 92, rarity: "legendary", level: 1, region: "Asia", city: "Siberia, Russia", mapX: 75, mapY: 15, stats: { pac: 45, pwr: 90, def: 92, siz: 96, iq: 75, agi: 40 }, 
        statReasons: { pac: "Built to conserve energy in freezing climates, it moved at a slow, steady trek across the snowy tundra.", pwr: "Wielded massive, highly curved tusks that were used to clear deep snow, battle rivals, and crush threatening predators.", def: "Covered in incredibly thick, shaggy fur and a deep layer of insulating fat, making it heavily resistant to both cold and physical attacks.", siz: "A prehistoric giant standing over 11 feet tall at the shoulder and weighing a staggering 6 tons.", iq: "Highly intelligent matriarchal animals, capable of deep emotional bonds, memory retention, and complex social structures.", agi: "Its heavy bulk and padded feet were built for traction on ice, not for sharp turning or dodging." }, 
        funFact: "A small population of Woolly Mammoths survived on an isolated island until about 4,000 years ago—meaning they were still alive while the Pyramids of Giza were being built!", img: "images/mammoth.jpg.jpg", bio: "An iconic, heavily furred Ice Age giant equipped with massive tusks." 
    },
    { 
        id: 13, name: "Smilodon", era: "Ice Age", diet: "Carnivore", dietIcon: "🥩", ovr: 88, rarity: "epic", level: 1, region: "North America", city: "Los Angeles, USA", mapX: 21, mapY: 35, stats: { pac: 80, pwr: 91, def: 65, siz: 60, iq: 80, agi: 85 }, 
        statReasons: { pac: "Built more like a bear than a modern cat, it traded top sprinting speed for explosive, short-range ambush acceleration.", pwr: "Its immensely powerful front limbs were designed to wrestle and pin massive megafauna to the ground before delivering a fatal bite.", def: "While robust and muscular, it lacked true armor and could be severely injured if a hunt went wrong.", siz: "Slightly shorter than a modern lion, but significantly heavier and far more muscular.", iq: "Believed to have been highly social pack hunters, coordinating attacks to take down massive prey like young mammoths.", agi: "An expert grappler, capable of twisting and wrestling with large animals to expose their vulnerable necks." }, 
        funFact: "Its famous saber-teeth could grow up to 11 inches long! However, they were surprisingly fragile, so the Smilodon had to pin its prey down completely before biting.", img: "images/smilodon.jpg.jpg", bio: "The legendary, heavily muscled saber-toothed cat of the Pleistocene." 
    },
    { 
        id: 14, name: "Megalodon", era: "Cenozoic", diet: "Carnivore", dietIcon: "🥩", ovr: 98, rarity: "legendary", level: 1, region: "South America", city: "Coast of Peru", mapX: 35, mapY: 65, stats: { pac: 85, pwr: 99, def: 75, siz: 98, iq: 70, agi: 80 }, 
        statReasons: { pac: "Its streamlined, torpedo-like body allowed it to cruise open oceans and launch terrifyingly fast ambushes from the deep.", pwr: "Generated the most powerful bite force in vertebrate history, capable of instantly crushing the ribcages of large whales.", def: "Its thick dermal denticles (shark skin) and massive cartilaginous skeleton absorbed massive amounts of physical trauma.", siz: "The undisputed largest shark to ever exist, reaching estimated lengths of up to 50 feet.", iq: "Possessed highly tuned apex marine predator instincts, perfectly calculating angles of attack to disable a whale's fins.", agi: "Its massive tail flukes generated incredible thrust, allowing for rapid, explosive lunges despite its monumental size." }, 
        funFact: "Megalodons were so unimaginably massive that their jaws could open wide enough to easily swallow two adult humans standing side-by-side!", img: "images/megalodon.jpg.jpg", bio: "The ultimate prehistoric marine apex predator and largest shark in Earth's history." 
    },
    { 
        id: 15, name: "Ankylosaurus", era: "Cretaceous", diet: "Herbivore", dietIcon: "🌿", ovr: 89, rarity: "epic", level: 1, region: "North America", city: "Montana, USA", mapX: 24, mapY: 29, stats: { pac: 35, pwr: 88, def: 99, siz: 75, iq: 50, agi: 25 }, 
        statReasons: { pac: "Its low, squat, and incredibly heavy stance made it one of the slowest moving dinosaurs of its era.", pwr: "Equipped with a devastating club made of fused vertebrae at the end of its tail, capable of shattering a T-Rex's leg bone.", def: "Covered completely in thick, interlocking osteoderms (bone plates), acting as a biological suit of impenetrable armor.", siz: "A living, breathing fortress that weighed up to 8 tons, making it incredibly difficult to flip over.", iq: "Relied almost exclusively on hardwired defense reflexes rather than advanced reasoning to survive.", agi: "Extremely stiff and rigid, with a turning radius so wide that it heavily relied on swinging its tail to cover its blind spots." }, 
        funFact: "The Ankylosaurus was so heavily armored against predators that even its eyelids were protected by thick, bony plates!", img: "images/ankylosaurus.jpg.jpg", bio: "A heavily armored, walking fortress equipped with a devastating tail club." 
    },
    { 
        id: 16, name: "Carnotaurus", era: "Cretaceous", diet: "Carnivore", dietIcon: "🥩", ovr: 86, rarity: "epic", level: 1, region: "South America", city: "Chubut, Argentina", mapX: 30, mapY: 75, stats: { pac: 92, pwr: 85, def: 70, siz: 65, iq: 60, agi: 85 }, 
        statReasons: { pac: "With massive thigh muscles anchored to its tail, it was arguably the fastest large theropod, built for blistering straight-line speed.", pwr: "Its skull was uniquely short and deep, allowing it to perform incredibly fast, snapping bites to tear flesh from swift prey.", def: "Covered in a distinct layer of bumpy, thick scales that provided moderate protection during high-speed collisions.", siz: "A formidable medium-to-large predator, reaching roughly 25 feet in length.", iq: "An aggressive and instinct-driven hunter, utilizing raw speed rather than complex ambush tactics.", agi: "While it was incredibly fast in a straight line, its rigid spine made tight, rapid cornering at top speeds very difficult." }, 
        funFact: "Its name translates to 'Meat-Eating Bull,' and it had arms so incredibly tiny that they were even shorter than a T-Rex's!", img: "images/carnotaurus.jpg.jpg", bio: "A terrifyingly fast predator known for its distinct, bull-like horns." 
    },
    { 
        id: 17, name: "Parasaurolophus", era: "Cretaceous", diet: "Herbivore", dietIcon: "🌿", ovr: 81, rarity: "rare", level: 1, region: "North America", city: "Alberta, Canada", mapX: 24, mapY: 25, stats: { pac: 60, pwr: 50, def: 75, siz: 70, iq: 85, agi: 55 }, 
        statReasons: { pac: "Capable of transitioning to a bipedal stance to achieve moderate running speeds when fleeing from large carnivores.", pwr: "Lacking any natural weapons like horns or tail clubs, it was relatively defenseless in direct physical combat.", def: "Relied entirely on the safety of large numbers and early warning systems within the herd rather than physical armor.", siz: "A large and imposing hadrosaur (duck-billed dinosaur) that reached lengths of over 30 feet.", iq: "Highly intelligent and social; its head crest allowed for complex vocal communication to warn the herd of approaching danger.", agi: "Demonstrated standard mobility, able to navigate dense forests and plains efficiently while foraging." }, 
        funFact: "Its massive, hollow head crest acted like a built-in trombone, allowing the dinosaur to blast low-frequency calls that could be heard for miles!", img: "images/parasaurolophus.jpg.jpg", bio: "A large herd animal recognized by the magnificent, hollow crest sweeping back from its skull." 
    },
    { 
        id: 18, name: "Pachycephalosaurus", era: "Cretaceous", diet: "Herbivore", dietIcon: "🌿", ovr: 79, rarity: "rare", level: 1, region: "North America", city: "Wyoming, USA", mapX: 24, mapY: 31, stats: { pac: 65, pwr: 80, def: 85, siz: 50, iq: 55, agi: 60 }, 
        statReasons: { pac: "A nimble bipedal runner capable of maintaining solid speeds to escape larger, slower predators.", pwr: "Could deliver incredibly forceful, localized impacts by ramming opponents with the massive bone dome on its head.", def: "Its skull roof was built to absorb massive amounts of shock, keeping its brain perfectly safe during violent impacts.", siz: "A relatively compact dinosaur, measuring roughly 15 feet in length, making it harder to spot in dense brush.", iq: "Operated on aggressive territorial instincts, often engaging in fierce head-butting contests for dominance.", agi: "Its light frame and bipedal stance allowed it to quickly maneuver and pivot during close-quarters combat." }, 
        funFact: "The bone at the top of its domed skull was up to 10 inches thick, protecting its tiny brain from severe concussions during head-butting matches!", img: "images/pachycephalosaurus.jpg.jpg", bio: "A bipedal herbivore famous for its incredibly thick, domed skull roof." 
    },
    { 
        id: 19, name: "Archelon", era: "Cretaceous", diet: "Omnivore", dietIcon: "🌿🥩", ovr: 84, rarity: "rare", level: 1, region: "North America", city: "South Dakota, USA", mapX: 26, mapY: 31, stats: { pac: 50, pwr: 60, def: 96, siz: 85, iq: 45, agi: 60 }, 
        statReasons: { pac: "Used its massive, paddle-like flippers to achieve surprisingly steady cruising speeds through prehistoric oceans.", pwr: "Equipped with a powerful, sharply hooked beak perfectly evolved for crushing the hard shells of ancient squids and crustaceans.", def: "Its massive size and tough, leathery carapace made it an incredibly difficult meal for all but the largest marine predators.", siz: "The largest turtle ever documented, measuring over 13 feet from flipper to flipper.", iq: "Driven by ancient, hard-wired marine navigation instincts, allowing it to cross vast prehistoric seas to find nesting grounds.", agi: "While extremely cumbersome and helpless on a beach, it was a graceful and efficient glider underwater." }, 
        funFact: "Unlike modern sea turtles, the Archelon did not have a solid bone shell. Instead, it had a leathery carapace stretched over a framework of massive ribs!", img: "images/archelon.jpg.jpg", bio: "A colossal marine reptile and the largest sea turtle to ever exist." 
    },
    { 
        id: 20, name: "Compsognathus", era: "Jurassic", diet: "Carnivore", dietIcon: "🥩", ovr: 68, rarity: "common", level: 1, region: "Europe", city: "Bavaria, Germany", mapX: 49, mapY: 28, stats: { pac: 88, pwr: 20, def: 15, siz: 10, iq: 60, agi: 95 }, 
        statReasons: { pac: "An incredibly fast and darting runner, relying on absolute speed to catch agile insects and escape practically every other dinosaur.", pwr: "Lacked any real offensive power, equipped only with tiny teeth meant for snapping up bugs and small lizards.", def: "Possessed an extremely fragile, hollow-boned skeleton that offered absolutely zero protection against attacks.", siz: "One of the smallest known dinosaurs, barely reaching the size of a modern chicken.", iq: "An opportunistic scavenger with highly reactive senses, constantly calculating the quickest escape routes.", agi: "Its tiny size and ultra-lightweight frame allowed it to perform split-second dodges and navigate through thick, tangled underbrush." }, 
        funFact: "For a very long time, this was considered the absolute smallest dinosaur ever discovered, and one famous fossil even preserved an entire lizard it had swallowed whole!", img: "images/compsognathus.jpg.jpg", bio: "A tiny, lightning-fast theropod that hunted insects in the Jurassic undergrowth." 
    },
    { 
        id: 21, name: "Oviraptor", era: "Cretaceous", diet: "Omnivore", dietIcon: "🌿🥩", ovr: 74, rarity: "common", level: 1, region: "Asia", city: "Gobi Desert, Mongolia", mapX: 72, mapY: 32, stats: { pac: 88, pwr: 46, def: 38, siz: 42, iq: 78, agi: 86 }, 
        statReasons: { 
            pac: "Equipped with elongated, slender hind legs and an avian build, it could sprint at high speeds across arid desert dunes to escape larger theropods.", 
            pwr: "Its toothless, parrot-like keratinous beak was powered by robust jaw musculature capable of delivering intense shearing force to crack hard shells, mollusks, and tough desert seeds.", 
            def: "Its light, hollow-boned frame lacked armor, relying on camouflage, nest defense vigilance, and quick evasive maneuvers rather than physical resistance.", 
            siz: "A compact, feathered theropod measuring roughly 5 to 6 feet long and weighing around 75 to 80 pounds.", 
            iq: "Demonstrated advanced behavioral complexity, displaying cooperative nesting, brooding over egg clutches to regulate temperature, and maternal site protection.", 
            agi: "A stiffened, feathered tail acted as an agile counterweight, allowing sharp high-speed directional pivots while navigating rocky scrubland." 
        }, 
        funFact: "Oviraptor's name literally translates to 'Egg Thief' because its first fossil was found over a clutch of eggs assumed to belong to Protoceratops; decades later, embryonic analysis proved the eggs were its own, revealing it was a caring mother protecting her nest!", 
        img: "images/oviraptor.jpg.jpg", 
        bio: "A crested, bird-like omnivore of the Cretaceous equipped with a deep crushing beak and elaborate brooding instincts." 
    },
    { 
        id: 22, name: "Pteranodon", era: "Cretaceous", diet: "Carnivore", dietIcon: "🥩", ovr: 71, rarity: "common", level: 1, region: "North America", city: "Kansas, USA", mapX: 26, mapY: 33, stats: { pac: 92, pwr: 35, def: 20, siz: 45, iq: 50, agi: 88 }, 
        statReasons: { pac: "A master of the skies, capable of catching powerful ocean updrafts to achieve high-speed, sustained gliding flight.", pwr: "Equipped with a sharp, toothless beak designed for precision fish-snatching, but lacking the jaw strength to fight other large creatures.", def: "Its bones were incredibly thin and hollow to allow for flight, making it highly susceptible to fatal injuries from any physical strike.", siz: "Boasted a terrifying 20-foot wingspan, yet weighed very little, giving it an intimidating but fragile physical presence.", iq: "Operated on keen visual instincts, scanning the ocean surface from high altitudes to perfectly time its dives.", agi: "Incredibly graceful and maneuverable while airborne, but slow, awkward, and vulnerable when forced to walk on land." }, 
        funFact: "Despite often being grouped with them in movies and pop culture, the Pteranodon was a 'flying reptile' and not technically a dinosaur at all!", img: "images/pteranodon.jpg.jpg", bio: "A famous flying reptile with a massive wingspan and a distinct aerodynamic head crest." 
    },
    { 
        id: 23, name: "Troodon", era: "Cretaceous", diet: "Carnivore", dietIcon: "🥩", ovr: 76, rarity: "common", level: 1, region: "North America", city: "Montana, USA", mapX: 24, mapY: 29, stats: { pac: 90, pwr: 42, def: 30, siz: 35, iq: 99, agi: 94 }, 
        statReasons: { 
            pac: "Its exceptionally long metatarsal bones provided large strides, making it an explosive sprinter capable of running down small mammals and juvenile reptiles.", 
            pwr: "Armed with sharp, recurved teeth and small sickle foot claws specialized for small game.", 
            def: "Fragile, hollow-boned build required evading combat with larger predators entirely.", 
            siz: "Small bipedal hunter standing around 3 feet tall and weighing about 110 pounds.", 
            iq: "Possessed the highest brain-to-body mass ratio of any known non-avian dinosaur.", 
            agi: "Exceptional nocturnal reflexes and balance aided by large stereoscopic eyes." 
        }, 
        funFact: "Troodon is widely considered the smartest non-avian dinosaur, with large, forward-facing eyes giving it true binocular night vision.", 
        img: "images/troodon.jpg.jpg", 
        bio: "A razor-smart nocturnal hunter possessing the highest intelligence of the dinosaur kingdom." 
    },
    { 
        id: 24, name: "Therizinosaurus", era: "Cretaceous", diet: "Herbivore", dietIcon: "🌿", ovr: 94, rarity: "legendary", level: 1, region: "Asia", city: "Nemegt Basin, Mongolia", mapX: 72, mapY: 32, stats: { pac: 42, pwr: 96, def: 90, siz: 94, iq: 60, agi: 48 }, 
        statReasons: { 
            pac: "A broad, pot-bellied torso and stout columnar hind legs supported massive tonnage, restricting it to a slow, methodical ground pace.", 
            pwr: "Brandished immense 3.3-foot (1-meter) scythe-like claws operated by enormous pectoral and arm muscles, capable of sweeping with lethal defensive power.", 
            def: "Its colossal bulk, shaggy plumage, and towering reach created an intimidating deterrent that even top apex predators like Tarbosaurus avoided confronting directly.", 
            siz: "A titan among therizinosaurs, stretching up to 33 feet in length, standing over 16 feet tall, and weighing more than 5 tons.", 
            iq: "Relied on routine herd foraging intelligence, territory awareness, and vocal communication to feed on high foliage in river basins.", 
            agi: "Bulky, pot-bellied profile limited sudden evasive maneuvers on the open plains." 
        }, 
        funFact: "Therizinosaurus holds the world record for the longest claws of any known animal in Earth's history—measuring over 3.3 feet (1 meter) along the outer curve! Despite looking like a monster with blades for fingers, it was a gentle herbivore using them to pull leafy branches to its beak.", 
        img: "images/therizinosaurus.jpg.jpg", 
        bio: "A gargantuan herbivore equipped with towering stature and the longest, most formidable scythe-claws in Earth's history." 
    }
];

const mythicReward = { 
    id: 999, name: "Indominus Prototype", era: "Unknown", diet: "Carnivore", dietIcon: "🥩", ovr: 99, rarity: "mythic", level: 1, region: "Unknown", city: "Secret Lab", mapX: 0, mapY: 0, 
    stats: { pac: 95, pwr: 99, def: 90, siz: 95, iq: 99, agi: 95 }, 
    statReasons: { 
        pac: "Engineered with an accelerated metabolism, allowing a creature of its massive size to reach terrifying speeds.", 
        pwr: "Its DNA was spliced to maximize bite force and muscular density, capable of tearing through modern steel enclosures.", 
        def: "Features osteoderms integrated directly into its genetic code, rendering it highly resistant to physical trauma.", 
        siz: "Designed to be larger, heavier, and more imposing than a fully mature Tyrannosaurus Rex.", 
        iq: "Its most dangerous trait; possesses hyper-advanced cognition, capable of memory retention, problem-solving, and deceiving its prey.", 
        agi: "Its long, counterbalancing tail and elongated forelimbs allow it to grapple and pivot in ways a normal apex predator could not." 
    }, 
    funFact: "Engineered in secret genetic labs by combining the DNA of Tyrannosaurus Rex, Velociraptor, Carnotaurus, Giganotosaurus, and modern cuttlefish.", 
    img: "images/indominus.jpg.jpg", 
    bio: "A highly classified, genetically engineered nightmare designed for maximum lethality." 
};

// Extraction Value Calculator
function getExtractionValue(rarity) {
    switch (rarity) {
        case 'common': return 100;
        case 'rare': return 250;
        case 'epic': return 650;
        case 'legendary': return 1500;
        case 'mythic': return 3500;
        default: return 250;
    }
}

// Full 50 MCQ Prehistoric Trivia Database
const triviaDatabase = [
    { q: "What does the word 'Dinosaur' translate to?", opts: ["Terrible Lizard", "Giant Bird", "Ancient King", "Scaled Monster"], ans: 0 },
    { q: "During which era did dinosaurs rule the Earth?", opts: ["Paleozoic", "Mesozoic", "Cenozoic", "Precambrian"], ans: 1 },
    { q: "Which of these is NOT a period in the Mesozoic Era?", opts: ["Triassic", "Jurassic", "Cretaceous", "Carboniferous"], ans: 3 },
    { q: "What is the study of fossils called?", opts: ["Archaeology", "Paleontology", "Geology", "Biology"], ans: 1 },
    { q: "Which dinosaur had a distinctive bone club on its tail?", opts: ["Ankylosaurus", "Stegosaurus", "Triceratops", "Spinosaurus"], ans: 0 },
    { q: "Which dinosaur is known to have the strongest bite force?", opts: ["Allosaurus", "Spinosaurus", "Tyrannosaurus Rex", "Velociraptor"], ans: 2 },
    { q: "What modern animal is the closest living relative to the Tyrannosaurus Rex?", opts: ["Crocodile", "Chicken", "Komodo Dragon", "Rhinoceros"], ans: 1 },
    { q: "What did herbivores like the Brachiosaurus primarily eat?", opts: ["Insects", "Fish", "Plants", "Small Mammals"], ans: 2 },
    { q: "Which prehistoric predator is known as the largest shark to ever live?", opts: ["Mosasaurus", "Liopleurodon", "Megalodon", "Dunkleosteus"], ans: 2 },
    { q: "What feature is the Stegosaurus most famous for?", opts: ["Three horns", "Long neck", "Plates on its back", "Sickle claws"], ans: 2 },
    { q: "What feature made Parasaurolophus unique?", opts: ["A clubbed tail", "A long hollow head crest", "Saber teeth", "Feathers"], ans: 1 },
    { q: "How many horns did a Triceratops have?", opts: ["One", "Two", "Three", "Four"], ans: 2 },
    { q: "Which of the following was NOT a dinosaur?", opts: ["Pterodactyl", "Velociraptor", "Triceratops", "Brachiosaurus"], ans: 0 },
    { q: "What does 'Tyrannosaurus Rex' mean?", opts: ["King of the Dinosaurs", "Tyrant Lizard King", "Fast Thief", "Giant Tooth"], ans: 1 },
    { q: "Where were the first dinosaur fossils discovered?", opts: ["North America", "Africa", "England", "China"], ans: 2 },
    { q: "Which dinosaur name means 'Fast Thief'?", opts: ["Oviraptor", "Velociraptor", "Gallimimus", "Compsognathus"], ans: 1 },
    { q: "What is the largest known carnivorous dinosaur?", opts: ["T-Rex", "Giganotosaurus", "Spinosaurus", "Allosaurus"], ans: 2 },
    { q: "What was the supercontinent called when dinosaurs first appeared?", opts: ["Gondwana", "Laurasia", "Pangea", "Atlantis"], ans: 2 },
    { q: "Which modern continent has yielded the most dinosaur fossils?", opts: ["North America", "Asia", "Europe", "Antarctica"], ans: 0 },
    { q: "What is a Coprolite?", opts: ["A dinosaur footprint", "Fossilized dinosaur poop", "A rare amber fossil", "A type of dinosaur egg"], ans: 1 },
    { q: "What caused the extinction of the non-avian dinosaurs?", opts: ["Ice Age", "Asteroid Impact", "Volcanic Eruption", "Disease"], ans: 1 },
    { q: "Where did the asteroid that killed the dinosaurs strike?", opts: ["Sahara Desert", "Chicxulub, Mexico", "Siberia", "Outback, Australia"], ans: 1 },
    { q: "Which dinosaur had a dome-shaped, incredibly thick skull?", opts: ["Pachycephalosaurus", "Ankylosaurus", "Parasaurolophus", "Triceratops"], ans: 0 },
    { q: "What color were dinosaurs?", opts: ["All Green", "All Brown", "Unknown, but likely varied", "Black and White"], ans: 2 },
    { q: "Which famous fossil links dinosaurs to modern birds?", opts: ["Archaeopteryx", "Dimetrodon", "Pteranodon", "Megalodon"], ans: 0 },
    { q: "What did the Woolly Mammoth use its massive tusks for?", opts: ["Hunting", "Clearing snow to find food", "Swimming", "Climbing"], ans: 1 },
    { q: "Which predator is commonly called the 'Saber-toothed Tiger'?", opts: ["Dire Wolf", "Smilodon", "Megalania", "Cave Bear"], ans: 1 },
    { q: "What type of animal was the Archelon?", opts: ["Shark", "Whale", "Sea Turtle", "Crocodile"], ans: 2 },
    { q: "How many legs did dinosaurs walk on?", opts: ["Only two", "Only four", "Two or four, depending on the species", "Six"], ans: 2 },
    { q: "Which dinosaur had the longest neck?", opts: ["T-Rex", "Stegosaurus", "Diplodocus", "Velociraptor"], ans: 2 },
    { q: "Which prehistoric fish had self-sharpening bone plates instead of teeth?", opts: ["Megalodon", "Xiphactinus", "Dunkleosteus", "Coelacanth"], ans: 2 },
    { q: "What did Spinosaurus primarily eat?", opts: ["Other large dinosaurs", "Fish", "Plants", "Insects"], ans: 1 },
    { q: "How long ago did the dinosaurs go extinct?", opts: ["1 Million years ago", "65 Million years ago", "200 Million years ago", "10,000 years ago"], ans: 1 },
    { q: "Which of these is a famous Ice Age herbivore?", opts: ["Megalodon", "Smilodon", "Megatherium (Giant Sloth)", "Spinosaurus"], ans: 2 },
    { q: "What is the smallest dinosaur currently known?", opts: ["Compsognathus", "Microraptor", "Bee Hummingbird", "Velociraptor"], ans: 2 }, 
    { q: "Did humans and dinosaurs ever coexist?", opts: ["Yes", "No", "Only in the Ice Age", "Only in prehistoric caves"], ans: 1 },
    { q: "Which era came directly after the dinosaurs went extinct?", opts: ["Paleozoic", "Cenozoic", "Mesozoic", "Jurassic"], ans: 1 },
    { q: "What substance are dinosaur bones made of today?", opts: ["Original Bone", "Cartilage", "Rock/Minerals", "Ice"], ans: 2 },
    { q: "Which period came first?", opts: ["Triassic", "Jurassic", "Cretaceous", "Permian"], ans: 0 }, 
    { q: "What is amber?", opts: ["Fossilized bone", "Fossilized tree resin", "Volcanic glass", "Dinosaur egg shell"], ans: 1 },
    { q: "Which dinosaur featured distinctive 'bull horns' above its eyes?", opts: ["Triceratops", "Carnotaurus", "Allosaurus", "Stegosaurus"], ans: 1 },
    { q: "What was the main purpose of the Stegosaurus' plates?", opts: ["Flying", "Defense or thermoregulation", "Digging", "Swimming"], ans: 1 },
    { q: "Which dinosaur was the size of a chicken and hunted bugs?", opts: ["T-Rex", "Brachiosaurus", "Compsognathus", "Ankylosaurus"], ans: 2 },
    { q: "What was the primary weapon of a Velociraptor?", opts: ["Tail whip", "Sickle claw on foot", "Horns", "Venom"], ans: 1 },
    { q: "Which marine reptile had a famously long neck?", opts: ["Plesiosaur", "Ichthyosaur", "Mosasaur", "Megalodon"], ans: 0 },
    { q: "What were dinosaur feathers likely originally used for?", opts: ["Flight", "Insulation and display", "Swimming", "Digging"], ans: 1 },
    { q: "What is the literal translation of 'Mesozoic'?", opts: ["Middle Life", "Ancient Life", "New Life", "Reptile Age"], ans: 0 },
    { q: "Which dinosaur is the state fossil of Colorado?", opts: ["Stegosaurus", "Triceratops", "Allosaurus", "T-Rex"], ans: 0 },
    { q: "Which continent has NO dinosaur fossils?", opts: ["Antarctica", "Africa", "Australia", "None, they are on all continents"], ans: 3 },
    { q: "Which ice age predator hunted in massive packs?", opts: ["Dire Wolf", "Smilodon", "Cave Bear", "Short-faced Bear"], ans: 0 }
];

let currentTriviaSet = []; 
let currentTriviaIndex = 0; 
let currentTriviaScore = 0;

// DOM Elements
const cardGrid = document.getElementById('card-grid');
const tabs = document.querySelectorAll('#nav-tabs li');
const views = ['home-view', 'about-view', 'collection-view', 'arena-view', 'daily-view', 'quests-view', 'achievements-view', 'map-view', 'dinoweb-view', 'facility-view'];
const dinoFilter = document.getElementById('dino-filter'); 
const modal = document.getElementById('dino-modal');
const modalDetails = document.getElementById('modal-details');
const triviaModal = document.getElementById('trivia-modal');
const facilityModal = document.getElementById('facility-modal');
const facilityDinoGrid = document.getElementById('facility-dino-grid');
const loginBtn = document.getElementById('nav-login-btn');
const logoutBtn = document.getElementById('nav-logout-btn');
const loginModal = document.getElementById('login-modal');
const closeLoginBtn = document.querySelector('.close-login-btn');
const authForm = document.getElementById('auth-form');
const usernameInput = document.getElementById('username-input');
const passwordInput = document.getElementById('password-input');
const authToggleText = document.getElementById('auth-toggle-text');
const modalTitle = document.getElementById('modal-title');
const submitLoginBtn = document.getElementById('submit-login-btn');
const homeRegisterBtn = document.getElementById('home-register-btn');
let isRegisterMode = false;

// --- ARCHIVE FACILITY STATE ---
let facilityState = {
    herbivore: { unlocked: true, level: 1, slots: [null], storedCoins: 0, cost: 0, upgCost: [1000, 2500] },
    carnivore: { unlocked: false, level: 1, slots: [null], storedCoins: 0, cost: 2500, upgCost: [3000, 5000] },
    genetics: { unlocked: false, level: 1, slots: [null], storedPermits: 0.0, cost: 5000, upgCost: [5000, 10000] }
};
let activeFacilityKey = null;
let activeSlotIndex = null;

function loadUserData() {
    if (currentUser) {
        let savedCoins = localStorage.getItem('dinoCoins_' + currentUser);
        let savedPermits = localStorage.getItem('dinoPermits_' + currentUser);
        let savedCollection = localStorage.getItem('dinoCollection_' + currentUser);
        let savedFacility = localStorage.getItem('dinoFacility_' + currentUser);
        
        let q1C = localStorage.getItem('dinoQ1C_' + currentUser); let q2C = localStorage.getItem('dinoQ2C_' + currentUser);
        let q3C = localStorage.getItem('dinoQ3C_' + currentUser); let q4C = localStorage.getItem('dinoQ4C_' + currentUser);
        let q5C = localStorage.getItem('dinoQ5C_' + currentUser);

        claimedQ1 = localStorage.getItem('dinoQ1Cl_' + currentUser) === 'true'; claimedQ2 = localStorage.getItem('dinoQ2Cl_' + currentUser) === 'true';
        claimedQ3 = localStorage.getItem('dinoQ3Cl_' + currentUser) === 'true'; claimedQ4 = localStorage.getItem('dinoQ4Cl_' + currentUser) === 'true';
        claimedQ5 = localStorage.getItem('dinoQ5Cl_' + currentUser) === 'true';
        
        claimedM1 = localStorage.getItem('dinoM1_' + currentUser) === 'true';
        claimedM2 = localStorage.getItem('dinoM2_' + currentUser) === 'true';

        // Load facility tutorial state
        facilityTutorialDone = localStorage.getItem('dinoFacTut_' + currentUser) === 'true';
        
        let savedDailyBattles = localStorage.getItem('dinoDailyBattles_' + currentUser);
        dailyBattlesPlayed = savedDailyBattles !== null ? parseInt(savedDailyBattles) : 0;

        coins = savedCoins !== null ? parseInt(savedCoins) : 2000;
        permits = savedPermits !== null ? parseInt(savedPermits) : 3;
        
        questBattlesCount = q1C !== null ? parseInt(q1C) : 0; questExcavatesCount = q2C !== null ? parseInt(q2C) : 0;
        questWinsCount = q3C !== null ? parseInt(q3C) : 0; questMapCount = q4C !== null ? parseInt(q4C) : 0;
        questCommonCount = q5C !== null ? parseInt(q5C) : 0;

        if (savedCollection) {
            userCollection = JSON.parse(savedCollection);
            userCollection = userCollection.map(dino => {
                if (dino.id === 21 && dino.name === "Gallimimus") {
                    let ovi = masterCatalog.find(m => m.id === 21);
                    return ovi ? JSON.parse(JSON.stringify(ovi)) : dino;
                }
                return dino;
            });
            userCollection.forEach(dino => {
                if (dino.id === 999) { dino.img = mythicReward.img; } 
                else { let updatedDino = masterCatalog.find(m => m.id === dino.id); if (updatedDino) dino.img = updatedDino.img; }
            });
        } else { userCollection = [masterCatalog[0], masterCatalog[1], masterCatalog[2]]; }

        if (savedFacility) {
            facilityState = JSON.parse(savedFacility);
        } else {
            facilityState = {
                herbivore: { unlocked: true, level: 1, slots: [null], storedCoins: 0, cost: 0, upgCost: [1000, 2500] },
                carnivore: { unlocked: false, level: 1, slots: [null], storedCoins: 0, cost: 2500, upgCost: [3000, 5000] },
                genetics: { unlocked: false, level: 1, slots: [null], storedPermits: 0.0, cost: 5000, upgCost: [5000, 10000] }
            };
        }
        
        renderDinoWebList();
        checkDailyReset();
    } else {
        coins = 0; permits = 0; userCollection = []; facilityTutorialDone = false; dailyBattlesPlayed = 0;
    }
}

function checkDailyReset() {
    if (!currentUser) return;
    let today = new Date().toDateString();
    let lastQuestReset = localStorage.getItem('dinoLastQuestReset_' + currentUser);
    
    if (lastQuestReset !== today) {
        questBattlesCount = 0; questExcavatesCount = 0; questWinsCount = 0; questMapCount = 0; questCommonCount = 0;
        claimedQ1 = false; claimedQ2 = false; claimedQ3 = false; claimedQ4 = false; claimedQ5 = false;
        dailyBattlesPlayed = 0;
        
        localStorage.setItem('dinoLastQuestReset_' + currentUser, today);
        saveUserData();
        updateQuestNotificationDot();
    }
}

function saveUserData() {
    if (currentUser) {
        localStorage.setItem('dinoCoins_' + currentUser, coins); localStorage.setItem('dinoPermits_' + currentUser, permits);
        localStorage.setItem('dinoCollection_' + currentUser, JSON.stringify(userCollection));
        localStorage.setItem('dinoFacility_' + currentUser, JSON.stringify(facilityState));
        localStorage.setItem('dinoQ1C_' + currentUser, questBattlesCount); localStorage.setItem('dinoQ2C_' + currentUser, questExcavatesCount);
        localStorage.setItem('dinoQ3C_' + currentUser, questWinsCount); localStorage.setItem('dinoQ4C_' + currentUser, questMapCount);
        localStorage.setItem('dinoQ5C_' + currentUser, questCommonCount);
        localStorage.setItem('dinoQ1Cl_' + currentUser, claimedQ1); localStorage.setItem('dinoQ2Cl_' + currentUser, claimedQ2);
        localStorage.setItem('dinoQ3Cl_' + currentUser, claimedQ3); localStorage.setItem('dinoQ4Cl_' + currentUser, claimedQ4);
        localStorage.setItem('dinoQ5Cl_' + currentUser, claimedQ5);
        localStorage.setItem('dinoM1_' + currentUser, claimedM1); localStorage.setItem('dinoM2_' + currentUser, claimedM2);
        localStorage.setItem('dinoFacTut_' + currentUser, facilityTutorialDone);
        localStorage.setItem('dinoDailyBattles_' + currentUser, dailyBattlesPlayed);
    }
}

// --- ACTIVE TYCOON ENGINE ---
setInterval(() => {
    if (!currentUser) return;
    let updateNeeded = false;
    
    if (facilityState.herbivore.unlocked) {
        let hRate = 0;
        facilityState.herbivore.slots.forEach(dinoId => {
            if (dinoId) { let dino = userCollection.find(d => d.id === dinoId); if (dino) hRate += getBaseRate(dino.rarity) * (1 + (dino.level * 0.5)); }
        });
        if (hRate > 0) { facilityState.herbivore.storedCoins += hRate; updateNeeded = true; }
    }
    if (facilityState.carnivore.unlocked) {
        let cRate = 0;
        facilityState.carnivore.slots.forEach(dinoId => {
            if (dinoId) { let dino = userCollection.find(d => d.id === dinoId); if (dino) cRate += (getBaseRate(dino.rarity) * 1.5) * (1 + (dino.level * 0.5)); }
        });
        if (cRate > 0) { facilityState.carnivore.storedCoins += cRate; updateNeeded = true; }
    }
    if (facilityState.genetics.unlocked) {
        let gRate = 0;
        facilityState.genetics.slots.forEach(dinoId => {
            if (dinoId) {
                let dino = userCollection.find(d => d.id === dinoId); let rRate = 0;
                if (dino.rarity === 'mythic') rRate = 0.0005; else if (dino.rarity === 'legendary') rRate = 0.00025; else if (dino.rarity === 'epic') rRate = 0.0001;
                if (dino) gRate += rRate * (1 + (dino.level * 0.5));
            }
        });
        if (gRate > 0) { facilityState.genetics.storedPermits += gRate; updateNeeded = true; }
    }

    if (updateNeeded && !document.getElementById('facility-view').classList.contains('hidden')) {
        ['herbivore', 'carnivore', 'genetics'].forEach(key => {
            let el = document.getElementById(`fac-amt-${key}`);
            if (el) {
                let state = facilityState[key];
                let amt = key === 'genetics' ? Math.floor(state.storedPermits) : Math.floor(state.storedCoins);
                let sym = key === 'genetics' ? '🎫' : '🪙';
                el.innerText = `${amt} ${sym}`;
            }
            let btn = document.getElementById(`fac-btn-${key}`);
            if (btn) {
                let state = facilityState[key]; let amt = key === 'genetics' ? Math.floor(state.storedPermits) : Math.floor(state.storedCoins);
                if (amt > 0) {
                    btn.style.background = 'var(--accent-green)'; btn.style.cursor = 'pointer';
                    btn.innerText = 'COLLECT ' + (key === 'genetics' ? 'PERMITS' : 'COINS');
                    btn.onclick = () => collectFacility(key);
                }
            }
        });
    }
}, 1000);

function getBaseRate(rarity) {
    switch(rarity) { case 'common': return 0.05; case 'rare': return 0.15; case 'epic': return 0.5; case 'legendary': return 1.5; case 'mythic': return 3.0; default: return 0; }
}

function renderFacility() {
    const grid = document.getElementById('facility-grid'); if (!grid) return; grid.innerHTML = '';
    const configs = [
        { key: 'herbivore', title: '🌿 Herbivore Haven', desc: 'Accepts Herbivores & Omnivores. Generates coins steadily.', res: 'Coins', symbol: '🪙' },
        { key: 'carnivore', title: '🥩 Carnivore Compound', desc: 'Accepts Carnivores & Omnivores. Generates coins rapidly.', res: 'Coins', symbol: '🪙' },
        { key: 'genetics', title: '🧬 Genetics Lab', desc: 'Accepts Epic+ only. Generates Permits over time.', res: 'Permits', symbol: '🎫' }
    ];

    configs.forEach(conf => {
        let state = facilityState[conf.key]; let card = document.createElement('div'); card.className = `facility-card ${state.unlocked ? 'unlocked' : ''}`;
        if (!state.unlocked) {
            card.innerHTML = `<div class="facility-header"><h3 style="color: #666;">${conf.title}</h3><p>LOCKED FACILITY</p></div><div style="flex-grow: 1; display: flex; align-items: center; justify-content: center; color: #aaa; text-align: center;">${conf.desc}</div><div class="facility-actions"><button class="fac-btn btn-unlock" onclick="unlockFacility('${conf.key}')">Unlock: ${state.cost} 🪙</button></div>`;
        } else {
            let slotsHTML = '';
            for (let i = 0; i < 3; i++) {
                if (i < state.level) {
                    let dinoId = state.slots[i];
                    if (dinoId) { let dino = userCollection.find(d => d.id === dinoId); slotsHTML += `<div class="worker-slot filled" style="background-image: url('${dino.img}');" onclick="unslotDino('${conf.key}', ${i})"></div>`; } 
                    else { slotsHTML += `<div class="worker-slot" onclick="openSlotSelection('${conf.key}', ${i})"><span style="font-size: 2rem;">+</span></div>`; }
                } else { slotsHTML += `<div class="worker-slot locked">🔒</div>`; }
            }
            let amountToCollect = conf.key === 'genetics' ? Math.floor(state.storedPermits) : Math.floor(state.storedCoins);
            let upgradeBtn = state.level < 3 ? `<button class="fac-btn btn-upgrade" onclick="upgradeFacility('${conf.key}')">Upgrade Slot ${state.level + 1} (${state.upgCost[state.level-1]} 🪙)</button>` : `<button class="fac-btn btn-upgrade" style="opacity:0.5; cursor:not-allowed;">Max Level Reached</button>`;
            card.innerHTML = `<div class="facility-header"><h3 style="color: var(--ui-gold);">${conf.title}</h3><p>Level ${state.level}</p></div><div class="facility-stats"><span>Generated:</span><span id="fac-amt-${conf.key}" style="color: var(--ui-gold); font-weight: bold; font-size: 1.5rem;">${amountToCollect} ${conf.symbol}</span></div><div class="facility-slots">${slotsHTML}</div><div class="facility-actions">${amountToCollect > 0 ? `<button id="fac-btn-${conf.key}" class="fac-btn btn-collect" onclick="collectFacility('${conf.key}')">COLLECT ${conf.res.toUpperCase()}</button>` : `<button id="fac-btn-${conf.key}" class="fac-btn btn-collect" style="background:#333; cursor:not-allowed;">COLLECTING...</button>`}${upgradeBtn}</div>`;
        }
        grid.appendChild(card);
    });
}

window.unlockFacility = function(key) {
    if (coins >= facilityState[key].cost) { coins -= facilityState[key].cost; facilityState[key].unlocked = true; playSound('success'); saveUserData(); updateStatsUI(); renderFacility(); } 
    else { playSound('error'); alert("Not enough coins to unlock this facility!"); }
};
window.upgradeFacility = function(key) {
    let state = facilityState[key]; let cost = state.upgCost[state.level - 1];
    if (coins >= cost) { coins -= cost; state.level++; state.slots.push(null); playSound('success'); saveUserData(); updateStatsUI(); renderFacility(); } 
    else { playSound('error'); alert("Not enough coins to upgrade!"); }
};
window.collectFacility = function(key) {
    let state = facilityState[key];
    if (key === 'genetics') { let amount = Math.floor(state.storedPermits); if (amount > 0) { permits += amount; state.storedPermits -= amount; } } 
    else { let amount = Math.floor(state.storedCoins); if (amount > 0) { coins += amount; state.storedCoins -= amount; } }
    playSound('success'); saveUserData(); updateStatsUI(); renderFacility();
};
window.unslotDino = function(key, index) { facilityState[key].slots[index] = null; saveUserData(); renderFacility(); };

window.openSlotSelection = function(key, index) {
    activeFacilityKey = key; activeSlotIndex = index; let usedDinos = [];
    Object.values(facilityState).forEach(fac => { fac.slots.forEach(s => { if (s) usedDinos.push(s); }); });
    facilityDinoGrid.innerHTML = ''; let availableCount = 0;

    userCollection.forEach(dino => {
        if (usedDinos.includes(dino.id)) return; let valid = false;
        if (key === 'herbivore' && (dino.diet === 'Herbivore' || dino.diet === 'Omnivore')) valid = true;
        if (key === 'carnivore' && (dino.diet === 'Carnivore' || dino.diet === 'Omnivore')) valid = true;
        if (key === 'genetics' && (dino.rarity === 'epic' || dino.rarity === 'legendary' || dino.rarity === 'mythic')) valid = true;

        if (valid) {
            availableCount++; let dHTML = document.createElement('div'); dHTML.innerHTML = createCardHTML(dino, true);
            dHTML.querySelector('.card-wrapper').onclick = () => {
                facilityState[activeFacilityKey].slots[activeSlotIndex] = dino.id; playSound('click');
                saveUserData(); renderFacility(); facilityModal.classList.add('hidden');
            };
            facilityDinoGrid.appendChild(dHTML);
        }
    });
    if (availableCount === 0) facilityDinoGrid.innerHTML = `<p style="color:#ff6b6b; font-size: 1.5rem; width: 100%; text-align: center;">No compatible, unassigned dinosaurs available for this facility.</p>`;
    facilityModal.classList.remove('hidden');
};
document.querySelector('.close-facility-btn').addEventListener('click', () => { playSound('click'); facilityModal.classList.add('hidden'); });
document.getElementById('close-fac-tut-btn').addEventListener('click', () => { playSound('click'); document.getElementById('facility-tutorial-modal').classList.add('hidden'); facilityTutorialDone = true; saveUserData(); });

function getDailyStreakState() {
    let today = new Date().toDateString(); let yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1); let yStr = yesterday.toDateString();
    let lastClaim = localStorage.getItem('dinoLastClaim_' + currentUser); let currentDay = parseInt(localStorage.getItem('dinoStreakDay_' + currentUser) || '1');
    if (lastClaim === today) { return { ready: false, day: currentDay }; } else if (lastClaim === yStr) { let nextDay = currentDay + 1; if (nextDay > 7) nextDay = 1; return { ready: true, day: nextDay }; } else { return { ready: true, day: 1 }; }
}

function renderDailyRoad() {
    const wrapper = document.getElementById('daily-road-nodes'); if (!wrapper) return; wrapper.innerHTML = ''; let state = getDailyStreakState();
    const dailyRewardsMap = {
        1: { icon: "🪙", text: "150 Coins", action: () => { coins += 150; } }, 2: { icon: "🪙", text: "300 Coins", action: () => { coins += 300; } },
        3: { icon: "🪙", text: "500 Coins", action: () => { coins += 500; } }, 4: { icon: "🎫", text: "1 Permit", action: () => { permits += 1; } },
        5: { icon: "🪙", text: "750 Coins", action: () => { coins += 750; } }, 6: { icon: "🎫", text: "2 Permits", action: () => { permits += 2; } },
        7: { icon: "🪙", text: "1500 Coins", action: () => { coins += 1500; } }
    };
    for (let i = 1; i <= 7; i++) {
        let isClaimed = (i < state.day) || (!state.ready && i === state.day); let isActive = state.ready && (i === state.day); let isLocked = i > state.day;
        let div = document.createElement('div'); div.className = `reward-node ${isClaimed ? 'claimed' : ''} ${isActive ? 'active' : ''} ${isLocked ? 'locked' : ''}`;
        div.innerHTML = `<h4>DAY ${i}</h4><div class="icon">${dailyRewardsMap[i].icon}</div><div class="amt">${dailyRewardsMap[i].text}</div>`;
        if (isActive) {
            div.onclick = () => {
                dailyRewardsMap[i].action(); localStorage.setItem('dinoLastClaim_' + currentUser, new Date().toDateString()); localStorage.setItem('dinoStreakDay_' + currentUser, i);
                playSound('success'); saveUserData(); updateStatsUI(); renderDailyRoad();
            };
        }
        wrapper.appendChild(div);
    }
}

function renderDinoWebList(searchQuery = "") {
    const list = document.getElementById('dinoweb-list'); if (!list) return; list.innerHTML = '';
    if (searchQuery === "" || "prehistoric eras general info guide pangea gondwanaland".includes(searchQuery.toLowerCase())) {
        let generalLi = document.createElement('li'); generalLi.className = 'dinoweb-list-item'; generalLi.innerHTML = `<span>🌍</span> Prehistoric Eras Guide`;
        generalLi.onclick = () => { document.querySelectorAll('.dinoweb-list-item').forEach(el => el.classList.remove('active')); generalLi.classList.add('active'); loadErasArticle(); };
        list.appendChild(generalLi);
    }
    let sortedCatalog = [...masterCatalog, mythicReward].sort((a,b) => a.name.localeCompare(b.name));
    sortedCatalog.forEach(dino => {
        if (dino.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            let li = document.createElement('li'); li.className = 'dinoweb-list-item'; li.innerHTML = `<span>${dino.dietIcon}</span> ${dino.name}`;
            li.onclick = () => { document.querySelectorAll('.dinoweb-list-item').forEach(el => el.classList.remove('active')); li.classList.add('active'); loadDinoArticle(dino); };
            list.appendChild(li);
        }
    });
}

function loadErasArticle() {
    const content = document.getElementById('dinoweb-content'); if (!content) return;
    content.innerHTML = `
        <div class="article-header">
            <div><div class="article-title">Prehistoric Eras</div><div class="article-subtitle">A General Guide to Earth's History</div></div>
            <div style="font-size: 4rem; text-shadow: 2px 2px black;">🌍</div>
        </div>
        <div class="article-text" style="color: #ddd; font-size: 1.25rem; line-height: 1.8;">
            <p>The Jurassic Archive spans hundreds of millions of years, covering the rise and fall of the most spectacular creatures to ever inhabit our planet. Here is a brief overview of the major time periods represented in our database:</p>
            <h3 style="color:var(--rare); font-family:'Teko'; font-size:2.5rem; border-bottom: 1px solid #444; margin-top: 20px;">The Triassic Period (252 - 201 Million Years Ago)</h3>
            <p>Following the devastating Permian extinction, all of Earth's major landmasses were joined together into a single, colossal supercontinent known as <strong>Pangea</strong>. Because the land was entirely connected, early dinosaurs and other massive reptiles could migrate freely across the globe without oceans stopping them. The climate across Pangea was mostly hot and dry, with vast, brutal deserts extending across its interior. This harsh era marks the evolutionary dawn of the very first true dinosaurs.</p>
            <h3 style="color:var(--rare); font-family:'Teko'; font-size:2.5rem; border-bottom: 1px solid #444; margin-top: 20px;">The Jurassic Period (201 - 145 Million Years Ago)</h3>
            <p>During the Jurassic, the great supercontinent of Pangea finally began to tear apart, splitting into two enormous, separated landmasses: <strong>Laurasia</strong> in the north and <strong>Gondwanaland</strong> in the south. Gondwanaland was a massive southern supercontinent that contained what we now know as modern-day South America, Africa, Antarctica, Australia, and India. As these continents shifted, the global climate changed drastically, becoming incredibly lush, tropical, and humid. This abundance of plant life gave rise to the breathtaking, towering sauropods (like the Brachiosaurus and Diplodocus). As the herbivores grew to colossal sizes, apex predators—like the Allosaurus—evolved to hunt them.</p>
            <h3 style="color:var(--rare); font-family:'Teko'; font-size:2.5rem; border-bottom: 1px solid #444; margin-top: 20px;">The Cretaceous Period (145 - 66 Million Years Ago)</h3>
            <p>The continents continued to drift closer to their modern positions, and dinosaur diversity reached its absolute peak. The world saw the rise of heavily armored titans like Ankylosaurus, horned behemoths like Triceratops, and the ultimate apex predator: the Tyrannosaurus Rex. This legendary era came to an apocalyptic end when a 6-mile-wide asteroid struck the Earth, wiping out all non-avian dinosaurs.</p>
            <h3 style="color:var(--rare); font-family:'Teko'; font-size:2.5rem; border-bottom: 1px solid #444; margin-top: 20px;">The Cenozoic Era (66 Million Years Ago - Present)</h3>
            <p>Following the extinction of the dinosaurs, mammals emerged from the shadows to inherit the Earth. Over tens of millions of years, they evolved from small scavengers into incredible new forms. In the oceans, colossal marine predators like the Megalodon ruled supreme in warm, shallow seas.</p>
            <h3 style="color:var(--rare); font-family:'Teko'; font-size:2.5rem; border-bottom: 1px solid #444; margin-top: 20px;">The Ice Age (Pleistocene Epoch) (2.5 Million - 11,700 Years Ago)</h3>
            <p>A recent chapter of the Cenozoic Era characterized by massive, repeated glaciations. Huge ice sheets covered much of North America, Europe, and Asia. Animals evolved to survive extreme, freezing conditions—resulting in megafauna completely covered in thick fur, such as the Woolly Mammoth and the fearsome Smilodon (Saber-Toothed Tiger).</p>
        </div>
    `;
}

function loadDinoArticle(dino) {
    const content = document.getElementById('dinoweb-content'); if (!content) return;
    const isMythic = dino.id === 999;
    
    let extendedLore = `
        <p>The <strong>${dino.name}</strong> was a magnificent ${dino.diet.toLowerCase()} that roamed the Earth during the <strong>${dino.era}</strong> period. First discovered in <strong>${dino.city}, ${dino.region}</strong>, it has become one of the most studied creatures in the Jurassic Archive database.</p>
        <p>${dino.bio}</p>
        <div style="background: rgba(255, 202, 40, 0.1); border-left: 4px solid var(--ui-gold); padding: 15px; margin: 20px 0; border-radius: 0 10px 10px 0;">
            <h4 style="font-family:'Teko'; font-size:2rem; color:var(--ui-gold); margin-bottom: 5px; text-shadow: 1px 1px black;">💡 DID YOU KNOW?</h4>
            <p style="font-size: 1.2rem; color: white; line-height: 1.5;">${dino.funFact}</p>
        </div>
        <h3 style="color:var(--rare); font-family:'Teko'; font-size:2.5rem;">PALEONTOLOGY REPORT</h3>
        <p><strong>Pace:</strong> ${dino.statReasons.pac}</p>
        <p><strong>Power:</strong> ${dino.statReasons.pwr}</p>
        <p><strong>Defense:</strong> ${dino.statReasons.def}</p>
        <p><strong>Size:</strong> ${dino.statReasons.siz}</p>
        <p><strong>Intelligence:</strong> ${dino.statReasons.iq}</p>
        <p><strong>Agility:</strong> ${dino.statReasons.agi}</p>
    `;

    if (isMythic) {
        extendedLore = `
            <p>The <strong>${dino.name}</strong> is a highly classified genetic hybrid. It does not belong to any natural era, but was instead engineered in a modern laboratory located in <strong>${dino.city}</strong>.</p>
            <p>${dino.bio}</p>
            <div style="background: rgba(255, 202, 40, 0.1); border-left: 4px solid var(--ui-gold); padding: 15px; margin: 20px 0; border-radius: 0 10px 10px 0;">
                <h4 style="font-family:'Teko'; font-size:2rem; color:var(--ui-gold); margin-bottom: 5px; text-shadow: 1px 1px black;">💡 DID YOU KNOW?</h4>
                <p style="font-size: 1.2rem; color: white; line-height: 1.5;">${dino.funFact}</p>
            </div>
            <h3 style="color:red; font-family:'Teko'; font-size:2.5rem;">THREAT ASSESSMENT REPORT</h3>
            <p><strong>Pace:</strong> ${dino.statReasons.pac}</p>
            <p><strong>Power:</strong> ${dino.statReasons.pwr}</p>
            <p><strong>Defense:</strong> ${dino.statReasons.def}</p>
            <p><strong>Size:</strong> ${dino.statReasons.siz}</p>
            <p><strong>Intelligence:</strong> ${dino.statReasons.iq}</p>
            <p><strong>Agility:</strong> ${dino.statReasons.agi}</p>
        `;
    }

    content.innerHTML = `
        <div class="article-header">
            <div><div class="article-title">${dino.name}</div><div class="article-subtitle">${dino.era} Period | ${dino.diet}</div></div>
            <div style="font-size: 4rem; text-shadow: 2px 2px black;">${dino.dietIcon}</div>
        </div>
        <div class="article-body">
            <div class="article-image-container">
                <img src="${dino.img}" class="article-image" style="border-color: ${getOvrColor(dino.rarity)};">
                <table class="info-table">
                    <tr><th>Era</th><td>${dino.era}</td></tr><tr><th>Diet</th><td>${dino.diet}</td></tr><tr><th>Region</th><td>${dino.region}</td></tr><tr><th>Dig Site</th><td>${dino.city}</td></tr>
                    <tr><th>Base OVR</th><td>${dino.ovr}</td></tr><tr><th>Archive Rarity</th><td><span style="color:${getOvrColor(dino.rarity)}; font-weight:bold; text-shadow: 1px 1px black;">${dino.rarity.toUpperCase()}</span></td></tr>
                </table>
            </div>
            <div class="article-text">${extendedLore}</div>
        </div>
    `;
}

document.getElementById('dinoweb-search').addEventListener('input', (e) => { renderDinoWebList(e.target.value); });

function checkUserSession() {
    currentUser = localStorage.getItem('dinoUser');
    const dTab = document.getElementById('daily-tab-li'); const qTab = document.getElementById('quests-tab-li');
    const aTab = document.getElementById('achievements-tab-li'); const mTab = document.getElementById('map-tab-li');
    const dwTab = document.getElementById('dinoweb-tab-li'); const facTab = document.getElementById('facility-tab-li');
    const aboutTab = document.getElementById('about-tab-li'); const tutorialBox = document.getElementById('tutorial-callout-box');
    const blurTargets = document.querySelectorAll('.blur-target'); const lockedOverlays = document.querySelectorAll('.locked-overlay');

    if (currentUser) {
        loginBtn.innerText = "PROFILE: " + currentUser.toUpperCase(); loginBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden'); homeRegisterBtn.classList.add('hidden');
        
        dTab.innerHTML = '🎁 Daily Loot'; qTab.innerHTML = '📜 Quests <span id="quest-dot" class="hidden"></span>';
        aTab.innerHTML = '🏆 Milestones'; mTab.innerHTML = '🗺️ Map'; dwTab.innerHTML = '📖 Dino Web'; facTab.innerHTML = '🏢 Facility';
        
        dTab.classList.remove('locked-tab'); qTab.classList.remove('locked-tab'); aTab.classList.remove('locked-tab');
        mTab.classList.remove('locked-tab'); dwTab.classList.remove('locked-tab'); facTab.classList.remove('locked-tab');
        
        aboutTab.style.display = 'none'; if (tutorialBox) tutorialBox.classList.add('hidden');
        blurTargets.forEach(el => el.classList.remove('blurred')); lockedOverlays.forEach(el => el.classList.add('hidden'));

    } else {
        loginBtn.innerText = "Sign In / Register"; loginBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden'); homeRegisterBtn.classList.remove('hidden');
        
        dTab.innerHTML = '🔒 Daily Loot'; qTab.innerHTML = '🔒 Quests'; aTab.innerHTML = '🔒 Milestones';
        mTab.innerHTML = '🔒 Map'; dwTab.innerHTML = '🔒 Dino Web'; facTab.innerHTML = '🔒 Facility';
        
        dTab.classList.add('locked-tab'); qTab.classList.add('locked-tab'); aTab.classList.add('locked-tab');
        mTab.classList.add('locked-tab'); dwTab.classList.add('locked-tab'); facTab.classList.add('locked-tab');
        
        aboutTab.style.display = 'block'; if (tutorialBox) tutorialBox.classList.remove('hidden');
        blurTargets.forEach(el => el.classList.add('blurred')); lockedOverlays.forEach(el => el.classList.remove('hidden'));
    }
    loadUserData(); updateStatsUI();
}

loginBtn.addEventListener('click', () => { playSound('click'); isRegisterMode = false; modalTitle.innerText = "EXPLORER LOGIN"; submitLoginBtn.innerText = "LOGIN"; authToggleText.innerText = "Need an account? Register here"; loginModal.classList.remove('hidden'); });
document.querySelectorAll('.overlay-register-btn').forEach(btn => { btn.addEventListener('click', () => { playSound('click'); isRegisterMode = true; modalTitle.innerText = "CREATE ACCOUNT"; submitLoginBtn.innerText = "REGISTER"; authToggleText.innerText = "Already have an account? Login here"; loginModal.classList.remove('hidden'); }); });
document.getElementById('tutorial-register-btn').addEventListener('click', () => { playSound('click'); document.getElementById('tutorial-complete-modal').classList.add('hidden'); isRegisterMode = true; modalTitle.innerText = "CREATE ACCOUNT"; submitLoginBtn.innerText = "REGISTER"; authToggleText.innerText = "Already have an account? Login here"; loginModal.classList.remove('hidden'); });
document.querySelector('.close-tutorial-btn').addEventListener('click', () => { playSound('click'); document.getElementById('tutorial-complete-modal').classList.add('hidden'); });
homeRegisterBtn.addEventListener('click', () => { playSound('click'); isRegisterMode = true; modalTitle.innerText = "CREATE ACCOUNT"; submitLoginBtn.innerText = "REGISTER"; authToggleText.innerText = "Already have an account? Login here"; loginModal.classList.remove('hidden'); });
closeLoginBtn.addEventListener('click', () => { playSound('click'); loginModal.classList.add('hidden'); });

authToggleText.addEventListener('click', () => {
    playSound('click');
    isRegisterMode = !isRegisterMode;
    if (isRegisterMode) { modalTitle.innerText = "CREATE ACCOUNT"; submitLoginBtn.innerText = "REGISTER"; authToggleText.innerText = "Already have an account? Login here"; } 
    else { modalTitle.innerText = "EXPLORER LOGIN"; submitLoginBtn.innerText = "LOGIN"; authToggleText.innerText = "Need an account? Register here"; }
});

authForm.addEventListener('submit', (e) => {
    e.preventDefault(); const user = usernameInput.value.trim(); const pass = passwordInput.value.trim();
    if (user !== "" && pass !== "") {
        if (isRegisterMode) {
            localStorage.setItem('dinoUser', user); localStorage.setItem('dinoPass_' + user, pass);
            let starterCollection = [masterCatalog[0], masterCatalog[1], masterCatalog[2]];
            if (userCollection.find(d => d.id === 6)) { starterCollection.unshift(userCollection[0]); }
            localStorage.setItem('dinoCollection_' + user, JSON.stringify(starterCollection));
            localStorage.setItem('dinoCoins_' + user, "2000"); localStorage.setItem('dinoPermits_' + user, "3"); 
        } else {
            const savedPass = localStorage.getItem('dinoPass_' + user);
            if (savedPass && savedPass === pass) { localStorage.setItem('dinoUser', user); } else { playSound('error'); alert("Invalid username or password."); return; }
        }
        playSound('success'); checkUserSession(); loginModal.classList.add('hidden');
        usernameInput.value = ""; passwordInput.value = ""; switchView('Collection'); tabs.forEach(t => t.classList.remove('active'));
        document.getElementById('nav-tabs').children[2].classList.add('active'); renderCatalog();
    }
});

logoutBtn.addEventListener('click', () => { playSound('click'); localStorage.removeItem('dinoUser'); checkUserSession(); switchView('Home'); tabs.forEach(t => t.classList.remove('active')); document.getElementById('nav-tabs').children[0].classList.add('active'); });

function switchView(viewName) {
    views.forEach(v => document.getElementById(v).classList.add('hidden'));
    if (viewName === 'Home') document.getElementById('home-view').classList.remove('hidden');
    if (viewName === 'About') document.getElementById('about-view').classList.remove('hidden');
    if (viewName === 'Collection') { document.getElementById('collection-view').classList.remove('hidden'); renderCatalog(); }
    if (viewName === 'Arena') { document.getElementById('arena-view').classList.remove('hidden'); }
    if (viewName === 'Facility') { 
        document.getElementById('facility-view').classList.remove('hidden'); 
        renderFacility(); 
        if (currentUser && !facilityTutorialDone) {
            document.getElementById('facility-tutorial-modal').classList.remove('hidden');
        }
    }
    if (viewName === 'Daily') { document.getElementById('daily-view').classList.remove('hidden'); renderDailyRoad(); }
    if (viewName === 'Quests') { document.getElementById('quests-view').classList.remove('hidden'); renderQuestsUI(); }
    if (viewName === 'Achievements') { document.getElementById('achievements-view').classList.remove('hidden'); checkAchievements(); }
    if (viewName === 'Map') { document.getElementById('map-view').classList.remove('hidden'); if (questMapCount < 1) { questMapCount++; saveUserData(); updateQuestNotificationDot(); } }
    if (viewName === 'DinoWeb') { 
        document.getElementById('dinoweb-view').classList.remove('hidden'); document.getElementById('dinoweb-search').value = ""; renderDinoWebList(); 
        const generalTab = document.querySelector('.dinoweb-list-item'); if (generalTab) generalTab.classList.add('active'); loadErasArticle();
    }
}

document.getElementById('start-journey-btn').addEventListener('click', () => { playSound('click'); tabs.forEach(t => t.classList.remove('active')); document.getElementById('about-tab-li').classList.add('active'); switchView('About'); });
document.getElementById('about-continue-btn').addEventListener('click', () => { playSound('click'); tabs.forEach(t => t.classList.remove('active')); document.getElementById('nav-tabs').children[2].classList.add('active'); switchView('Collection'); if (!currentUser && userCollection.length === 0) { triggerExcavation(); } });

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        playSound('click');
        const filter = tab.getAttribute('data-filter');
        if (!currentUser && (filter === 'Facility' || filter === 'Daily' || filter === 'Quests' || filter === 'Achievements' || filter === 'Map' || filter === 'DinoWeb')) { 
            playSound('error'); 
        }
        tabs.forEach(t => t.classList.remove('active')); tab.classList.add('active'); switchView(filter);
        if (filter === 'Collection') { if (dinoFilter) dinoFilter.value = "All"; renderCatalog(); }
    });
});

function attachMapPinListeners() {
    const pins = document.querySelectorAll('#map-view .pin');
    pins.forEach(pin => {
        pin.addEventListener('click', () => {
            playSound('click');
            const region = pin.getAttribute('data-region');
            if (!region) return;

            tabs.forEach(t => t.classList.remove('active'));
            const colTab = document.querySelector('#nav-tabs li[data-filter="Collection"]');
            if (colTab) colTab.classList.add('active');

            switchView('Collection');
            if (dinoFilter) dinoFilter.value = "All";
            renderCatalog(region, "region");

            const dbControls = document.querySelector('.database-controls');
            if (dbControls) dbControls.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

function getOvrColor(rarity) { switch(rarity) { case 'common': return 'var(--common)'; case 'rare': return 'var(--rare)'; case 'epic': return '#ab47bc'; case 'legendary': return '#ffca28'; case 'mythic': return 'white'; default: return 'white'; } }

function createCardHTML(dino, isUnlocked) {
    if (!isUnlocked) { return `<div class="card-wrapper"><div class="card undiscovered"><div class="undiscovered-name">🔒 ${dino.id === 999 ? "???" : dino.name}</div></div></div>`; }
    return `
        <div class="card-wrapper" onclick="openModal(${dino.id})" onmousemove="handleTilt(event, this)" onmouseleave="resetTilt(this)">
            <div class="card ${dino.rarity}">
                <div class="rarity-badge" style="color: ${getOvrColor(dino.rarity)}; border-color: ${getOvrColor(dino.rarity)}">${dino.rarity.toUpperCase()}</div>
                ${dino.level > 1 ? `<div class="card-level">LVL ${dino.level}</div>` : ''}
                <div class="card-header"><span class="ovr" style="color: ${getOvrColor(dino.rarity)}">${dino.ovr}</span><span class="diet-icon">${dino.dietIcon}</span></div>
                <div class="card-img" style="background-image: url('${dino.img}');"></div>
                <div class="card-body"><div class="dino-name">${dino.name}</div><div class="stats-grid">
                    <div class="stat"><span>PAC</span><span>${dino.stats.pac}</span></div><div class="stat"><span>PWR</span><span>${dino.stats.pwr}</span></div>
                    <div class="stat"><span>DEF</span><span>${dino.stats.def}</span></div><div class="stat"><span>SIZ</span><span>${dino.stats.siz}</span></div>
                    <div class="stat"><span>IQ</span><span>${dino.stats.iq}</span></div><div class="stat"><span>AGI</span><span>${dino.stats.agi}</span></div>
                </div></div>
            </div>
        </div>`;
}

function renderCatalog(filterValue = "All", filterType = "general") {
    if (!cardGrid) return;
    cardGrid.innerHTML = ''; 
    let baseList = [...masterCatalog, mythicReward]; 
    let filteredList = baseList;

    if (filterValue !== "All") { 
        if (filterType === "general") { 
            filteredList = baseList.filter(d => {
                if (d.era && d.era.toLowerCase() === filterValue.toLowerCase()) return true;
                if (d.rarity && d.rarity.toLowerCase() === filterValue.toLowerCase()) return true;
                if (filterValue === "Herbivore" && (d.diet === "Herbivore" || d.diet === "Omnivore")) return true;
                if (filterValue === "Carnivore" && (d.diet === "Carnivore" || d.diet === "Omnivore")) return true;
                if (filterValue === "Omnivore" && d.diet === "Omnivore") return true;
                return false;
            }); 
        } else if (filterType === "region") { 
            filteredList = baseList.filter(d => d.region && d.region.toLowerCase() === filterValue.toLowerCase()); 
        } 
    }

    filteredList.forEach(catalogDino => {
        const found = userCollection.find(d => d.id === catalogDino.id); 
        const isUnlocked = !!found;
        if (!currentUser && !isUnlocked) return;
        cardGrid.innerHTML += createCardHTML(found ? found : catalogDino, isUnlocked);
    });

    if (filteredList.length === 0) {
        cardGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; font-size: 1.8rem; color: #aaa; margin: 40px 0;">No dinosaurs found matching "${filterValue}".</p>`;
    }
}

if (dinoFilter) { dinoFilter.addEventListener('change', (e) => { playSound('click'); renderCatalog(e.target.value, "general"); }); }

window.handleTilt = function(event, element) { const rect = element.getBoundingClientRect(); const x = event.clientX - rect.left; const y = event.clientY - rect.top; const centerX = rect.width / 2; const centerY = rect.height / 2; element.style.transform = `perspective(1000px) rotateX(${((y - centerY) / centerY) * -15}deg) rotateY(${((x - centerX) / centerX) * 15}deg) scale3d(1.05, 1.05, 1.05)`; };
window.resetTilt = function(element) { element.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`; };

window.openModal = function(id) {
    playSound('click');
    const dino = userCollection.find(d => d.id === id) || masterCatalog.find(d => d.id === id) || (id === 999 ? mythicReward : null); 
    if(!dino) return; 

    const shortReasons = {
        pac: "General speed and acceleration capability.",
        pwr: "Raw physical strength and combat damage potential.",
        def: "Natural armor and physical resilience.",
        siz: "Overall mass, weight, and physical footprint.",
        iq: "Problem-solving, hunting tactics, and sensory intelligence.",
        agi: "Ability to maneuver, pivot, and dodge quickly."
    };
    
    let trainingHTML = '';
    const isOwned = userCollection.some(d => d.id === id);
    if ((id === 24 || id === 999) && isOwned) {
        if (dino.level < 10) {
            let costCoins = dino.level * 1000; let costPermits = dino.level;
            trainingHTML = `
            <div style="margin-top: 20px; padding: 15px; background: rgba(0,0,0,0.5); border: 2px dashed var(--accent-green); border-radius: 10px; text-align: center;">
                <h4 style="color: var(--accent-green); font-family: 'Teko'; font-size: 1.8rem; margin-bottom: 5px;">🧬 DIRECT DNA TRAINING</h4>
                <p style="margin-bottom: 10px; font-size: 1rem; color: #ccc;">Milestone exclusives cannot be excavated. Train them directly!</p>
                <button class="fac-btn btn-collect" onclick="trainDinosaur(${id})" style="font-size: 1.2rem; padding: 8px 15px;">TRAIN TO LVL ${dino.level + 1} (Cost: ${costCoins} 🪙 + ${costPermits} 🎫)</button>
            </div>`;
        } else {
            trainingHTML = `<div style="margin-top: 20px; padding: 15px; background: rgba(0,0,0,0.5); border: 2px solid var(--ui-gold); border-radius: 10px; text-align: center;"><h4 style="color: var(--ui-gold); font-family: 'Teko'; font-size: 2rem;">MAXIMUM LEVEL REACHED</h4></div>`;
        }
    }

    modalDetails.innerHTML = `
        <div class="modal-header" style="color:var(--ui-gold);">${dino.name} ${dino.level && isOwned ? `(Lv. ${dino.level})` : ''}</div>
        <div class="modal-info">
            <p><span>Classification:</span> <span style="color:${getOvrColor(dino.rarity)};">${dino.rarity.toUpperCase()} Tier</span></p>
            <p><span>Era:</span> ${dino.era}</p><p><span>Diet:</span> ${dino.diet} ${dino.dietIcon}</p><p><span>First Discovered:</span> ${dino.city} (${dino.region})</p><br>
            <p><span>Paleontologist Notes:</span> ${dino.bio}</p>
            <div class="stat-explanation" style="border-top: 1px solid #444; margin-top: 15px; padding-top: 15px;">
                <h3 style="font-family:'Teko'; font-size:2rem; color:var(--rare); margin-bottom: 10px; text-shadow: 1px 1px black;">STAT BREAKDOWN</h3>
                <p style="margin-bottom: 8px;"><strong>Pace (${dino.stats.pac}):</strong> ${shortReasons.pac}</p>
                <p style="margin-bottom: 8px;"><strong>Power (${dino.stats.pwr}):</strong> ${shortReasons.pwr}</p>
                <p style="margin-bottom: 8px;"><strong>Defense (${dino.stats.def}):</strong> ${shortReasons.def}</p>
                <p style="margin-bottom: 8px;"><strong>Size (${dino.stats.siz}):</strong> ${shortReasons.siz}</p>
                <p style="margin-bottom: 8px;"><strong>Intelligence (${dino.stats.iq}):</strong> ${shortReasons.iq}</p>
                <p style="margin-bottom: 8px;"><strong>Agility (${dino.stats.agi}):</strong> ${shortReasons.agi}</p>
            </div>
            ${trainingHTML}
            <div style="margin-top: 15px; text-align: center;"><p style="color: #aaa; font-style: italic; font-size: 0.9rem;">(View the Dino Web for full paleontology reports and fun facts)</p></div>
        </div>
    `;
    modal.classList.remove('hidden');
};

window.trainDinosaur = function(id) {
    let dino = userCollection.find(d => d.id === id);
    if (!dino) return;
    let costCoins = dino.level * 1000; let costPermits = dino.level;
    
    if (coins >= costCoins && permits >= costPermits) {
        coins -= costCoins; permits -= costPermits;
        dino.level++; dino.ovr++; dino.stats.pac++; dino.stats.pwr++; dino.stats.def++; dino.stats.siz++; dino.stats.iq++; dino.stats.agi++;
        playSound('success'); saveUserData(); updateStatsUI(); renderCatalog(dinoFilter ? dinoFilter.value : "All", "general"); openModal(id);
    } else {
        playSound('error');
        alert(`Not enough resources! You need ${costCoins} Coins and ${costPermits} Permits.`);
    }
};

window.closeDinoModal = function() { playSound('click'); if (modal) modal.classList.add('hidden'); };
modal.addEventListener('click', (e) => { if (e.target === modal) { playSound('click'); modal.classList.add('hidden'); } });
window.closeMilestoneModal = function() { playSound('click'); const mModal = document.getElementById('milestone-modal'); if (mModal) mModal.classList.add('hidden'); };

let isExcavating = false; // Prevents double-clicking excavate button

function triggerExcavation() {
    playSound('excavate');
    document.querySelector('.database-controls').classList.add('hidden'); document.getElementById('excavate-btn').classList.add('hidden'); 
    document.getElementById('buy-pack-btn').classList.add('hidden'); cardGrid.classList.add('hidden'); document.getElementById('excavate-map-container').classList.remove('hidden');

    const extractablePool = masterCatalog.filter(d => d.id !== 24);
    let newDino;
    
    if (!currentUser && userCollection.length === 0) { 
        newDino = JSON.parse(JSON.stringify(masterCatalog.find(d => d.id === 6))); 
    } else { 
        let unownedPool = extractablePool.filter(d => !userCollection.some(u => u.id === d.id));
        if (unownedPool.length > 0 && Math.random() < 0.5) {
            newDino = JSON.parse(JSON.stringify(unownedPool[Math.floor(Math.random() * unownedPool.length)]));
        } else {
            newDino = JSON.parse(JSON.stringify(extractablePool[Math.floor(Math.random() * extractablePool.length)])); 
        }
    }

    const mapEl = document.getElementById('excavate-map'); const pinEl = document.getElementById('excavate-pin'); const labEl = document.getElementById('excavate-label');
    mapEl.style.transform = `scale(1)`; pinEl.classList.add('hidden'); labEl.classList.add('hidden');

    setTimeout(() => {
        mapEl.style.transformOrigin = `${newDino.mapX}% ${newDino.mapY}%`; mapEl.style.transform = `scale(6)`; 
        setTimeout(() => {
            pinEl.style.left = `${newDino.mapX}%`; pinEl.style.top = `${newDino.mapY}%`; pinEl.classList.remove('hidden');
            labEl.innerText = `${newDino.city}, ${newDino.region}`; labEl.style.left = `${newDino.mapX}%`; labEl.style.top = `${newDino.mapY}%`; labEl.classList.remove('hidden');
        }, 1500);
    }, 500);

    setTimeout(() => {
        document.getElementById('excavate-map-container').classList.add('hidden');
        let existingIndex = userCollection.findIndex(d => d.id === newDino.id); let wasDuplicate = false; 
        
        if (questExcavatesCount < 1) questExcavatesCount++; if (newDino.rarity === 'common' && questCommonCount < 1) questCommonCount++;

        playSound('success');
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 }, colors: ['#ffb800', '#3b7c3f', '#9b4dca'] });

        const revCon = document.getElementById('revealed-card-container'); revCon.classList.remove('hidden');
        const isTutorial = !currentUser;

        if(existingIndex !== -1) {
            wasDuplicate = true; let currentCard = userCollection[existingIndex];
            const extractValue = getExtractionValue(currentCard.rarity);
            
            if (currentCard.level >= 10) {
                coins += extractValue; saveUserData();
                revCon.innerHTML = `<h2 style="font-family:'Teko'; font-size:3rem; color:var(--legendary); text-shadow: 2px 2px 5px black;">MAX LEVEL REACHED! EXTRACTED FOR +${extractValue} COINS!</h2><div class="grid" style="justify-content: center;">${createCardHTML(currentCard, true)}</div><button id="collect-btn" style="margin-top: 20px; padding: 10px 30px; font-size: 1.5rem; cursor: pointer;">CONTINUE</button>`;
                attachContinueListener(revCon, isTutorial);
            } else {
                revCon.innerHTML = `<h2 style="font-family:'Teko'; font-size:3rem; color:var(--legendary); text-shadow: 2px 2px 5px black;">DUPLICATE FOUND! CHOOSE ACTION:</h2><div class="grid" style="justify-content: center;">${createCardHTML(currentCard, true)}</div><div style="display: flex; gap: 20px; justify-content: center; margin-top: 20px;"><button id="fuse-btn" class="dup-choice-btn">🧬 FUSE (LEVEL UP)</button><button id="extract-btn" class="dup-choice-btn">🔬 EXTRACT (+${extractValue} 🪙)</button></div>`;
                document.getElementById('fuse-btn').addEventListener('click', () => {
                    playSound('success');
                    currentCard.level++; currentCard.ovr++; currentCard.stats.pac++; currentCard.stats.pwr++; currentCard.stats.def++; currentCard.stats.siz++; saveUserData();
                    revCon.innerHTML = `<h2 style="font-family:'Teko'; font-size:3rem; color:var(--accent-green); text-shadow: 2px 2px 5px black;">DUPLICATE FUSED! LEVEL UP TO LVL ${currentCard.level}!</h2><div class="grid" style="justify-content: center;">${createCardHTML(currentCard, true)}</div><button id="collect-btn" style="margin-top: 20px; padding: 10px 30px; font-size: 1.5rem; cursor: pointer;">CONTINUE</button>`;
                    attachContinueListener(revCon, isTutorial);
                });
                document.getElementById('extract-btn').addEventListener('click', () => {
                    playSound('click');
                    coins += extractValue; saveUserData();
                    revCon.innerHTML = `<h2 style="font-family:'Teko'; font-size:3rem; color:var(--ui-gold); text-shadow: 2px 2px 5px black;">DNA EXTRACTED! +${extractValue} COINS!</h2><div class="grid" style="justify-content: center;">${createCardHTML(currentCard, true)}</div><button id="collect-btn" style="margin-top: 20px; padding: 10px 30px; font-size: 1.5rem; cursor: pointer;">CONTINUE</button>`;
                    attachContinueListener(revCon, isTutorial);
                });
            }
        } else {
            userCollection.unshift(newDino); saveUserData();
            revCon.innerHTML = `<h2 style="font-family:'Teko'; font-size:3rem; color:var(--legendary); text-shadow: 2px 2px 5px black;">${isTutorial ? 'LEGENDARY FOSSIL DISCOVERED!' : 'NEW FOSSIL DISCOVERED!'}</h2><div class="grid" style="justify-content: center;">${createCardHTML(newDino, true)}</div><button id="collect-btn" style="${isTutorial ? 'background: var(--rare); color: black; box-shadow: 0 0 15px var(--rare); border: none; font-weight: bold; margin-top:20px; padding: 15px 30px;' : 'margin-top:20px; padding: 10px 30px; font-size:1.5rem; cursor:pointer;'}">${isTutorial ? '⚔️ ENTER ARENA FOR TRIAL BATTLE' : 'CONTINUE'}</button>`;
            attachContinueListener(revCon, isTutorial);
        }
    }, 3500);
}

function attachContinueListener(revCon, isTutorial) {
    document.getElementById('collect-btn').addEventListener('click', () => {
        playSound('click');
        isExcavating = false; // Reset lock
        revCon.classList.add('hidden'); cardGrid.classList.remove('hidden'); document.querySelector('.database-controls').classList.remove('hidden'); updateStatsUI(); renderCatalog();
        if (isTutorial) { tabs.forEach(t => t.classList.remove('active')); const arenaTab = document.getElementById('arena-tab-li'); if (arenaTab) arenaTab.classList.add('active'); switchView('Arena'); window.scrollTo(0, 0); }
    });
}

document.getElementById('excavate-btn').addEventListener('click', () => { 
    if (isExcavating) return;
    playSound('click'); 
    if (!currentUser && userCollection.length === 0) { isExcavating = true; triggerExcavation(); } 
    else if(permits > 0) { isExcavating = true; permits--; updateStatsUI(); triggerExcavation(); } 
    else { playSound('error'); }
});
document.getElementById('buy-pack-btn').addEventListener('click', () => { 
    if (isExcavating) return;
    playSound('click'); 
    if(coins >= 500) { isExcavating = true; coins -= 500; updateStatsUI(); triggerExcavation(); } 
    else { playSound('error'); } 
});

document.getElementById('arena-battle-btn').addEventListener('click', () => {
    playSound('click');
    if (isBattling) return; // Prevent Spam
    if (coins <= 0 && currentUser) { return; } 
    if (userCollection.length === 0) { alert("You need at least one dinosaur in your collection to battle!"); return; }
    
    if (currentUser && dailyBattlesPlayed >= 10) {
        playSound('error');
        alert("You have reached your daily limit of 10 Arena battles! Come back tomorrow.");
        return;
    }

    isBattling = true; // Lock button
    if (currentUser) dailyBattlesPlayed++;

    let playerDino, aiDino, fightStat; const statKeys = ['pac', 'pwr', 'def', 'siz', 'iq', 'agi']; const statNames = {'pac':'Pace', 'pwr':'Power', 'def':'Defense', 'siz':'Size', 'iq':'Intelligence', 'agi':'Agility'};
    if (!currentUser) { playerDino = userCollection[0]; aiDino = masterCatalog.find(d => d.id === 20); fightStat = 'pwr'; } 
    else { playerDino = userCollection[Math.floor(Math.random() * userCollection.length)]; aiDino = masterCatalog[Math.floor(Math.random() * masterCatalog.length)]; fightStat = statKeys[Math.floor(Math.random() * statKeys.length)]; }

    const pStat = playerDino.stats[fightStat]; const aStat = aiDino.stats[fightStat];
    document.getElementById('player-fighter').innerHTML = createCardHTML(playerDino, true); document.getElementById('ai-fighter').innerHTML = createCardHTML(aiDino, true);
    
    const announce = document.getElementById('battle-announcement'); announce.innerText = `RANDOM DRAW! FIGHTING IN: ${statNames[fightStat].toUpperCase()}!`;
    const diff = pStat - aStat;

    updateStatsUI(); // Update battle counter immediately

    setTimeout(() => {
        let wonMatch = false;
        if(diff > 0 || !currentUser) { 
            playSound('win');
            const winnings = (!currentUser) ? 200 : (diff * 50); if (currentUser) coins += winnings; wonMatch = true;
            announce.innerHTML = `YOU WIN! <br> Your ${pStat} beat their ${aStat} by ${Math.max(diff, 1)}! <br> <span style='color:var(--epic)'>+${winnings} COINS!</span>`;
        } else if (diff < 0) {
            playSound('lose');
            const losses = Math.abs(diff) * 25; if (currentUser) { coins -= losses; if (coins < 0) coins = 0; }
            announce.innerHTML = `YOU LOSE! <br> Their ${aStat} beat your ${pStat} by ${Math.abs(diff)}. <br> <span style='color:red'>-${losses} COINS!</span>`;
        } else { 
            playSound('click');
            announce.innerHTML = `DRAW! <br> Both scored ${pStat}. <br> <span style='color:gray'>NO COINS WON OR LOST.</span>`; 
        }

        if (questBattlesCount < 2) questBattlesCount++; if (wonMatch && questWinsCount < 1) questWinsCount++;
        
        isBattling = false; // Unlock button
        updateStatsUI(); 
        
        if (!currentUser) { setTimeout(() => { document.getElementById('tutorial-complete-modal').classList.remove('hidden'); }, 1500); }
    }, 1500);
});

document.getElementById('open-trivia-btn').addEventListener('click', () => { playSound('click'); startTrivia(); }); 
document.querySelector('.close-trivia-btn').addEventListener('click', () => { playSound('click'); triviaModal.classList.add('hidden'); });

function startTrivia() {
    currentTriviaSet = [...triviaDatabase].sort(() => 0.5 - Math.random()).slice(0, 5); currentTriviaIndex = 0; currentTriviaScore = 0;
    document.getElementById('trivia-game-area').classList.remove('hidden'); document.getElementById('trivia-result-area').classList.add('hidden'); triviaModal.classList.remove('hidden'); renderTriviaQuestion();
}
function renderTriviaQuestion() {
    const qData = currentTriviaSet[currentTriviaIndex]; document.getElementById('trivia-progress').innerText = `Question ${currentTriviaIndex + 1} / 5`; document.getElementById('trivia-question').innerText = qData.q;
    const optionsDiv = document.getElementById('trivia-options'); optionsDiv.innerHTML = '';
    qData.opts.forEach((optText, idx) => { const btn = document.createElement('button'); btn.className = 'trivia-option-btn'; btn.innerText = optText; btn.onclick = () => handleTriviaAnswer(idx); optionsDiv.appendChild(btn); });
}
function handleTriviaAnswer(selectedIndex) { if (selectedIndex === currentTriviaSet[currentTriviaIndex].ans) { currentTriviaScore++; playSound('success'); } else { playSound('error'); } currentTriviaIndex++; if (currentTriviaIndex < 5) renderTriviaQuestion(); else showTriviaResults(); }
function showTriviaResults() {
    document.getElementById('trivia-game-area').classList.add('hidden'); document.getElementById('trivia-result-area').classList.remove('hidden'); document.getElementById('trivia-result-title').innerText = `You scored ${currentTriviaScore} out of 5!`;
    const coinsWon = currentTriviaScore * 250; document.getElementById('trivia-result-coins').innerText = `Reward: +${coinsWon} 🪙`;
    document.getElementById('trivia-claim-btn').onclick = () => { coins += coinsWon; updateStatsUI(); playSound('success'); triviaModal.classList.add('hidden'); };
}

function renderQuestsUI() {
    const container = document.getElementById('quests-list-container'); if (!container) return; container.innerHTML = '';
    const q1Done = questBattlesCount >= 2; container.innerHTML += `<div class="quest-card ${q1Done && !claimedQ1 ? 'completed' : ''}" ${q1Done && !claimedQ1 ? 'onclick="claimQuest(1)"' : ''}><h3>🎯 Arena Contender</h3><p>Complete 2 matches in the Top Trumps Arena.</p><div class="status">Progress: ${questBattlesCount} / 2 | Reward: +2 Permits 🎫 ${claimedQ1 ? '(CLAIMED)' : q1Done ? '✨ CLICK TO CLAIM!' : ''}</div></div>`;
    const q2Done = questExcavatesCount >= 1; container.innerHTML += `<div class="quest-card ${q2Done && !claimedQ2 ? 'completed' : ''}" ${q2Done && !claimedQ2 ? 'onclick="claimQuest(2)"' : ''}><h3>🔍 Fossil Hunter</h3><p>Excavate or buy 1 pack from the Collection.</p><div class="status">Progress: ${questExcavatesCount} / 1 | Reward: +1 Permit 🎫 ${claimedQ2 ? '(CLAIMED)' : q2Done ? '✨ CLICK TO CLAIM!' : ''}</div></div>`;
    const q3Done = questWinsCount >= 1; container.innerHTML += `<div class="quest-card ${q3Done && !claimedQ3 ? 'completed' : ''}" ${q3Done && !claimedQ3 ? 'onclick="claimQuest(3)"' : ''}><h3>⚔️ Arena Victor</h3><p>Win at least 1 battle in the Arena.</p><div class="status">Progress: ${questWinsCount} / 1 | Reward: +500 Coins 🪙 ${claimedQ3 ? '(CLAIMED)' : q3Done ? '✨ CLICK TO CLAIM!' : ''}</div></div>`;
    const q4Done = questMapCount >= 1; container.innerHTML += `<div class="quest-card ${q4Done && !claimedQ4 ? 'completed' : ''}" ${q4Done && !claimedQ4 ? 'onclick="claimQuest(4)"' : ''}><h3>🗺️ World Explorer</h3><p>Open the World Map tab to inspect global dig sites.</p><div class="status">Progress: ${questMapCount} / 1 | Reward: +300 Coins 🪙 ${claimedQ4 ? '(CLAIMED)' : q4Done ? '✨ CLICK TO CLAIM!' : ''}</div></div>`;
    const q5Done = questCommonCount >= 1; container.innerHTML += `<div class="quest-card ${q5Done && !claimedQ5 ? 'completed' : ''}" ${q5Done && !claimedQ5 ? 'onclick="claimQuest(5)"' : ''}><h3>🦴 Common Specimen</h3><p>Excavate any Common tier fossil from dig sites.</p><div class="status">Progress: ${questCommonCount} / 1 | Reward: +200 Coins 🪙 ${claimedQ5 ? '(CLAIMED)' : q5Done ? '✨ CLICK TO CLAIM!' : ''}</div></div>`;
    updateQuestNotificationDot();
}

window.claimQuest = function(qNum) {
    if (qNum === 1 && !claimedQ1) { permits += 2; claimedQ1 = true; } if (qNum === 2 && !claimedQ2) { permits += 1; claimedQ2 = true; }
    if (qNum === 3 && !claimedQ3) { coins += 500; claimedQ3 = true; } if (qNum === 4 && !claimedQ4) { coins += 300; claimedQ4 = true; }
    if (qNum === 5 && !claimedQ5) { coins += 200; claimedQ5 = true; }
    playSound('success'); saveUserData(); updateStatsUI(); renderQuestsUI();
};

function updateQuestNotificationDot() {
    const dot = document.getElementById('quest-dot'); if (!dot) return;
    const hasUnclaimed = (questBattlesCount >= 2 && !claimedQ1) || (questExcavatesCount >= 1 && !claimedQ2) || (questWinsCount >= 1 && !claimedQ3) || (questMapCount >= 1 && !claimedQ4) || (questCommonCount >= 1 && !claimedQ5);
    if (hasUnclaimed) dot.classList.remove('hidden'); else dot.classList.add('hidden');
}

function updateStatsUI() {
    saveUserData(); document.getElementById('coin-count').innerText = coins; document.getElementById('permit-count').innerText = permits;
    const exBtn = document.getElementById('excavate-btn'); const buyBtn = document.getElementById('buy-pack-btn'); const msg = document.getElementById('excavate-msg'); const battleBtn = document.getElementById('arena-battle-btn'); const brokeControls = document.getElementById('broke-controls');
    
    if (!currentUser) {
        if (userCollection.length === 0) { exBtn.innerText = "⛏️ Trial Excavation (Free!)"; exBtn.classList.remove('hidden'); buyBtn.classList.add('hidden'); msg.innerText = "Use your free trial to find your first dinosaur!"; } 
        else { exBtn.classList.add('hidden'); buyBtn.classList.add('hidden'); msg.innerText = "Take your new dinosaur to the Arena!"; }
    } else {
        exBtn.innerText = "⛏️ Excavate Fossil (Cost: 1 🎫)";
        if(permits > 0) { exBtn.classList.remove('hidden'); buyBtn.classList.add('hidden'); msg.innerText = ""; } 
        else {
            exBtn.classList.add('hidden'); buyBtn.classList.remove('hidden');
            if(coins < 500) { buyBtn.style.opacity = "0.5"; msg.innerText = "Out of Permits and Coins! Complete Quests or Play Trivia."; } 
            else { buyBtn.style.opacity = "1"; msg.innerText = "Out of Permits! Buy a pack for 500 Coins?"; }
        }
    }
    
    // Arena Button Logic & Daily Limit Update
    if (battleBtn) {
        if (currentUser) {
            let remaining = Math.max(0, 10 - dailyBattlesPlayed);
            battleBtn.innerText = `⚔️ BATTLE! (${remaining} LEFT)`;
            if (remaining === 0) { battleBtn.style.opacity = "0.5"; } 
            else { battleBtn.style.opacity = "1"; }
        } else {
            battleBtn.innerText = "⚔️ BATTLE!";
            battleBtn.style.opacity = "1";
        }
        
        if (coins <= 0 && currentUser) { battleBtn.classList.add('hidden'); if(brokeControls) brokeControls.classList.remove('hidden'); } 
        else { battleBtn.classList.remove('hidden'); if(brokeControls) brokeControls.classList.add('hidden'); }
    }
    
    updateQuestNotificationDot();
}

function checkAchievements() {
    const container = document.getElementById('milestones-list-container');
    if (!container) return;
    
    let html = '';

    const m1Targets = ["Stegosaurus", "Brachiosaurus", "Allosaurus", "Diplodocus", "Dilophosaurus"];
    let m1Owned = 0;
    m1Targets.forEach(target => { if(userCollection.find(d => d.name === target)) m1Owned++; });

    if (!claimedM1) {
        html += `
        <div class="achievement-card">
            <h3>🦕 Jurassic Master</h3>
            <p>Collect all 5 starting Jurassic Era dinosaurs (Stegosaurus, Brachiosaurus, Allosaurus, Diplodocus, Dilophosaurus).</p>
            <div class="status">Status: ${m1Owned} / ${m1Targets.length} Found</div>
            ${m1Owned >= m1Targets.length ? `<button class="fac-btn btn-collect" style="margin-top: 15px; padding: 10px 25px; font-size: 1.5rem;" onclick="claimMilestone(1)">Claim Legendary Therizinosaurus!</button>` : ''}
        </div>`;
    }

    if (claimedM1 && !claimedM2) {
        const requiredApexes = ["Tyrannosaurus Rex", "Spinosaurus", "Carnotaurus", "Therizinosaurus"];
        let apexCount = 0;
        requiredApexes.forEach(name => { if(userCollection.find(d => d.name === name)) apexCount++; });

        const uniqueCount = userCollection.length;
        const highestLvl = userCollection.reduce((max, d) => Math.max(max, d.level || 1), 1);

        const condApex = apexCount === requiredApexes.length;
        const condSpecies = uniqueCount >= 18;
        const condLevel = highestLvl >= 3;
        const allMet = condApex && condSpecies && condLevel;

        html += `
        <div class="achievement-card" style="border-color: #ff3333; box-shadow: 0 0 20px rgba(255, 51, 51, 0.4);">
            <h3 style="color: #ff5252;">🦖 Apex Predator</h3>
            <p style="margin-bottom: 15px;">Prove ultimate dominance over the prehistoric food chain by meeting three severe expedition prerequisites:</p>
            <div style="background: rgba(0,0,0,0.5); padding: 12px; border-radius: 6px; font-size: 1.1rem; line-height: 1.6;">
                <p>1. Own Titans (T-Rex, Spinosaurus, Carnotaurus, Therizinosaurus): <strong style="color: ${condApex ? '#00ff66' : 'var(--ui-gold)'}">${apexCount} / 4</strong></p>
                <p>2. Expand Archive to 18 Unique Dinosaur Species: <strong style="color: ${condSpecies ? '#00ff66' : 'var(--ui-gold)'}">${uniqueCount} / 18</strong></p>
                <p>3. Upgrade any Dinosaur to Level 3 or higher: <strong style="color: ${condLevel ? '#00ff66' : 'var(--ui-gold)'}">Lv. ${highestLvl} / 3</strong></p>
            </div>
            ${allMet ? `<button class="fac-btn btn-collect" style="margin-top: 15px; padding: 12px 25px; font-size: 1.6rem; background: #ff3333; box-shadow: 0 0 20px #ff3333;" onclick="claimMilestone(2)">UNLEASH INDOMINUS PROTOTYPE!</button>` : `<div class="status" style="margin-top:15px; color:#ff6b6b;">Prerequisites in Progress...</div>`}
        </div>`;
    }

    if (claimedM1 && claimedM2) {
        html += `
        <div class="achievement-card" style="border-color: var(--accent-green); text-align: center;">
            <h3 style="color: var(--accent-green);">🏆 ALL CURRENT MILESTONES CONQUERED!</h3>
            <p style="font-size: 1.2rem; color: #ddd;">You have extracted the rarest apex genetics in Earth's history.</p>
        </div>`;
    }

    container.innerHTML = html;
}

window.claimMilestone = function(mNum) {
    const modalTitle = document.getElementById('milestone-modal-title');
    const modalDesc = document.getElementById('milestone-modal-desc');
    const modalCard = document.getElementById('milestone-modal-card');
    const claimBtn = document.getElementById('milestone-modal-claim-btn');
    const milestoneModal = document.getElementById('milestone-modal');

    let rewardDino = null;

    if (mNum === 1 && !claimedM1) {
        claimedM1 = true;
        rewardDino = JSON.parse(JSON.stringify(masterCatalog.find(d => d.id === 24)));
        userCollection.unshift(rewardDino);
        
        modalTitle.innerText = "JURASSIC MASTER UNLOCKED!";
        modalTitle.style.color = "var(--legendary)";
        modalDesc.innerHTML = "You reconstructed all 5 Jurassic legends and claimed the scythe-clawed titan:<br><strong style='color:var(--legendary); font-size:1.4rem;'>Therizinosaurus</strong>!";
    } else if (mNum === 2 && !claimedM2) {
        claimedM2 = true;
        rewardDino = mythicReward;
        userCollection.unshift(mythicReward);

        modalTitle.innerText = "APEX PREDATOR CONQUERED!";
        modalTitle.style.color = "#ffffff";
        modalDesc.innerHTML = "You mastered the food chain and synthesized the ultimate genetic chimera:<br><strong style='color:#ffffff; font-size:1.4rem;'>Indominus Prototype</strong>!";
    }

    if (rewardDino) {
        playSound('success');
        modalCard.innerHTML = createCardHTML(rewardDino, true);
        milestoneModal.classList.remove('hidden');

        claimBtn.onclick = () => {
            playSound('click');
            milestoneModal.classList.add('hidden');
            renderCatalog();
        };

        saveUserData();
        confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 }, colors: ['#ffb800', '#ab47bc', '#00ff66', '#ffffff'] });
        checkAchievements();
    }
};

checkUserSession();
attachMapPinListeners();
switchView('Home');