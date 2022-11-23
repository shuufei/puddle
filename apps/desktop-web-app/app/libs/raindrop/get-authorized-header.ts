export const getAuthorizedHeader = async (accessToken: string) => {
  const header = new Headers();
  header.append('Authorization', `Bearer ${accessToken}`);
  return header;
};
