import { Card, CardPack, StorySeries } from "@/types/card";
import odinImg from "@/assets/cards/odin.jpg";
import thorImg from "@/assets/cards/thor.jpg";
import freyaImg from "@/assets/cards/freya.jpg";
import valkyrieImg from "@/assets/cards/valkyrie.jpg";
import lokiImg from "@/assets/cards/loki.jpg";
import yggdrasilImg from "@/assets/cards/yggdrasil.jpg";

export const cards: Card[] = [  {
    id: "odin-wisdom",
    name: "Odin's Wisdom",
    mythology: "The All-Father of Asgard",
    image: odinImg,
    rarity: "Legendary",
    price: 49.99,
    nfcEnabled: true,
    stock: 5,
    seriesId: "ragnarok-saga",
    seriesOrder: 1,
    story: {
      preview: "In the halls of Asgard, Odin gazed upon the nine realms from his high seat Hlidskjalf. The All-Father, with his single piercing eye, saw all that transpired across the cosmos. His two ravens, Huginn and Muninn, perched upon his shoulders, whispering secrets of thought and memory into his ears.\n\nOdin had sacrificed much for wisdom. He hung himself from Yggdrasil for nine days and nights, pierced by his own spear, to gain knowledge of the runes. He traded his eye at Mimir's well to drink from the waters of cosmic understanding. Such was the price of true enlightenment.",
      full: "In the halls of Asgard, Odin gazed upon the nine realms from his high seat Hlidskjalf. The All-Father, with his single piercing eye, saw all that transpired across the cosmos. His two ravens, Huginn and Muninn, perched upon his shoulders, whispering secrets of thought and memory into his ears.\n\nOdin had sacrificed much for wisdom. He hung himself from Yggdrasil for nine days and nights, pierced by his own spear, to gain knowledge of the runes. He traded his eye at Mimir's well to drink from the waters of cosmic understanding. Such was the price of true enlightenment.\n\nBut with great wisdom came great sorrow. Odin knew of Ragnarök, the twilight of the gods, and the fate that awaited him and all of Asgard. He saw the threads of destiny woven by the Norns, unchangeable and absolute. Yet still he prepared, gathering the greatest warriors to Valhalla, forging alliances, and seeking any path that might alter what seemed inevitable.\n\nWhen you hold this card, you channel Odin's relentless pursuit of knowledge. It reminds you that wisdom requires sacrifice, that true understanding comes at a cost. The All-Father teaches us that even when we see dark futures ahead, we must continue to strive, to learn, and to fight for what matters.\n\nThis NFC-enabled card contains the full saga of Odin's trials, his victories, and his ultimate fate at Ragnarök. Tap it with your device to unlock hidden runes and discover which aspect of Odin's wisdom speaks to your current journey."
    }
  },
  {
    id: "thor-strength",
    name: "Thor's Thunder",
    mythology: "God of Thunder and Lightning",
    image: thorImg,
    rarity: "Epic",
    price: 34.99,
    nfcEnabled: true,
    stock: 12,
    story: {
      preview: "Thunder cracked across the sky as Thor, mightiest of the Aesir, gripped Mjölnir with both hands. The hammer, forged by dwarven smiths in the heart of a dying star, hummed with barely contained power. Lightning danced along its surface, eager to be unleashed upon the enemies of Asgard.\n\nThor was not just the god of thunder—he was the protector of both gods and humans. While other gods schemed and plotted in their golden halls, Thor ventured into the wilderness, battling giants and monsters that threatened the realms.",
      full: "Thunder cracked across the sky as Thor, mightiest of the Aesir, gripped Mjölnir with both hands. The hammer, forged by dwarven smiths in the heart of a dying star, hummed with barely contained power. Lightning danced along its surface, eager to be unleashed upon the enemies of Asgard.\n\nThor was not just the god of thunder—he was the protector of both gods and humans. While other gods schemed and plotted in their golden halls, Thor ventured into the wilderness, battling giants and monsters that threatened the realms.\n\nHis strength was legendary. He once lifted the paw of Jörmungandr, the World Serpent, when it was disguised as a massive cat. He drank so deeply from a horn connected to the ocean that he lowered the sea level. His appetite matched his strength—entire oxen disappeared at his feasts, washed down with barrels of mead.\n\nYet for all his might, Thor possessed a straightforward nobility. He was quick to anger but also quick to forgive. He valued loyalty, honesty, and direct action. While Odin played games of cunning and Loki wove his deceptions, Thor simply did what was right, smashing through obstacles with Mjölnir's fury.\n\nThis card embodies Thor's unwavering strength and courage. When challenges seem insurmountable, channel the Thunder God's determination. Remember that true power comes not just from might, but from using that might to protect those who cannot protect themselves.\n\nTap this NFC card to hear the roar of thunder and discover which of Thor's legendary battles mirrors your own struggles."
    }
  },
  {
    id: "freya-beauty",
    name: "Freya's Blessing",
    mythology: "Goddess of Love and War",
    image: freyaImg,
    rarity: "Rare",
    price: 24.99,
    nfcEnabled: true,
    stock: 20,
    story: {
      preview: "Freya, most beautiful of all goddesses, walked through fields of gold, her famous necklace Brísingamen gleaming at her throat. Two cats pulled her chariot through clouds, while her falcon cloak allowed her to soar between realms. She was goddess of love, beauty, fertility—and war.\n\nMany mistakenly thought Freya soft because of her association with love. But she was also the first to choose among the battle-slain, taking half of the fallen warriors to her hall Fólkvangr, while Odin received the other half in Valhalla.",
      full: "Freya, most beautiful of all goddesses, walked through fields of gold, her famous necklace Brísingamen gleaming at her throat. Two cats pulled her chariot through clouds, while her falcon cloak allowed her to soar between realms. She was goddess of love, beauty, fertility—and war.\n\nMany mistakenly thought Freya soft because of her association with love. But she was also the first to choose among the battle-slain, taking half of the fallen warriors to her hall Fólkvangr, while Odin received the other half in Valhalla. She was a practitioner of seiðr, powerful magic that allowed her to see and shape fate itself.\n\nFreya knew both joy and sorrow intimately. When her husband Óðr disappeared, she wept tears of red gold that fell across the realms. Yet she never let grief diminish her power. She searched for him relentlessly, traveling in disguise through many lands, her determination as fierce as any warrior's.\n\nShe taught the Aesir that there is strength in beauty, power in love, and that the most complete beings embrace all aspects of themselves—the gentle and the fierce, the lover and the warrior. Her magic proved that understanding and compassion could be as potent as any weapon.\n\nThis card carries Freya's dual blessing: the courage to love deeply and the strength to fight for what you love. Let her remind you that vulnerability and power are not opposites but partners in the dance of life.\n\nTouch your device to this NFC card to unlock Freya's wisdom about balancing the heart and the sword."
    }
  },
  {
    id: "valkyrie-honor",
    name: "Valkyrie's Choice",
    mythology: "Choosers of the Slain",
    image: valkyrieImg,
    rarity: "Epic",
    price: 39.99,
    nfcEnabled: true,
    stock: 8,
    story: {
      preview: "They rode through storm clouds on winged horses, their armor gleaming like starlight. The Valkyries, Odin's shield-maidens, descended upon battlefields to choose the bravest of the fallen. Their decision determined a warrior's fate—would they join the honored dead in Valhalla, or take another path?\n\nBrynhildr, greatest of the Valkyries, knew the weight of choice. Each warrior she selected would feast and train in Odin's hall, preparing for the final battle at Ragnarök.",
      full: "They rode through storm clouds on winged horses, their armor gleaming like starlight. The Valkyries, Odin's shield-maidens, descended upon battlefields to choose the bravest of the fallen. Their decision determined a warrior's fate—would they join the honored dead in Valhalla, or take another path?\n\nBrynhildr, greatest of the Valkyries, knew the weight of choice. Each warrior she selected would feast and train in Odin's hall, preparing for the final battle at Ragnarök. But to be a Valkyrie was to understand that true courage meant more than skill in battle—it meant facing death with honor, protecting the weak, and remaining true to one's oaths even unto death.\n\nThe Valkyries themselves embodied this principle. They were warriors who had transcended mortality, beings of pure purpose dedicated to recognizing and honoring courage in others. They served mead in Valhalla's hall, trained alongside the einherjar, and would stand beside them when the final battle came.\n\nYet even Valkyries could fall. Brynhildr herself was punished by Odin for defying his command, stripped of her immortality and placed in an enchanted sleep within a ring of fire. Only the bravest hero could claim her—and when Sigurd came, their love story became legend.\n\nThis card reminds us that every choice carries weight, and that honor sometimes requires sacrifice. Like the Valkyries, we must choose wisely, act bravely, and accept the consequences of our decisions with dignity.\n\nScan this NFC card to receive your own Valkyrie's wisdom and discover what choice lies before you in the threads of fate."
    }
  },
  {
    id: "loki-cunning",
    name: "Loki's Mischief",
    mythology: "The Trickster God",
    image: lokiImg,
    rarity: "Legendary",
    price: 44.99,
    nfcEnabled: true,
    stock: 3,
    story: {
      preview: "Loki's laughter echoed through the halls of Asgard, a sound both musical and unsettling. The trickster god, blood brother to Odin himself, was impossible to pin down. Was he ally or enemy? Friend or foe? The answer was always: both, and neither.\n\nBorn of giants yet raised among gods, Loki existed between worlds. His cunning mind worked faster than Thor's hammer could strike. Where others saw problems, Loki saw opportunities for clever solutions—though his solutions often created new problems.",
      full: "Loki's laughter echoed through the halls of Asgard, a sound both musical and unsettling. The trickster god, blood brother to Odin himself, was impossible to pin down. Was he ally or enemy? Friend or foe? The answer was always: both, and neither.\n\nBorn of giants yet raised among gods, Loki existed between worlds. His cunning mind worked faster than Thor's hammer could strike. Where others saw problems, Loki saw opportunities for clever solutions—though his solutions often created new problems.\n\nIt was Loki who helped build Asgard's impregnable walls, though his method involved gambling with giants. Loki who retrieved Thor's stolen hammer through trickery and disguise. Loki who gave Odin his eight-legged horse Sleipnir, though the story of how was... complicated.\n\nBut Loki's nature was chaos. He cut Sif's golden hair as a prank. He caused the death of beautiful Baldr through jealousy and spite. His crimes eventually grew too severe even for Odin to forgive. The gods bound him beneath the earth with a serpent dripping venom upon his face, where he would remain until Ragnarök—when he would break free and lead the forces of chaos against Asgard itself.\n\nLoki represents transformation, change, and the breaking of rigid patterns. He reminds us that rules are made by those in power, that systems can be gamed, and that sometimes the only way forward is to overturn the board entirely. But he also warns us: unchecked chaos leads only to destruction.\n\nThis card's energy is potent and unpredictable. Use it wisely. Tap your NFC device to unlock Loki's tricks and discover which illusion currently clouds your vision."
    }
  },
  {
    id: "yggdrasil-unity",
    name: "Yggdrasil's Roots",
    mythology: "The World Tree",
    image: yggdrasilImg,
    rarity: "Legendary",
    price: 54.99,
    nfcEnabled: true,
    stock: 2,
    story: {
      preview: "At the center of all existence grew Yggdrasil, the World Tree, its branches reaching into every realm. This was no ordinary tree—it was the axis upon which reality turned, the connection between gods and mortals, between light and darkness, between order and chaos.\n\nYggdrasil's three roots stretched to three wells: Urðarbrunnr, where the Norns wove fate; Mímisbrunnr, where Odin gained wisdom; and Hvergelmir, where the dragon Níðhöggr gnawed at the root.",
      full: "At the center of all existence grew Yggdrasil, the World Tree, its branches reaching into every realm. This was no ordinary tree—it was the axis upon which reality turned, the connection between gods and mortals, between light and darkness, between order and chaos.\n\nYggdrasil's three roots stretched to three wells: Urðarbrunnr, where the Norns wove fate; Mímisbrunnr, where Odin gained wisdom; and Hvergelmir, where the dragon Níðhöggr gnawed at the root. Its branches held nine worlds: Asgard, home of the Aesir; Midgard, realm of humans; Jotunheim, land of giants; and six others, each with their own peoples and stories.\n\nThe tree was constantly under siege. Níðhöggr chewed its roots from below. Four stags ate its branches. Yet Yggdrasil endured, maintained by the Norns who tended it with water from Urðarbrunnr. The tree would survive even Ragnarök, when the nine realms burned and the gods fell. From its shelter, two humans would emerge to repopulate Midgard.\n\nYggdrasil represented the interconnection of all things. Actions in one realm rippled through others. The tree's health reflected the cosmos's health. When the gods acted with wisdom and honor, Yggdrasil flourished. When they gave in to pride and violence, the tree suffered.\n\nThis card is about seeing the bigger picture, understanding how everything connects. You are not separate from the world around you—you are a branch on the great tree, part of something vast and ancient. What you do matters, for it affects the whole.\n\nPlace your device against this NFC card to feel the pulse of Yggdrasil and understand your place in the great pattern of existence."
    }
  }
];

