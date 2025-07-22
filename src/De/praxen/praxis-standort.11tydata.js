module.exports = {
  eleventyComputed: {
    title: (data) => `${data.clinic.name} - Diaeta Ernährungsberatung | ${data.clinic.city}`,
    description: (data) => `Vereinbaren Sie einen Termin mit Pierre Abou-Zeid in der Praxis ${data.clinic.name} in ${data.clinic.city}. Professionelle Ernährungsberatung und personalisierte Behandlung.`,
    canonicalUrl: (data) => `https://diaeta.be/de/praxis/${data.clinic.id}/`
  }
};
