// ==========================================
// JURASSIC CARDS ARCHIVE - CORE LOGIC
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

let currentUser = localStorage.getItem('dinoUser') || null;
let coins = 0; let permits = 0; let userCollection = [];

// Quests & System Variables
let qBattlesCount = 0; let qHatchedCount = 0; let qPuzzlePlayed = false; let qRPEarned = 0; let qSpeedUpCount = 0;
let claimedQ1 = false; let claimedQ2 = false; let claimedQ3 = false; let claimedQ4 = false; let claimedQ5 = false;
let claimedM1 = false; let claimedM2 = false; let claimedM3 = false; let claimedM4 = false;
let facilityTutorialDone = false;
let isExcavating = false;
let activeFacilityKey = null; let activeSlotIndex = null;

// Gauntlet State (Best of 5 Format)
let gauntletState = { 
    active: false, pWins: 0, aiWins: 0, pTeam: [], aiTeam: [], matchRound: 0, draftStep: 0, draftOffered: []
};
let playerRP = 1000;

// 4 Incubator Slots
let incubators = [null, null, null, null];

const views = ['home-view', 'about-view', 'collection-view', 'facility-view', 'arena-view', 'rankings-view', 'daily-view', 'quests-view', 'achievements-view', 'map-view', 'dinoweb-view'];
const tabs = document.querySelectorAll('#nav-tabs li');

function playSound(id) { 
    const sound = document.getElementById(id + '-sound'); 
    if (sound) { sound.currentTime = 0; sound.play().catch(e => {}); } 
}

const masterCatalog = [
    { id: 1, name: "Triceratops", era: "Cretaceous", diet: "Herbivore", dietIcon: "🌿", ovr: 88, rarity: "epic", level: 1, region: "North America", city: "Colorado, USA", mapX: 25, mapY: 32, stats: { pac: 60, pwr: 85, def: 95, siz: 80, iq: 65, agi: 45 }, statReasons: { pac: "Weighing several tons, it lacked running endurance.", pwr: "Solid frill and horns could puncture thick hides.", def: "Massive frill acted as a biological shield.", siz: "Nearly 30 feet and weighing up to 12 tons.", iq: "Average herd animal instincts.", agi: "Stout legs offered stability but poor turning." }, bio: "A heavily armored herbivore recognized by its three horns.", funFact: "Its massive skull could grow up to 8 feet long!", img: "images/triceratops.jpg.jpg" },
    { id: 2, name: "Stegosaurus", era: "Jurassic", diet: "Herbivore", dietIcon: "🌿", ovr: 82, rarity: "rare", level: 1, region: "North America", city: "Wyoming, USA", mapX: 24, mapY: 31, stats: { pac: 40, pwr: 75, def: 90, siz: 75, iq: 40, agi: 30 }, statReasons: { pac: "Forelimbs were shorter than hind legs.", pwr: "Thagomizer tail spikes swung with bone-shattering force.", def: "Staggered dermal plates protected from above.", siz: "A bulky 5-ton fortress.", iq: "Brain roughly the size of a walnut.", agi: "Stiff spine prevented quick maneuvers." }, bio: "A distinct, slow-moving herbivore recognized by its armored plates.", funFact: "Plates could flush with red blood to intimidate predators!", img: "images/stegosaurus.jpg.jpg" },
    { id: 3, name: "Velociraptor", era: "Cretaceous", diet: "Carnivore", dietIcon: "🥩", ovr: 85, rarity: "epic", level: 1, region: "Asia", city: "Gobi Desert, Mongolia", mapX: 72, mapY: 32, stats: { pac: 95, pwr: 70, def: 40, siz: 30, iq: 95, agi: 99 }, statReasons: { pac: "Hollow avian bones allowed blistering acceleration.", pwr: "Massive 3-inch retractable sickle claws.", def: "Fragile bird-like skeleton.", siz: "Compact pack hunter.", iq: "Complex pack communication.", agi: "Stiffened tail acted as a high-speed turning rudder." }, bio: "A highly intelligent pack hunter armed with a sickle claw.", funFact: "Real Velociraptors were actually the size of a turkey!", img: "images/velociraptor.jpg.jpg" },
    { id: 6, name: "Tyrannosaurus Rex", era: "Cretaceous", diet: "Carnivore", dietIcon: "🥩", ovr: 96, rarity: "legendary", level: 1, region: "North America", city: "South Dakota, USA", mapX: 26, mapY: 31, stats: { pac: 75, pwr: 99, def: 85, siz: 90, iq: 80, agi: 60 }, statReasons: { pac: "Sprints up to 15 mph in short bursts.", pwr: "Strongest bite force of any terrestrial animal.", def: "Thick hide and dense muscular build.", siz: "Weighed over 9 tons.", iq: "Huge olfactory bulb gave incredible smell.", agi: "Tail counterweight allowed surprising pivots." }, bio: "The undisputed tyrant lizard king.", funFact: "Its teeth were the size and shape of bananas to crush bone!", img: "images/trex.jpg.jpg" },
    { id: 7, name: "Spinosaurus", era: "Cretaceous", diet: "Carnivore", dietIcon: "🥩", ovr: 95, rarity: "legendary", level: 1, region: "Africa", city: "Bahariya, Egypt", mapX: 52, mapY: 42, stats: { pac: 80, pwr: 95, def: 80, siz: 95, iq: 70, agi: 65 }, statReasons: { pac: "Dense bones acted as ballast for river swimming.", pwr: "Crocodile jaws snared giant fish.", def: "Towering sail intimidated land rivals.", siz: "Longest carnivorous dinosaur known.", iq: "Sensory pits detected underwater vibration.", agi: "Graceful in water, clunky on land." }, bio: "A colossal, sail-backed aquatic predator.", funFact: "Spinosaurus spent most of its life swimming in water!", img: "images/spinosaurus.jpg.jpg" },
    { id: 8, name: "Allosaurus", era: "Jurassic", diet: "Carnivore", dietIcon: "🥩", ovr: 89, rarity: "epic", level: 1, region: "North America", city: "Utah, USA", mapX: 23, mapY: 32, stats: { pac: 85, pwr: 88, def: 75, siz: 70, iq: 75, agi: 80 }, statReasons: { pac: "Relentless pursuit runner.", pwr: "Jaws unhinged to strike like a hatchet.", def: "Athletic muscular build.", siz: "Dominant Jurassic predator.", iq: "Hunted in loose packs.", agi: "Fast footwork." }, bio: "The lion of the Jurassic.", funFact: "Shed and grew teeth continuously!", img: "images/allosaurus.jpg.jpg" },
    { id: 9, name: "Diplodocus", era: "Jurassic", diet: "Herbivore", dietIcon: "🌿", ovr: 83, rarity: "rare", level: 1, region: "North America", city: "Colorado, USA", mapX: 25, mapY: 32, stats: { pac: 30, pwr: 65, def: 80, siz: 95, iq: 45, agi: 25 }, statReasons: { pac: "Slow browsing pace.", pwr: "Long tail cracked like a bullwhip.", def: "Sheer mass discouraged attackers.", siz: "Reached up to 90 feet long.", iq: "Herd instincts.", agi: "Colossal turning radius." }, bio: "A massive sauropod famous for its whip-like tail.", funFact: "Its whip-like tail could break the sound barrier!", img: "images/diplodocus.jpg.jpg" },
    { id: 10, name: "Dilophosaurus", era: "Jurassic", diet: "Carnivore", dietIcon: "🥩", ovr: 82, rarity: "rare", level: 1, region: "North America", city: "Arizona, USA", mapX: 23, mapY: 34, stats: { pac: 85, pwr: 75, def: 60, siz: 55, iq: 75, agi: 90 }, statReasons: { pac: "Explosive speed.", pwr: "Subnarial jaw gap hooked prey.", def: "Lightweight build.", siz: "Reached 20 feet.", iq: "Solitary ambush hunter.", agi: "Exceptional leaping ability." }, bio: "An Early Jurassic predator with twin cranial crests.", funFact: "Real Dilophosaurus lacked a neck frill and did not spit venom!", img: "images/dilophosaurus.jpg.jpg" },
    { id: 11, name: "Brachiosaurus", era: "Jurassic", diet: "Herbivore", dietIcon: "🌿", ovr: 80, rarity: "rare", level: 1, region: "Africa", city: "Tanzania", mapX: 55, mapY: 60, stats: { pac: 20, pwr: 60, def: 85, siz: 99, iq: 50, agi: 10 }, statReasons: { pac: "Slow deliberate stride.", pwr: "Downward leg stomps.", def: "Towering height placed vitals out of reach.", siz: "Weighed 40 tons.", iq: "Followed seasonal vegetation.", agi: "Minimal dodging ability." }, bio: "A towering giant with incredibly long forelimbs.", funFact: "Front legs were longer than its back legs!", img: "images/brachiosaurus.jpg.jpg" },
    { id: 12, name: "Woolly Mammoth", era: "Ice Age", diet: "Herbivore", dietIcon: "🌿", ovr: 92, rarity: "legendary", level: 1, region: "Asia", city: "Siberia, Russia", mapX: 75, mapY: 15, stats: { pac: 45, pwr: 90, def: 92, siz: 96, iq: 75, agi: 40 }, statReasons: { pac: "Energy-conserving tundra trek.", pwr: "Massive curved tusks shoveled snow.", def: "Thick shaggy fur.", siz: "Stood 11 feet tall.", iq: "Matriarchal social bonds.", agi: "Traction-focused pads." }, bio: "An iconic, heavily furred Ice Age giant.", funFact: "Mammoths were alive while the Pyramids were built!", img: "images/mammoth.jpg.jpg" },
    { id: 13, name: "Smilodon", era: "Ice Age", diet: "Carnivore", dietIcon: "🥩", ovr: 88, rarity: "epic", level: 1, region: "North America", city: "Los Angeles, USA", mapX: 21, mapY: 35, stats: { pac: 80, pwr: 91, def: 65, siz: 60, iq: 80, agi: 85 }, statReasons: { pac: "Short-range ambush acceleration.", pwr: "Powerful forearms wrestled prey.", def: "Muscular frame.", siz: "Stocky and heavy.", iq: "Pack hunting.", agi: "Expert wrestler." }, bio: "The legendary saber-toothed cat.", funFact: "Its 11-inch teeth were brittle and broke easily!", img: "images/smilodon.jpg.jpg" },
    { id: 14, name: "Megalodon", era: "Cenozoic", diet: "Carnivore", dietIcon: "🥩", ovr: 98, rarity: "legendary", level: 1, region: "South America", city: "Coast of Peru", mapX: 35, mapY: 65, stats: { pac: 85, pwr: 99, def: 75, siz: 98, iq: 70, agi: 80 }, statReasons: { pac: "Streamlined oceanic cruiser.", pwr: "Bite crushed the chests of whales.", def: "Tough dermal denticle skin.", siz: "Largest shark to ever exist.", iq: "Targeted flippers to disable prey.", agi: "Explosive thrust from tail." }, bio: "The ultimate prehistoric marine predator.", funFact: "Jaws were wide enough to swallow two humans!", img: "images/megalodon.jpg.jpg" },
    { id: 15, name: "Ankylosaurus", era: "Cretaceous", diet: "Herbivore", dietIcon: "🌿", ovr: 89, rarity: "epic", level: 1, region: "North America", city: "Montana, USA", mapX: 24, mapY: 29, stats: { pac: 35, pwr: 88, def: 99, siz: 75, iq: 50, agi: 25 }, statReasons: { pac: "Slow low-slung tank.", pwr: "Bone tail club shattered legs.", def: "Interlocking osteoderm armor.", siz: "Weighed 8 tons.", iq: "Reflexive defense instinct.", agi: "Low turning mobility." }, bio: "A heavily armored, walking fortress.", funFact: "Even its eyelids were reinforced with bone!", img: "images/ankylosaurus.jpg.jpg" },
    { id: 16, name: "Carnotaurus", era: "Cretaceous", diet: "Carnivore", dietIcon: "🥩", ovr: 86, rarity: "epic", level: 1, region: "South America", city: "Chubut, Argentina", mapX: 30, mapY: 75, stats: { pac: 92, pwr: 85, def: 70, siz: 65, iq: 60, agi: 85 }, statReasons: { pac: "Massive leg muscles made it incredibly fast.", pwr: "Quick snapping jaw strikes.", def: "Bumpy armored scales.", siz: "Measures 25 feet.", iq: "Ambush predator.", agi: "Stiff tail made sharp turns difficult." }, bio: "A terrifyingly fast predator with bull-like horns.", funFact: "Its arms were even tinier than a T-Rex's!", img: "images/carnotaurus.jpg.jpg" },
    { id: 17, name: "Parasaurolophus", era: "Cretaceous", diet: "Herbivore", dietIcon: "🌿", ovr: 81, rarity: "rare", level: 1, region: "North America", city: "Alberta, Canada", mapX: 24, mapY: 25, stats: { pac: 60, pwr: 50, def: 75, siz: 70, iq: 85, agi: 55 }, statReasons: { pac: "Bipedal galloping when threatened.", pwr: "Lacks offensive weapons.", def: "Relied on herd numbers.", siz: "Large 30-foot body.", iq: "Hollow head crest allowed acoustic calls.", agi: "Good mobility in forests." }, bio: "A herd animal with a magnificent crest.", funFact: "Its cranial crest acted like a built-in trombone!", img: "images/parasaurolophus.jpg.jpg" },
    { id: 18, name: "Pachycephalosaurus", era: "Cretaceous", diet: "Herbivore", dietIcon: "🌿", ovr: 79, rarity: "rare", level: 1, region: "North America", city: "Wyoming, USA", mapX: 24, mapY: 31, stats: { pac: 65, pwr: 80, def: 85, siz: 50, iq: 55, agi: 60 }, statReasons: { pac: "Agile bipedal runner.", pwr: "10-inch thick bone dome delivered concussive rams.", def: "Shock-absorbing skull roof.", siz: "Compact 15-foot frame.", iq: "Territorial head-butting duels.", agi: "Nimble close-quarters footwork." }, bio: "Famous for its incredibly thick, domed skull roof.", funFact: "The solid bone dome was 10 inches thick!", img: "images/pachycephalosaurus.jpg.jpg" },
    { id: 19, name: "Archelon", era: "Cretaceous", diet: "Omnivore", dietIcon: "🌿🥩", ovr: 84, rarity: "rare", level: 1, region: "North America", city: "South Dakota, USA", mapX: 26, mapY: 31, stats: { pac: 50, pwr: 60, def: 96, siz: 85, iq: 45, agi: 60 }, statReasons: { pac: "Flippers generated efficient cruising.", pwr: "Hooked beak crushed ammonite shells.", def: "Colossal leathery carapace.", siz: "Largest sea turtle known.", iq: "Migratory navigation.", agi: "Graceful in water, helpless on beaches." }, bio: "The largest sea turtle to ever exist.", funFact: "Archelon had a leathery carapace stretched over ribs instead of a solid shell!", img: "images/archelon.jpg.jpg" },
    { id: 20, name: "Compsognathus", era: "Jurassic", diet: "Carnivore", dietIcon: "🥩", ovr: 68, rarity: "common", level: 1, region: "Europe", city: "Bavaria, Germany", mapX: 49, mapY: 28, stats: { pac: 88, pwr: 20, def: 15, siz: 10, iq: 60, agi: 95 }, statReasons: { pac: "Lightning-fast sprint.", pwr: "Tiny snapping teeth.", def: "Fragile hollow bones.", siz: "Chicken-sized dinosaur.", iq: "Opportunistic hunter.", agi: "Split-second directional dodging." }, bio: "A tiny, lightning-fast theropod.", funFact: "One fossil was found with an entire lizard inside its stomach!", img: "images/compsognathus.jpg.jpg" },
    { id: 21, name: "Oviraptor", era: "Cretaceous", diet: "Omnivore", dietIcon: "🌿🥩", ovr: 74, rarity: "common", level: 1, region: "Asia", city: "Gobi Desert, Mongolia", mapX: 72, mapY: 32, stats: { pac: 88, pwr: 46, def: 38, siz: 42, iq: 78, agi: 86 }, statReasons: { pac: "Slender avian legs.", pwr: "Deep crushing beak cracked nuts.", def: "Feathered evasion.", siz: "6-foot turkey-like build.", iq: "Cooperative nest brooding.", agi: "Feathered tail counterweight." }, bio: "A crested, bird-like omnivore.", funFact: "Named 'Egg Thief' but it was actually a loving mother protecting her own eggs!", img: "images/oviraptor.jpg.jpg" },
    { id: 22, name: "Pteranodon", era: "Cretaceous", diet: "Carnivore", dietIcon: "🥩", ovr: 71, rarity: "common", level: 1, region: "North America", city: "Kansas, USA", mapX: 26, mapY: 33, stats: { pac: 92, pwr: 35, def: 20, siz: 45, iq: 50, agi: 88 }, statReasons: { pac: "High-altitude ocean gliding.", pwr: "Toothless beak snatched surface fish.", def: "Ultralight brittle bones.", siz: "20-foot wingspan.", iq: "Keen aerial vision.", agi: "Master flyer, clumsy walker." }, bio: "A famous flying reptile with a massive wingspan.", funFact: "Pteranodons were flying reptiles, not technically dinosaurs!", img: "images/pteranodon.jpg.jpg" },
    { id: 23, name: "Troodon", era: "Cretaceous", diet: "Carnivore", dietIcon: "🥩", ovr: 76, rarity: "common", level: 1, region: "North America", city: "Montana, USA", mapX: 24, mapY: 29, stats: { pac: 90, pwr: 42, def: 30, siz: 35, iq: 99, agi: 94 }, statReasons: { pac: "Long metatarsal bones for quick strides.", pwr: "Sharp recurved teeth and sickle claws.", def: "Fragile build.", siz: "3-foot-tall nocturnal hunter.", iq: "Highest brain-to-body ratio.", agi: "Stereoscopic binocular night vision." }, bio: "A razor-smart nocturnal hunter.", funFact: "Troodon is widely considered the smartest dinosaur to ever live!", img: "images/troodon.jpg.jpg" },
    { id: 24, name: "Therizinosaurus", era: "Cretaceous", diet: "Herbivore", dietIcon: "🌿", ovr: 94, rarity: "legendary", level: 1, region: "Asia", city: "Nemegt Basin, Mongolia", mapX: 72, mapY: 32, stats: { pac: 42, pwr: 96, def: 90, siz: 94, iq: 60, agi: 48 }, statReasons: { pac: "Broad pot-bellied torso limited speed.", pwr: "Brandished immense 3.3-foot scythe claws.", def: "Colossal reach deterred apex predators.", siz: "Stretched 33 feet long.", iq: "Foraging communication.", agi: "Slow ground turns." }, bio: "A gargantuan herbivore with the longest scythe-claws in history.", funFact: "Holds the world record for the longest claws of any animal in history!", img: "images/therizinosaurus.jpg.jpg" }
];

