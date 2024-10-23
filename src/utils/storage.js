export const setLocalStorageMap = (key, objMap) => {
  const json = JSON.stringify(objMap);
  localStorage.setItem(key, json);
};

export const getLocalStorageMap = (key, defaultValueMap) => {
  const storageContents = localStorage.getItem(key);
  if (!storageContents) {
    return defaultValueMap;
  }

  try {
    const json = JSON.parse(storageContents);
    return { ...defaultValueMap, ...json };
  } catch (error) {
    console.error(error);
    return defaultValueMap;
  }
};