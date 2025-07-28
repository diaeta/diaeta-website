// src/Ar/عيادات/موقع-العيادة.11tydata.js
module.exports = {
  eleventyComputed: {
    // Get the correct cabinet data based on language for specific fields
    name: (data) => {
      if (data.lang === 'ar' && data.cabinets_ar && data.cabinet && data.cabinet.id) {
        const arCabinet = data.cabinets_ar.find(c => c.id === data.cabinet.id);
        if (arCabinet && arCabinet.name) return arCabinet.name;
      }
      return data.cabinet ? data.cabinet.name : (data.lang === 'ar' ? 'غير معروف' : 'Inconnu');
    },
    fullAddress: (data) => {
      if (data.lang === 'ar' && data.cabinets_ar && data.cabinet && data.cabinet.id) {
        const arCabinet = data.cabinets_ar.find(c => c.id === data.cabinet.id);
        if (arCabinet && arCabinet.fullAddress) return arCabinet.fullAddress;
      }
      return data.cabinet ? data.cabinet.fullAddress : '';
    },
    notes: (data) => {
      if (data.lang === 'ar' && data.cabinets_ar && data.cabinet && data.cabinet.id) {
        const arCabinet = data.cabinets_ar.find(c => c.id === data.cabinet.id);
        if (arCabinet && typeof arCabinet.notes !== 'undefined') return arCabinet.notes;
      }
      return data.cabinet ? data.cabinet.notes : '';
    },
    hours_details_note: (data) => {
      if (data.lang === 'ar' && data.cabinets_ar && data.cabinet && data.cabinet.id) {
        const arCabinet = data.cabinets_ar.find(c => c.id === data.cabinet.id);
        if (arCabinet && typeof arCabinet.hours_details_note !== 'undefined') return arCabinet.hours_details_note;
      }
      return data.cabinet ? data.cabinet.hours_details_note : '';
    },

    displayCity: (data) => {
      const id = data.cabinet ? data.cabinet.id : null;
      let currentCabinetData = data.cabinet;
      if (data.lang === 'ar' && data.cabinets_ar && id) {
        const arCabinet = data.cabinets_ar.find(c => c.id === id);
        if (arCabinet) currentCabinetData = arCabinet;
      }

      if (currentCabinetData && currentCabinetData.address_obj && currentCabinetData.address_obj.city) {
        return currentCabinetData.address_obj.city;
      }
      if (currentCabinetData && currentCabinetData.city) {
        return currentCabinetData.city;
      }
      return data.lang === 'ar' ? 'استشارة عبر الإنترنت' : 'Vidéo Consultation';
    },
    title: (data) => {
      const cabinetName = data.name;
      const dietitianName = data.lang === 'ar' ? 'أخصائي تغذية بيار أبو زيد' : 'Diététicien Pierre Abou-Zeid';
      return `دايتا ${data.displayCity} (${cabinetName}) | ${dietitianName}`;
    },
    description: (data) => {
      const cabinetName = data.name;
      const cabinetNotes = data.notes;
      const dietitianName = data.lang === 'ar' ? 'أخصائي تغذية بيار أبو زيد' : 'Diététicien Pierre Abou-Zeid';
      if (data.lang === 'ar') {
        return `استشارة تغذية دايتا في ${data.displayCity} (${cabinetName}) مع ${dietitianName}. ${cabinetNotes}`;
      } else {
        return `Consultation diététique Diaeta à ${data.displayCity} (${cabinetName}) avec ${dietitianName}. ${cabinetNotes}`;
      }
    }
  }
};