const mythicReward = { 
    id: 999, name: "Indominus Prototype", era: "Unknown", diet: "Carnivore", dietIcon: "🥩", ovr: 99, rarity: "mythic", level: 1, region: "Unknown", city: "Secret Lab", mapX: 0, mapY: 0, variant: 'standard',
    stats: { pac: 95, pwr: 99, def: 90, siz: 95, iq: 99, agi: 95 }, statReasons: { pac: "Accelerated metabolism.", pwr: "Engineered bite force.", def: "Genetic dermal osteoderms.", siz: "Larger than mature T-Rex.", iq: "Problem-solving and deceptive.", agi: "Elongated grappling arms." }, funFact: "Engineered by splicing DNA of T-Rex, Velociraptor, Carnotaurus, and modern cuttlefish!", img: "images/indominus.jpg.jpg", bio: "A highly classified, genetically engineered nightmare." 
};

function getExtractionValue(rarity) { switch (rarity) { case 'common': return 100; case 'rare': return 250; case 'epic': return 650; case 'legendary': return 1500; case 'mythic': return 3500; default: return 250; } }
let facilityState = { herbivore: { unlocked: true, level: 1, slots: [null], storedCoins: 0, cost: 0, upgCost: [1000, 2500] }, carnivore: { unlocked: false, level: 1, slots: [null], storedCoins: 0, cost: 2500, upgCost: [3000, 5000] }, genetics: { unlocked: false, level: 1, slots: [null], storedPermits: 0.0, cost: 5000, upgCost: [5000, 10000] } };
let dailyPuzzleState = { date: '', targetId: null, guesses: [], won: false, lost: false };

// --- LOAD & SAVE DATA ---
function loadUserData() {
    if (currentUser) {
        coins = parseInt(localStorage.getItem('dinoCoins_' + currentUser)) || 2000;
        permits = parseInt(localStorage.getItem('dinoPermits_' + currentUser)) || 3;
        playerRP = parseInt(localStorage.getItem('dinoRP_' + currentUser)) || 1000;
        
        let savedCollection = localStorage.getItem('dinoCollection_' + currentUser);
        if (savedCollection) {
            let tempCol = JSON.parse(savedCollection).map(dino => { 
                if (!dino.variant) dino.variant = 'standard'; 
                // Fix for old saved accounts with missing images
                let masterDino = masterCatalog.find(m => m.id === dino.id) || (dino.id === 999 ? mythicReward : null);
                if (masterDino) { dino.img = masterDino.img; }
                return dino; 
            });
            let seenIds = new Set();
            userCollection = tempCol.filter(d => { let key = d.id + '_' + d.variant; if (seenIds.has(key)) return false; seenIds.add(key); return true; });
        } else { 
            userCollection = [ JSON.parse(JSON.stringify(masterCatalog[0])), JSON.parse(JSON.stringify(masterCatalog[1])), JSON.parse(JSON.stringify(masterCatalog[2])) ];
            userCollection.forEach(d => d.variant = 'standard');
        }

        let savedInc = localStorage.getItem('dinoIncubators_' + currentUser);
        if (savedInc) { 
            incubators = JSON.parse(savedInc); 
            // Auto-expand old saves from 2 to 4 slots safely
            while(incubators.length < 4) incubators.push(null);
        } 
        else { incubators = [ { dino: JSON.parse(JSON.stringify(masterCatalog[3])), readyTime: Date.now() - 5000, speedUps: 0 }, null, null, null ]; }
        
        let savedFac = localStorage.getItem('dinoFacility_' + currentUser); if (savedFac) facilityState = JSON.parse(savedFac);
        
        let savedPuzzle = localStorage.getItem('dinoPuzzle_' + currentUser);
        if (savedPuzzle) { dailyPuzzleState = JSON.parse(savedPuzzle); if (!dailyPuzzleState.targetId) dailyPuzzleState.date = ''; }
        
        qBattlesCount = parseInt(localStorage.getItem('dinoQ1C_' + currentUser)) || 0; qHatchedCount = parseInt(localStorage.getItem('dinoQ2C_' + currentUser)) || 0; qPuzzlePlayed = localStorage.getItem('dinoQ3C_' + currentUser) === 'true'; qRPEarned = parseInt(localStorage.getItem('dinoQ4C_' + currentUser)) || 0; qSpeedUpCount = parseInt(localStorage.getItem('dinoQ5C_' + currentUser)) || 0;
        claimedQ1 = localStorage.getItem('dinoQ1Cl_' + currentUser) === 'true'; claimedQ2 = localStorage.getItem('dinoQ2Cl_' + currentUser) === 'true'; claimedQ3 = localStorage.getItem('dinoQ3Cl_' + currentUser) === 'true'; claimedQ4 = localStorage.getItem('dinoQ4Cl_' + currentUser) === 'true'; claimedQ5 = localStorage.getItem('dinoQ5Cl_' + currentUser) === 'true'; claimedM1 = localStorage.getItem('dinoM1_' + currentUser) === 'true'; claimedM2 = localStorage.getItem('dinoM2_' + currentUser) === 'true'; claimedM3 = localStorage.getItem('dinoM3_' + currentUser) === 'true'; claimedM4 = localStorage.getItem('dinoM4_' + currentUser) === 'true'; facilityTutorialDone = localStorage.getItem('dinoFacTut_' + currentUser) === 'true';

        renderDinoWebList(); checkDailyReset(); updateIncubatorUI(); initDailyPuzzle();
    } else {
        coins = 0; permits = 0; playerRP = 1000; userCollection = []; facilityTutorialDone = false;
        incubators = [ { dino: JSON.parse(JSON.stringify(masterCatalog[3])), readyTime: 0, speedUps: 0 }, null, null, null ];
        const pContainer = document.getElementById('daily-puzzle-container');
        if (pContainer) pContainer.classList.add('hidden');
    }
}

function saveUserData() {
    if (currentUser) {
        localStorage.setItem('dinoCoins_' + currentUser, coins); localStorage.setItem('dinoPermits_' + currentUser, permits); localStorage.setItem('dinoRP_' + currentUser, playerRP); localStorage.setItem('dinoCollection_' + currentUser, JSON.stringify(userCollection)); localStorage.setItem('dinoFacility_' + currentUser, JSON.stringify(facilityState)); localStorage.setItem('dinoIncubators_' + currentUser, JSON.stringify(incubators)); localStorage.setItem('dinoPuzzle_' + currentUser, JSON.stringify(dailyPuzzleState));
        localStorage.setItem('dinoQ1C_' + currentUser, qBattlesCount); localStorage.setItem('dinoQ2C_' + currentUser, qHatchedCount); localStorage.setItem('dinoQ3C_' + currentUser, qPuzzlePlayed); localStorage.setItem('dinoQ4C_' + currentUser, qRPEarned); localStorage.setItem('dinoQ5C_' + currentUser, qSpeedUpCount);
        localStorage.setItem('dinoQ1Cl_' + currentUser, claimedQ1); localStorage.setItem('dinoQ2Cl_' + currentUser, claimedQ2); localStorage.setItem('dinoQ3Cl_' + currentUser, claimedQ3); localStorage.setItem('dinoQ4Cl_' + currentUser, claimedQ4); localStorage.setItem('dinoQ5Cl_' + currentUser, claimedQ5); localStorage.setItem('dinoM1_' + currentUser, claimedM1); localStorage.setItem('dinoM2_' + currentUser, claimedM2); localStorage.setItem('dinoM3_' + currentUser, claimedM3); localStorage.setItem('dinoM4_' + currentUser, claimedM4); localStorage.setItem('dinoFacTut_' + currentUser, facilityTutorialDone);
    }
}

