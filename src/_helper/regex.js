export const validGST = new RegExp(
  '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'
);
export const validMobile = new RegExp(
  '/^\d*[.]?\d*$/'
);
export const validEmail = new RegExp(
  '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
);