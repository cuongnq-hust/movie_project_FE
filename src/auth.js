export const authHeader = () => {
  let authorization = 'Bearer';
  const accessToken = localStorage.getItem("access_token")
  if (accessToken) {
    authorization = `Bearer ${accessToken}`
  }
  return { Authorization: authorization }
}