function checkDailyReset() {
    if (!currentUser) return;
    let today = new Date().toDateString();
    if (localStorage.getItem('dinoLastQuestReset_' + currentUser) !== today) {
        qBattlesCount = 0; qHatchedCount = 0; qPuzzlePlayed = false; qRPEarned = 0; qSpeedUpCount = 0;
        claimedQ1 = false; claimedQ2 = false; claimedQ3 = false; claimedQ4 = false; claimedQ5 = false;
        localStorage.setItem('dinoLastQuestReset_' + currentUser, today); saveUserData(); updateQuestNotificationDot();
    }
}

function updateStatsUI() {
    saveUserData();
    document.getElementById('coin-count').innerText = coins; document.getElementById('permit-count').innerText = permits;
    const exBtn = document.getElementById('excavate-btn'); const buyBtn = document.getElementById('buy-pack-btn'); const msg = document.getElementById('excavate-msg'); 
    const enterBtn = document.getElementById('arena-enter-btn'); const broke = document.getElementById('arena-broke-msg');
    
    // Check if any UNLOCKED incubator is empty
    let hasEmpty = false;
    for(let i=0; i<4; i++) {
        let isUnlocked = (i < 2) || (i === 2 && playerRP >= 1500) || (i === 3 && playerRP >= 3000);
        if(isUnlocked && incubators[i] === null) hasEmpty = true;
    }

    if (!currentUser) {
        buyBtn.classList.add('hidden'); 
        if (userCollection.length === 0) { 
            exBtn.innerText = "CLAIM FREE TRIAL EGG"; 
            exBtn.classList.remove('hidden'); 
            msg.innerText = "";
        } else { 
            exBtn.classList.add('hidden'); 
            msg.innerText = "Register to unlock the Arena and Database!"; 
        }
    } else {
        if (!hasEmpty) { exBtn.classList.add('hidden'); buyBtn.classList.add('hidden'); msg.innerText = "Incubators are full! Wait for an egg to hatch."; } 
        else {
            exBtn.innerText = "⛏ Excavate Egg (Cost: 1 🎫)";
            if (permits > 0) { exBtn.classList.remove('hidden'); buyBtn.classList.add('hidden'); msg.innerText = ""; } 
            else { exBtn.classList.add('hidden'); buyBtn.classList.remove('hidden'); msg.innerText = coins < 1000 ? "Out of Permits and Coins! Complete Quests." : "Out of Permits! Buy an egg for 1000 Coins?"; }
        }
    }

    if (enterBtn) {
        if (coins < 500 && currentUser) { enterBtn.style.opacity = "0.5"; if (broke) broke.classList.remove('hidden'); } 
        else { enterBtn.style.opacity = "1"; if (broke) broke.classList.add('hidden'); }
    }
    updateQuestNotificationDot();
}

// --- DAILY DINO-DLE PUZZLE ---
function initDailyPuzzle() {
    let today = new Date().toDateString();
    if (dailyPuzzleState.date !== today || !dailyPuzzleState.targetId) {
        let randomTarget = masterCatalog[Math.floor(Math.random() * masterCatalog.length)].id;
        dailyPuzzleState = { date: today, targetId: randomTarget, guesses: [], won: false, lost: false }; saveUserData();
    }
    const pContainer = document.getElementById('daily-puzzle-container');
    if (!pContainer) return;
    if (dailyPuzzleState.won || dailyPuzzleState.lost) { pContainer.classList.add('hidden'); return; }
    pContainer.classList.remove('hidden');
    const selectBox = document.getElementById('puzzle-dino-select');
    if (!selectBox) return;
    selectBox.innerHTML = '<option value="">-- Select a Dinosaur to Guess --</option>';
    [...masterCatalog].sort((a, b) => a.name.localeCompare(b.name)).forEach(dino => { let opt = document.createElement('option'); opt.value = dino.id; opt.innerText = dino.name; selectBox.appendChild(opt); });
    renderPuzzleGuesses();
}

function renderPuzzleGuesses() {
    const grid = document.getElementById('puzzle-guesses-grid'); if(!grid) return;
    grid.innerHTML = '<div class="puzzle-row puzzle-header"><div>Dinosaur</div><div>Diet</div><div>Era</div><div>Region</div><div>OVR</div><div>Size</div></div>';
    let target = masterCatalog.find(d => d.id === dailyPuzzleState.targetId) || masterCatalog[0];

    dailyPuzzleState.guesses.forEach(gId => {
        let gDino = masterCatalog.find(d => d.id === gId); if(!gDino) return;
        let dietClass = gDino.diet === target.diet ? 'cell-match' : 'cell-miss'; let eraClass = gDino.era === target.era ? 'cell-match' : 'cell-miss'; let regionClass = gDino.region === target.region ? 'cell-match' : 'cell-miss';
        let ovrStr = gDino.ovr === target.ovr ? gDino.ovr : (gDino.ovr < target.ovr ? `${gDino.ovr} ⬆` : `${gDino.ovr} ⬇`); let ovrClass = gDino.ovr === target.ovr ? 'cell-match' : 'cell-arrow';
        let sizeStr = gDino.stats.siz === target.stats.siz ? gDino.stats.siz : (gDino.stats.siz < target.stats.siz ? `${gDino.stats.siz} ⬆` : `${gDino.stats.siz} ⬇`); let sizeClass = gDino.stats.siz === target.stats.siz ? 'cell-match' : 'cell-arrow';
        grid.innerHTML += `<div class="puzzle-row"><div class="puzzle-cell" style="font-weight:bold;">${gDino.name}</div><div class="puzzle-cell ${dietClass}">${gDino.dietIcon}</div><div class="puzzle-cell ${eraClass}">${gDino.era}</div><div class="puzzle-cell ${regionClass}">${gDino.region}</div><div class="puzzle-cell ${ovrClass}">${ovrStr}</div><div class="puzzle-cell ${sizeClass}">${sizeStr}</div></div>`;
    });
}

const puzzleBtn = document.getElementById('puzzle-guess-btn');
if(puzzleBtn){
    puzzleBtn.addEventListener('click', () => {
        let val = document.getElementById('puzzle-dino-select').value; if (!val) return;
        let guessId = parseInt(val); if (dailyPuzzleState.guesses.includes(guessId)) { playSound('error'); return; }
        playSound('click'); dailyPuzzleState.guesses.push(guessId); qPuzzlePlayed = true; updateStatsUI();
        let target = masterCatalog.find(d => d.id === dailyPuzzleState.targetId); renderPuzzleGuesses();
        let msg = document.getElementById('puzzle-message');
        if (guessId === target.id) {
            playSound('win'); dailyPuzzleState.won = true; coins += 1000; permits += 2; saveUserData(); updateStatsUI();
            msg.innerHTML = `CORRECT! It was ${target.name}! <br><span style="color:var(--epic);">+1000 COINS & +2 PERMITS!</span>`;
            setTimeout(() => { document.getElementById('daily-puzzle-container').classList.add('hidden'); }, 4000);
        } else if (dailyPuzzleState.guesses.length >= 5) {
            playSound('lose'); dailyPuzzleState.lost = true; saveUserData();
            msg.innerHTML = `OUT OF GUESSES! The answer was ${target.name}.`;
            setTimeout(() => { document.getElementById('daily-puzzle-container').classList.add('hidden'); }, 4000);
        } else { msg.innerText = `${5 - dailyPuzzleState.guesses.length} Guesses Remaining...`; saveUserData(); }
    });
}

// --- INCUBATOR SYSTEM & VARIANTS ---
setInterval(() => {
    let colView = document.getElementById('collection-view');
    if (colView && !colView.classList.contains('hidden')) updateIncubatorUI();
}, 1000);

function updateIncubatorUI() {
    for (let i = 0; i < 4; i++) {
        let slotEl = document.getElementById('inc-slot-' + i); if (!slotEl) continue;
        
        let isUnlocked = true;
        let reqText = "";
        if (i === 2) { isUnlocked = playerRP >= 1500; reqText = "Requires Gold Rank (1500 RP)"; }
        if (i === 3) { isUnlocked = playerRP >= 3000; reqText = "Requires Diamond Rank (3000 RP)"; }

        if (!isUnlocked) {
            slotEl.innerHTML = `<div class="egg-icon" style="filter: grayscale(100%); opacity: 0.5;">🔒</div><p class="egg-status" style="color:#ff5252;">LOCKED</p><p style="color:#aaa; font-size:0.9rem; text-align:center; font-family:'Oswald'; margin-top:5px;">${reqText}</p>`;
            slotEl.classList.remove('filled');
            slotEl.classList.add('locked');
            continue;
        }
        
        slotEl.classList.remove('locked');
        let inc = incubators[i];
        
        if (!inc) { slotEl.innerHTML = `<div class="egg-icon">🥚</div><p class="egg-status">EMPTY SLOT</p>`; slotEl.classList.remove('filled'); } 
        else {
            slotEl.classList.add('filled');
            let diff = inc.readyTime - Date.now();
            if (diff <= 0) { slotEl.innerHTML = `<div class="egg-icon pulsing">🦖</div><button class="hatch-btn" onclick="hatchEgg(${i})">HATCH!</button>`; } 
            else { 
                let mins = Math.floor(diff / 60000); 
                let secs = Math.floor((diff % 60000) / 1000); 
                let speedUps = inc.speedUps || 0;
                let speedBtn = speedUps < 4 
                    ? `<button class="speedup-btn" onclick="speedUpIncubator(${i})">Speed Up 50% (1000 🪙) [${speedUps}/4]</button>` 
                    : `<button class="speedup-btn" style="opacity:0.5; cursor:not-allowed;">Max Speed-Ups Reached</button>`;
                
                slotEl.innerHTML = `<div class="egg-icon pulsing">🥚</div><p class="egg-status">INCUBATING...</p><p class="egg-timer">${mins}m ${secs < 10 ? '0' : ''}${secs}s</p>${speedBtn}`; 
            }
        }
    }
}

window.speedUpIncubator = function(index) {
    let inc = incubators[index];
    if ((inc.speedUps || 0) >= 4) { playSound('error'); return; }
    
    if (coins >= 1000) {
        coins -= 1000; 
        inc.readyTime -= ((inc.readyTime - Date.now()) / 2); 
        inc.speedUps = (inc.speedUps || 0) + 1;
        qSpeedUpCount++;
        playSound('success'); saveUserData(); updateStatsUI(); updateIncubatorUI();
    } else { playSound('error'); alert("Not enough coins to speed up incubation!"); }
};

