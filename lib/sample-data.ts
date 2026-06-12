import type { Novel, Chapter } from './types';

export const SAMPLE_NOVELS: Novel[] = [
  {
    slug: 'the-great-mage',
    title: 'The Great Mage Returns',
    author: 'Lee Sunghoon',
    description:
      'After 3000 years of reincarnation, the legendary Great Mage finally returns to a world that has forgotten magic. Armed with ancient knowledge and modern wit, he must navigate academies, dungeons, and the occasional coffee shop.',
    cover_url: 'https://picsum.photos/seed/mage/400/600',
    status: 'ongoing',
    genre: ['Fantasy', 'Action', 'Comedy'],
    chapters_sheet_id: 'sample-chapters-sheet-1',
    published: true,
  },
  {
    slug: 'sword-empress',
    title: 'Sword Empress',
    author: 'Kim Yuna',
    description:
      'In a world where only men can wield qi, Yuna defies the heavens by awakening the legendary Sword Empress class. Now she must carve her own path through rival sects, political intrigue, and monster hordes.',
    cover_url: 'https://picsum.photos/seed/sword/400/600',
    status: 'ongoing',
    genre: ['Fantasy', 'Romance', 'Martial Arts'],
    chapters_sheet_id: 'sample-chapters-sheet-2',
    published: true,
  },
  {
    slug: 'dungeon-chef',
    title: 'Dungeon Chef',
    author: 'Park Minsoo',
    description:
      'What if the most dangerous dungeon in the world was also a five-star restaurant? A retired adventurer opens a bistro inside an S-rank dungeon, serving monsters to monsters.',
    cover_url: 'https://picsum.photos/seed/chef/400/600',
    status: 'completed',
    genre: ['Fantasy', 'Slice of Life', 'Comedy'],
    chapters_sheet_id: 'sample-chapters-sheet-3',
    published: true,
  },
  {
    slug: 'neon-samurai',
    title: 'Neon Samurai',
    author: 'Tanaka Hiroshi',
    description:
      'Cyberpunk meets feudal Japan. In Neo-Edo 2145, a rogue samurai with a plasma katana fights corrupt megacorporations to protect the last cherry blossom tree.',
    cover_url: 'https://picsum.photos/seed/neon/400/600',
    status: 'ongoing',
    genre: ['Sci-Fi', 'Action', 'Cyberpunk'],
    chapters_sheet_id: 'sample-chapters-sheet-4',
    published: true,
  },
  {
    slug: 'hidden-novel',
    title: 'The Hidden Novel',
    author: 'Secret Author',
    description: 'This novel is not published and should not appear.',
    cover_url: '',
    status: 'ongoing',
    genre: [],
    chapters_sheet_id: '',
    published: false,
  },
];

