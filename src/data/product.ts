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
  shopperNotes: ["Free shipping above ₹999", "Cash on Delivery", "Delivery all across India"],
  socials: {
    facebook: "https://www.facebook.com/jewarorganic/",
    instagram: "https://www.instagram.com/jewarorganics/",
  },
} as const;