window.hatchEgg = function(index) {
    playSound('success'); let hatchedDino = incubators[index].dino; incubators[index] = null; qHatchedCount++; saveUserData(); updateIncubatorUI();

    let roll = Math.random(); hatchedDino.variant = 'standard';
    if (roll > 0.95) { hatchedDino.variant = 'primal'; hatchedDino.ovr += 7; Object.keys(hatchedDino.stats).forEach(k => hatchedDino.stats[k] += 7); } 
    else if (roll > 0.80) { hatchedDino.variant = 'holo'; hatchedDino.ovr += 3; Object.keys(hatchedDino.stats).forEach(k => hatchedDino.stats[k] += 3); }

    const revCon = document.getElementById('revealed-card-container'); revCon.classList.remove('hidden'); document.querySelector('.incubator-grid').classList.add('hidden');
    let existingIndex = userCollection.findIndex(d => d.id === hatchedDino.id && d.variant === hatchedDino.variant);

    if (existingIndex !== -1) {
        let currentCard = userCollection[existingIndex]; let multiplier = currentCard.variant === 'primal' ? 3 : (currentCard.variant === 'holo' ? 2 : 1); const extractValue = getExtractionValue(currentCard.rarity) * multiplier;
        if (currentCard.level >= 10) { coins += extractValue; saveUserData(); revCon.innerHTML = `<h2 style="font-family:'Teko'; font-size:3rem; color:var(--legendary); text-shadow: 2px 2px black;">MAX LEVEL REACHED! EXTRACTED FOR +${extractValue} COINS!</h2><div class="grid">${createCardHTML(currentCard, true)}</div><button id="collect-btn" class="dup-choice-btn" style="margin-top: 20px;">CONTINUE</button>`; } 
        else {
            revCon.innerHTML = `<h2 style="font-family:'Teko'; font-size:3rem; color:var(--legendary); text-shadow: 2px 2px black;">DUPLICATE HATCHED! CHOOSE ACTION:</h2><div class="grid">${createCardHTML(currentCard, true)}</div><div style="display: flex; gap: 20px; justify-content: center; margin-top: 20px;"><button id="fuse-btn" class="dup-choice-btn">🧬 FUSE (LEVEL UP)</button><button id="extract-btn" class="dup-choice-btn">🔬 EXTRACT (+${extractValue} 🪙)</button></div>`;
            document.getElementById('fuse-btn').addEventListener('click', () => { playSound('success'); currentCard.level++; currentCard.ovr++; Object.keys(currentCard.stats).forEach(k => currentCard.stats[k]++); saveUserData(); revCon.innerHTML = `<h2 style="font-family:'Teko'; font-size:3rem; color:var(--accent-green);">DUPLICATE FUSED TO LEVEL ${currentCard.level}!</h2><div class="grid">${createCardHTML(currentCard, true)}</div><button id="collect-btn" class="dup-choice-btn" style="margin-top: 20px;">CONTINUE</button>`; document.getElementById('collect-btn').addEventListener('click', closeReveal); });
            document.getElementById('extract-btn').addEventListener('click', () => { playSound('click'); coins += extractValue; saveUserData(); revCon.innerHTML = `<h2 style="font-family:'Teko'; font-size:3rem; color:var(--ui-gold);">DNA EXTRACTED FOR +${extractValue} COINS!</h2><div class="grid">${createCardHTML(currentCard, true)}</div><button id="collect-btn" class="dup-choice-btn" style="margin-top: 20px;">CONTINUE</button>`; document.getElementById('collect-btn').addEventListener('click', closeReveal); });
        }
    } else {
        userCollection.unshift(hatchedDino); saveUserData(); confetti({ particleCount: 160, spread: 90, origin: { y: 0.6 } });
        let title = hatchedDino.variant === 'primal' ? '🔥 ULTRA-RARE PRIMAL HATCHED!' : (hatchedDino.variant === 'holo' ? '✨ HOLOGRAPHIC HATCHED!' : 'NEW FOSSIL HATCHED!');
        revCon.innerHTML = `<h2 style="font-family:'Teko'; font-size:3.5rem; color:var(--legendary); text-shadow: 2px 2px black;">${title}</h2><div class="grid">${createCardHTML(hatchedDino, true)}</div><button id="collect-btn" class="dup-choice-btn" style="margin-top: 20px;">ADD TO COLLECTION</button>`;
    }
    setTimeout(() => { let btn = document.getElementById('collect-btn'); if (btn) btn.addEventListener('click', closeReveal); }, 100);
};

function closeReveal() {
    playSound('click'); document.getElementById('revealed-card-container').classList.add('hidden'); document.querySelector('.incubator-grid').classList.remove('hidden'); updateStatsUI(); 
    if (!currentUser) { tabs.forEach(t => t.classList.remove('active')); document.getElementById('collection-tab-li').classList.add('active'); switchView('Collection'); window.scrollTo(0, 0); } 
    else { let flt = document.getElementById('dino-filter'); renderCatalog(flt ? flt.value : "All", "general"); }
}

function triggerExcavation() {
    let emptyIdx = -1;
    for(let i = 0; i < 4; i++) {
        let isUnlocked = (i < 2) || (i === 2 && playerRP >= 1500) || (i === 3 && playerRP >= 3000);
        if(isUnlocked && incubators[i] === null) { emptyIdx = i; break; }
    }
    
    if (emptyIdx === -1) { playSound('error'); alert("Available Incubator nests are full! Speed up an egg or Rank Up in the Arena to unlock more space."); isExcavating = false; return; }
    
    playSound('excavate'); document.querySelector('.database-controls').classList.add('hidden'); 
    let eBtn = document.getElementById('excavate-btn'); if (eBtn) eBtn.classList.add('hidden'); 
    let bBtn = document.getElementById('buy-pack-btn'); if (bBtn) bBtn.classList.add('hidden'); 
    document.getElementById('card-grid').classList.add('hidden'); document.querySelector('.incubator-grid').classList.add('hidden');
    let mapBox = document.getElementById('excavate-map-container'); if (mapBox) mapBox.classList.remove('hidden');
    
    const extractable = masterCatalog.filter(d => d.id !== 24);
    let newDino = (!currentUser && userCollection.length === 0) ? JSON.parse(JSON.stringify(masterCatalog.find(d => d.id === 6))) : JSON.parse(JSON.stringify(extractable[Math.floor(Math.random() * extractable.length)]));
    const mapEl = document.getElementById('excavate-map'); const pinEl = document.getElementById('excavate-pin'); const labEl = document.getElementById('excavate-label');
    if (mapEl) mapEl.style.transform = `scale(1)`; if (pinEl) pinEl.classList.add('hidden'); if (labEl) labEl.classList.add('hidden');
    
    setTimeout(() => {
        if (mapEl) { mapEl.style.transformOrigin = `${newDino.mapX}% ${newDino.mapY}%`; mapEl.style.transform = `scale(6)`; }
        setTimeout(() => { if (pinEl && labEl) { pinEl.style.left = `${newDino.mapX}%`; pinEl.style.top = `${newDino.mapY}%`; pinEl.classList.remove('hidden'); labEl.innerText = `${newDino.city}, ${newDino.region}`; labEl.style.left = `${newDino.mapX}%`; labEl.style.top = `${newDino.mapY}%`; labEl.classList.remove('hidden'); } }, 1500);
    }, 500);
    
    setTimeout(() => {
        if (mapBox) mapBox.classList.add('hidden');
        let timerMs = 15 * 60 * 1000; if (newDino.rarity === 'epic') timerMs = 60 * 60 * 1000; if (newDino.rarity === 'legendary' || newDino.rarity === 'mythic') timerMs = 4 * 60 * 60 * 1000;
        if (!currentUser) timerMs = 0; incubators[emptyIdx] = { dino: newDino, readyTime: Date.now() + timerMs, speedUps: 0 }; saveUserData(); updateIncubatorUI(); playSound('success'); isExcavating = false;
        document.querySelector('.incubator-grid').classList.remove('hidden'); document.getElementById('card-grid').classList.remove('hidden'); document.querySelector('.database-controls').classList.remove('hidden'); updateStatsUI();
        if (!currentUser) hatchEgg(emptyIdx);
    }, 3500);
}

const exBtn = document.getElementById('excavate-btn');
if(exBtn){ exBtn.addEventListener('click', () => { if (isExcavating) return; playSound('click'); if (!currentUser && userCollection.length === 0) { isExcavating = true; triggerExcavation(); } else if (permits > 0) { isExcavating = true; permits--; updateStatsUI(); triggerExcavation(); } else { playSound('error'); } }); }

const buyBtn = document.getElementById('buy-pack-btn');
if(buyBtn){ buyBtn.addEventListener('click', () => { if (isExcavating) return; playSound('click'); if (coins >= 1000) { isExcavating = true; coins -= 1000; updateStatsUI(); triggerExcavation(); } else { playSound('error'); alert("Not enough coins to buy an egg!"); } }); }


// --- CARD RENDERING ---
function getOvrColor(rarity) { switch (rarity) { case 'common': return 'var(--common)'; case 'rare': return 'var(--rare)'; case 'epic': return '#ab47bc'; case 'legendary': return '#ffca28'; case 'mythic': return 'white'; default: return 'white'; } }
function createCardHTML(dino, isUnlocked) {
    if (!isUnlocked) { return `<div class="card-wrapper"><div class="card undiscovered"><div class="undiscovered-name">🔒 <br> ? ? ?</div></div></div>`; }
    let vBadge = ''; let vClass = ''; if (dino.variant === 'holo') { vBadge = `<div class="variant-badge holo">HOLO</div>`; vClass = 'holo'; } if (dino.variant === 'primal') { vBadge = `<div class="variant-badge primal">PRIMAL</div>`; vClass = 'primal'; }
    return `
        <div class="card-wrapper" onclick="openModal(${dino.id}, '${dino.variant || 'standard'}')" onmousemove="handleTilt(event, this)" onmouseleave="resetTilt(this)">
            <div class="card ${dino.rarity} ${vClass}">
                ${vBadge}
                <div class="rarity-badge" style="color: ${getOvrColor(dino.rarity)}; border-color: ${getOvrColor(dino.rarity)}">${dino.rarity.toUpperCase()}</div>
                ${dino.level > 1 ? `<div class="card-level">LVL ${dino.level}</div>` : ''}
                <div class="card-header"><span class="diet-icon">${dino.dietIcon}</span></div>
                <div class="card-img" style="background-image: url('${dino.img}');">
                    <div class="ovr-overlay" style="color: ${getOvrColor(dino.rarity)}; border-color: ${getOvrColor(dino.rarity)};">OVR ${dino.ovr}</div>
                </div>
                <div class="card-body">
                    <div class="dino-name">${dino.name}</div>
                    <div class="stats-grid">
                        <div class="stat ${dino.fatigued === 'pac' ? 'fatigued' : ''}"><span>PAC</span><span>${dino.stats.pac}</span></div><div class="stat ${dino.fatigued === 'pwr' ? 'fatigued' : ''}"><span>PWR</span><span>${dino.stats.pwr}</span></div>
                        <div class="stat ${dino.fatigued === 'def' ? 'fatigued' : ''}"><span>DEF</span><span>${dino.stats.def}</span></div><div class="stat ${dino.fatigued === 'siz' ? 'fatigued' : ''}"><span>SIZ</span><span>${dino.stats.siz}</span></div>
                        <div class="stat ${dino.fatigued === 'iq' ? 'fatigued' : ''}"><span>IQ</span><span>${dino.stats.iq}</span></div><div class="stat ${dino.fatigued === 'agi' ? 'fatigued' : ''}"><span>AGI</span><span>${dino.stats.agi}</span></div>
                    </div>
                </div>
            </div>
        </div>`;
}

