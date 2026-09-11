# My Weekly Plate

Build a clean, modern, responsive web app for personal/home use called Weekly Food Planner.

The purpose of the app is to help me plan meals for a week and automatically generate ONE consolidated grocery shopping list from all meals.

Core concept

The user plans meals for a week. Each meal has a list of ingredients with quantities and units.

The app must calculate the total amount of every ingredient required for the entire week.

For example:

Meal 1: Pasta Carbonara

Pasta: 1 kg

Eggs: 3 pcs

Parmesan: 150 g

Meal 2: Pasta Bolognese

Pasta: 0.5 kg

Minced beef: 500 g

Tomato sauce: 400 g

The shopping list must show:

Pasta — 1.5 kg

Eggs — 3 pcs

Parmesan — 150 g

Minced beef — 500 g

Tomato sauce — 400 g

Do NOT display pasta separately under each meal. Ingredients with the same ingredient identity must always be consolidated.



Main screens

1. Weekly Planner

The home screen should show the current week.

Display Monday through Sunday as cards/columns.

For each day I should be able to:

Add a meal

Select an existing saved meal

Create a new meal

Remove a meal

Change the number of servings

Example:

Monday

Chicken Curry

Rice

Tuesday

Carbonara

Wednesday

Chicken Curry

etc.

There should be a prominent button:

Generate Shopping List

Also allow navigating to previous/next week.



2. Meal Library

Create a reusable library of meals.

Each meal should contain:

Meal name

Optional photo

Default number of servings

Ingredients

Ingredient quantity

Unit

Ingredient category

Example:

Chicken Curry
Servings: 4

Chicken breast — 600 g — Meat

Rice — 300 g — Dry Goods

Onion — 2 pcs — Vegetables

Coconut milk — 400 ml — Canned

Curry powder — 15 g — Spices

Allow:

Create meal

Edit meal

Delete meal

Duplicate meal

Search meals

When adding a meal to a day, allow changing the servings for that particular occurrence without changing the saved default recipe.



3. Shopping List

Generate one consolidated shopping list from all meals planned for the selected week.

Ingredients must be aggregated intelligently.

For example:

Monday:
Pasta — 500 g

Tuesday:
Pasta — 1 kg

Thursday:
Pasta — 500 g

Shopping list:

Pasta — 2 kg

Do not show three separate pasta entries.

Group the shopping list by category:

🥩 Meat & Fish
🥬 Vegetables & Fruit
🥛 Dairy & Eggs
🍞 Bakery
🍝 Dry Goods
🥫 Canned & Sauces
🧂 Spices & Seasonings
🧊 Frozen
🥤 Drinks
📦 Other

Each shopping-list item should have:

Checkbox

Ingredient name

Total quantity

Unit

Category

Checked items should visually become completed/crossed out.

Add:

“Uncheck all”

“Clear completed”

“Copy shopping list”



Ingredient aggregation rules

This is very important.

Ingredients should have a normalized identity so that variations such as:

“pasta”
“Pasta”
“ pasta “

are treated as the same ingredient.

However, different units should be handled intelligently.

Examples:

500 g + 1 kg = 1.5 kg

250 ml + 500 ml = 750 ml

2 pcs + 3 pcs = 5 pcs

If the same ingredient uses compatible units, convert them automatically.

For example:
1000 g = 1 kg
1000 ml = 1 L

If units cannot safely be combined, keep them separate rather than producing an incorrect calculation.

Example:
1 kg pasta + 1 package pasta

should NOT automatically become 1.XX kg.

The user should be able to manually edit the final shopping quantity.



Servings calculation

If a saved meal has a default recipe for 4 servings:

Chicken — 600 g

and I add it to a day for 8 servings, automatically calculate:

Chicken — 1200 g

If the same meal is used multiple times during the week, each occurrence should be calculated according to its own serving count and then consolidated.



Shopping list adjustments

The generated shopping list should be editable.

For example, if the app calculates:

Milk — 1.7 L

I should be able to manually change it to:

Milk — 2 L

because I may need to buy a 2 L bottle.

This manual adjustment should not modify the original recipes.



Data persistence

This is a personal home-use application.

For the initial version, prioritize simplicity.

Use local persistent storage so the application remembers:

Meals

Ingredients

Weekly plans

Shopping lists

Shopping-list completion state

The application should continue working after refreshing the browser.

Do NOT require authentication for the initial version.

Do NOT build unnecessary backend infrastructure unless it is genuinely required.



UI / UX

Make the UI modern, clean and pleasant to use.

It should feel like a polished personal household application rather than an enterprise dashboard.

Use:

Rounded cards

Clear typography

Subtle animations

Large touch-friendly buttons

Mobile-first responsive design

Desktop layout when used on a laptop

The shopping list should be especially easy to use on a phone while walking through a supermarket.

Use a bottom navigation on mobile:

Planner | Meals | Shopping

On desktop, use a sidebar or top navigation.



Important architecture requirement

Keep the application modular.

Separate:

Meal/recipe data

Weekly meal-plan data

Ingredient normalization

Ingredient aggregation

Shopping-list generation

The shopping list should be generated from the weekly plan rather than manually maintained as an unrelated list.

Do not hard-code example meals into the application logic. Example data can be provided as seed/demo data only.



Future-ready features

Structure the code so these features can be added later, but DO NOT implement them yet:

Household members

Shared shopping list

Cloud synchronization

User accounts

AI meal suggestions

AI ingredient extraction from recipes

Budget/price tracking

Supermarket-specific shopping lists

Recurring meals

Pantry/inventory tracking

“Already have this at home” functionality

For now, focus on making the core weekly-planning → ingredient aggregation → shopping-list workflow excellent.



Initial demo data

Create a few realistic demo meals so the UI is immediately usable:

Spaghetti Carbonara

Chicken Curry

Chicken Tacos

Beef Bolognese

Greek Salad

Make sure some meals intentionally share ingredients such as pasta, onion, tomato, chicken, cheese, etc., so the ingredient aggregation functionality can be demonstrated.

The app should launch directly into the Weekly Planner with the demo week visible.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c7e01fe4-e079-4cff-85ce-987b12e3523b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
