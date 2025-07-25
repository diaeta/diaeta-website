module.exports = {
  eleventyComputed: {
    title: (data) => `${data.clinic.name} - استشارة التغذية دياتا | ${data.clinic.city}`,
    description: (data) => `احجز موعداً مع بيار أبو زيد في عيادة ${data.clinic.name} في ${data.clinic.city}. استشارة تغذية مهنية وعلاج شخصي.`,
    canonicalUrl: (data) => `https://diaeta.be/ar/عيادة/${data.clinic.id}/`
  }
};