function renderCatalog(filterValue = "All", filterType = "general") {
    const cardGrid = document.getElementById('card-grid'); if (!cardGrid) return; cardGrid.innerHTML = ''; let baseList = [...masterCatalog, mythicReward]; let filteredList = baseList;
    if (filterValue !== "All") { if (filterType === "general") { filteredList = baseList.filter(d => { if (d.era && d.era.toLowerCase() === filterValue.toLowerCase()) return true; if (d.rarity && d.rarity.toLowerCase() === filterValue.toLowerCase()) return true; if (filterValue === "Herbivore" && (d.diet === "Herbivore" || d.diet === "Omnivore")) return true; if (filterValue === "Carnivore" && (d.diet === "Carnivore" || d.diet === "Omnivore")) return true; if (filterValue === "Omnivore" && d.diet === "Omnivore") return true; return false; }); } else if (filterType === "region") { filteredList = baseList.filter(d => d.region && d.region.toLowerCase() === filterValue.toLowerCase()); } }
    let rendered = 0;
    
    filteredList.forEach(catalogDino => { 
        const owned = userCollection.filter(d => d.id === catalogDino.id); 
        if (owned.length > 0) { 
            owned.forEach(d => { cardGrid.innerHTML += createCardHTML(d, true); rendered++; }); 
        } else { 
            cardGrid.innerHTML += createCardHTML(catalogDino, false); rendered++; 
        } 
    });
    
    if (rendered === 0) { cardGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; font-size: 1.8rem; color: #aaa; margin: 40px 0;">No dinosaurs found matching "${filterValue}".</p>`; }
}

let fltEl = document.getElementById('dino-filter'); if (fltEl) { fltEl.addEventListener('change', (e) => { playSound('click'); renderCatalog(e.target.value, "general"); }); }
window.handleTilt = function(event, element) { const rect = element.getBoundingClientRect(); const x = event.clientX - rect.left; const y = event.clientY - rect.top; element.style.transform = `perspective(1000px) rotateX(${((y - rect.height/2) / (rect.height/2)) * -15}deg) rotateY(${((x - rect.width/2) / (rect.width/2)) * 15}deg) scale3d(1.05, 1.05, 1.05)`; };
window.resetTilt = function(element) { element.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`; };

window.openModal = function(id, variant = 'standard') {
    if (gauntletState.active && document.getElementById('arena-view') && !document.getElementById('arena-view').classList.contains('hidden')) return; 
    playSound('click'); const modal = document.getElementById('dino-modal'); const modalDetails = document.getElementById('modal-details');
    const dino = userCollection.find(d => d.id === id && (d.variant || 'standard') === variant) || masterCatalog.find(d => d.id === id); if (!dino) return;
    let trainingHTML = ''; const isOwned = userCollection.some(d => d.id === id && (d.variant || 'standard') === variant);
    if ((id === 24 || id === 999) && isOwned) {
        if (dino.level < 10) { let costCoins = dino.level * 1000; let costPermits = dino.level; trainingHTML = `<div style="margin-top: 20px; padding: 15px; background: rgba(0,0,0,0.5); border: 2px dashed var(--accent-green); border-radius: 10px; text-align: center;"><h4 style="color: var(--accent-green); font-family: 'Teko'; font-size: 1.8rem;">🧬 DNA TRAINING</h4><p style="margin-bottom: 10px; font-size: 1rem; color: #ccc;">Milestone exclusives can be trained directly!</p><button class="fac-btn btn-collect" onclick="trainDinosaur(${id}, '${variant}')" style="font-size: 1.2rem; padding: 8px 15px;">TRAIN TO LVL ${dino.level + 1} (Cost: ${costCoins} 🪙 + ${costPermits} 🎫)</button></div>`; } 
        else { trainingHTML = `<div style="margin-top: 20px; padding: 15px; background: rgba(0,0,0,0.5); border: 2px solid var(--ui-gold); border-radius: 10px; text-align: center;"><h4 style="color: var(--ui-gold); font-family: 'Teko'; font-size: 2rem;">MAXIMUM LEVEL REACHED</h4></div>`; }
    }
    modalDetails.innerHTML = `<div class="modal-header" style="color:var(--ui-gold);">${dino.name} ${dino.level && isOwned ? `(Lv. ${dino.level})` : ''} ${dino.variant && dino.variant !== 'standard' ? `[${dino.variant.toUpperCase()}]` : ''}</div><div class="modal-info"><p><span>Classification:</span> <span style="color:${getOvrColor(dino.rarity)}; font-weight: bold;">${dino.rarity.toUpperCase()} Tier</span></p><p><span>Era:</span> ${dino.era}</p><p><span>Diet:</span> ${dino.diet} ${dino.dietIcon}</p><p><span>First Discovered:</span> ${dino.city} (${dino.region})</p><br><p><span>Bio:</span> ${dino.bio}</p><div style="border-top: 1px solid #444; margin-top: 15px; padding-top: 15px;"><h3 style="font-family:'Teko'; font-size:2rem; color:var(--rare);">STAT BREAKDOWN</h3><p><strong>Pace (${dino.stats.pac}):</strong> Speed and sprint potential.</p><p><strong>Power (${dino.stats.pwr}):</strong> Raw bite and impact force.</p><p><strong>Defense (${dino.stats.def}):</strong> Armor and resilience.</p><p><strong>Size (${dino.stats.siz}):</strong> Weight tonnage and bulk.</p><p><strong>Intelligence (${dino.stats.iq}):</strong> Senses and hunting tactics.</p><p><strong>Agility (${dino.stats.agi}):</strong> Turning radius and reflex.</p></div>${trainingHTML}</div>`;
    modal.classList.remove('hidden');
};

window.trainDinosaur = function(id, variant) {
    let dino = userCollection.find(d => d.id === id && (d.variant || 'standard') === variant); if (!dino) return;
    let costCoins = dino.level * 1000; let costPermits = dino.level;
    if (coins >= costCoins && permits >= costPermits) {
        coins -= costCoins; permits -= costPermits; dino.level++; dino.ovr++; Object.keys(dino.stats).forEach(k => dino.stats[k]++);
        playSound('success'); saveUserData(); updateStatsUI(); let flt = document.getElementById('dino-filter'); renderCatalog(flt ? flt.value : "All", "general"); openModal(id, variant);
    } else { playSound('error'); alert(`Need ${costCoins} Coins and ${costPermits} Permits.`); }
};
window.closeDinoModal = function() { playSound('click'); document.getElementById('dino-modal').classList.add('hidden'); };
window.closeMilestoneModal = function() { playSound('click'); document.getElementById('milestone-modal').classList.add('hidden'); };


// --- OVERHAULED 3v3 ARENA GAUNTLET (Best of 5 Match) ---
const enterBtn = document.getElementById('arena-enter-btn');
if(enterBtn){
    enterBtn.addEventListener('click', () => {
        if (coins < 500 && currentUser) return;
        playSound('click'); 
        if (currentUser) { coins -= 500; }
        
        gauntletState = { active: true, pWins: 0, aiWins: 0, pTeam: [], aiTeam: [], matchRound: 0, draftStep: 0, draftOffered: [] };
        
        updateStatsUI(); 
        document.getElementById('arena-home').classList.add('hidden');
        startDraftPhase();
    });
}

function startDraftPhase() {
    gauntletState.pTeam = []; 
    gauntletState.draftStep = 0;
    document.getElementById('arena-draft-phase').classList.remove('hidden');
    rollDraftChoices();
}

function rollDraftChoices() {
    document.getElementById('draft-count').innerText = gauntletState.draftStep + 1;
    let grid = document.getElementById('draft-choices-grid'); grid.innerHTML = '';
    
    // Pull from USER COLLECTION
    let availableForDraft = userCollection.filter(uc => !gauntletState.pTeam.some(pt => pt.id === uc.id && pt.variant === uc.variant));
    let choices = [];
    let tempPool = [...availableForDraft];
    
    for(let i=0; i<3; i++) {
        if(tempPool.length > 0) {
            let idx = Math.floor(Math.random() * tempPool.length);
            choices.push(tempPool[idx]);
            tempPool.splice(idx, 1);
        }
    }

    choices.forEach(c => {
        let div = document.createElement('div'); div.innerHTML = createCardHTML(c, true);
        div.onclick = () => { 
            playSound('click'); 
            gauntletState.pTeam.push(JSON.parse(JSON.stringify(c))); 
            gauntletState.draftStep++; 
            checkDraftComplete(); 
        };
        grid.appendChild(div);
    });
}

function checkDraftComplete() {
    if (gauntletState.draftStep < 3 && currentUser) { rollDraftChoices(); } 
    else {
        document.getElementById('arena-draft-phase').classList.add('hidden');
        startMatch();
    }
}

function startMatch() {
    gauntletState.aiTeam = [];
    
    // FIX: Generate 5 random cards instead of 3 so the AI never repeats during a Best-of-5
    let aiSize = currentUser ? 5 : 1;
    
    let maxPLevel = 1;
    if(currentUser) {
        gauntletState.pTeam.forEach(d => { if(d.level > maxPLevel) maxPLevel = d.level; });
    }
    
    for(let i=0; i<aiSize; i++) {
        let aiDino = JSON.parse(JSON.stringify(masterCatalog[Math.floor(Math.random() * masterCatalog.length)]));
        aiDino.variant = 'standard'; 
        
        // HIGHER DIFFICULTY AI SCALING: MaxLevel up to MaxLevel + 5
        let aiLevel = maxPLevel + Math.floor(Math.random() * 6); 
        aiDino.level = aiLevel;
        
        let difficultyBoost = 5; 
        aiDino.ovr += (aiLevel - 1) + difficultyBoost;
        Object.keys(aiDino.stats).forEach(k => aiDino.stats[k] += (aiLevel - 1) + difficultyBoost);
        
        gauntletState.aiTeam.push(aiDino);
    }

    gauntletState.matchRound = 0;
    document.getElementById('arena-combat-phase').classList.remove('hidden');
    document.getElementById('combat-log').innerText = "CHOOSE A STAT TO ATTACK!";
    document.getElementById('combat-stat-buttons').classList.remove('hidden');
    document.getElementById('combat-next-round-btn').classList.add('hidden');
    renderCombatStage();
}
function renderCombatStage() {
    let pCardBox = document.getElementById('combat-player-card'); let aiCardBox = document.getElementById('combat-ai-card');
    
    // BO5 Dots logic
    let pDotsHtml = ""; let aiDotsHtml = "";
    for(let i=0; i<3; i++) {
        pDotsHtml += (i < gauntletState.pWins) ? "🟢 " : "⚪ ";
        aiDotsHtml += (i < gauntletState.aiWins) ? "🔴 " : "⚪ ";
    }
    
    document.getElementById('player-team-dots').innerText = pDotsHtml.trim();
    document.getElementById('ai-team-dots').innerText = aiDotsHtml.trim();
    
    // Rotate guarantee
    let pIdx = gauntletState.matchRound % gauntletState.pTeam.length;
    let aiIdx = gauntletState.matchRound % gauntletState.aiTeam.length;
    
    let pDino = gauntletState.pTeam[pIdx];
    pCardBox.innerHTML = pDino ? createCardHTML(pDino, true) : "";
    let aiDino = gauntletState.aiTeam[aiIdx];
    aiCardBox.innerHTML = aiDino ? `<div class="card-wrapper"><div class="card undiscovered" style="border-color:var(--rare);"><div class="undiscovered-name" style="color:var(--rare);">? ? ?</div></div></div>` : "";
}

// Delegate combat button clicks
document.body.addEventListener('click', (e) => {
    if (e.target.classList.contains('stat-atk-btn')) {
        if (!gauntletState.active) return; playSound('click');
        let statKey = e.target.getAttribute('data-stat'); executeCombatClash(statKey);
    }
});

function executeCombatClash(statKey) {
    document.getElementById('combat-stat-buttons').classList.add('hidden');
    
    let pIdx = gauntletState.matchRound % gauntletState.pTeam.length;
    let aiIdx = gauntletState.matchRound % gauntletState.aiTeam.length;
    let pDino = gauntletState.pTeam[pIdx]; 
    let aiDino = gauntletState.aiTeam[aiIdx];
    
    document.getElementById('combat-ai-card').innerHTML = createCardHTML(aiDino, true);
    
    let pVal = pDino.stats[statKey]; let aiVal = aiDino.stats[statKey];
    
    // Enforce decisive win/loss
    if(pVal === aiVal) pVal += 1; 

    let statNames = { pac: 'Pace', pwr: 'Power', def: 'Defense', siz: 'Size', iq: 'Intelligence', agi: 'Agility' };
    
    setTimeout(() => {
        if (pVal > aiVal || (!currentUser)) {
            playSound('win'); document.getElementById('combat-log').innerText = `WIN: ${statNames[statKey]} (${pVal} vs ${aiVal})`;
            gauntletState.pWins++;
            pDino.stats[statKey] = Math.max(0, pDino.stats[statKey] - 15); pDino.fatigued = statKey; 
            document.getElementById('combat-player-card').innerHTML = createCardHTML(pDino, true);
        } else {
            playSound('lose'); document.getElementById('combat-log').innerText = `LOSS: ${statNames[statKey]} (${pVal} vs ${aiVal})`;
            gauntletState.aiWins++;
            aiDino.stats[statKey] = Math.max(0, aiDino.stats[statKey] - 15); aiDino.fatigued = statKey;
            document.getElementById('combat-ai-card').innerHTML = createCardHTML(aiDino, true);
        }
        
        gauntletState.matchRound++;
        document.getElementById('combat-next-round-btn').classList.remove('hidden');
    }, 1000);
}

const nxtBtn = document.getElementById('combat-next-round-btn');
if(nxtBtn){
    nxtBtn.addEventListener('click', () => {
        playSound('click');
        
        if (gauntletState.pWins >= 3 || gauntletState.aiWins >= 3 || (!currentUser && gauntletState.pWins >= 1)) {
            document.getElementById('arena-combat-phase').classList.add('hidden'); 
            
            let p = gauntletState.pWins;
            let a = gauntletState.aiWins;
            let coinsReward = 0; let rpReward = 0;
            
            // PENALTIES AND REWARDS
            if (p === 3 && a === 0) { coinsReward = 2000; rpReward = 100; }
            else if (p === 3 && a === 1) { coinsReward = 1500; rpReward = 75; }
            else if (p === 3 && a === 2) { coinsReward = 1000; rpReward = 50; }
            else if (p === 2 && a === 3) { coinsReward = -100; rpReward = -10; }
            else if (p === 1 && a === 3) { coinsReward = -250; rpReward = -25; }
            else if (p === 0 && a === 3) { coinsReward = -500; rpReward = -50; }
            
            qBattlesCount++;
            
            let titleEl = document.getElementById('rewards-title');
            let detailsEl = document.getElementById('rewards-details');
            
            if(p >= 3) { 
                playSound('win'); 
                titleEl.innerText = "GAUNTLET WON!";
                titleEl.style.color = "var(--epic)";
                detailsEl.innerHTML = `Score: <span style="color:var(--accent-green); font-weight:bold;">${p} - ${a}</span><br><br><span style="color:var(--ui-gold);">+${coinsReward} 🪙</span><br><span style="color:var(--epic);">+${rpReward} RP</span>`;
            } else { 
                playSound('lose'); 
                titleEl.innerText = "GAUNTLET LOST!";
                titleEl.style.color = "red";
                detailsEl.innerHTML = `Score: <span style="color:red; font-weight:bold;">${p} - ${a}</span><br><br><span style="color:red;">${coinsReward} 🪙</span><br><span style="color:red;">${rpReward} RP</span>`;
            }
            
            if (currentUser) {
                // Ensure coins/rp do not fall below 0
                coins = Math.max(0, coins + coinsReward);
                playerRP = Math.max(0, playerRP + rpReward);
                if(rpReward > 0) qRPEarned += rpReward;
                
                document.getElementById('gauntlet-wins').innerText = p >= 3 ? parseInt(document.getElementById('gauntlet-wins').innerText) + 1 : document.getElementById('gauntlet-wins').innerText;
                document.getElementById('gauntlet-losses').innerText = a >= 3 ? parseInt(document.getElementById('gauntlet-losses').innerText) + 1 : document.getElementById('gauntlet-losses').innerText;
            }
            
            document.getElementById('arena-rewards-phase').classList.remove('hidden');
        } else {
            document.getElementById('combat-next-round-btn').classList.add('hidden'); document.getElementById('combat-stat-buttons').classList.remove('hidden'); document.getElementById('combat-log').innerText = "CHOOSE A STAT TO ATTACK!";
            renderCombatStage(); 
        }
    });
}

document.getElementById('rewards-continue-btn').addEventListener('click', () => {
    playSound('click');
    document.getElementById('arena-rewards-phase').classList.add('hidden');
    document.getElementById('arena-home').classList.remove('hidden');
    document.getElementById('gauntlet-status-board').classList.remove('hidden');
    
    if (!currentUser) { document.getElementById('arena-home').classList.add('hidden'); setTimeout(() => document.getElementById('tutorial-complete-modal').classList.remove('hidden'), 500); return; }
    
    gauntletState.active = false;
    document.getElementById('arena-enter-btn').classList.remove('hidden');
    document.getElementById('arena-enter-btn').innerText = "ENTER GAUNTLET AGAIN (500 🪙)";
    saveUserData(); updateStatsUI();
});

// --- FACILITY ENGINE ---
setInterval(() => {
    if (!currentUser) return; let changed = false;
    if (facilityState.herbivore.unlocked) { let rate = 0; facilityState.herbivore.slots.forEach(id => { if (id) { let d = userCollection.find(u => u.id === id); if (d) rate += getBaseRate(d.rarity) * (1 + (d.level * 0.5)); } }); if (rate > 0) { facilityState.herbivore.storedCoins += rate; changed = true; } }
    if (facilityState.carnivore.unlocked) { let rate = 0; facilityState.carnivore.slots.forEach(id => { if (id) { let d = userCollection.find(u => u.id === id); if (d) rate += (getBaseRate(d.rarity) * 1.5) * (1 + (d.level * 0.5)); } }); if (rate > 0) { facilityState.carnivore.storedCoins += rate; changed = true; } }
    if (facilityState.genetics.unlocked) { let rate = 0; facilityState.genetics.slots.forEach(id => { if (id) { let d = userCollection.find(u => u.id === id); let rRate = d && d.rarity === 'mythic' ? 0.0005 : (d && d.rarity === 'legendary' ? 0.00025 : 0.0001); if (d) rate += rRate * (1 + (d.level * 0.5)); } }); if (rate > 0) { facilityState.genetics.storedPermits += rate; changed = true; } }
    let facView = document.getElementById('facility-view');
    if (changed && facView && !facView.classList.contains('hidden')) { ['herbivore', 'carnivore', 'genetics'].forEach(key => { let el = document.getElementById(`fac-amt-${key}`); if (el) { let amt = key === 'genetics' ? Math.floor(facilityState[key].storedPermits) : Math.floor(facilityState[key].storedCoins); el.innerText = `${amt} ${key === 'genetics' ? '🎫' : '🪙'}`; } }); }
}, 1000);

function getBaseRate(rarity) { switch (rarity) { case 'common': return 0.05; case 'rare': return 0.15; case 'epic': return 0.5; case 'legendary': return 1.5; case 'mythic': return 3.0; default: return 0; } }

function renderFacility() {
    const grid = document.getElementById('facility-grid'); if (!grid) return; grid.innerHTML = '';
    const configs = [ { key: 'herbivore', title: '🌿 Herbivore Haven', desc: 'Accepts Herbivores & Omnivores.', res: 'Coins', symbol: '🪙' }, { key: 'carnivore', title: '🥩 Carnivore Compound', desc: 'Accepts Carnivores & Omnivores.', res: 'Coins', symbol: '🪙' }, { key: 'genetics', title: '🧬 Genetics Lab', desc: 'Accepts Epic+ only. Generates Permits.', res: 'Permits', symbol: '🎫' } ];
    configs.forEach(conf => {
        let state = facilityState[conf.key]; let card = document.createElement('div'); card.className = `facility-card ${state.unlocked ? 'unlocked' : ''}`;
        if (!state.unlocked) { card.innerHTML = `<div class="facility-header"><h3 style="color:#666;">${conf.title}</h3><p>LOCKED</p></div><p style="color:#aaa; margin: 20px 0;">${conf.desc}</p><button class="fac-btn btn-unlock" onclick="unlockFacility('${conf.key}')">Unlock: ${state.cost} 🪙</button>`; } 
        else {
            let slotsHTML = ''; for (let i = 0; i < 3; i++) { if (i < state.level) { let dinoId = state.slots[i]; if (dinoId) { let dino = userCollection.find(d => d.id === dinoId); slotsHTML += `<div class="worker-slot filled" style="background-image: url('${dino ? dino.img : ''}');" onclick="unslotDino('${conf.key}', ${i})"></div>`; } else { slotsHTML += `<div class="worker-slot" onclick="openSlotSelection('${conf.key}', ${i})"><span style="font-size:2rem;">+</span></div>`; } } else { slotsHTML += `<div class="worker-slot locked">🔒</div>`; } }
            let amt = conf.key === 'genetics' ? Math.floor(state.storedPermits) : Math.floor(state.storedCoins);
            let upg = state.level < 3 ? `<button class="fac-btn btn-upgrade" onclick="upgradeFacility('${conf.key}')">Upgrade Slot ${state.level + 1} (${state.upgCost[state.level - 1]} 🪙)</button>` : `<button class="fac-btn btn-upgrade" style="opacity:0.5; cursor:not-allowed;">Max Level</button>`;
            card.innerHTML = `<div class="facility-header"><h3 style="color:var(--ui-gold);">${conf.title}</h3><p>Level ${state.level}</p></div><div class="facility-stats"><span>Output:</span><span id="fac-amt-${conf.key}" style="color:var(--ui-gold); font-size:1.5rem; font-weight:bold;">${amt} ${conf.symbol}</span></div><div class="facility-slots">${slotsHTML}</div><div class="facility-actions"><button class="fac-btn btn-collect" style="background:var(--accent-green); color:white;" onclick="collectFacility('${conf.key}')">COLLECT</button>${upg}</div>`;
        }
        grid.appendChild(card);
    });
}

window.unlockFacility = function(key) { if (coins >= facilityState[key].cost) { coins -= facilityState[key].cost; facilityState[key].unlocked = true; playSound('success'); saveUserData(); updateStatsUI(); renderFacility(); } else { playSound('error'); alert("Not enough coins!"); } };
window.upgradeFacility = function(key) { let cost = facilityState[key].upgCost[facilityState[key].level - 1]; if (coins >= cost) { coins -= cost; facilityState[key].level++; facilityState[key].slots.push(null); playSound('success'); saveUserData(); updateStatsUI(); renderFacility(); } else { playSound('error'); alert("Not enough coins!"); } };
window.collectFacility = function(key) { if (key === 'genetics') { let amt = Math.floor(facilityState[key].storedPermits); if (amt > 0) { permits += amt; facilityState[key].storedPermits -= amt; } } else { let amt = Math.floor(facilityState[key].storedCoins); if (amt > 0) { coins += amt; facilityState[key].storedCoins -= amt; } } playSound('success'); saveUserData(); updateStatsUI(); renderFacility(); };
window.unslotDino = function(key, idx) { facilityState[key].slots[idx] = null; saveUserData(); renderFacility(); };
window.openSlotSelection = function(key, idx) { activeFacilityKey = key; activeSlotIndex = idx; let used = []; Object.values(facilityState).forEach(f => f.slots.forEach(s => { if (s) used.push(s); })); let grid = document.getElementById('facility-dino-grid'); grid.innerHTML = ''; let count = 0; userCollection.forEach(dino => { if (used.includes(dino.id)) return; let valid = false; if (key === 'herbivore' && (dino.diet === 'Herbivore' || dino.diet === 'Omnivore')) valid = true; if (key === 'carnivore' && (dino.diet === 'Carnivore' || dino.diet === 'Omnivore')) valid = true; if (key === 'genetics' && (dino.rarity === 'epic' || dino.rarity === 'legendary' || dino.rarity === 'mythic')) valid = true; if (valid) { count++; let d = document.createElement('div'); d.innerHTML = createCardHTML(dino, true); d.querySelector('.card-wrapper').onclick = () => { facilityState[activeFacilityKey].slots[activeSlotIndex] = dino.id; playSound('click'); saveUserData(); renderFacility(); document.getElementById('facility-modal').classList.add('hidden'); }; grid.appendChild(d); } }); if (count === 0) grid.innerHTML = `<p style="color:#ff6b6b; font-size:1.5rem; text-align:center; width:100%;">No available dinosaurs match this facility.</p>`; document.getElementById('facility-modal').classList.remove('hidden'); };
document.querySelector('.close-facility-btn').addEventListener('click', () => { document.getElementById('facility-modal').classList.add('hidden'); });
document.getElementById('close-fac-tut-btn').addEventListener('click', () => { document.getElementById('facility-tutorial-modal').classList.add('hidden'); facilityTutorialDone = true; saveUserData(); });

// --- RANKINGS (LEADERBOARD) ---
function getRankTitle(rp) {
    if (rp >= 5000) return "<span style='color:#ff3333; font-weight:bold;'>APEX PREDATOR</span>";
    if (rp >= 3000) return "<span style='color:var(--epic); font-weight:bold;'>Diamond Explorer</span>";
    if (rp >= 1500) return "<span style='color:var(--legendary); font-weight:bold;'>Gold Explorer</span>";
    if (rp >= 500) return "<span style='color:#ccc; font-weight:bold;'>Silver Explorer</span>";
    return "<span style='color:#cd7f32; font-weight:bold;'>Bronze Explorer</span>";
}

function renderLeaderboard() {
    const tbody = document.querySelector('#leaderboard-table tbody'); if (!tbody) return;
    tbody.innerHTML = '';
    let players = [ { name: currentUser ? currentUser.toUpperCase() : "GUEST", rp: playerRP, isPlayer: true } ];
    const rivals = [ { name: "DR_GRANT", rp: 5000 }, { name: "HAMMOND_CEO", rp: 4200 }, { name: "CLEVER_GIRL", rp: 3500 }, { name: "FOSSIL_HUNTER99", rp: 2800 }, { name: "DINO_KING", rp: 2100 }, { name: "REX_TAMER", rp: 1500 }, { name: "AMBER_MINER", rp: 1200 }, { name: "IAN_MALCOLM", rp: 800 }, { name: "NEW_RECRUIT", rp: 300 } ];
    rivals.forEach(r => players.push({ name: r.name, rp: r.rp, isPlayer: false }));
    players.sort((a,b) => b.rp - a.rp);
    players.forEach((p, idx) => { let tr = document.createElement('tr'); if (p.isPlayer) tr.className = 'player-row'; tr.innerHTML = `<td>#${idx + 1}</td><td>${p.name}</td><td>${p.rp}</td><td>${getRankTitle(p.rp)}</td>`; tbody.appendChild(tr); });
}

// --- DAILY, QUESTS, MILESTONES ---
function getDailyStreakState() { let today = new Date().toDateString(); let yesterday = new Date(Date.now() - 86400000).toDateString(); let last = localStorage.getItem('dinoLastClaim_' + currentUser); let day = parseInt(localStorage.getItem('dinoStreakDay_' + currentUser) || '1'); if (last === today) return { ready: false, day: day }; if (last === yesterday) return { ready: true, day: day >= 7 ? 1 : day + 1 }; return { ready: true, day: 1 }; }
function renderDailyRoad() { const box = document.getElementById('daily-road-nodes'); if (!box) return; box.innerHTML = ''; let state = getDailyStreakState(); const map = { 1: { icon: "🪙", amt: "150 Coins", act: () => coins += 150 }, 2: { icon: "🪙", amt: "300 Coins", act: () => coins += 300 }, 3: { icon: "🪙", amt: "500 Coins", act: () => coins += 500 }, 4: { icon: "🎫", amt: "1 Permit", act: () => permits += 1 }, 5: { icon: "🪙", amt: "750 Coins", act: () => coins += 750 }, 6: { icon: "🎫", amt: "2 Permits", act: () => permits += 2 }, 7: { icon: "🪙", amt: "1500 Coins", act: () => coins += 1500 } }; for (let i = 1; i <= 7; i++) { let isClaimed = (i < state.day) || (!state.ready && i === state.day); let isActive = state.ready && (i === state.day); let div = document.createElement('div'); div.className = `reward-node ${isClaimed ? 'claimed' : ''} ${isActive ? 'active' : ''} ${i > state.day ? 'locked' : ''}`; div.innerHTML = `<h4>DAY ${i}</h4><div class="icon">${map[i].icon}</div><div class="amt">${map[i].amt}</div>`; if (isActive) { div.onclick = () => { map[i].act(); localStorage.setItem('dinoLastClaim_' + currentUser, new Date().toDateString()); localStorage.setItem('dinoStreakDay_' + currentUser, i); playSound('success'); saveUserData(); updateStatsUI(); renderDailyRoad(); }; } box.appendChild(div); } }
function renderQuestsUI() { 
    const list = document.getElementById('quests-list-container'); if (!list) return; list.innerHTML = ''; 
    const q1Done = qBattlesCount >= 2; list.innerHTML += `<div class="quest-card ${q1Done && !claimedQ1 ? 'completed' : ''}" ${q1Done && !claimedQ1 ? 'onclick="claimQuest(1)"' : ''}><h3>🎯 Arena Contender</h3><p>Complete 2 matches in the Gauntlet Arena.</p><div class="status">Progress: ${Math.min(qBattlesCount, 2)} / 2 | Reward: +2 Permits 🎫 ${claimedQ1 ? '(CLAIMED)' : (q1Done ? '✨ CLICK TO CLAIM!' : '')}</div></div>`; 
    const q2Done = qHatchedCount >= 1; list.innerHTML += `<div class="quest-card ${q2Done && !claimedQ2 ? 'completed' : ''}" ${q2Done && !claimedQ2 ? 'onclick="claimQuest(2)"' : ''}><h3>🥚 Paleontologist</h3><p>Hatch 1 egg from an Incubator.</p><div class="status">Progress: ${Math.min(qHatchedCount, 1)} / 1 | Reward: +500 Coins 🪙 ${claimedQ2 ? '(CLAIMED)' : (q2Done ? '✨ CLICK TO CLAIM!' : '')}</div></div>`; 
    const q3Done = qPuzzlePlayed; list.innerHTML += `<div class="quest-card ${q3Done && !claimedQ3 ? 'completed' : ''}" ${q3Done && !claimedQ3 ? 'onclick="claimQuest(3)"' : ''}><h3>🧬 DNA Decoder</h3><p>Play the Daily Dino Decode puzzle on the Home tab.</p><div class="status">Progress: ${qPuzzlePlayed ? 1 : 0} / 1 | Reward: +1000 Coins 🪙 ${claimedQ3 ? '(CLAIMED)' : (q3Done ? '✨ CLICK TO CLAIM!' : '')}</div></div>`; 
    const q4Done = qRPEarned >= 50; list.innerHTML += `<div class="quest-card ${q4Done && !claimedQ4 ? 'completed' : ''}" ${q4Done && !claimedQ4 ? 'onclick="claimQuest(4)"' : ''}><h3>🏆 Rank Climber</h3><p>Earn 50 Rank Points (RP) in the Arena.</p><div class="status">Progress: ${Math.min(qRPEarned, 50)} / 50 | Reward: +2 Permits 🎫 ${claimedQ4 ? '(CLAIMED)' : (q4Done ? '✨ CLICK TO CLAIM!' : '')}</div></div>`; 
    const q5Done = qSpeedUpCount >= 1; list.innerHTML += `<div class="quest-card ${q5Done && !claimedQ5 ? 'completed' : ''}" ${q5Done && !claimedQ5 ? 'onclick="claimQuest(5)"' : ''}><h3>⚡ Research Funding</h3><p>Speed up an incubating egg once using coins.</p><div class="status">Progress: ${Math.min(qSpeedUpCount, 1)} / 1 | Reward: +500 Coins 🪙 ${claimedQ5 ? '(CLAIMED)' : (q5Done ? '✨ CLICK TO CLAIM!' : '')}</div></div>`; 
    updateQuestNotificationDot(); 
}
window.claimQuest = function(q) { if (q === 1 && !claimedQ1) { permits += 2; claimedQ1 = true; } if (q === 2 && !claimedQ2) { coins += 500; claimedQ2 = true; } if (q === 3 && !claimedQ3) { coins += 1000; claimedQ3 = true; } if (q === 4 && !claimedQ4) { permits += 2; claimedQ4 = true; } if (q === 5 && !claimedQ5) { coins += 500; claimedQ5 = true; } playSound('success'); saveUserData(); updateStatsUI(); renderQuestsUI(); };
function updateQuestNotificationDot() { const dot = document.getElementById('quest-dot'); if (!dot) return; const hasUnclaimed = (qBattlesCount >= 2 && !claimedQ1) || (qHatchedCount >= 1 && !claimedQ2) || (qPuzzlePlayed && !claimedQ3) || (qRPEarned >= 50 && !claimedQ4) || (qSpeedUpCount >= 1 && !claimedQ5); if (hasUnclaimed) dot.classList.remove('hidden'); else dot.classList.add('hidden'); }

function checkAchievements() {
    const list = document.getElementById('milestones-list-container'); if (!list) return; let html = '';
    
    // M1
    const m1T = ["Stegosaurus", "Brachiosaurus", "Allosaurus", "Diplodocus", "Dilophosaurus"]; let m1O = 0; m1T.forEach(n => { if (userCollection.find(d => d.name === n)) m1O++; });
    if (!claimedM1) { html += `<div class="achievement-card"><h3>🦕 Jurassic Master</h3><p>Collect all 5 starting Jurassic dinosaurs.</p><div class="status">Status: ${m1O} / ${m1T.length} Found</div>${m1O >= m1T.length ? `<button class="fac-btn btn-collect" style="margin-top:15px; background:var(--ui-gold); color:black;" onclick="claimMilestone(1)">Claim Legendary Therizinosaurus!</button>` : ''}</div>`; }
    
    // M2
    if (claimedM1 && !claimedM2) {
        const required = ["Tyrannosaurus Rex", "Spinosaurus", "Carnotaurus", "Therizinosaurus"]; let apexC = 0; required.forEach(n => { if (userCollection.find(d => d.name === n)) apexC++; });
        let unique = new Set(userCollection.map(d => d.id)).size; let highest = userCollection.reduce((max, d) => Math.max(max, d.level || 1), 1); let allMet = (apexC === 4 && unique >= 18 && highest >= 3);
        html += `<div class="achievement-card" style="border-color:#ff3333;"><h3 style="color:#ff5252;">🦖 Apex Predator</h3><p>Dominate the prehistoric food chain:</p><div style="background:rgba(0,0,0,0.5); padding:10px; border-radius:5px; margin: 10px 0;"><p>1. Own Titans: ${apexC} / 4</p><p>2. 18 Unique Species: ${unique} / 18</p><p>3. Level 3+ Dinosaur: Lv. ${highest} / 3</p></div>${allMet ? `<button class="fac-btn btn-collect" style="background:#ff3333; color:white;" onclick="claimMilestone(2)">UNLEASH INDOMINUS PROTOTYPE!</button>` : `<div class="status">Prerequisites in Progress...</div>`}</div>`;
    }
    
    // M3
    if (!claimedM3) {
        html += `<div class="achievement-card"><h3>💰 Paleo Tycoon</h3><p>Hoard 10,000 Coins in your account.</p><div class="status">Status: ${Math.min(coins, 10000)} / 10000 Coins</div>${coins >= 10000 ? `<button class="fac-btn btn-collect" style="margin-top:15px; background:var(--ui-gold); color:black;" onclick="claimMilestone(3)">Claim 10 Permits!</button>` : ''}</div>`;
    }
    
    // M4
    let gauntletWins = parseInt(document.getElementById('gauntlet-wins')?.innerText || "0");
    if (!claimedM4) {
        html += `<div class="achievement-card"><h3>⚔️ Arena Champion</h3><p>Win 5 Gauntlet matches total.</p><div class="status">Status: ${Math.min(gauntletWins, 5)} / 5 Wins</div>${gauntletWins >= 5 ? `<button class="fac-btn btn-collect" style="margin-top:15px; background:var(--ui-gold); color:black;" onclick="claimMilestone(4)">Claim 5000 Coins!</button>` : ''}</div>`;
    }
    
    if (claimedM1 && claimedM2 && claimedM3 && claimedM4) { html += `<div class="achievement-card" style="border-color:var(--accent-green); text-align:center;"><h3 style="color:var(--accent-green);">🏆 ALL MILESTONES CONQUERED!</h3></div>`; }
    list.innerHTML = html;
}

window.claimMilestone = function(m) {
    let dino = null;
    if (m === 1 && !claimedM1) { claimedM1 = true; dino = JSON.parse(JSON.stringify(masterCatalog.find(d => d.id === 24))); dino.variant = 'standard'; if(!userCollection.find(d => d.id === dino.id)) userCollection.unshift(dino); } 
    else if (m === 2 && !claimedM2) { claimedM2 = true; dino = JSON.parse(JSON.stringify(mythicReward)); dino.variant = 'standard'; if(!userCollection.find(d => d.id === dino.id)) userCollection.unshift(dino); }
    else if (m === 3 && !claimedM3) { claimedM3 = true; permits += 10; playSound('success'); saveUserData(); checkAchievements(); updateStatsUI(); return;}
    else if (m === 4 && !claimedM4) { claimedM4 = true; coins += 5000; playSound('success'); saveUserData(); checkAchievements(); updateStatsUI(); return;}
    
    if (dino) {
        playSound('success'); document.getElementById('milestone-modal-title').innerText = "MILESTONE UNLOCKED!"; document.getElementById('milestone-modal-desc').innerText = `You claimed: ${dino.name}!`; document.getElementById('milestone-modal-card').innerHTML = createCardHTML(dino, true);
        document.getElementById('milestone-modal-claim-btn').onclick = () => { document.getElementById('milestone-modal').classList.add('hidden'); renderCatalog(); }; document.getElementById('milestone-modal').classList.remove('hidden');
        saveUserData(); confetti({ particleCount: 200, spread: 100 }); checkAchievements();
    }
};

// --- DINO WEB ENCYCLOPEDIA (FIXED TO SHOW STAT REASONS) ---
function renderDinoWebList(search = "") {
    const list = document.getElementById('dinoweb-list'); if (!list) return; list.innerHTML = '';
    if (search === "" || "prehistoric eras general info guide".includes(search.toLowerCase())) { let genLi = document.createElement('li'); genLi.className = 'dinoweb-list-item'; genLi.innerHTML = `<span>🌍</span> Prehistoric Eras Guide`; genLi.onclick = () => { document.querySelectorAll('.dinoweb-list-item').forEach(el => el.classList.remove('active')); genLi.classList.add('active'); loadErasArticle(); }; list.appendChild(genLi); }
    [...masterCatalog, mythicReward].sort((a,b) => a.name.localeCompare(b.name)).forEach(dino => {
        if (dino.name.toLowerCase().includes(search.toLowerCase())) { let li = document.createElement('li'); li.className = 'dinoweb-list-item'; li.innerHTML = `<span>${dino.dietIcon}</span> ${dino.name}`; li.onclick = () => { document.querySelectorAll('.dinoweb-list-item').forEach(el => el.classList.remove('active')); li.classList.add('active'); loadDinoArticle(dino); }; list.appendChild(li); }
    });
}
function loadErasArticle() { const content = document.getElementById('dinoweb-content'); if (!content) return; content.innerHTML = `<div class="article-header"><div><div class="article-title">Prehistoric Eras</div><div class="article-subtitle">Earth's Evolutionary Timeline</div></div><div style="font-size:4rem;">🌍</div></div><div class="article-text"><h3 style="color:var(--rare); font-family:'Teko'; font-size:2.2rem;">Triassic Period (252 - 201 MYA)</h3><p>All land was fused into the supercontinent Pangea. The climate was hot and arid, spawning the earliest true dinosaurs.</p><h3 style="color:var(--rare); font-family:'Teko'; font-size:2.2rem;">Jurassic Period (201 - 145 MYA)</h3><p>Pangea split into Laurasia and Gondwanaland. Lush tropical climates gave rise to titanic sauropods like Brachiosaurus and apex predators like Allosaurus.</p><h3 style="color:var(--rare); font-family:'Teko'; font-size:2.2rem;">Cretaceous Period (145 - 66 MYA)</h3><p>The pinnacle of dinosaur diversity, featuring Ankylosaurus, Triceratops, and Tyrannosaurus Rex, ending with the Chicxulub asteroid impact.</p></div>`; }
function loadDinoArticle(dino) { 
    const content = document.getElementById('dinoweb-content'); if (!content) return; 
    let statReasonsHtml = '';
    
    if(dino.statReasons) {
        statReasonsHtml = `
        <h4 style="font-family:'Teko'; font-size:2.2rem; color:var(--accent-green); margin-top:20px; border-bottom:1px solid #444; padding-bottom:5px;">🧬 ARCHIVE FIELD NOTES</h4>
        <ul style="list-style:none; margin-top:10px; font-size:1.15rem; color:#ccc; text-align:left;">
            <li style="margin-bottom:8px;"><strong>PAC (Pace):</strong> ${dino.statReasons.pac}</li>
            <li style="margin-bottom:8px;"><strong>PWR (Power):</strong> ${dino.statReasons.pwr}</li>
            <li style="margin-bottom:8px;"><strong>DEF (Defense):</strong> ${dino.statReasons.def}</li>
            <li style="margin-bottom:8px;"><strong>SIZ (Size):</strong> ${dino.statReasons.siz}</li>
            <li style="margin-bottom:8px;"><strong>IQ (Intelligence):</strong> ${dino.statReasons.iq}</li>
            <li style="margin-bottom:8px;"><strong>AGI (Agility):</strong> ${dino.statReasons.agi}</li>
        </ul>`;
    }
    
    content.innerHTML = `
    <div class="article-header">
        <div><div class="article-title">${dino.name}</div><div class="article-subtitle">${dino.era} Period | ${dino.diet}</div></div>
        <div style="font-size:4rem;">${dino.dietIcon}</div>
    </div>
    <div class="article-body">
        <div class="article-image-container">
            <img src="${dino.img}" class="article-image" style="border-color:${getOvrColor(dino.rarity)};">
            <table class="info-table"><tr><th>Era</th><td>${dino.era}</td></tr><tr><th>Diet</th><td>${dino.diet}</td></tr><tr><th>Dig Site</th><td>${dino.city} (${dino.region})</td></tr><tr><th>Base OVR</th><td>${dino.ovr}</td></tr></table>
        </div>
        <div class="article-text">
            <p>${dino.bio}</p>
            <div style="background:rgba(255,202,40,0.1); border-left:4px solid var(--ui-gold); padding:12px; margin:20px 0;">
                <h4 style="font-family:'Teko'; font-size:1.8rem; color:var(--ui-gold);">💡 DID YOU KNOW?</h4>
                <p style="color:white;">${dino.funFact}</p>
            </div>
            ${statReasonsHtml}
        </div>
    </div>`; 
}
let srch = document.getElementById('dinoweb-search'); if (srch) srch.addEventListener('input', (e) => renderDinoWebList(e.target.value));

// --- MAP LOGIC ---
function attachMapPinListeners() {
    document.querySelectorAll('.pin').forEach(pin => {
        pin.addEventListener('click', (e) => {
            if (!currentUser) return;
            playSound('click');
            let region = e.target.getAttribute('data-region');
            document.getElementById('dino-filter').value = region;
            switchView('Collection');
            renderCatalog(region, "region");
        });
    });
}

// --- NAVIGATION & VIEWS ---
function switchView(targetFilter) {
    views.forEach(v => document.getElementById(v).classList.add('hidden'));
    tabs.forEach(t => t.classList.remove('active'));
    let activeTab = Array.from(tabs).find(t => t.getAttribute('data-filter') === targetFilter);
    if (activeTab) activeTab.classList.add('active');
    
    document.querySelectorAll('.locked-overlay').forEach(o => o.classList.add('hidden'));
    document.querySelectorAll('.blur-target').forEach(o => o.classList.remove('blurred'));

    const restrictedViews = ['Arena', 'Facility', 'Rankings', 'Daily', 'Quests', 'Achievements', 'Map', 'DinoWeb'];
    
    if (!currentUser && restrictedViews.includes(targetFilter)) {
        let viewId = targetFilter.toLowerCase() + '-view';
        if (targetFilter === 'DinoWeb') viewId = 'dinoweb-view';
        let view = document.getElementById(viewId);
        if (view) {
            view.classList.remove('hidden');
            let overlay = view.querySelector('.locked-overlay');
            let blur = view.querySelector('.blur-target');
            if (overlay) overlay.classList.remove('hidden');
            if (blur) blur.classList.add('blurred');
        }
        return;
    }

    switch(targetFilter) {
        case 'Home': document.getElementById('home-view').classList.remove('hidden'); break;
        case 'About': document.getElementById('about-view').classList.remove('hidden'); break;
        case 'Collection': document.getElementById('collection-view').classList.remove('hidden'); renderCatalog(); break;
        case 'Facility': document.getElementById('facility-view').classList.remove('hidden'); renderFacility(); if (!facilityTutorialDone && currentUser) { setTimeout(() => document.getElementById('facility-tutorial-modal').classList.remove('hidden'), 500); } break;
        case 'Arena': document.getElementById('arena-view').classList.remove('hidden'); break;
        case 'Rankings': document.getElementById('rankings-view').classList.remove('hidden'); renderLeaderboard(); break;
        case 'Daily': document.getElementById('daily-view').classList.remove('hidden'); renderDailyRoad(); break;
        case 'Quests': document.getElementById('quests-view').classList.remove('hidden'); renderQuestsUI(); break;
        case 'Achievements': document.getElementById('achievements-view').classList.remove('hidden'); checkAchievements(); break;
        case 'Map': document.getElementById('map-view').classList.remove('hidden'); break;
        case 'DinoWeb': document.getElementById('dinoweb-view').classList.remove('hidden'); loadErasArticle(); break;
    }
}

tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        playSound('click');
        let filter = e.target.getAttribute('data-filter');
        switchView(filter);
    });
});

