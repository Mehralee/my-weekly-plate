# Complete the Weekly Food Planner

## Build
- Replace the placeholder home screen with a seven-day weekly planner showing the current demo week.
- Add week navigation, today reset, meal selection per day, removal, and per-occurrence serving controls.
- Add a prominent action that opens the consolidated shopping list.
- Create the meal library with search, recipe summaries, and create, edit, duplicate, and delete actions.
- Create the shopping list grouped by grocery category with check-off, quantity adjustment, reset, copy, uncheck-all, and clear-completed actions.
- Wrap all screens in the shared Bauhaus-style shell and local saved-data provider.
- Add unique page titles and sharing descriptions for Planner, Meals, and Shopping.

## Validation
- Open the demo week and add a meal to a day.
- Change that occurrence's serving count and confirm its saved recipe remains unchanged.
- Open the shopping list and confirm shared ingredients appear once with combined, scaled quantities.
- Check an item, adjust and reset a quantity, copy the list, and clear completed items.
- Verify navigation and layouts at desktop and narrow mobile sizes.

## Technical details
- Keep all data stored locally in the browser through the existing food store.
- Use TanStack Router links for `/`, `/meals`, and `/shopping`.
- Reuse the existing unit conversion and ingredient aggregation logic.
