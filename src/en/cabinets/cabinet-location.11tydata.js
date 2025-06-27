module.exports = {
    eleventyComputed: {
      cityDisplayValue: (data) => {
        const lang = data.page && data.page.lang ? data.page.lang : 'fr'; // Fallback to 'fr' if lang not found
        const i18n = data.i18n;

        if (data.cabinet && data.cabinet.address_obj && data.cabinet.address_obj.city) {
          return data.cabinet.address_obj.city;
        }
        if (data.cabinet && data.cabinet.city) {
          return data.cabinet.city;
        }
        // Use i18n for fallback
        return i18n && i18n.video_consultation && i18n.video_consultation[lang] ? i18n.video_consultation[lang] : 'Video Consultation';
      },
      title: (data) => {
        const lang = data.page && data.page.lang ? data.page.lang : 'fr';
        const i18n = data.i18n;
        const cabinetName = data.cabinet && data.cabinet.name ? data.cabinet.name : (i18n.unknown[lang] || 'Unknown');
        const cityDisplay = data.cityDisplayValue; // Already computed, potentially localized

        const dietitianName = i18n.meta_dietitian && i18n.meta_dietitian[lang] ? i18n.meta_dietitian[lang] : "Dietitian";
        let titleTemplate = "Diaeta %s (%s) | %s Pierre Abou-Zeid"; // Default template
        if (i18n.cabinet_page_title_template && i18n.cabinet_page_title_template[lang]) {
            titleTemplate = i18n.cabinet_page_title_template[lang];
        }
        return titleTemplate.replace('%s', cityDisplay).replace('%s', cabinetName).replace('%s', dietitianName);
      },
      description: (data) => {
        const lang = data.page && data.page.lang ? data.page.lang : 'fr';
        const i18n = data.i18n;
        const cabinetName = data.cabinet && data.cabinet.name ? data.cabinet.name : (i18n.unknown[lang] || 'Unknown');
        const cityDisplay = data.cityDisplayValue; // Already computed
        const cabinetNotes = data.cabinet && data.cabinet.notes ? data.cabinet.notes : '';

        let descriptionTemplate = "Diaeta dietetic consultation in %s (%s) with Pierre Abou-Zeid. %s"; // Default template
        if (i18n.cabinet_page_description_template && i18n.cabinet_page_description_template[lang]) {
            descriptionTemplate = i18n.cabinet_page_description_template[lang];
        }
        return descriptionTemplate.replace('%s', cityDisplay).replace('%s', cabinetName).replace('%s', cabinetNotes);
      }
    }
  };