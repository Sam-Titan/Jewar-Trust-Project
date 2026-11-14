// All product text lives here. Unconfirmed values are marked TO CONFIRM and must not be shown as fact.
export const product = {
  name: "Everyday Basmati Rice",
  tag: "Aromatic | Everyday Value",
  brandLine: "We Are Farmers, Growing Honest Food With Love & Care",
  origin: null, // TO CONFIRM
  shelfLife: null, // TO CONFIRM
  familyLine: "Handpicked by each member of our family for yours.",
  // Scroll story (SPEC § 5). Short lines only, nothing beyond the pack.
  properties: [
    { title: "Long grain", line: "Slender, long basmati grains." },
    { title: "Full aroma", line: "The classic basmati fragrance." },
    { title: "EU-standard residue controls", line: "Held to EU limits." },
    { title: "Tested for 900+ pesticides", line: "See the badge on the pack.", badge: true },
    {
      title: "Handpicked by our family",
      line: "Handpicked by each member of our family for yours.",
    },
  ],
  shopperNotes: [
    "Free shipping above ₹999",
    "Cash on Delivery",
    "Delivery all across India",
    "Taxes included",
  ],
  // Product card (SPEC § 6).
  rating: { value: 5.0, count: 5 },
  description:
    "Long grain, full aroma. Held to EU-standard residue controls, tested for 900+ pesticides, and handpicked by each member of our family for yours.",
  grain: "Long",
  sizes: [
    { id: "1kg", label: "1 kg", netWeight: "1 kg", price: 160, mrp: 224, off: 28 },
    // PLACEHOLDER: not a real price. Replace when the client confirms (D-021).
    {
      id: "5kg",
      label: "5 kg",
      netWeight: "5 kg",
      price: 780,
      mrp: 1120,
      off: 30,
      placeholder: true,
    },
  ],
  cooking: null, // TO CONFIRM (rinse, soak, cook, rest) — hidden until confirmed
  socials: {
    facebook: "https://www.facebook.com/jewarorganic/",
    instagram: "https://www.instagram.com/jewarorganics/",
  },
} as const;
