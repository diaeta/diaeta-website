module.exports = {
  eleventyComputed: {
    // New computed property to determine the display city
    // This centralizes the logic and makes the template cleaner.
    displayCity: (data) => {
      if (data.cabinet && data.cabinet.address_obj && data.cabinet.address_obj.city) {
        return data.cabinet.address_obj.city;
      }
      if (data.cabinet && data.cabinet.city) {
        return data.cabinet.city;
      }
      return 'Vidéo Consultation';
    },

    // The 'title' and 'description' properties are now simplified to use 'displayCity'.
    title: (data) => {
      const cabinetName = data.cabinet && data.cabinet.name ? data.cabinet.name : 'Inconnu';
      // Use the already computed 'displayCity'
      return `Diaeta ${data.displayCity} (${cabinetName}) | Diététicien Pierre Abou-Zeid`;
    },

    description: (data) => {
      const cabinetName = data.cabinet && data.cabinet.name ? data.cabinet.name : 'Inconnu';
      const cabinetNotes = data.cabinet && data.cabinet.notes ? data.cabinet.notes : '';
      // Use the already computed 'displayCity'
      return `Consultation diététique Diaeta à ${data.displayCity} (${cabinetName}) avec Pierre Abou-Zeid. ${cabinetNotes}`;
    }
  }
};