// --- AUTHENTICATION / LOGIN LOGIC ---
const loginBtn = document.getElementById('nav-login-btn');
const profileBtn = document.getElementById('nav-profile-btn');
const loginModal = document.getElementById('login-modal');
const profileModal = document.getElementById('profile-modal');
const authForm = document.getElementById('auth-form');
const authToggle = document.getElementById('auth-toggle-text');
const modalTitle = document.getElementById('modal-title');
const submitLoginBtn = document.getElementById('submit-login-btn');
let isRegistering = false;

function checkUserSession() {
    currentUser = localStorage.getItem('dinoUser');
    if (currentUser) {
        loginBtn.classList.add('hidden');
        profileBtn.classList.remove('hidden');
        
        document.getElementById('start-journey-btn').classList.remove('hidden');
        document.getElementById('start-journey-btn').innerText = "LET'S GET STARTED!";
        document.getElementById('home-register-btn').classList.add('hidden');
        
        let tutCallout = document.getElementById('tutorial-callout-box');
        if(tutCallout) tutCallout.classList.add('hidden');
        
        loadUserData();
        updateStatsUI();
        tabs.forEach(t => t.classList.remove('locked-tab'));
    } else {
        loginBtn.classList.remove('hidden');
        profileBtn.classList.add('hidden');
        
        document.getElementById('start-journey-btn').classList.remove('hidden');
        document.getElementById('start-journey-btn').innerText = "PLAY TUTORIAL";
        document.getElementById('home-register-btn').classList.remove('hidden');
        
        let tutCallout = document.getElementById('tutorial-callout-box');
        if(tutCallout) tutCallout.classList.remove('hidden');
        
        loadUserData();
        
        coins = 0; permits = 0;
        document.getElementById('coin-count').innerText = coins; 
        document.getElementById('permit-count').innerText = permits;
        
        ['Arena', 'Facility', 'Rankings', 'Daily', 'Quests', 'Achievements', 'Map', 'DinoWeb'].forEach(filter => {
            let tab = Array.from(tabs).find(t => t.getAttribute('data-filter') === filter);
            if(tab) tab.classList.add('locked-tab');
        });
    }
}

