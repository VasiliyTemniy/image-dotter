/**
 * Swaps image urls based on language and theme
 *
 * Attention! Uses a lot of hardcore hardcoded image urls
 *
 * Is ugly and could be a lot more smart, but gets the job of giving that nice feel and touch done
 * @param {string} markdownText
 * @param {'en' | 'ru'} language
 * @param {'light' | 'dark'} theme
 * @returns {string}
 */
export const swapImageUrls = (markdownText, language, theme) => {
  let _markdownText = markdownText;
  if (language === 'en' && theme === 'dark') {
    return _markdownText;
  }

  if (language === 'en' && theme === 'light') {
    _markdownText = _markdownText.replace('https://i.imghippo.com/files/CX5901RbA.png', 'https://i.imghippo.com/files/C9755V.png');
    console.log('markdown text', markdownText);
    return _markdownText;
  }

  if (language === 'ru' && theme === 'dark') {
    return _markdownText;
  }

  if (language === 'ru' && theme === 'light') {
    _markdownText = _markdownText.replace('https://i.imghippo.com/files/yrS3984YI.png', 'https://i.imghippo.com/files/noX7694wiw.png');
    return _markdownText;
  }
};