export const cardPacks: CardPack[] = [
  {
    id: "starter-pack",
    name: "Starter Pack",
    description: "3 Random Cards - Perfect for beginners",
    price: 29.99,
    originalPrice: 35.00,
    cardCount: 3,
    bonusCards: 0,
    image: "/placeholder.svg",
    rarityOdds: {
      common: 70,
      rare: 25,
      epic: 5,
      legendary: 0
    },
    badge: "BEST FOR BEGINNERS"
  },
  {
    id: "mystic-pack",
    name: "Mystic Pack",
    description: "5 Random Cards + 1 Bonus Card",
    price: 49.99,
    originalPrice: 65.00,
    cardCount: 5,
    bonusCards: 1,
    image: "/placeholder.svg",
    rarityOdds: {
      common: 50,
      rare: 30,
      epic: 15,
      legendary: 5
    },
    badge: "MOST POPULAR"
  },
  {
    id: "legendary-pack",
    name: "Legendary Pack",
    description: "10 Cards + 3 Bonus + 1 Guaranteed Legendary",
    price: 99.99,
    originalPrice: 150.00,
    cardCount: 10,
    bonusCards: 3,
    image: "/placeholder.svg",
    rarityOdds: {
      common: 30,
      rare: 35,
      epic: 25,
      legendary: 10
    },
    badge: "BEST VALUE",
    guaranteedLegendary: true
  }
];
