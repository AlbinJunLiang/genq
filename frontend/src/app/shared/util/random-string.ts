export const generateRandomString = (length: number = 10): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
};

export const getRandomInt = (min: number = 0, max: number = 1000): number => {
min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}