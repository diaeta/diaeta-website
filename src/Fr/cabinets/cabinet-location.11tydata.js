module.exports = {
    eleventyComputed: {
      cityDisplayValue: (data) => {
        if (data.cabinet && data.cabinet.address_obj && data.cabinet.address_obj.city) {
          return data.cabinet.address_obj.city;
        }
        if (data.cabinet && data.cabinet.city) {
          return data.cabinet.city;
        }
        return 'Vidéo Consultation';
      },
      title: (data) => {
        // Ensure cabinet object and name exist to prevent errors during computation if data is unexpected
        const cabinetName = data.cabinet && data.cabinet.name ? data.cabinet.name : 'Inconnu';
        return `Diaeta ${data.cityDisplayValue} (${cabinetName}) | Diététicien Pierre Abou-Zeid`;
      },
      description: (data) => {
        const cabinetName = data.cabinet && data.cabinet.name ? data.cabinet.name : 'Inconnu';
        const cabinetNotes = data.cabinet && data.cabinet.notes ? data.cabinet.notes : '';
        return `Consultation diététique Diaeta à ${data.cityDisplayValue} (${cabinetName}) avec Pierre Abou-Zeid. ${cabinetNotes}`;
      }
    }
  };
  