export const SAMPLE_CHAPTERS: Record<string, Chapter[]> = {
  'sample-chapters-sheet-1': [
    {
      chapter_number: 1,
      title: 'Chapter 1: The Awakening',
      docs_id: 'sample-doc-1',
      published: true,
      published_at: '2025-06-01',
    },
    {
      chapter_number: 2,
      title: 'Chapter 2: First Day at the Academy',
      docs_id: 'sample-doc-2',
      published: true,
      published_at: '2025-06-08',
    },
    {
      chapter_number: 3,
      title: 'Chapter 3: The Forgotten Spell',
      docs_id: 'sample-doc-3',
      published: true,
      published_at: '2025-06-15',
    },
    {
      chapter_number: 4,
      title: 'Chapter 4: Dungeon Break',
      docs_id: 'sample-doc-4',
      published: true,
      published_at: '2025-06-22',
    },
    {
      chapter_number: 5,
      title: 'Chapter 5: The Rival Appears',
      docs_id: 'sample-doc-5',
      published: false,
      published_at: '',
    },
  ],
  'sample-chapters-sheet-2': [
    {
      chapter_number: 1,
      title: 'Chapter 1: The Sword Awakens',
      docs_id: 'sample-doc-6',
      published: true,
      published_at: '2025-05-15',
    },
    {
      chapter_number: 2,
      title: 'Chapter 2: Sect Entrance Exam',
      docs_id: 'sample-doc-7',
      published: true,
      published_at: '2025-05-22',
    },
    {
      chapter_number: 3,
      title: 'Chapter 3: First Duel',
      docs_id: 'sample-doc-8',
      published: true,
      published_at: '2025-05-29',
    },
  ],
  'sample-chapters-sheet-3': [
    {
      chapter_number: 1,
      title: 'Chapter 1: Opening Day',
      docs_id: 'sample-doc-9',
      published: true,
      published_at: '2025-04-01',
    },
    {
      chapter_number: 2,
      title: 'Chapter 2: The First Customer',
      docs_id: 'sample-doc-10',
      published: true,
      published_at: '2025-04-08',
    },
    {
      chapter_number: 3,
      title: 'Chapter 3: Dragon Steak',
      docs_id: 'sample-doc-11',
      published: true,
      published_at: '2025-04-15',
    },
    {
      chapter_number: 4,
      title: 'Chapter 4: Food Critics from Hell',
      docs_id: 'sample-doc-12',
      published: true,
      published_at: '2025-04-22',
    },
    {
      chapter_number: 5,
      title: 'Chapter 5: The Grand Feast (Finale)',
      docs_id: 'sample-doc-13',
      published: true,
      published_at: '2025-04-29',
    },
  ],
  'sample-chapters-sheet-4': [
    {
      chapter_number: 1,
      title: 'Chapter 1: Neon Streets',
      docs_id: 'sample-doc-14',
      published: true,
      published_at: '2025-06-01',
    },
    {
      chapter_number: 2,
      title: 'Chapter 2: The Zaibatsu\'s Offer',
      docs_id: 'sample-doc-15',
      published: true,
      published_at: '2025-06-08',
    },
  ],
};