if(loginBtn) {
    loginBtn.addEventListener('click', () => { playSound('click'); isRegistering = false; modalTitle.innerText = 'EXPLORER ACCESS'; submitLoginBtn.innerText = 'LOGIN'; authToggle.innerText = 'Need an account? Register here'; loginModal.classList.remove('hidden'); });
}
if(profileBtn) {
    profileBtn.addEventListener('click', () => { 
        playSound('click'); 
        document.getElementById('profile-username').innerText = currentUser.toUpperCase();
        document.getElementById('profile-rank-title').innerHTML = getRankTitle(playerRP);
        document.getElementById('profile-species-count').innerText = `${new Set(userCollection.map(d => d.id)).size} / 23`;
        document.getElementById('profile-holo-count').innerText = userCollection.filter(d => d.variant === 'holo').length;
        document.getElementById('profile-primal-count').innerText = userCollection.filter(d => d.variant === 'primal').length;
        document.getElementById('profile-rp-count').innerText = playerRP;
        profileModal.classList.remove('hidden'); 
    });
}

document.querySelectorAll('.close-login-btn').forEach(btn => {
    btn.addEventListener('click', () => { playSound('click'); loginModal.classList.add('hidden'); });
});
document.querySelector('.close-profile-btn').addEventListener('click', () => { playSound('click'); profileModal.classList.add('hidden'); });

