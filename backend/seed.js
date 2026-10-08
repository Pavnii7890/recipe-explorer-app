// Seed script: inserts sample recipes into the database.
// Usage (from the backend folder): npm run seed
// Requires at least one registered user (sign up in the app first).

const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Recipe = require('./models/Recipe');
const User = require('./models/User');

dotenv.config();

const recipes = [
  {
    title: 'Butter Chicken',
    description:
      'Tender chicken simmered in a creamy, mildly spiced tomato and butter gravy. A North Indian favourite.',
    ingredients: [
      '500 g boneless chicken, cubed',
      '1 cup plain yogurt',
      '2 tbsp ginger-garlic paste',
      '1 tsp Kashmiri red chilli powder',
      '1 tsp garam masala',
      '3 tbsp butter',
      '3 ripe tomatoes, pureed',
      '1/2 cup fresh cream',
      '1 tsp kasuri methi (dried fenugreek leaves)',
      'Salt to taste',
    ],
    instructions:
      '1. Marinate the chicken in yogurt, half the ginger-garlic paste, chilli powder and salt for at least 30 minutes.\n2. Cook the chicken in a hot pan until lightly browned, then set aside.\n3. Melt the butter in a pan, add the remaining ginger-garlic paste and cook for a minute.\n4. Add the tomato puree and cook for 10 minutes until the oil separates.\n5. Add garam masala and the chicken, then simmer for 10 minutes.\n6. Stir in the cream and kasuri methi, cook for 2 more minutes and serve hot with naan or rice.',
  },
  {
    title: 'Paneer Tikka',
    description:
      'Cubes of paneer and vegetables marinated in spiced yogurt and grilled until lightly charred.',
    ingredients: [
      '250 g paneer, cubed',
      '1 capsicum, cubed',
      '1 onion, cut into chunks',
      '1/2 cup thick yogurt',
      '1 tbsp besan (gram flour)',
      '1 tsp ginger-garlic paste',
      '1 tsp chaat masala',
      '1 tsp red chilli powder',
      '1 tbsp oil',
      'Salt to taste',
    ],
    instructions:
      '1. Mix yogurt, besan, ginger-garlic paste, chilli powder, chaat masala, oil and salt into a thick marinade.\n2. Add the paneer, capsicum and onion and coat well. Rest for 30 minutes.\n3. Thread onto skewers, alternating paneer and vegetables.\n4. Grill or roast at 220 C for 12 to 15 minutes, turning once, until edges are charred.\n5. Sprinkle chaat masala and serve with mint chutney and lemon wedges.',
  },
  {
    title: 'Creamy Garlic Pasta',
    description:
      'A quick weeknight pasta in a silky garlic and cream sauce, ready in about 20 minutes.',
    ingredients: [
      '200 g penne or spaghetti',
      '4 garlic cloves, minced',
      '2 tbsp butter',
      '1 cup cream',
      '1/2 cup grated parmesan or mozzarella',
      '1 tsp dried oregano',
      '1/2 tsp chilli flakes',
      'Salt and black pepper to taste',
    ],
    instructions:
      '1. Boil the pasta in salted water until al dente. Save a cup of pasta water, then drain.\n2. Melt the butter in a pan and sauté the garlic for 30 seconds without browning.\n3. Pour in the cream and simmer gently for 3 minutes.\n4. Add the cheese, oregano, chilli flakes, salt and pepper and stir until smooth.\n5. Toss in the pasta, loosening the sauce with a splash of pasta water if needed. Serve immediately.',
  },
  {
    title: 'Fudgy Chocolate Brownies',
    description:
      'Dense, chewy brownies with a crackly top. Simple pantry ingredients and one bowl.',
    ingredients: [
      '120 g butter, melted',
      '1 cup sugar',
      '2 eggs',
      '1 tsp vanilla extract',
      '1/3 cup cocoa powder',
      '1/2 cup all-purpose flour',
      '1/4 tsp salt',
      '1/2 cup chocolate chips or chopped walnuts (optional)',
    ],
    instructions:
      '1. Preheat the oven to 175 C and line a small square tin with baking paper.\n2. Whisk the melted butter and sugar, then beat in the eggs and vanilla.\n3. Sift in the cocoa, flour and salt and fold until just combined.\n4. Fold in the chocolate chips or walnuts and pour into the tin.\n5. Bake for 22 to 25 minutes. A skewer should come out with a few moist crumbs.\n6. Cool completely before cutting into squares.',
  },
  {
    title: 'Masala Dosa',
    description:
      'Crispy rice and lentil crepes filled with a spiced potato masala, served with chutney and sambar.',
    ingredients: [
      '2 cups dosa batter (fermented)',
      '3 boiled potatoes, mashed',
      '1 onion, sliced',
      '1 tsp mustard seeds',
      '1 tsp curry leaves',
      '1/2 tsp turmeric',
      '2 green chillies, chopped',
      '2 tbsp oil or ghee',
      'Salt to taste',
    ],
    instructions:
      '1. Heat oil, add mustard seeds and curry leaves and let them splutter.\n2. Add the onion and green chillies and cook until soft.\n3. Add turmeric, mashed potato and salt, mix well and cook for 3 minutes. This is the filling.\n4. Heat a flat pan, spread a ladle of batter thinly in a circle and drizzle oil around it.\n5. Cook until golden and crisp, place the filling in the middle and fold.\n6. Serve hot with coconut chutney and sambar.',
  },
  {
    title: 'Vegetable Fried Rice',
    description:
      'Fluffy rice stir-fried with colourful vegetables and soy sauce. A good way to use leftover rice.',
    ingredients: [
      '2 cups cooked, cooled rice',
      '1 carrot, finely diced',
      '1/2 cup green peas',
      '1/2 cup chopped beans',
      '2 spring onions, chopped',
      '3 garlic cloves, minced',
      '2 tbsp soy sauce',
      '1 tsp vinegar',
      '1/2 tsp black pepper',
      '2 tbsp oil',
    ],
    instructions:
      '1. Heat oil in a wok on high heat and fry the garlic for 15 seconds.\n2. Add the carrot, beans and peas and stir-fry for 3 minutes so they stay crunchy.\n3. Add the rice and toss on high heat for 2 minutes.\n4. Add the soy sauce, vinegar and pepper and mix well.\n5. Finish with the spring onions and serve right away.',
  },
  {
    title: 'Chana Masala',
    description:
      'Hearty chickpeas cooked in a tangy, spiced onion-tomato gravy. Great with rice, roti or bhature.',
    ingredients: [
      '2 cups boiled chickpeas',
      '2 onions, finely chopped',
      '2 tomatoes, pureed',
      '1 tbsp ginger-garlic paste',
      '1 tbsp chana masala powder',
      '1 tsp cumin seeds',
      '1/2 tsp turmeric',
      '1 tsp coriander powder',
      '2 tbsp oil',
      'Fresh coriander and salt',
    ],
    instructions:
      '1. Heat oil and splutter the cumin seeds.\n2. Add the onions and cook until golden brown, then add the ginger-garlic paste.\n3. Add the tomato puree, turmeric, coriander powder and salt and cook until the oil separates.\n4. Add the chickpeas with a cup of water and the chana masala powder.\n5. Simmer for 15 minutes, lightly mashing a few chickpeas to thicken the gravy.\n6. Garnish with fresh coriander and serve.',
  },
  {
    title: 'Margherita Pizza',
    description:
      'Classic pizza with a simple tomato sauce, mozzarella and fresh basil on a thin crust.',
    ingredients: [
      '1 pizza base (store-bought or homemade)',
      '1/2 cup tomato sauce',
      '1 cup grated mozzarella',
      'A handful of fresh basil leaves',
      '1 tbsp olive oil',
      '1/2 tsp dried oregano',
      'Salt to taste',
    ],
    instructions:
      '1. Preheat the oven to its highest setting, around 240 C, with a baking tray inside.\n2. Spread the tomato sauce over the base, leaving a border for the crust.\n3. Scatter the mozzarella and sprinkle oregano and a pinch of salt.\n4. Slide onto the hot tray and bake for 8 to 10 minutes until the cheese bubbles and the crust browns.\n5. Top with fresh basil and a drizzle of olive oil before slicing.',
  },
  {
    title: 'Masala Chai',
    description:
      'Strong, aromatic Indian tea simmered with milk, ginger and whole spices.',
    ingredients: [
      '1 cup water',
      '1 cup milk',
      '2 tsp loose black tea leaves',
      '1 inch ginger, crushed',
      '2 green cardamom pods, crushed',
      '1 small cinnamon stick',
      '2 tsp sugar, or to taste',
    ],
    instructions:
      '1. Boil the water with the ginger, cardamom and cinnamon for 2 minutes.\n2. Add the tea leaves and simmer for 1 minute.\n3. Pour in the milk and sugar and bring to a boil, then lower the heat and simmer for 2 minutes.\n4. Strain into cups and serve hot.',
  },
  {
    title: 'Avocado Toast with Egg',
    description:
      'A quick, filling breakfast of smashed avocado on toasted bread, topped with a fried egg.',
    ingredients: [
      '2 slices of sourdough or whole wheat bread',
      '1 ripe avocado',
      '2 eggs',
      '1 tsp lemon juice',
      '1/2 tsp chilli flakes',
      '1 tsp olive oil or butter',
      'Salt and black pepper to taste',
    ],
    instructions:
      '1. Toast the bread until golden and crisp.\n2. Mash the avocado with lemon juice, salt and pepper.\n3. Fry the eggs in oil or butter to your liking.\n4. Spread the avocado on the toast, top each slice with an egg and sprinkle chilli flakes.\n5. Serve immediately.',
  },
];

const seed = async () => {
  try {
    await connectDB();

    const user = await User.findOne();
    if (!user) {
      console.log(
        'No users found. Sign up in the app first, then run "npm run seed" again.'
      );
      process.exit(1);
    }

    const titles = recipes.map((r) => r.title);
    const removed = await Recipe.deleteMany({ title: { $in: titles } });

    const docs = recipes.map((r) => ({ ...r, createdBy: user._id }));
    const inserted = await Recipe.insertMany(docs);

    console.log(
      `Done. Replaced ${removed.deletedCount} existing sample recipes, added ${inserted.length}.`
    );
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seed();