/** Sample HTML content for chapter docs (used in dev mode) */
export const SAMPLE_DOC_HTML: Record<string, string> = {
  'sample-doc-1': `<h1>The Awakening</h1>
<p>The void was cold. It had been cold for three thousand years.</p>
<p>When Magnus opened his eyes, the first thing he saw was a ceiling fan. Not the gilded chandeliers of the Mage Tower, not the endless void of the space between spaces. A ceiling fan. White. Slightly dusty. Spinning with a faint wobble.</p>
<p>"What in the nine hells..." he muttered, sitting up.</p>
<p>The room was small and square, with a single window letting in harsh fluorescent light. A desk. A strange glowing rectangle on the wall. A door made of some cheap composite material.</p>
<p>He looked down at his hands. Young hands. Smooth, unblemished. Not the gnarled, rune-scarred fingers of the Great Mage.</p>
<p>"Reincarnation," he whispered. "It actually worked."</p>
<p>A flood of memories rushed in — not his own, but the original occupant of this body. A nineteen-year-old boy named Jinwoo, F-rank hunter, bottom of his class at the Hunter Academy. Parents dead. No money. No talent. No future.</p>
<p>Magnus — now Jinwoo — swung his legs off the bed and stood up. His body was weak, pitifully so. But that didn't matter. The mind of the greatest mage in history now inhabited this vessel.</p>
<p>He raised a hand and whispered, "<em>Ignis</em>."</p>
<p>A small flame flickered to life above his palm.</p>
<p>He smiled. Magic still worked. The world had changed, but the fundamental laws remained.</p>
<p>"Alright," he said to the empty room. "Time to get to work."</p>`,

  'sample-doc-2': `<h1>First Day at the Academy</h1>
<p>The Hunter Academy loomed before him, all glass and steel and arrogance. Students in crisp uniforms streamed through the gates, their mana signatures flaring with the casual confidence of the privileged.</p>
<p>Jinwoo adjusted his worn backpack and walked inside.</p>
<p>The entrance hall was a cathedral to modern hunting culture. Holographic displays showed rankings. Trophy cases held monster parts. A massive banner proclaimed: "EXCELSIOR ACADEMY — WHERE HEROES ARE MADE."</p>
<p>"Watch it, F-rank," someone sneered, bumping his shoulder.</p>
<p>Jinwoo didn't bother turning. He could sense the boy's mana — barely D-rank. In his previous life, he wouldn't have even registered as a threat.</p>
<p>His homeroom was on the third floor. Room 3-B. As he entered, the chatter died for a moment, replaced by whispers.</p>
<p>"That's the F-rank..."</p>
<p>"How is he even here?"</p>
<p>"Scholarship pity case."</p>
<p>Jinwoo took a seat by the window and pulled out a notebook. Let them talk. In six months, they'd be begging to be his apprentices.</p>
<p>The instructor, a stocky man with a fire mana affinity, walked in and wrote his name on the board: "Professor Kang."</p>
<p>"Welcome to Mana Theory 101," he said. "Today we'll be reviewing the basic elemental affinities. Can anyone tell me the seven primary elements?"</p>
<p>Silence. Then a girl in the front row raised her hand. "Fire, water, earth, wind, light, darkness, and... lightning?"</p>
<p>"Correct," Professor Kang said. "And which is the rarest?"</p>
<p>Jinwoo almost laughed. In his time, there had been <em>twelve</em> primary elements. And spatial magic — what these people called "the rarest" — was just Tuesday for him.</p>
<p>This was going to be a very long semester.</p>`,

  'sample-doc-3': `<h1>The Forgotten Spell</h1>
<p>The academy library was the one place Jinwoo actually enjoyed. It smelled of old paper and quiet desperation — the latter coming mostly from students cramming for exams.</p>
<p>He'd been here every evening for two weeks, cross-referencing modern mana theory with his ancient knowledge. The conclusions were staggering.</p>
<p>"They've forgotten <em>everything</em>," he murmured, running a finger down a dusty tome. "Mana compression, layered casting, elemental fusion... it's all gone."</p>
<p>Modern magic was crude. Hunters simply pumped raw mana into their bodies and hit things harder. The few "mages" in this era could barely manage basic elemental blasts. It was like watching cavemen discover fire and declare themselves masters of the flame.</p>
<p>He found the book he was looking for in the restricted section — bypassing the magical lock with a spell so simple it barely registered as magic. <em>Advanced Mana Theory, 3rd Edition</em>.</p>
<p>Chapter 7: "Theoretical Limits of Single-Element Casting."</p>
<p>Jinwoo skimmed it and snorted. According to this, casting two elements simultaneously was "theoretically impossible." He could do seven. Blindfolded. While making tea.</p>
<p>But one passage caught his eye:</p>
<p>"<em>Ancient texts refer to a lost art known as 'layered casting,' wherein multiple spells are woven together. No modern practitioner has successfully replicated this technique.</em>"</p>
<p>There was a footnote citing a fragment of a scroll recovered from an S-rank dungeon. The scroll was kept in the academy vault.</p>
<p>Jinwoo closed the book and smiled. It seemed the world hadn't forgotten <em>everything</em>. Just enough to be dangerous.</p>`,

  'sample-doc-4': `<h1>Dungeon Break</h1>
<p>The sirens started at 3:47 PM.</p>
<p>Jinwoo was in the middle of lunch — a sad sandwich from the cafeteria — when the ground shook and the emergency broadcast system crackled to life.</p>
<p>"<strong>ATTENTION. A DUNGEON BREAK HAS BEEN DETECTED IN SECTOR 7. ALL CITIZENS EVACUATE IMMEDIATELY. B-RANK AND ABOVE HUNTERS REPORT TO THE GATE.</strong>"</p>
<p>Students screamed and ran. Professors shouted orders. Jinwoo calmly finished his sandwich.</p>
<p>Sector 7 was three blocks from the academy. He could sense the mana signature from here — unstable, chaotic. Probably a C-rank gate that had destabilized due to poor maintenance. Typical.</p>
<p>By the time he walked outside, the first wave of monsters was already pouring through the tear in reality. Goblin variants, by the look of them. Ugly little things with too many teeth.</p>
<p>A group of students was trapped near the east gate, surrounded. The professors were busy holding the main breach. No one was coming for them.</p>
<p>Jinwoo sighed. "So much for keeping a low profile."</p>
<p>He raised a single finger. "<em>Fulgur. Gelu. Ignis.</em>"</p>
<p>Three elements, three spells, woven together into a single casting. A bolt of lightning froze mid-air, then erupted into a storm of ice-shrouded flame. The goblins didn't even have time to scream.</p>
<p>When the dust settled, the trapped students stared at him with wide eyes.</p>
<p>"How..." one of them whispered.</p>
<p>Jinwoo shrugged. "I studied."</p>
<p>He walked away before anyone could ask more questions. But he knew the secret was out now. The F-rank who could cast three elements simultaneously. By tomorrow, everyone would know.</p>
<p>The Great Mage was back — and the world was about to find out.</p>`,

  'sample-doc-6': `<h1>The Sword Awakens</h1>
<p>The sword chose her at midnight, under a blood moon.</p>
<p>Yuna had been meditating — or trying to. The other disciples had laughed when she said she could feel qi. "Women can't cultivate," they'd said. "It's a biological fact."</p>
<p>But the sword didn't seem to care about biology.</p>
<p>It appeared in her hands as if it had always been there: a blade of pure starlight, impossibly light, humming with an energy that resonated with something deep in her soul.</p>
<p>A voice echoed in her mind: <em>"Sword Empress class activated. Bearer recognized."</em></p>
<p>Yuna opened her eyes and looked at the blade. It was beautiful — and terrifying.</p>
<p>"Sword Empress," she whispered. "What does that even mean?"</p>
<p>The sword pulsed in response, and knowledge flooded her mind. Techniques. Stances. A legacy spanning millennia. Every Sword Empress who had come before her, their experiences, their triumphs, their failures.</p>
<p>She was the first in five hundred years.</p>
<p>And she was a woman in a world that said women couldn't cultivate.</p>
<p>Yuna stood up, the blade still humming in her grip. The sect would find out eventually. They'd try to suppress her, discredit her, maybe worse. The path ahead was dangerous.</p>
<p>But looking at the starlight blade in her hands, she found she didn't care.</p>
<p>"Let them try," she said, and the sword sang in agreement.</p>`,

  'sample-doc-9': `<h1>Opening Day</h1>
<p>The sign outside read: "THE DUNGEON DINER — Good Food, No Adventuring Required."</p>
<p>Minsoo stepped back to admire his handiwork. The sign was crooked. The paint was still wet. And the building was technically inside an S-rank dungeon, which meant his only customers would be monsters and the occasional suicidal adventurer.</p>
<p>Perfect.</p>
<p>"This is insane," his former party leader had said. "You're going to die."</p>
<p>"I've been an S-rank hunter for twenty years," Minsoo had replied. "I've killed dragons, demons, and at least three things that didn't have names. I think I can handle running a restaurant."</p>
<p>He'd retired from hunting three months ago, after taking a fireball to the knee. The healer said he'd walk again, but he'd never run. And in the hunting world, if you can't run, you're dead.</p>
<p>So here he was. Dungeon level 47. The ambient mana made the food taste better — he'd discovered that by accident during a raid. And the monsters? Most of them were actually pretty polite once you got to know them.</p>
<p>The bell above the door chimed.</p>
<p>Minsoo turned around. A minotaur was standing in the doorway, awkwardly stooping to fit under the frame.</p>
<p>"Table for one?" Minsoo asked.</p>
<p>The minotaur nodded and pointed at the menu. "What's... pasta?"</p>
<p>Minsoo grinned. "Have a seat. You're about to find out."</p>`,

  'sample-doc-14': `<h1>Neon Streets</h1>
<p>The rain in Neo-Edo wasn't water. It was industrial runoff mixed with atmospheric nanites, glowing faintly pink as it fell. Tourists called it romantic. Locals called it carcinogenic.</p>
<p>Kaito pulled his cloak tighter and kept walking. The plasma katana at his hip hummed softly, a reminder that even in this neon-soaked nightmare, some things still had edges.</p>
<p>He was on his way to meet a client when the first drone found him.</p>
<p>It was a corporate model — sleek, black, with the Mitsuhara logo stamped on its chassis. It hovered at eye level and projected a hologram of a man in an expensive suit.</p>
<p>"Kaito. You're a hard man to find."</p>
<p>"I try."</p>
<p>"The Director wants a word. Your little... rebellion... has cost us quite a bit of money."</p>
<p>Kaito kept walking. "Tell the Director I'll send a refund."</p>
<p>The drone zipped in front of him. "This isn't a request, samurai. Come with us, or—"</p>
<p>Kaito's blade was out before the drone could finish. One clean cut, and it fell to the ground in two pieces, sparking.</p>
<p>"Or what?" he said to the broken machine.</p>
<p>But he knew the answer. Mitsuhara Corporation didn't make requests. They made examples. And by tomorrow morning, his face would be on every bounty board in the city.</p>
<p>He turned down an alley and disappeared into the neon rain.</p>`,

  'sample-doc-5': `<h1>The Rival Appears</h1>
<p>This chapter has not yet been published.</p>`,

  'sample-doc-7': `<h1>Sect Entrance Exam</h1>
<p>The Azure Cloud Sect's entrance exam was legendary for its difficulty. Only one in a hundred applicants passed.</p>
<p>Yuna walked through the gates with the other candidates — all men. They stared at her like she was a stray cat that had wandered into a tiger's den.</p>
<p>"Lost, little girl?" one of them called out.</p>
<p>She ignored him.</p>
<p>The first test was qi manifestation. Each candidate had to shatter a spirit stone with their qi. Most managed it within three tries. The loudmouth from before shattered his on the second attempt and shot Yuna a smug look.</p>
<p>Her turn. She placed her hand on the stone and let the Sword Empress qi flow — just a trickle, barely a whisper of her true power.</p>
<p>The stone didn't shatter. It <em>vaporized</em>.</p>
<p>Silence fell over the testing ground.</p>
<p>"...Pass," the examiner said, his voice noticeably higher than before.</p>
<p>Yuna walked to the next station without a word. The loudmouth didn't meet her eyes.</p>`,

  'sample-doc-8': `<h1>First Duel</h1>
<p>The duel was supposed to be a formality — a senior disciple demonstrating techniques for the juniors.</p>
<p>Yuna stood across from Senior Brother Wei, the sect's third-ranked disciple. He was known for his Water Serpent technique, a fluid style that had defeated forty challengers.</p>
<p>"Don't worry," Wei said with a condescending smile. "I'll go easy on you."</p>
<p>Yuna drew her starlight blade. The crowd gasped — they'd never seen a weapon like it.</p>
<p>"Don't," she said.</p>
<p>Wei's smile faltered. Then he attacked.</p>
<p>The Water Serpent technique was beautiful, Yuna had to admit. Wei's blade flowed like a river, seeking openings, adapting to her movements. Against any normal opponent, it would have been overwhelming.</p>
<p>But Yuna wasn't a normal opponent. She was the Sword Empress.</p>
<p>She moved through his attacks like sunlight through leaves, her starlight blade leaving trails of silver in its wake. Three exchanges. Five. Ten.</p>
<p>Then she saw her opening.</p>
<p>One strike. Wei's sword clattered to the ground. Her blade stopped a millimeter from his throat.</p>
<p>The courtyard was dead silent.</p>
<p>"Good technique," Yuna said, lowering her blade. "More practice and you might be dangerous."</p>
<p>She walked off the dueling platform, and this time, no one called her "little girl."</p>`,

  'sample-doc-10': `<h1>The First Customer</h1>
<p>The minotaur's name was Greg. He was a floor boss on level 52, and he was, apparently, tired of eating raw adventurers.</p>
<p>"No offense," Greg said between bites of carbonara, "but humans taste terrible. All that processed food. You ever eaten an organic adventurer? Much better. But still. This? This is <em>amazing</em>."</p>
<p>Minsoo poured him another glass of wine. "I aim to please."</p>
<p>Word spread fast in the dungeon. By the end of the first week, Minsoo had served a lich (who couldn't eat but enjoyed the ambiance), a family of slimes (they absorbed the food rather than ate it, but they paid in gold coins), and a dragon who was "just here for the dessert menu."</p>
<p>The adventurers were a different story. Most of them assumed the diner was a trap and tried to attack first. Minsoo had to install a "no combat" sign — enforced by a very large, very grumpy Greg the minotaur.</p>
<p>"This is insane," his former party leader said during her second visit. "You're serving spaghetti to a lich."</p>
<p>"The lich says the marinara sauce is 'adequate for mortal fare.' I'm taking that as a compliment."</p>
<p>She shook her head. "You've really lost it."</p>
<p>"Maybe," Minsoo said, plating a risotto for a passing wraith. "But I haven't been this happy in years."</p>`,

  'sample-doc-15': `<h1>The Zaibatsu's Offer</h1>
<p>The Mitsuhara headquarters was a kilometer-high spire of black glass and holographic advertisements. It dominated the Neo-Edo skyline like a middle finger aimed at the heavens.</p>
<p>Kaito wasn't here by choice. The Director had made that clear. "Come voluntarily, or we'll bring you in pieces."</p>
<p>The lobby was all polished chrome and artificial cherry blossoms. A receptionist with glowing cybernetic eyes gestured him toward the elevator. "Penthouse. The Director is expecting you."</p>
<p>The elevator ride took three minutes. Classical music played. Kaito counted the hidden turrets — seven. They weren't taking chances.</p>
<p>At the top, the Director was waiting in a office that had no walls — just windows overlooking the neon sprawl. He was old, or looked old. In Neo-Edo, with enough money, you could look any age you wanted.</p>
<p>"Kaito." He didn't offer a seat. "You've been a thorn in my side for six months. Do you know how much money you've cost this corporation?"</p>
<p>"I have a rough estimate."</p>
<p>"Forty-seven billion yen. That's the value of the facilities you've destroyed, the shipments you've intercepted, and the personnel you've... retired."</p>
<p>Kaito said nothing.</p>
<p>"But I'm not a man who holds grudges," the Director continued. "I'm a businessman. And I believe there's a deal to be made here."</p>
<p>He slid a data chip across the desk.</p>
<p>"Work for me. Full pardon. More money than you can spend. All you have to do is stop protecting the Sakura District."</p>
<p>The Sakura District. The last place in Neo-Edo where real cherry blossoms grew. The last piece of the old world that the corporations hadn't paved over.</p>
<p>Kaito looked at the chip, then at the Director.</p>
<p>"No."</p>
<p>The Director's smile didn't waver, but his eyes went cold. "I was hoping you'd say that. It's more fun this way."</p>
<p>He pressed a button under his desk, and all seven turrets activated at once.</p>
<p>Kaito's plasma katana was already in his hand.</p>`,

  'sample-doc-11': `<h1>Dragon Steak</h1>
<p>"You want me to cook... you?" Minsoo stared at the ancient red dragon who had just made the most unusual request of his career.</p>
<p>"Don't be ridiculous," the dragon rumbled. "I want you to cook my <em>shedding</em>. I molt every century. The old scales and... bits... are perfectly edible. Some say they're a delicacy."</p>
<p>Minsoo looked at the pile of dragon scales the size of dinner plates. "I'm going to need a bigger pan."</p>
<p>Three hours later, "Dragon Steak" was on the menu. It was, to Minsoo's surprise, actually delicious — somewhere between wagyu beef and smoked salmon, with a natural mana infusion that made your teeth tingle.</p>
<p>The dish became legendary. Adventurers who had never set foot in the dungeon started coming just for the Dragon Steak. The dragon, whose name was Pyrothraxus the Eternal but who preferred "Phil," became a regular.</p>
<p>"You know," Phil said one evening, watching Minsoo cook, "in three thousand years, no one has ever asked me how I like my steak cooked."</p>
<p>"How do you like it?"</p>
<p>"Medium rare. With a side of respect."</p>
<p>Minsoo laughed and flipped the steak. "Coming right up, Phil."</p>`,

  'sample-doc-12': `<h1>Food Critics from Hell</h1>
<p>Literally from hell.</p>
<p>The three demons arrived on a Tuesday. They wore impeccable suits, carried leather-bound notebooks, and had the kind of smug expressions that only food critics and demons could pull off simultaneously.</p>
<p>"We're from the Infernal Review," the lead demon said, adjusting his horn-rimmed glasses. "We've heard... things... about this establishment."</p>
<p>Minsoo wiped his hands on his apron. "Table for three?"</p>
<p>"We'll start with the appetizers. Surprise us."</p>
<p>What followed was the most stressful dinner service of Minsoo's life. The demons dissected every dish with clinical precision. The soup was "ambitious but unfocused." The risotto had "texture inconsistencies." The Dragon Steak was "overrated, though the mana infusion shows technical competence."</p>
<p>Minsoo was ready to throw them out. But then they reached dessert.</p>
<p>It was a simple dish — matcha tiramisu, a recipe from his grandmother. Nothing fancy. Nothing revolutionary. Just home.</p>
<p>The lead demon took one bite. His pen stopped moving.</p>
<p>He took another bite. His companions exchanged glances.</p>
<p>"This," the demon said quietly, "tastes like my mother's cooking. Before the fall. Before... everything."</p>
<p>A single tear rolled down his infernal cheek.</p>
<p>The review came out the next day. Five pitchforks. "The tiramisu alone is worth damning your soul."</p>`,

  'sample-doc-13': `<h1>The Grand Feast (Finale)</h1>
<p>The Dungeon Diner's first anniversary was a celebration like no other.</p>
<p>Every monster Minsoo had ever served showed up. Greg the minotaur brought flowers (he'd picked them from the poison garden on level 33). Phil the dragon provided the entertainment — a light show of carefully controlled flame. The lich composed a poem. It was terrible, but Minsoo appreciated the effort.</p>
<p>Even the adventurers came, setting aside their weapons at the door. For one night, the dungeon wasn't about fighting. It was about food.</p>
<p>Minsoo stood in the kitchen, looking out at the impossible gathering. A year ago, he'd been a broken hunter with a bad knee and no future. Now he had a restaurant. A community. A home.</p>
<p>"Speech!" Greg bellowed. "Speech!"</p>
<p>The chant was taken up by monsters and adventurers alike. Minsoo walked out of the kitchen, wiping his hands on his apron one last time.</p>
<p>"I just wanted to cook," he said. "That's all. I never wanted to be a hero or a legend. I just wanted to make good food for people who'd appreciate it."</p>
<p>He looked around the room — at the monsters, the adventurers, the demons who'd become regulars after that first review.</p>
<p>"And I guess I did. So thank you. All of you. For being my customers. My critics. My friends."</p>
<p>He raised a glass. "To the Dungeon Diner."</p>
<p>"TO THE DUNGEON DINER!"</p>
<p>And somewhere in the back, Phil the dragon sniffled and pretended he had something in his eye.</p>`,

};