authToggle.addEventListener('click', () => {
    playSound('click');
    isRegistering = !isRegistering;
    if (isRegistering) { modalTitle.innerText = 'NEW EXPLORER'; submitLoginBtn.innerText = 'REGISTER'; authToggle.innerText = 'Already have an account? Login here'; } 
    else { modalTitle.innerText = 'EXPLORER ACCESS'; submitLoginBtn.innerText = 'LOGIN'; authToggle.innerText = 'Need an account? Register here'; }
});

authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('username-input').value.trim();
    const pass = document.getElementById('password-input').value.trim();
    
    if (user.length < 3) { playSound('error'); alert("Username must be at least 3 characters."); return; }
    
    if (isRegistering) {
        if (localStorage.getItem('dinoPass_' + user)) { playSound('error'); alert("Username already exists!"); return; }
        localStorage.setItem('dinoPass_' + user, pass);
        currentUser = user; localStorage.setItem('dinoUser', user);
        
        coins = 2000; permits = 3; playerRP = 1000;
        userCollection = [ JSON.parse(JSON.stringify(masterCatalog[0])), JSON.parse(JSON.stringify(masterCatalog[1])), JSON.parse(JSON.stringify(masterCatalog[2])) ];
        userCollection.forEach(d => d.variant = 'standard');
        incubators = [ { dino: JSON.parse(JSON.stringify(masterCatalog[3])), readyTime: Date.now() - 5000, speedUps: 0 }, null, null, null ];
        
        facilityState = { herbivore: { unlocked: true, level: 1, slots: [null], storedCoins: 0, cost: 0, upgCost: [1000, 2500] }, carnivore: { unlocked: false, level: 1, slots: [null], storedCoins: 0, cost: 2500, upgCost: [3000, 5000] }, genetics: { unlocked: false, level: 1, slots: [null], storedPermits: 0.0, cost: 5000, upgCost: [5000, 10000] } };
        dailyPuzzleState = { date: '', targetId: null, guesses: [], won: false, lost: false };
        qBattlesCount = 0; qHatchedCount = 0; qPuzzlePlayed = false; qRPEarned = 0; qSpeedUpCount = 0;
        claimedQ1 = false; claimedQ2 = false; claimedQ3 = false; claimedQ4 = false; claimedQ5 = false;
        claimedM1 = false; claimedM2 = false; claimedM3 = false; claimedM4 = false;
        facilityTutorialDone = false;

        saveUserData(); playSound('success'); loginModal.classList.add('hidden'); checkUserSession(); switchView('Home');
    } else {
        const storedPass = localStorage.getItem('dinoPass_' + user);
        if (storedPass && storedPass === pass) {
            currentUser = user; localStorage.setItem('dinoUser', user); playSound('success'); loginModal.classList.add('hidden'); checkUserSession(); switchView('Home');
        } else { playSound('error'); alert("Invalid username or password."); }
    }
});

document.getElementById('real-logout-btn').addEventListener('click', () => {
    playSound('click'); 
    currentUser = null; 
    localStorage.removeItem('dinoUser'); 
    profileModal.classList.add('hidden'); 
    checkUserSession(); 
    switchView('Home');
});

document.querySelectorAll('.overlay-register-btn').forEach(btn => {
    btn.addEventListener('click', () => { playSound('click'); isRegistering = true; modalTitle.innerText = 'NEW EXPLORER'; submitLoginBtn.innerText = 'REGISTER'; authToggle.innerText = 'Already have an account? Login here'; loginModal.classList.remove('hidden'); });
});

const startBtn = document.getElementById('start-journey-btn');
if(startBtn){
    startBtn.addEventListener('click', () => { 
        playSound('click'); 
        if(currentUser) { switchView('Collection'); } 
        else { switchView('About'); }
        window.scrollTo(0, 0); 
    });
}
const tutBtn = document.getElementById('about-continue-btn');
if(tutBtn){
    tutBtn.addEventListener('click', () => { playSound('click'); switchView('Collection'); window.scrollTo(0, 0); triggerExcavation(); });
}
const homeRegBtn = document.getElementById('home-register-btn');
if(homeRegBtn){
    homeRegBtn.addEventListener('click', () => { playSound('click'); isRegistering = true; modalTitle.innerText = 'NEW EXPLORER'; submitLoginBtn.innerText = 'REGISTER'; authToggle.innerText = 'Already have an account? Login here'; loginModal.classList.remove('hidden'); });
}
const tutRegBtn = document.getElementById('tutorial-register-btn');
if(tutRegBtn){
    tutRegBtn.addEventListener('click', () => { playSound('click'); document.getElementById('tutorial-complete-modal').classList.add('hidden'); isRegistering = true; modalTitle.innerText = 'NEW EXPLORER'; submitLoginBtn.innerText = 'REGISTER'; authToggle.innerText = 'Already have an account? Login here'; loginModal.classList.remove('hidden'); });
}

// Run startup routines
checkUserSession(); attachMapPinListeners(); switchView('Home');

}); // END DOMContentLoaded Wrapper