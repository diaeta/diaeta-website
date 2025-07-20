module.exports = {
  layout: "layouts/base.njk",
  lang: "fr",
  title: "Cabinet | Diaeta Bruxelles",
  description: "Trouvez le cabinet Diaeta à Bruxelles et prenez rendez-vous avec le diététicien Pierre Abou-Zeid.",
  pagination: {
    data: "cabinets",
    size: 1,
    alias: "cabinet",
    filter: ["video"]
  },
  permalink: "/fr/cabinets/{{ cabinet.id | slugify }}/index.html"
};