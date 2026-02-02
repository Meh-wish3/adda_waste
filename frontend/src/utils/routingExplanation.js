const routingExplanation = `
1. Start from the ward office side and follow a fixed loop of areas:
   Bhetapara → Bhangagarh → GS Road → Beltola.
2. For each area, batch all citizen pickup requests for this shift so the
   collector clears one cluster before moving to the next.
3. Within each area, sort by citizen's preferred pickup time so early
   time-slots are honoured first.
4. Overflow flags are surfaced visually as priority stops but still keep
   the same area-wise ordering for simplicity and explainability.
`;

export default routingExplanation;

