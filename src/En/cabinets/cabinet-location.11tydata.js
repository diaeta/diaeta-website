// src/En/cabinets/cabinet-location.11tydata.js
module.exports = {
  eleventyComputed: {
    // Get the correct cabinet data based on language for specific fields
    // This assumes 'cabinet' is the object passed by pagination (potentially from the French data source)
    // and we override specific text fields if lang is 'en' and a match is found in cabinets_en.
    name: (data) => {
      if (data.lang === 'en' && data.cabinets_en && data.cabinet && data.cabinet.id) {
        const enCabinet = data.cabinets_en.find(c => c.id === data.cabinet.id);
        if (enCabinet && enCabinet.name) return enCabinet.name;
      }
      return data.cabinet ? data.cabinet.name : (data.lang === 'en' ? 'Unknown' : 'Inconnu');
    },
    fullAddress: (data) => {
      if (data.lang === 'en' && data.cabinets_en && data.cabinet && data.cabinet.id) {
        const enCabinet = data.cabinets_en.find(c => c.id === data.cabinet.id);
        // For fullAddress, we need to be careful if only "Bruxelles" vs "Brussels" changes
        // The user confirmed "Brussels" should be used. cabinets_en.json has this.
        if (enCabinet && enCabinet.fullAddress) return enCabinet.fullAddress;
      }
      return data.cabinet ? data.cabinet.fullAddress : '';
    },
    notes: (data) => {
      if (data.lang === 'en' && data.cabinets_en && data.cabinet && data.cabinet.id) {
        const enCabinet = data.cabinets_en.find(c => c.id === data.cabinet.id);
        if (enCabinet && typeof enCabinet.notes !== 'undefined') return enCabinet.notes; // Check for undefined if notes can be null
      }
      return data.cabinet ? data.cabinet.notes : '';
    },
    hours_details_note: (data) => {
      if (data.lang === 'en' && data.cabinets_en && data.cabinet && data.cabinet.id) {
        const enCabinet = data.cabinets_en.find(c => c.id === data.cabinet.id);
        if (enCabinet && typeof enCabinet.hours_details_note !== 'undefined') return enCabinet.hours_details_note;
      }
      return data.cabinet ? data.cabinet.hours_details_note : '';
    },
    // opening_hours are assumed to be structurally the same; the .njk template uses dayOfWeekENGLISH
    // which is present in cabinets_en.json. If the structure itself needed to change,
    // we'd need to override the whole opening_hours object.

    displayCity: (data) => {
      const id = data.cabinet ? data.cabinet.id : null;
      let currentCabinetData = data.cabinet;
      if (data.lang === 'en' && data.cabinets_en && id) {
        const enCabinet = data.cabinets_en.find(c => c.id === id);
        if (enCabinet) currentCabinetData = enCabinet;
      }

      if (currentCabinetData && currentCabinetData.address_obj && currentCabinetData.address_obj.city) {
        return currentCabinetData.address_obj.city;
      }
      if (currentCabinetData && currentCabinetData.city) { // Fallback if address_obj is not there
        return currentCabinetData.city;
      }
      return data.lang === 'en' ? 'Video Consultation' : 'Vidéo Consultation';
    },
    title: (data) => {
      // Uses the 'name' and 'displayCity' computed above which are now language-aware
      const cabinetName = data.name; // This will be the English name if lang='en'
      const dietitianName = data.lang === 'en' ? 'Dietitian Pierre Abou-Zeid' : 'Diététicien Pierre Abou-Zeid';
      return `Diaeta ${data.displayCity} (${cabinetName}) | ${dietitianName}`;
    },
    description: (data) => {
      const cabinetName = data.name; // English name if lang='en'
      const cabinetNotes = data.notes; // English notes if lang='en'
      const dietitianName = data.lang === 'en' ? 'Dietitian Pierre Abou-Zeid' : 'Diététicien Pierre Abou-Zeid';
      if (data.lang === 'en') {
        return `Diaeta nutrition consultation in ${data.displayCity} (${cabinetName}) with ${dietitianName}. ${cabinetNotes}`;
      } else {
        // Fallback to French if needed (though this file is in /En path)
        return `Consultation diététique Diaeta à ${data.displayCity} (${cabinetName}) avec ${dietitianName}. ${cabinetNotes}`;
      }
    }
  }
};
