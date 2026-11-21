import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
export default function RtlHandler({ setting }) {
    const isArabic = setting?.storeLanguage === 'ar' || typeof window !== 'undefined' && (window.location.pathname.startsWith('/ar') || document.documentElement.lang === 'ar');
    useEffect(()=>{
        const dir = isArabic ? 'rtl' : 'ltr';
        const lang = isArabic ? 'ar' : 'en';
        document.documentElement.setAttribute('dir', dir);
        document.documentElement.setAttribute('lang', lang);
    }, [
        isArabic
    ]);
    return null;
}
RtlHandler.propTypes = {
    setting: PropTypes.shape({
        storeLanguage: PropTypes.string
    })
};
export const layout = {
    areaId: 'body',
    sortOrder: 1
};
export const query = `
  query Query {
    setting {
      storeLanguage
    }
  }
`;
