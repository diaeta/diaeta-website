// src/De/praxen/praxis-standort.11tydata.js
module.exports = {
  eleventyComputed: {
    // Get the correct cabinet data based on language for specific fields
    name: (data) => {
      if (data.lang === 'de' && data.cabinets_de && data.cabinet && data.cabinet.id) {
        const deCabinet = data.cabinets_de.find(c => c.id === data.cabinet.id);
        if (deCabinet && deCabinet.name) return deCabinet.name;
      }
      return data.cabinet ? data.cabinet.name : (data.lang === 'de' ? 'Unbekannt' : 'Inconnu');
    },
    fullAddress: (data) => {
      if (data.lang === 'de' && data.cabinets_de && data.cabinet && data.cabinet.id) {
        const deCabinet = data.cabinets_de.find(c => c.id === data.cabinet.id);
        if (deCabinet && deCabinet.fullAddress) return deCabinet.fullAddress;
      }
      return data.cabinet ? data.cabinet.fullAddress : '';
    },
    notes: (data) => {
      if (data.lang === 'de' && data.cabinets_de && data.cabinet && data.cabinet.id) {
        const deCabinet = data.cabinets_de.find(c => c.id === data.cabinet.id);
        if (deCabinet && typeof deCabinet.notes !== 'undefined') return deCabinet.notes;
      }
      return data.cabinet ? data.cabinet.notes : '';
    },
    hours_details_note: (data) => {
      if (data.lang === 'de' && data.cabinets_de && data.cabinet && data.cabinet.id) {
        const deCabinet = data.cabinets_de.find(c => c.id === data.cabinet.id);
        if (deCabinet && typeof deCabinet.hours_details_note !== 'undefined') return deCabinet.hours_details_note;
      }
      return data.cabinet ? data.cabinet.hours_details_note : '';
    },

    displayCity: (data) => {
      const id = data.cabinet ? data.cabinet.id : null;
      let currentCabinetData = data.cabinet;
      if (data.lang === 'de' && data.cabinets_de && id) {
        const deCabinet = data.cabinets_de.find(c => c.id === id);
        if (deCabinet) currentCabinetData = deCabinet;
      }

      if (currentCabinetData && currentCabinetData.address_obj && currentCabinetData.address_obj.city) {
        return currentCabinetData.address_obj.city;
      }
      if (currentCabinetData && currentCabinetData.city) {
        return currentCabinetData.city;
      }
      return data.lang === 'de' ? 'Online-Beratung' : 'Vidéo Consultation';
    },
    title: (data) => {
      const cabinetName = data.name;
      const dietitianName = data.lang === 'de' ? 'Ernährungsberater Pierre Abou-Zeid' : 'Diététicien Pierre Abou-Zeid';
      return `Diaeta ${data.displayCity} (${cabinetName}) | ${dietitianName}`;
    },
    description: (data) => {
      const cabinetName = data.name;
      const cabinetNotes = data.notes;
      const dietitianName = data.lang === 'de' ? 'Ernährungsberater Pierre Abou-Zeid' : 'Diététicien Pierre Abou-Zeid';
      if (data.lang === 'de') {
        return `Diaeta Ernährungsberatung in ${data.displayCity} (${cabinetName}) mit ${dietitianName}. ${cabinetNotes}`;
      } else {
        return `Consultation diététique Diaeta à ${data.displayCity} (${cabinetName}) avec ${dietitianName}. ${cabinetNotes}`;
      }
    }
  }
};
