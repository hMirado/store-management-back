export const generateId = () => {
  const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for ( let i = 0; i < 12; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export const generateUniqueId = () => {
  let result = "";
  for (let i = 0; i < 3; i++) {
    result += String.fromCharCode(97 + Math.floor(Math.random() * 26)).toLocaleUpperCase();
  }
  result += "-" + Math.floor(Math.random() * 1000000000000);
  return result;
}